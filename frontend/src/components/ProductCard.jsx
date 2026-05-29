import React from 'react';
import { Star, ShoppingCart } from 'lucide-react';
import { formatPrice } from '../helpers';

export function ProductCard({ product, addToCart }) {
  const rawImage = product.imageUrl || product.image || 'https://via.placeholder.com/420x280?text=Image+indisponible';
  const imageUrl = typeof rawImage === 'string' ? encodeURI(rawImage) : rawImage;

  return (
    <article className="product-card">
      <div className="product-media">
        {product.badge && <span className="badge">{product.badge}</span>}
        <img src={imageUrl} alt={product.name} />
      </div>
      <div className="product-info">
        <span>{product.brand}</span>
        <h3>{product.name}</h3>
        <div className="rating">
          <Star size={15} fill="currentColor" />
          <span>Disponible conseil technique</span>
        </div>
        <div className="product-footer">
          <strong>{product.stock ? formatPrice(product.price) : 'Contactez-nous'}</strong>
          <button onClick={() => addToCart(product)} disabled={!product.stock}>
            {product.stock ? (
              <>
                <ShoppingCart size={17} /> Ajouter
              </>
            ) : (
              'Devis'
            )}
          </button>
        </div>
      </div>
    </article>
  );
}
