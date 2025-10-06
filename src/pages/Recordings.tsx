import { useEffect, useState } from "react";
import { ArrowUpTrayIcon, PlayCircleIcon } from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";

interface Recording {
  recordId: string;
  name: string;
  fileUrl: string;
  meetingId: string;
}

const Recordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [meetingId, setMeetingId] = useState("");

  const fetchRecordings = () => {
    axiosClient.get("/recordings").then((res) => setRecordings(res.data));
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return alert("Please select a file");

    const formData = new FormData();
    formData.append("name", name);
    formData.append("meetingId", meetingId);
    formData.append("file", file);

    try {
      await axiosClient.post("/recordings/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fetchRecordings();
      setFile(null);
      setName("");
      setMeetingId("");
    } catch (error) {
      console.error(error);
      alert("Upload failed");
    }
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <h1 className="text-2xl font-bold mb-6">Recordings</h1>
      <p>Asandile!! Dont' forget to implement Recording GET ALL Endpoint</p>

      <form
        onSubmit={handleUpload}
        className="bg-white p-5 rounded-2xl shadow mb-6 flex gap-3 flex-wrap"
      >
        <input
          type="text"
          placeholder="Recording name"
          className="border p-2 rounded flex-1"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Meeting ID"
          className="border p-2 rounded flex-1"
          value={meetingId}
          onChange={(e) => setMeetingId(e.target.value)}
          required
        />
        <input
          type="file"
          className="border p-2 rounded flex-1"
          accept="video/*,image/*"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 flex items-center"
        >
          <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
          Upload
        </button>
      </form>

      <div className="grid gap-4">
        {recordings.map((rec) => (
          <div
            key={rec.recordId}
            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition"
          >
            <div>
              <h3 className="font-semibold">{rec.name}</h3>
              <p className="text-sm text-gray-500">{rec.meetingId}</p>
            </div>
            <a
              href={rec.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:text-blue-700"
            >
              <PlayCircleIcon className="w-6 h-6 mr-1" /> View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Recordings;
