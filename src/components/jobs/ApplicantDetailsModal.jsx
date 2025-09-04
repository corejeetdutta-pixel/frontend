import React from 'react';
import { X, Copy, Download } from 'lucide-react';

const ApplicantDetailsModal = ({ applicant, onClose, formatDate }) => {
  if (!applicant) return null;

  const copyApplicantDetails = () => {
    const details = `
      Name: ${applicant.name}
      Email: ${applicant.email}
      Mobile: ${applicant.mobile}
      Qualification: ${applicant.qualification}
      Gender: ${applicant.gender}
      Score: ${applicant.score || 'N/A'}
      Status: ${applicant.status || 'Applied'}
      Applied On: ${formatDate(applicant.appliedAt)}
    `;
    
    navigator.clipboard.writeText(details);
    alert('Applicant details copied to clipboard!');
  };

  return (
    <div className="bg-white rounded-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-2xl font-semibold text-blue-700">
          👤 Applicant Details
        </h3>
        <div className="flex gap-2">
          <button
            onClick={copyApplicantDetails}
            className="flex items-center gap-1 bg-gray-200 text-gray-800 px-3 py-1 rounded hover:bg-gray-300 text-sm"
          >
            <Copy size={14} /> Copy
          </button>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-600"
          >
            <X size={24} />
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <DetailSection title="Personal Information">
          <DetailItem label="Name" value={applicant.name} />
          <DetailItem label="Email" value={applicant.email} />
          <DetailItem label="Mobile" value={applicant.mobile} />
          <DetailItem label="Gender" value={applicant.gender} />
          <DetailItem label="Date of Birth" value={formatDate(applicant.dob)} />
        </DetailSection>
        
        <DetailSection title="Education & Experience">
          <DetailItem label="Qualification" value={applicant.qualification} />
          <DetailItem label="Experience" value={applicant.experience || 'N/A'} />
          <DetailItem label="Skills" value={applicant.skills || 'N/A'} />
          <DetailItem label="Resume" value={
            applicant.resume ? (
              <a 
                href={applicant.resume} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Download
              </a>
            ) : 'Not available'
          } />
        </DetailSection>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <DetailSection title="Application Details">
          <DetailItem label="Applied On" value={formatDate(applicant.appliedAt)} />
          <DetailItem label="Status" value={
            <span className={`px-2 py-1 rounded-full text-xs ${
              applicant.status === 'Selected' 
                ? 'bg-green-100 text-green-800' 
                : applicant.status === 'Rejected' 
                  ? 'bg-red-100 text-red-800' 
                  : 'bg-yellow-100 text-yellow-800'
            }`}>
              {applicant.status || 'Applied'}
            </span>
          } />
          <DetailItem label="Score" value={applicant.score || 'N/A'} />
        </DetailSection>
        
        <DetailSection title="Additional Information">
          <DetailItem label="Cover Letter" value={applicant.coverLetter || 'Not provided'} />
          <DetailItem label="LinkedIn" value={
            applicant.linkedin ? (
              <a 
                href={applicant.linkedin} 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View Profile
              </a>
            ) : 'Not provided'
          } />
        </DetailSection>
      </div>
    </div>
  );
};

const DetailSection = ({ title, children }) => (
  <div className="bg-gray-50 p-4 rounded-lg">
    <h4 className="font-semibold text-gray-700 mb-2">{title}</h4>
    <div className="space-y-1">
      {children}
    </div>
  </div>
);

const DetailItem = ({ label, value }) => (
  <p><span className="font-medium">{label}:</span> {value}</p>
);

export default ApplicantDetailsModal;