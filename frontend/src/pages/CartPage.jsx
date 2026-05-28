import React from 'react';
import { Minus, Plus } from 'lucide-react';
import { Link } from '../components/Link';
import { formatPrice, buildWhatsAppOrder } from '../helpers';

export function CartPage({ cart, total, updateQty }) {
  const whatsappUrl = `https://wa.me/212528241743?text=${encodeURIComponent(
    buildWhatsAppOrder(cart, total)
  )}`;

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
              <img src={item.image} alt={item.name} />
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
          <button className="primary-button full" type="button">
            Valider mon panier
          </button>
          <a
            className="whatsapp-button full"
            href={whatsappUrl}
            target="_blank"
            rel="noreferrer"
          >
            Commander par WhatsApp
          </a>
          <Link className="primary-button full" to="/contact">
            Demander un devis
          </Link>
        </aside>
      </div>
    </section>
  );
}
