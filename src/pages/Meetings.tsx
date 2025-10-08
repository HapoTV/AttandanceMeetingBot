import { useState, useEffect } from "react";
import {
  PlusIcon,
  VideoCameraIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";

interface Meeting {
  meetingId: string;
  name: string;
  description: string;
  dateTime: string;
  duration: number; // in seconds
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  userId: string;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("");
  const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479"; // logged-in user's ID

  const fetchMeetings = () => {
    axiosClient.get("/meetings").then((res) => setMeetings(res.data));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    const durationSeconds =
      parseInt(duration.split(":")[0]) * 3600 +
      parseInt(duration.split(":")[1]) * 60;

    axiosClient
      .post("/meetings", { name, description, dateTime, duration: durationSeconds })
      .then(() => {
        setShowForm(false);
        setName("");
        setDescription("");
        setDateTime("");
        setDuration("");
        fetchMeetings();
      })
      .catch((err) => console.error(err));
  };

  const handleDelete = (meetingId: string) => {
    axiosClient
      .delete(`/meetings/${meetingId}`)
      .then(fetchMeetings)
      .catch(console.error);
  };

  const handleStatusChange = (meetingId: string, status: string) => {
    axiosClient
      .put(`/meetings/${meetingId}/status`, { status })
      .then(fetchMeetings)
      .catch(console.error);
  };

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.dateTime) >= now);

  // ✅ Ensure previous meetings are marked COMPLETED unless CANCELLED
  const previousMeetings = meetings
    .filter((m) => new Date(m.dateTime) < now)
    .map((m) => ({
      ...m,
      status: m.status === "CANCELLED" ? "CANCELLED" : "COMPLETED",
    }));

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600)
      .toString()
      .padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60)
      .toString()
      .padStart(2, "0");
    return `${h}:${m}`;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "SCHEDULED":
        return "text-blue-600 bg-blue-100";
      case "ONGOING":
        return "text-green-600 bg-green-100";
      case "COMPLETED":
        return "text-gray-600 bg-gray-100";
      case "CANCELLED":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-500 bg-gray-100";
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
          <VideoCameraIcon className="w-8 h-8 text-blue-600" /> Meetings
        </h1>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 mr-2" /> Schedule Meeting
        </button>
      </div>

      {/* Upcoming Meetings */}
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Upcoming Meetings</h2>
      <div className="grid gap-4 mb-6">
        {upcomingMeetings.length === 0 && (
          <p className="text-gray-500">No upcoming meetings.</p>
        )}
        {upcomingMeetings.map((m) => (
          <div
            key={m.meetingId}
            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-lg">{m.name}</h3>
              <p className="text-sm text-gray-600">{m.description}</p>
              <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                <ClockIcon className="w-4 h-4" />
                {new Date(m.dateTime).toLocaleString()} • {formatDuration(m.duration)}
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                  m.status
                )}`}
              >
                {m.status}
              </span>

              {m.userId === userId && (
                <>
                  <select
                    value={m.status}
                    onChange={(e) =>
                      handleStatusChange(m.meetingId, e.target.value)
                    }
                    className="border rounded px-2 py-1 text-sm"
                  >
                    <option value="SCHEDULED">SCHEDULED</option>
                    <option value="ONGOING">ONGOING</option>
                    <option value="COMPLETED">COMPLETED</option>
                    <option value="CANCELLED">CANCELLED</option>
                  </select>

                  <PencilSquareIcon
                    className="w-5 h-5 text-indigo-500 cursor-pointer hover:text-indigo-700"
                    title="Edit"
                  />
                  <TrashIcon
                    onClick={() => handleDelete(m.meetingId)}
                    className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                    title="Delete"
                  />
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Toggle previous meetings */}
      <button
        onClick={() => setShowPrevious(!showPrevious)}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition"
      >
        {showPrevious ? "Hide Previous Meetings" : "Show Previous Meetings"}
      </button>

      {/* Previous Meetings Section */}
      {showPrevious && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Previous Meetings
          </h2>
          <div className="grid gap-4">
            {previousMeetings.length === 0 && (
              <p className="text-gray-500">No previous meetings.</p>
            )}
            {previousMeetings.map((m) => (
              <div
                key={m.meetingId}
                className="bg-white p-5 rounded-2xl shadow hover:shadow-md transition"
              >
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-gray-600">{m.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(m.dateTime).toLocaleString()} • {formatDuration(m.duration)}
                </p>
                <span
                  className={`mt-2 inline-block px-2 py-1 text-xs rounded-full ${getStatusColor(
                    m.status
                  )}`}
                >
                  {m.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Create Meeting Modal */}
      {showForm && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md relative">
            <button
              onClick={() => setShowForm(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-blue-600">
              Schedule New Meeting
            </h3>
            <form onSubmit={handleCreate} className="space-y-3">
              <input
                type="text"
                placeholder="Meeting Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full border rounded-lg p-2"
              />
              <textarea
                placeholder="Description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                className="w-full border rounded-lg p-2"
              />
              <input
                type="datetime-local"
                value={dateTime}
                onChange={(e) => setDateTime(e.target.value)}
                required
                className="w-full border rounded-lg p-2"
              />
              <input
                type="time"
                value={duration}
                onChange={(e) => setDuration(e.target.value)}
                required
                className="w-full border rounded-lg p-2"
              />
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Save Meeting
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;
