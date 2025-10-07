// src/api/EmployeeAuthServices.js
import api from './axiosInstance';

const BASE_URL = '/auth/employee';

const EmployeeAuthServices = {
  registerEmployee: async (employeeData) => {
    return api.post(`${BASE_URL}/register`, employeeData);
  },

  loginEmployee: async (email, password, empId) => {
    // Clean the empId to remove any quotes or extra spaces
    const cleanedEmpId = empId.trim().replace(/^"+|"+$/g, '');
    
    const loginData = {
      email: email.trim(),
      password: password,
      empId: cleanedEmpId
    };

    console.log("Sending login data:", {
      email: loginData.email,
      empId: loginData.empId,
      password: "***"
    });

    const response = await api.post(`${BASE_URL}/login`, loginData);
    
    if (response.data.token) {
      localStorage.setItem('employeeToken', response.data.token);
      localStorage.setItem('employee', JSON.stringify(response.data.user));
    }
    return response;
  },

  // ... rest of your methods remain the same ...
  
  fetchCurrentEmployee: async () => {
    const token = localStorage.getItem('employeeToken');
    if (!token) {
      throw new Error('No token found');
    }
    
    return api.get(`${BASE_URL}/current-employee`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },

  logoutEmployee: () => {
    localStorage.removeItem('employeeToken');
    localStorage.removeItem('employee');
    return api.post(`${BASE_URL}/logout`);
  },

  verifyEmail: async (token) => {
    try {
      console.log("🔍 Sending employee verification request for token:", token);
      const response = await api.get(`${BASE_URL}/verify?token=${token}`);
      console.log("✅ Employee verification response received:", response);
      return response;
    } catch (error) {
      console.error("❌ Employee email verification error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  resendVerification: async (email) => {
    try {
      console.log("🔄 Resending verification to employee:", email);
      const response = await api.post(`${BASE_URL}/resend-verification`, null, {
        params: { email }
      });
      console.log("✅ Resend verification response:", response);
      return response;
    } catch (error) {
      console.error("❌ Resend employee verification error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // NEW: Retrieve Employee ID by email
  retrieveEmpId: async (email) => {
    try {
      console.log("🔍 Retrieving Employee ID for:", email);
      const response = await api.post(`${BASE_URL}/retrieve-empId`, null, {
        params: { email }
      });
      console.log("✅ Retrieve EmpId response:", response);
      return response;
    } catch (error) {
      console.error("❌ Retrieve Employee ID error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  // NEW: Forgot Password
  forgotPassword: async (email) => {
    try {
      console.log("🔍 Sending password reset for:", email);
      const response = await api.post(`${BASE_URL}/forgot-password`, null, {
        params: { email }
      });
      console.log("✅ Forgot password response:", response);
      return response;
    } catch (error) {
      console.error("❌ Forgot password error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  }
};

export default EmployeeAuthServices;