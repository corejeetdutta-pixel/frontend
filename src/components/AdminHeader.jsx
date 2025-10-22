// src/components/AdminHeader.jsx
import React from 'react';
import { LogOut } from 'lucide-react';

const AdminHeader = ({ admin, handleLogout }) => {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <div className="flex items-center space-x-4">
          <span className="text-gray-700">Welcome, {admin?.name || admin?.email}</span>
          <button
            onClick={handleLogout}
            className="flex items-center text-gray-500 hover:text-gray-700"
          >
            <LogOut size={20} className="mr-1" />
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;