import React from 'react';
import { MapPin, Mail, Phone, Check } from 'lucide-react';

export function ContactSection({ onSubmit, messageSent }) {
  return (
    <section className="contact-section">
      <div className="contact-container">
        <div className="contact-info">
          <h2>Contact</h2>
          <p>Contactez-nous pour toute question, commentaire ou demande. Remplissez simplement le formulaire ci-dessous et nous vous repondrons dans les plus brefs delais. Votre satisfaction est notre priorite</p>
          
          <div className="contact-details">
            <div className="contact-item">
              <MapPin size={20} />
              <div>
                <strong>Adresse</strong>
                <p>Agadir, Maroc</p>
              </div>
            </div>
            
            <div className="contact-item">
              <Mail size={20} />
              <div>
                <strong>Email</strong>
                <a href="mailto:contact@mortech-solutions.ma">contact@mortech-solutions.ma</a>
              </div>
            </div>
            
            <div className="contact-item">
              <Phone size={20} />
              <div>
                <strong>Telephone</strong>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
                <span> / </span>
                <a href="tel:+212528241743">+(212) 528 241 743</a>
              </div>
            </div>
          </div>

          <div className="contact-map">
            <iframe 
              title="Localisation Mortech Solutions"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3438.7889023755006!2d-9.598!3d30.427!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzDCsDI1JzM2LjAiTiA5wrAzNSc1Mi44Ilc!5e0!3m2!1sfr!2sma!4v1234567890" 
              width="100%" 
              height="300" 
              style={{border: 0, borderRadius: '8px'}}
              allowFullScreen="" 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade">
            </iframe>
          </div>
        </div>

        <div className="contact-form-wrapper">
          <h2>Service contact email</h2>
          <form onSubmit={onSubmit}>
            <label>
              <span>Nom (obligatoire)</span>
              <input type="text" required placeholder="Votre nom" />
            </label>
            
            <label>
              <span>E-mail (obligatoire)</span>
              <input type="email" required placeholder="votre.email@exemple.com" />
            </label>
            
            <label>
              <span>Sujet</span>
              <input type="text" placeholder="Sujet de votre message" />
            </label>
            
            <label>
              <span>Message (obligatoire)</span>
              <textarea required placeholder="Decrivez votre besoin..."></textarea>
            </label>
            
            <button className="primary-button" type="submit">Envoyer</button>
            {messageSent && <p className="success"><Check size={16} /> Votre message a ete envoye avec succes!</p>}
          </form>
        </div>
      </div>
    </section>
  );
}
