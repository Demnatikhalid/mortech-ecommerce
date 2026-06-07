import React from 'react';
import { Link } from './Link';
import hikvisionLogo from '../assets/products/Hikvision-Logo.png';
import dahuaLogo from '../assets/products/dahua-logo-png_seeklogo-357136.png';
import somfyLogo from '../assets/products/Somfy_Logo.jpg';
import zktecoLogo from '../assets/products/Zkteco-Logo-Vector.svg-.png';
import tpLinkLogo from '../assets/products/tp-link-768x432.png';
import sonoffLogo from '../assets/products/sonoff-logo-png_seeklogo-410422.png';
import shellyLogo from '../assets/products/shelly_logo_blue_Logo.jpg';
import eatonLogo from '../assets/products/eaton-6-logo-png-transparent.png';
import ruijieImage from '../assets/products/ruijie-40g-aoc-5m-01.jpg';
import ipcomImage from '../assets/products/Switch-Ip-com-L3-G5324-16f-Gigabit-16-Portas-Sfp-Gerenci-vel-Em-Nuvem-10-100-1000_1747853981.png';

const brands = [
  { name: 'Hikvision', logo: hikvisionLogo },
  { name: 'Dahua', logo: dahuaLogo },
  { name: 'Somfy', logo: somfyLogo },
  { name: 'ZKTeco', logo: zktecoLogo },
  { name: 'Ruijie', logo: ruijieImage },
  { name: 'TP-Link', logo: tpLinkLogo },
  { name: 'Sonoff', logo: sonoffLogo },
  { name: 'Shelly', logo: shellyLogo },
  { name: 'IP-COM', logo: ipcomImage },
  { name: 'EATON', logo: eatonLogo },
];

export function BrandLogoGallery() {
  return (
    <section className="brand-logo-gallery">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Marques</span>
          <h2>Nos marques partenaires</h2>
        </div>
        <Link to="/produits">Voir le catalogue</Link>
      </div>

      <div className="brand-logo-grid">
        {brands.map(({ name, logo }) => (
          <Link
            key={name}
            to={`/produits?categorie=${encodeURIComponent(name)}`}
            className="brand-logo-card"
            aria-label={name}
          >
            <div className="brand-logo-icon">
              <img src={logo} alt={`${name} logo`} />
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
