import React from 'react';
import { PageHero } from '../components/PageHero';
import { ContactSection } from '../components/ContactSection';

export function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Contact"
        title="Nous contacter"
        text="Contactez-nous pour toute question ou demande. Remplissez le formulaire et nous vous repondrons dans les plus brefs delais."
      />
      <ContactSection />
    </>
  );
}
