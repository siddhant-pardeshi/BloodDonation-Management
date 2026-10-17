import React from 'react';
import { Settings as SettingsIcon, Bell, Shield, Moon, User } from 'lucide-react';
import './Pages.css';

export default function Settings() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Settings</h2>
          <p>Manage your account preferences</p>
        </div>
      </div>

      <div className="dashboard-section" style={{ marginTop: 24 }}>
        <div className="section-header">
          <h3>Account Settings</h3>
        </div>
        <div className="settings-list">
          <div className="settings-item" style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
            <User size={24} style={{ marginRight: 16, color: 'var(--text-secondary)' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Profile Information</h4>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Update your name, email, and contact details</p>
            </div>
            <button className="btn btn-secondary">Edit</button>
          </div>
          
          <div className="settings-item" style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
            <Bell size={24} style={{ marginRight: 16, color: 'var(--text-secondary)' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Notifications</h4>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Manage email alerts and push notifications</p>
            </div>
            <button className="btn btn-secondary">Configure</button>
          </div>

          <div className="settings-item" style={{ display: 'flex', alignItems: 'center', padding: '16px 0', borderBottom: '1px solid var(--border-color)' }}>
            <Shield size={24} style={{ marginRight: 16, color: 'var(--text-secondary)' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Security</h4>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Change password and secure your account</p>
            </div>
            <button className="btn btn-secondary">Manage</button>
          </div>

          <div className="settings-item" style={{ display: 'flex', alignItems: 'center', padding: '16px 0' }}>
            <Moon size={24} style={{ marginRight: 16, color: 'var(--text-secondary)' }} />
            <div style={{ flex: 1 }}>
              <h4 style={{ margin: 0, color: 'var(--text-primary)' }}>Appearance</h4>
              <p style={{ margin: '4px 0 0', fontSize: 14, color: 'var(--text-secondary)' }}>Toggle dark mode (Coming Soon)</p>
            </div>
            <button className="btn btn-secondary" disabled>Disabled</button>
          </div>
        </div>
      </div>
    </div>
  );
}
