import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Menu,
  X,
  Search,
  ShoppingCart,
} from 'lucide-react';
import { Link } from './Link';
import { formatPrice } from '../helpers';
import logo from '../assets/mortech-logo-cropped.png';

export function Header({ query, setQuery, cartCount, cartTotal, route, isMenuOpen, setIsMenuOpen }) {
  return (
    <header className="site-header">
      <div className="topbar">
        <span><Phone size={14} /> +(212) 528.24.17.43</span>
        <span><Mail size={14} /> contact@mortech-solutions.ma</span>
        <span><MapPin size={14} /> Agadir, Maroc</span>
        <Link to="/login">Mon compte</Link>
        <Link to="/inscription">Creer un compte</Link>
      </div>
      <div className="nav-shell">
        <button className="icon-button mobile-only" onClick={() => setIsMenuOpen(!isMenuOpen)} aria-label="Menu categories">
          {isMenuOpen ? <X /> : <Menu />}
        </button>
        <Link className="brand" to="/" aria-label="Mortech Solutions">
          <img src={logo} alt="Mortech Solutions" />
        </Link>
        <div className="search-box">
          <select aria-label="Categorie recherche">
            <option>Toutes categories</option>
            <option>Videosurveillance</option>
            <option>Reseaux</option>
            <option>Domotique</option>
          </select>
          <Search size={18} />
          <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Rechercher camera, switch, alarme..." />
        </div>
        <nav className="main-nav">
          <Link className={route === '/' ? 'active' : ''} to="/">Accueil</Link>
          <Link className={route === '/produits' ? 'active' : ''} to="/produits">Produits</Link>
          <Link className={route === '/services' ? 'active' : ''} to="/services">Services</Link>
          <Link className={route === '/contact' ? 'active' : ''} to="/contact">Contact</Link>
          <Link className={route === '/apropos' ? 'active' : ''} to="/apropos">A propos</Link>
          <Link className={route === '/login' ? 'active' : ''} to="/login">Login</Link>
        </nav>
        <Link className="cart-button" to="/panier">
          <ShoppingCart size={20} />
          <span>{cartCount}</span>
          <strong>{formatPrice(cartTotal)}</strong>
        </Link>
      </div>
    </header>
  );
}
