// src/pages/ManualVerification.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ManualVerification = () => {
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleVerification = async (e) => {
    e.preventDefault();
    if (!token.trim()) {
      toast.error('Please enter a verification token');
      return;
    }

    setIsLoading(true);
    try {
      const response = await AuthServices.verifyEmail(token);
      toast.success(response.data);
      setTimeout(() => navigate('/login'), 2000);
    } catch (error) {
      toast.error(error.response?.data || 'Verification failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 text-center">
          <h2 className="text-2xl font-bold">Manual Email Verification</h2>
          <p className="text-sm text-blue-100 mt-2">
            Enter your verification token below
          </p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleVerification} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Verification Token
              </label>
              <input
                type="text"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Paste your verification token here"
                required
              />
              <p className="text-sm text-gray-500 mt-1">
                This token was sent to your email address
              </p>
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
              {isLoading ? 'Verifying...' : 'Verify Email'}
            </button>
          </form>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Need a new verification token?{' '}
              <button
                onClick={() => navigate('/resend-verification')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Resend Verification Email
              </button>
            </p>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default ManualVerification;