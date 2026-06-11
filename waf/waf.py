#!/usr/bin/env python3
"""
=============================================================
  Custom WAF - Phase 3 | ENSAM WAF Project
  Author  : [Your Name]
  Course  : Cybersecurity - Pr. Mouaad Mohy-eddine
  Desc    : Hand-built reverse proxy WAF in Python.
            Inspects HTTP URI, Headers, and POST body.
            Blocks SQLi and XSS payloads with regex rules.
            Protects against Brute Force on login endpoints.
            Protects against CSRF via Double Submit Cookie.
            Returns 403 + custom block page on detection.
            Logs every blocked request to waf.log.
=============================================================
"""

import os
import re
import logging
import datetime
import secrets
from urllib.parse import unquote_plus
from flask import Flask, request, Response
import requests
from requests.exceptions import ConnectionError, Timeout

# =============================================================
#  CONFIGURATION
# =============================================================
TARGET_HOST  = os.environ.get("TARGET_HOST",  "http://localhost:5000")
LISTEN_PORT  = int(os.environ.get("LISTEN_PORT", 8888))
LOG_FILE     = os.environ.get("LOG_FILE",     os.path.join(os.path.dirname(os.path.abspath(__file__)), "waf.log"))

# =============================================================
#  LOGGING SETUP
# =============================================================
os.makedirs(os.path.dirname(LOG_FILE), exist_ok=True)

logging.basicConfig(
    filename=LOG_FILE,
    level=logging.WARNING,
    format="%(message)s",
)

console = logging.StreamHandler()
console.setLevel(logging.INFO)
logging.getLogger().addHandler(console)

# =============================================================
#  IN-MEMORY SECURITY STATE
# =============================================================
# Track login attempts: client_ip -> list of timestamps
LOGIN_ATTEMPTS = {}

# =============================================================
#  DETECTION RULES
# =============================================================
RULES = [
    # ---- SQL Injection ----
    (
        "SQLi-001",
        "SQL OR/AND bypass",
        re.compile(r"(\bor\b\s*[\d'\"]+\s*=\s*[\d'\"]+|'\s*(or|and)\s*'[^']*'\s*=\s*'|\bor\b\s+\d+\s*=\s*\d+)", re.IGNORECASE),
    ),
    (
        "SQLi-002",
        "SQL UNION SELECT",
        re.compile(r"union\s+select", re.IGNORECASE),
    ),
    (
        "SQLi-003",
        "SQL comment injection",
        re.compile(r"(--|\bor\b\s+true|#\b|\s/\*)", re.IGNORECASE),
    ),
    (
        "SQLi-004",
        "SQL DROP/INSERT/UPDATE/DELETE",
        re.compile(r"\b(drop|insert|update|delete|truncate|alter)\b\s+\w+", re.IGNORECASE),
    ),
    (
        "SQLi-005",
        "SQL boolean blind",
        re.compile(r"'\s*(and|or)\s+\d+\s*=\s*\d+", re.IGNORECASE),
    ),
    (
        "SQLi-006",
        "SQL time-based blind",
        re.compile(r"\b(sleep|benchmark|waitfor\s+delay)\s*\(", re.IGNORECASE),
    ),
    # ---- Cross-Site Scripting ----
    (
        "XSS-001",
        "XSS script tag",
        re.compile(r"<\s*script[\s>]", re.IGNORECASE),
    ),
    (
        "XSS-002",
        "XSS event handler",
        re.compile(r"\bon\w+\s*=", re.IGNORECASE),
    ),
    (
        "XSS-003",
        "XSS javascript URI",
        re.compile(r"javascript\s*:", re.IGNORECASE),
    ),
    (
        "XSS-004",
        "XSS SVG/IMG injection",
        re.compile(r"<\s*(svg|img|iframe|object|embed|link)[^>]*(onload|onerror|src)\s*=", re.IGNORECASE),
    ),
    (
        "XSS-005",
        "XSS data URI",
        re.compile(r"data\s*:\s*text/html", re.IGNORECASE),
    ),
]

# =============================================================
#  BLOCK PAGE
# =============================================================
BLOCK_PAGE_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "block_page.html")

def load_block_page(rule_id, rule_name, payload, client_ip):
    try:
        with open(BLOCK_PAGE_PATH, "r", encoding="utf-8") as f:
            html = f.read()
        safe_payload = (payload[:120] + "...") if len(payload) > 120 else payload
        safe_payload = safe_payload.replace("&","&amp;").replace("<","&lt;").replace(">","&gt;")
        html = html.replace("{{RULE_ID}}",    rule_id)
        html = html.replace("{{RULE_NAME}}",  rule_name)
        html = html.replace("{{PAYLOAD}}",    safe_payload)
        html = html.replace("{{CLIENT_IP}}",  client_ip)
        html = html.replace("{{TIMESTAMP}}",  datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S UTC"))
        return html
    except FileNotFoundError:
        return f"""<!DOCTYPE html><html><head><title>403 Blocked</title></head>
<body style="background:#0f1117;color:#ef4444;font-family:monospace;text-align:center;padding:4rem">
<h1>403 Blocked by Custom WAF</h1>
<p>Rule: {rule_id} - {rule_name} | IP: {client_ip}</p>
</body></html>"""

# =============================================================
#  INSPECTION ENGINE
# =============================================================
def inspect(target):
    for rule_id, rule_name, pattern in RULES:
        match = pattern.search(target)
        if match:
            return True, rule_id, rule_name, match.group(0)
    return False, "", "", ""


def inspect_request(req):
    # 1. URI + query string
    decoded_url = unquote_plus(req.full_path)
    hit, rid, rname, payload = inspect(decoded_url)
    if hit:
        return True, rid, rname, f"URI: {payload}"

    # 2. Suspicious headers
    for header in ["User-Agent", "Referer", "X-Forwarded-For"]:
        value = unquote_plus(req.headers.get(header, ""))
        if value:
            hit, rid, rname, payload = inspect(value)
            if hit:
                return True, rid, rname, f"Header[{header}]: {payload}"

    # 3. POST body
    if req.method == "POST":
        for key, value in req.form.items():
            hit, rid, rname, payload = inspect(unquote_plus(value))
            if hit:
                return True, rid, rname, f"POST[{key}]: {payload}"
            hit, rid, rname, payload = inspect(unquote_plus(key))
            if hit:
                return True, rid, rname, f"POST key: {payload}"
        raw = req.get_data(as_text=True)
        if raw:
            hit, rid, rname, payload = inspect(unquote_plus(raw))
            if hit:
                return True, rid, rname, f"POST body: {payload}"

    return False, "", "", ""

# =============================================================
#  BRUTE FORCE AND CSRF ENGINE
# =============================================================
def check_brute_force(client_ip, path):
    """
    Checks if there are more than 5 attempts within 60 seconds to login.
    """
    if "/api/auth/login" not in path:
        return False

    now = datetime.datetime.utcnow().timestamp()
    if client_ip not in LOGIN_ATTEMPTS:
        LOGIN_ATTEMPTS[client_ip] = []

    # Clean attempts older than 60 seconds
    LOGIN_ATTEMPTS[client_ip] = [t for t in LOGIN_ATTEMPTS[client_ip] if now - t < 60]
    
    # Track current attempt
    LOGIN_ATTEMPTS[client_ip].append(now)

    if len(LOGIN_ATTEMPTS[client_ip]) > 5:
        return True
    return False


def verify_csrf(req):
    """
    Verifies that state-changing requests have matching CSRF cookie and header.
    """
    if req.method not in ["POST", "PUT", "DELETE", "PATCH"]:
        return True
    
    csrf_cookie = req.cookies.get("csrf_token")
    csrf_header = req.headers.get("X-CSRF-Token")

    if not csrf_cookie or not csrf_header or csrf_cookie != csrf_header:
        return False
    return True

# =============================================================
#  LOGGING
# =============================================================
def log_blocked(client_ip, rule_id, rule_name, payload, path):
    timestamp = datetime.datetime.utcnow().strftime("%Y-%m-%d %H:%M:%S")
    entry = (
        f"[{timestamp}] | BLOCKED "
        f"| IP={client_ip} "
        f"| Rule={rule_id} ({rule_name}) "
        f"| Path={path} "
        f"| Payload={payload}"
    )
    logging.warning(entry)
    print(entry)

# =============================================================
#  FLASK REVERSE PROXY
# =============================================================
app = Flask(__name__)

import logging as _logging
_logging.getLogger("werkzeug").setLevel(_logging.ERROR)

METHODS = ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"]

@app.route("/", defaults={"path": ""}, methods=METHODS)
@app.route("/<path:path>",             methods=METHODS)
def proxy(path):
    client_ip = request.headers.get("X-Forwarded-For", request.remote_addr)

    # 1. Brute Force Check
    if check_brute_force(client_ip, request.path):
        log_blocked(client_ip, "BF-001", "Brute Force Protection", "Excessive login requests", request.full_path)
        return Response(
            load_block_page("BF-001", "Brute Force Protection", "Excessive login requests from this IP (>5 attempts in 60s)", client_ip),
            status=403,
            mimetype="text/html"
        )

    # 2. CSRF Check
    if not verify_csrf(request):
        cookie_val = request.cookies.get("csrf_token")
        header_val = request.headers.get("X-CSRF-Token")
        payload_desc = f"Mismatched or missing token. Cookie: {cookie_val}, Header: {header_val}"
        log_blocked(client_ip, "CSRF-001", "CSRF Verification Failed", payload_desc, request.full_path)
        return Response(
            load_block_page("CSRF-001", "CSRF Verification Failed", payload_desc, client_ip),
            status=403,
            mimetype="text/html"
        )

    # 3. Signature-based SQLi / XSS Check
    is_malicious, rule_id, rule_name, payload = inspect_request(request)
    if is_malicious:
        log_blocked(client_ip, rule_id, rule_name, payload, request.full_path)
        return Response(
            load_block_page(rule_id, rule_name, payload, client_ip),
            status=403,
            mimetype="text/html"
        )

    # CSRF Token Generation for GET requests if not present
    csrf_cookie = request.cookies.get("csrf_token")
    new_csrf_token = None
    if not csrf_cookie and request.method == "GET":
        new_csrf_token = secrets.token_hex(32)

    # Forward clean request
    target_url = f"{TARGET_HOST}/{path}"

    excluded_req = {"host", "content-length", "transfer-encoding",
                    "connection", "accept-encoding"}
    headers = {k: v for k, v in request.headers
               if k.lower() not in excluded_req}
    headers["X-Real-IP"]       = client_ip
    headers["X-Forwarded-For"] = client_ip
    headers["X-WAF"]           = "CustomPythonWAF/1.0"

    try:
        resp = requests.request(
            method=request.method,
            url=target_url,
            headers=headers,
            params=request.args,
            data=request.get_data(),
            cookies=request.cookies,
            allow_redirects=False,
            timeout=10,
        )
    except (ConnectionError, Timeout) as e:
        return Response(f"WAF: Could not reach backend - {e}", status=502)

    # Drop unwanted response headers
    excluded_resp = {
        "transfer-encoding", "connection", "content-encoding",
        "content-length", "server", "x-powered-by",
    }

    flask_resp = Response(
        resp.content,
        status=resp.status_code,
        mimetype=resp.headers.get("Content-Type", "text/html"),
    )

    for k, v in resp.headers.items():
        if k.lower() in excluded_resp:
            continue
        if k.lower() == "location":
            v = v.replace(TARGET_HOST, f"http://localhost:{LISTEN_PORT}")
            v = v.replace("http://localhost:5000", f"http://localhost:{LISTEN_PORT}")
        flask_resp.headers.add(k, v)

    # Rewrite Set-Cookie — add HttpOnly + SameSite=Lax (excluding csrf_token so JS can read it)
    if "Set-Cookie" in flask_resp.headers:
        raw_cookies = flask_resp.headers.getlist("Set-Cookie")
        flask_resp.headers.remove("Set-Cookie")
        for cookie in raw_cookies:
            if "HttpOnly" not in cookie:
                cookie += "; HttpOnly"
            if "SameSite" not in cookie:
                cookie += "; SameSite=Lax"
            flask_resp.headers.add("Set-Cookie", cookie)

    # Inject WAF CSRF Cookie if newly generated
    if new_csrf_token:
        flask_resp.set_cookie("csrf_token", new_csrf_token, samesite="Lax", secure=False, httponly=False)

    # Standard security headers
    flask_resp.headers["X-Frame-Options"]        = "SAMEORIGIN"
    flask_resp.headers["X-Content-Type-Options"] = "nosniff"
    flask_resp.headers["X-XSS-Protection"]       = "1; mode=block"
    flask_resp.headers["Referrer-Policy"]        = "strict-origin-when-cross-origin"
    flask_resp.headers["Permissions-Policy"]     = (
        "geolocation=(), microphone=(), camera=(), payment=()"
    )
    flask_resp.headers["X-WAF-Protection"]       = "CustomPythonWAF/1.0"

    return flask_resp


# =============================================================
#  ENTRY POINT
# =============================================================
if __name__ == "__main__":
    print("=" * 60)
    print("  Custom Python WAF - Mortech E-Commerce Integration")
    print(f"  Listening : http://0.0.0.0:{LISTEN_PORT}")
    print(f"  Backend   : {TARGET_HOST}")
    print(f"  Log file  : {LOG_FILE}")
    print(f"  Rules     : {len(RULES)} signatures + BF + CSRF loaded")
    print("=" * 60)
    app.run(host="0.0.0.0", port=LISTEN_PORT, debug=False)
