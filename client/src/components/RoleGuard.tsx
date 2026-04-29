import type { JSX } from 'react';
import { Navigate } from 'react-router-dom';

export const RoleGuard = ({ children, allowedRole }: { children: JSX.Element, allowedRole: string }) => {
  // We'll decode the user role from the local storage or a context
  // For now, let's assume you store a simple 'userRole' or check the user object
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  
  if (user.role !== allowedRole) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};