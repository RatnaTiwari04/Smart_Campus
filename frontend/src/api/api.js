import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5005/api',
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const register = (data) => API.post('/auth/register', data);
export const login = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Complaints
export const createComplaint = (data) => API.post('/complaints', data);
export const getMyComplaints = (params) => API.get('/complaints/my', { params });
export const getAllComplaints = (params) => API.get('/complaints', { params });
export const getAssignedComplaints = (params) => API.get('/complaints/assigned', { params });
export const getComplaintById = (id) => API.get(`/complaints/${id}`);
export const assignComplaint = (id, data) => API.put(`/complaints/${id}/assign`, data);
export const updateComplaintStatus = (id, data) => API.put(`/complaints/${id}/status`, data);
export const getDashboardStats = () => API.get('/complaints/stats');

// Feedback
export const submitFeedback = (data) => API.post('/feedback', data);
export const getFeedback = (complaintId) => API.get(`/feedback/${complaintId}`);

// Users
export const getTechnicians = () => API.get('/users/technicians');

export default API;
