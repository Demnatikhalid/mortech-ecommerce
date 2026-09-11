import React from 'react';
import { Star, ShoppingCart, RotateCcw } from 'lucide-react';
import { Link } from './Link';
import { formatPrice, hasProduct360View, getProductImageUrl } from '../helpers';

export function ProductCard({ product, addToCart }) {
  const imageUrl = getProductImageUrl(product);
  const has360 = hasProduct360View(product) || product.has360;

  return (
    <article className="product-card">
      <div className="product-media">
        {product.badge && <span className="badge">{product.badge}</span>}
        {has360 && (
          <span className="badge-360" title="Vue 360° interactive disponible">
            <RotateCcw size={12} /> 360°
          </span>
        )}
        <Link to={`/produit/${product.id}`}>
          <img src={imageUrl} alt={product.name} />
        </Link>
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
