import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import EmployeeLogin from './EmployeeLogin';
import EmployeeRegister from './EmployeeRegister';
import EmpHome from './EmpHome';
import AddJob from './AddJob';
import JDGenerator from './JDGenerator';
import Dashboard from './Dashboard';
import EmployeeAuthServices from '../api/EmployeeAuthServices';
import MyPostedJobs from './MyPostedJob';
import AllJobsTable from './AllJobsTable';

const Employee = ({ employee, setEmployee }) => {
  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const res = await EmployeeAuthServices.fetchCurrentEmployee();
        setEmployee(res.data);
      } catch {
        setEmployee(null);
      }
    };

    fetchEmployee();
  }, [setEmployee]);

  return (
    <Routes>
      <Route path="employee-login" element={<EmployeeLogin setUser={setEmployee} />} />
      <Route path="employee-register" element={<EmployeeRegister />} />
      
      <Route
        path="home"
        element={employee ? <EmpHome /> : <Navigate to="/employee/home" />}
      />
      
      <Route
        path="add-job"
        element={employee ? <AddJob /> : <Navigate to="/employee/home" />}
      />
      
      <Route
        path="jd-generator"
        element={employee ? <JDGenerator /> : <Navigate to="/employee/home" />}
      />
      
      <Route
        path="dashboard"
        element={
          employee ? 
            <Dashboard empId={employee.empId} /> : 
            <Navigate to="/employee/home" />
        }
      />
      
      <Route
        path="all-jobs"
        element={employee ? <AllJobsTable /> : <Navigate to="/employee/home" />}
      />
      
      <Route
        path="my-posted-jobs"
        element={employee ? <MyPostedJobs /> : <Navigate to="/employee/home" />}
      />
      
      {/* Redirect any unknown paths to home */}
      <Route path="*" element={<Navigate to="/employee/home" replace />} />
    </Routes>
  );
};

export default Employee;