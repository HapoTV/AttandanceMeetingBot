import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  PlusIcon,
  VideoCameraIcon,
  PencilSquareIcon,
  TrashIcon,
  ClockIcon,
  XMarkIcon,
  ClipboardDocumentListIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

interface Meeting {
  meetingId: string;
  name: string;
  description: string;
  dateTime: string;
  duration: number;
  status: "SCHEDULED" | "ONGOING" | "COMPLETED" | "CANCELLED";
  userId: string;
  attendees?: string[];
}

interface Agenda {
  agendaId: string;
  agendas: string;
  dateTime: string | null;
  meetingId: string;
  userId: string;
}

const Meetings = () => {
  const navigate = useNavigate();
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [showPrevious, setShowPrevious] = useState(false);
  const [showAgendaModal, setShowAgendaModal] = useState(false);
  const [selectedMeetingAgendas, setSelectedMeetingAgendas] = useState<Agenda[]>([]);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [dateTime, setDateTime] = useState("");
  const [duration, setDuration] = useState("");
  const [createAgenda, setCreateAgenda] = useState(false);
  const [agendaText, setAgendaText] = useState("");
  const [attendees, setAttendees] = useState("");
  const { user } = useAuth();
  const userId = user?.userId || "";
  const role = user?.roleName || "";

  const canModifyAgenda = role === "ADMIN" || role === "MANAGER";

  const fetchMeetings = () => {
    axiosClient.get("/meetings").then((res) => setMeetings(res.data));
  };

  const fetchAgendas = () => {
    axiosClient.get("/agendas").then((res) => setAgendas(res.data));
  };

  useEffect(() => {
    fetchMeetings();
    fetchAgendas();
  }, []);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const durationSeconds =
        parseInt(duration.split(":")[0]) * 3600 +
        parseInt(duration.split(":")[1]) * 60;

      // Create meeting
      const meetingPayload = {
        userId,
        name,
        description,
        dateTime,
        duration: durationSeconds,
        attendees: attendees
          .split(",")
          .map((a) => a.trim())
          .filter((a) => a),
        status: "SCHEDULED",
      };

      const meetingRes = await axiosClient.post("/meetings", meetingPayload);
      const meetingId = meetingRes.data.meetingId;

      // Optionally create an agenda
      if (createAgenda && agendaText) {
        await axiosClient.post("/agendas", {
          agendas: agendaText,
          dateTime: dateTime, // Use meeting time for agenda
          meetingId,
          userId,
        });
      }

      setShowForm(false);
      setName("");
      setDescription("");
      setDateTime("");
      setDuration("");
      setAttendees("");
      setAgendaText("");
      setCreateAgenda(false);
      fetchMeetings();
      fetchAgendas();
    } catch (error) {
      console.error("Error creating meeting:", error);
    }
  };

  const handleDelete = (meetingId: string) => {
    axiosClient.delete(`/meetings/${meetingId}`).then(fetchMeetings);
  };

  const handleStatusChange = (meetingId: string, status: string) => {
    axiosClient.put(`/meetings/${meetingId}/status`, { status }).then(fetchMeetings);
  };

  const handleJoinMeeting = (meeting: Meeting) => {
    navigate(`/meeting-call/${meeting.meetingId}`, { 
      state: { 
        meeting,
        agendas: agendas.filter(a => a.meetingId === meeting.meetingId)
      }
    });
  };

  const handleViewAgenda = (meetingId: string) => {
    const meetingAgendas = agendas.filter(a => a.meetingId === meetingId);
    setSelectedMeetingAgendas(meetingAgendas);
    setShowAgendaModal(true);
  };

  const formatDuration = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, "0");
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, "0");
    const s = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${h}:${m}:${s}`;
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

  const now = new Date();
  const upcomingMeetings = meetings.filter((m) => new Date(m.dateTime) >= now);
  const previousMeetings = meetings
    .filter((m) => new Date(m.dateTime) < now)
    .map((m) => ({
      ...m,
      status: m.status === "CANCELLED" ? "CANCELLED" : "COMPLETED",
    }));

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
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

      {/* Upcoming */}
      <h2 className="text-xl font-semibold mb-3 text-gray-700">Upcoming Meetings</h2>
      <div className="grid gap-4 mb-6">
        {upcomingMeetings.length === 0 ? (
          <p className="text-gray-500">No upcoming meetings.</p>
        ) : (
          upcomingMeetings.map((m) => (
            <div
              key={m.meetingId}
              className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition"
            >
              <div className="flex items-center gap-3">
                {/* Join Meeting Icon */}
                <VideoCameraIcon
                  onClick={() => handleJoinMeeting(m)}
                  title="Join Meeting"
                  className="w-6 h-6 text-green-600 cursor-pointer hover:text-green-700"
                />
                <div>
                  <h3 className="font-semibold text-lg">{m.name}</h3>
                  <p className="text-sm text-gray-600">{m.description}</p>
                  <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                    <ClockIcon className="w-4 h-4" />
                    {new Date(m.dateTime).toLocaleString()}
                  </p>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <span
                  className={`px-2 py-1 text-xs rounded-full font-medium ${getStatusColor(
                    m.status
                  )}`}
                >
                  {m.status}
                </span>
                <span className="px-2 py-1 text-xs rounded-full text-gray-700 bg-gray-100 font-medium">
                  Duration: {formatDuration(m.duration)}
                </span>

                <div className="flex items-center gap-2">
                  {/* Agenda Button */}
                  <button
                    onClick={() => handleViewAgenda(m.meetingId)}
                    className="flex items-center gap-1 text-sm bg-indigo-100 text-indigo-700 px-2 py-1 rounded-lg hover:bg-indigo-200 transition"
                  >
                    <ClipboardDocumentListIcon className="w-4 h-4" />
                    Agenda
                  </button>

                  {/* Controls (only creator) */}
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

                      <PencilSquareIcon className="w-5 h-5 text-indigo-500 cursor-pointer hover:text-indigo-700" />
                      <TrashIcon
                        onClick={() => handleDelete(m.meetingId)}
                        className="w-5 h-5 text-red-500 cursor-pointer hover:text-red-700"
                      />
                    </>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Previous */}
      <button
        onClick={() => setShowPrevious(!showPrevious)}
        className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 rounded-lg transition"
      >
        {showPrevious ? "Hide Previous Meetings" : "Show Previous Meetings"}
      </button>

      {showPrevious && (
        <div className="mt-4">
          <h2 className="text-xl font-semibold mb-3 text-gray-700">
            Previous Meetings
          </h2>
          <div className="grid gap-4">
            {previousMeetings.map((m) => (
              <div key={m.meetingId} className="bg-white p-5 rounded-2xl shadow">
                <h3 className="font-semibold text-lg">{m.name}</h3>
                <p className="text-sm text-gray-600">{m.description}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {new Date(m.dateTime).toLocaleString()} •{" "}
                  {formatDuration(m.duration)}
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
              <input
                type="text"
                placeholder="Attendees (comma-separated IDs)"
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                className="w-full border rounded-lg p-2"
              />

              {/* Agenda Option */}
              <label className="flex items-center gap-2 mt-2">
                <input
                  type="checkbox"
                  checked={createAgenda}
                  onChange={(e) => setCreateAgenda(e.target.checked)}
                />
                <span>Create Agenda</span>
              </label>

              {createAgenda && (
                <div className="space-y-2 border-t pt-3">
                  <textarea
                    placeholder="Agenda details"
                    value={agendaText}
                    onChange={(e) => setAgendaText(e.target.value)}
                    className="w-full border rounded-lg p-2"
                  />
                </div>
              )}

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

      {/* Agenda Modal */}
      {showAgendaModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-2xl relative">
            <button
              onClick={() => setShowAgendaModal(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
            >
              <XMarkIcon className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-semibold mb-4 text-indigo-600">
              Meeting Agenda
            </h3>
            
            {selectedMeetingAgendas.length === 0 ? (
              <p className="text-gray-500">No agenda items for this meeting.</p>
            ) : (
              <div className="space-y-3">
                {selectedMeetingAgendas.map((agenda) => (
                  <div key={agenda.agendaId} className="border rounded-lg p-3">
                    <p className="text-gray-800">{agenda.agendas}</p>
                    {canModifyAgenda && (
                      <div className="flex justify-end gap-2 mt-2">
                        <PencilSquareIcon className="w-4 h-4 text-indigo-500 cursor-pointer" />
                        <TrashIcon className="w-4 h-4 text-red-500 cursor-pointer" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Meetings;