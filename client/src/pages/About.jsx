import React from 'react';
import './about.css';

function About() {
  return (
    <div className="about-wrapper">
      <div className="about-hero">
        <h1 className="about-title">À propos de <span>Mediturn</span></h1>
        <p className="about-subtitle">
          Simplifiez vos rendez-vous médicaux. Gagnez du temps. Restez informé.
        </p>
      </div>

      <div className="about-content">
        <section className="about-section">
          <h2>🌟 Notre mission</h2>
          <p>
            Offrir aux patients une plateforme intuitive pour réserver et suivre leurs rendez-vous médicaux, tout en
            facilitant la gestion pour les professionnels de santé.
          </p>
        </section>

        <section className="about-section">
          <h2>🚀 Ce que nous proposons</h2>
          <ul>
            <li>✔️ Prise de rendez-vous rapide et fluide</li>
            <li>✔️ Numéro de passage et estimation horaire</li>
            <li>✔️ Paiement sécurisé en ligne</li>
            <li>✔️ Notifications automatiques à l’approche de l’heure</li>
          </ul>
        </section>

        <section className="about-section">
          <h2>🔐 Sécurité & confidentialité</h2>
          <p>
            Vos données sont précieuses. Mediturn applique les meilleures pratiques de sécurité pour protéger chaque
            information partagée sur la plateforme.
          </p>
        </section>

        <section className="about-section">
          <h2>👨‍💻 À propos de nous</h2>
          <p>
            Nous sommes une équipe jeune, passionnée par la technologie et la santé. Notre objectif est de connecter
            l’univers médical à l’ère numérique de façon simple et humaine.
          </p>
        </section>
      </div>
    </div>
  );
}

export default About;
