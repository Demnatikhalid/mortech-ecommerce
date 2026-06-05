import React from 'react';
import { ChevronDown } from 'lucide-react';
import { Link } from './Link';
import { categoryGroups } from '../products';
import {
  getCategoryUrl,
  normalizeProductCategory,
  shouldFilterSubcategory,
} from '../helpers';

export function CategoryBrowser({ isMenuOpen, setIsMenuOpen }) {
  return (
    <section className={`category-browser ${isMenuOpen ? 'is-open' : ''}`}>
      <div className="category-panel">
        <div className="category-tree">
          {categoryGroups.map((group) => (
            <article className="category-group" key={group.name}>
              <h3>
                <Link to={getCategoryUrl(normalizeProductCategory(group.name))}>
                  <ChevronDown size={15} />{group.name}
                </Link>
              </h3>
              <div className="category-branches">
                {group.sections.map((section) => (
                  <div className="category-branch" key={section.name}>
                    {shouldFilterSubcategory(group.name) ? (
                      <Link
                        to={getCategoryUrl(normalizeProductCategory(group.name), section.name)}
                        className="category-section-link"
                      >
                        {section.name}
                      </Link>
                    ) : (
                      <strong>{section.name}</strong>
                    )}
                    <div className="category-links">
                      {section.links.map((link) => (
                        <Link
                          to={getCategoryUrl(
                            normalizeProductCategory(group.name),
                            shouldFilterSubcategory(group.name) ? link : ''
                          )}
                          key={link}
                        >
                          {link}
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
