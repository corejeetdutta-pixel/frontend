import React from 'react';
import { X } from 'lucide-react';

const JobDetailsModal = ({ job, onClose, formatDate }) => {
  if (!job) return null;

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-blue-700">🔍 Job Details</h3>
        <button 
          onClick={onClose} 
          className="text-gray-500 hover:text-red-600"
        >
          <X size={24} />
        </button>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-800">
        <DetailItem label="Title" value={job.title} />
        <DetailItem label="Company" value={job.company} />
        <DetailItem label="Location" value={job.location} />
        <DetailItem label="Salary" value={`${job.minSalary} - ${job.maxSalary}`} />
        <DetailItem label="Experience" value={job.experience} />
        <DetailItem label="Job Type" value={job.jobType} />
        <DetailItem label="Department" value={job.department} />
        <DetailItem label="Employment Type" value={job.employmentType} />
        <DetailItem label="Openings" value={job.openings} />
        <DetailItem label="Mode" value={job.mode} />
        <DetailItem label="Opening Date" value={formatDate(job.openingDate)} />
        <DetailItem label="Closing Date" value={formatDate(job.lastDate)} />
        <DetailItem label="Email" value={job.contactEmail} />
        <FullWidthDetail label="Description" value={job.description} />
        <FullWidthDetail label="Requirements" value={job.requirements} />
        <FullWidthDetail label="Perks" value={job.perks} />
      </div>
    </div>
  );
};

const DetailItem = ({ label, value }) => (
  <p><strong>{label}:</strong> {value || 'N/A'}</p>
);

const FullWidthDetail = ({ label, value }) => (
  <p className="sm:col-span-2"><strong>{label}:</strong> {value || 'N/A'}</p>
);

export default JobDetailsModal;