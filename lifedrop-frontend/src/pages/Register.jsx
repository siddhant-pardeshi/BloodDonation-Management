import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Droplets, Heart, Users, Stethoscope, ShieldCheck,
  UserPlus, AlertCircle, ArrowLeft
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/api';
import './Auth.css';

const roles = [
  { id: 'DONOR', label: 'Donor', icon: Heart, desc: 'Donate blood' },
  { id: 'RECEIVER', label: 'Receiver', icon: Stethoscope, desc: 'Request blood' },
  { id: 'ADMIN', label: 'Admin', icon: ShieldCheck, desc: 'Manage system' },
];

const bloodGroups = [
  'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE',
];

export default function Register() {
  const [activeRole, setActiveRole] = useState('DONOR');
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '', bloodGroup: 'A_POSITIVE',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      // Send role + form data to the backend
      const payload = {
        name: form.name,
        email: form.email,
        password: form.password,
        role: activeRole,
        phone: form.phone,
        // Only donors need a blood group
        bloodGroup: activeRole === 'DONOR' ? form.bloodGroup : null,
      };
      const res = await authApi.register(payload);
      loginUser(res.data);
      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
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
          <h1>Join the LifeDrop Family</h1>
          <p>Become part of a community dedicated to saving lives through blood donation.</p>
          <div className="auth-features">
            <div className="auth-feature">
              <div className="auth-feature-icon"><Heart size={20} /></div>
              <span>Free to join, always</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><Users size={20} /></div>
              <span>Connect with donors and receivers</span>
            </div>
            <div className="auth-feature">
              <div className="auth-feature-icon"><ShieldCheck size={20} /></div>
              <span>Your data stays private and secure</span>
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
          <h2>Create Your Account</h2>
          <p>Choose your role and fill in your details</p>

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
              <label>Full Name</label>
              <input
                name="name"
                type="text"
                required
                value={form.name}
                onChange={handleChange}
                placeholder={activeRole === 'RECEIVER' ? 'Hospital / Person name' : 'Your full name'}
              />
            </div>
            <div className="form-group">
              <label>Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={form.email}
                onChange={handleChange}
                placeholder="you@example.com"
              />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Password</label>
                <input
                  name="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={handleChange}
                  placeholder="Create a password"
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  name="phone"
                  type="tel"
                  required
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+91 98765 43210"
                />
              </div>
            </div>
            {/* Only donors need to pick a blood group */}
            {activeRole === 'DONOR' && (
              <div className="form-group">
                <label>Blood Group</label>
                <select name="bloodGroup" value={form.bloodGroup} onChange={handleChange}>
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
            )}
            <button type="submit" className="btn-submit" disabled={loading}>
              <UserPlus size={18} />
              {loading ? 'Creating account...' : `Register as ${roles.find(r => r.id === activeRole).label}`}
            </button>
          </form>

          <div className="auth-footer">
            Already have an account? <Link to="/login">Login here</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
