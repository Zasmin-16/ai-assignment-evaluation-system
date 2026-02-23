import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export default function Layout({ children }) {
  const navigate = useNavigate();
  const [role, setRole] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user?.profile?.role) {
      setRole(user.profile.role);
    }
  }, []);

  const logout = () => {
    localStorage.clear();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <div className="w-64 bg-gradient-to-b from-purple-600 to-indigo-700 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">AI Evaluator</h1>

        {role === "admin" && (
          <Link to="/admin" className="block mb-4 hover:text-gray-200">
            Admin Dashboard
          </Link>
        )}

        {role === "professor" && (
          <Link to="/professor" className="block mb-4 hover:text-gray-200">
            Professor Dashboard
          </Link>
        )}

        {role === "student" && (
          <Link to="/student" className="block mb-4 hover:text-gray-200">
            Student Dashboard
          </Link>
        )}

        <button
          onClick={logout}
          className="mt-10 bg-white text-purple-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-200"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 bg-gray-100">
        {children}
      </div>
    </div>
  );
}
