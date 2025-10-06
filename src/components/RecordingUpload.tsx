import { useState } from "react";
import { uploadRecording } from "../api/recordings";

const RecordingUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    try {
      await uploadRecording(file);
      alert("Upload successful!");
    } catch (err) {
      alert("Upload failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-3">Upload New Recording</h2>
      <input
        type="file"
        accept="audio/*,video/*"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
        className="mb-4 block"
      />
      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 disabled:bg-gray-400"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
};

export default RecordingUpload;
