// src/components/StatsCards.jsx
import React from 'react';
import { Users, BarChart3, Settings } from 'lucide-react';

const StatsCards = ({ jobs, jobsByCompany }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-blue-100 text-blue-600">
            <Users size={24} />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">Total Jobs</h2>
            <p className="text-2xl font-bold">{jobs.length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-green-100 text-green-600">
            <BarChart3 size={24} />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">Companies</h2>
            <p className="text-2xl font-bold">{Object.keys(jobsByCompany).length}</p>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center">
          <div className="p-3 rounded-full bg-purple-100 text-purple-600">
            <Settings size={24} />
          </div>
          <div className="ml-4">
            <h2 className="text-lg font-semibold text-gray-900">Active Posts</h2>
            <p className="text-2xl font-bold">
              {jobs.filter(job => new Date(job.lastDate) > new Date()).length}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsCards;