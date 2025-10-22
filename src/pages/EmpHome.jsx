import { useRef, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AddJob from './AddJob';
import JDGenerator from './JDGenerator';
import Dashboard from './Dashboard';
import AllJobsTable from './AllJobsTable';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import JobServices from '../api/JobServices';
import MyPostedJobs from './MyPostedJob';

const EmpHome = ({ employee: propEmployee, setEmployee }) => {
  const [employee, setLocalEmployee] = useState(propEmployee);
  const [activeSection, setActiveSection] = useState("myPostedJobs"); // Default to My Posted Jobs
  const [generatedJD, setGeneratedJD] = useState(null);
  const scrollRef = useRef(null);
  const dashboardRef = useRef(null);
  const navigate = useNavigate();

  // Update local state when prop changes
  useEffect(() => {
    setLocalEmployee(propEmployee);
  }, [propEmployee]);

  // Fetch employee if not passed as prop
  useEffect(() => {
    const fetchEmployee = async () => {
      if (!employee) {
        try {
          const res = await EmployeeAuthServices.fetchCurrentEmployee();
          setLocalEmployee(res.data);
          setEmployee(res.data); // Update parent state as well
        } catch (error) {
          console.error("Failed to fetch employee:", error);
          navigate('/employee/employee-login');
        }
      }
    };

    fetchEmployee();
  }, [employee, setEmployee, navigate]);

  // Scroll to section when it changes
  useEffect(() => {
    if (scrollRef.current) {
      const timeout = setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [activeSection]);

  const handleCloseSection = () => {
    setActiveSection("myPostedJobs"); // Return to My Posted Jobs when closing
    setGeneratedJD(null);
  };

  const handleJobAdded = () => {
    if (dashboardRef.current?.refetchStats) {
      dashboardRef.current.refetchStats();
    }
    setActiveSection("myPostedJobs"); // Return to My Posted Jobs after adding a job
  };

  if (!employee) return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading employer data...</p>
      </div>
    </div>
  );

  return (
    <section className="min-h-[85vh] px-6 pb-12 bg-gradient-to-br from-white via-[#f9fafb] to-[#f0f7fb]">
      {/* Header */}
      <div className="flex flex-col items-center text-center py-14">
        <div className="bg-white text-gray-800 rounded-3xl shadow-lg p-10 max-w-4xl w-full border border-gray-100">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
            Welcome, <span className="text-[#0260a4]">{employee.name} 👋</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
            You're now inside <span className="font-semibold text-[#0260a4]">Atract</span>.  
            Simplify hiring — from posting jobs to shortlisting candidates — all in place.
          </p>

          {/* Action Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-6">
            <button
              onClick={() => setActiveSection("add")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition ${
                activeSection === "add" 
                  ? "bg-gradient-to-br from-[#0260a4] to-[#014c82] text-white" 
                  : "bg-white border border-gray-200 text-[#0260a4] shadow-sm"
              }`}
            >
              <span className="text-2xl mb-2">➕</span>
              <span className="font-semibold text-lg">Add New Job</span>
            </button>

            <button
              onClick={() => setActiveSection("jd")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition ${
                activeSection === "jd" 
                  ? "bg-gradient-to-br from-[#0260a4] to-[#014c82] text-white" 
                  : "bg-white border border-gray-200 text-[#0260a4] shadow-sm"
              }`}
            >
              <span className="text-2xl mb-2">🧾</span>
              <span className="font-semibold text-lg">Generate JD</span>
            </button>

            <button
              onClick={() => setActiveSection("dashboard")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition ${
                activeSection === "dashboard" 
                  ? "bg-gradient-to-br from-[#0260a4] to-[#014c82] text-white" 
                  : "bg-white border border-gray-200 text-[#0260a4] shadow-sm"
              }`}
            >
              <span className="text-2xl mb-2">📊</span>
              <span className="font-semibold text-lg">Dashboard</span>
            </button>

            <button
              onClick={() => setActiveSection("myPostedJobs")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition ${
                activeSection === "myPostedJobs" 
                  ? "bg-gradient-to-br from-[#0260a4] to-[#014c82] text-white" 
                  : "bg-white border border-gray-200 text-[#0260a4] shadow-sm"
              }`}
            >
              <span className="text-2xl mb-2">📋</span>
              <span className="font-semibold text-lg">My Posted Jobs</span>
            </button>

            <button
              onClick={() => setActiveSection("allJobs")}
              className={`flex flex-col items-center justify-center p-6 rounded-2xl shadow-md hover:shadow-xl transition ${
                activeSection === "allJobs" 
                  ? "bg-gradient-to-br from-[#0260a4] to-[#014c82] text-white" 
                  : "bg-white border border-gray-200 text-[#0260a4] shadow-sm"
              }`}
            >
              <span className="text-2xl mb-2">🌐</span>
              <span className="font-semibold text-lg">View All Jobs</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Section */}
      <div
        ref={scrollRef}
        className="relative max-w-6xl mx-auto bg-white shadow-lg border border-gray-100 rounded-3xl p-10 mt-10"
      >
        {/* Only show close button when not on My Posted Jobs */}
        {activeSection !== "myPostedJobs" && (
          <button
            onClick={handleCloseSection}
            className="absolute top-5 right-5 text-gray-400 hover:text-[#0260a4] transition"
          >
            ✕
          </button>
        )}

        {/* Show only the active section */}
        {activeSection === "add" && (
          <AddJob onJobAdded={handleJobAdded} initialData={generatedJD} />
        )}
        {activeSection === "jd" && (
          <JDGenerator
            onJDGenerated={async (data) => {
              try {
                await JobServices.addJob(data);
              } catch (err) {
                alert("❌ Failed to post job automatically.");
              }
              setActiveSection("myPostedJobs");
            }}
          />
        )}
        {activeSection === "dashboard" && (
          <Dashboard ref={dashboardRef} empId={employee.empId} />
        )}
        {activeSection === "allJobs" && <AllJobsTable />}
        {activeSection === "myPostedJobs" && <MyPostedJobs />}
      </div>
    </section>
  );
};

export default EmpHome;