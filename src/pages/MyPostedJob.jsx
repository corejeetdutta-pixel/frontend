import { useEffect, useState } from 'react';
import JobServices from '../api/JobServices';
import { 
  Trash2, Edit3, Share2, Save, X, Eye, Users, Search, 
  XCircle, Download, ChevronLeft, ChevronRight, Copy, Calendar,
  Mail, Clock, Video
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useNavigate } from 'react-router-dom';
import ApplicantModal from './ApplicantModal';

const MyPostedJobs = () => {
  // Job-related states
  const [jobs, setJobs] = useState([]);
  const [editJobId, setEditJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [viewJob, setViewJob] = useState(null);
  const [filterText, setFilterText] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const jobsPerPage = 5;
  const navigate = useNavigate();

  // Applicant-related states
  const [applicants, setApplicants] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [applicantsModalOpen, setApplicantsModalOpen] = useState(false);
  const [currentJobTitle, setCurrentJobTitle] = useState('');
  const [currentJobId, setCurrentJobId] = useState(null);
  
  // Interview-related states
  const [interviewLoading, setInterviewLoading] = useState({});
  const [interviewDetails, setInterviewDetails] = useState({
    date: '',
    time: '',
    meetLink: '',
    password: '',
    duration: '30',
    contactEmail: ''
  });

  useEffect(() => {
    fetchPostedJobs();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [filterText]);

  const fetchPostedJobs = async () => {
    try {
      const res = await JobServices.getAllPostedJobs();
      setJobs(res.data || []);
    } catch (err) {
      console.error('❌ Failed to fetch your posted jobs', err);
      if (err.response?.status === 401) {
        navigate('/employee/employee-login');
      }
    }
  };

  const fetchApplicants = async (jobId, jobTitle) => {
  try {
    setLoadingApplicants(true);
    console.log('Fetching applicants for job:', jobId);
    
    const res = await JobServices.getApplicantsForJob(jobId);
    console.log('Applicants response:', res.data);
    
    // Ensure we always set an array
    const applicantsData = Array.isArray(res.data) ? res.data : [];
    setApplicants(applicantsData);
    setCurrentJobTitle(jobTitle);
    setCurrentJobId(jobId);
    setApplicantsModalOpen(true);
    
    if (applicantsData.length === 0) {
      console.log('No applicants found for this job');
    }
  } catch (err) {
    console.error('Failed to fetch applicants', err);
    const errorMessage = err.response?.data?.message || err.response?.data || 'Failed to fetch applicants';
    alert(`Error: ${errorMessage}`);
    
    // Set empty array on error
    setApplicants([]);
  } finally {
    setLoadingApplicants(false);
  }
};

  const closeApplicantsView = () => {
    setApplicantsModalOpen(false);
    setApplicants([]);
  };

  // Handle job editing
  const handleEdit = (job) => {
    setEditJobId(job.jobId);
    setEditedJob({ ...job });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedJob((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      await JobServices.updateJob(editJobId, editedJob);
      setJobs((prev) =>
        prev.map((j) => (j.jobId === editJobId ? { ...j, ...editedJob } : j))
      );
      setEditJobId(null);
      setEditedJob({});
    } catch (err) {
      alert('❌ Failed to update job.');
    }
  };

  const handleCancel = () => {
    setEditJobId(null);
    setEditedJob({});
  };

  const deleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job?')) return;
    try {
      await JobServices.deleteJob(jobId);
      setJobs((prev) => prev.filter((j) => j.jobId !== jobId));
    } catch (err) {
      alert('Failed to delete job.');
    }
  };

  const handleShare = (jobId) => {
    const url = `${window.location.origin}/jobs/${jobId}`;
    navigator.clipboard.writeText(url);
    alert('📋 Job link copied to clipboard!');
  };

  const handleView = (job) => {
    setViewJob(job);
  };

  const closeView = () => {
    setViewJob(null);
  };

  // Handle interview scheduling
  // Handle interview scheduling
// Handle interview scheduling
const handleScheduleInterviews = async (job) => {
  if (!window.confirm('Schedule interviews for this job? This will send emails to qualified applicants.')) {
    return;
  }
  
  setInterviewLoading(prev => ({ ...prev, [job.jobId]: true }));
  
  try {
    // Send interview details to backend for processing
    const response = await JobServices.scheduleInterviews({
      jobId: job.jobId,
      jobTitle: job.title,
      company: job.company,
      interviewDetails: {
        ...interviewDetails,
        contactEmail: job.contactEmail || interviewDetails.contactEmail
      }
    });
    
    alert(`Interview invitations sent to ${response.data.qualifiedCount} qualified applicants! ${response.data.alreadyProcessedCount} applicants were already processed.`);
    
  } catch (err) {
    console.error('Failed to schedule interviews', err);
    alert(err.response?.data || 'Failed to schedule interviews');
  } finally {
    setInterviewLoading(prev => ({ ...prev, [job.jobId]: false }));
  }
};
  // Filter jobs
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(filterText.toLowerCase()) ||
      job.company.toLowerCase().includes(filterText.toLowerCase()) ||
      job.location.toLowerCase().includes(filterText.toLowerCase())
  );

  // Pagination for jobs
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / jobsPerPage));

  const paginate = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Format dates consistently
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return isNaN(date) ? 'Invalid Date' : date.toLocaleDateString('en-GB');
  };

  // Export jobs to PDF
  const exportToPDF = () => {
    if (filteredJobs.length === 0) {
      alert('No jobs to export');
      return;
    }
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text('My Posted Jobs Report', 105, 15, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 105, 22, null, null, 'center');
    
    // Table data
    const tableData = filteredJobs.map((job, idx) => [
      idx + 1,
      job.title,
      job.company,
      job.location,
      `${job.minSalary} - ${job.maxSalary}`,
      job.openings,
      formatDate(job.lastDate),
    ]);

    // AutoTable
    autoTable(doc, {
      startY: 25,
      head: [['#', 'Title', 'Company', 'Location', 'Salary', 'Openings', 'Last Date']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [59, 130, 246] },
      alternateRowStyles: { fillColor: [243, 244, 246] },
    });

    doc.save(`my-jobs-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      {/* Header and Filter */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-blue-700">📋 My Posted Jobs</h2>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-lg">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Filter by title, company, or location"
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
              className="border px-3 py-2 pl-9 rounded w-full text-sm"
            />
            {filterText && (
              <button
                onClick={() => setFilterText('')}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500 hover:text-gray-700"
              >
                <XCircle className="h-4 w-4" />
              </button>
            )}
          </div>
          <button
            onClick={exportToPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 text-sm flex items-center justify-center gap-1"
          >
            <Save size={14} /> Export PDF
          </button>
        </div>
      </div>

      {/* Interview Details Modal */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" style={{ display: interviewDetails.open ? 'flex' : 'none' }}>
        <div className="bg-white rounded-xl p-6 w-full max-w-md">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-blue-700">Interview Details</h3>
            <button 
              onClick={() => setInterviewDetails({ ...interviewDetails, open: false })} 
              className="text-gray-500 hover:text-red-600"
            >
              <X size={24} />
            </button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Date</label>
              <input
                type="date"
                value={interviewDetails.date}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, date: e.target.value })}
                className="w-full border rounded px-3 py-2"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Interview Time</label>
              <input
                type="time"
                value={interviewDetails.time}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, time: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Google Meet Link</label>
              <input
                type="url"
                placeholder="https://meet.google.com/xxx-xxxx-xxx"
                value={interviewDetails.meetLink}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, meetLink: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meeting Password (if any)</label>
              <input
                type="text"
                placeholder="Optional"
                value={interviewDetails.password}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, password: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
              <select
                value={interviewDetails.duration}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, duration: e.target.value })}
                className="w-full border rounded px-3 py-2"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Contact Email</label>
              <input
                type="email"
                placeholder="hr@company.com"
                value={interviewDetails.contactEmail}
                onChange={(e) => setInterviewDetails({ ...interviewDetails, contactEmail: e.target.value })}
                className="w-full border rounded px-3 py-2"
              />
            </div>
            
            <button
              onClick={() => setInterviewDetails({ ...interviewDetails, open: false })}
              className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
            >
              Save Details
            </button>
          </div>
        </div>
      </div>

      {/* Jobs Table */}
      {filteredJobs.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <p className="text-gray-500 text-lg">
            {jobs.length === 0 
              ? "You haven't posted any jobs yet" 
              : "No jobs match your filter criteria"}
          </p>
          {jobs.length === 0 && (
            <button
              onClick={() => navigate('/post-job')}
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              Post Your First Job
            </button>
          )}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-lg shadow">
            <table className="min-w-full bg-white">
              <thead className="bg-blue-600 text-white">
                <tr>
                  <th className="px-4 py-3 text-left">Job Title</th>
                  <th className="px-4 py-3 text-left hidden sm:table-cell">Company</th>
                  <th className="px-4 py-3 text-left hidden md:table-cell">Location</th>
                  <th className="px-4 py-3 text-left">Salary</th>
                  <th className="px-4 py-3 text-left">Openings</th>
                  <th className="px-4 py-3 text-left">Last Date</th>
                  <th className="px-4 py-3 text-left min-w-[150px]">Actions</th>
                  <th className="px-4 py-3 text-left min-w-[120px]">Applied</th>
                  <th className="px-4 py-3 text-left min-w-[140px]">Interview</th>
                </tr>
              </thead>
              <tbody>
                {currentJobs.map((job) => (
                  <tr
                    key={job.jobId}
                    className="border-b hover:bg-gray-50"
                  >
                    <td className="px-4 py-3">
                      {editJobId === job.jobId ? (
                        <input
                          name="title"
                          value={editedJob.title || ''}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      ) : (
                        <div className="font-medium">{job.title}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      {editJobId === job.jobId ? (
                        <input
                          name="company"
                          value={editedJob.company || ''}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      ) : (
                        job.company
                      )}
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      {editJobId === job.jobId ? (
                        <input
                          name="location"
                          value={editedJob.location || ''}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      ) : (
                        job.location
                      )}
                    </td>
                    <td className="px-4 py-3 text-green-600 font-semibold">
                      {editJobId === job.jobId ? (
                        <div className="flex gap-1">
                          <input
                            name="minSalary"
                            value={editedJob.minSalary || ''}
                            onChange={handleChange}
                            className="w-16 border px-2 py-1 rounded text-sm"
                          />
                          <span>-</span>
                          <input
                            name="maxSalary"
                            value={editedJob.maxSalary || ''}
                            onChange={handleChange}
                            className="w-16 border px-2 py-1 rounded text-sm"
                          />
                        </div>
                      ) : (
                        `${job.minSalary} - ${job.maxSalary}`
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editJobId === job.jobId ? (
                        <input
                          name="openings"
                          type="number"
                          value={editedJob.openings || ''}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-16 text-sm"
                        />
                      ) : (
                        job.openings
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {editJobId === job.jobId ? (
                        <input
                          name="lastDate"
                          type="date"
                          value={editedJob.lastDate ? editedJob.lastDate.split('T')[0] : ''}
                          onChange={handleChange}
                          className="border rounded px-2 py-1 w-full text-sm"
                        />
                      ) : (
                        formatDate(job.lastDate)
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {editJobId === job.jobId ? (
                          <>
                            <button 
                              onClick={handleSave} 
                              className="text-green-600 hover:text-green-800"
                              title="Save changes"
                            >
                              <Save size={18} />
                            </button>
                            <button 
                              onClick={handleCancel} 
                              className="text-gray-600 hover:text-gray-800"
                              title="Cancel edit"
                            >
                              <X size={18} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button 
                              onClick={() => handleEdit(job)} 
                              className="text-yellow-500 hover:text-yellow-700"
                              title="Edit job"
                            >
                              <Edit3 size={18} />
                            </button>
                            <button 
                              onClick={() => deleteJob(job.jobId)} 
                              className="text-red-500 hover:text-red-700"
                              title="Delete job"
                            >
                              <Trash2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleShare(job.jobId)} 
                              className="text-blue-500 hover:text-blue-700"
                              title="Share job link"
                            >
                              <Share2 size={18} />
                            </button>
                            <button 
                              onClick={() => handleView(job)} 
                              className="text-purple-500 hover:text-purple-700"
                              title="View details"
                            >
                              <Eye size={18} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <button
                        onClick={() => fetchApplicants(job.jobId, job.title)}
                        className="flex items-center justify-center gap-1 bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700 text-sm"
                        title="View applicants"
                      >
                        <Users size={14} /> View
                      </button>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-2">
                        <button
                          onClick={() => setInterviewDetails({ ...interviewDetails, open: true })}
                          className="flex items-center justify-center gap-1 bg-gray-600 text-white px-3 py-1 rounded hover:bg-gray-700 text-sm"
                          title="Set interview details"
                        >
                          <Calendar size={14} /> Set Details
                        </button>
                        <button
                          onClick={() => handleScheduleInterviews(job)}
                          disabled={interviewLoading[job.jobId] || !interviewDetails.date}
                          className="flex items-center justify-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm disabled:bg-green-300 disabled:cursor-not-allowed"
                          title="Schedule interviews"
                        >
                          {interviewLoading[job.jobId] ? (
                            <>Scheduling...</>
                          ) : (
                            <>
                              <Video size={14} /> Schedule
                            </>
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Jobs Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-between items-center mt-6">
              <div className="text-sm text-gray-600">
                Showing {indexOfFirstJob + 1} to {Math.min(indexOfLastJob, filteredJobs.length)} of {filteredJobs.length} jobs
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={() => paginate(currentPage - 1)}
                  disabled={currentPage === 1}
                  className={`px-3 py-1 border rounded flex items-center ${
                    currentPage === 1 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <ChevronLeft size={16} /> Previous
                </button>
                
                {Array.from({ length: totalPages }, (_, idx) => (
                  <button
                    key={idx + 1}
                    onClick={() => paginate(idx + 1)}
                    className={`px-3 py-1 border rounded ${
                      currentPage === idx + 1 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-white text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    {idx + 1}
                  </button>
                ))}
                
                <button
                  onClick={() => paginate(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className={`px-3 py-1 border rounded flex items-center ${
                    currentPage === totalPages 
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                      : 'bg-white text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Next <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </>
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
      />

      {/* Job Details Modal */}
      {viewJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-semibold text-blue-700">🔍 Job Details</h3>
              <button 
                onClick={closeView} 
                className="text-gray-500 hover:text-red-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
              <p><strong>Title:</strong> {viewJob.title}</p>
              <p><strong>Company:</strong> {viewJob.company}</p>
              <p><strong>Location:</strong> {viewJob.location}</p>
              <p><strong>Salary:</strong> {viewJob.minSalary} - {viewJob.maxSalary}</p>
              <p><strong>Experience:</strong> {viewJob.experience}</p>
              <p><strong>Job Type:</strong> {viewJob.jobType}</p>
              <p><strong>Department:</strong> {viewJob.department}</p>
              <p><strong>Employment Type:</strong> {viewJob.employmentType}</p>
              <p><strong>Openings:</strong> {viewJob.openings}</p>
              <p><strong>Mode:</strong> {viewJob.mode}</p>
              <p><strong>Opening Date:</strong> {formatDate(viewJob.openingDate)}</p>
              <p><strong>Closing Date:</strong> {formatDate(viewJob.lastDate)}</p>
              <p><strong>Email:</strong> {viewJob.contactEmail}</p>
              <p className="sm:col-span-2"><strong>Description:</strong> {viewJob.description}</p>
              <p className="sm:col-span-2"><strong>Requirements:</strong> {viewJob.requirements}</p>
              <p className="sm:col-span-2"><strong>Perks:</strong> {viewJob.perks}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyPostedJobs;