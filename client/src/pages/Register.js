import React, { useState} from 'react';
import {useNavigate,Link} from 'react-router-dom'
import axios from 'axios';
import "./register.css"
function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const navigate=useNavigate();
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Passwords do not match!");
      return;
    }
    if (password.length<=5) {
      setError("Passwords is too weak !");
      return;
    }

    setError(null);

    const userData = {
      name,
      email,
      password,
    };

    try {
      const response = await axios.post("http://localhost:3001/register", userData);

      setSuccess("Registration successful!");
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setError(null);
      navigate("/login")
    } catch (err) {
      if (err.response && err.response.data) {
        setError(err.response.data.message || "Registration failed!");
      } else {
        setError("An error occurred, please try again.");
      }
    }
  };

  return (
    <div className="container">
      <h2>Register!</h2>

      {error && <p className="error">{error}</p>}
      {success && <p className="success">{success}</p>}

      <form onSubmit={handleSubmit}>
        <input
          className="input"
          onChange={(e) => setName(e.target.value)}
          value={name}
          type="text"
          required
          placeholder="Full name"
        />
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
        <input
          className="input"
          onChange={(e) => setConfirmPassword(e.target.value)}
          value={confirmPassword}
          type="password"
          required
          placeholder="Confirm password"
        />
        <button className="button" type="submit">
          Register
        </button>
       <p><Link to="/login">Have an account ? </Link></p> 
      </form>
    </div>
  );
}

export default Register;
