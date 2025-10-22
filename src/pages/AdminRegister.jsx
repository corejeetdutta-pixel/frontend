// src/pages/AdminRegister.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AdminAuthService from '../api/AdminAuthService';
import { Eye, EyeOff } from 'lucide-react';

const AdminRegister = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    adminKey: '',
  });

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let inputValue = value;

    if (name === 'email') {
      inputValue = value.toLowerCase();
      const emailPattern = /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
      setEmailError(inputValue && !emailPattern.test(inputValue) ? 'Please enter a valid email address' : '');
    }

    if (name === 'password') {
      const passwordPattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
      setPasswordError(inputValue && !passwordPattern.test(inputValue) ?
        'Password must have 8+ chars with uppercase, lowercase, number, and special character' : '');
    }

    if (name === 'confirmPassword') {
      setConfirmPasswordError(inputValue !== formData.password ? 'Passwords do not match' : '');
    }

    setFormData(prev => ({ ...prev, [name]: inputValue }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (emailError || passwordError || confirmPasswordError) {
      alert('Please fix validation errors before submitting');
      return;
    }

    try {
      const response = await AdminAuthService.registerAdmin({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        adminKey: formData.adminKey,
      });
      alert('Registration successful!');
      console.log(response.data);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.message || 'Something went wrong!');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-600 via-purple-600 to-blue-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl p-10 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Admin Registration</h1>
        <p className="text-gray-600 text-center mb-8">Create an admin account</p>

        <form onSubmit={handleSubmit}>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Email Address</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className={`w-full px-4 py-3 rounded-lg border ${emailError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
              required
            />
            {emailError && <p className="text-red-500 text-sm mt-1">{emailError}</p>}
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Admin Key</label>
            <input
              type="password"
              name="adminKey"
              value={formData.adminKey}
              onChange={handleChange}
              placeholder="Enter admin access key"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-600 focus:border-transparent"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Provided by system administrator</p>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700 font-medium mb-2">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Create a password"
                className={`w-full px-4 py-3 pr-10 rounded-lg border ${passwordError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="text-red-500 text-sm mt-1">{passwordError}</p>}
          </div>

          <div className="mb-6">
            <label className="block text-gray-700 font-medium mb-2">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                className={`w-full px-4 py-3 pr-10 rounded-lg border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} focus:ring-2 focus:ring-purple-600 focus:border-transparent`}
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute inset-y-0 right-3 flex items-center justify-center text-gray-500"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && <p className="text-red-500 text-sm mt-1">{confirmPasswordError}</p>}
          </div>

          <div className="mb-6 flex items-center">
            <input type="checkbox" id="terms" className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded" required />
            <label htmlFor="terms" className="ml-2 block text-sm text-gray-700">
              I agree to the <a href="#" className="text-purple-600 hover:text-purple-800">Terms of Service</a> and <a href="#" className="text-purple-600 hover:text-purple-800">Privacy Policy</a>
            </label>
          </div>

          <button type="submit" className="w-full bg-purple-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-purple-700 transition">
            Register
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account? <Link to="/admin/admin-login" className="text-purple-600 font-semibold hover:text-purple-800">Login here</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminRegister;
