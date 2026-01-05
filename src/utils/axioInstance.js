import axios from 'axios';
import { BASE_URL } from './apiPaths';

const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
    },
});


// requesty interceptor to add token to headers
axiosInstance.interceptors.request.use((config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
}));

// respoonse interceptor 
axiosInstance.interceptors.response.use((response) => {
    return response;
}, (error) => {
    // handle global errors
    if (error.response.status === 500) {
        console.error('Server error occurred, please try again later.')
    } else if (error.code === 'ECONNABORTED') {
        console.error('Request timeout, please try again later.')
    }
    return Promise.reject(error);
});

export default axiosInstance;