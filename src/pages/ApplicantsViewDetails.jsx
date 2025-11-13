import { X, Mail, Phone, Calendar, MapPin, GraduationCap, Briefcase, 
  Code, Linkedin, Github, User, FileText, Download } from 'lucide-react';

const ApplicantsViewDetails = ({ applicant, onClose, formatDateTime }) => {
  if (!applicant) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 pb-4 border-b">
          <div>
            <h3 className="text-2xl font-bold text-blue-700 flex items-center gap-2">
              <User className="text-blue-600" size={28} />
              Applicant Details
            </h3>
            <p className="text-gray-600 mt-1">Complete profile information</p>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-red-600 p-2 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Personal Information */}
          <div className="lg:col-span-1">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-lg p-6 text-center">
              <div className="w-24 h-24 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                {applicant.name ? applicant.name.charAt(0).toUpperCase() : 'U'}
              </div>
              <h4 className="text-xl font-bold text-gray-800 mb-2">{applicant.name}</h4>
              <div className="flex items-center justify-center gap-2 text-gray-600 mb-3">
                <Mail size={16} />
                <span className="text-sm">{applicant.email}</span>
              </div>
              <div className={`inline-flex px-3 py-1 rounded-full text-xs font-medium ${
                applicant.status === 'Selected' ? 'bg-green-100 text-green-800' :
                applicant.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {applicant.status || 'Applied'}
              </div>
            </div>

            {/* Contact Information */}
            <div className="mt-6 bg-white border border-gray-200 rounded-lg p-4">
              <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                <Phone size={18} className="text-green-600" />
                Contact Information
              </h5>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phone:</span>
                  <span className="font-medium">{applicant.phone || applicant.mobile || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Applied On:</span>
                  <span className="font-medium">
                    {applicant.appliedAt ? formatDateTime(applicant.appliedAt) : 'N/A'}
                  </span>
                </div>
              </div>
            </div>

            {/* Social Links */}
            {(applicant.linkedin || applicant.github) && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Social Profiles</h5>
                <div className="space-y-2">
                  {applicant.linkedin && (
                    <div className="flex items-center gap-2">
                      <Linkedin size={16} className="text-blue-600" />
                      <a 
                        href={applicant.linkedin} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 text-sm"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                  {applicant.github && (
                    <div className="flex items-center gap-2">
                      <Github size={16} className="text-gray-800" />
                      <a 
                        href={applicant.github} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-gray-800 hover:text-gray-600 text-sm"
                      >
                        GitHub Profile
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right Column - Detailed Information */}
          <div className="lg:col-span-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Education */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <GraduationCap size={18} className="text-purple-600" />
                  Education
                </h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Qualification:</span>
                    <p className="font-medium">{applicant.qualification || 'N/A'}</p>
                  </div>
                  {applicant.passoutYear && (
                    <div>
                      <span className="text-gray-600 text-sm">Passout Year:</span>
                      <p className="font-medium">{applicant.passoutYear}</p>
                    </div>
                  )}
                  {applicant.department && (
                    <div>
                      <span className="text-gray-600 text-sm">Department:</span>
                      <p className="font-medium">{applicant.department}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Experience */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Briefcase size={18} className="text-orange-600" />
                  Experience
                </h5>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Total Experience:</span>
                    <p className="font-medium">{applicant.experience || 'N/A'}</p>
                  </div>
                  {applicant.score && (
                    <div>
                      <span className="text-gray-600 text-sm">Application Score:</span>
                      <p className="font-medium text-blue-600">{applicant.score}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Personal Details */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <User size={18} className="text-green-600" />
                  Personal Details
                </h5>
                <div className="space-y-2">
                  {applicant.gender && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Gender:</span>
                      <span className="font-medium">{applicant.gender}</span>
                    </div>
                  )}
                  {applicant.dob && (
                    <div className="flex justify-between">
                      <span className="text-gray-600 text-sm">Date of Birth:</span>
                      <span className="font-medium">{applicant.dob}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Location */}
              <div className="bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <MapPin size={18} className="text-red-600" />
                  Location
                </h5>
                {applicant.address ? (
                  <p className="text-gray-700">{applicant.address}</p>
                ) : (
                  <p className="text-gray-500">No address provided</p>
                )}
              </div>
            </div>

            {/* Skills */}
            {applicant.skills && applicant.skills.length > 0 && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <Code size={18} className="text-indigo-600" />
                  Skills
                </h5>
                <div className="flex flex-wrap gap-2">
                  {applicant.skills.map((skill, index) => (
                    <span 
                      key={index}
                      className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm font-medium"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Cover Letter */}
            {applicant.coverLetter && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                  <FileText size={18} className="text-amber-600" />
                  Cover Letter
                </h5>
                <p className="text-gray-700 whitespace-pre-wrap">{applicant.coverLetter}</p>
              </div>
            )}

            {/* Resume Download */}
            {applicant.resumeUrl && (
              <div className="mt-4 bg-white border border-gray-200 rounded-lg p-4">
                <h5 className="font-semibold text-gray-800 mb-3">Resume</h5>
                <button
                  onClick={() => window.open(applicant.resumeUrl, '_blank')}
                  className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition-colors"
                >
                  <Download size={16} />
                  Download Resume
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-3 pt-4 border-t">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded transition-colors"
          >
            Print Profile
          </button>
        </div>
      </div>
    </div>
  );
};

export default ApplicantsViewDetails;