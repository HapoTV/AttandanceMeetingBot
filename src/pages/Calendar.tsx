import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { CalendarDaysIcon, ClockIcon, UserIcon } from "@heroicons/react/24/outline";

interface Meeting {
  id: string;
  name: string;
  description: string;
  dateTime: string;
  duration: number;
  status: string;
  userId: string;
  createdBy?: string;
}

const MeetingsCalendar: React.FC = () => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);

  useEffect(() => {
    axiosClient.get("/meetings").then((res) => setMeetings(res.data));
  }, []);

  const handleDateClick = (date: Date) => {
    setSelectedDate(date);
    const meeting = meetings.find(
      (m) => new Date(m.dateTime).toDateString() === date.toDateString()
    );
    setSelectedMeeting(meeting || null);
  };

  const tileContent = ({ date, view }: any) => {
    if (view === "month") {
      const hasMeeting = meetings.some(
        (m) => new Date(m.dateTime).toDateString() === date.toDateString()
      );
      if (hasMeeting) {
        const meeting = meetings.find(
          (m) => new Date(m.dateTime).toDateString() === date.toDateString()
        );
        return (
          <div
            className={`mt-1 w-2 h-2 rounded-full ${
              meeting && new Date(meeting.dateTime) < new Date()
                ? "bg-red-500"
                : "bg-blue-500"
            } mx-auto`}
          ></div>
        );
      }
    }
    return null;
  };

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-3xl font-bold text-indigo-600 flex items-center gap-2">
          <CalendarDaysIcon className="w-7 h-7" />
          Meetings Calendar
        </h2>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-2/3">
          <Calendar
            onClickDay={handleDateClick}
            tileContent={tileContent}
            className="rounded-lg border-0 w-full"
          />
        </div>

        <div className="bg-white p-6 rounded-xl shadow-md w-full lg:w-1/3">
          {selectedMeeting ? (
            <>
              <h3 className="text-xl font-bold mb-3">{selectedMeeting.name}</h3>
              <p className="text-gray-600 mb-2">{selectedMeeting.description}</p>
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <ClockIcon className="w-5 h-5 text-indigo-500" />
                <span>{new Date(selectedMeeting.dateTime).toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 mb-2">
                <UserIcon className="w-5 h-5 text-indigo-500" />
                <span>
                  Created by:{" "}
                  <span className="font-semibold">
                    {selectedMeeting.createdBy || selectedMeeting.userId}
                  </span>
                </span>
              </div>
              <span
                className={`inline-block px-3 py-1 rounded-lg text-sm font-semibold mt-2 ${
                  new Date(selectedMeeting.dateTime) < new Date()
                    ? "bg-red-100 text-red-600"
                    : "bg-blue-100 text-blue-600"
                }`}
              >
                {new Date(selectedMeeting.dateTime) < new Date()
                  ? "Previous Meeting"
                  : "Upcoming Meeting"}
              </span>
            </>
          ) : selectedDate ? (
            <p className="text-gray-500 italic">
              No meetings scheduled for {selectedDate.toDateString()}.
            </p>
          ) : (
            <p className="text-gray-400 italic">
              Click a date to view meeting details.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default MeetingsCalendar;
