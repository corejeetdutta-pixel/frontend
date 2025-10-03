import api from './axiosInstance';

const BASE_URL = '/auth/user';

const AuthServices = {
  registerUser: async (userData) => {
    try {
      console.log("Registering user:", userData);
      const response = await api.post(`${BASE_URL}/register`, userData);
      return response;
    } catch (error) {
      console.error("Registration error:", error);
      throw error;
    }
  },

  loginUser: async (email, password) => {
    try {
      console.log("Logging in user:", email);
      const response = await api.post(`${BASE_URL}/login`, { email, password });
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      
      return response;
    } catch (error) {
      console.error("Login error:", error);
      throw error;
    }
  },

  fetchCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }
      
      return await api.get(`${BASE_URL}/current-user`, {
        headers: { Authorization: `Bearer ${token}` }
      });
    } catch (error) {
      console.error("Fetch current user error:", error);
      throw error;
    }
  },

  logoutUser: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return api.post(`${BASE_URL}/logout`);
  },

  verifyEmail: async (token) => {
    try {
      console.log("🔍 Sending verification request for token:", token);
      const response = await api.get(`${BASE_URL}/verify-email?token=${token}`);
      console.log("✅ Verification response received:", response);
      return response;
    } catch (error) {
      console.error("❌ Email verification error:", error);
      console.error("❌ Error details:", error.response);
      throw error;
    }
  },

  resendVerification: async (email) => {
    try {
      console.log("Resending verification to:", email);
      const response = await api.post(`${BASE_URL}/resend-verification?email=${email}`);
      return response;
    } catch (error) {
      console.error("Resend verification error:", error);
      throw error;
    }
  }
};

export default AuthServices;