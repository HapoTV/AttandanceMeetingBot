import React, { useEffect, useState } from "react";
import { BellIcon } from "@heroicons/react/24/solid";
import axiosClient from "../api/axiosClient";

interface Notification {
  id: string;
  message: string;
  timestamp: string;
}

const Messages: React.FC = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    axiosClient.get("/notifications").then((res) => setNotifications(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <BellIcon className="w-6 h-6 text-yellow-500" /> Messages
      </h2>
      <div className="mt-4 bg-white rounded-lg shadow divide-y">
        {notifications.length === 0 && (
          <p className="p-4 text-gray-500">No notifications</p>
        )}
        {notifications.map((n) => (
          <div key={n.id} className="p-4 hover:bg-gray-50">
            <p className="font-medium">{n.message}</p>
            <p className="text-xs text-gray-400">{n.timestamp}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Messages;
