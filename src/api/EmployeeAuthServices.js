import api from './axiosInstance';

const BASE_URL = '/auth/employee';

const EmployeeAuthServices = {
  registerEmployee: async ({ name, email, empId, password, agreedToTerms }) => {
    return api.post(`${BASE_URL}/register`, { name, email, empId, password, agreedToTerms });
  },

  loginEmployee: async (email, password) => {
    const response = await api.post(`${BASE_URL}/login`, { email, password });
    if (response.data.token) {
      localStorage.setItem('employeeToken', response.data.token);
      localStorage.setItem('employee', JSON.stringify(response.data.user));
    }
    return response;
  },

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

  // ✅ FIXED: Use proper parameter format
  resendVerification: async (email) => {
    try {
      console.log("🔄 Resending verification to employee:", email);
      
      // ✅ FIX: Use proper URL encoding and parameter format
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
  }
};

export default EmployeeAuthServices;