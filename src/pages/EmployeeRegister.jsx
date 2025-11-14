// src/pages/EmployeeRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployeeAuthServices from "../api/EmployeeAuthServices";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import TCText from "../assets/TC.txt?raw";
import ProcessTermsText from "../assets/Process_Terms_Graded_New.txt?raw";

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    address: "",
    gender: "",
    dateOfBirth: "",
    gstNumber: "",
    password: "",
    confirmPassword: "",
    registrationKey: ""
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [generatedEmpId, setGeneratedEmpId] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const patterns = {
    name: /^[a-zA-Z\s.'-]{2,50}$/,
    email: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    mobile: /^[6-9]\d{9}$/,
    gst: /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
  };

  // Improved field validation
  const validateField = (name, value, formValues) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'name':
        if (!value.trim()) newErrors.name = 'Name is required';
        else if (!patterns.name.test(value)) newErrors.name = 'Name must be 2-50 chars with letters, spaces, apostrophes, hyphens, dots';
        else delete newErrors.name;
        break;

      case 'email':
        if (!value.trim()) newErrors.email = 'Email is required';
        else if (!patterns.email.test(value)) newErrors.email = 'Invalid email';
        else delete newErrors.email;
        break;

      case 'mobile':
        if (!value.trim()) newErrors.mobile = 'Mobile is required';
        else if (!patterns.mobile.test(value)) newErrors.mobile = 'Invalid 10-digit mobile';
        else delete newErrors.mobile;
        break;

      case 'gstNumber':
        if (!value.trim()) newErrors.gstNumber = 'GST number is required';
        else if (!patterns.gst.test(value.toUpperCase())) newErrors.gstNumber = 'Invalid GST number format';
        else delete newErrors.gstNumber;
        break;

      case 'password':
        if (!value) newErrors.password = 'Password is required';
        else if (!patterns.password.test(value)) newErrors.password = 'Password must be 8+ chars with uppercase, lowercase, number, special char';
        else delete newErrors.password;

        if (formValues.confirmPassword) {
          if (formValues.confirmPassword !== value) newErrors.confirmPassword = 'Passwords do not match';
          else if (!patterns.password.test(formValues.confirmPassword)) newErrors.confirmPassword = 'Confirm password must match pattern';
          else delete newErrors.confirmPassword;
        }
        break;

      case 'confirmPassword':
        if (!value) newErrors.confirmPassword = 'Please confirm password';
        else if (!patterns.password.test(value)) newErrors.confirmPassword = 'Confirm password must match pattern';
        else if (value !== formValues.password) newErrors.confirmPassword = 'Passwords do not match';
        else delete newErrors.confirmPassword;
        break;

      case 'dateOfBirth':
        if (!value) newErrors.dateOfBirth = 'Date of birth required';
        else {
          const dob = new Date(value);
          const today = new Date();
          const age = today.getFullYear() - dob.getFullYear();
          if (age < 18) newErrors.dateOfBirth = 'Must be at least 18';
          else if (age > 100) newErrors.dateOfBirth = 'Invalid DOB';
          else delete newErrors.dateOfBirth;
        }
        break;

      case 'address':
        if (!value.trim()) newErrors.address = 'Address required';
        else if (value.trim().length < 10) newErrors.address = 'Address must be 10+ chars';
        else if (value.trim().length > 500) newErrors.address = 'Address too long';
        else delete newErrors.address;
        break;

      case 'gender':
        if (!value) newErrors.gender = 'Gender required';
        else delete newErrors.gender;
        break;

      case 'registrationKey':
        if (!value.trim()) newErrors.registrationKey = 'Registration key required';
        else delete newErrors.registrationKey;
        break;

      default:
        break;
    }

    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    let processedValue = value;

    // auto-format
    if (name === 'gstNumber') processedValue = value.toUpperCase();
    if (name === 'email') processedValue = value.toLowerCase();
    if (name === 'mobile') processedValue = value.replace(/\D/g, '').slice(0, 10);

    const updatedForm = { ...formData, [name]: processedValue };

    const updatedErrors = validateField(name, processedValue, updatedForm);
    setFormData(updatedForm);
    setErrors(updatedErrors);
  };

  const validateForm = () => {
    const requiredFields = [
      'name', 'email', 'mobile', 'address', 'gender',
      'dateOfBirth', 'gstNumber', 'password',
      'confirmPassword', 'registrationKey'
    ];

    let currentErrors = { ...errors };
    requiredFields.forEach(field => {
      currentErrors = validateField(field, formData[field], formData);
    });
    setErrors(currentErrors);

    if (!agreed) {
      toast.error('Please agree to Terms & Conditions and Process Terms');
      return false;
    }

    return Object.keys(currentErrors).length === 0;
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      toast.error('Fix validation errors before submitting');
      return;
    }

    try {
      const { confirmPassword, ...registrationData } = formData;
      const response = await EmployeeAuthServices.registerEmployee({
        ...registrationData,
        agreedToTerms: agreed,
      });

      setGeneratedEmpId(response.data.empId);
      setRegistered(true);
      toast.success('Registration successful! Check your email for verification.');

      console.log(`New employee registered: ${formData.name} (${response.data.empId})`);

    } catch (err) {
      console.error('Registration error:', err);

      if (err.response?.data) {
        const backendErrors = err.response.data;
        if (typeof backendErrors === 'object') {
          const fieldErrors = {};
          Object.keys(backendErrors).forEach(key => fieldErrors[key] = backendErrors[key]);
          setErrors(fieldErrors);
          const firstError = Object.values(backendErrors)[0];
          toast.error(firstError);
        } else toast.error(backendErrors);
      } else toast.error(err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  // Success screen - combining both approaches
  if (registered) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e6ecf5]">
        <div className="rounded-3xl shadow-lg bg-white w-full max-w-md p-8 text-center">
          <div className="mb-6">
            <div className="w-20 h-20 mx-auto mb-4 rounded-full flex items-center justify-center bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-green-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Registration Successful!
            </h2>
            {generatedEmpId && (
              <>
                <p className="text-gray-600 mb-2">
                  Your Employee ID: <span className="font-bold text-[#0260a4]">{generatedEmpId}</span>
                </p>
                <p className="text-gray-600 text-sm mb-4">
                  Please save this Employee ID for login.
                </p>
              </>
            )}
            <p className="text-gray-600">
              We've sent a verification link to{" "}
              <span className="font-semibold">{formData.email}</span>.
            </p>
          </div>

          <button
            onClick={() => navigate("/employee/employee-login")}
            className="w-full py-3 rounded-xl font-bold text-white bg-[#0260a4] hover:scale-105 transition"
          >
            Go to Login
          </button>

          <button
            onClick={() => setRegistered(false)}
            className="mt-4 text-sm text-[#0260a4] hover:underline font-medium"
          >
            Register another account
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    );
  }

  // Main registration form - combining UI elements from both
  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e6ecf5]">
      <div className="rounded-3xl shadow-lg bg-white w-full max-w-2xl p-8 overflow-y-auto max-h-screen">
        {/* Header - from first code */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Employer <span className="text-[#0260a4]">Registration</span>
          </h2>
          <p className="text-sm text-gray-600">
            Create your account and start hiring smarter
          </p>
        </div>

        {/* Form - enhanced with validation from second code */}
        <form onSubmit={handleRegister} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Registration Key - from second code */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Registration Key *
                <span className="text-xs text-gray-500 ml-1">(Provided by your organization)</span>
              </label>
              <input
                type="text"
                name="registrationKey"
                value={formData.registrationKey}
                onChange={handleChange}
                required
                placeholder="Enter your registration key"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] bg-yellow-50 ${errors.registrationKey ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.registrationKey && (
                <p className="text-red-500 text-xs mt-1">{errors.registrationKey}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                You need a valid registration key provided by your organization to create an account.
              </p>
            </div>

            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.name && (
                <p className="text-red-500 text-xs mt-1">{errors.name}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email}</p>
              )}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mobile Number *
              </label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                required
                placeholder="10-digit mobile number"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.mobile ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.mobile && (
                <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
              )}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                required
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.gender ? 'border-red-500' : 'border-gray-300'
                  }`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && (
                <p className="text-red-500 text-xs mt-1">{errors.gender}</p>
              )}
            </div>

            {/* Date of Birth */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date of Birth *
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={formData.dateOfBirth}
                onChange={handleChange}
                required
                max={new Date().toISOString().split('T')[0]}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.dateOfBirth ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.dateOfBirth && (
                <p className="text-red-500 text-xs mt-1">{errors.dateOfBirth}</p>
              )}
            </div>

            {/* GST Number */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                GST Number *
              </label>
              <input
                type="text"
                name="gstNumber"
                value={formData.gstNumber}
                onChange={handleChange}
                required
                placeholder="e.g., 07AABCU9603R1ZM"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] uppercase ${errors.gstNumber ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.gstNumber && (
                <p className="text-red-500 text-xs mt-1">{errors.gstNumber}</p>
              )}
              <p className="text-xs text-gray-500 mt-1">
                Format: 2-digit state code + 10-digit PAN + 3-digit entity code + 1-digit check digit
              </p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password *
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none focus:border-[#0260a4] ${errors.password ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password *
              </label>
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  placeholder="••••••••"
                  className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none focus:border-[#0260a4] ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  className="absolute inset-y-0 right-4 flex items-center text-gray-500"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Password requirements */}
            <div className="md:col-span-2">
              <p className="text-xs text-gray-500 mt-1">
                Password must contain at least 8 characters with uppercase, lowercase, number, and special character
              </p>
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Address *
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                placeholder="Enter your complete address"
                rows="3"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] resize-none ${errors.address ? 'border-red-500' : 'border-gray-300'
                  }`}
              />
              {errors.address && (
                <p className="text-red-500 text-xs mt-1">{errors.address}</p>
              )}
            </div>
          </div>

          {/* Agreement - from first code with enhancements */}
          <div className="flex items-start space-x-2 pt-2">
            <input
              type="checkbox"
              id="agree"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="mt-1"
              required
            />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                className="text-[#0260a4] underline"
                onClick={() =>
                  setExpandedPdf(expandedPdf === "tc" ? null : "tc")
                }
              >
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button
                type="button"
                className="text-[#0260a4] underline"
                onClick={() =>
                  setExpandedPdf(expandedPdf === "process" ? null : "process")
                }
              >
                Process Terms
              </button>
            </label>
          </div>

          {/* Expanded Terms - from first code */}
          {expandedPdf && (
            <div className="w-full my-2 rounded-xl bg-gray-50 p-4 max-h-[40vh] overflow-auto shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800 text-lg">
                  {expandedPdf === "tc"
                    ? "Terms & Conditions"
                    : "Process Terms"}
                </span>
                <button
                  onClick={() => setExpandedPdf(null)}
                  className="text-gray-600 hover:text-gray-800 text-xl"
                >
                  &times;
                </button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">
                {expandedPdf === "tc" ? TCText : ProcessTermsText}
              </pre>
            </div>
          )}

          {/* Submit button - combining both */}
          <button
            type="submit"
            disabled={loading || !agreed || Object.keys(errors).length > 0}
            className={`w-full py-3 rounded-xl font-bold transition ${loading || !agreed || Object.keys(errors).length > 0
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-[#0260a4] text-white hover:scale-105"
              }`}
          >
            {loading ? "🔄 Registering..." : "🚀 Register"}
          </button>
        </form>

        {/* Footer - from first code */}
        <p className="text-sm text-center text-gray-600 mt-8">
          Already have an account?{" "}
          <Link
            to="/employee/employee-login"
            className="text-[#0260a4] font-semibold hover:underline"
          >
            Login here
          </Link>
        </p>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default EmployeeRegister;