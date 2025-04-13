import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './assistant.css';

const Assistant = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token || role !== 'assistant') {
      navigate('/login');
    } else {
      fetchPatients();
      fetchDoctors();
    }
  }, [navigate]);

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/patients/unverified', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to load patients. Please try again.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/users/doctors', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setDoctors(res.data);
    } catch (err) {
      setError('Failed to load doctors.');
    }
  };

  const handleVerifyClick = (id) => {
    setCurrentPatientId(id);
    setIsModalOpen(true);
  };

  const handleVerify = async () => {
    if (!selectedDoctor) {
      setError('Please select a doctor.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/patients/verify/${currentPatientId}`, { doctorId: selectedDoctor }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage('Patient successfully verified and associated with a doctor!');
      fetchPatients(); 
      setLoading(false);
      setIsModalOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      setLoading(false);
      setError('Failed to verify patient. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/patients/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      fetchPatients();
      setSuccessMessage('Patient successfully deleted!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setError('Failed to delete patient. Please try again.');
    }
  };

  return (
    <div className="assistant-container">
      <h2>Unverified Patients</h2>
      {loading && <p>Loading patients...</p>}
      {error && <p className="error-message">{error}</p>}
      {successMessage && <p className="success-message">{successMessage}</p>}

      {patients.length === 0 && !loading ? (
        <p>No unverified patients to show.</p>
      ) : (
        <div className="patients-list">
          {patients.map((patient) => (
            <div key={patient._id} className="patient-card">
              <h3>{patient.fullName}</h3>
              <p>CIN: {patient.cin}</p>
              <p>Phone: {patient.phone}</p>
              {patient.doctor && <p className="assigned-doctor">Assigned to: Dr. {patient.doctor.fullName}</p>}
              <div className="actions">
                <button
                  onClick={() => handleVerifyClick(patient._id)}
                  disabled={loading || !!patient.doctor}
                >
                  {patient.doctor ? 'Already Assigned' : 'Verify'}
                </button>
                <button
                  onClick={() => handleDelete(patient._id)}
                  className="delete-btn"
                  disabled={loading}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Select a Specialist</h3>
            <select 
              onChange={(e) => setSelectedDoctor(e.target.value)} 
              value={selectedDoctor || ''}
            >
              <option value="">-- Select a Doctor --</option>
              {doctors.map((doctor) => (
                <option key={doctor._id} value={doctor._id}>
                  {doctor.fullName}
                </option>
              ))}
            </select>
            <div className="modal-actions">
              <button onClick={handleVerify} disabled={loading}>Verify Patient</button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Assistant;
