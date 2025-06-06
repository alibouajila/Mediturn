import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar">
      <div className="navbar-container">
        <div><Link to="/" className="navbar-logo">Mediturn</Link> </div>
        <ul className="navbar-links">
          <li><Link to="/" className="navbar-link">Acceuil</Link></li>
          <li><Link to="/about" className="navbar-link">A propos</Link></li>
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
