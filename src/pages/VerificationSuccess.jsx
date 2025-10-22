import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const VerificationSuccess = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const type = searchParams.get('type') || 'user';

  useEffect(() => {
    // Redirect to appropriate login page after 5 seconds
    const timer = setTimeout(() => {
      navigate(type === 'employee' ? '/employee/employee-login' : '/login');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate, type]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
            <CheckCircleIcon className="h-10 w-10 text-green-600" />
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Email Verified Successfully!
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Your email has been successfully verified. You can now login to your account.
          </p>
          <p className="mt-4 text-sm text-gray-500">
            Redirecting to {type === 'employee' ? 'employer' : 'user'} login in 5 seconds...
          </p>
          <div className="mt-6">
            <button
              onClick={() => navigate(type === 'employee' ? '/employee/employee-login' : '/login')}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Login Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerificationSuccess;