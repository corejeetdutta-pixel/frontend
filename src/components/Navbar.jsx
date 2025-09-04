// src/components/Navbar.jsx
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ChevronDown, Bell, BellOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ProfilePanel from '../components/ProfilePanel';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import AuthServices from '../api/AuthServices';
import AdminAuthService from '../api/AdminAuthService';
import { useNotifications } from '../contexts/NotificationContext';

const Navbar = ({ user, setUser, employee, setEmployee, admin, setAdmin }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  
  // Get notifications from context
  const { notifications, unreadCount, markAllAsRead } = useNotifications();

  const handleLogout = async () => {
    try {
      if (user) {
        await AuthServices.logoutUser();
        setUser(null);
        navigate('/login');
      } else if (employee) {
        await EmployeeAuthServices.logoutEmployee();
        setEmployee(null);
        navigate('/employee/employee-login');
      } else if (admin) {
        await AdminAuthService.logoutAdmin();
        setAdmin(null);
        navigate('/admin/admin-login');
      }
    } catch (err) {
      alert('Logout failed');
    }
  };

  const currentUser = user || employee || admin;
  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-700 to-blue-900 text-white shadow-md w-full">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Left: Logo */}
          <div className="text-2xl font-bold">
            Recruitment<span className="text-green-300">_E2E</span>
          </div>

          {/* Center: Main nav links (dashboard, job list, etc.) */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium mx-auto">
            {user && (
              <>
                <Link to="/home" className="hover:text-green-200">Dashboard</Link>
                <button onClick={() => setShowProfile(true)} className="hover:text-green-200">Profile</button>
                <Link to="/job-list" className="hover:text-green-200">Job List</Link>
                <Link to="/my-applications" className="hover:text-green-200">My Applications</Link>
              </>
            )}
            {employee && (
              <>
                <Link to="/employee/home" className="hover:text-green-200">Home</Link>
                <Link to="/employee/add-job" className="hover:text-green-200">Add Job</Link>
                <Link to="/employee/jd-generator" className="hover:text-green-200">JD Generator</Link>
                <Link to="/employee/dashboard" className="hover:text-green-200">Dashboard</Link>
              </>
            )}
            {admin && (
              <>
                <Link to="/admin/home" className="hover:text-green-200">Home</Link>
                <Link to="/admin/users" className="hover:text-green-200">Job Seeker</Link>
                <Link to="/admin/employees" className="hover:text-green-200">Employer</Link>
                <Link to="/admin/stats" className="hover:text-green-200">Statistics</Link>
                <Link to="/admin/settings" className="hover:text-green-200">Settings</Link>
              </>
            )}
          </nav>

          {/* Right: Employer/Job Seeker/Admin + Name + Logout */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {!currentUser && (
              <>
                <Dropdown title="Admin" color="text-purple-800" links={[
                  { to: "/admin/admin-login", label: "Login" },
                  { to: "/admin/admin-register", label: "Signup" }
                ]} />
                <Dropdown title="Employer" color="text-blue-800" links={[
                  { to: "/employee/employee-login", label: "Login" },
                  { to: "/employee/employee-register", label: "Signup" }
                ]} />
                <Dropdown title="Job Seeker" color="text-green-800" links={[
                  { to: "/login", label: "Login" },
                  { to: "/register", label: "Signup" }
                ]} />
              </>
            )}
            {currentUser && (
              <>
                {/* Notification icon for admin */}
                {admin && (
                  <div className="relative">
                    <button
                      onClick={() => {
                        setShowNotifications(!showNotifications);
                        if (!showNotifications && unreadCount > 0) {
                          markAllAsRead();
                        }
                      }}
                      className="p-2 rounded-full hover:bg-blue-600 relative"
                    >
                      {unreadCount > 0 ? (
                        <>
                          <Bell className="text-white" size={24} />
                          <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                            {unreadCount}
                          </span>
                        </>
                      ) : (
                        <BellOff className="text-white" size={24} />
                      )}
                    </button>

                    {/* Notification dropdown */}
                    {showNotifications && (
                      <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg overflow-hidden z-50">
                        <div className="py-2 px-4 bg-blue-700 text-white font-semibold flex justify-between items-center">
                          <span>Notifications</span>
                          {notifications.length > 0 && (
                            <button 
                              onClick={() => {
                                // Clear all notifications logic would go here
                                console.log("Clear all notifications");
                              }}
                              className="text-xs hover:underline"
                            >
                              Clear All
                            </button>
                          )}
                        </div>
                        <div className="max-h-60 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-2 text-gray-500">No notifications</div>
                          ) : (
                            notifications.map(notification => (
                              <div
                                key={notification.id}
                                className={`border-b border-gray-200 px-4 py-2 ${notification.read ? 'bg-white' : 'bg-blue-50'}`}
                              >
                                <p className="text-sm text-gray-800">{notification.message}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(notification.timestamp).toLocaleString()}
                                </p>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <span className="font-semibold">Hi, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-blue-700 font-semibold px-4 py-1.5 rounded-md hover:bg-blue-100 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={toggleMenu}
            className="md:hidden text-white focus:outline-none"
          >
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-blue-800 px-4 pb-4 space-y-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {!currentUser && (
                <>
                  <MobileLink to="/employee/employee-login" setMenuOpen={setMenuOpen}>Employer Login</MobileLink>
                  <MobileLink to="/employee/employee-register" setMenuOpen={setMenuOpen}>Employer Signup</MobileLink>
                  <MobileLink to="/login" setMenuOpen={setMenuOpen}>Job Seeker Login</MobileLink>
                  <MobileLink to="/register" setMenuOpen={setMenuOpen}>Job Seeker Signup</MobileLink>
                  <MobileLink to="/admin/admin-login" setMenuOpen={setMenuOpen}>Admin Login</MobileLink>
                  <MobileLink to="/admin/admin-register" setMenuOpen={setMenuOpen}>Admin Signup</MobileLink>
                </>
              )}
              {user && (
                <>
                  <MobileLink to="/home" setMenuOpen={setMenuOpen}>Dashboard</MobileLink>
                  <MobileLink to="/job-list" setMenuOpen={setMenuOpen}>Job List</MobileLink>
                  <MobileLink to="/my-applications" setMenuOpen={setMenuOpen}>My Applications</MobileLink>
                  <button onClick={() => { setShowProfile(true); setMenuOpen(false); }} className="text-white w-full text-left py-1 border-b border-blue-600">Profile</button>
                  <button onClick={handleLogout} className="text-white w-full text-left py-1">Logout</button>
                </>
              )}
              {employee && (
                <>
                  <MobileLink to="/employee/home" setMenuOpen={setMenuOpen}>Home</MobileLink>
                  <MobileLink to="/employee/add-job" setMenuOpen={setMenuOpen}>Add Job</MobileLink>
                  <MobileLink to="/employee/jd-generator" setMenuOpen={setMenuOpen}>JD Generator</MobileLink>
                  <MobileLink to="/employee/dashboard" setMenuOpen={setMenuOpen}>Dashboard</MobileLink>
                  <button onClick={handleLogout} className="text-white w-full text-left py-1">Logout</button>
                </>
              )}
              {admin && (
                <>
                  <MobileLink to="/admin/home" setMenuOpen={setMenuOpen}>Home</MobileLink>
                  <MobileLink to="/admin/users" setMenuOpen={setMenuOpen}>Job Seeker</MobileLink>
                  <MobileLink to="/admin/employees" setMenuOpen={setMenuOpen}>Employer</MobileLink>
                  <MobileLink to="/admin/stats" setMenuOpen={setMenuOpen}>Statistics</MobileLink>
                  <MobileLink to="/admin/settings" setMenuOpen={setMenuOpen}>Settings</MobileLink>
                  <button 
                    onClick={() => {
                      setShowNotifications(true);
                      setMenuOpen(false);
                      if (unreadCount > 0) {
                        markAllAsRead();
                      }
                    }}
                    className="text-white w-full text-left py-1 border-b border-blue-600 flex items-center"
                  >
                    Notifications
                    {unreadCount > 0 && (
                      <span className="ml-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  <button onClick={handleLogout} className="text-white w-full text-left py-1">Logout</button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Profile Modal */}
      {showProfile && (
        <ProfilePanel
          user={currentUser}
          onClose={() => setShowProfile(false)}
          onLogout={handleLogout}
        />
      )}
    </>
  );
};

// Dropdown Component
const Dropdown = ({ title, color, links }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-green-200 transition">
      {title} <ChevronDown size={16} />
    </button>
    <div className={`absolute left-0 mt-2 w-40 bg-white ${color} rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible group-hover:pointer-events-auto transition-all duration-200 z-20`}>
      {links.map(({ to, label }) => (
        <Link 
          key={to} 
          to={to} 
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors"
        >
          {label}
        </Link>
      ))}
    </div>
  </div>
);

// Mobile Link
const MobileLink = ({ to, children, setMenuOpen }) => (
  <Link 
    to={to} 
    className="block text-white text-sm py-1 border-b border-blue-600 hover:bg-blue-700 px-2 rounded transition-colors"
    onClick={() => setMenuOpen(false)}
  >
    {children}
  </Link>
);

export default Navbar;