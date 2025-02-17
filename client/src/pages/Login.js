import React, { useState, useContext,useEffect} from 'react';
import { useNavigate,Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext); 

  const handleSubmit = async (e) => {
    e.preventDefault();

    const loginData = {
      email,
      password,
    };

    try {
      const response = await axios.post(
        'http://localhost:3001/login',
        loginData,
        { withCredentials: true } 
      );
            const token=response.data.token;
      const name=response.data.name;

      if (token) {
        login(token,name); 
        setSuccess('Login successful!');
        setEmail('');
        setPassword('');
        setError(null);
        navigate('/Home'); 
      } else {
        setError('Invalid credentials!');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed!');
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('authToken');
    if (token) {
      navigate('/home'); 
    }
  }, [navigate]);
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
        <p><Link to="/Signup">Dont you have an account ? </Link></p> 
      </form>
    </div>
  );
}

export default Login;
