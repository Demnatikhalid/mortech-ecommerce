import React, { useState, useEffect } from 'react';
import { ShoppingCart, RotateCcw, Image as ImageIcon } from 'lucide-react';
import { Link } from '../components/Link';
import { ProductCard } from '../components/ProductCard';
import { Product360Viewer } from '../components/Product360Viewer';
import { formatPrice, getProduct360Images, getProductImageUrl } from '../helpers';

export function ProductDetailPage({ product, relatedProducts, addToCart }) {
  if (!product) {
    return (
      <section className="page-shell">
        <p>Produit introuvable.</p>
      </section>
    );
  }

  const imageUrl = getProductImageUrl(product);

  const [images360, setImages360] = useState(() => getProduct360Images(product));
  const [viewMode, setViewMode] = useState(() => (images360 ? '360' : 'standard'));
  const [activeStandardImage, setActiveStandardImage] = useState(imageUrl);

  useEffect(() => {
    setActiveStandardImage(imageUrl);
    const knownImages = getProduct360Images(product);
    if (knownImages) {
      setImages360(knownImages);
      setViewMode('360');
      return;
    }

    if (product?.name) {
      const probeUrl = `/360view/${encodeURIComponent(product.name.trim())}/angle-1.png`;
      const img = new Image();
      img.onload = () => {
        const dynamicAngles = Array.from({ length: 12 }, (_, i) =>
          `/360view/${encodeURIComponent(product.name.trim())}/angle-${i + 1}.png`
        );
        setImages360(dynamicAngles);
        setViewMode('360');
      };
      img.onerror = () => {
        setImages360(null);
        setViewMode('standard');
      };
      img.src = probeUrl;
    } else {
      setImages360(null);
      setViewMode('standard');
    }
  }, [product?.id, product?.name, imageUrl]);

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
          {images360 && images360.length > 0 && (
            <div className="product-media-switcher">
              <button
                type="button"
                className={`product-media-tab ${viewMode === '360' ? 'active' : ''}`}
                onClick={() => setViewMode('360')}
              >
                <RotateCcw size={15} /> Vue 360° ({images360.length} angles)
              </button>
              <button
                type="button"
                className={`product-media-tab ${viewMode === 'standard' ? 'active' : ''}`}
                onClick={() => setViewMode('standard')}
              >
                <ImageIcon size={15} /> Galerie Standard
              </button>
            </div>
          )}

          {viewMode === '360' && images360 && images360.length > 0 ? (
            <Product360Viewer images={images360} productName={product.name} />
          ) : (
            <div className="product-detail-standard-view">
              <div className="product-detail-main-image">
                <img src={activeStandardImage} alt={product.name} />
              </div>
              <div className="product-detail-thumbnails">
                {images360 && images360.length > 0 ? (
                  images360.map((angleUrl, idx) => (
                    <img
                      key={idx}
                      src={angleUrl}
                      alt={`${product.name} Angle ${idx + 1}`}
                      className={activeStandardImage === angleUrl ? 'active' : ''}
                      onClick={() => setActiveStandardImage(angleUrl)}
                      title={`Angle ${idx + 1}`}
                    />
                  ))
                ) : (
                  <img
                    src={imageUrl}
                    alt={product.name}
                    className="active"
                  />
                )}
              </div>
            </div>
          )}
        </div>

        <div className="product-detail-info">
          <h1>{product.name}</h1>
          <div className="product-detail-price-block">
            <span className="product-detail-price-label">Prix</span>
            <strong className="product-detail-price">{formatPrice(product.price)}</strong>
          </div>
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
