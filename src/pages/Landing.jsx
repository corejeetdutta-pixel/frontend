import { Link } from 'react-router-dom';

const Landing = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gradient-to-br from-blue-600 via-green-500 to-indigo-700 p-4">
      <div className="bg-white shadow-2xl rounded-3xl p-6 max-w-4xl w-full mx-auto">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-4 md:mb-6 text-center text-blue-700">Welcome to Recruitment_E2E</h1>
        <p className="text-base md:text-lg text-gray-600 mb-6 md:mb-8 text-center">Choose your portal to get started</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full">

          {/* Admin Section */}
          <div className="bg-purple-50 rounded-2xl p-4 flex flex-col items-center shadow-md">
            <h2 className="text-lg md:text-xl font-bold text-purple-700 mb-3 md:mb-4">For Administrators</h2>
            <Link to="/admin/admin-login" className="w-full mb-2 py-2 px-4 rounded-lg bg-purple-600 text-white font-semibold text-sm md:text-base text-center hover:bg-purple-700 transition">Login</Link>
            <Link to="/admin/admin-register" className="w-full py-2 px-4 rounded-lg bg-white border border-purple-600 text-purple-700 font-semibold text-sm md:text-base text-center hover:bg-purple-50 transition">Register</Link>
          </div>
          {/* Employer Section */}
          <div className="bg-blue-50 rounded-2xl p-4 flex flex-col items-center shadow-md">
            <h2 className="text-lg md:text-xl font-bold text-blue-700 mb-3 md:mb-4">For Employers</h2>
            <Link to="/employee/employee-login" className="w-full mb-2 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold text-sm md:text-base text-center hover:bg-blue-700 transition">Login</Link>
            <Link to="/employee/employee-register" className="w-full py-2 px-4 rounded-lg bg-white border border-blue-600 text-blue-700 font-semibold text-sm md:text-base text-center hover:bg-blue-50 transition">Register</Link>
          </div>
          
          {/* Job Seeker Section */}
          <div className="bg-green-50 rounded-2xl p-4 flex flex-col items-center shadow-md">
            <h2 className="text-lg md:text-xl font-bold text-green-700 mb-3 md:mb-4">For Job Seekers</h2>
            <Link to="/login" className="w-full mb-2 py-2 px-4 rounded-lg bg-green-600 text-white font-semibold text-sm md:text-base text-center hover:bg-green-700 transition">Login</Link>
            <Link to="/register" className="w-full py-2 px-4 rounded-lg bg-white border border-green-600 text-green-700 font-semibold text-sm md:text-base text-center hover:bg-green-50 transition">Register</Link>
          </div>
          
          
        </div>
      </div>
    </div>
  );
};

export default Landing;