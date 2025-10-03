import axios from './axiosInstance';

const DashboardService = {
  
  // In DashboardService.js
getDashboardStats: (empId) => {
  return axios.get(`/api/dashboard/stats/${empId}`)
    .catch(error => {
      console.error('DashboardService Error:', error);
      throw error;
    });
},
  
  getJobsByEmployer: (empId) => {
    return axios.get(`/api/dashboard/employer/${empId}`);
  }
};

export default DashboardService;