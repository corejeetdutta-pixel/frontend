import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AddJob from './AddJob';
import JDGenerator from './JDGenerator';
import Dashboard from './Dashboard';
import AllJobsTable from './AllJobsTable';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import JobServices from '../api/JobServices';
import MyPostedJobs from './MyPostedJob';

const EmpHome = () => {
  const [employee, setEmployee] = useState(null); // Changed from user to employee
  const [activeSection, setActiveSection] = useState('myPostedJobs');
  const [generatedJD, setGeneratedJD] = useState(null);
  const scrollRef = useRef(null);
  const dashboardRef = useRef(null);
  const navigate = useNavigate();

  // Fetch employee
  useEffect(() => {
    EmployeeAuthServices.fetchCurrentEmployee()
      .then((res) => setEmployee(res.data))
      .catch(() => navigate('/employee/employee-login'));
  }, [navigate]);

  // Scroll to section
  useEffect(() => {
    if (activeSection && scrollRef.current) {
      const timeout = setTimeout(() => {
        scrollRef.current.scrollIntoView({ behavior: 'smooth' });
      }, 150);
      return () => clearTimeout(timeout);
    }
  }, [activeSection]);

  const handleCloseSection = () => {
    setActiveSection(null);
    setGeneratedJD(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleJobAdded = () => {
    if (dashboardRef.current?.refetchStats) {
      dashboardRef.current.refetchStats();
    }
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
    <section className="min-h-[80vh] px-4 pb-10">
      {/* Header */}
      <div className="flex flex-col justify-center items-center text-center py-12">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 text-white rounded-3xl shadow-lg p-10 max-w-3xl w-full">
          <h1 className="text-4xl font-extrabold mb-4">
            Welcome, {employee.name} 👋
          </h1>
          <p className="text-lg text-blue-100 mb-6">
            You've successfully logged into <span className="font-semibold">Recruitment_E2E</span>.
            Automate your hiring process — from job intake to resume matching.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-4">
            <button
              onClick={() => setActiveSection('add')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
            >
              ➕ Add New Job
            </button>
            <button
              onClick={() => setActiveSection('jd')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
            >
              🧾 Generate JD
            </button>
            <button
              onClick={() => setActiveSection('dashboard')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
            >
              📊 Dashboard
            </button>
            <button
              onClick={() => setActiveSection('myPostedJobs')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
            >
              📋 My Posted Jobs
            </button>
            <button
              onClick={() => setActiveSection('allJobs')}
              className="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow-md hover:bg-blue-100 transition"
            >
              📋 View All Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Section */}
      {activeSection && (
        <div
          ref={scrollRef}
          className="relative max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8 mt-6"
        >
          <button 
            onClick={handleCloseSection}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>

          {activeSection === 'add' && (
            <AddJob
              onJobAdded={handleJobAdded}
              initialData={generatedJD}
            />
          )}

          {activeSection === 'jd' && (
            <JDGenerator
              onJDGenerated={async (data) => {
                try {
                  await JobServices.addJob(data);
                } catch (err) {
                  alert('❌ Failed to post job automatically.');
                }
                setActiveSection('myPostedJobs');
              }}
            />
          )}

          {activeSection === 'dashboard' && (
            <Dashboard 
              ref={dashboardRef} 
              empId={employee.empId} // Pass employee ID to Dashboard
            />
          )}
          
          {activeSection === 'allJobs' && <AllJobsTable />}
          {activeSection === 'myPostedJobs' && <MyPostedJobs />}
        </div>
      )}
    </section>
  );
};

export default EmpHome;