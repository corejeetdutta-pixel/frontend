import axios from './axiosInstance';

const AuthServices = {
  registerUser: async (formData) => {
    const cleanedData = {
      ...formData,
      skills: formData.skills.filter((s) => s.trim() !== '')
    };
    return axios.post('/auth/user/register', cleanedData, {
      withCredentials: true
    });
  },

  loginUser: async (email, password) => {
    return axios.post('/auth/user/login', { email, password }, { withCredentials: true });
  },

  fetchCurrentUser: async () => {
    return axios.get('/auth/user/current-user', { withCredentials: true });
  },
  
  logoutUser: async () => {
    return axios.post('/auth/user/logout', {}, { withCredentials: true });
  },
  // Email verification methods
  verifyEmail: async (token) => {
    return axios.get(`/auth/user/verify-email?token=${encodeURIComponent(token)}`);
  },

  resendVerification: async (email) => {
    return axios.post(`/auth/user/resend-verification?email=${encodeURIComponent(email)}`);
  }
};

export default AuthServices;
