import React from 'react';
import { Hero } from '../components/Hero';
import { BrandLogoGallery } from '../components/BrandLogoGallery';
import { Services } from '../components/Services';
import { PolicyPreview } from '../components/PolicyPreview';

export function HomePage({ productProps }) {
  return (
    <>
      <Hero categories={productProps.categories} products={productProps.products} />
      <BrandLogoGallery />
      <Services compact />
      <PolicyPreview />
    </>
  );
}
