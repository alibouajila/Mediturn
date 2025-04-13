import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './assistant.css';

const VerifiedPatients = () => {
  const [patients, setPatients] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (!token || role !== 'assistant') {
      window.location.href = '/login';
    }
    const fetchVerified = async () => {
      try {
        const res = await axios.get('http://localhost:3001/patients/verified');
        setPatients(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchVerified();
  }, []);

  return (
    <div className="assistant-container">
      <h2>Verified Patients</h2>
      {patients.length === 0 ? (
        <p>No verified patients yet.</p>
      ) : (
        <div className="patients-list">
          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h3>{patient.fullName}</h3>
              <p>CIN: {patient.cin}</p>
              <p>Phone: {patient.phone}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default VerifiedPatients;
