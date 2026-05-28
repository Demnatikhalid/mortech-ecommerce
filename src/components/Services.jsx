import React from 'react';
import { Truck, ShieldCheck, Headphones, CreditCard } from 'lucide-react';

export function Services() {
  const services = [
    [Truck, 'Livraison Maroc', 'Preparation rapide et suivi des commandes pour clients professionnels.'],
    [ShieldCheck, 'Garantie materiel', 'Produits selectionnes avec accompagnement technique et SAV.'],
    [Headphones, 'Support projet', 'Aide au choix pour installation camera, reseau, alarme et pointage.'],
    [CreditCard, 'Devis & panier', 'Ajoutez les produits au panier ou demandez un devis selon le stock.'],
  ];

  return (
    <section className="services" id="services">
      {services.map(([Icon, title, text]) => (
        <article key={title}>
          <Icon />
          <h3>{title}</h3>
          <p>{text}</p>
        </article>
      ))}
    </section>
  );
}
