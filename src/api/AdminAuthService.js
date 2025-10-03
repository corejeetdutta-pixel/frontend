// src/api/AdminAuthService.js
import axios from './axiosInstance';

const BASE_URL = '/api/admin';

const AdminAuthService = {
  // Register a new admin
  registerAdmin: (adminData) => {
    return axios.post(`${BASE_URL}/register`, adminData, {
      withCredentials: true
    });
  },

  // Login admin
  loginAdmin: (loginData) => {
    return axios.post(`${BASE_URL}/login`, loginData, {
      withCredentials: true
    });
  },

  // Get current admin from session
  getCurrentAdmin: () => {
    return axios.get(`${BASE_URL}/current-admin`, {
      withCredentials: true
    });
  },

  // Logout admin
  logoutAdmin: () => {
    return axios.post(`${BASE_URL}/logout`, {}, {
      withCredentials: true
    });
  },

  // Get admin details by ID
  getAdminById: (adminId) => {
    return axios.get(`${BASE_URL}/${adminId}`, {
      withCredentials: true
    });
  },

  // Get all admins
  getAllAdmins: () => {
    return axios.get(`${BASE_URL}`, {
      withCredentials: true
    });
  },

  // Update admin
  updateAdmin: (adminId, adminData) => {
    return axios.put(`${BASE_URL}/${adminId}`, adminData, {
      withCredentials: true
    });
  },

  // Delete admin
  deleteAdmin: (adminId) => {
    return axios.delete(`${BASE_URL}/${adminId}`, {
      withCredentials: true
    });
  },

  // Get all users
  getAllUsers: () => {
    return axios.get(`${BASE_URL}/users`, {
      withCredentials: true
    });
  },

  // Delete a user
  deleteUser: (userId) => {
    return axios.delete(`${BASE_URL}/users/${userId}`, {
      withCredentials: true
    });
  },

  // Get all employees
  getAllEmployees: () => {
    return axios.get(`${BASE_URL}/employees`, {
      withCredentials: true
    });
  },
  
  // Delete an employee
  deleteEmployee: (employeeId) => {
    return axios.delete(`${BASE_URL}/employees/${employeeId}`, {
      withCredentials: true
    });
  }
};

export default AdminAuthService;