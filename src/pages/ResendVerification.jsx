import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ResendVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || '');
  const [isLoading, setIsLoading] = useState(false);
  const [hasSent, setHasSent] = useState(false);

  useEffect(() => {
    if (location.state?.email) {
      setEmail(location.state.email);
    }
  }, [location.state]);

  const handleResend = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      await AuthServices.resendVerification(email);
      toast.success('Verification email sent successfully!');
      setHasSent(true);
    } catch (error) {
      toast.error(error.response?.data || 'Failed to send verification email.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 text-center">
          <h2 className="text-2xl font-bold">Resend Verification Email</h2>
        </div>
        
        <div className="p-8">
          {hasSent ? (
            <div className="text-center">
              <div className="rounded-full h-16 w-16 bg-green-100 flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <p className="text-gray-700 mb-4">Verification email sent successfully!</p>
              <p className="text-gray-600 text-sm mb-6">Please check your inbox and click the verification link.</p>
              <button
                onClick={() => navigate('/login')}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium shadow"
              >
                Return to Login
              </button>
            </div>
          ) : (
            <form onSubmit={handleResend} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="Enter your email"
                  required
                />
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-2 rounded-lg transition font-medium shadow ${
                  isLoading
                    ? 'bg-blue-300 cursor-not-allowed'
                    : 'bg-green-600 hover:bg-green-700 text-white'
                }`}
              >
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </button>
              
              <div className="text-center mt-4">
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 text-sm"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ResendVerification;