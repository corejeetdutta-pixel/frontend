import React from 'react';
import { Save, X } from 'lucide-react';

const JobTable = ({ 
  currentJobs, 
  editJobId, 
  editedJob, 
  handleChange, 
  handleEdit, 
  handleSave, 
  handleCancel, 
  deleteJob, 
  handleShare, 
  handleView, 
  fetchApplicants,
  formatDate
}) => (
  <div className="overflow-x-auto rounded-lg shadow">
    <table className="min-w-full bg-white">
      <thead className="bg-blue-600 text-white">
        <tr>
          <th className="px-4 py-3 text-left">Job Title</th>
          <th className="px-4 py-3 text-left hidden sm:table-cell">Company</th>
          <th className="px-4 py-3 text-left">Salary</th>
          <th className="px-4 py-3 text-left">Openings</th>
          <th className="px-4 py-3 text-left">Last Date</th>
          <th className="px-4 py-3 text-left min-w-[150px]">Actions</th>
          <th className="px-4 py-3 text-left min-w-[120px]">Applied</th>
        </tr>
      </thead>
      <tbody>
        {currentJobs.map((job) => (
          <tr key={job.jobId} className="border-b hover:bg-gray-50">
            <JobRow 
              job={job}
              editJobId={editJobId}
              editedJob={editedJob}
              handleChange={handleChange}
              handleEdit={handleEdit}
              handleSave={handleSave}
              handleCancel={handleCancel}
              deleteJob={deleteJob}
              handleShare={handleShare}
              handleView={handleView}
              fetchApplicants={fetchApplicants}
              formatDate={formatDate}
            />
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

const JobRow = ({
  job,
  editJobId,
  editedJob,
  handleChange,
  handleEdit,
  handleSave,
  handleCancel,
  deleteJob,
  handleShare,
  handleView,
  fetchApplicants,
  formatDate
}) => (
  <>
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
          <JobActions 
            job={job}
            handleEdit={handleEdit}
            deleteJob={deleteJob}
            handleShare={handleShare}
            handleView={handleView}
          />
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
  </>
);

const JobActions = ({ job, handleEdit, deleteJob, handleShare, handleView }) => (
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
);

export default JobTable;