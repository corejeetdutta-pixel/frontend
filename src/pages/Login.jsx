import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get jobId from navigation state if exists
  const redirectJobId = location.state?.redirectJobId;

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!formData.email || !formData.password) {
      toast.error('Please fill in both email and password');
      setLoading(false);
      return;
    }

    if (!agreedToDisclaimer) {
      toast.error('Please agree to the AI Evaluation Consent Agreement');
      setLoading(false);
      return;
    }

    try {
      await AuthServices.loginUser(formData.email, formData.password);
      const res = await AuthServices.fetchCurrentUser();
      setUser(res.data);
      toast.success('Login successful!');
      
      // Redirect to home with jobId if exists
      if (redirectJobId) {
        navigate('/home', { 
          state: { selectedJobId: redirectJobId } 
        });
      } else {
        navigate('/home');
      }
    } catch (err) {
      const errorMessage = err.response?.data || 'Login failed. Please try again.';
      toast.error(errorMessage);
      
      // If the error is about email not being verified
      if (errorMessage.includes('not verified')) {
        // Provide a link to resend verification
        setTimeout(() => {
          navigate('/resend-verification', { state: { email: formData.email } });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-md">
        <div className="bg-[#0260a4] py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold text-white mb-1">Welcome Back!</h2>
          <p className="text-sm text-blue-100">
            Let's get you started on your recruitment journey
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none pr-10"
                  placeholder="Enter your password"
                  required
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

            {/* Disclaimer Section */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 max-h-60 overflow-y-auto">
              <h3 className="text-sm font-semibold text-gray-800 mb-3 text-center">
                AI Evaluation Consent Agreement
              </h3>
              <div className="text-xs text-gray-600 space-y-2">
                <p className="font-medium">Disclaimer</p>
                <p>This application process includes AI-generated evaluations. While our systems are designed for accuracy and fairness, automated assessments may occasionally produce unintended outputs.</p>
                <p>By proceeding, you acknowledge and consent to AI-assisted screening as part of the evaluation process.</p>
                
                <p className="font-medium mt-3">By proceeding with this application, I acknowledge and agree that:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>The evaluation and screening process may involve AI-generated questions and assessments.</li>
                  <li>The AI system is designed to maintain fairness and accuracy; however, automated outputs may occasionally vary or contain unintended responses.</li>
                  <li>Final hiring decisions are made by human reviewers, and AI evaluations are only a supporting tool in the process.</li>
                  <li>I consent to the use of AI-assisted analysis for my application and responses, in accordance with the organization's Privacy Policy.</li>
                </ul>
              </div>
            </div>

            {/* Agreement Checkbox */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="disclaimer-agreement"
                checked={agreedToDisclaimer}
                onChange={(e) => setAgreedToDisclaimer(e.target.checked)}
                className="mt-1 text-blue-600 focus:ring-blue-500"
                required
              />
              <label htmlFor="disclaimer-agreement" className="text-sm text-gray-700">
                I have read and agree to the AI Evaluation Consent Agreement
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || !agreedToDisclaimer}
              className={`w-full py-2.5 rounded-lg transition font-medium shadow ${
                loading || !agreedToDisclaimer
                  ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="flex justify-between items-center mt-4 text-sm">
            <Link
              to="/forgot-password"
              className="text-green-700 font-medium hover:underline"
            >
              Forgot Password?
            </Link>
            <Link
              to="/register"
              className="text-green-700 font-medium hover:underline"
            >
              Register here
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-600 text-center">
              Having trouble with email verification?{' '}
              <Link
                to="/resend-verification"
                className="text-blue-600 font-medium hover:underline"
              >
                Resend verification email
              </Link>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Login;