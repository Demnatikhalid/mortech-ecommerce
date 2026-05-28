import React from 'react';
import { Building2, Truck, ShieldCheck } from 'lucide-react';

export function PolicyPreview() {
  return (
    <section className="policy-section" id="apropos">
      <article>
        <Building2 />
        <h3>A propos</h3>
        <p>Mortech Solutions accompagne les entreprises dans les infrastructures IT, securite electronique et automatismes.</p>
      </article>
      <article>
        <Truck />
        <h3>Livraison</h3>
        <p>Preparation de commande, confirmation de disponibilite et livraison selon ville et volume du materiel.</p>
      </article>
      <article>
        <ShieldCheck />
        <h3>Retour & CGV</h3>
        <p>Conditions professionnelles claires pour retours, garanties, validation devis et commande.</p>
      </article>
    </section>
  );
}
