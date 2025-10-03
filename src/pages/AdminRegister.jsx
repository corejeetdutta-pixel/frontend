// src/pages/AdminRegister.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminAuthService from '../api/AdminAuthService';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      const response = await AdminAuthService.registerAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey,
      });

      console.log("Admin registered:", response.data);
      alert("Registration successful!");
    } catch (err) {
      console.error("Error registering admin:", err.response?.data || err.message);
      alert(err.response?.data || "Something went wrong!");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="bg-purple-100 p-3 rounded-full">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-purple-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
            </svg>
          </div>
        </div>
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Admin Registration</h1>
        <p className="text-gray-600 text-center mb-8">Create an admin account</p>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Your full name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="adminKey" className="block text-gray-700 font-medium mb-2">Admin Key</label>
            <input
              type="password"
              id="adminKey"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Enter admin access key"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Provided by system administrator</p>
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              placeholder="Confirm your password"
              required
            />
          </div>
          
          <div className="mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="terms"
                className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                required
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
                I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
              </label>
            </div>
          </div>
          
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition focus:outline-none focus:ring-2 focus:ring-purple-600 focus:ring-opacity-50"
          >
            Register
          </button>
        </form>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/admin/admin-login" className="text-purple-600 font-semibold hover:text-purple-800">Login here</Link>
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

export default AdminRegister;
