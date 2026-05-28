import React from 'react';
import { Phone } from 'lucide-react';
import logo from '../assets/mortech-logo-cropped.png';

export function Footer() {
  return (
    <footer>
      <img src={logo} alt="Mortech Solutions" />
      <div>
        <strong>Mortech Solutions</strong>
        <span>Videosurveillance, reseaux, domotique, alarme et informatique professionnelle.</span>
      </div>
      <a href="tel:+212528241743">
        <Phone size={16} /> +(212) 528.24.17.43
      </a>
    </footer>
  );
}
