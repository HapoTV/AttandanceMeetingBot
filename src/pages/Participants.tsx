import React, { useEffect, useState } from "react";
import {
  UserIcon,
  PencilSquareIcon,
  TrashIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";
import axiosClient from "../api/axiosClient";

interface Participant {
  userId: string;
  name: string;
  role: {
    roleName: string;
  };
  online: boolean;
  email: string;
  department: string;
}

const Participants: React.FC = () => {
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Only ADMIN and MANAGER can manage participants
  const canManage = ["ADMIN", "MANAGER"].includes(user?.role || "");

  useEffect(() => {
    axiosClient
      .get("/users")
      .then((res) => setParticipants(res.data))
      .finally(() => setLoading(false));
  }, []);

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

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Participants</h2>
        {canManage && (
          <button className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700">
            <PlusIcon className="w-5 h-5" /> Add Participant
          </button>
        )}
      </div>

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
                {canManage && (
                  <th className="px-6 py-3 text-left font-medium">Actions</th>
                )}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {participants.map((p) => (
                <tr key={p.userId}>
                  <td className="px-6 py-4 flex items-center gap-2">
                    <UserIcon className="w-5 h-5 text-gray-500" />
                    {p.name}
                  </td>
                  <td className="px-6 py-4">{p.role.roleName}</td>
                  <td className="px-6 py-4">{p.department}</td>
                  <td className="px-6 py-4 flex items-center">
                    <span
                      className={`w-3 h-3 rounded-full mr-2 ${
                        p.online ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></span>
                    {p.online ? "Online" : "Offline"}
                  </td>
                  <td className="px-6 py-4">{p.email}</td>
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
