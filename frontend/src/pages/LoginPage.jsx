import React, { useEffect, useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Link } from '../components/Link';

export function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [captchaWidgetId, setCaptchaWidgetId] = useState(null);

  useEffect(() => {
    try {
      const savedEmail = localStorage.getItem('mortech_remembered_email');
      if (savedEmail) {
        setEmail(savedEmail);
        setRememberMe(true);
      }
    } catch (e) {
      // ignore localStorage errors
    }
  }, []);

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!recaptchaSiteKey) {
      setCaptchaError('La clé reCAPTCHA n’est pas configurée.');
      return;
    }

    let isMounted = true;

    const renderCaptcha = () => {
      if (!isMounted) return;
      const container = document.getElementById('recaptcha-login-container');
      if (!container) return;

      container.innerHTML = '';

      try {
        const widgetId = window.grecaptcha.render('recaptcha-login-container', {
          sitekey: recaptchaSiteKey,
          callback: () => {
            setCaptchaError('');
          },
          'error-callback': () => setCaptchaError('Erreur reCAPTCHA. Veuillez réessayer.'),
          'expired-callback': () => {
            setCaptchaError('Le reCAPTCHA a expiré. Veuillez le recharger.');
          }
        });
        setCaptchaWidgetId(widgetId);
      } catch (err) {
        console.error('Erreur lors du rendu reCAPTCHA:', err);
      }
    };

    if (window.grecaptcha && window.grecaptcha.render) {
      renderCaptcha();
    } else {
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

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/login`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ email, password, recaptchaToken }),
});
      const data = await response.json();

      if (!response.ok) {
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        throw new Error(data.error || 'Identifiants invalides');
      }

      try {
        if (rememberMe) {
          localStorage.setItem('mortech_remembered_email', email);
        } else {
          localStorage.removeItem('mortech_remembered_email');
        }
      } catch (e) {
        // ignore storage errors
      }

      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Mon compte</span>
        <h1>Connexion</h1>
        <p>Accedez a votre espace client pour suivre vos demandes, devis et commandes.</p>
        
        {error && (
          <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
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
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading || success}
              style={{ width: '1rem', height: '1rem' }}
            />
            Se souvenir de moi
          </label>
          <div id="recaptcha-login-container" style={{ margin: '1rem 0' }} />
          {captchaError && (
            <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
              {captchaError}
            </div>
          )}
          <button className="primary-button" type="submit" disabled={loading || success}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        {success && (
          <p className="success" style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Check size={16} /> Connexion reussie ! Redirection...
          </p>
        )}
        <Link className="secondary-button full" to="/inscription">
          <UserPlus size={17} /> Creer un compte
        </Link>
      </div>
    </section>
  );
}
