import React, { useEffect, useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { Link } from '../components/Link';
import { formatPrice, buildWhatsAppOrder } from '../helpers';

export function CartPage({ cart, total, updateQty, currentUser, clearCart }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [checkoutMode, setCheckoutMode] = useState('quote');
  const [showCheckoutModal, setShowCheckoutModal] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    phone: currentUser?.phone || '',
    address: '',
    postalCode: '',
    city: '',
  });
  const [captchaError, setCaptchaError] = useState('');
  const [captchaWidgetId, setCaptchaWidgetId] = useState(null);
  const [scriptLoaded, setScriptLoaded] = useState(false);
  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY;

  useEffect(() => {
    if (!currentUser) return;
    setCheckoutData((current) => ({
      ...current,
      name: currentUser.name || '',
      email: currentUser.email || '',
      phone: currentUser.phone || '',
    }));
  }, [currentUser]);

  const whatsappUrl = `https://wa.me/212528241743?text=${encodeURIComponent(
    buildWhatsAppOrder(cart, total, checkoutData.name)
  )}`;
  const productImageUrl = (item) => {
    const raw = item.imageUrl || item.image || 'https://via.placeholder.com/120x90?text=Image';
    return typeof raw === 'string' ? encodeURI(raw) : raw;
  };

  const verifyRecaptchaToken = async (recaptchaToken) => {
    if (!recaptchaToken) {
      throw new Error('Validation reCAPTCHA requise.');
    }

    const response = await fetch('/api/verify-recaptcha', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ recaptchaToken })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || 'Échec de la validation reCAPTCHA');
    }

    return data.success === true;
  };

  const handleRequestQuote = async (recaptchaToken) => {
    if (!currentUser) {
      const redirectTo = '/panier';
      window.history.pushState({ from: redirectTo }, '', `/login?redirect=${encodeURIComponent(redirectTo)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setLoading(true);
    setError('');
    setCaptchaError('');
    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: currentUser.id,
          items: cart,
          total: total,
          status: 'DEVIS',
          recaptchaToken
        })
      });

      const data = await response.json();
      if (!response.ok) {
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        throw new Error(data.error || 'Erreur lors de la demande de devis');
      }

      setSuccess(true);
      clearCart();
      if (window.grecaptcha && captchaWidgetId !== null) {
        window.grecaptcha.reset(captchaWidgetId);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  const openCheckoutModal = (mode = 'quote') => {
    if (!currentUser) {
      const redirectTo = '/panier';
      window.history.pushState({ from: redirectTo }, '', `/login?redirect=${encodeURIComponent(redirectTo)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setCheckoutMode(mode);
    setError('');
    setCaptchaError('');
    setShowCheckoutModal(true);
  };

  const closeCheckoutModal = () => {
    setShowCheckoutModal(false);
    setError('');
    setCaptchaError('');
  };

  const handleCheckoutChange = (event) => {
    const { name, value } = event.target;
    setCheckoutData((current) => ({
      ...current,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (!recaptchaSiteKey) {
      setCaptchaError('La clé reCAPTCHA n’est pas configurée.');
      return;
    }

    let isMounted = true;
    let script = document.querySelector('script[src*="recaptcha/api.js"]');

    const handleScriptLoad = () => {
      if (!isMounted) return;
      if (window.grecaptcha && window.grecaptcha.render) {
        if (showCheckoutModal) {
          renderCaptcha();
        }
      }
    };

    const renderCaptcha = () => {
      if (!isMounted || !showCheckoutModal) return;
      const container = document.getElementById('recaptcha-container');
      if (!container) return;

      container.innerHTML = '';
      try {
        const widgetId = window.grecaptcha.render('recaptcha-container', {
          sitekey: recaptchaSiteKey,
          callback: () => {
            setCaptchaError('');
          },
          'error-callback': () => setCaptchaError('Erreur reCAPTCHA. Veuillez réessayer.'),
          'expired-callback': () => setCaptchaError('Le reCAPTCHA a expiré. Veuillez le recharger.')
        });
        setCaptchaWidgetId(widgetId);
      } catch (err) {
        console.error('Erreur lors du rendu reCAPTCHA:', err);
        setCaptchaError('Impossible de rendre le reCAPTCHA.');
      }
    };

    if (!script) {
      script = document.createElement('script');
      script.src = 'https://www.google.com/recaptcha/api.js';
      script.async = true;
      script.defer = true;
      script.onload = handleScriptLoad;
      script.onerror = () => {
        if (isMounted) {
          setCaptchaError('Impossible de charger le script reCAPTCHA.');
        }
      };
      document.body.appendChild(script);
    } else if (window.grecaptcha && window.grecaptcha.render) {
      handleScriptLoad();
    }

    return () => {
      isMounted = false;
    };
  }, [recaptchaSiteKey, showCheckoutModal]);

  const handleCheckoutSubmit = async (event) => {
    event.preventDefault();

    if (!recaptchaSiteKey) {
      setError('La clé reCAPTCHA n’est pas configurée.');
      return;
    }

    if (!window.grecaptcha || captchaWidgetId === null) {
      setError('reCAPTCHA non prêt. Rechargez la page.');
      return;
    }

    const recaptchaToken = window.grecaptcha.getResponse(captchaWidgetId);
    if (!recaptchaToken) {
      setError('Veuillez cocher le reCAPTCHA avant de continuer.');
      return;
    }

    if (checkoutMode === 'whatsapp') {
      if (!checkoutData.name) {
        setError('Veuillez renseigner votre nom.');
        return;
      }

      setLoading(true);
      setError('');
      setCaptchaError('');
      try {
        await verifyRecaptchaToken(recaptchaToken);
        setShowCheckoutModal(false);
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      } catch (err) {
        if (window.grecaptcha && captchaWidgetId !== null) {
          window.grecaptcha.reset(captchaWidgetId);
        }
        setError(err.message || 'Une erreur est survenue.');
      } finally {
        setLoading(false);
      }

      return;
    }

    if (!checkoutData.address || !checkoutData.city) {
      setError('Veuillez renseigner l’adresse et la ville.');
      return;
    }

    setShowCheckoutModal(false);
    await handleRequestQuote(recaptchaToken);
  };

  if (success) {
    return (
      <section className="page-shell">
        <div style={{ maxWidth: '600px', margin: '4rem auto', textAlign: 'center', padding: '2.5rem 2rem', backgroundColor: '#18181b', borderRadius: '12px', border: '1px solid #27272a' }}>
          <div style={{ display: 'inline-flex', padding: '1rem', backgroundColor: 'rgba(46, 204, 113, 0.1)', color: '#2ecc71', borderRadius: '50%', marginBottom: '1.5rem' }}>
            <Check size={48} />
          </div>
          <h1 style={{ color: '#fff', marginBottom: '1rem', fontSize: '1.75rem' }}>Demande de devis envoyee !</h1>
          <p style={{ color: '#a1a1aa', lineHeight: '1.6', marginBottom: '2rem' }}>
            Votre demande de devis a ete enregistree avec succes sous votre compte client. Notre equipe commerciale va etudier votre demande et vous contactera dans les plus brefs delais.
          </p>
          <Link className="primary-button" to="/produits">
            Retourner au catalogue
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Commande</span>
          <h1>Panier</h1>
        </div>
        <Link className="secondary-button compact" to="/produits">
          Continuer les achats
        </Link>
      </div>
      <div className="cart-page-grid">
        <div className="cart-page-list">
          {cart.map((item) => (
            <article className="cart-page-item" key={item.id}>
              <img src={productImageUrl(item)} alt={item.name} />
              <div>
                <span>{item.brand}</span>
                <h3>{item.name}</h3>
                <strong>{formatPrice(item.price)}</strong>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}>
                  <Minus size={14} />
                </button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}>
                  <Plus size={14} />
                </button>
              </div>
            </article>
          ))}
          {!cart.length && (
            <p className="empty-state">
              Votre panier est vide. Ajoutez des produits depuis le catalogue.
            </p>
          )}
        </div>
        <aside className="checkout-card">
          <h2>Resume</h2>
          <div>
            <span>Sous-total</span>
            <strong>{formatPrice(total)}</strong>
          </div>
          <div>
            <span>Livraison</span>
            <strong>Sur devis</strong>
          </div>
          <div className="checkout-total">
            <span>Total</span>
            <strong>{formatPrice(total)}</strong>
          </div>

          {error && (
            <div style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.85rem' }}>
              {error}
            </div>
          )}

          <button
            className="primary-button full"
            type="button"
            onClick={() => openCheckoutModal('quote')}
            disabled={loading || !cart.length}
          >
            {loading ? 'Traitement...' : 'Valider mon panier'}
          </button>
          <button
            className={`whatsapp-button full ${!cart.length ? 'disabled' : ''}`}
            type="button"
            onClick={() => openCheckoutModal('whatsapp')}
            disabled={loading || !cart.length}
            style={!cart.length ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            Commander par WhatsApp
          </button>
          <button 
            className="secondary-button full" 
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={() => openCheckoutModal('quote')}
            disabled={loading || !cart.length}
          >
            {loading ? 'Traitement...' : 'Demander un devis'}
          </button>
        </aside>
      </div>

      {showCheckoutModal && (
        <div className="cart-modal-overlay" role="dialog" aria-modal="true">
          <div className="cart-modal">
            <div className="cart-modal-header">
              <h2>{checkoutMode === 'whatsapp' ? 'Commander par WhatsApp' : 'Valider mon panier'}</h2>
              <button type="button" className="cart-modal-close" onClick={closeCheckoutModal} aria-label="Fermer">
                ×
              </button>
            </div>
            <form className="cart-modal-form" onSubmit={handleCheckoutSubmit}>
              <input
                type="text"
                name="name"
                value={checkoutData.name}
                onChange={handleCheckoutChange}
                placeholder="Nom"
              />
              {checkoutMode !== 'whatsapp' && (
                <>
                  <input
                    type="email"
                    name="email"
                    value={checkoutData.email}
                    onChange={handleCheckoutChange}
                    placeholder="Email"
                  />
                  <input
                    type="text"
                    name="phone"
                    value={checkoutData.phone}
                    onChange={handleCheckoutChange}
                    placeholder="Téléphone"
                  />
                  <div className="cart-modal-address-row">
                    <input
                      type="text"
                      name="address"
                      value={checkoutData.address}
                      onChange={handleCheckoutChange}
                      placeholder="Adresse"
                    />
                    <input
                      type="text"
                      name="city"
                      value={checkoutData.city}
                      onChange={handleCheckoutChange}
                      placeholder="Ville"
                    />
                  </div>
                </>
              )}
              <div id="recaptcha-container" style={{ margin: '1rem 0' }} />
              {(error || captchaError) && (
                <div className="cart-modal-error">
                  {error || captchaError}
                </div>
              )}
              <button className="primary-button full" type="submit" disabled={loading}>
                {loading ? 'Traitement...' : checkoutMode === 'whatsapp' ? 'Continuer vers WhatsApp' : 'Envoyer'}
              </button>
            </form>
          </div>
        </div>
      )}
    </section>
  );
}
