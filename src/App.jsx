import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import JobList from "./pages/JobList";
import MyApplications from "./pages/MyApplications";
import JobDetail from "./pages/JobDetail";
import Profile from "./pages/Profile";
import JDGenerator from "./pages/JDGenerator";
import AddJob from "./pages/AddJob";
import PaymentPage from "./pages/PaymentPage";
import Landing from "./pages/Landing";
import AdminLogin from "./pages/AdminLogin";
import AdminRegister from "./pages/AdminRegister";
import AdminHome from "./pages/AdminHome";
import VerifyEmail from "./pages/VerifyEmail";
import VerifyEmployee from "./pages/VerifyEmployee"; // ✅ New import
import ResendVerification from "./pages/ResendVerification";
import EmployeeResendVerification from "./pages/EmployeeResendVerification"; // ✅ New import
import ManualVerification from "./pages/ManualVerification";
import ShowAllUserByAdmin from "./pages/ShowAllUserByAdmin";
import ShowAllEmployeeByAdmin from "./pages/ShowAllEmployeeByAdmin";
import VerificationSuccess from "./pages/VerificationSuccess";
import AuthServices from "./api/AuthServices";
import EmployeeAuthServices from "./api/EmployeeAuthServices";
import axios from "./api/axiosInstance";
import EmployeeLogin from "./pages/EmployeeLogin";
import EmployeeRegister from "./pages/EmployeeRegister";
import EmpHome from "./pages/EmpHome";
import Dashboard from "./pages/Dashboard";
import MyPostedJobs from "./pages/MyPostedJob";
import AllJobsTable from "./pages/AllJobsTable";

// Route guards
const UserRoute = ({ user, children }) => {
  return user ? children : <Navigate to="/login" />;
};

const EmployeeRoute = ({ employee, children }) => {
  return employee ? children : <Navigate to="/employee/employee-login" />;
};

const AdminRoute = ({ admin, children }) => {
  return admin ? children : <Navigate to="/admin/admin-login" />;
};

const App = () => {
  const [user, setUser] = useState(
    localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')) : null
  );
  const [employee, setEmployee] = useState(
    localStorage.getItem('employee') ? JSON.parse(localStorage.getItem('employee')) : null
  );
  const [admin, setAdmin] = useState(
    localStorage.getItem('admin') ? JSON.parse(localStorage.getItem('admin')) : null
  );
  const [loading, setLoading] = useState(true);

  // Check if tokens are valid on app load
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        const employeeToken = localStorage.getItem('employeeToken');
        const adminToken = localStorage.getItem('adminToken');
        
        if (token) {
          try {
            const res = await AuthServices.fetchCurrentUser();
            setUser(res.data);
          } catch (error) {
            console.error("User auth initialization error:", error);
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
          }
        }
        
        if (employeeToken) {
          try {
            const res = await EmployeeAuthServices.fetchCurrentEmployee();
            setEmployee(res.data);
          } catch (error) {
            console.error("Employee auth initialization error:", error);
            localStorage.removeItem('employeeToken');
            localStorage.removeItem('employee');
            setEmployee(null);
          }
        }
        
        if (adminToken) {
          try {
            const res = await axios.get("/api/admin/current-admin", { withCredentials: true });
            setAdmin(res.data);
          } catch (error) {
            console.error("Admin auth initialization error:", error);
            localStorage.removeItem('adminToken');
            localStorage.removeItem('admin');
            setAdmin(null);
          }
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Beta Banner */}
      <div className="w-full bg-yellow-300 text-black text-center font-bold py-1 tracking-wider text-base z-50">
        Beta Version
      </div>

      {/* Navbar */}
      <Navbar
        user={user}
        setUser={setUser}
        employee={employee}
        setEmployee={setEmployee}
        admin={admin}
        setAdmin={setAdmin}
      />

      {/* Main Routes */}
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
        <Routes>
          {/* Public Pages */}
          <Route path="/" element={<Landing />} />
          
          {/* ✅ Updated Verification Routes */}
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/verify-employee" element={<VerifyEmployee />} /> {/* ✅ Fixed */}
          <Route path="/verification-success" element={<VerificationSuccess />} />
          <Route path="/resend-verification" element={<ResendVerification />} />
          <Route path="/employee/resend-verification" element={<EmployeeResendVerification />} /> {/* ✅ New */}
          <Route path="/manual-verification" element={<ManualVerification />} />
          <Route path="/jobs/:jobId" element={<JobDetail />} />
          <Route path="/payment" element={<PaymentPage />} />

          {/* Candidate Auth */}
          <Route 
            path="/register" 
            element={user ? <Navigate to="/home" /> : <Register setUser={setUser} />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/home" /> : <Login setUser={setUser} />} 
          />

          {/* Employee Auth */}
          <Route
            path="/employee/employee-login"
            element={
              employee ? <Navigate to="/employee/home" /> : <EmployeeLogin setEmployee={setEmployee} />
            }
          />
          <Route 
            path="/employee/employee-register" 
            element={
              employee ? <Navigate to="/employee/home" /> : <EmployeeRegister setEmployee={setEmployee} />
            } 
          />
          
          {/* Employee Protected Routes */}
          <Route 
            path="/employee/home" 
            element={
              <EmployeeRoute employee={employee}>
                <EmpHome employee={employee} setEmployee={setEmployee} />
              </EmployeeRoute>
            } 
          />
          <Route 
            path="/jd-generator" 
            element={
              <EmployeeRoute employee={employee}>
                <JDGenerator />
              </EmployeeRoute>
            } 
          />
          <Route 
            path="/add-job" 
            element={
              <EmployeeRoute employee={employee}>
                <AddJob />
              </EmployeeRoute>
            } 
          />
          <Route
            path="/employee/dashboard"
            element={
              <EmployeeRoute employee={employee}>
                <Dashboard empId={employee?.empId} />
              </EmployeeRoute>
            }
          />
          <Route
            path="/employee/all-jobs"
            element={
              <EmployeeRoute employee={employee}>
                <AllJobsTable />
              </EmployeeRoute>
            }
          />
          <Route
            path="/employee/my-posted-jobs"
            element={
              <EmployeeRoute employee={employee}>
                <MyPostedJobs />
              </EmployeeRoute>
            }
          />

          {/* Candidate Protected Routes */}
          <Route 
            path="/home" 
            element={
              <UserRoute user={user}>
                <Home user={user} setUser={setUser} />
              </UserRoute>
            } 
          />
          <Route
            path="/profile"
            element={
              <UserRoute user={user}>
                <Profile user={user} setUser={setUser} />
              </UserRoute>
            }
          />
          <Route
            path="/job-list"
            element={
              <UserRoute user={user}>
                <JobList user={user} />
              </UserRoute>
            }
          />
          <Route
            path="/my-applications"
            element={
              <UserRoute user={user}>
                <MyApplications user={user} />
              </UserRoute>
            }
          />

          {/* Admin Auth */}
          <Route
            path="/admin/admin-login"
            element={
              admin ? <Navigate to="/admin/home" /> : <AdminLogin setAdmin={setAdmin} />
            }
          />
          <Route 
            path="/admin/admin-register" 
            element={
              admin ? <Navigate to="/admin/home" /> : <AdminRegister />
            } 
          />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/home"
            element={
              <AdminRoute admin={admin}>
                <AdminHome admin={admin} setAdmin={setAdmin} />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <AdminRoute admin={admin}>
                <ShowAllUserByAdmin />
              </AdminRoute>
            }
          />
          <Route
            path="/admin/employees"
            element={
              <AdminRoute admin={admin}>
                <ShowAllEmployeeByAdmin />
              </AdminRoute>
            }
          />

          {/* Fallback route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;