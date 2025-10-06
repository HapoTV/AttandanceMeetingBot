import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { ClockIcon } from "@heroicons/react/24/outline";

interface Reminder {
  id: string;
  message: string;
  dateTime: string;
  users: { email: string }[];
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);

  useEffect(() => {
    axiosClient.get("/reminders").then((res) => setReminders(res.data));
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      reminders.forEach((r) => {
        const timeDiff = new Date(r.dateTime).getTime() - Date.now();
        if (timeDiff <= 3600000 && timeDiff > 1800000) {
          axiosClient.post("/notifications/alert", { message: `Meeting in 1 hour: ${r.message}` });
        } else if (timeDiff <= 1800000 && timeDiff > 0) {
          axiosClient.post("/notifications/alert", { message: `Meeting in 30 minutes: ${r.message}` });
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [reminders]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ClockIcon className="w-6 h-6 text-indigo-600" /> Reminders
      </h2>
      <p>Asandile!! Dont' forget to implement Reminders GET ALL Endpoint</p>

      <div className="mt-4 space-y-3">
        {reminders.map((r) => (
          <div key={r.id} className="p-4 bg-white shadow rounded-lg">
            <p className="font-semibold">{r.message}</p>
            <p className="text-sm text-gray-500">{new Date(r.dateTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Reminders;
