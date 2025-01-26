import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './welcome.css';

const Welcome = () => {
  const navigate = useNavigate();
  const isAuthenticated = localStorage.getItem('authToken') !== null;   

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/home'); 
    }
  }, [isAuthenticated, navigate]);

  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="welcome-container">
      <h1 className="welcome-header">Welcome to MyDailyNotes</h1>
      <p className="welcome-description">
        Organize your thoughts, track your progress, and manage your daily notes with ease.
        Create an account or log in to get started!
      </p>
      <div className="welcome-buttons">
        <Link to="/signup" className="welcome-link">Sign Up</Link>
        <Link to="/login" className="welcome-link">Login</Link>
      </div>
    </div>
  );
};

export default Welcome;
