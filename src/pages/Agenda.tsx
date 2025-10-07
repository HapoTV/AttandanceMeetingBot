import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { ClipboardDocumentListIcon, XMarkIcon } from "@heroicons/react/24/outline";

interface AgendaItem {
  agendaId: string;
  agendas: string;
  dateTime: string | null;
  meetingId: string;
  userId: string;
}

const Agenda: React.FC = () => {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<AgendaItem | null>(null);

  useEffect(() => {
    axiosClient.get("/agendas").then((res) => setAgenda(res.data));
  }, []);

  const filtered = agenda.filter((a) =>
    a.agendas.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-6 relative">
      <h2 className="text-2xl font-bold flex items-center gap-2 mb-4">
        <ClipboardDocumentListIcon className="w-7 h-7 text-indigo-600" />
        Meeting Agenda
      </h2>

      <input
        type="text"
        placeholder="Search agenda..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full p-2 border rounded-lg mb-4 focus:ring focus:ring-indigo-200"
      />

      <div className="bg-white rounded-lg shadow divide-y">
        {filtered.length === 0 && (
          <p className="p-4 text-gray-500">No agendas found</p>
        )}
        {filtered.map((a) => (
          <div
            key={a.agendaId}
            onClick={() => setSelected(a)}
            className="p-4 cursor-pointer hover:bg-indigo-50 transition"
          >
            <h3 className="font-semibold text-lg">{a.agendas}</h3>
            <p className="text-xs text-gray-500">
              {a.dateTime
                ? new Date(a.dateTime).toLocaleString()
                : "No date assigned"}
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
              Agenda Details
            </h3>
            <p><strong>Agenda:</strong> {selected.agendas}</p>
            <p><strong>Meeting ID:</strong> {selected.meetingId}</p>
            <p><strong>User ID:</strong> {selected.userId}</p>
            <p className="text-sm text-gray-500 mt-2">
              {selected.dateTime
                ? `Date: ${new Date(selected.dateTime).toLocaleString()}`
                : "No date set"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Agenda;
