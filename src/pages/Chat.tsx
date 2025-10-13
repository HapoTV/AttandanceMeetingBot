import React, { useEffect, useState } from "react";
import {
  ChatBubbleOvalLeftIcon,
  VideoCameraIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";

interface Chat {
  chatId: string;
  name?: string;
  participants: User[];
  lastMessage?: string;
  updatedAt?: string;
}

interface User {
  userId: string;
  fullName: string;
}

interface Message {
  messageId: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: string;
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [selectedChat, setSelectedChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [showCallMenu, setShowCallMenu] = useState(false);

  const userId = localStorage.getItem("userId");

  // 🔹 Fetch all chats for current user
  useEffect(() => {
    if (!userId) return;
    axiosClient
      .get(`/chat/user/${userId}`)
      .then((res) => {
        const sortedChats = res.data.sort(
          (a: Chat, b: Chat) =>
            new Date(b.updatedAt || "").getTime() -
            new Date(a.updatedAt || "").getTime()
        );
        setChats(sortedChats);
      })
      .catch((err) => console.error("Error fetching chats:", err));
  }, [userId]);

  // 🔹 Fetch messages of selected chat
  const fetchMessages = (chatId: string) => {
    axiosClient
      .get(`/chat/${chatId}/messages`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Error fetching messages:", err));
  };

  const handleChatClick = (chat: Chat) => {
    setSelectedChat(chat);
    fetchMessages(chat.chatId);
  };

  // 🔹 Send message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedChat || !userId) return;

    const params = new URLSearchParams({
      senderId: userId,
      content: newMessage.trim(),
    });

    axiosClient
      .post(`/chat/${selectedChat.chatId}/message?${params.toString()}`)
      .then((res) => {
        setMessages((prev) => [...prev, res.data]);
        setNewMessage("");
      })
      .catch((err) => console.error("Error sending message:", err));
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
        </div>
        <ul>
          {chats.map((chat) => (
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
                {chat.name
                  ? chat.name
                  : chat.participants
                      .filter((p) => p.userId !== userId)
                      .map((p) => p.fullName)
                      .join(", ")}
              </h3>
              <p className="text-sm text-gray-600 truncate">
                {chat.lastMessage || "No messages yet"}
              </p>
              <p className="text-xs text-gray-400">
                {chat.updatedAt
                  ? new Date(chat.updatedAt).toLocaleString()
                  : ""}
              </p>
            </li>
          ))}
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
                  {selectedChat.name
                    ? selectedChat.name
                    : selectedChat.participants
                        .filter((p) => p.userId !== userId)
                        .map((p) => p.fullName)
                        .join(", ")}
                </h2>
                <p className="text-sm text-gray-600">
                  {selectedChat.participants.length > 2
                    ? `${selectedChat.participants.length} members`
                    : "Direct Chat"}
                </p>
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
                    {msg.senderName} •{" "}
                    {new Date(msg.timestamp).toLocaleTimeString([], {
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
