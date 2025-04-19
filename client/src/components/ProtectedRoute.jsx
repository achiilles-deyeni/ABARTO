import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';

// This component wraps routes that require authentication
const ProtectedRoute = () => {
  const { token, isLoading } = useAuth();

  if (isLoading) {
    // Show a loading indicator while checking auth status
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  // If loading is finished and there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // If loading is finished and there IS a token, render the child route content
  return <Outlet />;
};

export default ProtectedRoute; 