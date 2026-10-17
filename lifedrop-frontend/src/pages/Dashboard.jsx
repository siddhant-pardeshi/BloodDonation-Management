import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText, Tent, Calendar, MapPin, ArrowRight,
  Heart, Droplets, Users, Clock, CheckCircle2, Send
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import SummaryCards from '../components/SummaryCards';
import { donorApi, inventoryApi, requestApi, campApi, authApi } from '../api/api';
import '../components/Dashboard.css';

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [recentRequests, setRecentRequests] = useState([]);
  const [upcomingCamps, setUpcomingCamps] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, [user?.role]);

  const fetchDashboardData = async () => {
    try {
      // Fetch data based on role
      if (user?.role === 'ADMIN') {
        const [donorRes, inventoryRes, requestRes, campRes, pendingRes, activeCampRes] =
          await Promise.allSettled([
            donorApi.getDonorCount(),
            inventoryApi.getTotalUnits(),
            requestApi.getAllRequests(),
            campApi.getUpcomingCamps(),
            requestApi.getPendingCount(),
            campApi.getActiveCampCount(),
          ]);
        setStats({
          totalDonors: donorRes.status === 'fulfilled' ? donorRes.value.data.totalDonors : 0,
          totalUnitsAvailable: inventoryRes.status === 'fulfilled' ? inventoryRes.value.data.totalUnitsAvailable : 0,
          pendingRequests: pendingRes.status === 'fulfilled' ? pendingRes.value.data.pendingRequests : 0,
          activeCamps: activeCampRes.status === 'fulfilled' ? activeCampRes.value.data.activeCamps : 0,
        });
        if (requestRes.status === 'fulfilled') setRecentRequests(requestRes.value.data.slice(0, 5));
        if (campRes.status === 'fulfilled') setUpcomingCamps(campRes.value.data.slice(0, 5));
      } else if (user?.role === 'DONOR') {
        // Donor sees: their eligibility + inventory + camps
        const [inventoryRes, campRes, totalRes] = await Promise.allSettled([
          inventoryApi.getAllInventory(),
          campApi.getUpcomingCamps(),
          inventoryApi.getTotalUnits(),
        ]);
        if (inventoryRes.status === 'fulfilled') setInventory(inventoryRes.value.data);
        if (campRes.status === 'fulfilled') setUpcomingCamps(campRes.value.data.slice(0, 4));
        setStats({
          totalUnitsAvailable: totalRes.status === 'fulfilled' ? totalRes.value.data.totalUnitsAvailable : 0,
          activeCamps: campRes.status === 'fulfilled' ? campRes.value.data.length : 0,
        });
      } else if (user?.role === 'RECEIVER') {
        // Receiver sees: pending requests count + inventory
        const [inventoryRes, totalRes] = await Promise.allSettled([
          inventoryApi.getAllInventory(),
          inventoryApi.getTotalUnits(),
        ]);
        if (inventoryRes.status === 'fulfilled') setInventory(inventoryRes.value.data);
        setStats({
          totalUnitsAvailable: totalRes.status === 'fulfilled' ? totalRes.value.data.totalUnitsAvailable : 0,
        });
      }
    } catch (err) {
      console.error('Error fetching dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'PENDING': return 'status-pending';
      case 'APPROVED': return 'status-approved';
      case 'FULFILLED': return 'status-fulfilled';
      default: return '';
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric'
    });
  };

  const getStockColor = (units) => {
    if (units === 0) return 'var(--color-primary)';
    if (units < 10) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  // ===== Donor Dashboard =====
  if (user?.role === 'DONOR') {
    const canDonate = !user.lastDonationDate ||
      (new Date() - new Date(user.lastDonationDate)) / (1000 * 60 * 60 * 24) >= 90;
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome, {user.name.split(' ')[0]}!</h2>
          <p>Thank you for being a hero. Here's your donation overview.</p>
        </div>

        {/* Donor-specific eligibility card */}
        <div className="donor-hero-card">
          <div className="donor-hero-left">
            <div className="donor-hero-icon">
              <Heart size={32} fill="var(--color-primary)" color="var(--color-primary)" />
            </div>
            <div>
              <h3>{canDonate ? 'You are eligible to donate!' : 'Thank you for your last donation!'}</h3>
              <p>
                {canDonate
                  ? 'Your last donation was more than 90 days ago. Find a camp and donate today.'
                  : `Last donated on ${formatDate(user.lastDonationDate)}. Come back after 90 days.`}
              </p>
            </div>
          </div>
          <div className="donor-hero-right">
            <span className="donor-blood-badge">{user.bloodGroup?.replace('_', ' ')}</span>
            <Link to="/camps" className="btn-find-camp">
              Find a Camp <ArrowRight size={16} />
            </Link>
          </div>
        </div>

        <SummaryCards stats={{
          totalDonors: 1,
          totalUnitsAvailable: stats?.totalUnitsAvailable,
          pendingRequests: '—',
          activeCamps: stats?.activeCamps,
        }} />

        {/* Upcoming camps */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Upcoming Donation Camps</h3>
            <Link to="/camps" className="view-all-btn">View All <ArrowRight size={14} /></Link>
          </div>
          {upcomingCamps.length > 0 ? (
            upcomingCamps.map((camp) => (
              <div key={camp.id} className="camp-card">
                <div className="camp-icon"><Tent size={22} /></div>
                <div className="camp-info">
                  <h4>{camp.campName}</h4>
                  <p><MapPin size={12} style={{ marginRight: 4 }} />{camp.location}</p>
                  <p><Calendar size={12} style={{ marginRight: 4 }} />{formatDate(camp.date)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state"><p>No upcoming camps.</p></div>
          )}
        </div>
      </div>
    );
  }

  // ===== Receiver Dashboard =====
  if (user?.role === 'RECEIVER') {
    return (
      <div className="dashboard-content">
        <div className="dashboard-welcome">
          <h2>Welcome, {user.name}!</h2>
          <p>Submit and track your blood requests below.</p>
        </div>

        <SummaryCards stats={{
          totalDonors: '—',
          totalUnitsAvailable: stats?.totalUnitsAvailable,
          pendingRequests: '—',
          activeCamps: '—',
        }} />

        {/* Quick action card */}
        <div className="receiver-action-card">
          <div className="receiver-action-left">
            <Send size={32} color="var(--color-accent)" />
            <div>
              <h3>Need blood urgently?</h3>
              <p>Submit a new blood request and we'll process it right away.</p>
            </div>
          </div>
          <Link to="/my-requests" className="btn-new-request">
            New Request <ArrowRight size={16} />
          </Link>
        </div>

        {/* Live inventory */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Available Blood Inventory</h3>
            <Link to="/inventory" className="view-all-btn">View All <ArrowRight size={14} /></Link>
          </div>
          {inventory.length > 0 ? (
            <div className="dashboard-inventory-grid">
              {inventory.map((item) => (
                <div key={item.id} className="dash-inv-item">
                  <Droplets size={20} color={getStockColor(item.unitsAvailable)} />
                  <div>
                    <span className="dash-inv-group">{item.bloodGroup.replace('_', '')}</span>
                    <span className="dash-inv-units">{item.unitsAvailable} units</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state"><p>Inventory loading...</p></div>
          )}
        </div>
      </div>
    );
  }

  // ===== Admin Dashboard (default) =====
  return (
    <div className="dashboard-content">
      <div className="dashboard-welcome">
        <h2>Welcome back, Admin</h2>
        <p>Here's what's happening with LifeDrop today.</p>
      </div>

      <SummaryCards stats={stats} />

      <div className="dashboard-grid">
        {/* Recent Requests */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Recent Blood Requests</h3>
            <Link to="/requests" className="view-all-btn">View All <ArrowRight size={14} /></Link>
          </div>
          {recentRequests.length > 0 ? (
            <table className="data-table">
              <thead>
                <tr>
                  <th>Hospital</th>
                  <th>Blood Group</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentRequests.map((req) => (
                  <tr key={req.id}>
                    <td>{req.hospitalName}</td>
                    <td><span className="blood-group-badge">{req.bloodGroup}</span></td>
                    <td>
                      <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
                        {req.status}
                      </span>
                    </td>
                    <td>{formatDate(req.requestedDate)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <p>No requests yet.</p>
            </div>
          )}
        </div>

        {/* Upcoming Camps */}
        <div className="dashboard-section">
          <div className="section-header">
            <h3>Upcoming Donation Camps</h3>
            <Link to="/camps" className="view-all-btn">View All <ArrowRight size={14} /></Link>
          </div>
          {upcomingCamps.length > 0 ? (
            upcomingCamps.map((camp) => (
              <div key={camp.id} className="camp-card">
                <div className="camp-icon"><Tent size={22} /></div>
                <div className="camp-info">
                  <h4>{camp.campName}</h4>
                  <p><MapPin size={12} style={{ marginRight: 4 }} />{camp.location}</p>
                  <p><Calendar size={12} style={{ marginRight: 4 }} />{formatDate(camp.date)}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="empty-state"><p>No upcoming camps.</p></div>
          )}
        </div>
      </div>
    </div>
  );
}
