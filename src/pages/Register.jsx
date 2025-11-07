// src/pages/Register.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AuthServices from "../api/AuthServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TCText from "../assets/TC.txt?raw";
import ProcessTermsText from "../assets/Process_Terms_Graded_New.txt?raw";

const Register = ({ setUser }) => {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [expandedPdf, setExpandedPdf] = useState(null);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    mobile: "",
    address: "",
    gender: "",
    qualification: "",
    passoutYear: "",
    dob: "",
    experience: "",
    linkedin: "",
    github: "",
    skills: ["", "", "", "", ""],
    profilePicture: "", // base64
    resume: "" // base64 PDF
  });

  const [errors, setErrors] = useState({});

  const patterns = {
    name: /^[a-zA-Z\s.'-]{2,50}$/,
    email: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
    mobile: /^[6-9]\d{9}$/,
    password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
    year: /^(19|20)\d{2}$/,
    url: /^(https?:\/\/)?([\w-]+\.)+[\w-]{2,}(\/.*)?$/
  };

  // validate single field
  const validateField = (name, value, currentForm) => {
    const newErrors = { ...errors };

    switch (name) {
      case "name":
        if (!value?.trim()) newErrors.name = "Name is required";
        else if (!patterns.name.test(value.trim()))
          newErrors.name =
            "Name must be 2-50 chars (letters, spaces, ., ', - allowed)";
        else delete newErrors.name;
        break;

      case "email":
        if (!value?.trim()) newErrors.email = "Email is required";
        else if (!patterns.email.test(value.trim()))
          newErrors.email = "Invalid email address";
        else delete newErrors.email;
        break;

      case "mobile":
        if (!value?.trim()) newErrors.mobile = "Mobile is required";
        else if (!patterns.mobile.test(value.trim()))
          newErrors.mobile = "Invalid 10-digit mobile number";
        else delete newErrors.mobile;
        break;

      case "password":
        if (!value) newErrors.password = "Password is required";
        else if (!patterns.password.test(value))
          newErrors.password =
            "Password must be 8+ chars with uppercase, lowercase, number & special char";
        else delete newErrors.password;
        break;

      case "address":
        if (!value?.trim()) newErrors.address = "Address is required";
        else if (value.trim().length < 10)
          newErrors.address = "Address must be at least 10 characters";
        else delete newErrors.address;
        break;

      case "gender":
        if (!value) newErrors.gender = "Gender is required";
        else delete newErrors.gender;
        break;

      case "qualification":
        if (!value?.trim()) newErrors.qualification = "Qualification is required";
        else delete newErrors.qualification;
        break;

      case "passoutYear":
        if (!value?.toString().trim()) newErrors.passoutYear = "Passout year required";
        else if (!patterns.year.test(value.toString()))
          newErrors.passoutYear = "Enter a valid year (e.g., 2018)";
        else delete newErrors.passoutYear;
        break;

      case "dob":
        if (!value) newErrors.dob = "Date of birth required";
        else {
          const dob = new Date(value);
          const today = new Date();
          let age = today.getFullYear() - dob.getFullYear();
          const m = today.getMonth() - dob.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) age--;
          if (age < 18) newErrors.dob = "You must be at least 18 years old";
          else if (age > 100) newErrors.dob = "Date of birth looks invalid";
          else delete newErrors.dob;
        }
        break;

      case "experience":
        if (value === "" || value === null) newErrors.experience = "Experience required";
        else if (isNaN(Number(value)) || Number(value) < 0)
          newErrors.experience = "Enter valid experience in years (number)";
        else delete newErrors.experience;
        break;

      case "linkedin":
        if (value?.trim() && !patterns.url.test(value.trim()))
          newErrors.linkedin = "LinkedIn URL looks invalid";
        else delete newErrors.linkedin;
        break;

      case "github":
        if (value?.trim() && !patterns.url.test(value.trim()))
          newErrors.github = "GitHub URL looks invalid";
        else delete newErrors.github;
        break;

      case "skills":
        {
          const skillsArr = value || [];
          if (skillsArr.length > 5) newErrors.skills = "Max 5 skills allowed";
          else {
            const invalid = skillsArr.find(
              (s) => s && (s.length < 1 || s.length > 80)
            );
            if (invalid) newErrors.skills = "Each skill must be 1-80 characters";
            else delete newErrors.skills;
          }
        }
        break;

      case "profilePicture":
        if (!value) delete newErrors.profilePicture; // optional
        else delete newErrors.profilePicture;
        break;

      case "resume":
        if (!value) newErrors.resume = "Resume (PDF) is required";
        else delete newErrors.resume;
        break;

      default:
        break;
    }

    return newErrors;
  };

  // generic change handler
  const handleChange = (e) => {
    const { name, value, type } = e.target;
    let processed = value;

    if (name === "email") processed = value.toLowerCase();
    if (name === "mobile") processed = value.replace(/\D/g, "").slice(0, 10);

    const updatedForm = { ...formData, [name]: processed };
    setFormData(updatedForm);

    const updatedErrors = validateField(name, processed, updatedForm);
    setErrors(updatedErrors);
  };

  // skills change
  const handleSkillChange = (index, value) => {
    const updatedSkills = [...formData.skills];
    updatedSkills[index] = value;
    const updatedForm = { ...formData, skills: updatedSkills };
    setFormData(updatedForm);

    const updatedErrors = validateField("skills", updatedSkills, updatedForm);
    setErrors(updatedErrors);
  };

  // file handling: profilePicture (images) and resume (pdf)
  const handleFileChange = (e, field) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // file size check 5MB
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
      toast.error("File size must be less than 5MB");
      return;
    }

    if (field === "resume") {
      if (file.type !== "application/pdf") {
        toast.error("Resume must be a PDF");
        return;
      }
    } else if (field === "profilePicture") {
      if (!file.type.startsWith("image/")) {
        toast.error("Profile picture must be an image");
        return;
      }
    }

    const reader = new FileReader();
    reader.onload = () => {
      const updatedForm = { ...formData, [field]: reader.result };
      setFormData(updatedForm);
      const updatedErrors = validateField(field, reader.result, updatedForm);
      setErrors(updatedErrors);
    };
    reader.onerror = () => {
      toast.error("Error reading file");
    };
    reader.readAsDataURL(file);
  };

  // full-form validation before submit
  const validateForm = () => {
    const requiredFields = [
      "name",
      "email",
      "mobile",
      "password",
      "address",
      "gender",
      "qualification",
      "passoutYear",
      "dob",
      "experience",
      "resume"
    ];

    let currentErrors = { ...errors };
    requiredFields.forEach((f) => {
      currentErrors = validateField(f, formData[f], formData);
    });

    // also validate optional URL fields & skills
    currentErrors = validateField("linkedin", formData.linkedin, formData);
    currentErrors = validateField("github", formData.github, formData);
    currentErrors = validateField("skills", formData.skills, formData);

    setErrors(currentErrors);

    if (!agreed) {
      toast.error("Please agree to Terms & Conditions and Process Terms");
      return false;
    }

    return Object.keys(currentErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!validateForm()) {
      setLoading(false);
      toast.error("Fix validation errors before submitting");
      return;
    }

    try {
      // Prepare payload - remove empty skills, keep base64 files
      const filteredSkills = formData.skills.filter((s) => s && s.trim() !== "");
      const payload = {
        ...formData,
        skills: filteredSkills,
        agreedToTerms: agreed
      };

      // Call your auth service
      const response = await AuthServices.registerUser(payload);

      // handle success
      setServerMessage(response?.data?.message || "Registration successful");
      setRegistrationSuccess(true);

      // optionally set user in app state if backend returned user object/token
      if (response?.data?.user && typeof setUser === "function") {
        setUser(response.data.user);
      }

      toast.success("Registration successful! Check your email to verify your account.");
    } catch (err) {
      console.error("Registration error:", err);
      const errorMessage =
        err?.response?.data?.message ||
        err?.response?.data ||
        err?.message ||
        "Registration failed. Please try again.";
      // if backend returned field errors object, set them
      if (err?.response?.data && typeof err.response.data === "object") {
        const backendData = err.response.data;
        // if structure is { fieldName: "error" } or similar
        const fieldErrs = {};
        Object.keys(backendData).forEach((k) => {
          fieldErrs[k] = backendData[k];
        });
        setErrors((prev) => ({ ...prev, ...fieldErrs }));
      }
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Success screen
  if (registrationSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-600 via-blue-600 to-indigo-700 px-4 py-12">
        <div className="bg-white shadow-2xl rounded-3xl overflow-hidden w-full max-w-2xl p-8 text-center">
          <div className="bg-gradient-to-r from-green-600 to-blue-700 text-white py-6 px-6 rounded-t-3xl mb-6">
            <h2 className="text-3xl font-extrabold mb-2">Registration Successful!</h2>
          </div>

          <div className="mb-6">
            <svg className="w-16 h-16 text-green-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Please verify your email</h3>
            <p className="text-gray-600 mb-4">
              We've sent a verification link to <strong>{formData.email}</strong>. Please check your inbox and click the link to verify your account.
            </p>

            {serverMessage && <p className="text-gray-500 text-sm mb-4">{serverMessage}</p>}

            <p className="text-gray-500 text-sm mb-6">
              Didn't receive the email? Check your spam folder or{" "}
              <button
                className="text-blue-600 ml-1 hover:underline"
                onClick={() =>
                  navigate("/resend-verification", { state: { email: formData.email } })
                }
              >
                click here to resend
              </button>
            </p>
          </div>

          <button onClick={() => navigate("/login")} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition">
            Go to Login
          </button>
        </div>
        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    );
  }

  // Registration form UI
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#e6ecf5] px-4 py-12">
      <div className="rounded-3xl shadow-lg bg-white w-full max-w-3xl p-8 overflow-y-auto max-h-screen">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-2">
            Complete <span className="text-[#0260a4]">Registration</span>
          </h2>
          <p className="text-sm text-gray-600">Upload your profile picture and resume to get started.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name *</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.name ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="you@company.com"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.email ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.password ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
            </div>

            {/* Mobile */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number *</label>
              <input
                type="tel"
                name="mobile"
                value={formData.mobile}
                onChange={handleChange}
                placeholder="10-digit mobile number"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.mobile ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.mobile && <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>}
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender *</label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.gender ? "border-red-500" : "border-gray-300"}`}
              >
                <option value="">Select Gender</option>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            {/* Qualification */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Highest Qualification *</label>
              <input
                type="text"
                name="qualification"
                value={formData.qualification}
                onChange={handleChange}
                placeholder="e.g., B.Tech, MBA"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.qualification ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.qualification && <p className="text-red-500 text-xs mt-1">{errors.qualification}</p>}
            </div>

            {/* Passout Year */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Passout Year *</label>
              <input
                type="number"
                name="passoutYear"
                value={formData.passoutYear}
                onChange={handleChange}
                placeholder="e.g., 2020"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.passoutYear ? "border-red-500" : "border-gray-300"}`}
                min="1900"
                max={new Date().getFullYear()}
              />
              {errors.passoutYear && <p className="text-red-500 text-xs mt-1">{errors.passoutYear}</p>}
            </div>

            {/* DOB */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth *</label>
              <input
                type="date"
                name="dob"
                value={formData.dob}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.dob ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.dob && <p className="text-red-500 text-xs mt-1">{errors.dob}</p>}
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Experience (Years) *</label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="0"
                min="0"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.experience ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.experience && <p className="text-red-500 text-xs mt-1">{errors.experience}</p>}
            </div>

            {/* LinkedIn */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">LinkedIn URL</label>
              <input
                type="url"
                name="linkedin"
                value={formData.linkedin}
                onChange={handleChange}
                placeholder="https://linkedin.com/in/yourprofile"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.linkedin ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.linkedin && <p className="text-red-500 text-xs mt-1">{errors.linkedin}</p>}
            </div>

            {/* GitHub */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">GitHub URL</label>
              <input
                type="url"
                name="github"
                value={formData.github}
                onChange={handleChange}
                placeholder="https://github.com/yourusername"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] ${errors.github ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.github && <p className="text-red-500 text-xs mt-1">{errors.github}</p>}
            </div>

            {/* Address (full-width) */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Address *</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                rows="3"
                placeholder="Enter your complete address"
                className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#0260a4] resize-none ${errors.address ? "border-red-500" : "border-gray-300"}`}
              />
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          {/* Skills section */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (Max 5)</label>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-2">
              {formData.skills.map((skill, i) => (
                <input
                  key={i}
                  type="text"
                  value={skill}
                  onChange={(e) => handleSkillChange(i, e.target.value)}
                  placeholder={`Skill ${i + 1}`}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                />
              ))}
            </div>
            {errors.skills && <p className="text-red-500 text-xs mt-1">{errors.skills}</p>}
          </div>

          {/* File uploads */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture (Max 5MB)</label>
              <input type="file" accept="image/*" onChange={(e) => handleFileChange(e, "profilePicture")} className="w-full" />
              {formData.profilePicture && (
                <img src={formData.profilePicture} alt="Preview" className="mt-2 w-24 h-24 object-cover rounded-full border" />
              )}
              {errors.profilePicture && <p className="text-red-500 text-xs mt-1">{errors.profilePicture}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Resume (PDF, Max 5MB) *</label>
              <input type="file" accept="application/pdf" required onChange={(e) => handleFileChange(e, "resume")} className="w-full" />
              {formData.resume && <p className="text-sm text-green-700 mt-1">Resume file attached ✅</p>}
              {errors.resume && <p className="text-red-500 text-xs mt-1">{errors.resume}</p>}
            </div>
          </div>

          {/* Terms & Conditions */}
          <div className="flex items-start space-x-2 pt-2">
            <input type="checkbox" id="agree" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} className="mt-1" required />
            <label htmlFor="agree" className="text-sm text-gray-600">
              I agree to the{" "}
              <button type="button" className="text-[#0260a4] underline" onClick={() => setExpandedPdf(expandedPdf === "tc" ? null : "tc")}>
                Terms & Conditions
              </button>{" "}
              and{" "}
              <button type="button" className="text-[#0260a4] underline" onClick={() => setExpandedPdf(expandedPdf === "process" ? null : "process")}>
                Process Terms
              </button>
            </label>
          </div>

          {/* Expandable PDF viewers */}
          {expandedPdf && (
            <div className="w-full my-2 rounded-xl bg-gray-50 p-4 max-h-[40vh] overflow-auto shadow-inner">
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-gray-800 text-lg">{expandedPdf === "tc" ? "Terms & Conditions" : "Process Terms"}</span>
                <button onClick={() => setExpandedPdf(null)} className="text-gray-600 hover:text-gray-800 text-xl">&times;</button>
              </div>
              <pre className="whitespace-pre-wrap text-sm text-gray-800 leading-relaxed">{expandedPdf === "tc" ? TCText : ProcessTermsText}</pre>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading || !agreed || Object.keys(errors).length > 0}
            className={`w-full py-3 rounded-xl font-bold transition ${loading || !agreed || Object.keys(errors).length > 0 ? "bg-gray-300 text-gray-500 cursor-not-allowed" : "bg-[#0260a4] text-white hover:scale-105"}`}
          >
            {loading ? "🔄 Registering..." : "🚀 Register"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <button onClick={() => navigate("/login")} className="text-[#0260a4] font-semibold hover:underline">
            Login here
          </button>
        </p>
      </div>

      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
};

export default Register;
