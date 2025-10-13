import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import HapoLabsSecondary from '../assets/Hapo Labs - Secondary.jpg';
import axiosClient from "../api/axiosClient";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [, setShowCreatePassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  setError("");

  try {
    const response = await axiosClient.post("/authentication/login", { email, password });
    const userData = response.data;

    login(userData); // update context + localStorage
    // Use setTimeout to wait for context update before navigating
    setTimeout(() => navigate("/dashboard"), 50);
  } catch (err: any) {
    setError("Invalid credentials");
  }
};


  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-cyan-100 via-white to-cyan-50">
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl w-full max-w-md p-8 border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-3">
            <img
              src={HapoLabsSecondary}
              alt="Hapo Labs logo"
              className="h-28 w-auto select-none"
              style={{ clipPath: 'inset(0 0 24% 0)' }}
              draggable={false}
            />
           
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Welcome back! Please sign in to continue.
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-cyan-300 focus:border-cyan-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-cyan-600 text-white py-2 rounded-lg font-semibold hover:bg-cyan-700 hover:shadow-md active:scale-[0.98] transition-all"
          >
            Login
          </button>
        </form>

        {/* Create Password Link */}
        <div className="mt-4 text-center space-y-2">
          <button
            onClick={() => navigate("/create-password", { state: { email } })}
            className="text-sm text-cyan-600 font-medium hover:underline block w-full"
          >
            Create Password
          </button>
          <button
            onClick={() => navigate("/")}
            className="text-sm text-cyan-600 font-medium hover:underline block w-full"
          >
            Home Page
          </button>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} <span className="font-semibold">Hapo</span> Meeting Bot
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
