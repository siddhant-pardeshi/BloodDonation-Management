import React, { useState, useEffect } from 'react';
import { Droplets, RefreshCw, AlertTriangle, Plus, XCircle } from 'lucide-react';
import { inventoryApi } from '../api/api';
import { useAuth } from '../context/AuthContext';
import './Pages.css';

export default function Inventory() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';
  const [inventory, setInventory] = useState([]);
  const [totalUnits, setTotalUnits] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedBloodGroup, setSelectedBloodGroup] = useState(null);
  const [unitsToAdd, setUnitsToAdd] = useState(1);

  useEffect(() => {
    fetchInventory();
  }, []);

  const fetchInventory = async () => {
    try {
      const [invRes, totalRes] = await Promise.all([
        inventoryApi.getAllInventory(),
        inventoryApi.getTotalUnits(),
      ]);
      setInventory(invRes.data);
      setTotalUnits(totalRes.data.totalUnitsAvailable);
    } catch (err) {
      console.error('Error fetching inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleInitialize = async () => {
    try {
      await inventoryApi.initializeInventory();
      fetchInventory();
    } catch (err) {
      alert('Error initializing inventory.');
    }
  };

  const handleAddUnits = async (e) => {
    e.preventDefault();
    try {
      await inventoryApi.addUnits(selectedBloodGroup, unitsToAdd);
      setShowModal(false);
      setUnitsToAdd(1);
      fetchInventory();
    } catch (err) {
      alert('Error adding units.');
    }
  };

  const getGroupColor = (units) => {
    if (units === 0) return 'var(--color-primary)';
    if (units < 10) return 'var(--color-warning)';
    return 'var(--color-success)';
  };

  const getGroupLabel = (units) => {
    if (units === 0) return 'Empty';
    if (units < 10) return 'Low';
    return 'Available';
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div>
          <h2>Blood Inventory</h2>
          <p>Monitor blood stock levels across all groups</p>
        </div>
        {isAdmin && (
          <button className="btn btn-primary" onClick={handleInitialize}>
            <RefreshCw size={18} /> Initialize Inventory
          </button>
        )}
      </div>

      <div className="inventory-total-bar">
        <div className="total-info">
          <Droplets size={24} />
          <div>
            <span className="total-number">{totalUnits}</span>
            <span className="total-label">Total Units Available</span>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="loading">Loading inventory...</div>
      ) : inventory.length > 0 ? (
        <div className="inventory-grid">
          {inventory.map((item) => (
            <div key={item.id} className="inventory-card">
              <div className="inv-card-header">
                <h3 className="inv-blood-group">{item.bloodGroup.replace('_', ' ')}</h3>
                <span
                  className="inv-status"
                  style={{
                    color: getGroupColor(item.unitsAvailable),
                    background: `${getGroupColor(item.unitsAvailable)}15`,
                  }}
                >
                  {getGroupLabel(item.unitsAvailable)}
                </span>
              </div>
              <div className="inv-card-body">
                <div className="inv-units">
                  <span className="inv-units-number">{item.unitsAvailable}</span>
                  <span className="inv-units-label">Units</span>
                </div>
                <div className="inv-bar">
                  <div
                    className="inv-bar-fill"
                    style={{
                      width: `${Math.min((item.unitsAvailable / 100) * 100, 100)}%`,
                      background: getGroupColor(item.unitsAvailable),
                    }}
                  />
                </div>
              </div>
              <div className="inv-card-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="inv-updated">
                  Updated: {new Date(item.lastUpdated).toLocaleString()}
                </span>
                {isAdmin && (
                  <button 
                    className="btn-icon" 
                    title="Add Units"
                    onClick={() => {
                      setSelectedBloodGroup(item.bloodGroup);
                      setUnitsToAdd(1);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={16} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <AlertTriangle size={48} />
          <p>No inventory data found. Click "Initialize Inventory" to set up blood groups.</p>
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Add Units: {selectedBloodGroup?.replace('_', ' ')}</h3>
              <button className="btn-icon" onClick={() => setShowModal(false)}>
                <XCircle size={20} />
              </button>
            </div>
            <form onSubmit={handleAddUnits}>
              <div className="form-group">
                <label>Number of Units</label>
                <input
                  type="number"
                  min="1"
                  required
                  value={unitsToAdd}
                  onChange={(e) => setUnitsToAdd(parseInt(e.target.value) || 1)}
                />
              </div>
              <div className="form-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Add Units</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
