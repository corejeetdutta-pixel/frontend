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
      <header className="bg-[#0260a4] text-white shadow w-full">
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
                  <MobileLink to="/employee/employee-login">Employer Login</MobileLink>
                  <MobileLink to="/employee/employee-register">Employer Signup</MobileLink>
                  <MobileLink to="/login">Job Seeker Login</MobileLink>
                  <MobileLink to="/register">Job Seeker Signup</MobileLink>
                  <MobileLink to="/admin/admin-login">Admin Login</MobileLink>
                  <MobileLink to="/admin/admin-register">Admin Signup</MobileLink>
                </>
              )}
              {/* Logged in */}
              {user && (
                <>
                  <MobileLink to="/home">Dashboard</MobileLink>
                  <MobileLink to="/job-list">Job List</MobileLink>
                  <MobileLink to="/my-applications">My Applications</MobileLink>
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
              {employee && (
                <>
                  <MobileLink to="/employee/home">Home</MobileLink>
                  <MobileLink to="/add-job">Add Job</MobileLink>
                  <MobileLink to="/jd-generator">JD Generator</MobileLink>
                  <MobileLink to="/employee/dashboard">Dashboard</MobileLink>
                  <button
                    onClick={handleLogout}
                    className="text-white w-full text-left py-1"
                  >
                    Logout
                  </button>
                </>
              )}
              {admin && (
                <>
                  <MobileLink to="/admin/home">Home</MobileLink>
                  <MobileLink to="/admin/users">Job Seeker</MobileLink>
                  <MobileLink to="/admin/employees">Employer</MobileLink>
                  <MobileLink to="/admin/home">Statistics</MobileLink>
                  <MobileLink to="/admin/home">Settings</MobileLink>
                  <button
                    onClick={handleLogout}
                    className="text-white w-full text-left py-1"
                  >
                    Logout
                  </button>
                </>
              )}
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

// Sub-components
const NavLink = ({ to, children }) => (
  <Link to={to} className="hover:text-blue-200 transition">
    {children}
  </Link>
);

const Dropdown = ({ title, links }) => (
  <div className="relative group">
    <button className="flex items-center gap-1 hover:text-blue-200 transition">
      {title} <ChevronDown size={16} />
    </button>
    <div className="absolute left-0 mt-2 w-40 bg-white rounded-md shadow-md opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20">
      {links.map(({ to, label }) => (
        <Link
          key={to}
          to={to}
          className="block px-4 py-2 text-gray-800 hover:bg-gray-100 transition"
        >
          {label}
        </Link>
      ))}
    </div>
  </div>
);

const MobileLink = ({ to, children }) => (
  <Link
    to={to}
    className="block text-white text-sm py-1 border-b border-blue-600 hover:bg-blue-700 px-2 rounded transition"
  >
    {children}
  </Link>
);

export default Navbar;