import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../api/AuthServices';
import { toast, ToastContainer } from 'react-toastify';
import { useNotifications } from '../contexts/NotificationContext';
import 'react-toastify/dist/ReactToastify.css';
import TCText from '../assets/TC.txt?raw';
import ProcessTermsText from '../assets/Process_Terms_Graded_New.txt?raw';

const Register = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false); // New state
  const { addNotification } = useNotifications();


  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    mobile: '',
    address: '',
    gender: '',
    qualification: '',
    passoutYear: '',
    dob: '',
    experience: '',
    linkedin: '',
    github: '',
    skills: ['', '', '', '', ''],
    profilePicture: '',
    resume: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    setFormData({ ...formData, skills: updatedSkills });
  };

  const handleFileChange = (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({
        ...prev,
        [field]: reader.result
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await AuthServices.registerUser({ ...formData, agreedToTerms: agreed });
      setRegistrationSuccess(true); // Show success message instead of redirecting
      toast.success('Registration successful! Please check your email to verify your account.');
      // Add notification
      addNotification({
        message: `New job seeker registered: ${formData.name}`,
        type: 'job_seeker_registration'
      });
    } catch (err) {
      toast.error(err.response?.data || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // If registration was successful, show verification message
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-2xl p-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 rounded-t-3xl mb-6">
            <h2 className="text-3xl font-extrabold mb-2">Registration Successful!</h2>
          </div>
          
          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Please verify your email</h3>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to <strong>{formData.email}</strong>. 
              Please check your inbox and click on the link to verify your account.
            </p>
            <p className="text-gray-500 text-sm mb-6">
              Didn't receive the email? Check your spam folder or 
              <button 
                className="text-blue-600 ml-1 hover:underline"
                onClick={() => {/* Add resend functionality here if needed */}}
              >
                click here to resend
              </button>
            </p>
          </div>
          
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition"
          >
            Go to Login
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  // Original registration form
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
      <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-2xl">
        <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 text-center">
          <h2 className="text-3xl font-extrabold mb-1">Complete Registration</h2>
          <p className="text-sm text-blue-100">Upload your profile picture and resume!</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Personal Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {field: 'name', label: 'Full Name'},
                {field: 'email', label: 'Email', type: 'email'},
                {field: 'password', label: 'Password', type: 'password'},
                {field: 'mobile', label: 'Mobile'},
                {field: 'address', label: 'Address'},
                {field: 'gender', label: 'Gender'},
                {field: 'qualification', label: 'Highest Qualification'},
                {field: 'passoutYear', label: 'Passout Year'},
                {field: 'dob', label: 'Date of Birth', type: 'date'},
                {field: 'experience', label: 'Experience (Years)'},
                {field: 'linkedin', label: 'LinkedIn URL', type: 'url'},
                {field: 'github', label: 'GitHub URL', type: 'url'},
              ].map(({field, label, type = 'text'}) => (
                <div key={field}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {label}
                  </label>
                  <input
                    type={type}
                    name={field}
                    required={field !== 'github' && field !== 'linkedin'}
                    value={formData[field]}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                    placeholder={`Enter your ${label.toLowerCase()}`}
                  />
                </div>
              ))}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Max 5)</label>
              {formData.skills.map((skill, index) => (
                <input
                  key={index}
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(index, e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg mb-2"
                  placeholder={`Skill ${index + 1}`}
                />
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileChange(e, 'profilePicture')}
                  className="w-full"
                />
                {formData.profilePicture && (
                  <img
                    src={formData.profilePicture}
                    alt="Preview"
                    className="mt-2 w-24 h-24 object-cover rounded-full border"
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF)</label>
                <input
                  type="file"
                  accept="application/pdf"
                  onChange={(e) => handleFileChange(e, 'resume')}
                  className="w-full"
                />
                {formData.resume && (
                  <p className="text-sm text-green-700 mt-1">Resume file attached ✅</p>
                )}
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
              disabled={loading || !agreed}
              className={`w-full py-2 rounded-lg transition font-medium shadow ${
                loading || !agreed
                  ? 'bg-blue-300 cursor-not-allowed'
                  : 'bg-green-600 hover:bg-green-700 text-white'
              }`}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default Register;