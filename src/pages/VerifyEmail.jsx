import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    setToken(tokenFromUrl || '');
    
    if (!tokenFromUrl) {
      setMessage('Invalid verification link. No token provided.');
      setIsLoading(false);
      setIsSuccess(false);
      return;
    }

    verifyEmail(tokenFromUrl);
  }, [searchParams, navigate]);

  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);
      const response = await AuthServices.verifyEmail(token);
      setMessage(response.data);
      setIsSuccess(true);
      toast.success('Email verified successfully!');
      
      // Redirect to login after 3 seconds
      setTimeout(() => navigate('/login'), 3000);
    } catch (error) {
      console.error('Verification error:', error);
      const errorMsg = error.response?.data || 'Verification failed. Please try again.';
      setMessage(errorMsg);
      setIsSuccess(false);
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = () => {
    if (token) {
      verifyEmail(token);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md p-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Email Verification</h2>
        
        {isLoading ? (
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700">Verifying your email...</p>
          </div>
        ) : (
          <div>
            <div className={`rounded-full h-16 w-16 flex items-center justify-center mx-auto mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isSuccess ? (
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            
            <p className="text-gray-700 mb-4">{message}</p>
            
            {!isSuccess && token && (
              <div className="mt-4">
                <button
                  onClick={handleManualVerification}
                  className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!isSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-2">
                  Still having trouble? Request a new verification email.
                </p>
                <Link
                  to="/resend-verification"
                  className="text-blue-600 hover:text-blue-800 font-medium"
                >
                  Resend Verification Email
                </Link>
              </div>
            )}
            
            {isSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600">
                  Redirecting to login page...
                </p>
                <Link
                  to="/login"
                  className="text-blue-600 hover:text-blue-800 font-medium mt-2 inline-block"
                >
                  Go to Login Now
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default VerifyEmail;