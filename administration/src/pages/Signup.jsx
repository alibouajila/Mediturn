// Signup.jsx
import React, { useState } from 'react';
import axios from 'axios';
import './signup.css';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'doctor',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { fullName, email, password, confirmPassword, role } = formData;

    if (password !== confirmPassword) {
      setIsSuccess(false);
      return setMessage('Passwords do not match');
    }

    try {
      const res = await axios.post('http://localhost:3001/users/register', {
        fullName,
        email,
        password,
        role,
      });
      setMessage(res.data.message);
      setIsSuccess(true);
      setFormData({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'doctor',
      })
      navigate('/login')
      ;
    } catch (err) {
      setMessage(err.response?.data?.message || 'Registration failed');
      setIsSuccess(false);
    }
  };
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
    <div className="signup-container">
      <h2>S'inscrire</h2>
      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="fullName"
          placeholder="Nom"
          value={formData.fullName}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Mot de passe"
          value={formData.password}
          onChange={handleChange}
          required
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirmer le mot de passe"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />
        <select name="role" value={formData.role} onChange={handleChange}>
          <option value="doctor">Docteur</option>
          <option value="assistant">Assistant</option>
        </select>
        <button type="submit">S'inscrire</button>
      </form>
    </div>
  );
};

export default Signup;
