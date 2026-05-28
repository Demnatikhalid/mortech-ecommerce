import React from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Link } from '../components/Link';

export function LoginPage({ onSubmit, loginSent }) {
  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Mon compte</span>
        <h1>Connexion</h1>
        <p>Accedez a votre espace client pour suivre vos demandes, devis et commandes.</p>
        <form onSubmit={onSubmit}>
          <label>
            Email
            <input type="email" required placeholder="client@email.com" />
          </label>
          <label>
            Mot de passe
            <input type="password" required placeholder="********" />
          </label>
          <button className="primary-button" type="submit">
            Se connecter
          </button>
        </form>
        {loginSent && (
          <p className="success">
            <Check size={16} /> Formulaire de connexion valide.
          </p>
        )}
        <Link className="secondary-button full" to="/inscription">
          <UserPlus size={17} /> Creer un compte
        </Link>
      </div>
    </section>
  );
}
