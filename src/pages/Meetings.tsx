import { useState, useEffect } from "react";
import { PlusIcon, VideoCameraIcon } from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";

interface Meeting {
  meetingId: string;
  name: string;
  dateTime: string;
  status: string;
}

const Meetings = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [name, setName] = useState("");
  const [dateTime, setDate] = useState("");

  const fetchMeetings = () => {
    axiosClient.get("/meetings").then((res) => setMeetings(res.data));
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    axiosClient
      .post("/meetings", { name, dateTime })
      .then(() => {
        setName("");
        setDate("");
        fetchMeetings();
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    fetchMeetings();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Meetings</h1>
        <button
          onClick={handleCreate}
          className="flex items-center bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition"
        >
          <PlusIcon className="w-5 h-5 mr-1" /> Schedule Meeting
        </button>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex gap-3 mb-6 bg-white p-4 rounded-2xl shadow"
      >
        <input
          type="text"
          placeholder="Meeting name"
          className="flex-1 border rounded p-2"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="date"
          className="border rounded p-2"
          value={dateTime}
          onChange={(e) => setDate(e.target.value)}
          required
        />
        <button
          type="submit"
          className="bg-green-500 text-white px-4 rounded hover:bg-green-600"
        >
          Add
        </button>
      </form>

      <div className="grid gap-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.meetingId}
            className="bg-white p-5 rounded-2xl shadow flex items-center justify-between hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold text-lg">{meeting.name}</h3>
              <p className="text-sm text-gray-500">
                {new Date(meeting.dateTime).toLocaleDateString()} —{" "}
                <span
                  className={`font-medium ${
                    meeting.status === "SCHEDULED"
                      ? "text-blue-600"
                      : "text-gray-500"
                  }`}
                >
                  {meeting.status}
                </span>
              </p>
            </div>
            <VideoCameraIcon className="w-6 h-6 text-blue-600" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meetings;
