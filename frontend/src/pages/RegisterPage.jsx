import React, { useEffect, useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from '../components/Link';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [captchaReady, setCaptchaReady] = useState(false);
  const [captchaWidgetId, setCaptchaWidgetId] = useState(null);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!recaptchaSiteKey) {
      setCaptchaError('La clé reCAPTCHA n’est pas configurée.');
      return;
    }

    let isMounted = true;

    const renderCaptcha = () => {
      if (!isMounted) return;
      const container = document.getElementById('recaptcha-container');
      if (!container) return;

      container.innerHTML = ''; // Nettoyer le conteneur pour éviter les doublons ou les conflits

      try {
        const widgetId = window.grecaptcha.render('recaptcha-container', {
          sitekey: recaptchaSiteKey,
          callback: () => {
            setCaptchaError('');
            setCaptchaReady(true);
          },
          'error-callback': () => setCaptchaError('Erreur reCAPTCHA. Veuillez réessayer.'),
          'expired-callback': () => {
            setCaptchaError('Le reCAPTCHA a expiré. Veuillez le recharger.');
            setCaptchaReady(false);
          }
        });
        setCaptchaWidgetId(widgetId);
        setCaptchaReady(true);
      } catch (err) {
        console.error('Erreur lors du rendu reCAPTCHA:', err);
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptcha();
    } else {
      // Vérifier si le script reCAPTCHA est déjà présent ou en cours de chargement
      let script = document.querySelector('script[src*="recaptcha/api.js"]');
      if (!script) {
        script = document.createElement('script');
        script.src = 'https://www.google.com/recaptcha/api.js?render=explicit';
        script.async = true;
        script.defer = true;
        document.body.appendChild(script);
      }

      const handleScriptLoad = () => {
        if (window.grecaptcha && window.grecaptcha.render) {
          renderCaptcha();
        } else {
          const interval = setInterval(() => {
            if (window.grecaptcha && window.grecaptcha.render) {
              clearInterval(interval);
              renderCaptcha();
            }
          }, 100);
          setTimeout(() => clearInterval(interval), 4000);
        }
      };

      const oldOnload = script.onload;
      script.onload = (e) => {
        if (oldOnload) oldOnload(e);
        handleScriptLoad();
      };
      script.onerror = () => setCaptchaError('Impossible de charger le script reCAPTCHA.');
    }

    return () => {
      isMounted = false;
      // Ne pas supprimer le script du DOM pour préserver la disponibilité globale du script
    };
  }, [recaptchaSiteKey]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setCaptchaError('');
    setLoading(true);
    setSuccess(false);

    try {
      if (!window.grecaptcha || captchaWidgetId === null) {
        throw new Error('reCAPTCHA non prêt. Rechargez la page.');
      }

      const recaptchaToken = window.grecaptcha.getResponse(captchaWidgetId);
      if (!recaptchaToken) {
        throw new Error('Veuillez cocher le reCAPTCHA avant de continuer.');
      }

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, company, email, phone, password, recaptchaToken }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        throw new Error(data.error || 'Erreur lors de la création du compte');
      }

      setSuccess(true);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setPassword('');

      if (window.grecaptcha && captchaWidgetId !== null) {
        window.grecaptcha.reset(captchaWidgetId);
      }

      setTimeout(() => {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <span className="eyebrow">Nouveau client</span>
        <h1>Creation de compte</h1>
        
        {error && (
          <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nom complet
            <input 
              required 
              placeholder="Votre nom" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Societe
            <input 
              placeholder="Nom de societe" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Email
            <input 
              type="email" 
              required 
              placeholder="client@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Telephone
            <input 
              required 
              placeholder="+212 ..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Mot de passe
            <input 
              type="password" 
              required 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <div id="recaptcha-container" style={{ margin: '1rem 0' }} />
          {captchaError && (
            <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {captchaError}
            </div>
          )}
          <button className="primary-button" type="submit" disabled={loading || success}>
            {loading ? 'Creation...' : 'Creer le compte'}
          </button>
        </form>

        {success && (
          <p className="success" style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Check size={16} /> Compte cree avec succes ! Redirection vers la page de connexion...
          </p>
        )}

        <Link className="secondary-button full" to="/login">
          J'ai deja un compte
        </Link>
      </div>
    </section>
  );
}
