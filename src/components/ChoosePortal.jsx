import { motion } from "framer-motion";
import { Users, Briefcase, User } from "lucide-react";
import { Link } from "react-router-dom";

export default function ChoosePortal() {
  const portals = [
    {
      title: "Administrators",
      icon: <Users className="w-10 h-10 text-red-500 mb-3" />,
      color: "red",
      login: "/admin/admin-login",
      register: "/admin/admin-register",
    },
    {
      title: "Employers",
      icon: <Briefcase className="w-10 h-10 text-blue-600 mb-3" />,
      color: "blue",
      login: "/employee/employee-login",
      register: "/employee/employee-register",
    },
    {
      title: "Job Seekers",
      icon: <User className="w-10 h-10 text-green-600 mb-3" />,
      color: "green",
      login: "/login",
      register: "/register",
    },
  ];

  return (
    <section className="py-16 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-14">
          Choose Your Portal
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {portals.map((portal, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="bg-white shadow-md hover:shadow-xl rounded-2xl p-8 border border-gray-200"
            >
              <div className="flex flex-col items-center">
                {portal.icon}
                <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                  For {portal.title}
                </h3>

                <div className="space-y-3 w-full">
                  <Link
                    to={portal.login}
                    className={`block w-full py-3 px-4 bg-${portal.color}-600 text-white font-semibold rounded-lg hover:bg-${portal.color}-700 transition`}
                  >
                    Login
                  </Link>

                  <Link
                    to={portal.register}
                    className={`block w-full py-3 px-4 bg-white border border-${portal.color}-600 text-${portal.color}-600 font-semibold rounded-lg hover:bg-${portal.color}-50 transition`}
                  >
                    Register
                  </Link>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
