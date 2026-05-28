import React from 'react';
import { CategoryBrowser } from '../components/CategoryBrowser';
import { ProductsSection } from '../components/ProductsSection';

export function ProductsPage(props) {
  return (
    <>
      <CategoryBrowser isMenuOpen setIsMenuOpen={() => {}} />
      <ProductsSection {...props} title="Catalogue produits" />
    </>
  );
}
