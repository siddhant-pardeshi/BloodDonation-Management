import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Heart, Droplets, Calendar, CheckCircle2, Clock, MapPin, Tent
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { campApi } from '../api/api';
import './Pages.css';

export default function MyDonations() {
  const { user } = useAuth();
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await campApi.getUpcomingCamps();
      setCamps(res.data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    } finally {
      setLoading(false);
    }
  };

  // Calculate eligibility
  const lastDonation = user?.lastDonationDate;
  const daysSince = lastDonation
    ? Math.floor((new Date() - new Date(lastDonation)) / (1000 * 60 * 60 * 24))
    : null;
  const isEligible = !lastDonation || daysSince >= 90;
  const daysUntilEligible = isEligible ? 0 : 90 - daysSince;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My Donations</h2>
          <p>Track your donation history and eligibility</p>
        </div>
      </div>

      {/* Eligibility status card */}
      <div className={`eligibility-card ${isEligible ? 'eligible' : 'not-eligible'}`}>
        <div className="eligibility-left">
          {isEligible ? (
            <CheckCircle2 size={48} color="var(--color-success)" />
          ) : (
            <Clock size={48} color="var(--color-warning)" />
          )}
          <div>
            <h3>
              {isEligible ? 'You are eligible to donate!' : `Please wait ${daysUntilEligible} more days`}
            </h3>
            <p>
              {lastDonation
                ? `Your last donation was on ${new Date(lastDonation).toLocaleDateString('en-US', {
                    year: 'numeric', month: 'long', day: 'numeric'
                  })} (${daysSince} days ago)`
                : 'You have not donated yet. Find a camp and make your first donation!'}
            </p>
          </div>
        </div>
        <div className="eligibility-right">
          <div className="eligibility-stat">
            <span className="elig-label">Your Blood Group</span>
            <span className="elig-value blood">{user?.bloodGroup?.replace('_', ' ') || 'N/A'}</span>
          </div>
        </div>
      </div>

      {/* Donation history (mock from lastDonationDate) */}
      <div className="dashboard-section" style={{ marginTop: 24 }}>
        <div className="section-header">
          <h3>Donation History</h3>
        </div>
        {lastDonation ? (
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Blood Group</th>
                <th>Status</th>
                <th>Impact</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{new Date(lastDonation).toLocaleDateString('en-US', {
                  year: 'numeric', month: 'long', day: 'numeric'
                })}</td>
                <td><span className="blood-group-badge">{user?.bloodGroup?.replace('_', ' ')}</span></td>
                <td><span className="status-badge status-fulfilled">Completed</span></td>
                <td> potentially saved 3 lives</td>
              </tr>
            </tbody>
          </table>
        ) : (
          <div className="empty-state">
            <Heart size={48} />
            <p>No donations yet. Your journey as a hero starts here!</p>
          </div>
        )}
      </div>

      {/* Upcoming camps where they can donate */}
      <div className="dashboard-section" style={{ marginTop: 24 }}>
        <div className="section-header">
          <h3>Find a Donation Camp Near You</h3>
          <Link to="/camps" className="view-all-btn">View All</Link>
        </div>
        {loading ? (
          <div className="loading">Loading camps...</div>
        ) : camps.length > 0 ? (
          <div className="camps-grid">
            {camps.slice(0, 4).map((camp) => (
              <div key={camp.id} className="camp-grid-card">
                <div className="camp-grid-icon">
                  <Tent size={24} />
                </div>
                <div className="camp-grid-info">
                  <h3>{camp.campName}</h3>
                  <p className="camp-meta"><MapPin size={14} /> {camp.location}</p>
                  <p className="camp-meta">
                    <Calendar size={14} /> {new Date(camp.date).toLocaleDateString('en-US', {
                      weekday: 'short', month: 'short', day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <Tent size={48} />
            <p>No upcoming camps at the moment. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
