import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    const token = localStorage.getItem('authToken');
    const storedName = localStorage.getItem('userName'); 
    setIsAuthenticated(!!token);
    if (storedName) {
      setName(`Welcome\u00A0\u00A0${storedName}`); 
    }
  }, []);

  const login = (token, namee) => {
    localStorage.setItem('authToken', token);
    localStorage.setItem('userName', namee); 
    setIsAuthenticated(true);
    setName("Welcome\u00A0\u00A0" + namee);
  };

  const logout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName'); 
    setIsAuthenticated(false);
    setName("");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, name, setName }}>
      {children}
    </AuthContext.Provider>
  );
};