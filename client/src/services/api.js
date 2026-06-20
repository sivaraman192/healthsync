import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export const authService = {
  register: (data) => API.post('/auth/register', data),
  login: (data) => API.post('/auth/login', data),
  getMe: () => API.get('/auth/me'),
};

export const doctorService = {
  getAll: () => API.get('/doctors'),
  getByEmail: (email) => API.get(`/doctors/email/${email}`),
  create: (data) => API.post('/admin/doctors', data),
  update: (id, data) => API.put(`/admin/doctors/${id}`, data),
  delete: (id) => API.delete(`/admin/doctors/${id}`),
};

export const appointmentService = {
  create: (data) => API.post('/appointments', data),
  getAll: () => API.get('/appointments'),
  getByPatient: (patientId) => API.get(`/appointments/patient/${patientId}`),
  getByDoctor: (doctorId) => API.get(`/appointments/doctor/${doctorId}`),
  updateStatus: (id, status) => API.put(`/appointments/${id}/status`, { status }),
  updatePrescription: (id, prescriptionNotes) => API.put(`/appointments/${id}/prescription`, { prescriptionNotes }),
  delete: (id) => API.delete(`/appointments/${id}`),
};

export const dashboardService = {
  getStats: () => API.get('/dashboard/stats'),
};

export default API;
