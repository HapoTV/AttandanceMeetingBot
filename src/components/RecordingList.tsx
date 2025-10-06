import { useEffect, useState } from "react";
import { fetchRecordings } from "../api/recordings";

interface Recording {
  id: string;
  fileName: string;
  fileUrl: string;
  createdAt: string;
}

const RecordingList = () => {
  const [recordings, setRecordings] = useState<Recording[]>([]);

  useEffect(() => {
    fetchRecordings().then(setRecordings);
  }, []);

  return (
    <div className="mt-6 bg-white p-6 rounded-2xl shadow">
      <h2 className="text-xl font-semibold mb-4">All Recordings</h2>
      <div className="space-y-4">
        {recordings.map((r) => (
          <div
            key={r.id}
            className="flex justify-between items-center p-3 border rounded-lg hover:bg-gray-50"
          >
            <div>
              <p className="font-medium text-gray-800">{r.fileName}</p>
              <p className="text-sm text-gray-500">
                Uploaded on {new Date(r.createdAt).toLocaleString()}
              </p>
            </div>
            <a
              href={r.fileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-600 hover:underline"
            >
              View
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecordingList;
