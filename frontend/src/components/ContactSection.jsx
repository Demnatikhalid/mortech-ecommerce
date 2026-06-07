import React, { useEffect, useState } from 'react';
import { MapPin, Mail, Phone, Check } from 'lucide-react';

export function ContactSection() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [captchaError, setCaptchaError] = useState('');
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
      const container = document.getElementById('recaptcha-contact-container');
      if (!container) return;

      container.innerHTML = '';

      try {
        const widgetId = window.grecaptcha.render('recaptcha-contact-container', {
          sitekey: recaptchaSiteKey,
          callback: () => setCaptchaError(''),
          'error-callback': () => setCaptchaError('Erreur reCAPTCHA. Veuillez réessayer.'),
          'expired-callback': () => setCaptchaError('Le reCAPTCHA a expiré. Veuillez le recharger.')
        });
        setCaptchaWidgetId(widgetId);
      } catch (err) {
        console.error('Erreur lors du rendu reCAPTCHA:', err);
        setCaptchaError('Impossible de rendre le reCAPTCHA.');
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

      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, subject, message, recaptchaToken })
      });

      const data = await response.json();
      if (!response.ok) {
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        throw new Error(data.error || 'Erreur lors de l’envoi du message');
      }

      setSuccess(true);
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
      if (window.grecaptcha && captchaWidgetId !== null) {
        window.grecaptcha.reset(captchaWidgetId);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact</h2>
          <p>Contactez-nous pour toute question, commentaire ou demande. Remplissez simplement le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais. Votre satisfaction est notre priorite</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <strong>Adresse</strong>
                <p>Agadir, Maroc</p>
              </div>
            </div>
            
            <div className="contact-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <a href="mailto:contact@mortech-solutions.ma">contact@mortech-solutions.ma</a>
              </div>
            </div>
            
            <div className="contact-item">
              <Phone size={20} />
              <div>
                <strong>Telephone</strong>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
                <span> / </span>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe 
              title="Localisation Mortech Solutions"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.7889023755006!2d-9.598!3d30.427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzM2LjAiTiA5wrAzNSc1Mi44Ilc!5e0!3m2!1sfr!2sma!4v1234567890" 
              width="100%" 
              height="300" 
              style={{border: 0, borderRadius: '8px'}}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h2>Service contact email</h2>
          {error && <div className="error-box">{error}</div>}
          <form onSubmit={handleSubmit}>
            <label>
              <span>Nom (obligatoire)</span>
              <input
                type="text"
                required
                placeholder="Votre nom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={loading}
              />
            </label>
            
            <label>
              <span>E-mail (obligatoire)</span>
              <input
                type="email"
                required
                placeholder="votre.email@exemple.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </label>
            
            <label>
              <span>Sujet</span>
              <input
                type="text"
                placeholder="Sujet de votre message"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                disabled={loading}
              />
            </label>
            
            <label>
              <span>Message (obligatoire)</span>
              <textarea
                required
                placeholder="Decrivez votre besoin..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                disabled={loading}
              />
            </label>
            <div id="recaptcha-contact-container" style={{ margin: '1rem 0' }} />
            {captchaError && <div className="error-box">{captchaError}</div>}
            <button className="primary-button" type="submit" disabled={loading}>
              {loading ? 'Envoi en cours...' : 'Envoyer'}
            </button>
            {success && (
              <p className="success"><Check size={16} /> Votre message a ete envoye avec succes !</p>
            )}
          </form>
        </div>
      </div>
    </section>
  );
}
