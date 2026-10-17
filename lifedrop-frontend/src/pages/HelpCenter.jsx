import React from 'react';
import { HelpCircle, FileText, MessageCircle, Mail } from 'lucide-react';
import './Pages.css';

export default function HelpCenter() {
  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Help Center</h2>
          <p>Find answers, tutorials, and support</p>
        </div>
      </div>

      <div className="camps-grid" style={{ marginTop: 24 }}>
        <div className="camp-grid-card" style={{ padding: '24px' }}>
          <div className="camp-grid-icon">
            <FileText size={24} />
          </div>
          <div className="camp-grid-info">
            <h3>FAQs</h3>
            <p className="camp-meta" style={{ marginTop: 8 }}>Find answers to commonly asked questions about blood donation and eligibility.</p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 16 }}>Read FAQs</button>
        </div>

        <div className="camp-grid-card" style={{ padding: '24px' }}>
          <div className="camp-grid-icon">
            <MessageCircle size={24} />
          </div>
          <div className="camp-grid-info">
            <h3>Community Forum</h3>
            <p className="camp-meta" style={{ marginTop: 8 }}>Connect with other donors and hospitals in our active community forum.</p>
          </div>
          <button className="btn btn-secondary" style={{ marginTop: 16 }}>Join Forum</button>
        </div>

        <div className="camp-grid-card" style={{ padding: '24px' }}>
          <div className="camp-grid-icon">
            <Mail size={24} />
          </div>
          <div className="camp-grid-info">
            <h3>Contact Support</h3>
            <p className="camp-meta" style={{ marginTop: 8 }}>Need specific help? Reach out to our 24/7 technical support team.</p>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 16 }}>Email Support</button>
        </div>
      </div>
    </div>
  );
}
