import React, { useState, useEffect } from 'react';
import { FileText, Plus, Trash2, XCircle, Send, Clock, CheckCircle2, Package } from 'lucide-react';
import { requestApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

const bloodGroups = [
  'A_POSITIVE', 'A_NEGATIVE', 'B_POSITIVE', 'B_NEGATIVE',
  'AB_POSITIVE', 'AB_NEGATIVE', 'O_POSITIVE', 'O_NEGATIVE',
];

export default function MyRequests() {
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
      const res = await requestApi.getMyRequests(user.id);
      setRequests(res.data);
    } catch (err) {
      console.error('Error fetching requests:', err);
    } finally {
      setLoading(false);
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

  const handleDelete = async (id) => {
    if (window.confirm('Delete this request?')) {
      try {
        await requestApi.deleteRequest(id, user.id);
        setRequests(requests.filter((r) => r.id !== id));
      } catch (err) {
        alert('Error deleting request.');
      }
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

  const getStatusIcon = (status) => {
    switch (status) {
      case 'PENDING': return <Clock size={14} />;
      case 'APPROVED': return <CheckCircle2 size={14} />;
      case 'FULFILLED': return <Package size={14} />;
      default: return null;
    }
  };

  // Stats summary
  const pending = requests.filter((r) => r.status === 'PENDING').length;
  const approved = requests.filter((r) => r.status === 'APPROVED').length;
  const fulfilled = requests.filter((r) => r.status === 'FULFILLED').length;

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>My Blood Requests</h2>
          <p>Submit and track your blood requests</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={18} /> New Request
        </button>
      </div>

      {/* Stats row */}
      <div className="my-requests-stats">
        <div className="mr-stat pending">
          <Clock size={20} />
          <div>
            <span className="mr-num">{pending}</span>
            <span className="mr-label">Pending</span>
          </div>
        </div>
        <div className="mr-stat approved">
          <CheckCircle2 size={20} />
          <div>
            <span className="mr-num">{approved}</span>
            <span className="mr-label">Approved</span>
          </div>
        </div>
        <div className="mr-stat fulfilled">
          <Package size={20} />
          <div>
            <span className="mr-num">{fulfilled}</span>
            <span className="mr-label">Fulfilled</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading your requests...</div>
      ) : (
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Hospital / Receiver</th>
                <th>Blood Group</th>
                <th>Units</th>
                <th>Status</th>
                <th>Date Requested</th>
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
                      {getStatusIcon(req.status)} {req.status}
                    </span>
                  </td>
                  <td>{new Date(req.requestedDate).toLocaleDateString()}</td>
                  <td>
                    {req.status === 'PENDING' && (
                      <button className="btn-icon btn-icon-danger" onClick={() => handleDelete(req.id)}>
                        <Trash2 size={16} />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {requests.length === 0 && (
            <div className="empty-state">
              <FileText size={48} />
              <p>No blood requests yet. Click "New Request" to submit one.</p>
            </div>
          )}
        </div>
      )}

      {/* Modal */}
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
                <label>Hospital / Receiver Name</label>
                <input
                  type="text"
                  required
                  value={formData.hospitalName}
                  onChange={(e) => setFormData({ ...formData, hospitalName: e.target.value })}
                  placeholder="Enter name"
                />
              </div>
              <div className="form-group">
                <label>Blood Group Needed</label>
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
                <button type="submit" className="btn btn-primary">
                  <Send size={16} /> Submit Request
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
