import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
  PhoneXMarkIcon,
  VideoCameraIcon,
  VideoCameraSlashIcon,
  MicrophoneIcon,
  HandRaisedIcon,
 // ShareScreenIcon,
  ChatBubbleLeftRightIcon,
  ClipboardDocumentListIcon,
  XMarkIcon,
  PaperClipIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";
import { useAuth } from "../context/AuthContext";

interface Participant {
  userId: string;
  name: string;
  isVideoOn: boolean;
  isAudioOn: boolean;
  isHandRaised: boolean;
  isSpeaking: boolean;
}

interface Message {
  id: string;
  userId: string;
  userName: string;
  content: string;
  timestamp: Date;
  file?: {
    name: string;
    url: string;
    type: string;
  };
}

interface Agenda {
  agendaId: string;
  agendas: string;
  dateTime: string | null;
  meetingId: string;
  userId: string;
}

const MeetingCall: React.FC = () => {
  const { meetingId } = useParams<{ meetingId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const meeting = location.state?.meeting;
  const agendas: Agenda[] = location.state?.agendas || [];

  const [participants, setParticipants] = useState<Participant[]>([]);
  const [isVideoOn, setIsVideoOn] = useState(true);
  const [isAudioOn, setIsAudioOn] = useState(true);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [activeTab, setActiveTab] = useState<"video" | "chat" | "agenda">("video");
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [fileUpload, setFileUpload] = useState<File | null>(null);
  const [reactions, setReactions] = useState<{ [key: string]: string }>({});

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Initialize participants
  useEffect(() => {
    if (meeting?.attendees && user) {
      const initialParticipants: Participant[] = [
        {
          userId: user.userId,
          name: user.name || "You",
          isVideoOn: true,
          isAudioOn: true,
          isHandRaised: false,
          isSpeaking: false,
        },
        ...meeting.attendees.map((attendeeId: string) => ({
          userId: attendeeId,
          name: `User ${attendeeId.slice(0, 8)}`,
          isVideoOn: Math.random() > 0.5,
          isAudioOn: Math.random() > 0.5,
          isHandRaised: false,
          isSpeaking: false,
        })),
      ];
      setParticipants(initialParticipants);
    }
  }, [meeting, user]);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  const toggleVideo = () => {
    setIsVideoOn(!isVideoOn);
    setParticipants(prev =>
      prev.map(p =>
        p.userId === user?.userId ? { ...p, isVideoOn: !isVideoOn } : p
      )
    );
  };

  const toggleAudio = () => {
    setIsAudioOn(!isAudioOn);
    setParticipants(prev =>
      prev.map(p =>
        p.userId === user?.userId ? { ...p, isAudioOn: !isAudioOn } : p
      )
    );
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    setParticipants(prev =>
      prev.map(p =>
        p.userId === user?.userId ? { ...p, isHandRaised: !isHandRaised } : p
      )
    );
  };

  const toggleScreenShare = () => {
    setIsScreenSharing(!isScreenSharing);
  };

  const handleEndCall = () => {
    navigate(-1);
  };

  const sendMessage = () => {
    if (!newMessage.trim() && !fileUpload) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      userId: user?.userId || "",
      userName: user?.name || "You",
      content: newMessage,
      timestamp: new Date(),
    };

    if (fileUpload) {
      newMsg.file = {
        name: fileUpload.name,
        url: URL.createObjectURL(fileUpload),
        type: fileUpload.type,
      };
    }

    setMessages(prev => [...prev, newMsg]);
    setNewMessage("");
    setFileUpload(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFileUpload(e.target.files[0]);
    }
  };

  const addReaction = (reaction: string) => {
    setReactions(prev => ({
      ...prev,
      [user?.userId || ""]: reaction,
    }));

    // Remove reaction after 3 seconds
    setTimeout(() => {
      setReactions(prev => {
        const newReactions = { ...prev };
        delete newReactions[user?.userId || ""];
        return newReactions;
      });
    }, 3000);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const renderVideoGrid = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {participants.map((participant) => (
        <div
          key={participant.userId}
          className={`relative bg-gray-800 rounded-lg aspect-video flex items-center justify-center ${
            participant.isSpeaking ? "ring-2 ring-green-400" : ""
          }`}
        >
          {/* Participant Video/Placeholder */}
          {participant.isVideoOn ? (
            <div className="w-full h-full bg-gray-700 rounded-lg flex items-center justify-center">
              <VideoCameraIcon className="w-8 h-8 text-gray-400" />
            </div>
          ) : (
            <div className="w-24 h-24 bg-gray-600 rounded-full flex items-center justify-center">
              <span className="text-white text-lg font-semibold">
                {participant.name.charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {/* Participant Info */}
          <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {participant.name}
            {participant.userId === user?.userId && " (You)"}
          </div>

          {/* Status Icons */}
          <div className="absolute top-2 right-2 flex gap-1">
            {!participant.isAudioOn && (
              <MicrophoneIcon className="w-4 h-4 text-red-400" />
            )}
            {participant.isHandRaised && (
              <HandRaisedIcon className="w-4 h-4 text-yellow-400" />
            )}
          </div>

          {/* Reaction */}
          {reactions[participant.userId] && (
            <div className="absolute top-2 left-2 text-2xl">
              {reactions[participant.userId]}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderChat = () => (
    <div className="flex flex-col h-full">
      <div
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.userId === user?.userId ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-xs lg:max-w-md rounded-lg p-3 ${
                message.userId === user?.userId
                  ? "bg-blue-600 text-white"
                  : "bg-gray-200 text-gray-800"
              }`}
            >
              <div className="font-semibold text-sm">
                {message.userName}
              </div>
              {message.file && (
                <div className="mt-2 p-2 bg-white/20 rounded">
                  <div className="flex items-center gap-2">
                    <PaperClipIcon className="w-4 h-4" />
                    <span className="text-sm truncate">{message.file.name}</span>
                  </div>
                  {message.file.type.startsWith('image/') && (
                    <img
                      src={message.file.url}
                      alt={message.file.name}
                      className="mt-2 rounded max-w-full h-auto"
                    />
                  )}
                </div>
              )}
              {message.content && (
                <p className="mt-1 whitespace-pre-wrap">{message.content}</p>
              )}
              <div className="text-xs opacity-70 mt-1">
                {message.timestamp.toLocaleTimeString()}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Message Input */}
      <div className="border-t p-4">
        {fileUpload && (
          <div className="flex items-center justify-between bg-gray-100 p-2 rounded mb-2">
            <div className="flex items-center gap-2">
              <PaperClipIcon className="w-4 h-4 text-gray-600" />
              <span className="text-sm truncate">{fileUpload.name}</span>
            </div>
            <button
              onClick={() => setFileUpload(null)}
              className="text-gray-500 hover:text-gray-700"
            >
              <XMarkIcon className="w-4 h-4" />
            </button>
          </div>
        )}
        <div className="flex gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-2 text-gray-600 hover:text-gray-800"
          >
            <PaperClipIcon className="w-5 h-5" />
          </button>
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="flex-1 border rounded-lg p-2 resize-none focus:ring focus:ring-blue-200"
            rows={2}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );

  const renderAgenda = () => (
    <div className="p-4 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold mb-4">Meeting Agenda</h3>
      {agendas.length === 0 ? (
        <p className="text-gray-500">No agenda items for this meeting.</p>
      ) : (
        <div className="space-y-3">
          {agendas.map((agenda, index) => (
            <div key={agenda.agendaId} className="border rounded-lg p-4">
              <div className="flex justify-between items-start">
                <h4 className="font-semibold">Item {index + 1}</h4>
                {agenda.dateTime && (
                  <span className="text-sm text-gray-500">
                    {new Date(agenda.dateTime).toLocaleTimeString()}
                  </span>
                )}
              </div>
              <p className="mt-2 text-gray-700">{agenda.agendas}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-900 flex flex-col">
      {/* Header */}
      <div className="bg-gray-800 text-white p-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold">{meeting?.name || "Meeting"}</h1>
          <p className="text-sm text-gray-300">
            {participants.length} participants
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm">
            {new Date().toLocaleTimeString()}
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Video/Content Area */}
        <div className="flex-1 flex flex-col">
          {/* Tab Navigation */}
          <div className="bg-gray-800 border-b border-gray-700">
            <div className="flex">
              <button
                onClick={() => setActiveTab("video")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "video"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Video
              </button>
              <button
                onClick={() => setActiveTab("chat")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "chat"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Chat
              </button>
              <button
                onClick={() => setActiveTab("agenda")}
                className={`px-4 py-2 font-medium ${
                  activeTab === "agenda"
                    ? "text-white border-b-2 border-blue-500"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                Agenda
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 bg-gray-900">
            {activeTab === "video" && renderVideoGrid()}
            {activeTab === "chat" && renderChat()}
            {activeTab === "agenda" && renderAgenda()}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-gray-800 p-4">
        <div className="flex justify-center items-center gap-4">
          {/* Audio Control */}
          <button
            onClick={toggleAudio}
            className={`p-3 rounded-full ${
              isAudioOn ? "bg-gray-600 text-white" : "bg-red-600 text-white"
            } hover:bg-opacity-80 transition`}
          >
            {isAudioOn ? (
              <MicrophoneIcon className="w-6 h-6" />
            ) : (
              <MicrophoneIcon className="w-6 h-6" />
            )}
          </button>

          {/* Video Control */}
          <button
            onClick={toggleVideo}
            className={`p-3 rounded-full ${
              isVideoOn ? "bg-gray-600 text-white" : "bg-red-600 text-white"
            } hover:bg-opacity-80 transition`}
          >
            {isVideoOn ? (
              <VideoCameraIcon className="w-6 h-6" />
            ) : (
              <VideoCameraSlashIcon className="w-6 h-6" />
            )}
          </button>

          {/* Screen Share */}
          <button
            onClick={toggleScreenShare}
            className={`p-3 rounded-full ${
              isScreenSharing ? "bg-blue-600 text-white" : "bg-gray-600 text-white"
            } hover:bg-opacity-80 transition`}
          >
          {/*  <ShareScreenIcon className="w-6 h-6" /> */}
          </button>

          {/* Raise Hand */}
          <button
            onClick={toggleHandRaise}
            className={`p-3 rounded-full ${
              isHandRaised ? "bg-yellow-600 text-white" : "bg-gray-600 text-white"
            } hover:bg-opacity-80 transition`}
          >
            <HandRaisedIcon className="w-6 h-6" />
          </button>

          {/* Reactions */}
          <div className="relative group">
            <button className="p-3 rounded-full bg-gray-600 text-white hover:bg-gray-500 transition">
              <FaceSmileIcon className="w-6 h-6" />
            </button>
            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 hidden group-hover:flex bg-gray-700 rounded-lg p-2 gap-1">
              {["👍", "👎", "😄", "🎉", "🤔", "👏"].map((reaction) => (
                <button
                  key={reaction}
                  onClick={() => addReaction(reaction)}
                  className="text-2xl hover:scale-110 transition"
                >
                  {reaction}
                </button>
              ))}
            </div>
          </div>

          {/* End Call */}
          <button
            onClick={handleEndCall}
            className="p-3 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
          >
            <PhoneXMarkIcon className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetingCall;