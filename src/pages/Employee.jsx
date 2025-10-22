// src/pages/Employee.jsx
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLogin from './EmployeeLogin';
import EmployeeRegister from './EmployeeRegister';
import EmpHome from './EmpHome';
import AddJob from './AddJob';
import JDGenerator from './JDGenerator';
import Dashboard from './Dashboard';
import MyPostedJobs from './MyPostedJob';
import AllJobsTable from './AllJobsTable';

const Employee = ({ employee, setEmployee }) => {
  // Remove the useEffect that was causing the unauthorized request
  // The employee state is now fully managed by the parent App component

  return (
    <Routes>
      <Route path="employee-login" element={
        employee ? <Navigate to="/employee/home" replace /> : 
        <EmployeeLogin setEmployee={setEmployee} />
      } />
      <Route path="employee-register" element={<EmployeeRegister />} />
      
      <Route
        path="home"
        element={employee ? <EmpHome employee={employee} /> : <Navigate to="/employee/employee-login" />}
      />
      
      <Route
        path="add-job"
        element={employee ? <AddJob /> : <Navigate to="/employee/employee-login" />}
      />
      
      <Route
        path="jd-generator"
        element={employee ? <JDGenerator /> : <Navigate to="/employee/employee-login" />}
      />
      
      <Route
        path="dashboard"
        element={
          employee ? 
            <Dashboard empId={employee.empId} /> : 
            <Navigate to="/employee/employee-login" />
        }
      />
      
      <Route
        path="all-jobs"
        element={employee ? <AllJobsTable /> : <Navigate to="/employee/employee-login" />}
      />
      
      <Route
        path="my-posted-jobs"
        element={employee ? <MyPostedJobs /> : <Navigate to="/employee/employee-login" />}
      />
      
      {/* Redirect any unknown paths to home */}
      <Route path="*" element={<Navigate to="/employee/home" replace />} />
    </Routes>
  );
};

export default Employee;