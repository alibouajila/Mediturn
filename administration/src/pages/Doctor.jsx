import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./doctor.css"
const Doctor = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    
    if (!token) {
      navigate('/login');
      return;
    }

    const fetchPatients = async () => {
      try {
        const res = await axios.get('http://localhost:3001/users/my-patients', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPatients(res.data);
      } catch (err) {
        toast.error('Failed to fetch patients. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [navigate]);

  const deletePatient = async (patientId) => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.delete(`http://localhost:3001/patients/${patientId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success('Patient deleted successfully!');
      setPatients(patients.filter(patient => patient._id !== patientId)); // Remove deleted patient from UI
    } catch (err) {
      toast.error('Failed to delete patient. Please try again.');
    }
  };

  return (
    <div className="doctor-dashboard">
      <h2>Doctor Dashboard</h2>

      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <>
          {patients.length === 0 ? (
            <p style={{textAlign:"center",marginTop:"30vh"}}>No patients assigned to you yet.</p>
          ) : (
            <div className="patients-list" id='patients-listt'>
              {patients.map((patient) => (
                <div key={patient._id} className="patient-card">
                  <h3>{patient.fullName}</h3>
                  <p>CIN: {patient.CIN}</p>
                  <p>Phone: {patient.phoneNumber}</p>
<p>Date of Birth: {new Date(patient.dateOfBirth).toLocaleDateString('en-US')}</p>
                  <p>Gender: {patient.gender}</p>
                  <button
                    className="delete-button"
                    onClick={() => deletePatient(patient._id)}
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default Doctor;
