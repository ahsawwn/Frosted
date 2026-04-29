import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

// Protects the Dashboard: If no token, go to Login
export const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('accessToken');
  return token ? children : <Navigate to="/login" replace />;
};

// Protects Login/Landing: If token exists, go to Dashboard
export const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const token = localStorage.getItem('accessToken');
  return token ? <Navigate to="/dashboard" replace /> : children;
};