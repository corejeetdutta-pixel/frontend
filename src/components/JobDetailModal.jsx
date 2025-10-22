// src/components/JobDetailModal.jsx
import React from 'react';
import { X } from 'lucide-react';

const JobDetailModal = ({ viewJob, closeView }) => {
  if (!viewJob) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-screen overflow-y-auto">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-gray-900">Job Details</h3>
          <button onClick={closeView} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Job Title</h4>
            <p className="text-lg text-gray-900 mb-4">{viewJob.title}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Company</h4>
            <p className="text-gray-900 mb-4">{viewJob.company}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Location</h4>
            <p className="text-gray-900 mb-4">{viewJob.location}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Salary</h4>
            <p className="text-gray-900 mb-4">{viewJob.minSalary} - {viewJob.maxSalary}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Experience</h4>
            <p className="text-gray-900 mb-4">{viewJob.experience}</p>
          </div>
          
          <div>
            <h4 className="text-sm font-medium text-gray-500 mb-1">Job Type</h4>
            <p className="text-gray-900 mb-4">{viewJob.jobType}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Department</h4>
            <p className="text-gray-900 mb-4">{viewJob.department}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Employment Type</h4>
            <p className="text-gray-900 mb-4">{viewJob.employmentType}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Openings</h4>
            <p className="text-gray-900 mb-4">{viewJob.openings}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Mode</h4>
            <p className="text-gray-900 mb-4">{viewJob.mode}</p>
          </div>
          
          <div className="md:col-span-2">
            <h4 className="text-sm font-medium text-gray-500 mb-1">Description</h4>
            <p className="text-gray-900 mb-4">{viewJob.description}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Requirements</h4>
            <p className="text-gray-900 mb-4">{viewJob.requirements}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Perks</h4>
            <p className="text-gray-900 mb-4">{viewJob.perks}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Contact Email</h4>
            <p className="text-gray-900 mb-4">{viewJob.contactEmail}</p>
            
            <h4 className="text-sm font-medium text-gray-500 mb-1">Important Dates</h4>
            <p className="text-gray-900">
              Opening: {new Date(viewJob.openingDate).toLocaleDateString('en-GB')} | 
              Closing: {new Date(viewJob.lastDate).toLocaleDateString('en-GB')}
            </p>
          </div>
        </div>
        
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <button
            onClick={closeView}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default JobDetailModal;