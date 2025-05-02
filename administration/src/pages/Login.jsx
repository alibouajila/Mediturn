// Login.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import './login.css';
const Login = () => {
    const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post('http://localhost:3001/users/login', {
        email: formData.email,
        password: formData.password,
      });

      setMessage(res.data.message);
      setIsSuccess(true);
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('role', res.data.role); 
      if(res.data.role === 'assistant') {
        navigate('/assistant');
      } else if(res.data.role === 'doctor') {
        navigate('/doctor');
      }
    } catch (err) {
      setMessage(err.response?.data?.message || 'Login failed');
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
    <div className="login-container">
      <h2>Se connecter</h2>
      {message && (
        <p className={isSuccess ? 'message-success' : 'message-error'}>
          {message}
        </p>
      )}
      <form onSubmit={handleSubmit}>
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
        <button type="submit">Se connecter</button>
      </form>
    </div>
  );
};

export default Login;
