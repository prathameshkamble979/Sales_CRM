import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/AdminRoute';

import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import LeadList from './pages/LeadList';
import LeadForm from './pages/LeadForm';
import LeadDetail from './pages/LeadDetail';
import UserList from './pages/UserList';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={<PrivateRoute><Dashboard /></PrivateRoute>}
          />
          <Route
            path="/leads"
            element={<PrivateRoute><LeadList /></PrivateRoute>}
          />
          <Route
            path="/leads/new"
            element={<PrivateRoute><LeadForm /></PrivateRoute>}
          />
          <Route
            path="/leads/:id"
            element={<PrivateRoute><LeadDetail /></PrivateRoute>}
          />
          <Route
            path="/leads/:id/edit"
            element={<PrivateRoute><LeadForm /></PrivateRoute>}
          />

          {/* Admin only */}
          <Route
            path="/users"
            element={<AdminRoute><UserList /></AdminRoute>}
          />

          {/* Default redirect */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
