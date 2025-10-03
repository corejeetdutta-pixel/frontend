// src/pages/EmployeeRegister.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmployeeAuthServices from "../api/EmployeeAuthServices";
import TCText from "../assets/TC.txt?raw";
import ProcessTermsText from "../assets/Process_Terms_Graded_New.txt?raw";

const EmployeeRegister = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    empId: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [registered, setRegistered] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await EmployeeAuthServices.registerEmployee({
        ...formData,
        agreedToTerms: agreed,
      });

      setRegistered(true);
      // Removed NotificationContext usage
      console.log(`New employee registered: ${formData.name} (${formData.empId})`);
    } catch (err) {
      setError(err.response?.data || "Registration failed. Please try again.");
    }
  };

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
              Verification Email Sent!
            </h2>
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e6ecf5]">
      <div className="rounded-3xl shadow-lg bg-white w-full max-w-md p-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Employer <span className="text-[#0260a4]">Registration</span>
          </h2>
          <p className="text-sm text-gray-600">
            Create your account and start hiring smarter
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mb-6 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200 flex items-center shadow-md">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleRegister} className="space-y-5">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="you@company.com"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          {/* Employee ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Employee ID
            </label>
            <input
              type="text"
              name="empId"
              value={formData.empId}
              onChange={handleChange}
              required
              placeholder="Enter your employee ID"
              className="w-full px-4 py-3 rounded-xl border border-gray-300 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl border border-gray-300 outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-4 flex items-center text-gray-500"
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>
          </div>

          {/* Agreement */}
          <div className="flex items-start space-x-2">
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

          {/* Expanded Terms */}
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

          {/* Submit */}
          <button
            type="submit"
            disabled={!agreed}
            className={`w-full py-3 rounded-xl font-bold transition ${
              agreed
                ? "bg-[#0260a4] text-white hover:scale-105"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            🚀 Register
          </button>
        </form>

        {/* Footer */}
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
    </div>
  );
};

export default EmployeeRegister;
