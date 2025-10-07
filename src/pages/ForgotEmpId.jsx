// src/pages/ForgotEmpId.jsx
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { toast } from 'react-toastify';

const ForgotEmpId = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [empId, setEmpId] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Pre-fill email from location state if available
  useState(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleRetrieveEmpId = async (e) => {
    e.preventDefault();
    
    if (!email) {
      toast.error("❌ Please enter your email address");
      return;
    }

    setLoading(true);
    
    try {
      // This would call a new backend endpoint to retrieve EmpId by email
      const response = await EmployeeAuthServices.retrieveEmpId(email);
      setEmpId(response.data.empId);
      toast.success("✅ Employee ID retrieved successfully!");
    } catch (err) {
      console.error('Retrieve EmpId error:', err);
      const errorMessage = err.response?.data?.message || err.response?.data || '❌ Failed to retrieve Employee ID';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e6ecf5]">
      <div className="bg-[#e6ecf5] rounded-3xl shadow-[8px_8px_16px_#b0b9c6,-8px_-8px_16px_#ffffff] p-10 w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-extrabold text-gray-800 mb-2">
            Retrieve Employee ID
          </h2>
          <p className="text-sm text-gray-600">
            Enter your email to retrieve your Employee ID
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleRetrieveEmpId} className="space-y-6">
          {/* Email */}
          <div className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="px-4 py-3 rounded-xl bg-[#e6ecf5] shadow-[inset_6px_6px_12px_#b0b9c6,inset_-6px_-6px_12px_#ffffff] outline-none focus:shadow-[inset_2px_2px_6px_#b0b9c6,inset_-2px_-2px_6px_#ffffff]"
              placeholder="you@company.com"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#0260a4] shadow-[6px_6px_12px_#1e3a5f,-6px_-6px_12px_#4d9be8] hover:scale-[1.02] active:scale-[0.98] transition-transform disabled:opacity-50"
          >
            {loading ? '⏳ Retrieving...' : '🔍 Retrieve Employee ID'}
          </button>
        </form>

        {/* Display EmpId if retrieved */}
        {empId && (
          <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
            <h3 className="text-lg font-semibold text-green-800 mb-2 text-center">
              Your Employee ID
            </h3>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600 mb-2">{empId}</p>
              <p className="text-sm text-green-700">
                Please save this Employee ID for future logins
              </p>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          <button
            onClick={() => navigate('/employee/employee-login')}
            className="w-full py-2 text-sm text-[#0260a4] hover:underline font-medium"
          >
            ← Back to Login
          </button>
          
          <button
            onClick={() => navigate('/employee/resend-verification', { state: { email } })}
            className="w-full py-2 text-sm text-purple-600 hover:underline font-medium"
          >
            Need to resend verification email?
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotEmpId;