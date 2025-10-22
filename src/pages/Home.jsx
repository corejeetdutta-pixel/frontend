import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthServices from '../api/AuthServices';

import ProfilePanel from '../components/ProfilePanel';
import MyApplications from './MyApplications';
import JobList from './JobList';

const Home = () => {
  const [user, setUser] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await AuthServices.fetchCurrentUser();
        setUser(res.data);
        setActiveSection('jobcards');
      } catch (error) {
        navigate('/login');
      }
    };
    fetchUser();
  }, [navigate]);

  const handleOpenSection = (section) => {
    setActiveSection(section);
    if (section !== 'profile') {
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

  const handleCloseSection = () => {
    setActiveSection(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogout = async () => {
    await AuthServices.logout();
    navigate('/login');
  };

  if (!user) return null;

  return (
    <section className="min-h-[80vh] px-6 pb-12 bg-gradient-to-br from-[#f8fafc] to-[#e2ecf9]">
      {/* Hero */}
      <div className="flex flex-col justify-center items-center text-center py-16">
        <div className="backdrop-blur-xl bg-white/70 border border-white/40 text-gray-900 rounded-3xl shadow-2xl p-12 max-w-4xl w-full">
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 tracking-tight bg-gradient-to-r from-[#0260a4] to-[#00b4d8] bg-clip-text text-transparent">
            Welcome, {user.name} 
          </h1>
          <p className="text-lg text-gray-600 mb-10 max-w-2xl mx-auto">
            You’re inside <span className="font-bold text-[#0260a4]">Atract</span>.  
            Manage your profile, track applications, and explore jobs in one sleek dashboard.
          </p>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <button
              onClick={() => handleOpenSection('profile')}
              className="group flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              <div className="bg-gradient-to-br from-[#0260a4] to-[#00b4d8] p-4 rounded-full text-white shadow-md group-hover:scale-110 transition">
                👤
              </div>
              <span className="font-semibold text-gray-800">My Profile</span>
            </button>

            <button
              onClick={() => handleOpenSection('applications')}
              className="group flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              <div className="bg-gradient-to-br from-green-500 to-emerald-400 p-4 rounded-full text-white shadow-md group-hover:scale-110 transition">
                📄
              </div>
              <span className="font-semibold text-gray-800">My Applications</span>
            </button>

            <button
              onClick={() => handleOpenSection('jobcards')}
              className="group flex flex-col items-center justify-center gap-2 bg-white/80 backdrop-blur-lg border border-gray-200 rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition"
            >
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 p-4 rounded-full text-white shadow-md group-hover:scale-110 transition">
                🗂️
              </div>
              <span className="font-semibold text-gray-800">Job Cards</span>
            </button>
          </div>
        </div>
      </div>

      {/* Dynamic Section */}
      {activeSection === 'profile' && (
        <ProfilePanel user={user} onClose={handleCloseSection} onLogout={handleLogout} />
      )}

      {(activeSection === 'applications' || activeSection === 'jobcards') && (
        <div
          ref={scrollRef}
          className="relative max-w-6xl mx-auto bg-white/90 backdrop-blur-xl border border-gray-200 shadow-xl rounded-2xl p-10 mt-10"
        >
          {/* Close Button */}
          <button
            onClick={handleCloseSection}
            className="absolute top-4 right-4 text-gray-400 hover:text-red-500 transition text-xl"
            title="Close"
          >
            ✕
          </button>

          {activeSection === 'applications' && <MyApplications user={user} />}
          {activeSection === 'jobcards' && <JobList user={user} />}
        </div>
      )}
    </section>
  );
};

export default Home;
