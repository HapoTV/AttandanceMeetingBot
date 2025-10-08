import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import hapoMark from "../assets/hapo-mark.svg";

const AuthPassword = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState(location.state?.email || "");
  const [password, setPassword] = useState("");
  const [retypePassword, setRetypePassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCreatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password !== retypePassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      await axiosClient.post("/authentication/create-password", {
        email,
        password,
      });

      setSuccess("Password created successfully! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setError(
        err.response?.data?.message ||
        "You do not have permission to create a password."
      );
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-indigo-100 via-white to-indigo-50">
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-3xl w-full max-w-md p-8 border border-gray-200">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center space-x-3">
            <div className="bg-white rounded-2xl w-12 h-12 shadow-md flex flex-col items-center justify-center overflow-hidden">
              <img src={hapoMark} alt="Hapo logo" className="h-6 w-6 object-contain" />
              <span className="text-[10px] leading-none font-semibold text-black mt-0.5">
                hapo
              </span>
            </div>
            <span className="text-3xl font-extrabold text-gray-800 font-serif tracking-tight">
              Meeting Bot
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            Create your password to access the system.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleCreatePassword} className="space-y-4">
          {error && (
            <div className="bg-red-100 text-red-600 px-3 py-2 rounded-lg text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="bg-green-100 text-green-600 px-3 py-2 rounded-lg text-sm text-center">
              {success}
            </div>
          )}

          <div>
            <label className="text-sm font-medium text-gray-600">Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
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
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="text-sm font-medium text-gray-600">Retype Password</label>
            <input
              type="password"
              placeholder="••••••••"
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 transition"
              value={retypePassword}
              onChange={(e) => setRetypePassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 rounded-lg font-semibold hover:bg-indigo-700 hover:shadow-md active:scale-[0.98] transition-all"
          >
            Create Password
          </button>
        </form>

        {/* Back to Login Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/login", { state: { email } })}
              className="text-sm text-indigo-600 font-medium hover:underline"
            >
              Back to Login
            </button>
          </div>
      </div>
    </div>
  );
};

export default AuthPassword;
