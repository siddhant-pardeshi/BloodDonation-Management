import React, { useState, useEffect } from 'react';
import { Users, Plus, Search, Edit2, Trash2, CheckCircle, XCircle, Heart } from 'lucide-react';
import { donorApi } from '../api/api';
import './Pages.css';

export default function Donors() {
  const [donors, setDonors] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedDonor, setSelectedDonor] = useState(null);
  const [formData, setFormData] = useState({
    name: '', email: '', password: '', phone: '', bloodGroup: 'A_POSITIVE',
  });

  useEffect(() => {
    fetchDonors();
  }, []);

  const fetchDonors = async () => {
    try {
      const res = await donorApi.getAllDonors();
      setDonors(res.data);
    } catch (err) {
      console.error('Error fetching donors:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEligibility = async (id) => {
    try {
      const res = await donorApi.checkEligibility(id);
      const { eligible } = res.data;
      alert(eligible
        ? '✅ This donor is eligible to donate blood!'
        : '❌ This donor is NOT eligible. Must wait at least 90 days since last donation.');
    } catch (err) {
      alert('Error checking eligibility.');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this donor?')) {
      try {
        await donorApi.deleteDonor(id);
        setDonors(donors.filter((d) => d.id !== id));
      } catch (err) {
        alert('Error deleting donor.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedDonor) {
        await donorApi.updateDonor(selectedDonor.id, formData);
      } else {
        await donorApi.registerDonor({ ...formData, role: 'DONOR' });
      }
      setShowModal(false);
      setSelectedDonor(null);
      setFormData({ name: '', email: '', password: '', phone: '', bloodGroup: 'A_POSITIVE' });
      fetchDonors();
    } catch (err) {
      alert('Error saving donor.');
    }
  };

  const filteredDonors = donors.filter((d) =>
    d.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    d.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (d.bloodGroup && d.bloodGroup.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const bloodGroups = [
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
    'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE',
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Donors</h2>
          <p>Manage registered blood donors</p>
        </div>
        <button className="btn btn-primary" onClick={() => { setSelectedDonor(null); setShowModal(true); }}>
          <Plus size={18} /> Add Donor
        </button>
      </div>

      <div className="page-toolbar">
        <div className="search-box">
          <Search size={18} />
          <input
            type="text"
            placeholder="Search donors..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <span className="result-count">{filteredDonors.length} donors found</span>
      </div>

      {loading ? (
        <div className="loading">Loading donors...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Blood Group</th>
                <th>Last Donation</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredDonors.map((donor) => (
                <tr key={donor.id}>
                  <td><strong>{donor.name}</strong></td>
                  <td>{donor.email}</td>
                  <td>
                    <span className="blood-group-badge">{donor.bloodGroup || 'N/A'}</span>
                  </td>
                  <td>{donor.lastDonationDate
                    ? new Date(donor.lastDonationDate).toLocaleDateString()
                    : 'Never'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon" title="Check Eligibility" onClick={() => handleEligibility(donor.id)}>
                        <CheckCircle size={16} />
                      </button>
                      <button className="btn-icon" title="Record Donation" onClick={async () => {
                        if (window.confirm('Record a new donation for this donor?')) {
                          try {
                            await donorApi.recordDonation(donor.id);
                            alert('Donation recorded successfully!');
                            fetchDonors();
                          } catch (err) {
                            alert(err.response?.data?.message || err.response?.data?.error || 'Error recording donation.');
                          }
                        }
                      }}>
                        <Heart size={16} />
                      </button>
                      <button className="btn-icon" title="Edit" onClick={() => { setSelectedDonor(donor); setFormData({ name: donor.name, email: donor.email, password: '', phone: donor.phone || '', bloodGroup: donor.bloodGroup }); setShowModal(true); }}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => handleDelete(donor.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredDonors.length === 0 && (
            <div className="empty-state">
              <Users size={48} />
              <p>No donors found. Add a new donor to get started.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>{selectedDonor ? 'Edit Donor' : 'Register New Donor'}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Full Name</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Enter full name"
                />
              </div>
              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Enter email address"
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  required={!selectedDonor}
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder={selectedDonor ? 'Leave blank to keep current' : 'Enter password'}
                />
              </div>
              <div className="form-group">
                <label>Phone</label>
                <input
                  type="tel"
                  required={!selectedDonor}
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                />
              </div>
              <div className="form-group">
                <label>Blood Group</label>
                <select
                  value={formData.bloodGroup}
                  onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                >
                  {bloodGroups.map((bg) => (
                    <option key={bg} value={bg}>{bg.replace('_', ' ')}</option>
                  ))}
                </select>
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">
                  {selectedDonor ? 'Update Donor' : 'Register Donor'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
