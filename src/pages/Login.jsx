// src/pages/Login.jsx
import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import AuthServices from "../api/AuthServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const redirectJobId = location.state?.redirectJobId;

  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const validateField = (name, value) => {
    const newErrors = { ...errors };
    switch (name) {
      case "email":
        if (!value.trim()) newErrors.email = "Email is required";
        else delete newErrors.email;
        break;
      case "password":
        if (!value) newErrors.password = "Password is required";
        else delete newErrors.password;
        break;
      default:
        break;
    }
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors(validateField(name, value));
  };

  const validateForm = () => {
    const currentErrors = {
      ...validateField("email", formData.email),
      ...validateField("password", formData.password),
    };
    setErrors(currentErrors);
    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      toast.error("Please fix validation errors");
      return;
    }

    setLoading(true);
    try {
      await AuthServices.loginUser(formData.email, formData.password);
      const res = await AuthServices.fetchCurrentUser();
      setUser(res.data);
      toast.success("Login successful!");

      if (redirectJobId) {
        navigate("/home", { state: { selectedJobId: redirectJobId } });
      } else {
        navigate("/home");
      }
    } catch (err) {
      const errorMessage =
        err.response?.data || "Login failed. Please try again.";
      toast.error(errorMessage);

      if (errorMessage.toLowerCase().includes("not verified")) {
        setTimeout(() => {
          navigate("/resend-verification", { state: { email: formData.email } });
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-12 bg-[#e6ecf5]">
      <div className="rounded-3xl shadow-lg bg-white w-full max-w-md p-8">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Welcome Back!
          </h2>
          <p className="text-sm text-gray-600">
            Let's get you started on your recruitment journey
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
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
              placeholder="you@company.com"
              className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
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
                placeholder="••••••••"
                className={`w-full px-4 py-3 pr-12 rounded-xl border outline-none focus:border-[#0260a4] ${
                  errors.password ? "border-red-500" : "border-gray-300"
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

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || Object.keys(errors).length > 0}
            className={`w-full py-3 rounded-xl font-bold transition ${
              loading || Object.keys(errors).length > 0
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-[#0260a4] text-white hover:scale-105"
            }`}
          >
            {loading ? "🔄 Logging in..." : "🚀 Login"}
          </button>
        </form>

        {/* Links */}
        <div className="flex justify-between items-center mt-4 text-sm">
          <Link
            to="/forgot-password"
            className="text-[#0260a4] font-medium hover:underline"
          >
            Forgot Password?
          </Link>
          <Link
            to="/register"
            className="text-[#0260a4] font-medium hover:underline"
          >
            Register here
          </Link>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            Having trouble with email verification?{" "}
            <Link
              to="/resend-verification"
              className="text-[#0260a4] font-medium hover:underline"
            >
              Resend verification email
            </Link>
          </p>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Login;
