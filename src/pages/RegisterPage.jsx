import React from 'react';
import { Link } from '../components/Link';

export function RegisterPage() {
  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <span className="eyebrow">Nouveau client</span>
        <h1>Creation de compte</h1>
        <form>
          <label>
            Nom complet
            <input required placeholder="Votre nom" />
          </label>
          <label>
            Societe
            <input placeholder="Nom de societe" />
          </label>
          <label>
            Email
            <input type="email" required placeholder="client@email.com" />
          </label>
          <label>
            Telephone
            <input required placeholder="+212 ..." />
          </label>
          <label>
            Mot de passe
            <input type="password" required placeholder="********" />
          </label>
          <button className="primary-button" type="button">
            Creer le compte
          </button>
        </form>
        <Link className="secondary-button full" to="/login">
          J'ai deja un compte
        </Link>
      </div>
    </section>
  );
}
