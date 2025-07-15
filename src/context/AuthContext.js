// frontend/src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { authApi } from '../api'; // Your API service

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to load user from API after successful login or token refresh
  const loadUser = useCallback(async () => {
    try {
      const response = await authApi.getMe(); // Fetch user details from /accounts/me/
      setUser(response.data);
    } catch (error) {
      console.error('Failed to load user data:', error);
      setUser(null); // Clear user if fetching fails
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    // On app load, try to load user if tokens exist
    const accessToken = localStorage.getItem('access_token');
    const refreshToken = localStorage.getItem('refresh_token');
    if (accessToken || refreshToken) {
      loadUser();
    } else {
      setLoading(false); // No tokens, no user to load
    }
  }, [loadUser]);

  const login = async (username, password) => {
    setLoading(true);
    try {
      const response = await authApi.login(username, password);
      localStorage.setItem('access_token', response.data.access);
      localStorage.setItem('refresh_token', response.data.refresh);
      await loadUser(); // Fetch user data after successful login
      return true; // Indicate success
    } catch (error) {
      console.error('Login failed:', error.response?.data || error.message);
      setUser(null);
      setLoading(false);
      return false; // Indicate failure
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    // Optional: Call a backend logout endpoint if you have one (e.g., to blacklist refresh token)
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      await authApi.register(userData);
      // After successful registration, you might want to automatically log them in
      await login(userData.username, userData.password); // Or handle login separately
      return true;
    } catch (error) {
      console.error('Registration failed:', error.response?.data || error.message);
      setLoading(false);
      return false;
    }
  };


  const value = { user, loading, login, logout, register, loadUser };

  return (
    <AuthContext.Provider value={value}>
      {!loading ? children : <div>Loading authentication...</div>} {/* Simple loading indicator */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

// In your index.js or App.js, wrap your app with AuthProvider
// <AuthProvider>
//   <App />
// </AuthProvider>