import axios from 'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8080',
    headers: {
        'Content-Type': 'application/json',
    },
});

api.interceptors.request.use((config) => {
    try {
        const token = localStorage.getItem('pi3b-token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
    } catch {}
    return config;
});

export default api;