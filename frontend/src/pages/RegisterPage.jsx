import React, { useState } from 'react';
import { Check } from 'lucide-react';
import { Link } from '../components/Link';

export function RegisterPage() {
  const [name, setName] = useState('');
  const [company, setCompany] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
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
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, company, email, phone, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erreur lors de la création du compte');
      }

      setSuccess(true);
      setName('');
      setCompany('');
      setEmail('');
      setPhone('');
      setPassword('');
      
      setTimeout(() => {
        window.history.pushState({}, '', '/login');
        window.dispatchEvent(new PopStateEvent('popstate'));
      }, 2000);
    } catch (err) {
      setError(err.message || 'Une erreur est survenue.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="auth-page">
      <div className="auth-panel wide">
        <span className="eyebrow">Nouveau client</span>
        <h1>Creation de compte</h1>
        
        {error && (
          <div className="error-box" style={{ color: '#ff4b4b', backgroundColor: 'rgba(255, 75, 75, 0.1)', padding: '0.75rem', borderRadius: '4px', marginBottom: '1rem', fontSize: '0.9rem' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <label>
            Nom complet
            <input 
              required 
              placeholder="Votre nom" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={loading || success}
            />
          </label>
          <label>
            Societe
            <input 
              placeholder="Nom de societe" 
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              disabled={loading || success}
            />
          </label>
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
            Telephone
            <input 
              required 
              placeholder="+212 ..." 
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
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
            {loading ? 'Creation...' : 'Creer le compte'}
          </button>
        </form>

        {success && (
          <p className="success" style={{ color: '#2ecc71', display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <Check size={16} /> Compte cree avec succes ! Redirection vers la page de connexion...
          </p>
        )}

        <Link className="secondary-button full" to="/login">
          J'ai deja un compte
        </Link>
      </div>
    </section>
  );
}
