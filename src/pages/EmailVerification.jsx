// src/pages/EmailVerification.jsx
import { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import axios from '../api/axiosInstance';
import EmployeeAuthServices from '../api/EmployeeAuthServices';

const EmailVerification = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isSuccess, setIsSuccess] = useState(false);
  const [userType, setUserType] = useState(''); // 'user' or 'employee'
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = searchParams.get('token');
    const type = searchParams.get('type'); // Get user type from URL
    
    if (!token) {
      setMessage('Invalid verification link. No token provided.');
      setIsLoading(false);
      return;
    }

    setUserType(type || 'user');

    const verifyEmail = async () => {
      try {
        let response;
        
        if (type === 'employee') {
          response = await EmployeeAuthServices.verifyEmail(token);
        } else {
          response = await axios.get(`/auth/user/verify-email?token=${token}`);
        }
        
        setMessage(response.data);
        setIsSuccess(true);
        
        // Automatically redirect to login after 3 seconds on success
        setTimeout(() => {
          navigate(type === 'employee' ? '/employee/employee-login' : '/login');
        }, 3000);
      } catch (error) {
        console.error('Verification error:', error);
        
        // More specific error messages
        if (error.response?.status === 400) {
          setMessage(error.response.data || 'Invalid or expired verification token.');
        } else if (error.response?.status === 404) {
          setMessage('Verification endpoint not found. Please contact support.');
        } else if (error.code === 'NETWORK_ERROR') {
          setMessage('Network error. Please check your connection and try again.');
        } else {
          setMessage('Failed to verify email. The link may have expired or is invalid.');
        }
        
        setIsSuccess(false);
      } finally {
        setIsLoading(false);
      }
    };

    verifyEmail();
  }, [searchParams, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Verifying your email...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-md w-full bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">
          Email Verification
        </h2>
        <div className={`p-4 rounded-md ${isSuccess ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
          {message}
          {isSuccess && (
            <p className="mt-2 text-sm">
              Redirecting to login page in 3 seconds...
            </p>
          )}
        </div>
        <div className="mt-6 text-center">
          {isSuccess ? (
            <Link
              to={userType === 'employee' ? '/employee/employee-login' : '/login'}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Go to Login Now
            </Link>
          ) : (
            <div className="space-y-3">
              <Link
                to="/resend-verification"
                className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              >
                Resend Verification Email
              </Link>
              <Link
                to="/"
                className="block bg-gray-600 text-white px-4 py-2 rounded-md hover:bg-gray-700"
              >
                Return to Home
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EmailVerification;