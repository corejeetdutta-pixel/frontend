// Dashboard.jsx
import { useEffect, useState, forwardRef, useImperativeHandle } from 'react';
import { useNavigate } from 'react-router-dom'; // Add this import
import axios from '../api/axiosInstance';
import {
  Briefcase,
  Users,
  CheckCircle,
  Calendar,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  FileText,
  Mail
} from 'lucide-react';

const Dashboard = forwardRef((props, ref) => {
  const navigate = useNavigate(); // Add this hook
  const [stats, setStats] = useState({
    jobsPosted: 0,
    applications: 0,
    hired: 0,
    interviews: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const empId = props.empId;
      if (!empId) {
        throw new Error('Employee ID not available');
      }
      
      const res = await axios.get(`/api/dashboard/stats/${empId}`);
      setStats(res.data);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Error fetching dashboard stats', err);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useImperativeHandle(ref, () => ({
    refetchStats: fetchStats,
  }));

  useEffect(() => {
    if (props.empId) {
      fetchStats();
      
      // Refresh data every 5 minutes
      const interval = setInterval(fetchStats, 300000);
      return () => clearInterval(interval);
    }
  }, [props.empId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
            <div className="animate-pulse bg-gray-200 h-10 w-32 rounded-md"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl shadow-lg p-6 border border-gray-100 animate-pulse">
                <div className="h-10 w-10 rounded-full bg-gray-200 mb-4"></div>
                <div className="h-8 w-3/4 bg-gray-200 rounded mb-2"></div>
                <div className="h-6 w-1/2 bg-gray-200 rounded"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
          </div>
          
          <div className="bg-red-50 border-l-4 border-red-500 p-6 rounded-lg shadow-md">
            <div className="flex items-start">
              <AlertCircle className="h-8 w-8 text-red-500 mr-4 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-red-800">Error Loading Data</h3>
                <p className="text-red-700 mt-2">{error}</p>
                <button
                  onClick={fetchStats}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none"
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Employer Dashboard</h1>
            <p className="text-gray-600 mt-2">
              Overview of your recruitment activities and performance
              {lastUpdated && (
                <span className="text-sm text-gray-500 ml-2">
                  (Updated: {lastUpdated.toLocaleTimeString()})
                </span>
              )}
            </p>
          </div>
          <button
            onClick={fetchStats}
            className="flex items-center px-4 py-2 bg-white text-blue-600 rounded-lg shadow hover:shadow-md transition-shadow border border-blue-100"
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Jobs Posted"
            value={stats.jobsPosted}
            icon={<Briefcase className="h-6 w-6" />}
            color="blue"
            trend={{ value: 12, isPositive: true }}
          />
          <StatCard
            title="Applications"
            value={stats.applications}
            icon={<FileText className="h-6 w-6" />}
            color="purple"
            trend={{ value: 8, isPositive: true }}
          />
          <StatCard
            title="Interviews"
            value={stats.interviews}
            icon={<Calendar className="h-6 w-6" />}
            color="green"
            trend={{ value: 5, isPositive: true }}
          />
          <StatCard
            title="Hired"
            value={stats.hired}
            icon={<CheckCircle className="h-6 w-6" />}
            color="amber"
            trend={{ value: 3, isPositive: true }}
          />
        </div>

        {/* Additional Info Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Recent Activity</h2>
            <div className="space-y-4">
              <ActivityItem
                icon={<Users className="h-5 w-5 text-blue-500" />}
                title="New applications received"
                description="5 new candidates applied to your job postings"
                time="2 hours ago"
              />
              <ActivityItem
                icon={<Mail className="h-5 w-5 text-green-500" />}
                title="Interview invitations sent"
                description="Sent interview invites to 3 qualified candidates"
                time="Yesterday"
              />
              <ActivityItem
                icon={<CheckCircle className="h-5 w-5 text-amber-500" />}
                title="New hire"
                description="You hired a candidate for Senior Developer position"
                time="2 days ago"
              />
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <ActionButton
                title="Post New Job"
                description="Create a new job listing"
                icon={<Briefcase className="h-5 w-5" />}
                color="blue"
                onClick={() => navigate('/jd-generator')}
              />
              <ActionButton
                title="View Applications"
                description="Review candidate applications"
                icon={<FileText className="h-5 w-5" />}
                color="purple"
                onClick={() => navigate('/employee/home')} // Updated to use navigate
              />
              <ActionButton
                title="Schedule Interviews"
                description="Plan interview sessions"
                icon={<Calendar className="h-5 w-5" />}
                color="green"
                onClick={() => navigate('/employee/home')} // Updated to use navigate
              />
              <ActionButton
                title="Send Updates"
                description="Communicate with candidates"
                icon={<Mail className="h-5 w-5" />}
                color="amber"
                onClick={() => navigate('/employee/home')} // Updated to use navigate
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

const StatCard = ({ title, value, icon, color, trend }) => {
  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    purple: 'bg-purple-100 text-purple-600',
    green: 'bg-green-100 text-green-600',
    amber: 'bg-amber-100 text-amber-600',
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-3 rounded-full ${colorClasses[color]}`}>
          {icon}
        </div>
        {trend && (
          <div className={`flex items-center text-sm ${trend.isPositive ? 'text-green-600' : 'text-red-600'}`}>
            <TrendingUp className="h-4 w-4 mr-1" />
            {trend.value}%
          </div>
        )}
      </div>
      <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
      <p className="text-gray-600 mt-2">{title}</p>
    </div>
  );
};

const ActivityItem = ({ icon, title, description, time }) => (
  <div className="flex items-start">
    <div className="flex-shrink-0 mt-1">{icon}</div>
    <div className="ml-4">
      <h4 className="text-sm font-medium text-gray-800">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{description}</p>
      <p className="text-xs text-gray-500 mt-1">{time}</p>
    </div>
  </div>
);

const ActionButton = ({ title, description, icon, color, onClick }) => {
  const colorClasses = {
    blue: 'bg-blue-50 hover:bg-blue-100 text-blue-700',
    purple: 'bg-purple-50 hover:bg-purple-100 text-purple-700',
    green: 'bg-green-50 hover:bg-green-100 text-green-700',
    amber: 'bg-amber-50 hover:bg-amber-100 text-amber-700',
  };

  return (
    <button
      onClick={onClick}
      className={`p-4 rounded-lg text-left transition-colors duration-200 ${colorClasses[color]}`}
    >
      <div className="flex items-center mb-2">
        <div className="mr-2">{icon}</div>
        <span className="font-medium">{title}</span>
      </div>
      <p className="text-sm opacity-80">{description}</p>
    </button>
  );
};

export default Dashboard;