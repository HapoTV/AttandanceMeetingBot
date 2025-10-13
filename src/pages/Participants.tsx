import React, { useEffect, useState } from "react";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

interface Participant {
  userId: string;
  name: string;
  roleName: string;
  status: string;
  email: string;
  department: string;
}

interface Role {
  roleId: string;
  roleName: string;
  permissions: string;
}

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [filteredParticipants, setFilteredParticipants] = useState<Participant[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();

  // ✅ Determine if user can manage
  const role = user?.roleName?.toUpperCase() || "";
  const canManage = ["ADMIN", "MANAGER"].includes(role);

  console.log("🔐 Logged in user:", user);
  console.log("🧮 Computed role:", role);
  console.log("✅ canManage:", canManage);

  // ✅ Fetch roles and participants
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [rolesRes, usersRes] = await Promise.all([
          axiosClient.get("/roles"),
          axiosClient.get("/users"),
        ]);
        setRoles(rolesRes.data);
        setParticipants(usersRes.data);
        setFilteredParticipants(usersRes.data);
      } catch (err) {
        console.error("Error fetching roles or users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // ✅ Role mapping helper
  const getRoleName = (roleName?: string) => {
    if (!roleName) return "UNKNOWN ROLE";
    const role = roles.find((r) => r.roleName.toUpperCase() === roleName.toUpperCase());
    return role ? role.roleName : roleName;
  };

  // ✅ Search filtering
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = participants.filter(
      (p) =>
        p.name.toLowerCase().includes(query) ||
        getRoleName(p.roleName).toLowerCase().includes(query) ||
        (p.department?.toLowerCase() || "").includes(query) ||
        (p.email?.toLowerCase() || "").includes(query) ||
        (p.status?.toLowerCase() || "").includes(query)
    );
    setFilteredParticipants(filtered);
  }, [searchQuery, participants, roles]);

  // ✅ Delete handler
  const handleDelete = async (id: string) => {
    if (!canManage) return alert("Unauthorized");
    try {
      await axiosClient.delete(`/users/${id}`);
      setParticipants((prev) => prev.filter((p) => p.userId !== id));
    } catch (err) {
      console.error(err);
      alert("Failed to delete participant");
    }
  };

  if (!user) {
    return <div className="p-6 text-center text-gray-600">Loading user info...</div>;
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Participants</h2>
        {canManage && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5" /> Add Participant
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="mb-4 flex items-center gap-2">
        <MagnifyingGlassIcon className="w-5 h-5 text-gray-500" />
        <input
          type="text"
          placeholder="Search by name, role, department, email, or status..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Table */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-medium">Name</th>
                <th className="px-6 py-3 text-left font-medium">Role</th>
                <th className="px-6 py-3 text-left font-medium">Department</th>
                <th className="px-6 py-3 text-left font-medium">Status</th>
                <th className="px-6 py-3 text-left font-medium">Email</th>
                {canManage && <th className="px-6 py-3 text-left font-medium">Actions</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredParticipants.map((p) => (
                <tr key={p.userId}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    {p.name}
                  </td>
                  <td className="px-6 py-4">{getRoleName(p.roleName)}</td>
                  <td className="px-6 py-4">{p.department || "N/A"}</td>
                  <td className="px-6 py-4 flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        p.status === "ACTIVE" ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {p.status?.toLowerCase() || "UNKNOWN"}
                  </td>
                  <td className="px-6 py-4">{p.email || "N/A"}</td>
                  {canManage && (
                    <td className="px-6 py-4 flex gap-2">
                      <button className="text-blue-600 hover:text-blue-800">
                        <PencilSquareIcon className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleDelete(p.userId)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <TrashIcon className="w-5 h-5" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Participants;
