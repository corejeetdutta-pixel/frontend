import { useState, useRef, useEffect } from "react";
import JobList from "./JobList";
import MyApplications from "./MyApplications";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Home = ({ user }) => {
  const [activeSection, setActiveSection] = useState("jobcards");
  const scrollRef = useRef(null);

  const handleShowJobs = () => {
    setActiveSection("jobcards");
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleShowApplications = () => {
    setActiveSection("applications");
    setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
  };

  const handleCloseSection = () => {
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    if (activeSection === "jobcards") {
      setTimeout(() => scrollRef.current?.scrollIntoView({ behavior: "smooth" }), 300);
    }
  }, []);

  return (
    <div className="w-full min-h-screen bg-white text-gray-800 overflow-x-hidden py-6">
      <ToastContainer position="top-center" autoClose={3000} />

      {/* Header Section */}
      <div className="w-full flex flex-col items-center justify-center py-6 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-gray-200">
        <h1 className="text-3xl md:text-5xl font-bold mb-3 text-blue-700 text-center">
          Find Your Dream Job Today 🚀
        </h1>
        <p className="text-gray-600 text-center mb-6 max-w-2xl">
          Answer AI-powered questions, enhance your resume, and apply effortlessly — all in one place.
        </p>

        <div className="flex flex-wrap gap-2 justify-center">
          <button
            onClick={handleShowJobs}
            className={`px-6 py-2 rounded-full text-lg transition-all ${
              activeSection === "jobcards"
                ? "bg-blue-700 text-white"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Posted Jobs
          </button>
          <button
            onClick={handleShowApplications}
            className={`px-6 py-2 rounded-full text-lg transition-all ${
              activeSection === "applications"
                ? "bg-gray-300 text-gray-900"
                : "bg-gray-200 text-gray-800 hover:bg-gray-300"
            }`}
          >
            My Applications
          </button>
        </div>
      </div>

      {/* Body Section */}
      {(activeSection === "applications" || activeSection === "jobcards") && (
        <div ref={scrollRef} className="relative w-full min-h-[calc(100vh-80px)] bg-white">
          <button
            onClick={handleCloseSection}
            className="absolute top-4 right-6 z-50 text-gray-500 hover:text-red-600 text-2xl"
          >
            ✕
          </button>

          <div className="w-full h-full">
            {activeSection === "applications" && <MyApplications user={user} />}
            {activeSection === "jobcards" && <JobList user={user} />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
