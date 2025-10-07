import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { toast } from 'react-toastify';

const EmployeeLogin = ({ setEmployee }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [empId, setEmpId] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    
    // Validate all fields are filled
    if (!email || !password || !empId) {
      toast.error("❌ Please fill in all fields");
      return;
    }
    
    setLoading(true);
    
    try {
      // Trim and clean the empId to remove any extra spaces or quotes
      const cleanedEmpId = empId.trim().replace(/^"+|"+$/g, '');
      
      console.log("Login attempt:", {
        email: email,
        empId: cleanedEmpId,
        password: "***" // don't log actual password
      });

      const response = await EmployeeAuthServices.loginEmployee(email, password, cleanedEmpId);
      
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
        toast.info('📧 Please verify your email before logging in');
        setTimeout(() => {
          navigate('/employee/resend-verification', { state: { email } });
        }, 2000);
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
    if (!email) {
      toast.error("❌ Please enter your email first");
      return;
    }
    navigate('/employee/resend-verification', { state: { email } });
  };

  const handleForgotEmpId = () => {
    if (!email) {
      toast.error("❌ Please enter your email first");
      return;
    }
    navigate('/employee/forgot-empId', { state: { email } });
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
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value.trim())}
              className="px-4 py-3 rounded-xl bg-[#e6ecf5] shadow-[inset_6px_6px_12px_#b0b9c6,inset_-6px_-6px_12px_#ffffff] outline-none focus:shadow-[inset_2px_2px_6px_#b0b9c6,inset_-2px_-2px_6px_#ffffff]"
              placeholder="you@company.com"
            />
          </div>

          {/* Employee ID */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Employee ID *
              <span className="text-xs text-gray-500 ml-1">(Auto-generated during registration)</span>
            </label>
            <input
              type="text"
              required
              value={empId}
              onChange={(e) => setEmpId(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#e6ecf5] shadow-[inset_6px_6px_12px_#b0b9c6,inset_-6px_-6px_12px_#ffffff] outline-none focus:shadow-[inset_2px_2px_6px_#b0b9c6,inset_-2px_-2px_6px_#ffffff]"
              placeholder="Enter your Employee ID"
            />
          </div>

          {/* Password */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Password *
            </label>
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

        {/* Help Sections */}
        <div className="space-y-4 mt-6">
          {/* Resend Verification Section */}
          <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-700 text-center mb-2">
              Didn't receive verification email?
            </p>
            <button
              onClick={handleResendVerification}
              disabled={!email}
              className={`w-full text-sm font-medium underline ${
                email 
                  ? 'text-blue-600 hover:text-blue-800' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Resend Verification Email
            </button>
          </div>

          {/* Forgot Employee ID Section */}
          <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
            <p className="text-sm text-amber-700 text-center mb-2">
              Forgot your Employee ID?
            </p>
            <button
              onClick={handleForgotEmpId}
              disabled={!email}
              className={`w-full text-sm font-medium underline ${
                email 
                  ? 'text-amber-600 hover:text-amber-800' 
                  : 'text-gray-400 cursor-not-allowed'
              }`}
            >
              Retrieve Employee ID
            </button>
          </div>
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