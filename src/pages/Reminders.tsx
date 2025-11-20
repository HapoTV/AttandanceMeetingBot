import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { ClockIcon, XMarkIcon, PlusIcon } from "@heroicons/react/24/outline";

interface Reminder {
  reminderId: string;
  userId: string;
  reminderTime: string;
  status: string;
  message: string;
}

const Reminders: React.FC = () => {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Reminder | null>(null);

  useEffect(() => {
    axiosClient.get("/reminders").then((res) => setReminders(res.data));
  }, []);

  const filtered = reminders.filter((r) =>
    r.message.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddReminder = () => {
    // Implement your add reminder logic here
    console.log("Add Reminder clicked");
    // You can open a modal, navigate to a form, or show a dialog for creating new reminders
  };

  return (
    <div className="p-6 relative">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <ClockIcon className="w-7 h-7 text-indigo-600" /> Reminders
        </h2>
        
        <button
          onClick={handleAddReminder}
          className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <PlusIcon className="w-5 h-5" />
          Add Reminder
        </button>
      </div>

      <input
        type="text"
        placeholder="Search reminders..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 focus:ring focus:ring-indigo-200"
      />

      <div className="bg-white rounded-lg shadow divide-y">
        {filtered.length === 0 && (
          <p className="p-4 text-gray-500">No reminders found</p>
        )}
        {filtered.map((r) => (
          <div
            key={r.reminderId}
            onClick={() => setSelected(r)}
            className="p-4 cursor-pointer hover:bg-indigo-50 transition"
          >
            <p className="font-semibold">{r.message}</p>
            <p className="text-xs text-gray-500">
              Time: {r.reminderTime} • {r.status}
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
            <h3 className="text-xl font-bold mb-3 text-indigo-600">
              Reminder Details
            </h3>
            <p><strong>Message:</strong> {selected.message}</p>
            <p><strong>Status:</strong> {selected.status}</p>
            <p><strong>Reminder Time:</strong> {selected.reminderTime}</p>
            <p><strong>User ID:</strong> {selected.userId}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Reminders;