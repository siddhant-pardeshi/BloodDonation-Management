import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * ProtectedRoute — wraps protected pages.
 * If the user is not logged in, redirect them to /login.
 *
 * Optional `roles` prop restricts access to specific roles:
 *   <ProtectedRoute roles={['ADMIN']}> ... </ProtectedRoute>
 */
export default function ProtectedRoute({ roles }) {
  const { user, loading } = useAuth();

  // While we check the session, show a loading message
  if (loading) {
    return (
      <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>
        Loading...
      </div>
    );
  }

  // Not logged in → go to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Logged in but wrong role → go to dashboard
  if (roles && !roles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />;
  }

  // Everything is fine — render the child route
  return <Outlet />;
}
