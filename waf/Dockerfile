FROM python:3.10-slim

WORKDIR /waf

# Install dependencies
RUN pip install --no-cache-dir flask requests

# Copy source code
COPY . /waf

# Expose port
EXPOSE 8888

# Run the reverse proxy WAF
CMD ["python", "waf.py"]
