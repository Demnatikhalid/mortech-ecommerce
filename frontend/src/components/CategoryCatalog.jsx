import React, { useEffect, useMemo, useState } from 'react';
import { Link } from './Link';
import { getCategoryUrl } from '../helpers';

export function CategoryCatalog({ categories = [], products = [] }) {
  const availableCategories = useMemo(
    () => categories.filter((category) => category && category !== 'Tous'),
    [categories]
  );
  const [hoverCategory, setHoverCategory] = useState('');

  useEffect(() => {
    if (!hoverCategory && availableCategories.length) {
      setHoverCategory(availableCategories[0]);
    }
  }, [availableCategories, hoverCategory]);

  const previewProducts = useMemo(() => {
    if (!hoverCategory) return [];
    return products.filter((product) => product.category === hoverCategory).slice(0, 5);
  }, [products, hoverCategory]);

  if (!availableCategories.length) {
    return null;
  }

  return (
    <div className="hero-catalog">
      <div className="hero-catalog-panel">
        <div className="hero-catalog-header">
          <span className="eyebrow">Catalogue</span>
          <h3>Parcourir les categories</h3>
        </div>
        <div className="hero-catalog-body">
          <div className="hero-catalog-list">
            {availableCategories.map((category) => (
              <button
                key={category}
                type="button"
                className={`hero-catalog-item ${hoverCategory === category ? 'active' : ''}`}
                onMouseEnter={() => setHoverCategory(category)}
                onFocus={() => setHoverCategory(category)}
                onClick={() => {
                  window.location.href = getCategoryUrl(category);
                }}
              >
                {category}
              </button>
            ))}
          </div>
          <div className="hero-catalog-preview">
            <div className="hero-catalog-preview-title">
              <strong>{hoverCategory ? hoverCategory : 'Survolez une categorie'}</strong>
              <span>
                {previewProducts.length
                  ? `${previewProducts.length} produit(s)`
                  : 'Aucun produit pour cette categorie'}
              </span>
            </div>
            <div className="hero-catalog-preview-grid">
              {previewProducts.length ? (
                previewProducts.map((product) => {
                  const rawImage = product.imageUrl || product.image || 'https://via.placeholder.com/120x90?text=Image';
                  const imageUrl = typeof rawImage === 'string' ? encodeURI(rawImage) : rawImage;
                  return (
                    <Link key={product.id} to={`/produit/${product.id}`} className="hero-preview-card">
                      <img src={imageUrl} alt={product.name} />
                      <div>
                        <strong>{product.name}</strong>
                        <span>{product.brand || product.category}</span>
                      </div>
                    </Link>
                  );
                })
              ) : (
                <div className="hero-preview-empty">Aucun produit trouve pour cette categorie.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
