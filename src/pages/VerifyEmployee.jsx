// In VerifyEmployee.jsx - Add proper logging and fix the flow
import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmployee = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    console.log("🔍 EMPLOYEE Verify Component Mounted");
    console.log("📧 Token from URL:", tokenFromUrl);
    
    setToken(tokenFromUrl || '');
    
    if (!tokenFromUrl) {
      console.error("❌ No token found in URL");
      setMessage('Invalid verification link. No token provided.');
      setIsLoading(false);
      setIsSuccess(false);
      toast.error('Invalid verification link');
      return;
    }

    verifyEmail(tokenFromUrl);
  }, [searchParams]);

  const verifyEmail = async (token) => {
    try {
      setIsLoading(true);
      console.log("🔄 Starting EMPLOYEE verification for token:", token);
      
      const response = await EmployeeAuthServices.verifyEmail(token);
      console.log("✅ EMPLOYEE verification response:", response.data);
      
      setMessage(response.data.message || 'Email verified successfully!');
      setIsSuccess(true);
      toast.success('Email verified successfully!');
      
      // Redirect to employee login after 3 seconds
      setTimeout(() => {
        console.log("🔄 Redirecting to EMPLOYEE login page");
        navigate('/employee/employee-login');
      }, 3000);
      
    } catch (error) {
      console.error('❌ EMPLOYEE verification error:', error);
      
      let errorMsg = 'Verification failed. Please try again.';
      
      if (error.response?.data) {
        // Handle different response formats
        if (typeof error.response.data === 'string') {
          errorMsg = error.response.data;
        } else if (error.response.data.message) {
          errorMsg = error.response.data.message;
        } else if (error.response.data.error) {
          errorMsg = error.response.data.error;
        }
      } else if (error.message) {
        errorMsg = error.message;
      }
      
      setMessage(errorMsg);
      setIsSuccess(false);
      toast.error(errorMsg);
      
      // Check if token is invalid/expired
      if (errorMsg.toLowerCase().includes('invalid') || errorMsg.toLowerCase().includes('expired')) {
        setTimeout(() => {
          navigate('/employee/resend-verification');
        }, 5000);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = () => {
    console.log("🔄 Manual EMPLOYEE verification triggered for token:", token);
    if (token) {
      verifyEmail(token);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md p-8 text-center">
        <div className="bg-gradient-to-r from-purple-600 to-blue-700 text-white py-4 px-6 rounded-t-3xl -mx-8 -mt-8 mb-6">
          <h2 className="text-2xl font-bold">Employer Email Verification</h2>
        </div>
        
        {isLoading ? (
          <div className="flex flex-col items-center py-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Verifying your email...</p>
            <p className="text-sm text-gray-500 mt-2">Token: {token ? `${token.substring(0, 20)}...` : 'No token'}</p>
          </div>
        ) : (
          <div className="py-4">
            <div className={`rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 ${
              isSuccess ? 'bg-green-100' : 'bg-red-100'
            }`}>
              {isSuccess ? (
                <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              ) : (
                <svg className="w-10 h-10 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              )}
            </div>
            
            <h3 className={`text-xl font-semibold mb-3 ${isSuccess ? 'text-green-700' : 'text-red-700'}`}>
              {isSuccess ? 'Verification Successful!' : 'Verification Failed'}
            </h3>
            
            <p className="text-gray-700 mb-4 leading-relaxed">{message}</p>
            
            {!isSuccess && token && (
              <div className="mt-4 mb-6">
                <button
                  onClick={handleManualVerification}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition"
                >
                  Try Again
                </button>
              </div>
            )}
            
            {!isSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Still having trouble? Request a new verification email.
                </p>
                <Link
                  to="/employee/resend-verification"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Resend Verification Email
                </Link>
              </div>
            )}
            
            {isSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">
                  Redirecting to employer login page...
                </p>
                <Link
                  to="/employee/employee-login"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
                >
                  Go to Employer Login
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default VerifyEmployee;