import React from 'react';
import { Hero } from '../components/Hero';
import { ProductsSection } from '../components/ProductsSection';
import { Services } from '../components/Services';
import { PolicyPreview } from '../components/PolicyPreview';

export function HomePage({ productProps }) {
  return (
    <>
      <Hero />
      <ProductsSection {...productProps} limit={6} title="Produits populaires" />
      <Services compact />
      <PolicyPreview />
    </>
  );
}
