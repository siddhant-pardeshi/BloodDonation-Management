import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import { useAuth } from './context/AuthContext';

// Public pages
import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';

// Protected pages
import Dashboard from './pages/Dashboard';
import Donors from './pages/Donors';
import Inventory from './pages/Inventory';
import Requests from './pages/Requests';
import Camps from './pages/Camps';
import MyDonations from './pages/MyDonations';
import MyRequests from './pages/MyRequests';
import Settings from './pages/Settings';
import HelpCenter from './pages/HelpCenter';

function App() {
  return (
    <Routes>
      {/* ===== PUBLIC ROUTES (no login needed) ===== */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* ===== PROTECTED ROUTES (login required) ===== */}
      <Route element={<ProtectedRoute />}>
        <Route element={<Layout />}>
          {/* All roles */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/inventory" element={<Inventory />} />
          <Route path="/camps" element={<Camps />} />

          {/* Admin only */}
          <Route path="/donors" element={<Donors />} />
          <Route path="/requests" element={<Requests />} />

          {/* Donor only */}
          <Route path="/my-donations" element={<MyDonations />} />

          {/* Receiver only */}
          <Route path="/my-requests" element={<MyRequests />} />
          
          {/* Support pages */}
          <Route path="/settings" element={<Settings />} />
          <Route path="/help" element={<HelpCenter />} />
        </Route>
      </Route>

      {/* Fallback: unknown URLs go to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
