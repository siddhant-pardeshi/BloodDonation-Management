import axios from 'axios';

// In dev the API runs on its own port; the production build is served
// by Spring Boot itself, so a relative path keeps cookies first-party.
const API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:8080/api/v1'
  : '/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  // Send session cookies along with every request
  withCredentials: true,
});

// ===== Auth API =====
// Used by Login, Register, Navbar (logout), and ProtectedRoute (/me)
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
};

// ===== Donors API =====
export const donorApi = {
  getAllDonors: () => api.get('/donors'),
  getDonorById: (id) => api.get(`/donors/${id}`),
  registerDonor: (data) => api.post('/donors', data),
  updateDonor: (id, data) => api.put(`/donors/${id}`, data),
  deleteDonor: (id) => api.delete(`/donors/${id}`),
  checkEligibility: (id) => api.get(`/donors/${id}/eligibility`),
  recordDonation: (id) => api.post(`/donors/${id}/donate`),
  getDonorCount: () => api.get('/donors/count'),
};

// ===== Blood Inventory API =====
export const inventoryApi = {
  getAllInventory: () => api.get('/inventory'),
  getTotalUnits: () => api.get('/inventory/total'),
  getInventoryByBloodGroup: (bloodGroup) => api.get(`/inventory/${bloodGroup}`),
  addUnits: (bloodGroup, units) => api.post(`/inventory/add?bloodGroup=${bloodGroup}&units=${units}`),
  initializeInventory: () => api.post('/inventory/initialize'),
};

// ===== Blood Requests API =====
export const requestApi = {
  getAllRequests: () => api.get('/requests'),
  getPendingRequests: () => api.get('/requests/pending'),
  getMyRequests: (receiverId) => api.get(`/requests/receiver/${receiverId}`),
  getRequestById: (id) => api.get(`/requests/${id}`),
  createRequest: (data) => api.post('/requests', data),
  approveRequest: (id) => api.put(`/requests/${id}/approve`),
  fulfillRequest: (id) => api.put(`/requests/${id}/fulfill`),
  deleteRequest: (id, userId) => api.delete(`/requests/${id}?userId=${userId}`),
  getPendingCount: () => api.get('/requests/count/pending'),
};

// ===== Donation Camps API =====
export const campApi = {
  getAllCamps: () => api.get('/camps'),
  getUpcomingCamps: () => api.get('/camps/upcoming'),
  getCampById: (id) => api.get(`/camps/${id}`),
  createCamp: (data) => api.post('/camps', data),
  deleteCamp: (id) => api.delete(`/camps/${id}`),
  getActiveCampCount: () => api.get('/camps/count/active'),
};

export default api;
