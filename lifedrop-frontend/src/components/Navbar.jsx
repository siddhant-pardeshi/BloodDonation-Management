import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Droplets, Bell, User, Search, Menu, LogOut, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Navbar.css';

export default function Navbar({ onToggleSidebar }) {
  const { user, isLoggedIn, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logoutUser();
    navigate('/');
  };

  // Pick a friendly label for the current role
  const roleLabel = user?.role
    ? user.role.charAt(0) + user.role.slice(1).toLowerCase()
    : '';

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="menu-toggle" onClick={onToggleSidebar}>
          <Menu size={22} />
        </button>
        <div className="navbar-brand">
          <div className="brand-icon">
            <Droplets size={28} color="var(--color-primary)" />
          </div>
          <div className="brand-text">
            <h1>LifeDrop</h1>
            <span className="brand-tagline">
              {isLoggedIn ? `${roleLabel} Portal` : 'Blood Donation Management'}
            </span>
          </div>
        </div>
      </div>

      <div className="navbar-center">
        <div className="search-bar">
          <Search size={18} />
          <input type="text" placeholder="Search..." />
        </div>
      </div>

      <div className="navbar-right">
        {isLoggedIn ? (
          <>
            <button className="nav-icon-btn">
              <Bell size={20} />
              <span className="notification-badge">3</span>
            </button>
            <div className="nav-profile">
              <div className="profile-avatar">
                <User size={18} />
              </div>
              <div className="profile-info">
                <span className="profile-name">{user.name}</span>
                <span className="profile-role">{roleLabel}</span>
              </div>
            </div>
            <button className="btn-logout" onClick={handleLogout} title="Logout">
              <LogOut size={18} />
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-login-link">Login</Link>
            <Link to="/register" className="nav-signup-btn">
              <Heart size={16} /> Sign Up
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
