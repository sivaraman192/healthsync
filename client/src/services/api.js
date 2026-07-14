import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080/api',
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

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      if (window.location.pathname !== '/login') {
        window.location.href = '/unauthorized';
      }
    }
    return Promise.reject(error);
  }
);

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

export const patientService = {
  getAll: (search) => API.get(`/patients${search ? `?search=${search}` : ''}`),
  getMe: () => API.get('/patients/me'),
  updateMe: (data) => API.put('/patients/me', data),
  getById: (id) => API.get(`/patients/${id}`),
  delete: (id) => API.delete(`/patients/${id}`),
};

export const departmentService = {
  getAll: () => API.get('/departments'),
  create: (data) => API.post('/admin/departments', data),
  update: (id, data) => API.put(`/admin/departments/${id}`, data),
  delete: (id) => API.delete(`/admin/departments/${id}`),
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

export const prescriptionService = {
  create: (data) => API.post('/prescriptions', data),
  getByPatient: (patientId) => API.get(`/prescriptions/patient/${patientId}`),
  getByDoctor: (doctorId) => API.get(`/prescriptions/doctor/${doctorId}`),
  getByAppointment: (apptId) => API.get(`/prescriptions/appointment/${apptId}`),
};

export const notificationService = {
  getAll: () => API.get('/notifications'),
  markAsRead: (id) => API.put(`/notifications/${id}/read`),
  markAllRead: () => API.put('/notifications/read-all'),
  delete: (id) => API.delete(`/notifications/${id}`),
};

export const messageService = {
  getAll: () => API.get('/messages'),
  sendMessage: (data) => API.post('/messages', data),
  getChat: (userId) => API.get(`/chat/${userId}`),
  getConversations: () => API.get('/conversations'),
  searchUsers: (query) => API.get(`/users/search?query=${query}`),
};

export const dashboardService = {
  getStats: () => API.get('/dashboard/stats'),
};

export default API;
