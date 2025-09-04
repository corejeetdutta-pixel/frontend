import React, { useState } from 'react';
import { Share2, Eye, Trash2, Loader, Users } from 'lucide-react';
import JobServices from '../api/JobServices';
import ApplicantModal from '../pages/ApplicantModal';
import { formatDate } from '../utils/dateUtils'; // Assuming you have a date utility

const JobsByCompany = ({ jobsByCompany, loading, handleShare, handleView, onJobDelete }) => {
  const [deletingJobId, setDeletingJobId] = useState(null);
  
  // Applicant-related states
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsModalOpen, setApplicantsModalOpen] = useState(false);
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);
  const [viewApplicant, setViewApplicant] = useState(null);
  
  // Function to check if a job is active (last date is in the future)
  const isJobActive = (job) => {
    return new Date(job.lastDate) > new Date();
  };

  // Handle delete job
  const handleDelete = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) {
      return;
    }
    
    setDeletingJobId(jobId);
    try {
      await onJobDelete(jobId);
    } catch (error) {
      console.error('Failed to delete job:', error);
      alert('Failed to delete job. Please try again.');
    } finally {
      setDeletingJobId(null);
    }
  };

  // Fetch applicants for a job
  const fetchApplicants = async (jobId, jobTitle) => {
    try {
      setLoadingApplicants(true);
      const res = await JobServices.getApplicantsForJob(jobId);
      setApplicants(res.data || []);
      setCurrentJobTitle(jobTitle);
      setCurrentJobId(jobId);
      setApplicantsModalOpen(true);
    } catch (err) {
      console.error('Failed to fetch applicants', err);
      alert(err.response?.data || 'Failed to fetch applicants');
    } finally {
      setLoadingApplicants(false);
    }
  };

  const closeApplicantsView = () => {
    setApplicantsModalOpen(false);
    setApplicants([]);
  };

  // Copy applicant details to clipboard
  const copyApplicantDetails = (applicant) => {
    const details = `
      Name: ${applicant.name}
      Email: ${applicant.email}
      Mobile: ${applicant.mobile}
      Qualification: ${applicant.qualification}
      Gender: ${applicant.gender}
      Score: ${applicant.score || 'N/A'}
      Status: ${applicant.status || 'Applied'}
      Applied On: ${formatDate(applicant.appliedAt)}
      Date of Birth: ${formatDate(applicant.dob)}
      Address: ${applicant.address || 'N/A'}
      Passout Year: ${applicant.passoutYear || 'N/A'}
      Experience: ${applicant.experience || 'N/A'}
      Skills: ${applicant.skills?.join(', ') || 'N/A'}
      LinkedIn: ${applicant.linkedin || 'N/A'}
      GitHub: ${applicant.github || 'N/A'}
    `;
    
    navigator.clipboard.writeText(details);
    alert('Applicant details copied to clipboard!');
  };

  // Open external links
  const openExternalLink = (url) => {
    if (!url) return;
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    window.open(url, '_blank');
  };

  // Fixed resume viewing function
  const viewResume = (resumeBase64) => {
    if (!resumeBase64) {
      alert('Resume not available');
      return;
    }

    try {
      // Create PDF directly from base64
      const dataUrl = resumeBase64.startsWith('data:application/pdf') 
        ? resumeBase64 
        : `data:application/pdf;base64,${resumeBase64}`;
      
      // Open in new tab
      const pdfWindow = window.open();
      pdfWindow.document.write(`
        <html>
          <head>
            <title>Resume - ${viewApplicant?.name}</title>
            <style>
              body { margin: 0; padding: 0; background: #f0f2f5; }
              iframe { width: 100%; height: 100vh; border: none; }
              .toolbar { padding: 10px; background: #fff; border-bottom: 1px solid #ddd; }
              .toolbar button { padding: 5px 10px; background: #3b82f6; color: white; border: none; border-radius: 4px; cursor: pointer; }
            </style>
          </head>
          <body>
            <div class="toolbar">
              <button onclick="window.print()">Print</button>
              <button onclick="window.close()">Close</button>
            </div>
            <iframe src="${dataUrl}"></iframe>
          </body>
        </html>
      `);
    } catch (error) {
      console.error('Error opening resume:', error);
      alert('Failed to open resume: Please ensure it is a valid PDF file');
    }
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Jobs by Company</h2>
      </div>
      
      {loading ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">Loading jobs...</p>
        </div>
      ) : Object.keys(jobsByCompany).length === 0 ? (
        <div className="p-6 text-center">
          <p className="text-gray-500">No jobs found.</p>
        </div>
      ) : (
        <div className="divide-y divide-gray-200">
          {Object.entries(jobsByCompany).map(([company, companyJobs]) => (
            <div key={company} className="p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">{company}</h3>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Job Title
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Salary
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Openings
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Last Date
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Applied
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {companyJobs.map((job) => {
                      const active = isJobActive(job);
                      return (
                        <tr 
                          key={job.jobId} 
                          className={active ? 'bg-green-50' : 'bg-red-50'}
                        >
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {job.title}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {job.location}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {job.minSalary} - {job.maxSalary}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {job.openings}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                            {new Date(job.lastDate).toLocaleDateString('en-GB')}
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              active 
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-red-100 text-red-800'
                            }`}>
                              {active ? 'Active' : 'Expired'}
                            </span>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <button
                              onClick={() => fetchApplicants(job.jobId, job.title)}
                              className="flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                              title="View applicants"
                            >
                              <Users size={14} /> View
                            </button>
                          </td>
                          <td className="px-4 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex items-center">
                              <button 
                                onClick={() => handleShare(job.jobId)}
                                className="text-blue-600 hover:text-blue-900 mr-3"
                                title="Share job"
                              >
                                <Share2 size={18} />
                              </button>
                              <button 
                                onClick={() => handleView(job)}
                                className="text-purple-600 hover:text-purple-900 mr-3"
                                title="View details"
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                onClick={() => handleDelete(job.jobId)}
                                className="text-red-600 hover:text-red-900"
                                title="Delete job"
                                disabled={deletingJobId === job.jobId}
                              >
                                {deletingJobId === job.jobId ? (
                                  <Loader size={18} className="animate-spin" />
                                ) : (
                                  <Trash2 size={18} />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Applicant Modal */}
      <ApplicantModal
        isOpen={applicantsModalOpen}
        onClose={closeApplicantsView}
        applicants={applicants}
        currentJobTitle={currentJobTitle}
        currentJobId={currentJobId}
        loadingApplicants={loadingApplicants}
        formatDate={formatDate}
        viewApplicant={viewApplicant}
        setViewApplicant={setViewApplicant}
        copyApplicantDetails={copyApplicantDetails}
        viewResume={viewResume}
        openExternalLink={openExternalLink}
      />
    </div>
  );
};

export default JobsByCompany;