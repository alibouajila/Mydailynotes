import React, { useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext'; 
import './nav.css';

const Navbar = () => {
  const navigate = useNavigate();
  const { isAuthenticated, logout,name,setName } = useContext(AuthContext); 
  const handleLogout = () => {
    logout(); 
    navigate('/login'); 
  };
  return (
    <nav className="navbar">
      <div className="navbar-content">
        <Link to="/" className="navbar-logo">Mydailynotes</Link>
        <Link className='welcome-msg'>{name}</Link>
        <div className="navbar-links">
          {!isAuthenticated ? (
            <>
              <Link to="/login" className="navbar-link">Login</Link>
              <Link to="/signup" className="navbar-link">Sign Up</Link>
            </>
          ) : (
            <button onClick={handleLogout} className="navbar-link">Logout</button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
