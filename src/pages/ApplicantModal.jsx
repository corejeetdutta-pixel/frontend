import { useState } from 'react';
import { 
  X, Download, ChevronLeft, ChevronRight, Copy, Eye, XCircle,
  User as UserIcon, Mail, Users
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ApplicantsViewDetails from './ApplicantsViewDetails';

const ApplicantModal = ({ 
  isOpen, 
  onClose, 
  applicants = [], 
  currentJobTitle = '', 
  loadingApplicants = false,
  formatDateTime
}) => {
  const [applicantFilter, setApplicantFilter] = useState({ 
    name: '', email: '', phone: '', status: '' 
  });
  const [currentApplicantPage, setCurrentApplicantPage] = useState(1);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const applicantsPerPage = 5;

  if (!isOpen) return null;

  // Applicant filtering
  const handleApplicantFilterChange = (e) => {
    const { name, value } = e.target;
    setApplicantFilter(prev => ({ ...prev, [name]: value }));
    setCurrentApplicantPage(1);
  };

  const clearApplicantFilters = () => {
    setApplicantFilter({ name: '', email: '', phone: '', status: '' });
    setCurrentApplicantPage(1);
  };

  // Filter applicants
  const filteredApplicants = applicants.filter(applicant => {
    return (
      (applicant.name || '').toLowerCase().includes(applicantFilter.name.toLowerCase()) &&
      (applicant.email || '').toLowerCase().includes(applicantFilter.email.toLowerCase()) &&
      (applicant.phone || applicant.mobile || '').toString().toLowerCase().includes(applicantFilter.phone.toLowerCase()) &&
      (applicantFilter.status === '' || (applicant.status || 'Applied') === applicantFilter.status)
    );
  });

  // Pagination for applicants
  const applicantTotalPages = Math.max(1, Math.ceil(filteredApplicants.length / applicantsPerPage));
  const applicantIndexLast = currentApplicantPage * applicantsPerPage;
  const applicantIndexFirst = applicantIndexLast - applicantsPerPage;
  const currentApplicants = filteredApplicants.slice(applicantIndexFirst, applicantIndexLast);

  const paginateApplicants = (pageNumber) => {
    if (pageNumber >= 1 && pageNumber <= applicantTotalPages) {
      setCurrentApplicantPage(pageNumber);
    }
  };

  // Export applicants to PDF
  const exportApplicantsToPDF = () => {
    if (filteredApplicants.length === 0) {
      alert('No applicants to export');
      return;
    }
    
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(18);
    doc.text(`Applicants for ${currentJobTitle}`, 105, 15, null, null, 'center');
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleDateString('en-GB')}`, 105, 22, null, null, 'center');
    
    // Table data
    const tableData = filteredApplicants.map((applicant, idx) => [
        idx + 1,
        applicant.name || 'N/A',
        applicant.email || 'N/A',
        applicant.phone || applicant.mobile || 'N/A',
        applicant.qualification || applicant.education || 'N/A',
        applicant.experience || applicant.exp || 'N/A',
        applicant.appliedAt || applicant.createdAt 
          ? formatDateTime(applicant.appliedAt || applicant.createdAt) 
          : 'N/A',
        applicant.status || 'Applied'
      ]);


    // AutoTable
    autoTable(doc, {
      startY: 25,
      head: [['#', 'Name', 'Email', 'Phone', 'Qualification', 'Experience', 'Applied On', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 8 },
      headStyles: { fillColor: [34, 197, 94] },
      alternateRowStyles: { fillColor: [243, 244, 246] },
    });

    doc.save(`applicants-${currentJobTitle}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  // Copy applicant details
  const copyApplicantDetails = (applicant) => {
    const details = `Name: ${applicant.name}\nEmail: ${applicant.email}\nPhone: ${applicant.phone || applicant.mobile || 'N/A'}\nQualification: ${applicant.qualification || 'N/A'}\nExperience: ${applicant.experience || 'N/A'}\nStatus: ${applicant.status || 'Applied'}`;
    navigator.clipboard.writeText(details);
    alert('Applicant details copied to clipboard!');
  };

  const handleViewDetails = (applicant) => {
    setSelectedApplicant(applicant);
  };

  const handleCloseDetails = () => {
    setSelectedApplicant(null);
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-2xl font-semibold text-blue-700">
                👥 Applicants for {currentJobTitle}
              </h3>
              <p className="text-gray-600 mt-1">
                Total {applicants.length} applicant(s) found
              </p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportApplicantsToPDF}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition-colors"
              >
                <Download size={16} /> Export PDF
              </button>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-red-600 p-2"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Loading State */}
          {loadingApplicants ? (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading applicants...</p>
            </div>
          ) : applicants.length === 0 ? (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No applicants found for this job</p>
            </div>
          ) : (
            <>
              {/* Applicant Filters */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6 p-4 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    placeholder="Filter by name"
                    value={applicantFilter.name}
                    onChange={handleApplicantFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input
                    type="text"
                    name="email"
                    placeholder="Filter by email"
                    value={applicantFilter.email}
                    onChange={handleApplicantFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    placeholder="Filter by phone"
                    value={applicantFilter.phone}
                    onChange={handleApplicantFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select
                    name="status"
                    value={applicantFilter.status}
                    onChange={handleApplicantFilterChange}
                    className="w-full border border-gray-300 px-3 py-2 rounded text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Statuses</option>
                    <option value="Applied">Applied</option>
                    <option value="Selected">Selected</option>
                    <option value="Rejected">Rejected</option>
                  </select>
                </div>
                <div className="flex items-end">
                  <button
                    onClick={clearApplicantFilters}
                    className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm flex items-center justify-center gap-1 transition-colors"
                  >
                    <XCircle size={16} /> Clear Filters
                  </button>
                </div>
              </div>

              {/* Applicants Table */}
              <div className="overflow-x-auto rounded-lg shadow">
                <table className="min-w-full bg-white">
                  <thead className="bg-green-600 text-white">
                    <tr>
                      <th className="px-4 py-3 text-left">#</th>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Email</th>
                      <th className="px-4 py-3 text-left hidden md:table-cell">Phone</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Qualification</th>
                      <th className="px-4 py-3 text-left hidden lg:table-cell">Experience</th>
                      <th className="px-4 py-3 text-left">Applied On</th>
                      <th className="px-4 py-3 text-left">Status</th>
                      <th className="px-4 py-3 text-left">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentApplicants.map((applicant, index) => (
                      <tr key={applicant.applicationId || index} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{applicantIndexFirst + index + 1}</td>
                        <td className="px-4 py-3 font-medium">{applicant.name}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <Mail size={14} className="text-gray-500" />
                            {applicant.email}
                          </div>
                        </td>
                        <td className="px-4 py-3 hidden md:table-cell">{applicant.phone || applicant.mobile || 'N/A'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">{applicant.qualification || 'N/A'}</td>
                        <td className="px-4 py-3 hidden lg:table-cell">{applicant.experience || 'N/A'}</td>
                        <td className="px-4 py-3">
                          {applicant.appliedAt ? formatDateTime(applicant.appliedAt) : 'N/A'}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            applicant.status === 'Selected' ? 'bg-green-100 text-green-800' :
                            applicant.status === 'Rejected' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {applicant.status || 'Applied'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2">
                            <button
                              onClick={() => copyApplicantDetails(applicant)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-800"
                              title="Copy applicant details"
                            >
                              <Copy size={16} />
                            </button>
                            <button
                              onClick={() => handleViewDetails(applicant)}
                              className="flex items-center gap-1 text-purple-600 hover:text-purple-800"
                              title="View applicant details"
                            >
                              <Eye size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Applicant Pagination */}
              {applicantTotalPages > 1 && (
                <div className="flex justify-between items-center mt-6">
                  <div className="text-sm text-gray-600">
                    Showing {applicantIndexFirst + 1} to {Math.min(applicantIndexLast, filteredApplicants.length)} of {filteredApplicants.length} applicants
                  </div>
                  <div className="flex space-x-1">
                    <button
                      onClick={() => paginateApplicants(currentApplicantPage - 1)}
                      disabled={currentApplicantPage === 1}
                      className={`px-3 py-1 border rounded flex items-center ${
                        currentApplicantPage === 1 
                          ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                          : 'bg-white text-blue-600 hover:bg-blue-50'
                      }`}
                    >
                      <ChevronLeft size={16} /> Previous
                    </button>
                    
                    {Array.from({ length: applicantTotalPages }, (_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => paginateApplicants(idx + 1)}
                        className={`px-3 py-1 border rounded ${
                          currentApplicantPage === idx + 1 
                            ? 'bg-blue-600 text-white' 
                            : 'bg-white text-blue-600 hover:bg-blue-50'
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginateApplicants(currentApplicantPage + 1)}
                      disabled={currentApplicantPage === applicantTotalPages}
                      className={`px-3 py-1 border rounded flex items-center ${
                        currentApplicantPage === applicantTotalPages 
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
        </div>
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <ApplicantsViewDetails
          applicant={selectedApplicant}
          onClose={handleCloseDetails}
          formatDateTime={formatDateTime}
        />
      )}
    </>
  );
};

export default ApplicantModal;