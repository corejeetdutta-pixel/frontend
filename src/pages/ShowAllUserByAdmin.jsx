// src/pages/ShowAllUserByAdmin.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminAuthService from '../api/AdminAuthService';

const ShowAllUserByAdmin = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const fetchAllUsers = async () => {
    try {
      const response = await AdminAuthService.getAllUsers();
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users');
      console.error('Error fetching users:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await AdminAuthService.deleteUser(userId);
        // Remove the user from the local state
        setUsers(users.filter(user => user.id !== userId));
        alert('User deleted successfully');
      } catch (err) {
        setError('Failed to delete user');
        console.error('Error deleting user:', err);
      }
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  if (loading) return <div className="flex justify-center items-center h-64">Loading users...</div>;
  if (error) return <div className="text-red-500 text-center mt-4">{error}</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Users</h1>
      
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full table-auto">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Mobile
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
            {users.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.userId}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {user.mobile || 'N/A'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.emailVerified
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {user.emailVerified ? 'Verified' : 'Pending'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                  <button 
                    onClick={() => handleViewUser(user)}
                    className="text-indigo-600 hover:text-indigo-900 mr-3"
                  >
                    View
                  </button>
                  <button 
                    onClick={() => handleDeleteUser(user.id)}
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

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">User Details</h2>
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
                  <h3 className="font-semibold text-gray-700">Basic Information</h3>
                  <p><span className="font-medium">Name:</span> {selectedUser.name}</p>
                  <p><span className="font-medium">Email:</span> {selectedUser.email}</p>
                  <p><span className="font-medium">Mobile:</span> {selectedUser.mobile || 'N/A'}</p>
                  <p><span className="font-medium">Gender:</span> {selectedUser.gender || 'N/A'}</p>
                  <p><span className="font-medium">Date of Birth:</span> {selectedUser.dob || 'N/A'}</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-gray-700">Professional Information</h3>
                  <p><span className="font-medium">Qualification:</span> {selectedUser.qualification || 'N/A'}</p>
                  <p><span className="font-medium">Passout Year:</span> {selectedUser.passoutYear || 'N/A'}</p>
                  <p><span className="font-medium">Experience:</span> {selectedUser.experience || 'N/A'}</p>
                  <p><span className="font-medium">Skills:</span> {selectedUser.skills || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700">Contact Information</h3>
                  <p><span className="font-medium">Address:</span> {selectedUser.address || 'N/A'}</p>
                  <p><span className="font-medium">LinkedIn:</span> {selectedUser.linkedin || 'N/A'}</p>
                  <p><span className="font-medium">GitHub:</span> {selectedUser.github || 'N/A'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <h3 className="font-semibold text-gray-700">Account Status</h3>
                  <p>
                    <span className="font-medium">Email Verified:</span> 
                    <span className={selectedUser.emailVerified ? "text-green-600 ml-2" : "text-yellow-600 ml-2"}>
                      {selectedUser.emailVerified ? 'Yes' : 'No'}
                    </span>
                  </p>
                  <p><span className="font-medium">Registration Date:</span> {selectedUser.createdAt || 'N/A'}</p>
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

export default ShowAllUserByAdmin;