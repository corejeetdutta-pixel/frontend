// src/pages/AdminLogin.jsx - Updated with proper admin state handling
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AdminAuthService from '../api/AdminAuthService';

const AdminLogin = ({ setAdmin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    adminKey: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // src/pages/AdminLogin.jsx
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsLoading(true);
  
  try {
    const response = await AdminAuthService.loginAdmin(formData);
    
    // Remove localStorage and rely on session cookie
    setAdmin(response.data.admin); // Update state only
    
    alert("Login successful!");
    navigate("/admin/home");
  } catch (err) {
    console.error("Error logging in:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Invalid credentials");
  } finally {
    setIsLoading(false);
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Admin Login</h1>
        <p className="text-gray-600 text-center mb-8">Access the admin dashboard</p>

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your password"
              required
            />
          </div>

          {/* Admin Key */}
          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Admin Key</label>
            <input
              type="password"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter system admin key"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition disabled:opacity-50"
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link to="/admin/admin-register" className="text-purple-600 font-semibold hover:text-purple-800">
              Register here
            </Link>
          </p>
        </div>
        <div className="mt-8 text-center">
          <Link to="/" className="text-gray-500 hover:text-gray-700 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;