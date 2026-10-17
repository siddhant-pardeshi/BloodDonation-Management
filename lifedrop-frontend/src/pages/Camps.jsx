import React, { useState, useEffect } from 'react';
import { Tent, Plus, Calendar, MapPin, Trash2, XCircle, User } from 'lucide-react';
import { campApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function Camps() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    campName: '', location: '', date: '', organizer: '',
  });

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      const res = await campApi.getAllCamps();
      setCamps(res.data);
    } catch (err) {
      console.error('Error fetching camps:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this camp?')) {
      try {
        await campApi.deleteCamp(id);
        setCamps(camps.filter((c) => c.id !== id));
      } catch (err) {
        alert('Error deleting camp.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await campApi.createCamp(formData);
      setShowModal(false);
      setFormData({ campName: '', location: '', date: '', organizer: '' });
      fetchCamps();
    } catch (err) {
      alert('Error creating camp.');
    }
  };

  const isUpcoming = (dateStr) => new Date(dateStr) >= new Date();

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Donation Camps</h2>
          <p>Schedule and manage blood donation drives</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={() => setShowModal(true)}>
            <Plus size={18} /> Schedule Camp
          </button>
        )}
      </div>

      {loading ? (
        <div className="loading">Loading camps...</div>
      ) : camps.length > 0 ? (
        <div className="camps-grid">
          {camps.map((camp) => (
            <div key={camp.id} className={`camp-grid-card ${!isUpcoming(camp.date) ? 'past' : ''}`}>
              <div className="camp-grid-icon">
                <Tent size={24} />
              </div>
              <div className="camp-grid-info">
                <h3>{camp.campName}</h3>
                <p className="camp-meta">
                  <MapPin size={14} /> {camp.location}
                </p>
                <p className="camp-meta">
                  <Calendar size={14} /> {new Date(camp.date).toLocaleDateString('en-US', {
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                  })}
                </p>
                <p className="camp-meta">
                  <User size={14} /> Organized by: {camp.organizer}
                </p>
              </div>
              <div className="camp-grid-actions">
                <span className={`camp-date-badge ${isUpcoming(camp.date) ? 'upcoming' : 'past-badge'}`}>
                  {isUpcoming(camp.date) ? 'Upcoming' : 'Past'}
                </span>
                {isAdmin && (
                  <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(camp.id)}>
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <Tent size={48} />
          <p>No donation camps scheduled. Create one to get started.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Schedule New Camp</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Camp Name</label>
                <input
                  type="text"
                  required
                  value={formData.campName}
                  onChange={(e) => setFormData({ ...formData, campName: e.target.value })}
                  placeholder="Enter camp name"
                />
              </div>
              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  required
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="Enter venue / address"
                />
              </div>
              <div className="form-group">
                <label>Date</label>
                <input
                  type="date"
                  required
                  min={new Date().toISOString().split('T')[0]}
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Organizer</label>
                <input
                  type="text"
                  required
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  placeholder="Enter organizer name"
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Schedule Camp</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
