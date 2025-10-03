// src/pages/ShowAllEmployeeByAdmin.jsx
import { useState, useEffect } from 'react';
import AdminAuthService from '../api/AdminAuthService';

const ShowAllEmployeeByAdmin = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchAllEmployees();
  }, []);

  const fetchAllEmployees = async () => {
    try {
      const response = await AdminAuthService.getAllEmployees();
      setEmployees(response.data);
    } catch (err) {
      setError('Failed to fetch employees');
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewEmployee = (employee) => {
    setSelectedEmployee(employee);
    setShowModal(true);
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to delete this employer?')) {
      try {
        await AdminAuthService.deleteEmployee(employeeId);
        // Remove the employee from the local state
        setEmployees(employees.filter(employee => employee.id !== employeeId));
        alert('Employer deleted successfully');
      } catch (err) {
        setError('Failed to delete employer');
        console.error('Error deleting employer:', err);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedEmployee(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading employers...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Employers</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Company Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Contact
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {employee.companyName || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {employee.mobile || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      employee.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {employee.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewEmployee(employee)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDeleteEmployee(employee.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Employee Details Modal */}
      {showModal && selectedEmployee && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">Employer Details</h2>
                <button 
                  onClick={closeModal}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-gray-700">Company Information</h3>
                  <p><span className="font-medium">Company Name:</span> {selectedEmployee.companyName || 'N/A'}</p>
                  <p><span className="font-medium">Email:</span> {selectedEmployee.email}</p>
                  <p><span className="font-medium">Contact:</span> {selectedEmployee.mobile || 'N/A'}</p>
                  <p><span className="font-medium">Industry:</span> {selectedEmployee.industry || 'N/A'}</p>
                  <p><span className="font-medium">Company Size:</span> {selectedEmployee.companySize || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Contact Person</h3>
                  <p><span className="font-medium">Name:</span> {selectedEmployee.name || 'N/A'}</p>
                  <p><span className="font-medium">Position:</span> {selectedEmployee.position || 'N/A'}</p>
                  <p><span className="font-medium">Website:</span> {selectedEmployee.website || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700">Address</h3>
                  <p>{selectedEmployee.address || 'N/A'}</p>
                  <p>{selectedEmployee.city || ''} {selectedEmployee.state || ''} {selectedEmployee.country || ''} {selectedEmployee.pincode || ''}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700">Account Status</h3>
                  <p>
                    <span className="font-medium">Status:</span> 
                    <span className={selectedEmployee.isActive ? "text-green-600 ml-2" : "text-red-600 ml-2"}>
                      {selectedEmployee.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                  <p><span className="font-medium">Registration Date:</span> {selectedEmployee.createdAt || 'N/A'}</p>
                </div>
              </div>
              
              <div className="mt-6 flex justify-end">
                <button
                  onClick={closeModal}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShowAllEmployeeByAdmin;