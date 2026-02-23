import { useState } from "react";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleReset = async () => {
    const res = await fetch("http://127.0.0.1:5000/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    setMessage(data.message || data.error);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
      <div className="bg-white p-10 rounded-2xl shadow-2xl w-96 text-center">
        <h2 className="text-3xl font-bold mb-6 text-gray-800">
          Forgot Password
        </h2>

        <input
          type="email"
          placeholder="Enter your email"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 mb-4 focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          onClick={handleReset}
          className="w-full bg-indigo-600 text-white py-3 rounded-lg hover:bg-indigo-700 transition-all duration-300"
        >
          Send Reset Link
        </button>

        {message && (
          <p className="mt-4 text-sm text-gray-600">
            {message}
          </p>
        )}

        <div className="mt-6 text-sm">
          <Link
            to="/"
            className="text-pink-500 hover:text-pink-600 font-semibold"
          >
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
}