import React, { useState } from "react";
import JobBotService from "../api/JobBotService";
import { useNavigate } from "react-router-dom";

const qualificationOptions = [
  "High School",
  "Diploma",
  "Bachelor's Degree",
  "Master's Degree",
  "Doctorate / PhD",
];

const predefinedLocations = [
  "Bangalore",
  "Hyderabad",
  "Mumbai",
  "Delhi",
  "Pune",
  "Chennai",
  "Kolkata",
  "Noida",
  "Gurgaon",
  "Ahmedabad",
];

const JDGenerator = () => {
  const navigate = useNavigate();
  const [jobTitle, setJobTitle] = useState("");
  const [company, setCompany] = useState("");
  const [mode, setMode] = useState("");
  const [department, setDepartment] = useState("");
  const [experience, setExperience] = useState("");
  const [location, setLocation] = useState("");
  const [highestQualification, setHighestQualification] = useState("");
  const [minSalaryLakh, setMinSalaryLakh] = useState("");
  const [minSalaryThousand, setMinSalaryThousand] = useState("");
  const [maxSalaryLakh, setMaxSalaryLakh] = useState("");
  const [maxSalaryThousand, setMaxSalaryThousand] = useState("");
  const [openings, setOpenings] = useState("");
  const [openingDate, setOpeningDate] = useState("");
  const [closingDate, setClosingDate] = useState("");
  const [contactEmail, setContactEmail] = useState("");

  const [generatedJD, setGeneratedJD] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleGenerate = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !jobTitle.trim() ||
      !company.trim() ||
      !mode ||
      !department.trim() ||
      !experience.trim() ||
      !location ||
      !highestQualification ||
      !minSalaryLakh ||
      !maxSalaryLakh ||
      !openings ||
      !openingDate ||
      !closingDate ||
      !contactEmail.trim()
    ) {
      setError("⚠️ Please fill in all required fields.");
      return;
    }

    // Validate dates
    const opening = new Date(openingDate);
    const closing = new Date(closingDate);
    if (closing <= opening) {
      setError("⚠️ Closing date must be after opening date.");
      return;
    }

    // Validate salary
    const minSalaryValue = (parseInt(minSalaryLakh) * 100000) + (parseInt(minSalaryThousand || 0) * 1000);
    const maxSalaryValue = (parseInt(maxSalaryLakh) * 100000) + (parseInt(maxSalaryThousand || 0) * 1000);
    if (maxSalaryValue <= minSalaryValue) {
      setError("⚠️ Maximum salary must be greater than minimum salary.");
      return;
    }

    setLoading(true);
    setGeneratedJD({});

    try {
      const response = await JobBotService.generateJD({
        title: jobTitle,
        company,
        mode,
        department,
        experience,
        location,
        highestQualification,
        minSalaryLakh,
        minSalaryThousand: minSalaryThousand || "00",
        maxSalaryLakh,
        maxSalaryThousand: maxSalaryThousand || "00",
        openings,
        openingDate,
        closingDate,
        contactEmail,
      });

      const jdObject = typeof response.data === "string" ? JSON.parse(response.data) : response.data;
      setGeneratedJD(jdObject);
    } catch (err) {
      console.error("❌ Error generating JD:", err);
      setError("Failed to generate JD. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleUseJD = () => {
    if (generatedJD) {
      // Calculate salary strings in the format expected by backend
      const minSalaryValue = (parseInt(minSalaryLakh) * 100000) + (parseInt(minSalaryThousand || 0) * 1000);
      const maxSalaryValue = (parseInt(maxSalaryLakh) * 100000) + (parseInt(maxSalaryThousand || 0) * 1000);
      
      const minSalary = `${(minSalaryValue / 100000).toFixed(2)}L`;
      const maxSalary = `${(maxSalaryValue / 100000).toFixed(2)}L`;

      navigate("/add-job", {
        state: {
          title: jobTitle,
          company,
          mode,
          department,
          experience,
          location,
          highestQualification,
          minSalaryLakh: parseInt(minSalaryLakh) || 0,
          minSalaryThousand: parseInt(minSalaryThousand) || 0,
          maxSalaryLakh: parseInt(maxSalaryLakh) || 0,
          maxSalaryThousand: parseInt(maxSalaryThousand) || 0,
          openings: parseInt(openings) || 0,
          openingDate,
          closingDate,
          contactEmail,
          description: generatedJD.description || "",
          responsibilities: generatedJD.responsibilities || "",
          requirements: generatedJD.requirements || "",
          perks: generatedJD.perks || "",
          jobType: "Full-time",
          employmentType: "Permanent",
          // Add calculated salary strings for backend
          minSalary,
          maxSalary
        },
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h2 className="text-3xl font-bold text-center text-indigo-700">
        🧾 Auto JD Generator
      </h2>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleGenerate} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title *"
          value={jobTitle}
          onChange={(e) => setJobTitle(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <input
          type="text"
          placeholder="Company Name *"
          value={company}
          onChange={(e) => setCompany(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            value={mode}
            onChange={(e) => setMode(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          >
            <option value="">Select Mode *</option>
            <option value="Onsite">Onsite</option>
            <option value="Remote">Remote</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          <input
            type="text"
            placeholder="Department *"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="w-full px-4 py-2 border rounded"
            required
          />
        </div>

        <input
          type="text"
          placeholder="Experience Required (e.g., 2-4 years) *"
          value={experience}
          onChange={(e) => setExperience(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <select
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        >
          <option value="">Select Location *</option>
          {predefinedLocations.map((loc, idx) => (
            <option key={idx} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        <select
          value={highestQualification}
          onChange={(e) => setHighestQualification(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        >
          <option value="">Select Highest Qualification *</option>
          {qualificationOptions.map((q, i) => (
            <option key={i} value={q}>
              {q}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Min Salary (Lakhs) *
            </label>
            <input
              type="number"
              min="0"
              value={minSalaryLakh}
              onChange={(e) => setMinSalaryLakh(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Min Salary (Thousands)
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={minSalaryThousand}
              onChange={(e) => setMinSalaryThousand(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="00"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Max Salary (Lakhs) *
            </label>
            <input
              type="number"
              min="0"
              value={maxSalaryLakh}
              onChange={(e) => setMaxSalaryLakh(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Max Salary (Thousands)
            </label>
            <input
              type="number"
              min="0"
              max="99"
              value={maxSalaryThousand}
              onChange={(e) => setMaxSalaryThousand(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              placeholder="00"
            />
          </div>
        </div>

        <input
          type="number"
          min="1"
          placeholder="Number of Openings *"
          value={openings}
          onChange={(e) => setOpenings(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              Opening Date *
            </label>
            <input
              type="date"
              value={openingDate}
              onChange={(e) => setOpeningDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="text-sm font-medium mb-1 block">
              Closing Date *
            </label>
            <input
              type="date"
              value={closingDate}
              onChange={(e) => setClosingDate(e.target.value)}
              className="w-full px-4 py-2 border rounded"
              required
            />
          </div>
        </div>

        <input
          type="email"
          placeholder="Hiring Manager Email *"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded"
          required
        />

        <button
          type="submit"
          disabled={loading}
          className={`w-full bg-indigo-600 text-white px-6 py-3 rounded hover:bg-indigo-700 transition ${
            loading ? "opacity-60 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "🔄 Generating JD..." : "🚀 Generate JD"}
        </button>
      </form>

      {generatedJD.description && (
        <div className="space-y-4 mt-6 p-4 bg-gray-50 rounded-lg">
          <h3 className="text-lg font-semibold text-gray-700">
            ✍️ Generated Job Description:
          </h3>
          <div className="bg-white p-4 border rounded shadow">
            <h4 className="font-medium text-blue-700 mb-2">Description:</h4>
            <p className="mb-4 whitespace-pre-wrap">{generatedJD.description}</p>
            
            {generatedJD.responsibilities && (
              <>
                <h4 className="font-medium text-blue-700 mb-2">Responsibilities:</h4>
                <p className="mb-4 whitespace-pre-wrap">{generatedJD.responsibilities}</p>
              </>
            )}
            
            {generatedJD.requirements && (
              <>
                <h4 className="font-medium text-blue-700 mb-2">Requirements:</h4>
                <p className="mb-4 whitespace-pre-wrap">{generatedJD.requirements}</p>
              </>
            )}
            
            {generatedJD.perks && (
              <>
                <h4 className="font-medium text-blue-700 mb-2">Perks & Benefits:</h4>
                <p className="whitespace-pre-wrap">{generatedJD.perks}</p>
              </>
            )}
          </div>
          
          <button
            onClick={handleUseJD}
            className="w-full bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700 transition flex items-center justify-center"
          >
            📝 Use This JD & Continue to Post Job
          </button>
        </div>
      )}
    </div>
  );
};

export default JDGenerator;