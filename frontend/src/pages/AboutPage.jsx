import React from 'react';
import { PageHero } from '../components/PageHero';
import { PolicyPreview } from '../components/PolicyPreview';
import { Services } from '../components/Services';
import qrFlyerImage from '../assets/products/qr_flyer_mortech.png';

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
          <h2>N'hésitez pas à visiter notre site web pour toute réclamation technique et installation d’équipements réseau.</h2>
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
      <section className="about-qr-section">
        <div className="about-qr-card">
          <div className="about-qr-content">
            <span className="eyebrow">Flyer</span>
            <h2>Scannez le QR code pour découvrir notre flyer.</h2>
            <p>
              Accédez rapidement à notre présentation et découvrez nos services en un simple scan.
            </p>
          </div>
          <div className="about-qr-visual">
            <img
              className="about-qr-image"
              src={qrFlyerImage}
              alt="QR code pour découvrir le flyer Mortech"
            />
          </div>
        </div>
      </section>
      <PolicyPreview />
      <Services />
    </>
  );
}
