import { X, Copy, UserIcon, Mail, Phone, MapPin, Calendar, GraduationCap, Briefcase, Code, FileText, Globe, Award, LinkIcon } from 'lucide-react';

const ApplicantsViewDetails = ({ 
  viewApplicant, 
  setViewApplicant, 
  formatDate, 
  copyApplicantDetails, 
  viewResume, 
  openExternalLink 
}) => {
  if (!viewApplicant) return null;

  // Render info row with icon
  const renderInfoRow = (Icon, label, value, fallback = 'N/A') => (
    <div className="flex items-start mb-2">
      <Icon className="text-blue-600 mt-0.5 mr-2 flex-shrink-0" size={18} />
      <div>
        <span className="font-medium text-gray-700">{label}:</span>
        <span className="ml-1 text-gray-800">
          {value || fallback}
        </span>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <h3 className="text-2xl font-bold text-indigo-700 flex items-center">
            <UserIcon className="mr-2" size={24} />
            Applicant Details
          </h3>
          <div className="flex gap-2">
            <button
              onClick={() => copyApplicantDetails(viewApplicant)}
              className="flex items-center gap-1 bg-indigo-100 hover:bg-indigo-200 text-indigo-700 px-3 py-1 rounded-lg transition-colors"
            >
              <Copy size={16} /> Copy
            </button>
            <button 
              onClick={() => setViewApplicant(null)}
              className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
            >
              <X size={24} />
            </button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Personal Information Card */}
          <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
            <h4 className="font-bold text-lg text-indigo-800 mb-4 flex items-center">
              <UserIcon className="mr-2" size={20} />
              Personal Information
            </h4>
            <div className="space-y-3">
              {renderInfoRow(UserIcon, 'Name', viewApplicant.name)}
              {renderInfoRow(Mail, 'Email', viewApplicant.email)}
              {renderInfoRow(Phone, 'Mobile', viewApplicant.mobile)}
              {renderInfoRow(MapPin, 'Address', viewApplicant.address, 'Not provided')}
              {renderInfoRow(Calendar, 'Date of Birth', formatDate(viewApplicant.dob), 'Not provided')}
            </div>
          </div>
          
          {/* Education & Experience Card */}
          <div className="bg-amber-50 p-5 rounded-xl border border-amber-100">
            <h4 className="font-bold text-lg text-amber-800 mb-4 flex items-center">
              <GraduationCap className="mr-2" size={20} />
              Education & Experience
            </h4>
            <div className="space-y-3">
              {renderInfoRow(GraduationCap, 'Qualification', viewApplicant.qualification)}
              {renderInfoRow(Calendar, 'Passout Year', viewApplicant.passoutYear, 'N/A')}
              {renderInfoRow(Briefcase, 'Experience', viewApplicant.experience, 'N/A')}
              {renderInfoRow(Code, 'Skills', 
                viewApplicant.skills?.length > 0 
                  ? viewApplicant.skills.join(', ') 
                  : null, 
                'Not specified'
              )}
              <div className="flex items-start">
                <FileText className="text-indigo-600 mt-0.5 mr-2" size={18} />
                <div>
                  <span className="font-medium text-gray-700">Resume:</span>
                  {viewApplicant.resume ? (
                    <button 
                      onClick={() => viewResume(viewApplicant.resume)}
                      className="ml-1 flex items-center text-indigo-600 hover:underline"
                    >
                      <LinkIcon size={14} className="mr-1" /> View PDF
                    </button>
                  ) : (
                    <span className="ml-1 text-gray-500">Not available</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Application Details Card */}
          <div className="bg-green-50 p-5 rounded-xl border border-green-100">
            <h4 className="font-bold text-lg text-green-800 mb-4 flex items-center">
              <Award className="mr-2" size={20} />
              Application Details
            </h4>
            <div className="space-y-3">
              {renderInfoRow(Calendar, 'Applied On', formatDate(viewApplicant.appliedAt))}
              <div className="flex items-start">
                <div className="text-green-600 mt-0.5 mr-2">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center bg-green-100">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div>
                  <span className="font-medium text-gray-700">Status:</span>
                  <span className={`ml-1 px-3 py-1 rounded-full text-xs font-medium ${
                    viewApplicant.status === 'Selected' 
                      ? 'bg-green-200 text-green-800' 
                      : viewApplicant.status === 'Rejected' 
                        ? 'bg-red-200 text-red-800' 
                        : 'bg-amber-200 text-amber-800'
                  }`}>
                    {viewApplicant.status || 'Applied'}
                  </span>
                </div>
              </div>
              {renderInfoRow(StarIcon, 'Score', viewApplicant.score, 'N/A')}
              {renderInfoRow(FileText, 'Cover Letter', viewApplicant.coverLetter, 'Not provided')}
            </div>
          </div>
          
          {/* Social Links Card */}
          <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
            <h4 className="font-bold text-lg text-blue-800 mb-4 flex items-center">
              <Globe className="mr-2" size={20} />
              Social Profiles
            </h4>
            <div className="space-y-4">
              <div className="flex items-center">
                <div className="bg-[#0A66C2] p-2 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-700">LinkedIn</div>
                  {viewApplicant.linkedin ? (
                    <button
                      onClick={() => openExternalLink(viewApplicant.linkedin)}
                      className="text-blue-600 hover:underline truncate max-w-full block"
                    >
                      {viewApplicant.linkedin}
                    </button>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </div>
              </div>
              
              <div className="flex items-center">
                <div className="bg-gray-800 p-2 rounded mr-3">
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white">
                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                  </svg>
                </div>
                <div className="flex-1">
                  <div className="font-medium text-gray-700">GitHub</div>
                  {viewApplicant.github ? (
                    <button
                      onClick={() => openExternalLink(viewApplicant.github)}
                      className="text-blue-600 hover:underline truncate max-w-full block"
                    >
                      {viewApplicant.github}
                    </button>
                  ) : (
                    <span className="text-gray-500">Not provided</span>
                  )}
                </div>
              </div>
              
              <div className="flex gap-3 mt-4">
                {viewApplicant.linkedin && (
                  <button
                    onClick={() => openExternalLink(viewApplicant.linkedin)}
                    className="flex-1 flex items-center justify-center gap-2 bg-[#0A66C2] hover:bg-[#004182] text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                    </svg>
                    Visit LinkedIn
                  </button>
                )}
                {viewApplicant.github && (
                  <button
                    onClick={() => openExternalLink(viewApplicant.github)}
                    className="flex-1 flex items-center justify-center gap-2 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="white" className="mr-1">
                      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                    </svg>
                    Visit GitHub
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Custom Star Icon component
const StarIcon = ({ className, size }) => (
  <svg xmlns="http://www.w3.org/2000/svg" className={className} width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.828 1.48 8.279-7.416-3.967-7.417 3.967 1.481-8.279-6.064-5.828 8.332-1.151z"/>
  </svg>
);

export default ApplicantsViewDetails;