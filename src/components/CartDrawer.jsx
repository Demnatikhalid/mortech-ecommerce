import React from 'react';
import { X, Minus, Plus } from 'lucide-react';
import { Link } from './Link';
import { formatPrice } from '../helpers';

export function CartDrawer({ isOpen, onClose, cart, total, updateQty }) {
  return (
    <aside className={`cart-drawer ${isOpen ? 'is-open' : ''}`} aria-hidden={!isOpen}>
      <div className="cart-head">
        <h2>Panier</h2>
        <button className="icon-button" onClick={onClose} aria-label="Fermer panier">
          <X />
        </button>
      </div>
      <div className="cart-items">
        {cart.map((item) => (
          <div className="cart-item" key={item.id}>
            <img src={item.image} alt={item.name} />
            <div>
              <strong>{item.name}</strong>
              <span>{formatPrice(item.price)}</span>
              <div className="qty-controls">
                <button onClick={() => updateQty(item.id, -1)}><Minus size={14} /></button>
                <span>{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)}><Plus size={14} /></button>
              </div>
            </div>
          </div>
        ))}
        {!cart.length && <p className="empty-state">Votre panier est vide.</p>}
      </div>
      <div className="cart-total">
        <span>Total</span>
        <strong>{formatPrice(total)}</strong>
      </div>
      <Link className="primary-button full" to="/panier" onNavigate={onClose}>
        Voir le panier
      </Link>
    </aside>
  );
}
