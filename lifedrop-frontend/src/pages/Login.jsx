import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets, Heart, Users, Stethoscope, ShieldCheck,
  LogIn, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';
import './Auth.css';

const roles = [
  { id: 'DONOR', label: 'Donor', icon: Heart, desc: 'Donate blood and save lives' },
  { id: 'RECEIVER', label: 'Receiver', icon: Stethoscope, desc: 'Request blood for patients' },
  { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Manage the entire system' },
];

export default function Login() {
  const [activeRole, setActiveRole] = useState('DONOR');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // The backend validates email + password and ensures the role matches.
      const res = await authApi.login({ email, password, role: activeRole });
      loginUser(res.data);
      // Send user to their dashboard after login
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      {/* Left branding panel */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div className="brand-logo">
            <Droplets size={32} />
            <span>LifeDrop</span>
          </div>
          <h1>Welcome Back, Hero</h1>
          <p>Your generosity has the power to save lives. Log in to continue your journey.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><Heart size={20} /></div>
              <span>Track your donations and impact</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Users size={20} /></div>
              <span>Join a community of lifesavers</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><ShieldCheck size={20} /></div>
              <span>Safe, secure, and verified platform</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="auth-right">
        <div className="auth-card">
          <Link to="/" className="back-home">
            <ArrowLeft size={16} /> Back to Home
          </Link>
          <h2>Login to Your Account</h2>
          <p>Select your role and sign in to continue</p>

          {/* Role tabs */}
          <div className="role-tabs">
            {roles.map((r) => (
              <button
                key={r.id}
                type="button"
                className={`role-tab ${activeRole === r.id ? 'active' : ''}`}
                onClick={() => setActiveRole(r.id)}
              >
                <r.icon size={20} />
                {r.label}
              </button>
            ))}
          </div>

          {error && (
            <div className="auth-error">
              <AlertCircle size={16} /> {error}
            </div>
          )}

          <form className="auth-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </div>
            <button type="submit" className="btn-submit" disabled={loading}>
              <LogIn size={18} />
              {loading ? 'Signing in...' : `Login as ${roles.find(r => r.id === activeRole).label}`}
            </button>
          </form>

          <div className="auth-footer">
            Don't have an account? <Link to="/register">Sign up here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
