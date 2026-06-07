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
      <section className="about-claims-section">
        <div className="about-claims-content">
          <span className="eyebrow">Reclamations techniques</span>
          <h2>N'hésitez pas à visiter notre site web de réclamations techniques</h2>
          <p>
            Mortech Solution Technique met à votre disposition une plate-forme dédiée
            pour signaler vos incidents techniques et suivre vos demandes de maintenance.
          </p>
          <a
            href="https://mortechsolutionstechnique.com"
            target="_blank"
            rel="noreferrer noopener"
            className="primary-button"
          >
            Aller au site des réclamations
          </a>
        </div>
      </section>
      <PolicyPreview />
      <Services />
    </>
  );
}
