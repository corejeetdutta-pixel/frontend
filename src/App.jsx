// src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Employee from "./pages/Employee";
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
import ResendVerification from "./pages/ResendVerification";
import ManualVerification from "./pages/ManualVerification";
import ShowAllUserByAdmin from "./pages/ShowAllUserByAdmin";
import ShowAllEmployeeByAdmin from "./pages/ShowAllEmployeeByAdmin";
import axios from "./api/axiosInstance";
import AdminAuthService from "./api/AdminAuthService";
import { NotificationProvider } from './contexts/NotificationContext';

const App = () => {
  const [user, setUser] = useState(null);
  const [employee, setEmployee] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loadingAdmin, setLoadingAdmin] = useState(true);

  // Fetch logged-in user (candidate)
  useEffect(() => {
    axios
      .get("/auth/user/current-user", { withCredentials: true })
      .then((res) => setUser(res.data))
      .catch(() => setUser(null));
  }, []);

  // Fetch logged-in employee (employer)
  useEffect(() => {
    axios
      .get("/auth/employee/current-employee", { withCredentials: true })
      .then((res) => setEmployee(res.data))
      .catch(() => setEmployee(null));
  }, []);

  // ✅ Fetch logged-in admin from backend session
  useEffect(() => {
    const checkAdminSession = async () => {
      try {
        const response = await AdminAuthService.getCurrentAdmin();
        setAdmin(response.data);
      } catch (error) {
        setAdmin(null);
      } finally {
        setLoadingAdmin(false);
      }
    };
    checkAdminSession();
  }, []);

  if (loadingAdmin) {
    return <div className="text-center py-10">Checking session...</div>;
  }

  return (
    <NotificationProvider>
      <div className="min-h-screen flex flex-col bg-gray-100">
        <div className="w-full bg-yellow-300 text-black text-center font-bold py-1 tracking-wider text-base z-50">
          Beta Version
        </div>
        <Navbar
          user={user}
          setUser={setUser}
          employee={employee}
          setEmployee={setEmployee}
          admin={admin}
          setAdmin={setAdmin}
        />

        <main className="flex-1 max-w-6xl mx-auto px-4 py-6 w-full">
          <Routes>
            {/* Employer Dashboard */}
            <Route
              path="/employee/*"
              element={<Employee employee={employee} setEmployee={setEmployee} />}
            />

            {/* Public Pages */}
            <Route path="/" element={<Landing />} />
            <Route
              path="/admin/admin-login"
              element={
                admin ? <Navigate to="/admin/home" /> : <AdminLogin setAdmin={setAdmin} />
              }
            />
            <Route path="/admin/admin-register" element={<AdminRegister />} />
            <Route
              path="/admin/home"
              element={
                admin ? (
                  <AdminHome admin={admin} setAdmin={setAdmin} />
                ) : (
                  <Navigate to="/admin/admin-login" />
                )
              }
            />
            {/* Add the admin users route */}
            <Route
              path="/admin/users"
              element={
                admin ? (
                  <ShowAllUserByAdmin />
                ) : (
                  <Navigate to="/admin/admin-login" />
                )
              }
            />
            <Route
              path="/admin/employees"
              element={
                admin ? (
                  <ShowAllEmployeeByAdmin />
                ) : (
                  <Navigate to="/admin/admin-login" />
                )
              }
            />
            <Route path="/home" element={<Home />} />
            <Route path="/register" element={<Register setUser={setUser} />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/resend-verification" element={<ResendVerification />} />
            <Route path="/manual-verification" element={<ManualVerification />} />
            <Route path="/jobs/:jobId" element={<JobDetail />} />
            <Route path="/profile" element={<Profile user={user} setUser={setUser} />} />

            {/* Add these two routes */}
            <Route 
              path="/job-list" 
              element={user ? <JobList user={user} /> : <Navigate to="/login" />} 
            />
            <Route 
              path="/my-applications" 
              element={user ? <MyApplications user={user} /> : <Navigate to="/login" />} 
            />

            {/* JD Generator and Add Job */}
            <Route path="/jd-generator" element={<JDGenerator />} />
            <Route path="/add-job" element={<AddJob />} />

            {/* Payment Page */}
            <Route path="/payment" element={<PaymentPage />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </NotificationProvider>
  );
};

export default App;