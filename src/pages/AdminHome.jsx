// src/pages/AdminHome.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminAuthService from "../api/AdminAuthService";
import JobServices from "../api/JobServices";
import AdminHeader from "../components/AdminHeader";
import StatsCards from "../components/StatsCards";
import JobsByCompany from "../components/JobsByCompany";
import JobDetailModal from "../components/JobDetailModal";

const AdminHome = ({ admin, setAdmin }) => {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [viewJob, setViewJob] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  /*const injectSchema = (schema) => {
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.text = schema;
    document.head.appendChild(script);
  };*/
  const fetchJobs = async () => {
  try {
    const res = await JobServices.getAllJobs();
    // Set jobs to state
    //console.log(res.data); 
    setJobs(res.data || []); 
     
    // Inject schema for each job
    

  } catch (err) {
    console.error("Failed to fetch jobs", err);
  } finally {
    setLoading(false);
  }
};

  const handleLogout = async () => {
    try {
      await AdminAuthService.logoutAdmin();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setAdmin(null);
      localStorage.removeItem('admin');
      localStorage.removeItem('adminToken');
      navigate("/admin/admin-login");
    }
  };

  const handleShare = (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    alert("Job link copied to clipboard!");
  };

  const handleView = (job) => {
    setViewJob(job);
  };

  const closeView = () => {
    setViewJob(null);
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await JobServices.deleteJob(jobId);
      // Remove the deleted job from the state
      setJobs(jobs.filter((job) => job.job.jobId !== jobId));
      alert("Job deleted successfully!");
    } catch (error) {
      console.error("Failed to delete job:", error);
      throw error;
    }
  };

  // Group jobs by company
  const jobsByCompany = jobs.reduce((groups, job) => {
    const company = job.job.company;
    if (!groups[company]) {
      groups[company] = [];
    }
    groups[company].push(job.job);
    return groups;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader admin={admin} handleLogout={handleLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards jobs={jobs} jobsByCompany={jobsByCompany} />
        <JobsByCompany
          jobsByCompany={jobsByCompany}
          loading={loading}
          handleShare={handleShare}
          handleView={handleView}
          onJobDelete={handleDeleteJob}
        />
      </main>

      <JobDetailModal viewJob={viewJob} closeView={closeView} />
    </div>
  );
};

export default AdminHome;