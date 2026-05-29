import React from 'react';
import { Link } from '../components/Link';

export function ProfilePage({ currentUser, onLogout }) {
  if (!currentUser) {
    return (
      <section className="page-shell">
        <div className="section-heading">
          <h1>Mon profil</h1>
        </div>
        <p>Vous n'êtes pas connecté. <Link to="/login">Connectez-vous</Link> pour voir votre profil.</p>
      </section>
    );
  }

  return (
    <section className="page-shell">
      <div className="section-heading">
        <div>
          <span className="eyebrow">Compte</span>
          <h1>Mon profil</h1>
        </div>
      </div>

      <div style={{ maxWidth: 800, margin: '1.5rem auto' }}>
        <div style={{ padding: '1rem', background: '#fff', borderRadius: 8, color: '#111' }}>
          <p><strong>Nom :</strong> {currentUser.name || '-'}</p>
          <p><strong>Email :</strong> {currentUser.email}</p>
          <p><strong>Téléphone :</strong> {currentUser.phone || '-'}</p>
          <p><strong>Entreprise :</strong> {currentUser.company || '-'}</p>
        </div>

        <div style={{ marginTop: '1rem' }}>
          <button className="primary-button" onClick={() => onLogout()}>Se déconnecter</button>
        </div>
      </div>
    </section>
  );
}

export default ProfilePage;
