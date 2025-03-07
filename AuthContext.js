import React, { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // Set up axios defaults
  axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:8000';
  
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  }

  async function login(email, password) {
    try {
      // Format data for OAuth2 password flow
      const formData = new FormData();
      formData.append('username', email);
      formData.append('password', password);

      const response = await axios.post('/auth/token', formData);
      const { access_token } = response.data;
      
      // Store token
      localStorage.setItem('token', access_token);
      setToken(access_token);
      
      // Set default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
      
      // Fetch user data
      await fetchUserData();
      
      return true;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  }

  async function register(email, password) {
    try {
      const response = await axios.post('/auth/register', {
        email,
        password
      });
      
      // Auto-login after registration
      return login(email, password);
    } catch (error) {
      console.error("Registration error:", error);
      return false;
    }
  }

  async function fetchUserData() {
    try {
      const response = await axios.get('/auth/me');
      setCurrentUser(response.data);
      return response.data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      logout();
      return null;
    }
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setCurrentUser(null);
    delete axios.defaults.headers.common['Authorization'];
  }

  useEffect(() => {
    async function loadUser() {
      if (token) {
        await fetchUserData();
      }
      setLoading(false);
    }
    
    loadUser();
  }, [token]);

  const value = {
    currentUser,
    login,
    register,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
