import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import JobServices from "../api/JobServices";
import EmployeeAuthServices from "../api/EmployeeAuthServices";
import { useLocation } from "react-router-dom";

const predefinedLocations = [
  "Bangalore", "Hyderabad", "Mumbai", "Delhi", "Pune",
  "Chennai", "Kolkata", "Noida", "Gurgaon", "Ahmedabad", "Other"
];

const qualificationOptions = [
  "High School", "Diploma", "Bachelor's Degree",
  "Master's Degree", "Doctorate / PhD", "Other"
];

const AddJob = ({ onJobAdded }) => {
  const location = useLocation();
  const initialData = location.state || null;

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setError,
    setValue,
    clearErrors
  } = useForm();

  const [user, setUser] = useState(null);
  const [previousJobData, setPreviousJobData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const watchLocation = watch("location", "");
  const watchQualification = watch("highestQualification", "");

  useEffect(() => {
    EmployeeAuthServices.fetchCurrentEmployee()
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    if (initialData) {
      // Set all form values from initialData
      Object.keys(initialData).forEach(key => {
        if (initialData[key] !== undefined) {
          setValue(key, initialData[key]);
        }
      });
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    if (!user) {
      alert("⚠️ Please login as an employer to post a job.");
      return;
    }

    setIsSubmitting(true);
    setSubmitError("");

    try {
      // Use the pre-calculated salary strings from JD Generator if available
      let minSalary = data.minSalary;
      let maxSalary = data.maxSalary;

      // If not provided by JD Generator, calculate them
      if (!minSalary || !maxSalary) {
        const minSalaryValue = 
          (parseInt(data.minSalaryLakh || 0) * 100000) +
          (parseInt(data.minSalaryThousand || 0) * 1000);
        
        const maxSalaryValue = 
          (parseInt(data.maxSalaryLakh || 0) * 100000) +
          (parseInt(data.maxSalaryThousand || 0) * 1000);

        minSalary = `${(minSalaryValue / 100000).toFixed(2)}L`;
        maxSalary = `${(maxSalaryValue / 100000).toFixed(2)}L`;
      }

      const openingDate = new Date(data.openingDate);
      const closingDate = new Date(data.closingDate);

      // Validate salary
      if (data.minSalaryLakh && data.maxSalaryLakh) {
        const minSalaryValue = 
          (parseInt(data.minSalaryLakh || 0) * 100000) +
          (parseInt(data.minSalaryThousand || 0) * 1000);
        
        const maxSalaryValue = 
          (parseInt(data.maxSalaryLakh || 0) * 100000) +
          (parseInt(data.maxSalaryThousand || 0) * 1000);

        if (maxSalaryValue <= minSalaryValue) {
          setError("maxSalaryLakh", { message: "Max salary must be greater than min salary." });
          setIsSubmitting(false);
          return;
        }
      }

      if (closingDate <= openingDate) {
        setError("closingDate", { message: "Closing date must be after opening date." });
        setIsSubmitting(false);
        return;
      }

      const jobData = {
        jobId: uuidv4(),
        title: data.title,
        company: data.company?.trim() || user.company || "N/A",
        location: data.location === "Other" ? data.otherLocation : data.location,
        highestQualification: data.highestQualification === "Other" ? data.otherQualification : data.highestQualification,
        minSalary: minSalary,
        maxSalary: maxSalary,
        experience: data.experience,
        jobType: data.jobType,
        description: data.description,
        responsibilities: data.responsibilities,
        requirements: data.requirements,
        perks: data.perks,
        department: data.department,
        employmentType: data.employmentType,
        openings: parseInt(data.openings) || 1,
        openingDate: data.openingDate,
        lastDate: data.closingDate,
        mode: data.mode,
        contactEmail: data.contactEmail,
      };

      console.log("Submitting job data:", jobData);

      if (previousJobData && JSON.stringify(previousJobData) === JSON.stringify(jobData)) {
        const confirmPost = window.confirm(
          "⚠️ You have already posted this exact job. Do you still want to post it again?"
        );
        if (!confirmPost) {
          setIsSubmitting(false);
          return;
        }
      }

      const response = await JobServices.addJob(jobData);
      console.log("Job posting response:", response);
      
      alert("✅ Job posted successfully!");
      setPreviousJobData(jobData);
      reset();
      if (onJobAdded) onJobAdded();
    } catch (err) {
      console.error("Job posting error:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to post job. Please try again.";
      setSubmitError(errorMessage);
      alert(`❌ ${errorMessage}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 text-sm text-gray-700 max-w-3xl mx-auto bg-white p-6 rounded shadow-md"
    >
      <h2 className="text-2xl font-bold text-blue-700 mb-4">📝 Add New Job</h2>

      {submitError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {submitError}
        </div>
      )}

      {/* Title */}
      <input
        type="text"
        placeholder="Job Title"
        {...register("title", { required: "Job title is required" })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.title && <p className="text-red-600 text-xs">{errors.title.message}</p>}

      {/* Company */}
      <input
        type="text"
        placeholder="Company Name"
        {...register("company", { required: "Company name is required" })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.company && <p className="text-red-600 text-xs">{errors.company.message}</p>}

      {/* Job Type & Department */}
      <div className="flex gap-4">
        <select 
          {...register("jobType", { required: "Job type is required" })} 
          className="w-1/2 border px-4 py-2 rounded"
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Freelance">Freelance</option>
        </select>
        <input
          type="text"
          placeholder="Department"
          {...register("department", { required: "Department is required" })}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>
      {errors.jobType && <p className="text-red-600 text-xs">{errors.jobType.message}</p>}
      {errors.department && <p className="text-red-600 text-xs">{errors.department.message}</p>}

      {/* Employment Type & Experience */}
      <div className="flex gap-4">
        <select
          {...register("employmentType", { required: "Employment type is required" })}
          className="w-1/2 border px-4 py-2 rounded"
        >
          <option value="">Select Employment Type</option>
          <option value="Permanent">Permanent</option>
          <option value="Contract">Contract</option>
          <option value="Temporary">Temporary</option>
        </select>
        <input
          type="text"
          placeholder="Experience (e.g., 2-4 years)"
          {...register("experience", { required: "Experience is required" })}
          className="w-1/2 border px-4 py-2 rounded"
        />
      </div>
      {errors.employmentType && <p className="text-red-600 text-xs">{errors.employmentType.message}</p>}
      {errors.experience && <p className="text-red-600 text-xs">{errors.experience.message}</p>}

      {/* Mode */}
      <select
        {...register("mode", { required: "Mode is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Mode</option>
        <option value="Onsite">Onsite</option>
        <option value="Remote">Remote</option>
        <option value="Hybrid">Hybrid</option>
      </select>
      {errors.mode && <p className="text-red-600 text-xs">{errors.mode.message}</p>}

      {/* Location */}
      <select
        {...register("location", { required: "Location is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Location</option>
        {predefinedLocations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>
      {watchLocation === "Other" && (
        <input
          type="text"
          placeholder="Enter custom location"
          {...register("otherLocation", { required: "Please enter location" })}
          className="w-full border px-4 py-2 rounded mt-2"
        />
      )}
      {errors.location && <p className="text-red-600 text-xs">{errors.location.message}</p>}
      {errors.otherLocation && <p className="text-red-600 text-xs">{errors.otherLocation.message}</p>}

      {/* Qualification */}
      <select
        {...register("highestQualification", { required: "Qualification is required" })}
        className="w-full border px-4 py-2 rounded"
      >
        <option value="">Select Highest Qualification</option>
        {qualificationOptions.map((q) => (
          <option key={q} value={q}>{q}</option>
        ))}
      </select>
      {watchQualification === "Other" && (
        <input
          type="text"
          placeholder="Enter custom qualification"
          {...register("otherQualification", { required: "Please enter qualification" })}
          className="w-full border px-4 py-2 rounded mt-2"
        />
      )}
      {errors.highestQualification && <p className="text-red-600 text-xs">{errors.highestQualification.message}</p>}
      {errors.otherQualification && <p className="text-red-600 text-xs">{errors.otherQualification.message}</p>}

      {/* Salary */}
      <div>
        <label className="block font-medium mb-1">Min Salary (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Lakhs"
            {...register("minSalaryLakh", { 
              required: "Min salary is required",
              valueAsNumber: true,
              min: { value: 0, message: "Salary cannot be negative" }
            })}
            className="w-1/2 border px-4 py-2 rounded"
          />
          <input
            type="number"
            min="0"
            max="99"
            placeholder="Thousands"
            {...register("minSalaryThousand", { 
              valueAsNumber: true,
              min: { value: 0, message: "Salary cannot be negative" },
              max: { value: 99, message: "Thousands should be less than 100" }
            })}
            className="w-1/2 border px-4 py-2 rounded"
          />
        </div>
        {errors.minSalaryLakh && (
          <p className="text-red-600 text-xs">{errors.minSalaryLakh.message}</p>
        )}
        {errors.minSalaryThousand && (
          <p className="text-red-600 text-xs">{errors.minSalaryThousand.message}</p>
        )}
      </div>
      
      <div>
        <label className="block font-medium mb-1">Max Salary (₹)</label>
        <div className="flex gap-2">
          <input
            type="number"
            min="0"
            placeholder="Lakhs"
            {...register("maxSalaryLakh", { 
              required: "Max salary is required",
              valueAsNumber: true,
              min: { value: 0, message: "Salary cannot be negative" }
            })}
            className="w-1/2 border px-4 py-2 rounded"
          />
          <input
            type="number"
            min="0"
            max="99"
            placeholder="Thousands"
            {...register("maxSalaryThousand", { 
              valueAsNumber: true,
              min: { value: 0, message: "Salary cannot be negative" },
              max: { value: 99, message: "Thousands should be less than 100" }
            })}
            className="w-1/2 border px-4 py-2 rounded"
          />
        </div>
        {errors.maxSalaryLakh && (
          <p className="text-red-600 text-xs">{errors.maxSalaryLakh.message}</p>
        )}
        {errors.maxSalaryThousand && (
          <p className="text-red-600 text-xs">{errors.maxSalaryThousand.message}</p>
        )}
      </div>

      {/* Openings */}
      <input
        type="number"
        min="1"
        placeholder="Number of Openings"
        {...register("openings", { 
          required: "Number of openings is required",
          min: { value: 1, message: "At least 1 opening required" }
        })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.openings && <p className="text-red-600 text-xs">{errors.openings.message}</p>}

      {/* Dates */}
      <div className="flex gap-4">
        <div className="w-1/2">
          <label className="block font-medium mb-1">Opening Date</label>
          <input
            type="date"
            {...register("openingDate", { required: "Opening date is required" })}
            className="w-full border px-4 py-2 rounded"
          />
          {errors.openingDate && <p className="text-red-600 text-xs">{errors.openingDate.message}</p>}
        </div>
        <div className="w-1/2">
          <label className="block font-medium mb-1">Closing Date</label>
          <input
            type="date"
            {...register("closingDate", { required: "Closing date is required" })}
            className="w-full border px-4 py-2 rounded"
          />
          {errors.closingDate && <p className="text-red-600 text-xs">{errors.closingDate.message}</p>}
        </div>
      </div>

      {/* Contact Email */}
      <input
        type="email"
        placeholder="Hiring Manager Email"
        {...register("contactEmail", {
          required: "Email is required",
          pattern: {
            value: /^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
            message: "Invalid email format",
          },
        })}
        className="w-full border px-4 py-2 rounded"
      />
      {errors.contactEmail && (
        <p className="text-red-600 text-xs">{errors.contactEmail.message}</p>
      )}

      {/* Description */}
      <div>
        <label className="block font-medium mb-1">Job Description</label>
        <textarea
          placeholder="Job Description"
          {...register("description", { required: "Job description is required" })}
          rows="4"
          className="w-full border px-4 py-2 rounded"
        />
        {errors.description && <p className="text-red-600 text-xs">{errors.description.message}</p>}
      </div>

      {/* Responsibilities */}
      <div>
        <label className="block font-medium mb-1">Responsibilities</label>
        <textarea
          placeholder="Responsibilities (one per line)"
          {...register("responsibilities")}
          rows="4"
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* Requirements */}
      <div>
        <label className="block font-medium mb-1">Requirements</label>
        <textarea
          placeholder="Requirements (one per line)"
          {...register("requirements")}
          rows="4"
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      {/* Perks */}
      <div>
        <label className="block font-medium mb-1">Perks and Benefits</label>
        <textarea
          placeholder="Perks and Benefits (one per line)"
          {...register("perks")}
          rows="3"
          className="w-full border px-4 py-2 rounded"
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`bg-blue-700 text-white px-6 py-2 rounded hover:bg-blue-800 w-full ${
          isSubmitting ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        {isSubmitting ? "Posting Job..." : "Submit Job"}
      </button>
    </form>
  );
};

export default AddJob;