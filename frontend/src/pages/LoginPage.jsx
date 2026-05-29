import React, { useState } from 'react';
import { Check, UserPlus } from 'lucide-react';
import { Link } from '../components/Link';

export function LoginPage({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Identifiants invalides');
      }

      setSuccess(true);
      if (onLoginSuccess) {
        setTimeout(() => {
          onLoginSuccess(data.user);
        }, 1000);
      }
    } catch (err) {
      setError(err.message || 'Une erreur est survenue lors de la connexion.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel">
        <span className="eyebrow">Mon compte</span>
        <h1>Connexion</h1>
        <p>Accedez a votre espace client pour suivre vos demandes, devis et commandes.</p>
        
        {error && (
          <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Email
            <input 
              type="email" 
              required 
              placeholder="client@email.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Mot de passe
            <input 
              type="password" 
              required 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <button className="primary-button" type="submit" disabled={loading || success}>
            {loading ? 'Connexion...' : 'Se connecter'}
          </button>
        </form>
        {success && (
          <p className="success" style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Check size={16} /> Connexion reussie ! Redirection...
          </p>
        )}
        <Link className="secondary-button full" to="/inscription">
          <UserPlus size={17} /> Creer un compte
        </Link>
      </div>
    </section>
  );
}
