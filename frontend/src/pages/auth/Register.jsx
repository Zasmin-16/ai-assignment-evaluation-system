import { useState } from "react";
import { Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    role: "student",
  });

  const handleRegister = async () => {
    try {
      const res = await fetch(
        "http://127.0.0.1:5000/api/auth/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json();

      if (res.ok) {
        alert("Registration successful ✅");
        window.location.href = "/";
      } else {
        alert(data.error || "Registration failed ❌");
      }
    } catch (error) {
      alert("Server error ❌");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600">
      <div className="bg-white p-10 rounded-2xl shadow-xl w-96">
        <h2 className="text-3xl font-bold mb-6 text-center">
          Register
        </h2>

        <input
          placeholder="Full Name"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, full_name: e.target.value })
          }
        />

        <input
          type="email"
          placeholder="Email"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          placeholder="Password"
          className="w-full mb-4 px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-400"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <select
          className="w-full mb-6 px-4 py-2 border rounded-lg"
          onChange={(e) =>
            setForm({ ...form, role: e.target.value })
          }
        >
          <option value="student">Student</option>
          <option value="professor">Professor</option>
        </select>

        <button
          onClick={handleRegister}
          className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition"
        >
          Register
        </button>

        <p className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link
            to="/"
            className="text-indigo-600 font-semibold"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
