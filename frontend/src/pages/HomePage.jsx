import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { ProductCard } from '../components/ProductCard';
import { BrandLogoGallery } from '../components/BrandLogoGallery';
import { Services } from '../components/Services';
import { PolicyPreview } from '../components/PolicyPreview';
import { QuickCategories } from '../components/QuickCategories';
import { Link } from '../components/Link';
import { getCategoryUrl } from '../helpers';
import capture99Image from '../assets/products/Capture99.PNG';
import capture100Image from '../assets/products/Capture100.PNG';

function HomeShowcaseSection({ title, eyebrow, products, href, addToCart, loading, error }) {
  const visibleProducts = products.slice(0, 5);

  return (
    <section className="products-section">
      <div className="section-heading">
        <div>
          <span className="eyebrow">{eyebrow}</span>
          <h2>{title}</h2>
        </div>
        <Link to={href}>Voir la sélection</Link>
      </div>
      {loading ? (
        <p className="empty-state">Chargement des produits...</p>
      ) : error ? (
        <p className="empty-state">{error}</p>
      ) : visibleProducts.length ? (
        <div className="product-grid">
          {visibleProducts.map((product) => (
            <ProductCard key={product.id} product={product} addToCart={addToCart} />
          ))}
        </div>
      ) : (
        <p className="empty-state">Aucun produit disponible pour le moment.</p>
      )}
    </section>
  );
}

export function HomePage({ productProps }) {
  const products = productProps.products || [];
  const dahuaProducts = products.filter((product) => (product.brand || '').toLowerCase() === 'dahua');
  const hikvisionProducts = products.filter((product) => (product.brand || '').toLowerCase() === 'hikvision');
  const networkProducts = products.filter((product) => product.category === 'Equipement Reseaux');

  return (
    <>
      <Hero categories={productProps.categories} products={productProps.products} />
      <section className="home-banner-gallery" aria-label="Bannières marques">
        <div className="home-banner-grid">
          <figure className="home-banner-card">
            <img src={capture99Image} alt="Bannière Dahua Technology" />
          </figure>
          <figure className="home-banner-card">
            <img src={capture100Image} alt="Bannière Multivision" />
          </figure>
        </div>
      </section>
      <CategoryShowcase />
      <QuickCategories />
      <HomeShowcaseSection
        eyebrow="Produits"
        title="Produits Dahua"
        products={dahuaProducts}
        href={getCategoryUrl('Videosurveillance')}
        addToCart={productProps.addToCart}
        loading={productProps.productsLoading}
        error={productProps.productsError}
      />
      <HomeShowcaseSection
        eyebrow="Produits"
        title="Produits Hikvision"
        products={hikvisionProducts}
        href={getCategoryUrl('Videosurveillance')}
        addToCart={productProps.addToCart}
        loading={productProps.productsLoading}
        error={productProps.productsError}
      />
      <HomeShowcaseSection
        eyebrow="Produits"
        title="Produits Réseaux"
        products={networkProducts}
        href={getCategoryUrl('Equipement Reseaux')}
        addToCart={productProps.addToCart}
        loading={productProps.productsLoading}
        error={productProps.productsError}
      />
      <BrandLogoGallery />
      <Services compact />
      <PolicyPreview />
    </>
  );
}
