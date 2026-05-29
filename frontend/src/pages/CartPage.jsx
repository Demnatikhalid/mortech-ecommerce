import React, { useState } from 'react';
import { Minus, Plus, Check } from 'lucide-react';
import { Link } from '../components/Link';
import { formatPrice, buildWhatsAppOrder } from '../helpers';

export function CartPage({ cart, total, updateQty, currentUser, clearCart }) {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const whatsappUrl = `https://wa.me/212528241743?text=${encodeURIComponent(
    buildWhatsAppOrder(cart, total)
  )}`;
  const productImageUrl = (item) => {
    const raw = item.imageUrl || item.image || 'https://via.placeholder.com/120x90?text=Image';
    return typeof raw === 'string' ? encodeURI(raw) : raw;
  };

  const handleRequestQuote = async () => {
    if (!currentUser) {
      const redirectTo = '/panier';
      window.history.pushState({ from: redirectTo }, '', `/login?redirect=${encodeURIComponent(redirectTo)}`);
      window.dispatchEvent(new PopStateEvent('popstate'));
      return;
    }

    setLoading(true);
    setError('');
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
          status: 'DEVIS'
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la demande de devis');
      }

      setSuccess(true);
      clearCart();
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
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

          <button className="primary-button full" type="button" disabled={!cart.length}>
            Valider mon panier
          </button>
          <a
            className={`whatsapp-button full ${!cart.length ? 'disabled' : ''}`}
            href={cart.length ? whatsappUrl : '#'}
            target={cart.length ? '_blank' : '_self'}
            rel="noreferrer"
            style={!cart.length ? { opacity: 0.5, pointerEvents: 'none' } : {}}
          >
            Commander par WhatsApp
          </a>
          <button 
            className="secondary-button full" 
            style={{ marginTop: '0.5rem', width: '100%' }}
            onClick={handleRequestQuote}
            disabled={loading || !cart.length}
          >
            {loading ? 'Traitement...' : 'Demander un devis'}
          </button>
        </aside>
      </div>
    </section>
  );
}
