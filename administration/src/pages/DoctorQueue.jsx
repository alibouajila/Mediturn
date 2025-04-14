import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import "./doctorqueue.css"; 
const DoctorQueue = () => {
  const { doctorId } = useParams();
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctorName, setDoctorName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctorAndPatients = async () => {
      try {
        const token = localStorage.getItem('token');

        // Get doctor data
        const doctorRes = await axios.get(`http://localhost:3001/users/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setDoctorName(doctorRes.data.fullName);

        // Get patients associated with this doctor
        const patientRes = await axios.get(`http://localhost:3001/users/by-doctor/${doctorId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setPatients(patientRes.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchDoctorAndPatients();
  }, [doctorId]);

  return (
    <div className="queue-container">
      <h2>Queue for Dr. {doctorName}</h2>
      <button onClick={() => navigate(-1)}>← Back</button>
      {loading ? (
        <p>Loading patients...</p>
      ) : (
        <ul>
          {patients.length === 0 ? (
            <li>No patients found for this doctor.</li>
          ) : (
            patients.map((patient) => (
              <li key={patient._id}>
                {patient.fullName} (CIN: {patient.cin}) - Phone: {patient.phoneNumber}
              </li>
            ))
          )}

        </ul>
      )}
    </div>
  );
};

export default DoctorQueue;
