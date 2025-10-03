import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from '../api/axiosInstance';
import AuthServices from '../api/AuthServices';

const JobDetail = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [user, setUser] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  console.log('JobDetail mounted with jobId:', jobId); // Debug log

  useEffect(() => {
    if (jobId) {
      fetchJobDetails();
      checkAuthStatus();
    } else {
      setError('No job ID provided');
      setLoading(false);
    }
  }, [jobId]);

  const fetchJobDetails = async () => {
  try {
    console.log('Fetching job details for:', jobId);
    
    // Try with token if available, otherwise without
    const token = localStorage.getItem('token');
    const config = token ? {
      headers: { Authorization: `Bearer ${token}` }
    } : {};
    
    const res = await axios.get(`/api/jobs/view/${jobId}`, config);
    console.log('Job data received:', res.data);
    setJob(res.data);
    setError(null);
  } catch (err) {
    console.error('Error fetching job:', err);
    setError('Job not found or server error');
    setJob(null);
  }
};

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const userRes = await AuthServices.fetchCurrentUser();
        setUser(userRes.data);
        await checkIfApplied(userRes.data.userId);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.log('User not logged in (normal for public access)');
      setUser(null);
    }
  };

  const checkIfApplied = async (userId) => {
    try {
      const res = await axios.get(`/api/applications/check?userId=${userId}&jobId=${jobId}`);
      setHasApplied(res.data);
    } catch (error) {
      console.error('Error checking application status:', error);
      setHasApplied(false);
    }
  };

  // Set loading to false when we have job data or error
  useEffect(() => {
    if (job !== null || error !== null) {
      const timer = setTimeout(() => {
        setLoading(false);
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [job, error]);

  const handleApplyClick = () => {
    if (!user) {
      navigate('/login', { 
        state: { 
          redirectJobId: jobId,
          message: 'Please login to apply for this job'
        } 
      });
      return;
    }

    if (hasApplied) {
      alert('You have already applied for this job!');
      return;
    }

    navigate('/home', { 
      state: { 
        selectedJobId: jobId,
        autoOpenApply: true 
      } 
    });
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading job details...</p>
          <p className="text-sm text-gray-500 mt-2">Job ID: {jobId}</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !job) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center max-w-md mx-auto">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-red-600 mb-2">Job Not Found</h2>
          <p className="text-gray-600 mb-4">
            {error || "The job you're looking for doesn't exist or has been removed."}
          </p>
          <p className="text-sm text-gray-500 mb-4">Job ID: {jobId}</p>
          <div className="flex gap-4 justify-center">
            <button 
              onClick={() => navigate('/')}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Go Home
            </button>
            <button 
              onClick={() => window.location.reload()}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Check if job is expired
  const isExpired = new Date(job.lastDate) < new Date();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Card */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{job.title}</h1>
              <p className="text-xl text-blue-600 font-semibold">{job.company}</p>
            </div>
            <div className="flex flex-col items-start md:items-end gap-2">
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                isExpired ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
              }`}>
                {isExpired ? 'Expired' : 'Active'}
              </span>
              <p className="text-sm text-gray-500">Job ID: {job.jobId}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm text-gray-700">
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📍</span>
              <span className="font-medium">{job.location || 'Not specified'}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">💰</span>
              <span className="font-medium">
                {job.minSalary && job.maxSalary 
                  ? `₹${job.minSalary} - ₹${job.maxSalary}`
                  : 'Salary not specified'
                }
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">👥</span>
              <span className="font-medium">{job.openings || 'Not specified'} openings</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">🎓</span>
              <span className="font-medium">{job.experience || 'Not specified'} experience</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">📅</span>
              <span className="font-medium">Apply by: {formatDate(job.lastDate)}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-gray-500">🏢</span>
              <span className="font-medium">{job.employmentType || 'Not specified'}</span>
            </div>
          </div>
        </div>

        {/* Job Description */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6 border border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>📋</span> Job Description
          </h2>
          <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
            {job.description || 'No description provided.'}
          </div>
        </div>

        {/* Requirements & Perks */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Requirements */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>🎯</span> Requirements
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.requirements || 'No specific requirements provided.'}
            </div>
          </div>
          
          {/* Perks */}
          <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>⭐</span> Perks & Benefits
            </h2>
            <div className="text-gray-700 whitespace-pre-wrap leading-relaxed">
              {job.perks || 'No perks information provided.'}
            </div>
          </div>
        </div>

        {/* Additional Information */}
        <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200 mb-20">
          <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
            <span>ℹ️</span> Additional Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <strong className="text-gray-600">Job Type:</strong>
              <span className="text-gray-800">{job.jobType || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <strong className="text-gray-600">Department:</strong>
              <span className="text-gray-800">{job.department || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <strong className="text-gray-600">Work Mode:</strong>
              <span className="text-gray-800">{job.mode || 'N/A'}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <strong className="text-gray-600">Opening Date:</strong>
              <span className="text-gray-800">{formatDate(job.openingDate)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100 md:col-span-2">
              <strong className="text-gray-600">Contact Email:</strong>
              <span className="text-gray-800">{job.contactEmail || 'N/A'}</span>
            </div>
          </div>
        </div>

        {/* Apply Button - Fixed at bottom */}
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-10">
          <button
            onClick={handleApplyClick}
            disabled={isExpired || (user && hasApplied)}
            className={`px-8 py-4 rounded-full font-semibold text-lg flex items-center gap-3 transition-all duration-200 shadow-2xl ${
              isExpired 
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                : user && hasApplied
                ? 'bg-green-600 text-white cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 hover:scale-105 active:scale-95'
            }`}
          >
            {isExpired ? (
              <>
                <span>⏰</span>
                <span>Job Expired</span>
              </>
            ) : user && hasApplied ? (
              <>
                <span>✅</span>
                <span>Already Applied</span>
              </>
            ) : user ? (
              <>
                <span>🚀</span>
                <span>Apply Now</span>
              </>
            ) : (
              <>
                <span>🔐</span>
                <span>Login to Apply</span>
              </>
            )}
          </button>
        </div>

        {/* Status Messages */}
        <div className="text-center mt-8">
          {isExpired && (
            <p className="text-red-600 font-medium">
              ⏰ This job posting has expired and is no longer accepting applications.
            </p>
          )}
          {user && hasApplied && (
            <p className="text-green-600 font-medium">
              ✅ You have successfully applied for this position. Good luck!
            </p>
          )}
          {!user && !isExpired && (
            <p className="text-gray-600">
              👆 Login to apply for this job opportunity
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default JobDetail;