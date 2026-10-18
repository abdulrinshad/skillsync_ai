import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminRoute = ({ children }) => {
  const { user: authUser, loading } = useAuth();

  // Also check direct localStorage per requirements
  const token = localStorage.getItem('token_admin') || localStorage.getItem('token');
  const localUserStr = localStorage.getItem('user_admin') || localStorage.getItem('user');
  let localUser = null;

  try {
    if (localUserStr) {
      localUser = JSON.parse(localUserStr);
    }
  } catch (e) {
    console.error('Error parsing user from localStorage', e);
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex items-center justify-center text-white">
        <div className="w-10 h-10 border-4 border-purple-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Verify access requirements
  const isAuthenticatedAdmin = (authUser && authUser.role === 'admin') || (token && localUser && localUser.role === 'admin');

  if (!isAuthenticatedAdmin) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default AdminRoute;
