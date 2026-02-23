import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/auth/login",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        alert(data.error || "Login failed ❌");
        return;
      }

      // Save token & user info
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("user_id", data.user.id);
      localStorage.setItem("role", data.profile.role);

      // Role-based redirect
      if (data.profile.role === "admin") {
        navigate("/admin");
      } else if (data.profile.role === "professor") {
        navigate("/professor");
      } else {
        navigate("/student");
      }

    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Login
        </h2>

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-6 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <div className="text-right mt-2">
          <a
            href="/forgot-password"
            className="text-pink-400 hover:text-pink-600 text-sm"
          >
            Forgot Password?
          </a>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Login
        </button>

        <p className="mt-4 text-center text-sm">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-indigo-600 font-semibold"
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
