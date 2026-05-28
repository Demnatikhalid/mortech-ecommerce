import React from 'react';
import { ProductCard } from './ProductCard';
import { Link } from './Link';

export function ProductsSection({
  categories,
  activeCategory,
  activeSubcategory,
  setActiveCategory,
  filteredProducts,
  addToCart,
  limit,
  title = 'Produits populaires',
}) {
  const visibleProducts = limit ? filteredProducts.slice(0, limit) : filteredProducts;
  const visibleCategories = categories.includes(activeCategory)
    ? categories
    : [...categories, activeCategory];
  const sectionTitle = activeSubcategory || title;

  return (
    <section className="products-section" id="produits">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Boutique</span>
          <h2>{sectionTitle}</h2>
        </div>
        <div className="tabs" role="tablist" aria-label="Filtrer produits">
          {visibleCategories.map((category) => (
            <button
              className={category === activeCategory ? 'active' : ''}
              key={category}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      <div className="product-grid">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} addToCart={addToCart} />
        ))}
      </div>
      {!filteredProducts.length && (
        <p className="empty-state">Aucun produit ne correspond a votre recherche.</p>
      )}
      {limit && filteredProducts.length > limit && (
        <Link className="primary-button more-products" to="/produits">
          Voir tout le catalogue
        </Link>
      )}
    </section>
  );
}
