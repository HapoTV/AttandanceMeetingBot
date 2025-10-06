import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";

interface AgendaItem {
  id: string;
  title: string;
  description: string;
  meetingId: string;
}

const Agenda: React.FC = () => {
  const [agenda, setAgenda] = useState<AgendaItem[]>([]);

  useEffect(() => {
    axiosClient.get("/agendas").then((res) => setAgenda(res.data));
  }, []);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold flex items-center gap-2">
        <ClipboardDocumentListIcon className="w-6 h-6 text-indigo-600" />
        Meeting Agenda
      </h2>

      <div className="mt-4 bg-white shadow rounded-lg divide-y">
        {agenda.map((a) => (
          <div key={a.id} className="p-4">
            <h3 className="font-semibold text-lg">{a.title}</h3>
            <p className="text-gray-600 text-sm">{a.description}</p>
            <p className="text-xs text-gray-400 mt-1">Meeting ID: {a.meetingId}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agenda;
