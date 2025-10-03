// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL:'https://api.1c.atract.in', //https://backend-n4w7.onrender.com
  withCredentials: true,
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    const employeeToken = localStorage.getItem('employeeToken');
    const adminToken = localStorage.getItem('adminToken');
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    } else if (employeeToken) {
      config.headers.Authorization = `Bearer ${employeeToken}`;
    } else if (adminToken) {
      config.headers.Authorization = `Bearer ${adminToken}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear stored authentication data
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employee');
      localStorage.removeItem('adminToken');
      localStorage.removeItem('admin');
      
      // Redirect to login page
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;