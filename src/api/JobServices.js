import axios from './axiosInstance';

const JobServices = {
  // ------------------ Jobs ------------------ //
  
  getAllJobs: () => axios.get('/api/jobs/all'),
  getAllJobsForAdmin: () => axios.get('/api/jobs/admin/all-jobs', { withCredentials: true }),
  getAllJobsPaginated: (page) => axios.get(`/api/jobs/all?page=${page}`),
  getPaginatedJobs: (page = 0) => axios.get(`/api/jobs/all?page=${page}`),
  getJobById: (jobId) => axios.get(`/api/jobs/view/${jobId}`),
  
  addJob: (jobData) => {
    console.log("Sending job data to backend:", jobData);
    return axios.post('/api/jobs/add-job', jobData, { 
      withCredentials: true,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  },
  
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

  // ---------------- Applications ----------------
  getAppliedJobsByUser: (userId) => axios.get(`/api/applications/user/${userId}`, { withCredentials: true }),

  // FIXED: Get applicants for job with better error handling
  getApplicantsForJob: (jobId) => {
    console.log('Fetching applicants for job:', jobId);
    return axios.get(`/api/jobs/${jobId}/applicants`, { 
      withCredentials: true,
      timeout: 10000, // 10 second timeout
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  getApplicantsForJobAdmin: (jobId) => {
    console.log('Fetching applicants for job (admin):', jobId);
    return axios.get(`/api/jobs/admin/${jobId}/applicants`, { 
      withCredentials: true,
      timeout: 10000,
      headers: {
        'Content-Type': 'application/json',
      }
    });
  },

  applyForJob: (applicationData) => 
    axios.post('/api/applications/apply', applicationData, { withCredentials: true }),

  // ---------------- Interview Scheduling ----------------
  scheduleInterviews: (interviewData) => 
    axios.post('/api/jobs/schedule-interviews', interviewData, { withCredentials: true }),

  // ---------------- Bookmarks ----------------
  getBookmarkedJobsByUser: (userId) => axios.get(`/api/bookmarks/user/${userId}`, { withCredentials: true }),
  bookmarkJob: (userId, jobId) => axios.post(`/api/bookmarks`, { userId, jobId }, { withCredentials: true }),
  unbookmarkJob: (userId, jobId) => axios.delete(`/api/bookmarks/${userId}/${jobId}`, { withCredentials: true }),

  // ---------------- Status Updates ----------------
  updateApplicationStatus: (applicationId, status) => 
    axios.put(`/api/applications/${applicationId}/status`, { status }, { withCredentials: true }),
};

export default JobServices;