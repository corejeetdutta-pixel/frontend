// src/api/axiosInstance.js
import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://backend-n4w7.onrender.com', // ✅ use http unless you have SSL
  withCredentials: true,
});

export default axiosInstance;