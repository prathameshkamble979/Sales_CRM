import axios from 'axios';

const API = axios.create({
    baseURL: process.env.REACT_APP_API_URL || 'http://localhost:5000/api',
});

// Attach JWT token to every request if available
API.interceptors.request.use((config) => {
    const user = JSON.parse(localStorage.getItem('crm_user'));
    if (user && user.token) {
        config.headers.Authorization = `Bearer ${user.token}`;
    }
    return config;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login', data);
export const getMe = () => API.get('/auth/me');

// Users (Admin only)
export const getAllUsers = () => API.get('/users');

// Leads
export const getLeads = (params) => API.get('/leads', { params });
export const getLeadById = (id) => API.get(`/leads/${id}`);
export const createLead = (data) => API.post('/leads', data);
export const updateLead = (id, data) => API.put(`/leads/${id}`, data);
export const deleteLead = (id) => API.delete(`/leads/${id}`);

// Deals
export const getDealsByLead = (leadId, params) =>
    API.get(`/deals/lead/${leadId}`, { params });
export const createDeal = (data) => API.post('/deals', data);
export const updateDeal = (id, data) => API.put(`/deals/${id}`, data);
export const deleteDeal = (id) => API.delete(`/deals/${id}`);

// Activities
export const getActivitiesByLead = (leadId) =>
    API.get(`/activities/lead/${leadId}`);
export const createActivity = (data) => API.post('/activities', data);
export const deleteActivity = (id) => API.delete(`/activities/${id}`);

export default API;
