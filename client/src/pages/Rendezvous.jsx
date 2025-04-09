import React, { useState } from 'react';
import './RendezVous.css';

function RendezVous() {
  const [formData, setFormData] = useState({
    fullName: '',
    CIN: '',
    dateOfBirth: '',
    gender: '',
    phoneNumber: '',
    address: '',
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    setTimeout(() => setMessage(''), 2000);
    e.preventDefault();
    setMessage('');
    try {
        const res = await fetch('http://localhost:3000/patients/register', {
            method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("Inscription effectuée avec succès. Nous vous contacterons prochainement pour confirmer votre rendez-vous.");
        setFormData({
          fullName: '',
          CIN: '',
          dateOfBirth: '',
          gender: '',
          phoneNumber: '',
          address: '',
        });
      } else {
        setMessage(data.message || 'Une erreur est survenue.');
      }
    } catch (err) {
      setMessage('Erreur serveur. Réessayez plus tard.');
    }
  };

  return (
    <div className="rendezvous-container">
      <form className="rendezvous-form" onSubmit={handleSubmit}>
        <h2>Prenez un rendez-vous</h2>
        <input
          type="text"
          name="fullName"
          placeholder="Nom complet"
          value={formData.fullName}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="CIN"
          placeholder="CIN (8 chiffres)"
          value={formData.CIN}
          onChange={handleChange}
          pattern="\d{8}"
          required
        />

        <input
          type="date"
          name="dateOfBirth"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />

        <select name="gender" value={formData.gender} onChange={handleChange} required>
          <option value="">Genre</option>
          <option value="Male">Homme</option>
          <option value="Female">Femme</option>
          <option value="Other">Autre</option>
        </select>

        <input
          type="tel"
          name="phoneNumber"
          placeholder="Numéro de téléphone"
          value={formData.phoneNumber}
          onChange={handleChange}
          pattern="\d{8,13}"
          required
        />

        <textarea
          name="address"
          placeholder="Adresse"
          value={formData.address}
          onChange={handleChange}
          required
        />

        <button type="submit">Confirmer </button>
        {message && (
  <div className={`overlay-alert ${message.includes('succès') ? 'success' : 'error'}`}>
    <span className="icon">✔️</span>
    <span>{message}</span>
  </div>
)}

      </form>
      
    </div>
    
  );
}

export default RendezVous;
