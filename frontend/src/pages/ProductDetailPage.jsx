import React from 'react';
import { ShoppingCart } from 'lucide-react';
import { Link } from '../components/Link';
import { ProductCard } from '../components/ProductCard';
import { formatPrice } from '../helpers';

export function ProductDetailPage({ product, relatedProducts, addToCart }) {
  if (!product) {
    return (
      <section className="page-shell">
        <p>Produit introuvable.</p>
      </section>
    );
  }

  const rawImage = product.imageUrl || product.image || 'https://via.placeholder.com/520x520?text=Image+indisponible';
  const imageUrl = typeof rawImage === 'string' ? encodeURI(rawImage) : rawImage;

  return (
    <section className="page-shell product-detail-page">
      <div className="breadcrumb">
        <Link to="/">Home</Link>
        <span>/</span>
        <Link to="/produits">Product Details</Link>
        <span>/</span>
        <span>{product.name}</span>
      </div>

      <div className="product-detail-grid">
        <div className="product-detail-media">
          <img src={imageUrl} alt={product.name} />
          <div className="product-detail-thumbnails">
            <img src={imageUrl} alt={product.name} />
            <img src={imageUrl} alt={product.name} />
            <img src={imageUrl} alt={product.name} />
          </div>
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <strong className="product-detail-price">{formatPrice(product.price)}</strong>
          <div className="product-detail-meta">
            <p><strong>Référence :</strong> {product.id}</p>
            <p><strong>Catégorie :</strong> {product.category || 'Sans catégorie'}</p>
            {product.subcategory && <p><strong>Sous-catégorie :</strong> {product.subcategory}</p>}
          </div>
          <p className="product-detail-description">
            {product.description || 'Description non disponible pour ce produit.'}
          </p>
          <div className="product-detail-actions">
            <button
              className="primary-button"
              type="button"
              onClick={() => addToCart(product)}
              disabled={!product.stock}
            >
              <ShoppingCart size={18} /> {product.stock ? 'Ajouter au panier' : 'Demander un devis'}
            </button>
            <Link className="secondary-button" to="/panier">
              Voir le panier
            </Link>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section className="related-products">
          <div className="section-heading">
            <div>
              <span className="eyebrow">Produits liés</span>
              <h2>Produits recommandés</h2>
            </div>
          </div>
          <div className="product-grid">
            {relatedProducts.map((related) => (
              <ProductCard key={related.id} product={related} addToCart={addToCart} />
            ))}
          </div>
        </section>
      )}
    </section>
  );
}
