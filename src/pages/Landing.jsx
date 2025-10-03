import { Link } from "react-router-dom";

const Landing = () => {
  return (
    <div className="flex-1 flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-2xl rounded-3xl p-8 max-w-5xl w-full mx-auto">
        
        {/* Title */}
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-black font-playfair">
          Welcome to <span className="text-[#0260a4]">atract.in</span>
        </h1>

        <p className="text-lg md:text-xl text-gray-600 mb-10 text-center">
          Choose your portal to get started
        </p>

        {/* Portal Sections */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Admin Section */}
          <div className="bg-white border rounded-2xl p-6 flex flex-col items-center shadow-md hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-bold text-black mb-4">
              For Administrators
            </h2>
            <Link 
              to="/admin/admin-login" 
              className="w-full mb-3 py-2 px-4 rounded-lg bg-red-500 text-white font-semibold text-center hover:bg-red-600 transition"
            >
              Login
            </Link>
            <Link 
              to="/admin/admin-register" 
              className="w-full py-2 px-4 rounded-lg bg-white border border-red-500 text-red-500 font-semibold text-center hover:bg-red-50 transition"
            >
              Register
            </Link>
          </div>

          {/* Employer Section */}
          <div className="bg-white border rounded-2xl p-6 flex flex-col items-center shadow-md hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-bold text-black mb-4">
              For Employers
            </h2>
            <Link 
              to="/employee/employee-login" 
              className="w-full mb-3 py-2 px-4 rounded-lg bg-blue-600 text-white font-semibold text-center hover:bg-blue-700 transition"
            >
              Login
            </Link>
            <Link 
              to="/employee/employee-register" 
              className="w-full py-2 px-4 rounded-lg bg-white border border-blue-600 text-blue-600 font-semibold text-center hover:bg-blue-50 transition"
            >
              Register
            </Link>
          </div>

          {/* Job Seeker Section */}
          <div className="bg-white border rounded-2xl p-6 flex flex-col items-center shadow-md hover:shadow-lg transition">
            <h2 className="text-lg md:text-xl font-bold text-black mb-4">
              For Job Seekers
            </h2>
            <Link 
              to="/login" 
              className="w-full mb-3 py-2 px-4 rounded-lg bg-green-600 text-white font-semibold text-center hover:bg-green-700 transition"
            >
              Login
            </Link>
            <Link 
              to="/register" 
              className="w-full py-2 px-4 rounded-lg bg-white border border-green-600 text-green-600 font-semibold text-center hover:bg-green-50 transition"
            >
              Register
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;
