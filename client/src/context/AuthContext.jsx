import React, { createContext, useState, useContext, useEffect } from 'react';

// Create the context
const AuthContext = createContext(null);

// Create a provider component
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem('authToken') || null);
  const [user, setUser] = useState(null); // Can store user details like name/email
  const [isLoading, setIsLoading] = useState(true); // Check initial auth status

  // Function to handle login
  const login = (newToken, userData) => {
    localStorage.setItem('authToken', newToken);
    setToken(newToken);
    setUser(userData);
  };

  // Function to handle logout
  const logout = () => {
    localStorage.removeItem('authToken');
    setToken(null);
    setUser(null);
  };

  // Check if token is still valid on initial load (basic check)
  // A more robust check would involve verifying the token with the backend
  useEffect(() => {
    const storedToken = localStorage.getItem('authToken');
    if (storedToken) {
      // Here you might want to fetch user details based on the token
      // For simplicity, we'll assume the token means logged in for now
      // You'd typically decode the token or make an API call (/api/auth/me?)
      setToken(storedToken);
      // Fetch user data if needed
      // setUser(fetchedUserData);
    }
    setIsLoading(false);
  }, []);

  const value = {
    token,
    user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Custom hook to use the AuthContext
export const useAuth = () => {
  return useContext(AuthContext);
}; 