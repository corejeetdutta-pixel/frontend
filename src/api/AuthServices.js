import api from './axiosInstance';

const BASE_URL = '/auth/user';

const AuthServices = {
  // ✅ Register user with multipart/form-data
  registerUser: async (formDataObj) => {
    try {
      console.log("📤 Registering user with data:", formDataObj);
      
      // Create FormData object
      const formData = new FormData();
      
      // Append user data as JSON string
      const userData = {
        name: formDataObj.name,
        email: formDataObj.email,
        password: formDataObj.password,
        mobile: formDataObj.mobile,
        address: formDataObj.address,
        gender: formDataObj.gender,
        qualification: formDataObj.qualification,
        passoutYear: formDataObj.passoutYear,
        dob: formDataObj.dob,
        experience: formDataObj.experience,
        linkedin: formDataObj.linkedin,
        github: formDataObj.github,
        skills: formDataObj.skills.filter(skill => skill.trim() !== ""),
        profilePicture: formDataObj.profilePicture
      };
      
      formData.append('user', new Blob([JSON.stringify(userData)], { type: 'application/json' }));
      
      // Append resume file
      if (formDataObj.resume instanceof File) {
        formData.append('resume', formDataObj.resume);
      } else {
        throw new Error("Resume file is required");
      }

      const response = await api.post(`${BASE_URL}/register`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log("✅ Registration successful:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Registration error:", error);
      throw error;
    }
  },

  // ✅ Update resume only
  updateResume: async (userId, resumeFile) => {
    try {
      console.log("📤 Updating resume for user:", userId);
      
      const formData = new FormData();
      formData.append('resume', resumeFile);

      const response = await api.put(`${BASE_URL}/${userId}/resume`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      console.log("✅ Resume update successful:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Resume update error:", error);
      throw error;
    }
  },

  // ✅ Get resume
  getResume: async (userId) => {
    try {
      const response = await api.get(`${BASE_URL}/${userId}/resume`, {
        responseType: 'blob'
      });
      return response;
    } catch (error) {
      console.error("❌ Get resume error:", error);
      throw error;
    }
  },

  // ✅ Login user
  loginUser: async (email, password) => {
    try {
      console.log("🔐 Logging in user:", email);
      const response = await api.post(`${BASE_URL}/login`, { email, password });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }

      console.log("✅ Login success");
      return response;
    } catch (error) {
      console.error("❌ Login error:", error);
      throw error;
    }
  },

  // ✅ Fetch current user using token
  fetchCurrentUser: async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No token found');
      }

      const response = await api.get(`${BASE_URL}/current-user`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      console.log("✅ Current user fetched:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Fetch current user error:", error);
      throw error;
    }
  },

  // ✅ Logout user
  logoutUser: async () => {
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      const response = await api.post(`${BASE_URL}/logout`);
      console.log("🚪 User logged out successfully");
      return response;
    } catch (error) {
      console.error("❌ Logout error:", error);
      throw error;
    }
  },

  // ✅ Verify email
  verifyEmail: async (token) => {
    try {
      console.log("🔍 Verifying email for token:", token);
      const response = await api.get(`${BASE_URL}/verify-email?token=${token}`);
      console.log("✅ Email verification response:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Email verification error:", error);
      throw error;
    }
  },

  // ✅ Resend verification email
  resendVerification: async (email) => {
    try {
      console.log("📧 Resending verification to:", email);
      const response = await api.post(`${BASE_URL}/resend-verification?email=${email}`);
      console.log("✅ Resend verification success:", response.data);
      return response;
    } catch (error) {
      console.error("❌ Resend verification error:", error);
      throw error;
    }
  },
};

export default AuthServices;