import React from 'react';
import { PageHero } from '../components/PageHero';
import { PolicyPreview } from '../components/PolicyPreview';
import { Services } from '../components/Services';

export function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="A propos"
        title="Mortech Solutions"
        text="Une boutique professionnelle pour centraliser vos besoins en securite electronique, reseau, informatique et automatisme."
      />
      <PolicyPreview />
      <Services />
    </>
  );
}
