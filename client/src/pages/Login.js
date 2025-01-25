import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import './login.css';
function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post('http://localhost:3001/login', loginData);

      setSuccess('Login successful!');
      setEmail('');
      setPassword('');
      setError(null);

      navigate('/Home'); 
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || 'Login failed!');
      } else {
        setError('An error occurred, please try again.');
      }
    }
  };

  return (
    <div className="login-container">
      <h2>Login</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          type="email"
          required
          placeholder="Email"
        />
        <input
          className="input"
          onChange={(e) => setPassword(e.target.value)}
          value={password}
          type="password"
          required
          placeholder="Password"
        />
        <button className="button" type="submit">
          Login
        </button>
      </form>

      <p>
        Don't have an account? <Link to="/signup">Register</Link>
      </p>
    </div>
  );
}

export default Login;
