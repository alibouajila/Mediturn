import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './assistant.css';

const Assistant = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPatientId, setCurrentPatientId] = useState(null);
  const [showDoctorDropdown, setShowDoctorDropdown] = useState(false);

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
        headers: { Authorization: `Bearer ${token}` },
      });
      setPatients(res.data);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Failed to load patients. Please try again.');
    }
  };

  const fetchDoctors = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:3001/users/doctors', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDoctors(res.data);
    } catch (err) {
      toast.error('Failed to load doctors.');
    }
  };
  const handleEndWorkDay = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch('http://localhost:3001/users/clear-all', {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
  
      toast.success('All doctor queues have been cleared!');
      
      // Refresh patient list after clearing
      fetchPatients();
  
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Failed to clear doctor queues.');
    }
  };
  
  
  const handleVerifyClick = (id) => {
    setCurrentPatientId(id);
    setIsModalOpen(true);
  };

  const handleVerify = async () => {
    if (!selectedDoctor) {
      toast.error('Please select a doctor.');
      return;
    }

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.patch(`http://localhost:3001/patients/verify/${currentPatientId}`, {
        doctorId: selectedDoctor,
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success('Patient successfully verified and associated with a doctor!');
      fetchPatients();
      setLoading(false);
      setIsModalOpen(false);
      setSelectedDoctor(null);
    } catch (err) {
      setLoading(false);
      toast.error('Failed to verify patient. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      await axios.delete(`http://localhost:3001/patients/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchPatients();
      toast.success('Patient successfully deleted!');
      setLoading(false);
    } catch (err) {
      setLoading(false);
      toast.error('Failed to delete patient. Please try again.');
    }
  };

  return (
    <div className="page-wrapper">
      
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      <div className="assistant-container">
        <div className="dropdown-section">
          <button className="dropdown-toggle" onClick={() => setShowDoctorDropdown(prev => !prev)}>
            Doctor Queue
          </button>
          <div className={`dropdown-menu ${showDoctorDropdown ? 'show' : ''}`}>
            {doctors.map((doc) => (
              <button key={doc._id} onClick={() => navigate(`/doctor-queue/${doc._id}`)}>
                Dr. {doc.fullName}
              </button>
            ))}
          </div>
        </div>
        <div className="end-day-section">
  <button
    className="end-day-btn"
    onClick={handleEndWorkDay}
    disabled={loading}
  >
    End Work Day
  </button>
</div>

        <h2 style={{ textAlign: 'center' }}>Unverified Patients</h2>
        {loading && <p>Loading patients...</p>}

        {patients.length === 0 && !loading ? (
          <p style={{ textAlign: 'center' }}>No unverified patients to show.</p>
        ) : (
          <div className="patients-list">
            {patients.map((patient) => (
              <div key={patient._id} className="patient-card">
                <h3>{patient.fullName}</h3>
                <p>CIN: {patient.CIN}</p>
                  <p>Phone: {patient.phoneNumber}</p>
<p>Date of Birth: {new Date(patient.dateOfBirth).toLocaleDateString('en-US')}</p>
                  <p>Gender: {patient.gender}</p>
                {patient.doctor && (
                  <p className="assigned-doctor">Assigned to: Dr. {patient.doctor.fullName}</p>
                )}
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
    </div>
  );
};

export default Assistant;
