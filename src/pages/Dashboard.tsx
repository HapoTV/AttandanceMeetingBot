import { CalendarDaysIcon, VideoCameraIcon, UserGroupIcon } from "@heroicons/react/24/outline";
import { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";

const Dashboard = () => {
  const [stats, setStats] = useState({
    meetings: 0,
    recordings: 0,
    users: 0,
  });

  useEffect(() => {
    Promise.all([
      axiosClient.get("/meetings"),
      axiosClient.get("/recordings"),
      axiosClient.get("/users"),
    ])
      .then(([meetingsRes, recordingsRes, usersRes]) => {
        setStats({
          meetings: meetingsRes.data.length,
          recordings: recordingsRes.data.length,
          users: usersRes.data.length,
        });
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Dashboard Overview</h1>
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <CalendarDaysIcon className="w-10 h-10 text-blue-600" />
          <div>
            <h3 className="text-gray-500 text-sm">Meetings</h3>
            <p className="text-2xl font-semibold">{stats.meetings}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <VideoCameraIcon className="w-10 h-10 text-green-600" />
          <div>
            <h3 className="text-gray-500 text-sm">Recordings</h3>
            <p className="text-2xl font-semibold">{stats.recordings}</p>
          </div>
        </div>
        <div className="bg-white rounded-2xl shadow p-6 flex items-center gap-4">
          <UserGroupIcon className="w-10 h-10 text-purple-600" />
          <div>
            <h3 className="text-gray-500 text-sm">Users</h3>
            <p className="text-2xl font-semibold">{stats.users}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
