import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Navbar.css';
const Navbar = () => {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem('token'); 

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div>
          <Link to="/" className="navbar-logo">Mediturn</Link>
        </div>
        <ul className="navbar-links">
          {!isLoggedIn ? (
            <>
              <li><Link to="/signup" className="navbar-link">sign up</Link></li>
              <li><Link to="/login" className="navbar-link">login</Link></li>
            </>
          ) : (
            <li>
            <img
              src="../../assets/logout.png"
              alt="Logout"
              className="logout-icon"
              onClick={handleLogout}
            />
          </li>
          )}
        </ul>
      </div>
    </header>
  );
};

export default Navbar;
