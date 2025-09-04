// src/api/JobServices.js
import axios from './axiosInstance';

const JobServices = {
  // ------------------ Jobs ------------------ //
  
  getAllJobs: () => axios.get('/api/jobs/all'),
  getAllJobsPaginated: (page) => axios.get(`/api/jobs/all?page=${page}`),
  getPaginatedJobs: (page = 0) => axios.get(`/api/jobs/all?page=${page}`),
  getJobById: (jobId) => axios.get(`/api/jobs/view/${jobId}`),
  addJob: (jobData) => axios.post('/api/jobs/add-job', jobData, { withCredentials: true }),
  updateJob: (jobId, jobData) => axios.put(`/api/jobs/update/${jobId}`, jobData, { withCredentials: true }),
  deleteJob: (jobId) => axios.delete(`/api/jobs/delete/${jobId}`, { withCredentials: true }),

  // Get all jobs posted by current employee
  getAllPostedJobs: () => axios.get('/api/jobs/posted', { withCredentials: true }),

  // Filter jobs by location and/or company
  filterJobs: (location, company) => {
    const params = new URLSearchParams();
    if (location) params.append('location', location);
    if (company) params.append('company', company);
    return axios.get(`/api/jobs/filter?${params.toString()}`);
  },

  // ---------------- Applications ---------------- //
  getAppliedJobsByUser: (userId) => axios.get(`/api/applications/user/${userId}`, { withCredentials: true }),

  getApplicantsForJob: (jobId) => 
    axios.get(`/api/jobs/${jobId}/applicants`, { withCredentials: true }),

  applyForJob: (applicationData) => 
    axios.post('/api/applications/apply', applicationData, { withCredentials: true }),

  // ---------------- Interview Scheduling ---------------- //
  scheduleInterviews: (interviewData) => 
    axios.post('/api/jobs/schedule-interviews', interviewData, { withCredentials: true }),

  // In JobServices.js, modify the getJobById method
  getJobById: (jobId) => axios.get(`/api/jobs/view/${jobId}`, { 
      withCredentials: true 
  }),

  // ---------------- Bookmarks ---------------- //
  getBookmarkedJobsByUser: (userId) => axios.get(`/api/bookmarks/user/${userId}`, { withCredentials: true }),
  bookmarkJob: (userId, jobId) => axios.post(`/api/bookmarks`, { userId, jobId }, { withCredentials: true }),
  unbookmarkJob: (userId, jobId) => axios.delete(`/api/bookmarks/${userId}/${jobId}`, { withCredentials: true }),

  // ---------------- Status Updates ---------------- //
  updateApplicationStatus: (applicationId, status) => 
    axios.put(`/api/applications/${applicationId}/status`, { status }, { withCredentials: true }),
};

export default JobServices;