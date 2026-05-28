import React from 'react';
import {
  Camera,
  Network,
  ShieldCheck,
  Home,
  AlarmSmoke,
  Cpu,
} from 'lucide-react';
import { Link } from './Link';
import { getCategoryUrl, normalizeProductCategory } from '../helpers';

export function CategoryShowcase() {
  const showcaseCategories = [
    {
      title: 'Videosurveillance',
      icon: Camera,
      description: 'Cameras IP et analogiques professionnelles',
      brands: ['Hikvision', 'Dahua', 'Uniview'],
    },
    {
      title: 'Reseaux & Communication',
      icon: Network,
      description: 'Equipements reseau et connectivite',
      brands: ['TP-Link', 'Ruijie', 'Cisco'],
    },
    {
      title: "Controle d'acces & Pointage",
      icon: ShieldCheck,
      description: "Systemes d'identification et de controle",
      brands: ['Hikvision', 'ZKTeco', 'Dahua'],
    },
    {
      title: 'Domotique',
      icon: Home,
      description: 'Solutions connectees',
      brands: ['Somfy', 'Sonoff', 'Tuya'],
    },
    {
      title: 'Securite & Alarmes',
      icon: AlarmSmoke,
      description: 'Systemes de detection intrusion et incendie',
      brands: ['Ajax', 'Hikvision', 'Nugelec'],
    },
    {
      title: 'Informatique & Stockage',
      icon: Cpu,
      description: 'Materiel IT et solutions de stockage',
      brands: ['Kingston', 'SanDisk', 'WD'],
    },
  ];

  return (
    <section className="category-showcase">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Solutions</span>
          <h2>Nos domaines de competence</h2>
        </div>
      </div>
      <div className="showcase-grid">
        {showcaseCategories.map(({ title, icon: Icon, description, brands }) => (
          <Link
            to={getCategoryUrl(normalizeProductCategory(title.replace(' & ', ' Et ')))}
            className="showcase-card"
            key={title}
          >
            <div className="showcase-icon">
              <Icon size={32} />
            </div>
            <h3>{title}</h3>
            <p>{description}</p>
            <div className="showcase-brands">
              {brands.map((brand) => (
                <span key={brand}>{brand}</span>
              ))}
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
