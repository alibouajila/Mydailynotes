import React, { useContext } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';
import Navbar from './components/Nav';
import { AuthProvider, AuthContext } from './context/AuthContext';         
import Welcome from './pages/Welcome';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/signup" element={<Register />} />
          <Route path="/login" element={<Login />} />
                    <Route 
            path="/home" 
            element={<PrivateRoute><Home /></PrivateRoute>} 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

// Protected route for authentication
function PrivateRoute({ children }) {
  const { isAuthenticated } = useContext(AuthContext);

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  return children;
}

export default App;
