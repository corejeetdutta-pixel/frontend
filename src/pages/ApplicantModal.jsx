import { useState } from 'react';
import { 
  X, Download, ChevronLeft, ChevronRight, Copy, Eye, XCircle,
  User as UserIcon
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import ApplicantsViewDetails from './ApplicantsViewDetails';

const ApplicantModal = ({ 
  isOpen, 
  onClose, 
  applicants, 
  currentJobTitle, 
  currentJobId,
  loadingApplicants,
  formatDate,
  copyApplicantDetails,
  viewResume,
  openExternalLink
}) => {
  const [applicantFilter, setApplicantFilter] = useState({ 
    name: '', email: '', mobile: '', status: '' 
  });
  const [currentApplicantPage, setCurrentApplicantPage] = useState(1);
  const [viewApplicant, setViewApplicant] = useState(null);
  const applicantsPerPage = 5;

  if (!isOpen) return null;

  // Applicant filtering
  const handleApplicantFilterChange = (e) => {
    const { name, value } = e.target;
    setApplicantFilter(prev => ({ ...prev, [name]: value }));
    setCurrentApplicantPage(1);
  };

  const clearApplicantFilters = () => {
    setApplicantFilter({ name: '', email: '', mobile: '', status: '' });
    setCurrentApplicantPage(1);
  };

  // Add a safeguard to ensure applicants is always an array
  const filteredApplicants = (Array.isArray(applicants) ? applicants : []).filter(applicant => {
    return (
      applicant.name && applicant.name.toLowerCase().includes(applicantFilter.name.toLowerCase()) &&
      applicant.email && applicant.email.toLowerCase().includes(applicantFilter.email.toLowerCase()) &&
      applicant.mobile && applicant.mobile.toLowerCase().includes(applicantFilter.mobile.toLowerCase()) &&
      (applicantFilter.status === '' || applicant.status === applicantFilter.status)
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
      applicant.mobile || 'N/A',
      applicant.qualification || 'N/A',
      applicant.gender || 'N/A',
      applicant.score || 'N/A',
      applicant.status || 'Applied'
    ]);

    // AutoTable
    autoTable(doc, {
      startY: 25,
      head: [['#', 'Name', 'Email', 'Mobile', 'Qualification', 'Gender', 'Score', 'Status']],
      body: tableData,
      theme: 'grid',
      styles: { fontSize: 9 },
      headStyles: { fillColor: [79, 70, 229] },
      alternateRowStyles: { fillColor: [243, 244, 246] },
    });

    doc.save(`applicants-${currentJobTitle}-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      {/* Applicants Modal */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6 pb-4 border-b">
              <h3 className="text-2xl font-bold text-indigo-700 flex items-center">
                <UserIcon className="mr-2" size={24} />
                Applicants for {currentJobTitle}
              </h3>
              <div className="flex gap-3">
                <button
                  onClick={exportApplicantsToPDF}
                  className="flex items-center gap-1 bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Download size={18} /> Export PDF
                </button>
                <button 
                  onClick={onClose}
                  className="p-2 text-gray-500 hover:text-red-600 rounded-full hover:bg-gray-100 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>
            </div>
            
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
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Mobile</label>
                <input
                  type="text"
                  name="mobile"
                  placeholder="Filter by mobile"
                  value={applicantFilter.mobile}
                  onChange={handleApplicantFilterChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  name="status"
                  value={applicantFilter.status}
                  onChange={handleApplicantFilterChange}
                  className="w-full border border-gray-300 px-3 py-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="">All Statuses</option>
                  <option value="Applied">Applied</option>
                  <option value="Reviewed">Reviewed</option>
                  <option value="Interviewed">Interviewed</option>
                  <option value="Selected">Selected</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>
              <div className="flex items-end">
                <button
                  onClick={clearApplicantFilters}
                  className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded-lg text-sm flex items-center justify-center gap-1 transition-colors shadow-sm"
                >
                  <XCircle size={16} /> Clear Filters
                </button>
              </div>
            </div>
            
            <div className="overflow-x-auto rounded-lg border border-gray-200 shadow-sm">
              <table className="min-w-full bg-white">
                <thead className="bg-indigo-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Email</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Mobile</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Applied On</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loadingApplicants ? (
                    <tr>
                      <td colSpan="6" className="text-center py-8">
                        <div className="flex justify-center">
                          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
                        </div>
                      </td>
                    </tr>
                  ) : currentApplicants.length > 0 ? (
                    currentApplicants.map((applicant, index) => (
                      <tr 
                        key={index} 
                        className={`border-b ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-indigo-50 transition-colors`}
                      >
                        <td className="px-4 py-3 font-medium">{applicant.name || 'N/A'}</td>
                        <td className="px-4 py-3 text-indigo-600">{applicant.email || 'N/A'}</td>
                        <td className="px-4 py-3">{applicant.mobile || 'N/A'}</td>
                        <td className="px-4 py-3 text-gray-600">{applicant.appliedAt ? formatDate(applicant.appliedAt) : 'N/A'}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            applicant.status === 'Selected' 
                              ? 'bg-green-100 text-green-800' 
                              : applicant.status === 'Rejected' 
                                ? 'bg-red-100 text-red-800' 
                                : 'bg-amber-100 text-amber-800'
                          }`}>
                            {applicant.status || 'Applied'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setViewApplicant(applicant)}
                              className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 bg-indigo-50 px-3 py-1 rounded-lg transition-colors"
                              title="View details"
                            >
                              <Eye size={16} /> View
                            </button>
                            <button
                              onClick={() => copyApplicantDetails(applicant)}
                              className="flex items-center gap-1 text-gray-600 hover:text-gray-800 bg-gray-100 px-3 py-1 rounded-lg transition-colors"
                              title="Copy details"
                            >
                              <Copy size={16} /> Copy
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-6 text-gray-500">
                        No applicants found matching your criteria
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Applicant Pagination */}
            {applicantTotalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-between items-center mt-6 gap-4">
                <div className="text-sm text-gray-600">
                  Showing {applicantIndexFirst + 1} to {Math.min(applicantIndexLast, filteredApplicants.length)} 
                  {' '}of {filteredApplicants.length} applicants
                </div>
                <div className="flex space-x-1">
                  <button
                    onClick={() => paginateApplicants(currentApplicantPage - 1)}
                    disabled={currentApplicantPage === 1}
                    className={`px-4 py-2 border rounded-lg flex items-center ${
                      currentApplicantPage === 1 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-300'
                    }`}
                  >
                    <ChevronLeft size={18} /> Prev
                  </button>
                  
                  <div className="flex">
                    {Array.from({ length: applicantTotalPages }, (_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => paginateApplicants(idx + 1)}
                        className={`px-4 py-2 border ${
                          currentApplicantPage === idx + 1 
                            ? 'bg-indigo-600 text-white border-indigo-700' 
                            : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-300'
                        } ${idx === 0 ? 'rounded-l-lg' : ''} ${idx === applicantTotalPages - 1 ? 'rounded-r-lg' : ''}`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  
                  <button
                    onClick={() => paginateApplicants(currentApplicantPage + 1)}
                    disabled={currentApplicantPage === applicantTotalPages}
                    className={`px-4 py-2 border rounded-lg flex items-center ${
                      currentApplicantPage === applicantTotalPages 
                        ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                        : 'bg-white text-indigo-600 hover:bg-indigo-50 border-indigo-300'
                    }`}
                  >
                    Next <ChevronRight size={18} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Applicant Details Modal */}
      {viewApplicant && (
        <ApplicantsViewDetails
          viewApplicant={viewApplicant}
          setViewApplicant={setViewApplicant}
          formatDate={formatDate}
          copyApplicantDetails={copyApplicantDetails}
          viewResume={viewResume}
          openExternalLink={openExternalLink}
        />
      )}
    </>
  );
};

export default ApplicantModal;