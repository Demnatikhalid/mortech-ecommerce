import React, { useState, useEffect } from 'react';
import { Camera, Network, Home, ShieldCheck, Cpu } from 'lucide-react';
import { Link } from './Link';
import { dynamicHeroWords } from '../products';
import { CategoryCatalog } from './CategoryCatalog';

export function Hero({ categories = [], products = [] }) {
  const [wordIndex, setWordIndex] = useState(0);
  const [sliderIndex, setSliderIndex] = useState(0);
  const [showCatalog, setShowCatalog] = useState(false);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setWordIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 2200);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const sliderTimer = window.setInterval(() => {
      setSliderIndex((current) => (current + 1) % dynamicHeroWords.length);
    }, 3500);
    return () => window.clearInterval(sliderTimer);
  }, []);

  const sliderItems = [
    { title: 'Videosurveillance', icon: Camera, text: 'Cameras IP et analogiques haute qualite' },
    { title: 'Reseaux', icon: Network, text: 'Equipements reseau professionnels' },
    { title: 'Domotique', icon: Home, text: 'Solutions de maison connectee' },
    { title: "Controle d'acces", icon: ShieldCheck, text: 'Systemes securises et pointage' },
    { title: 'Informatique', icon: Cpu, text: 'Materiel IT et stockage professionnel' },
  ];

  return (
    <>
      <section className={`hero ${showCatalog ? 'hero-fixed-bg' : ''}`} id="accueil">
        <div className="hero-content">
          <span className="eyebrow">Infrastructure de securite electronique et informatique</span>
          <h1>Mortech Solutions</h1>
          <div className="dynamic-title" aria-live="polite">
            Expert en <span key={dynamicHeroWords[wordIndex]}>{dynamicHeroWords[wordIndex]}</span>
          </div>
          <p>Boutique professionnelle pour videosurveillance, reseaux, controle d'acces, domotique, informatique et solutions de securite.</p>
          <div className="hero-actions">
            <button
              type="button"
              className="primary-button"
              onClick={() => setShowCatalog((current) => !current)}
            >
              {showCatalog ? 'Fermer le catalogue' : 'Catalogue'}
            </button>
          </div>
        </div>
        <div className="hero-slider">
          <div className="slider-container">
            {sliderItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <div
                  className={`slider-item ${idx === sliderIndex ? 'active' : ''}`}
                  key={item.title}
                >
                  <Icon size={48} />
                  <h3>{item.title}</h3>
                  <p>{item.text}</p>
                </div>
              );
            })}
          </div>
          <div className="slider-dots">
            {sliderItems.map((item, idx) => (
              <button
                key={item.title}
                className={`dot ${idx === sliderIndex ? 'active' : ''}`}
                onClick={() => setSliderIndex(idx)}
                aria-label={`Aller a ${sliderItems[idx].title}`}
              />
            ))}
          </div>
        </div>
      </section>
      {showCatalog && <CategoryCatalog categories={categories} products={products} />}
    </>
  );
}
