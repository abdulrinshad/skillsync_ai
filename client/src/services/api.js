// Scalable API integration service boilerplate for SkillSync AI
const BASE_URL = 'http://localhost:5000/api';

export const apiClient = async (endpoint, { body, ...customConfig } = {}) => {
  const getRoleFromPath = (path) => {
    if (path.startsWith('admin')) return 'admin';
    if (path.startsWith('teacher')) return 'teacher';
    return 'student';
  };

  const getActiveToken = () => {
    const path = window.location.pathname.replace(/^\//, '');
    const role = getRoleFromPath(path);
    return localStorage.getItem(`token_${role}`) || localStorage.getItem('token');
  };

  const token = getActiveToken();
  const headers = { 'Content-Type': 'application/json' };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const config = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  try {
    const response = await window.fetch(`${BASE_URL}/${endpoint}`, config);
    if (response.ok) {
      return await response.json();
    }
    const errorMessage = await response.text();
    return Promise.reject(new Error(errorMessage || 'Something went wrong'));
  } catch (err) {
    return Promise.reject(new Error(err.message || 'Network error occurred'));
  }
};

export const coursesAPI = {
  getAll: () => apiClient('courses'),
  getById: (id) => apiClient(`courses/${id}`),
  create: (data) => apiClient('courses', { body: data, method: 'POST' })
};

export const authAPI = {
  login: (credentials) => apiClient('auth/login', { body: credentials, method: 'POST' }),
  register: (data) => apiClient('auth/register', { body: data, method: 'POST' })
};
