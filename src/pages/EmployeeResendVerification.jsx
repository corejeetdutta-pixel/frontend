import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const EmployeeResendVerification = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Pre-fill email from navigation state if available
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const response = await EmployeeAuthServices.resendVerification(email);
      setMessage('Verification email sent successfully! Please check your inbox.');
      toast.success('Verification email sent!');
    } catch (error) {
      const errorMsg = error.response?.data || 'Failed to send verification email. Please try again.';
      setMessage(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md p-8">
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-4 px-6 rounded-t-3xl -mx-8 -mt-8 mb-6">
          <h2 className="text-2xl font-bold text-center">Resend Verification Email</h2>
        </div>

        <form onSubmit={handleResend} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your registered email"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {message && (
            <div className={`p-3 rounded-lg ${
              message.includes('successfully') ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            }`}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
          >
            {loading ? 'Sending...' : 'Resend Verification Email'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <button
            onClick={() => navigate('/employee/employee-login')}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Back to Login
          </button>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default EmployeeResendVerification;