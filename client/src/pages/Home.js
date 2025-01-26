import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
function Home() {
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('authToken');

    if (!token) {
      navigate('/login');
    } else {
      axios
        .get('http://localhost:3001/home', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        .then((response) => {
          setMessage(response.data.message); 
        })
        .catch((error) => {
          navigate('/login');
        });
    }
  }, [navigate]);

  return (
    <div>
      <h2>Home</h2>
      <p>{message || 'Loading...'}</p>
    </div>
  );
}

export default Home;
