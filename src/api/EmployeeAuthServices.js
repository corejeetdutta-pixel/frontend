// src/api/EmployeeAuthServices.js
import api from './axiosInstance';

const BASE_URL = '/auth/employee';

const EmployeeAuthServices = {
  // Enhanced registration with comprehensive employee data
  registerEmployee: async (employeeData) => {
    try {
      console.log("📝 Registering employee with data:", employeeData);
      const response = await api.post(`${BASE_URL}/register`, employeeData);
      console.log("✅ Employee registration successful:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Employee registration error:", error);
      throw error;
    }
  },

  // Enhanced login with empId support and proper data cleaning
  loginEmployee: async (email, password, empId) => {
    try {
      // Clean the empId to remove any quotes or extra spaces
      const cleanedEmpId = empId.trim().replace(/^"+|"+$/g, '');
      
      const loginData = {
        email: email.trim(),
        password: password,
        empId: cleanedEmpId
      };

      console.log("🔐 Employee login attempt:", { 
        email: loginData.email, 
        empId: loginData.empId 
      });
      
      const response = await api.post(`${BASE_URL}/login`, loginData);
      
      if (response.data.token) {
        localStorage.setItem('employeeToken', response.data.token);
        localStorage.setItem('employee', JSON.stringify(response.data.user));
        console.log("✅ Employee login successful, token stored");
      }
      return response;
    } catch (error) {
      console.error("❌ Employee login error:", error);
      throw error;
    }
  },

  // Get current employee profile
  fetchCurrentEmployee: async () => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      console.log("👤 Fetching current employee data");
      const response = await api.get(`${BASE_URL}/current-employee`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log("✅ Current employee data fetched:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Fetch current employee error:", error);
      throw error;
    }
  },

  // Logout employee
  logoutEmployee: () => {
    try {
      console.log("🚪 Employee logout initiated");
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employee');
      console.log("✅ Employee tokens cleared from localStorage");
      
      // Optional: Call backend logout endpoint if needed
      return api.post(`${BASE_URL}/logout`);
    } catch (error) {
      console.error("❌ Employee logout error:", error);
      throw error;
    }
  },

  // Verify email with token
  verifyEmail: async (token) => {
    try {
      console.log("🔍 Verifying employee email with token:", token);
      const response = await api.get(`${BASE_URL}/verify?token=${token}`);
      console.log("✅ Employee email verification successful:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Employee email verification error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // Resend verification email
  resendVerification: async (email) => {
    try {
      console.log("🔄 Resending verification email to:", email);
      const response = await api.post(`${BASE_URL}/resend-verification`, null, {
        params: { email }
      });
      console.log("✅ Verification email resent successfully");
      return response;
    } catch (error) {
      console.error("❌ Resend verification email error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // Retrieve Employee ID by email
  retrieveEmpId: async (email) => {
    try {
      console.log("📧 Retrieving Employee ID for:", email);
      const response = await api.post(`${BASE_URL}/retrieve-empId`, null, {
        params: { email }
      });
      console.log("✅ Employee ID retrieved:", response.data.empId);
      return response;
    } catch (error) {
      console.error("❌ Retrieve Employee ID error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // Forgot password - send reset link
  forgotPassword: async (email) => {
    try {
      console.log("🔑 Forgot password request for:", email);
      const response = await api.post(`${BASE_URL}/forgot-password`, null, {
        params: { email }
      });
      console.log("✅ Password reset email sent");
      return response;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // Reset password with token
  resetPassword: async (token, passwordData) => {
    try {
      console.log("🔄 Resetting password with token");
      const response = await api.post(`${BASE_URL}/reset-password`, passwordData, {
        params: { token }
      });
      console.log("✅ Password reset successful");
      return response;
    } catch (error) {
      console.error("❌ Reset password error:", error);
      throw error;
    }
  },

  // Update employee profile
  updateProfile: async (profileData) => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log("✏️ Updating employee profile:", profileData);
      const response = await api.put(`${BASE_URL}/update-profile`, profileData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Update local storage if profile update is successful
      if (response.data) {
        const currentEmployee = JSON.parse(localStorage.getItem('employee') || '{}');
        const updatedEmployee = { ...currentEmployee, ...response.data };
        localStorage.setItem('employee', JSON.stringify(updatedEmployee));
        console.log("✅ Employee profile updated and localStorage refreshed");
      }
      
      return response;
    } catch (error) {
      console.error("❌ Update profile error:", error);
      throw error;
    }
  },

  // Change password
  changePassword: async (passwordData) => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log("🔐 Changing employee password");
      const response = await api.post(`${BASE_URL}/change-password`, passwordData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Password changed successfully");
      return response;
    } catch (error) {
      console.error("❌ Change password error:", error);
      throw error;
    }
  },

  // Check if email exists
  checkEmail: async (email) => {
    try {
      console.log("📧 Checking email existence:", email);
      const response = await api.get(`${BASE_URL}/check-email`, {
        params: { email }
      });
      console.log("✅ Email check completed:", response.data.exists);
      return response;
    } catch (error) {
      console.error("❌ Check email error:", error);
      throw error;
    }
  },

  // Get employee by ID (admin function)
  getEmployeeById: async (id) => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log("👤 Fetching employee by ID:", id);
      const response = await api.get(`${BASE_URL}/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ Employee data retrieved");
      return response;
    } catch (error) {
      console.error("❌ Get employee by ID error:", error);
      throw error;
    }
  },

  // Get all employees (admin function)
  getAllEmployees: async () => {
    try {
      const token = localStorage.getItem('employeeToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      console.log("📋 Fetching all employees");
      const response = await api.get(`${BASE_URL}/all`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log("✅ All employees data retrieved");
      return response;
    } catch (error) {
      console.error("❌ Get all employees error:", error);
      throw error;
    }
  },

  // Utility method to check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('employeeToken');
    const employee = localStorage.getItem('employee');
    return !!(token && employee);
  },

  // Utility method to get current employee data from localStorage
  getCurrentEmployee: () => {
    try {
      const employeeData = localStorage.getItem('employee');
      return employeeData ? JSON.parse(employeeData) : null;
    } catch (error) {
      console.error("❌ Error parsing employee data from localStorage:", error);
      return null;
    }
  },

  // Utility method to get auth token
  getToken: () => {
    return localStorage.getItem('employeeToken');
  },

  // Alternative login method that accepts object (for flexibility)
  loginWithObject: async (loginData) => {
    try {
      console.log("🔐 Employee login with object:", { 
        email: loginData.email, 
        empId: loginData.empId 
      });
      
      const response = await api.post(`${BASE_URL}/login`, loginData);
      
      if (response.data.token) {
        localStorage.setItem('employeeToken', response.data.token);
        localStorage.setItem('employee', JSON.stringify(response.data.user));
        console.log("✅ Employee login successful, token stored");
      }
      return response;
    } catch (error) {
      console.error("❌ Employee login error:", error);
      throw error;
    }
  }
};

export default EmployeeAuthServices;