import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient"; // ✅ Your configured axios instance

interface User {
  userId: string;
  name: string;
  email: string;
  role: string;
  status: string;
  profileImage?: string;
}

const Navbar = () => {
  const [user, setUser] = useState<User | null>(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  // ✅ Fetch user info from backend
  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const storedUserId = localStorage.getItem("userId");

      // ✅ Option 1: if backend can get user info via token
      // const res = await axiosClient.get("/api/authentication/me");

      // ✅ Option 2: if backend requires userId explicitly
      if (!storedUserId) return;
      const res = await axiosClient.get(`/users/${storedUserId}`);

      setUser(res.data);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  fetchUserData();
}, []);


  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const openSection = (section: string) => setActiveSection(section);
  const closeSection = () => setActiveSection(null);

  // ✅ Handle password change
  const handlePasswordChange = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!user) return;

    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");

    try {
      const response = await axiosClient.put(
        `/authentication/change-password/${user.userId}`,
        { oldPassword, newPassword }
      );
      alert(response.data.message || "Password changed successfully!");
      (e.target as HTMLFormElement).reset();
    } catch (error: any) {
      alert(error.response?.data?.message || "Error changing password.");
    }
  };

  return (
    <header className="bg-white shadow-sm flex justify-between items-center p-4 relative">
      {/* Logo */}
      <h2 className="text-lg font-semibold text-gray-700">Hapo Logo Here</h2>

      {/* Right side */}
      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-gray-500">
          Hello, {user?.name || "User"} 👋
        </span>

        {/* Avatar */}
        <img
          src={user?.profileImage || "https://i.pravatar.cc/40"}
          alt="profile"
          onClick={toggleMenu}
          className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-400 transition-all"
        />

        {/* Main Popup */}
        {menuOpen && (
          <div className="absolute right-0 top-14 bg-white shadow-lg rounded-2xl w-56 p-3 z-50 animate-fadeIn">
            <ul className="flex flex-col text-gray-700">
              <li
                onClick={() => openSection("profile")}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Profile
              </li>
              <li
                onClick={() => openSection("auth")}
                className="p-2 rounded-xl hover:bg-gray-100 cursor-pointer"
              >
                Authentication & Authorization
              </li>
            </ul>
          </div>
        )}

        {/* Profile Details Popup */}
        {activeSection === "profile" && (
          <div className="absolute right-60 top-14 bg-white shadow-lg rounded-2xl w-72 p-4 z-50 animate-fadeIn">
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">
              User Profile
            </h3>
            <div className="space-y-2 text-gray-600 text-sm">
              <p>
                <strong>Name:</strong> {user?.name || "N/A"}
              </p>
              <p>
                <strong>Email:</strong> {user?.email || "N/A"}
              </p>
              <p>
                <strong>Status:</strong>{" "}
                <span
                  className={`${
                    user?.status === "ACTIVE" ? "text-green-600" : "text-red-600"
                  } font-medium`}
                >
                  {user?.status || "N/A"}
                </span>
              </p>
            </div>
            <button
              onClick={closeSection}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Close
            </button>
          </div>
        )}

        {/* Authentication & Authorization Popup */}
        {activeSection === "auth" && (
          <div className="absolute right-60 top-14 bg-white shadow-lg rounded-2xl w-72 p-4 z-50 animate-fadeIn">
            <h3 className="font-semibold text-gray-800 mb-3 border-b pb-2">
              Authentication & Authorization
            </h3>
            <div className="space-y-3 text-gray-600 text-sm">
              <p>
                <strong>Role:</strong>{" "}
                <span className="font-medium text-blue-700">
                  {user?.role || "USER"}
                </span>
              </p>

              {/* Change Password Form */}
              <form onSubmit={handlePasswordChange} className="space-y-2">
                <input
                  type="password"
                  name="oldPassword"
                  placeholder="Old Password"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring focus:ring-blue-200"
                  required
                />
                <input
                  type="password"
                  name="newPassword"
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm focus:ring focus:ring-blue-200"
                  required
                />
                <button
                  type="submit"
                  className="bg-blue-600 text-white rounded-lg w-full py-2 text-sm hover:bg-blue-700 transition-all"
                >
                  Change Password
                </button>
              </form>
            </div>
            <button
              onClick={closeSection}
              className="mt-4 text-blue-600 text-sm hover:underline"
            >
              Close
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
