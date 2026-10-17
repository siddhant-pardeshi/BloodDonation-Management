import React, { useState, useEffect } from 'react';
import { FileText, Plus, CheckCircle, Package, Trash2, XCircle } from 'lucide-react';
import { requestApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function Requests() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    hospitalName: '', bloodGroup: 'A_POSITIVE', unitsRequired: 1,
  });

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await requestApi.getAllRequests();
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id) => {
    try {
      await requestApi.approveRequest(id);
      fetchRequests();
    } catch (err) {
      alert('Error approving request: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleFulfill = async (id) => {
    if (window.confirm('This will deduct units from inventory. Proceed?')) {
      try {
        await requestApi.fulfillRequest(id);
        fetchRequests();
      } catch (err) {
        alert('Error fulfilling request: ' + (err.response?.data?.message || err.message));
      }
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this request?')) {
      try {
        await requestApi.deleteRequest(id, user.id);
        setRequests(requests.filter((r) => r.id !== id));
      } catch (err) {
        alert('Error deleting request.');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await requestApi.createRequest({ ...formData, receiverId: user.id });
      setShowModal(false);
      setFormData({ hospitalName: '', bloodGroup: 'A_POSITIVE', unitsRequired: 1 });
      fetchRequests();
    } catch (err) {
      alert('Error creating request.');
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

  const bloodGroups = [
    'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
    'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE',
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Blood Requests</h2>
          <p>Manage and process blood requests from hospitals</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {loading ? (
        <div className="loading">Loading requests...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Status</th>
                <th>Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {requests.map((req) => (
                <tr key={req.id}>
                  <td><strong>{req.hospitalName}</strong></td>
                  <td><span className="blood-group-badge">{req.bloodGroup}</span></td>
                  <td>{req.unitsRequired}</td>
                  <td>
                    <span className={`status-badge ${getStatusBadgeClass(req.status)}`}>
                      {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.requestedDate).toLocaleDateString()}</td>
                  <td>
                    <div className="action-buttons">
                      {req.status === 'PENDING' && (
                        <button className="btn-icon" title="Approve" onClick={() => handleApprove(req.id)}>
                          <CheckCircle size={16} />
                        </button>
                      )}
                      {req.status === 'APPROVED' && (
                        <button className="btn-icon" title="Fulfill" onClick={() => handleFulfill(req.id)}>
                          <Package size={16} />
                        </button>
                      )}
                      <button className="btn-icon btn-icon-danger" title="Delete" onClick={() => handleDelete(req.id)}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="empty-state">
              <FileText size={48} />
              <p>No blood requests found.</p>
            </div>
          )}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>New Blood Request</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Hospital Name</label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="Enter hospital name"
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
              <div className="form-group">
                <label>Units Required</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={formData.unitsRequired}
                  onChange={(e) => setFormData({ ...formData, unitsRequired: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
