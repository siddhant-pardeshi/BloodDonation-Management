import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard, Users, Droplets, FileText, Tent,
  Settings, HelpCircle, LogOut, Heart, Calendar, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './Sidebar.css';

// Navigation items per role.
// ADMIN sees everything. DONOR sees personal pages. RECEIVER sees request pages.
const navByRole = {
  ADMIN: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/donors', icon: Users, label: 'Donors' },
    { path: '/inventory', icon: Droplets, label: 'Blood Inventory' },
    { path: '/requests', icon: FileText, label: 'Requests' },
    { path: '/camps', icon: Tent, label: 'Donation Camps' },
  ],
  DONOR: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-donations', icon: Heart, label: 'My Donations' },
    { path: '/inventory', icon: Droplets, label: 'Blood Inventory' },
    { path: '/camps', icon: Tent, label: 'Donation Camps' },
  ],
  RECEIVER: [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/my-requests', icon: FileText, label: 'My Requests' },
    { path: '/inventory', icon: Droplets, label: 'Blood Inventory' },
  ],
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, logoutUser } = useAuth();
  const items = navByRole[user?.role] || navByRole.DONOR;

  const handleLogout = async () => {
    await logoutUser();
    window.location.href = '/';
  };

  return (
    <>
      {isOpen && <div className="sidebar-overlay" onClick={onClose} />}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <Heart size={24} color="var(--color-primary)" fill="var(--color-primary)" />
            <span>LifeDrop</span>
          </div>
        </div>

        <nav className="sidebar-nav">
          <div className="nav-section-label">Main Menu</div>
          {items.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `nav-item ${isActive ? 'active' : ''}`
              }
              onClick={onClose}
            >
              <item.icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-footer">
          <div className="nav-section-label">Support</div>
          <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <Settings size={20} />
            <span>Settings</span>
          </NavLink>
          <NavLink to="/help" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`} onClick={onClose}>
            <HelpCircle size={20} />
            <span>Help Center</span>
          </NavLink>
          <button className="nav-item logout" onClick={handleLogout} style={{ width: '100%', background: 'none', border: 'none', textAlign: 'left' }}>
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
