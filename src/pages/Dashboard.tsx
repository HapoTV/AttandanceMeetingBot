import {
  CalendarDaysIcon,
  BellIcon,
  ClockIcon,
  VideoCameraIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { useNavigate } from "react-router-dom";

interface Meeting {
  meetingId: string;
  title?: string;
  dateTime: string;
}

interface Notification {
  notificationId: string;
  message: string;
  sentAt: string;
}

interface Reminder {
  reminderId: string;
  message: string;
  reminderTime: string;
}

const Dashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    meetings: 0,
    recordings: 0,
    users: 0,
  });

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [time, setTime] = useState(new Date());

  // Live time update every second
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    Promise.all([
      axiosClient.get("/meetings"),
      axiosClient.get("/recordings"),
      axiosClient.get("/users"),
      axiosClient.get("/notifications"),
      axiosClient.get("/reminders"),
    ])
      .then(([meetingsRes, recordingsRes, usersRes, notificationsRes, remindersRes]) => {
        setStats({
          meetings: meetingsRes.data.length,
          recordings: recordingsRes.data.length,
          users: usersRes.data.length,
        });
        setMeetings(meetingsRes.data);
        setNotifications(notificationsRes.data.slice(0, 3)); // show 3 latest
        setReminders(remindersRes.data.slice(0, 3));
      })
      .catch((err) => console.error(err));
  }, []);

  const upcomingMeetings = meetings
    .filter((m) => new Date(m.dateTime) > new Date())
    .sort(
      (a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
    )
    .slice(0, 5);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4 md:mb-0">
          Dashboard Overview
        </h1>
        <div className="bg-white px-5 py-3 rounded-xl shadow text-center">
          <p className="text-lg font-semibold text-gray-800">
            {time.toLocaleTimeString()}
          </p>
          <p className="text-sm text-gray-500">
            {time.toLocaleDateString(undefined, {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Middle Section */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Upcoming Meetings */}
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition">
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <CalendarDaysIcon className="w-10 h-10 text-blue-600" />
            Upcoming Meetings
          </h2>
          {upcomingMeetings.length === 0 ? (
            <p className="text-gray-500">No upcoming meetings.</p>
          ) : (
            <ul className="space-y-3">
              {upcomingMeetings.map((m) => (
                <li
                  key={m.meetingId}
                  className="border rounded-lg p-3 hover:bg-blue-50 transition"
                >
                  <p className="font-medium text-gray-800">
                    {m.title || "Untitled Meeting"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(m.dateTime).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Notifications */}
        <div
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
          onClick={() => navigate("/notifications")}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <BellIcon className="w-10 h-10 text-yellow-500" />
            New Notifications
          </h2>
          {notifications.length === 0 ? (
            <p className="text-gray-500">No new notifications.</p>
          ) : (
            <ul className="space-y-3">
              {notifications.map((n) => (
                <li
                  key={n.notificationId}
                  className="border rounded-lg p-3 hover:bg-yellow-50 transition"
                >
                  <p className="font-medium text-gray-800">{n.message}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(n.sentAt).toLocaleString()}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Reminders */}
        <div
          className="bg-white p-6 rounded-2xl shadow hover:shadow-lg cursor-pointer transition"
          onClick={() => navigate("/reminders")}
        >
          <h2 className="text-xl font-semibold flex items-center gap-2 mb-4">
            <ClockIcon className="w-10 h-10 text-indigo-600" />
            New Reminders
          </h2>
          {reminders.length === 0 ? (
            <p className="text-gray-500">No new reminders.</p>
          ) : (
            <ul className="space-y-3">
              {reminders.map((r) => (
                <li
                  key={r.reminderId}
                  className="border rounded-lg p-3 hover:bg-indigo-50 transition"
                >
                  <p className="font-medium text-gray-800">{r.message}</p>
                  <p className="text-xs text-gray-400">Time: {r.reminderTime}</p>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {/* Extra Cool Section - Quick Actions or Tips */}
      <div className="mt-8 bg-gradient-to-r from-indigo-500 to-blue-500 p-6 rounded-2xl text-white shadow-md">
        <h2 className="text-xl font-bold mb-2">✨ Quick Actions</h2>
        <p className="text-sm mb-4">
          Stay on top of your meetings and reminders. Click below to take action quickly.
        </p>
        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => navigate("/meetings")}
            className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-indigo-50"
          >
            View All Meetings
          </button>
          <button
            onClick={() => navigate("/agenda")}
            className="bg-white text-indigo-600 font-semibold px-4 py-2 rounded-lg shadow hover:bg-indigo-50"
          >
            View Agendas
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
