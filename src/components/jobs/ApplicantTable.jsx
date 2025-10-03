import React from 'react';
import { Download, Eye, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import Pagination from './Pagination';

const ApplicantTable = ({ 
  applicants, 
  jobTitle, 
  loadingApplicants, 
  applicantFilter, 
  handleApplicantFilterChange, 
  clearApplicantFilters,
  filteredApplicants,
  currentApplicantPage,
  applicantTotalPages,
  setCurrentApplicantPage,
  exportApplicantsToPDF,
  setViewApplicant,
  copyApplicantDetails,
  formatDate
}) => (
  <div className="bg-white rounded-xl p-6 w-full max-w-6xl max-h-[90vh] overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-2xl font-semibold text-blue-700">
        👥 Applicants for {jobTitle}
      </h3>
      <div className="flex gap-2">
        <button
          onClick={exportApplicantsToPDF}
          className="flex items-center gap-1 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 text-sm"
        >
          <Download size={16} /> Export
        </button>
        <button 
          onClick={closeApplicantsView}
          className="text-gray-500 hover:text-red-600"
        >
          <X size={24} />
        </button>
      </div>
    </div>
    
    <ApplicantFilters 
      applicantFilter={applicantFilter}
      handleApplicantFilterChange={handleApplicantFilterChange}
      clearApplicantFilters={clearApplicantFilters}
    />
    
    <div className="overflow-x-auto">
      <table className="min-w-full">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Email</th>
            <th className="px-4 py-2 text-left">Mobile</th>
            <th className="px-4 py-2 text-left">Applied On</th>
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {loadingApplicants ? (
            <LoadingRow colSpan={6} />
          ) : currentApplicants.length > 0 ? (
            currentApplicants.map((applicant, index) => (
              <ApplicantRow 
                key={index}
                applicant={applicant}
                index={index}
                setViewApplicant={setViewApplicant}
                copyApplicantDetails={copyApplicantDetails}
                formatDate={formatDate}
              />
            ))
          ) : (
            <EmptyRow colSpan={6} message="No applicants found" />
          )}
        </tbody>
      </table>
    </div>

    <Pagination
      currentPage={currentApplicantPage}
      totalPages={applicantTotalPages}
      onPageChange={setCurrentApplicantPage}
      resultsCount={filteredApplicants.length}
      resultsPerPage={applicantsPerPage}
    />
  </div>
);

const ApplicantFilters = ({ 
  applicantFilter, 
  handleApplicantFilterChange, 
  clearApplicantFilters 
}) => (
  <div className="grid grid-cols-1 md:grid-cols-5 gap-3 mb-4">
    <FilterInput 
      label="Name"
      name="name"
      value={applicantFilter.name}
      onChange={handleApplicantFilterChange}
      placeholder="Filter by name"
    />
    <FilterInput 
      label="Email"
      name="email"
      value={applicantFilter.email}
      onChange={handleApplicantFilterChange}
      placeholder="Filter by email"
    />
    <FilterInput 
      label="Mobile"
      name="mobile"
      value={applicantFilter.mobile}
      onChange={handleApplicantFilterChange}
      placeholder="Filter by mobile"
    />
    <StatusFilter 
      value={applicantFilter.status}
      onChange={handleApplicantFilterChange}
    />
    <div className="flex items-end">
      <button
        onClick={clearApplicantFilters}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 px-3 py-2 rounded text-sm flex items-center justify-center gap-1"
      >
        <XCircle size={14} /> Clear Filters
      </button>
    </div>
  </div>
);

const FilterInput = ({ label, name, value, onChange, placeholder }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
    <input
      type="text"
      name={name}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded text-sm"
    />
  </div>
);

const StatusFilter = ({ value, onChange }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
    <select
      name="status"
      value={value}
      onChange={onChange}
      className="w-full border px-3 py-2 rounded text-sm"
    >
      <option value="">All Statuses</option>
      <option value="Applied">Applied</option>
      <option value="Reviewed">Reviewed</option>
      <option value="Interviewed">Interviewed</option>
      <option value="Selected">Selected</option>
      <option value="Rejected">Rejected</option>
    </select>
  </div>
);

const ApplicantRow = ({ applicant, index, setViewApplicant, copyApplicantDetails, formatDate }) => (
  <tr className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50 hover:bg-blue-50'}>
    <td className="px-4 py-2 border-b">{applicant.name}</td>
    <td className="px-4 py-2 border-b">{applicant.email}</td>
    <td className="px-4 py-2 border-b">{applicant.mobile}</td>
    <td className="px-4 py-2 border-b">{formatDate(applicant.appliedAt)}</td>
    <td className="px-4 py-2 border-b">
      <StatusBadge status={applicant.status} />
    </td>
    <td className="px-4 py-2 border-b">
      <button
        onClick={() => setViewApplicant(applicant)}
        className="text-blue-600 hover:text-blue-800 mr-2"
        title="View details"
      >
        <Eye size={16} />
      </button>
      <button
        onClick={() => copyApplicantDetails(applicant)}
        className="text-gray-600 hover:text-gray-800"
        title="Copy details"
      >
        <Copy size={16} />
      </button>
    </td>
  </tr>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs ${
    status === 'Selected' 
      ? 'bg-green-100 text-green-800' 
      : status === 'Rejected' 
        ? 'bg-red-100 text-red-800' 
        : 'bg-yellow-100 text-yellow-800'
  }`}>
    {status || 'Applied'}
  </span>
);

const LoadingRow = ({ colSpan }) => (
  <tr>
    <td colSpan={colSpan} className="text-center py-4">
      <div className="flex justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    </td>
  </tr>
);

const EmptyRow = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="text-center py-4 text-gray-500">
      {message}
    </td>
  </tr>
);

export default ApplicantTable;