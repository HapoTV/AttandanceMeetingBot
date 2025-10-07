import React, { useEffect, useState } from "react";
import { BellIcon, XMarkIcon } from "@heroicons/react/24/solid";
import axiosClient from "../api/axiosClient";

interface Notification {
  notificationId: string;
  userId: string;
  notificationType: string;
  message: string;
  status: string;
  sentAt: string;
}

const Notifications: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Notification | null>(null);

  useEffect(() => {
    axiosClient.get("/notifications").then((res) => setNotifications(res.data));
  }, []);

  const filtered = notifications.filter(
    (n) =>
      n.message.toLowerCase().includes(search.toLowerCase()) ||
      n.status.toLowerCase().includes(search.toLowerCase()) ||
      n.notificationType.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <BellIcon className="w-7 h-7 text-yellow-500" /> Notifications
      </h2>

      <input
        type="text"
        placeholder="Search notifications..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 focus:ring focus:ring-yellow-200"
      />

      <div className="bg-white rounded-lg shadow divide-y">
        {filtered.length === 0 && (
          <p className="p-4 text-gray-500">No notifications found</p>
        )}
        {filtered.map((n) => (
          <div
            key={n.notificationId}
            onClick={() => setSelected(n)}
            className="p-4 cursor-pointer hover:bg-yellow-50 transition"
          >
            <p className="font-medium">{n.message}</p>
            <p className="text-xs text-gray-400">
              {new Date(n.sentAt).toLocaleString()} • {n.status}
            </p>
          </div>
        ))}
      </div>

      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl w-[90%] max-w-md relative">
            <button
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              onClick={() => setSelected(null)}
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold mb-3 text-yellow-600">
              Notification Details
            </h3>
            <p><strong>Type:</strong> {selected.notificationType}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Message:</strong> {selected.message}</p>
            <p className="text-sm text-gray-500 mt-2">
              Sent at: {new Date(selected.sentAt).toLocaleString()}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
