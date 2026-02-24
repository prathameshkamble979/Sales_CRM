import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// Redirects to /dashboard if role doesn't match
const AdminRoute = ({ children }) => {
    const { user, loading } = useAuth();

    if (loading) return <div className="loading">Loading...</div>;
    if (!user) return <Navigate to="/login" replace />;
    if (user.role !== 'admin') return <Navigate to="/dashboard" replace />;

    return children;
};

export default AdminRoute;
