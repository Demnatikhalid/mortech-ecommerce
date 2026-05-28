import React from 'react';
import { PageHero } from '../components/PageHero';
import { Services } from '../components/Services';
import { PolicyPreview } from '../components/PolicyPreview';

export function ServicesPage() {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Accompagnement technique"
        text="Mortech Solutions aide les clients a choisir, commander et deployer leurs solutions IT, reseaux, securite et domotique."
      />
      <Services />
      <PolicyPreview />
    </>
  );
}
