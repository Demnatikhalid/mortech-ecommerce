import React from 'react';
import { Hero } from '../components/Hero';
import { CategoryShowcase } from '../components/CategoryShowcase';
import { CategoryBrowser } from '../components/CategoryBrowser';
import { ProductsSection } from '../components/ProductsSection';
import { QuickCategories } from '../components/QuickCategories';
import { Services } from '../components/Services';
import { PolicyPreview } from '../components/PolicyPreview';

export function HomePage({ productProps, isMenuOpen, setIsMenuOpen }) {
  return (
    <>
      <Hero />
      <CategoryShowcase />
      <CategoryBrowser isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />
      <ProductsSection {...productProps} limit={6} title="Produits populaires" />
      <QuickCategories />
      <Services compact />
      <PolicyPreview />
    </>
  );
}
