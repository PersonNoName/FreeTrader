import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/auth';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authApi = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login', { username, password });
        return response.data;
    },

    register: async (username: string, email: string, password: string) => {
        const response = await api.post('/auth/register', { username, email, password });
        return response.data;
    },
};

// Sector API
export const sectorApi = {
    getAll: async () => {
        const response = await api.get('/sectors');
        return response.data;
    },

    getDetail: async (id: number) => {
        const response = await api.get(`/sectors/${id}`);
        return response.data;
    },
};

// Favorites API
export const favoritesApi = {
    getAll: async () => {
        const response = await api.get('/favorites');
        return response.data;
    },

    add: async (cid: number) => {
        const response = await api.post(`/favorites/${cid}`);
        return response.data;
    },

    remove: async (cid: number) => {
        const response = await api.delete(`/favorites/${cid}`);
        return response.data;
    },

    toggle: async (cid: number) => {
        const response = await api.post(`/favorites/${cid}/toggle`);
        return response.data;
    },
};

export default api;
