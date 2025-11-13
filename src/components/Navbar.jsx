import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import ProfilePanel from "./ProfilePanel";
import EmployeeAuthServices from "../api/EmployeeAuthServices";
import AuthServices from "../api/AuthServices";
import AdminAuthService from "../api/AdminAuthService";

const Navbar = ({ user, setUser, employee, setEmployee, admin, setAdmin }) => {
  const navigate = useNavigate();
  const [showProfile, setShowProfile] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const currentUser = user || employee || admin;

  const handleLogout = async () => {
    try {
      if (user) {
        await AuthServices.logoutUser();
        setUser(null);
        navigate("/login");
      } else if (employee) {
        await EmployeeAuthServices.logoutEmployee();
        setEmployee(null);
        navigate("/employee/employee-login");
      } else if (admin) {
        await AdminAuthService.logoutAdmin();
        setAdmin(null);
        navigate("/admin/admin-login");
      }
    } catch {
      alert("Logout failed");
    }
  };

  const toggleMenu = () => setMenuOpen((prev) => !prev);

  const menuVariants = {
    hidden: { opacity: 0, y: -10 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  };

  return (
    <>
      <header className="bg-[#0260a4] text-white shadow w-full relative z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <div className="text-2xl font-bold tracking-wide">atract.in</div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
            {user && (
              <>
                <NavLink to="/home">Dashboard</NavLink>
                <button onClick={() => setShowProfile(true)}>Profile</button>
                <NavLink to="/job-list">Job List</NavLink>
                <NavLink to="/my-applications">My Applications</NavLink>
                <NavLink to="/resume-dashboard">Resume Builder</NavLink>

              </>
            )}
            {employee && (
              <>
                <NavLink to="/employee/home">Home</NavLink>
                <NavLink to="/add-job">Add Job</NavLink>
                <NavLink to="/jd-generator">JD Generator</NavLink>
                <NavLink to="/employee/dashboard">Dashboard</NavLink>
              </>
            )}
            {admin && (
              <>
                <NavLink to="/admin/home">Home</NavLink>
                <NavLink to="/admin/users">Job Seeker</NavLink>
                <NavLink to="/admin/employees">Employer</NavLink>
                <NavLink to="/admin/home">Statistics</NavLink>
                <NavLink to="/admin/home">Settings</NavLink>
              </>
            )}
          </nav>

          {/* Right side */}
          <div className="hidden md:flex items-center space-x-4 text-sm">
            {!currentUser ? (
              <>
                <Dropdown
                  title="Admin"
                  links={[
                    { to: "/admin/admin-login", label: "Login" },
                    { to: "/admin/admin-register", label: "Signup" },
                  ]}
                />
                <Dropdown
                  title="Employer"
                  links={[
                    { to: "/employee/employee-login", label: "Login" },
                    { to: "/employee/employee-register", label: "Signup" },
                  ]}
                />
                <Dropdown
                  title="Job Seeker"
                  links={[
                    { to: "/login", label: "Login" },
                    { to: "/register", label: "Signup" },
                  ]}
                />
              </>
            ) : (
              <>
                <span className="font-semibold">Hi, {currentUser?.name}</span>
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#0260a4] font-semibold px-4 py-1.5 rounded-md hover:bg-blue-50 transition"
                >
                  Logout
                </button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button onClick={toggleMenu} className="md:hidden">
            {menuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>

        {/* Mobile dropdown */}
        <AnimatePresence>
          {menuOpen && (
            <motion.div
              className="md:hidden bg-[#0260a4] px-4 pb-4 space-y-3"
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={menuVariants}
            >
              {/* Auth options */}
              {!currentUser && (
                <>
                  <MobileLink to="/employee/employee-login" onClick={() => setMenuOpen(false)}>
                    Employer Login
                  </MobileLink>
                  <MobileLink to="/employee/employee-register" onClick={() => setMenuOpen(false)}>
                    Employer Signup
                  </MobileLink>
                  <MobileLink to="/login" onClick={() => setMenuOpen(false)}>
                    Job Seeker Login
                  </MobileLink>
                  <MobileLink to="/register" onClick={() => setMenuOpen(false)}>
                    Job Seeker Signup
                  </MobileLink>
                  <MobileLink to="/admin/admin-login" onClick={() => setMenuOpen(false)}>
                    Admin Login
                  </MobileLink>
                  <MobileLink to="/admin/admin-register" onClick={() => setMenuOpen(false)}>
                    Admin Signup
                  </MobileLink>
                </>
              )}
              {/* Logged in sections remain the same but add onClick handlers */}
              {user && (
                <>
                  <MobileLink to="/home" onClick={() => setMenuOpen(false)}>Dashboard</MobileLink>
                  <MobileLink to="/job-list" onClick={() => setMenuOpen(false)}>Job List</MobileLink>
                  <MobileLink to="/my-applications" onClick={() => setMenuOpen(false)}>My Applications</MobileLink>
                  <MobileLink to="/resume-dashboard" onClick={() => setMenuOpen(false)}>Resume Builder</MobileLink>
                  <button
                    onClick={() => {
                      setShowProfile(true);
                      setMenuOpen(false);
                    }}
                    className="text-white w-full text-left py-1 border-b border-blue-600"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleLogout}
                    className="text-white w-full text-left py-1"
                  >
                    Logout
                  </button>
                </>
              )}
              {/* Similar for employee and admin */}
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Profile panel */}
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

// Fixed Dropdown Component
const Dropdown = ({ title, links }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className="relative group"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button className="flex items-center gap-1 hover:text-blue-200 transition px-2 py-1 rounded">
        {title} <ChevronDown size={16} />
      </button>
      
      <div 
        className={`absolute left-0 mt-2 w-40 bg-white rounded-md shadow-lg border border-gray-200 transition-all duration-200 z-50 ${
          isOpen 
            ? 'opacity-100 visible transform translate-y-0' 
            : 'opacity-0 invisible transform -translate-y-2'
        }`}
      >
        {links.map(({ to, label }) => (
          <Link
            key={to}
            to={to}
            className="block px-4 py-2 text-gray-800 hover:bg-blue-50 hover:text-blue-600 transition text-sm font-medium"
            onClick={() => setIsOpen(false)}
          >
            {label}
          </Link>
        ))}
      </div>
    </div>
  );
};

const NavLink = ({ to, children }) => (
  <Link to={to} className="hover:text-blue-200 transition">
    {children}
  </Link>
);

const MobileLink = ({ to, children, onClick }) => (
  <Link
    to={to}
    onClick={onClick}
    className="block text-white text-sm py-1 border-b border-blue-600 hover:bg-blue-700 px-2 rounded transition"
  >
    {children}
  </Link>
);

export default Navbar;