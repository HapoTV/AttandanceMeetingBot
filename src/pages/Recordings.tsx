import { useEffect, useState, useRef } from "react";
import {
  PlayCircleIcon,
  ArrowDownTrayIcon,
  XMarkIcon,
  ArrowsPointingOutIcon,
  ArrowsPointingInIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";

interface Recording {
  recordId: string;
  name: string;
  fileUrl: string;
  meetingId: string;
}

const Recordings = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<Recording | null>(null);
  const [playing, setPlaying] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);

  const fetchRecordings = () => {
    axiosClient.get("/recordings").then((res) => setRecordings(res.data));
  };

  useEffect(() => {
    fetchRecordings();
  }, []);

  // Filtered recordings
  const filtered = recordings.filter((r) =>
    r.name.toLowerCase().includes(search.toLowerCase())
  );

  // Video controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    if (playing) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setPlaying(!playing);
  };

  const skip = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime += seconds;
    }
  };

  const toggleFullscreen = () => {
    if (!videoRef.current) return;
    if (!document.fullscreenElement) {
      videoRef.current.requestFullscreen();
      setFullscreen(true);
    } else {
      document.exitFullscreen();
      setFullscreen(false);
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen relative">
      <h1 className="text-2xl font-bold mb-6">Recordings</h1>

      {/* 🔍 Search bar */}
      <input
        type="text"
        placeholder="Search recordings..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-3 mb-6 border rounded-xl shadow-sm focus:ring focus:ring-blue-200"
      />

      {/* 🎥 Upload Section (Commented Out)
      <form
        onSubmit={handleUpload}
        className="bg-white p-5 rounded-2xl shadow mb-6 flex gap-3 flex-wrap"
      >
        ...
      </form>
      */}

      <div className="grid gap-4">
        {filtered.length === 0 && (
          <p className="text-gray-500">No recordings found.</p>
        )}

        {filtered.map((rec) => (
          <div
            key={rec.recordId}
            className="bg-white p-5 rounded-2xl shadow flex justify-between items-center hover:shadow-md transition cursor-pointer"
            onClick={() => setSelected(rec)}
          >
            <div>
              <h3 className="font-semibold">{rec.name}</h3>
              <p className="text-sm text-gray-500">{rec.meetingId}</p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setSelected(rec);
                  setPlaying(false);
                }}
                className="bg-blue-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-blue-700"
              >
                <PlayCircleIcon className="w-5 h-5 mr-1" /> Play
              </button>

              <a
                href={rec.fileUrl}
                download
                onClick={(e) => e.stopPropagation()}
                className="bg-green-600 text-white px-3 py-2 rounded-lg flex items-center hover:bg-green-700"
              >
                <ArrowDownTrayIcon className="w-5 h-5 mr-1" /> Download
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* 🎞️ Popup modal for video & details */}
      {selected && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-2xl w-[90%] max-w-3xl relative p-5">
            {/* Close and fullscreen buttons */}
            <div className="absolute top-3 right-3 flex gap-3">
              <button
                onClick={toggleFullscreen}
                className="text-gray-500 hover:text-black"
              >
                {fullscreen ? (
                  <ArrowsPointingInIcon className="w-6 h-6" />
                ) : (
                  <ArrowsPointingOutIcon className="w-6 h-6" />
                )}
              </button>
              <button
                onClick={() => setSelected(null)}
                className="text-gray-500 hover:text-red-500"
              >
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            {/* Video Player */}
            <video
              ref={videoRef}
              src={selected.fileUrl}
              controls={false}
              className="w-full rounded-xl mb-4 bg-black"
            />

            {/* Video Controls */}
            <div className="flex justify-center gap-4 mb-4">
              <button
                onClick={() => skip(-10)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                ⏪ 10s
              </button>
              <button
                onClick={togglePlay}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                {playing ? "Pause" : "Play"}
              </button>
              <button
                onClick={() => skip(10)}
                className="bg-gray-200 px-4 py-2 rounded-lg hover:bg-gray-300"
              >
                10s ⏩
              </button>
            </div>

            {/* Recording Details */}
            <div className="text-gray-700 space-y-1">
              <p><strong>Name:</strong> {selected.name}</p>
              <p><strong>Meeting ID:</strong> {selected.meetingId}</p>
              <p><strong>File URL:</strong> {selected.fileUrl}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Recordings;
