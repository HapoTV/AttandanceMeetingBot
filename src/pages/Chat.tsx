import React, { useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  VideoCameraIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";

interface ChatDTO {
  chatId: string;
  name: string;
  participantIds: string[];
}

interface MessageDTO {
  messageId: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [showCallMenu, setShowCallMenu] = useState(false);
  const { user } = useAuth();
  const userId = user?.userId || "";

  // 🔹 Method: Fetch all chats for current user
  const loadChats = async () => {
    if (!userId) {
      console.error("⚠️ No userId found in localStorage.");
      return;
    }

    try {
      const res = await axiosClient.get(`/chat/user/${userId}`);
      console.log("📩 Chat list:", res.data);
      const chats: ChatDTO[] = res.data;

      // Fetch names for participants
      const uniqueIds = Array.from(new Set(chats.flatMap((c) => c.participantIds)));
      const userResponses = await Promise.all(
        uniqueIds.map((id) =>
          axiosClient
            .get(`/users/${id}`)
            .then((r) => ({ id, name: r.data.fullName }))
            .catch(() => ({ id, name: "Unknown User" }))
        )
      );

      const map: Record<string, string> = {};
      userResponses.forEach((u) => (map[u.id] = u.name));
      setUserMap(map);

      setChats(chats);
    } catch (err) {
      console.error("❌ Error fetching chats:", err);
    }
  };

  // 🔹 Method: Fetch messages for a chat
  const fetchMessages = async (chatId: string) => {
    try {
      const res = await axiosClient.get(`/chat/${chatId}/messages`);
      console.log("💬 Messages for chat:", res.data);
      setMessages(res.data);
    } catch (err) {
      console.error("❌ Error fetching messages:", err);
    }
  };

  // 🔹 Handle selecting a chat
  const handleChatClick = (chat: ChatDTO) => {
    setSelectedChat(chat);
    fetchMessages(chat.chatId);
  };

  // 🔹 Send a message
  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedChat || !userId) return;

    const params = new URLSearchParams({
      senderId: userId,
      content: newMessage.trim(),
    });

    try {
      const res = await axiosClient.post(
        `/chat/${selectedChat.chatId}/message?${params.toString()}`
      );
      console.log("📨 Sent message:", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Left Side - Chat List */}
      <div className="w-1/3 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-indigo-600" />
            Chats
          </h2>

          {/* Manual refresh button */}
          <button
            onClick={loadChats}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            Load Chats
          </button>
        </div>

        <ul>
          {chats.length === 0 ? (
            <p className="p-4 text-gray-400 text-sm">No chats available</p>
          ) : (
            chats.map((chat) => (
              <li
                key={chat.chatId}
                onClick={() => handleChatClick(chat)}
                className={`p-4 cursor-pointer hover:bg-indigo-50 ${
                  selectedChat?.chatId === chat.chatId
                    ? "bg-indigo-100 border-l-4 border-indigo-600"
                    : ""
                }`}
              >
                <h3 className="font-semibold">
                  {chat.name ||
                    chat.participantIds
                      .filter((id) => id !== userId)
                      .map((id) => userMap[id] || id)
                      .join(", ")}
                </h3>
              </li>
            ))
          )}
        </ul>
      </div>

      {/* Right Side - Chat Window */}
      <div className="flex-1 flex flex-col bg-white">
        {selectedChat ? (
          <>
            {/* Top Navbar */}
            <div className="flex items-center justify-between p-4 border-b border-gray-300 bg-indigo-50">
              <div>
                <h2 className="text-lg font-semibold">
                  {selectedChat.name ||
                    selectedChat.participantIds
                      .filter((id) => id !== userId)
                      .map((id) => userMap[id] || id)
                      .join(", ")}
                </h2>
              </div>

              {/* Call Menu */}
              <div className="relative">
                <button
                  onClick={() => setShowCallMenu(!showCallMenu)}
                  className="flex items-center gap-1 text-indigo-700 hover:text-indigo-900 focus:outline-none"
                >
                  <PhoneIcon className="w-6 h-6" />
                  <EllipsisVerticalIcon className="w-5 h-5" />
                </button>

                {showCallMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                    <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left">
                      <PhoneIcon className="w-5 h-5 text-green-500" />
                      Voice Call
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 w-full hover:bg-gray-100 text-left">
                      <VideoCameraIcon className="w-5 h-5 text-blue-500" />
                      Video Call
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {messages.map((msg) => (
                <div
                  key={msg.messageId}
                  className={`flex flex-col ${
                    msg.senderId === userId
                      ? "items-end text-right"
                      : "items-start text-left"
                  }`}
                >
                  <div
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      msg.senderId === userId
                        ? "bg-indigo-500 text-white"
                        : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    {msg.senderName || userMap[msg.senderId] || "Unknown"} •{" "}
                    {new Date(msg.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-300 flex items-center gap-2 bg-white">
              <input
                type="text"
                placeholder="Type a message..."
                className="flex-1 p-3 border rounded-2xl focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              />
              <button
                onClick={handleSendMessage}
                className="bg-indigo-600 text-white px-4 py-2 rounded-2xl hover:bg-indigo-700 transition"
              >
                Send
              </button>
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Chat;
