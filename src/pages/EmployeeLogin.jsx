import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { toast } from 'react-toastify';

const EmployeeLogin = ({ setEmployee }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await EmployeeAuthServices.loginEmployee(email, password);
      
      // Set employee data from login response directly
      setEmployee(response.data.user);
      
      // Store token in localStorage
      if (response.data.token) {
        localStorage.setItem('employeeToken', response.data.token);
        localStorage.setItem('employee', JSON.stringify(response.data.user));
      }
      
      toast.success("✅ Login successful!");
      
      // Navigate to employee home
      navigate('/employee/home');
    } catch (err) {
      console.error('Login error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || '❌ Login failed';
      toast.error(errorMessage);
      
      // Show resend verification link if email not verified
      if (errorMessage.includes('not verified')) {
        setTimeout(() => {
          navigate('/employee/resend-verification', { state: { email } });
        }, 3000);
      }
      
      // Clear any invalid tokens
      localStorage.removeItem('employeeToken');
      localStorage.removeItem('employee');
      setEmployee(null);
    } finally {
      setLoading(false);
    }
  };

  const handleResendVerification = () => {
    navigate('/employee/resend-verification', { state: { email } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12">
      <div className="bg-[#e6ecf5] rounded-3xl shadow-[8px_8px_16px_#b0b9c6,-8px_-8px_16px_#ffffff] p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-10">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2 drop-shadow">
            Welcome, <span className="text-[#0260a4]">Employer!</span>
          </h2>
          <p className="text-sm text-gray-600">Secure access to your hiring tools</p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#e6ecf5] shadow-[inset_6px_6px_12px_#b0b9c6,inset_-6px_-6px_12px_#ffffff] outline-none focus:shadow-[inset_2px_2px_6px_#b0b9c6,inset_-2px_-2px_6px_#ffffff]"
              placeholder="you@company.com"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 rounded-xl bg-[#e6ecf5] shadow-[inset_6px_6px_12px_#b0b9c6,inset_-6px_-6px_12px_#ffffff] outline-none focus:shadow-[inset_2px_2px_6px_#b0b9c6,inset_-2px_-2px_6px_#ffffff]"
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-[#0260a4] transition"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#0260a4] shadow-[6px_6px_12px_#1e3a5f,-6px_-6px_12px_#4d9be8] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? '⏳ Logging in...' : '🚀 Login'}
          </button>
        </form>

        {/* Resend Verification Section */}
        <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-700 text-center mb-2">
            Didn't receive verification email?
          </p>
          <button
            onClick={handleResendVerification}
            className="w-full text-sm text-blue-600 hover:text-blue-800 font-medium underline"
          >
            Resend Verification Email
          </button>
        </div>

        {/* Footer */}
        <p className="text-sm text-center text-gray-600 mt-8">
          Don't have an account?{' '}
          <Link to="/employee/employee-register" className="text-[#0260a4] font-semibold hover:underline">
            Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default EmployeeLogin;