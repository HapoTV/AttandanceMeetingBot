import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const toggleMenu = () => setMenuOpen((prev) => !prev);
  const openSection = (section: string) => setActiveSection(section);
  const closeSection = () => setActiveSection(null);

  // Placeholder handler for changing password
  const handlePasswordChange = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const oldPassword = formData.get("oldPassword");
    const newPassword = formData.get("newPassword");
    console.log("Change password:", { oldPassword, newPassword });
    alert("Password change submitted (placeholder)");
    e.currentTarget.reset();
  };

  return (
    <header className="bg-white shadow-sm flex justify-between items-center p-4 relative">
      {/* Logo */}
      <h2 className="text-lg font-semibold text-gray-700">Hapo Logo Here</h2>

      {/* Right Side */}
      <div className="flex items-center gap-3 relative">
        <span className="text-sm text-gray-500">
          Hello, {user?.name || "User"} 👋
        </span>

        <img
          src="https://i.pravatar.cc/40"
          alt="profile"
          onClick={toggleMenu}
          className="w-10 h-10 rounded-full cursor-pointer border border-gray-300 hover:ring-2 hover:ring-blue-400 transition-all"
        />

        {/* Dropdown Menu */}
        {menuOpen && (
          <div className="absolute right-0 top-14 bg-white shadow-lg rounded-2xl w-56 p-3 z-50 animate-fadeIn">
            <ul className="flex flex-col text-gray-700">
              <li
                onClick={() => openSection("profile")}
                className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer text-center"
              >
                Profile
              </li>
              <li
                onClick={() => openSection("auth")}
                className="p-3 rounded-xl hover:bg-gray-100 cursor-pointer text-center"
              >
                Authentication & Authorization
              </li>
            </ul>
          </div>
        )}

        {/* Centered Popups */}
        {activeSection && (
          <div className="fixed inset-0 flex items-center justify-center z-50">
            <div className="bg-white shadow-xl rounded-3xl w-1/2 max-w-4xl p-8 relative animate-fadeIn">
              <h3 className="font-semibold text-gray-800 mb-4 border-b pb-2 text-xl">
                {activeSection === "profile"
                  ? "User Profile"
                  : "Authentication & Authorization"}
              </h3>

              {/* Profile Section */}
              {activeSection === "profile" && (
                <div className="space-y-3 text-gray-700 text-base">
                  <p><strong>Name:</strong> {user?.name}</p>
                  <p><strong>Email:</strong> {user?.email}</p>
                  <p><strong>Role:</strong> {user?.roleName}</p>
                  <p><strong>Status:</strong> {user?.status}</p>
                  <p><strong>Department:</strong> {user?.department}</p>
                </div>
              )}

              {/* Authentication & Authorization Section */}
              {activeSection === "auth" && (
                <div className="space-y-4 text-gray-700 text-base">
                  <p>
                    <strong>Role:</strong>{" "}
                    <span className="font-medium text-blue-700">
                      {user?.roleName || "USER"}
                    </span>
                  </p>

                  {/* Change Password Form */}
                  <form onSubmit={handlePasswordChange} className="space-y-3">
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
              )}

              {/* Close Button */}
              <button
                onClick={closeSection}
                className="mt-6 bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-all"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;
