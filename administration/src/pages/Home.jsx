import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Home = () => {
  const navigate=useNavigate()
   useEffect(() => {
      const token = localStorage.getItem('token');
      const role = localStorage.getItem('role');
  
      if (token && role) {
        if (role === 'assistant') {
          navigate('/assistant');
        } else if (role === 'doctor') {
          navigate('/doctor');
        }
      }
    }, [navigate]);
  return (
    <div className="home-container">
      <div className="home-content">
        <h1>Welcome to <span>Mediturn</span></h1>
        <p>Your smart solution for managing medical appointments and patient flow.</p>
        <div className="home-buttons">
          <Link to="/signup" className="btn primary-btn">Sign Up</Link>
          <Link to="/login" className="btn secondary-btn">Log In</Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
