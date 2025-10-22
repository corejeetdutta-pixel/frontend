import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const VerifyEmail = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [message, setMessage] = useState('Verifying your email...');
  const [isLoading, setIsLoading] = useState(true);
  const [isSuccess, setIsSuccess] = useState(false);
  const [token, setToken] = useState('');

  // ✅ Use your backend URL from .env or fallback
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8080';

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    console.log("🔍 VerifyEmail Component Mounted");
    console.log("📧 Token from URL:", tokenFromUrl);

    setToken(tokenFromUrl || '');

    if (!tokenFromUrl) {
      console.error("❌ No token found in URL");
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
      setIsSuccess(false);
      console.log("🔄 Starting verification for token:", token);

      let response;

      // 🧩 1️⃣ Try verifying as an EMPLOYEE first
      try {
        console.log("Attempting employee verification...");
        response = await axios.get(`${BACKEND_URL}/auth/employee/verify?token=${token}`);
        console.log("✅ Employee verification success:", response.data);
        setMessage(response.data.message || 'Employer email verified successfully!');
        setIsSuccess(true);
        toast.success('Employer email verified successfully!');
      } catch (employeeError) {
        console.warn("⚠️ Employee verification failed, trying job seeker...");

        // 🧩 2️⃣ Try verifying as a JOB SEEKER (user)
        try {
          response = await axios.get(`${BACKEND_URL}/auth/user/verify-email?token=${token}`);
          console.log("✅ User verification success:", response.data);
          setMessage(response.data.message || 'Job seeker email verified successfully!');
          setIsSuccess(true);
          toast.success('Job seeker email verified successfully!');
        } catch (userError) {
          console.error("❌ Both verifications failed:", userError);
          const errorMsg =
            userError.response?.data?.message ||
            userError.response?.data ||
            'Invalid or expired verification token.';
          setMessage(errorMsg);
          setIsSuccess(false);
          toast.error(errorMsg);
        }
      }

      if (response && response.status === 200) {
        setTimeout(() => {
          console.log("🔄 Redirecting to login page...");
          navigate('/login');
        }, 3000);
      }
    } catch (error) {
      console.error('❌ Verification error:', error);
      setMessage('Verification failed. Please try again later.');
      setIsSuccess(false);
      toast.error('Verification failed.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleManualVerification = () => {
    console.log("🔄 Manual verification triggered for token:", token);
    if (token) {
      verifyEmail(token);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md p-8 text-center">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-4 px-6 rounded-t-3xl -mx-8 -mt-8 mb-6">
          <h2 className="text-2xl font-bold">Email Verification</h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center py-6">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mb-4"></div>
            <p className="text-gray-700 font-medium">Verifying your email...</p>
            <p className="text-sm text-gray-500 mt-2">Token: {token.substring(0, 20)}...</p>
          </div>
        ) : (
          <div className="py-4">
            <div
              className={`rounded-full h-20 w-20 flex items-center justify-center mx-auto mb-4 ${
                isSuccess ? 'bg-green-100' : 'bg-red-100'
              }`}
            >
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
                  to="/resend-verification"
                  className="text-blue-600 hover:text-blue-800 font-medium underline"
                >
                  Resend Verification Email
                </Link>
              </div>
            )}

            {isSuccess && (
              <div className="mt-6 pt-4 border-t border-gray-200">
                <p className="text-sm text-gray-600 mb-3">Redirecting to login page...</p>
                <Link
                  to="/login"
                  className="inline-block px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-medium transition"
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
