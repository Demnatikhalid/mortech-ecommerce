import React from 'react';
import { Link } from './Link';
import { quickCategories } from '../products';
import { getCategoryUrl } from '../helpers';

export function QuickCategories() {
  return (
    <section className="quick-categories">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Cette semaine</span>
          <h2>Categories les plus demandees</h2>
        </div>
        <Link to="/produits">Tous les produits</Link>
      </div>
      <div className="quick-grid">
        {quickCategories.map(([title, text, Icon, category]) => (
          <Link to={getCategoryUrl(category)} className="quick-card" key={title}>
            <Icon size={24} />
            <strong>{title}</strong>
            <span>{text}</span>
          </Link>
        ))}
      </div>
    </section>
  );
}
