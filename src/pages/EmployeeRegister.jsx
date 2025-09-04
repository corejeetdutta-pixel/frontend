// EmployeeRegister.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import { useNotifications } from '../contexts/NotificationContext';
import TCText from '../assets/TC.txt?raw';
import ProcessTermsText from '../assets/Process_Terms_Graded_New.txt?raw';

const EmployeeRegister = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [empId, setEmpId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { addNotification } = useNotifications();


  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      const res = await EmployeeAuthServices.registerEmployee({ 
        name, 
        email, 
        empId, 
        password, 
        agreedToTerms: agreed 
      });
      
      setRegistered(true);
      // Add notification
      addNotification({
        message: `New employer registered: ${name} (${empId})`,
        type: 'employer_registration'
      });
    } catch (err) {
      setError(err.response?.data || 'Registration failed. Please try again.');
    }
  };

  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 px-4 py-12">
        <div className="bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-md p-8 text-center animate-fade-in">
          <div className="mb-6">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-green-700 mb-2">Verification Email Sent!</h2>
            <p className="text-gray-600">
              We've sent a verification link to <span className="font-semibold">{email}</span>.
            </p>
          </div>
          
          <div className="bg-blue-50 rounded-lg p-4 mb-6 text-left border border-blue-100">
            <div className="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-500 mr-2 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 className="font-medium text-blue-800 mb-1">Important:</h3>
                <ul className="list-disc pl-5 space-y-1 text-blue-700 text-sm">
                  <li>Check your spam folder if you don't see the email</li>
                  <li>Verification link expires in 24 hours</li>
                  <li>Complete verification to access your account</li>
                </ul>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => navigate('/employee/employee-login')}
            className="w-full bg-green-600 text-white py-2.5 rounded-lg hover:bg-green-700 transition font-medium shadow mb-4"
          >
            Go to Login
          </button>
          
          <button
            onClick={() => setRegistered(false)}
            className="text-sm text-green-700 hover:underline font-medium"
          >
            Register another account
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-500 via-emerald-600 to-teal-700 px-4 py-12">
      <div className="bg-white shadow-xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-green-700 text-white py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-1">Employer Registration</h2>
          <p className="text-sm text-green-100">Create your account and start hiring smarter</p>
        </div>

        <div className="p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
          
          <form onSubmit={handleRegister} className="space-y-5">
            {/* ... existing form fields ... */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Enter your name"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
              <input
                type="text"
                value={empId}
                onChange={(e) => setEmpId(e.target.value)}
                required
                placeholder="Enter your employee ID"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-3 flex items-center text-lg"
                >
                  {showPassword ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="agree"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                required
              />
              <label htmlFor="agree" className="text-sm text-gray-700">
                I agree to the{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'tc' ? null : 'tc')}>Terms & Conditions</button>
                {' '}and{' '}
                <button type="button" className="text-blue-600 underline focus:outline-none" onClick={() => setExpandedPdf(expandedPdf === 'process' ? null : 'process')}>Process Terms</button>
              </label>
            </div>

            {expandedPdf === 'tc' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Terms & Conditions</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{TCText}</pre>
              </div>
            )}
            {expandedPdf === 'process' && (
              <div className="w-full my-2 border rounded bg-gray-50 p-4 animate-slide-down max-h-[60vh] overflow-auto">
                <div className="flex justify-between items-center mb-4">
                  <span className="font-semibold text-lg">Process Terms</span>
                  <button onClick={() => setExpandedPdf(null)} className="text-gray-500 hover:text-gray-700 text-xl">&times;</button>
                </div>
                <pre className="whitespace-pre-wrap text-base text-gray-900 font-sans text-left leading-relaxed tracking-normal" style={{fontFamily: 'Segoe UI, Arial, sans-serif', background: 'none', padding: 0, margin: 0}}>{ProcessTermsText}</pre>
              </div>
            )}
            
            <button
              type="submit"
              className={`w-full py-2.5 rounded-lg transition font-medium shadow ${
                agreed 
                  ? 'bg-green-600 text-white hover:bg-green-700' 
                  : 'bg-gray-200 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!agreed}
            >
              Register
            </button>
          </form>

          <p className="text-sm text-center text-gray-600 mt-6">
            Already have an account?{' '}
            <Link to="/employee/employee-login" className="text-green-700 hover:underline font-medium">
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default EmployeeRegister;