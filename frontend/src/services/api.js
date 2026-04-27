import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('govenue_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authService = {
  login: (data) => api.post('/api/auth/login', data),
  register: (data) => api.post('/api/auth/register', data),
};

export const eventosService = {
  listar: (params) => api.get('/api/eventos', { params }),
  obtener: (id) => api.get(`/api/eventos/${id}`),
  misEventos: () => api.get('/api/eventos/organizador/mis-eventos'),
  crear: (data) => api.post('/api/eventos', data),
  editar: (id, data) => api.patch(`/api/eventos/${id}`, data),
};

export const venuesService = {
  listar: () => api.get('/api/venues'),
  crear: (data) => api.post('/api/venues', data),
};

export const catalogoService = {
  deportes: () => api.get('/api/deportes'),
  localidades: () => api.get('/api/localidades'),
};

export default api;
