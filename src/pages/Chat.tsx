import React, { useState, useEffect } from "react";
import {
  ChatBubbleOvalLeftIcon,
  VideoCameraIcon,
  PhoneIcon,
  EllipsisVerticalIcon,
  MagnifyingGlassIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import axiosClient from "../api/axiosClient";
import { useAuth } from "../context/AuthContext";
import companyLogo from '../assets/hapo_technology_logo.jpg';

interface ChatDTO {
  chatId: string;
  name: string;
  participantIds: string[];
  lastMessageTime?: string;
}

interface MessageDTO {
  messageId: string;
  chatId: string;
  senderId: string;
  senderName: string;
  content: string;
  createdAt: string;
}

interface User {
  userId: string;
  name?: string;
  fullName?: string;
  email?: string;
  roleName?: string;
  role?: string;
  status?: string;
  department?: string;
}

const Chat: React.FC = () => {
  const [chats, setChats] = useState<ChatDTO[]>([]);
  const [selectedChat, setSelectedChat] = useState<ChatDTO | null>(null);
  const [messages, setMessages] = useState<MessageDTO[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [userMap, setUserMap] = useState<Record<string, string>>({});
  const [showCallMenu, setShowCallMenu] = useState(false);
  const [showChatDetails, setShowChatDetails] = useState(false);
  const [showNewChat, setShowNewChat] = useState(false);
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
  const { user } = useAuth();
  const userId = user?.userId || "";

  // 🔹 Auto-load chats on component mount
  useEffect(() => {
    if (userId) {
      loadChats();
      loadAllUsers();
    }
  }, [userId]);

  // 🔹 Method: Fetch all chats for current user
  const loadChats = async () => {
    if (!userId) {
      console.error("⚠️ No userId found.");
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
            .then((r) => ({ id, name: r.data.name || r.data.fullName || "Unknown User" }))
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

  // 🔹 Method: Fetch all users for new chat
  const loadAllUsers = async () => {
    try {
      const res = await axiosClient.get('/users');
      console.log("👥 All users:", res.data);
      setAllUsers(res.data);
    } catch (err) {
      console.error("❌ Error fetching users:", err);
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

    try {
      const res = await axiosClient.post(
        `/chat/${selectedChat.chatId}/message`,
        {
          senderId: userId,
          content: newMessage.trim()
        }
      );
      console.log("📨 Sent message:", res.data);
      setMessages((prev) => [...prev, res.data]);
      setNewMessage("");
      // Refresh chats to update last message time
      loadChats();
    } catch (err) {
      console.error("❌ Error sending message:", err);
    }
  };

  // 🔹 Create new chat
  const handleCreateChat = async () => {
    if (selectedUsers.length === 0) return;

    try {
      const participantIds = [userId, ...selectedUsers.map(u => u.userId)];
      const chatName = selectedUsers.map(u => getUserDisplayName(u)).join(', ');

      const res = await axiosClient.post('/chat/create', {
        name: chatName,
        participantIds: participantIds
      });

      setShowNewChat(false);
      setSelectedUsers([]);
      setSearchTerm("");
      loadChats();
      console.log("✅ New chat created:", res.data);
    } catch (err) {
      console.error("❌ Error creating chat:", err);
    }
  };

  // 🔹 Format time display
  const formatMessageTime = (timestamp: string) => {
    if (!timestamp) return '';
    
    const messageTime = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now.getTime() - messageTime.getTime()) / (1000 * 60 * 60);

    if (diffInHours < 24) {
      return messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } else {
      return messageTime.toLocaleDateString() + ' ' + messageTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
  };

  // 🔹 Get user display name with fallback
  const getUserDisplayName = (user: User): string => {
    return user?.name || user?.fullName || 'Unknown User';
  };

  // 🔹 Get user email with fallback
  const getUserEmail = (user: User): string => {
    return user?.email || 'No email';
  };

  // 🔹 Get user role with fallback
  const getUserRole = (user: User): string => {
    return user?.roleName || user?.role || 'No role';
  };

  // 🔹 Filter users for new chat with safe property access
  const filteredUsers = allUsers.filter(user => {
    if (!user || !user.userId) return false;
    if (user.userId === userId) return false;

    const displayName = getUserDisplayName(user).toLowerCase();
    const email = getUserEmail(user).toLowerCase();
    const role = getUserRole(user).toLowerCase();
    const searchLower = searchTerm.toLowerCase();

    return displayName.includes(searchLower) ||
           email.includes(searchLower) ||
           role.includes(searchLower);
  });

  // 🔹 Toggle user selection for new chat
  const toggleUserSelection = (user: User) => {
    if (!user || !user.userId) return;
    
    setSelectedUsers(prev => 
      prev.some(u => u.userId === user.userId)
        ? prev.filter(u => u.userId !== user.userId)
        : [...prev, user]
    );
  };

  return (
    <div className="flex h-screen bg-gray-100 text-gray-900">
      {/* Left Side - Chat List */}
      <div className="w-1/3 border-r border-gray-300 bg-white overflow-y-auto">
        <div className="p-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <img src={companyLogo} alt="Company Logo" className="w-8 h-8 rounded-full" />
            <ChatBubbleOvalLeftIcon className="w-6 h-6 text-indigo-600" />
            Chats
          </h2>

          {/* New Chat button */}
          <button
            onClick={() => setShowNewChat(true)}
            className="bg-indigo-600 text-white px-3 py-1 rounded-lg text-sm hover:bg-indigo-700 transition"
          >
            New Chat
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
                className={`p-4 cursor-pointer hover:bg-indigo-50 border-b border-gray-100 ${
                  selectedChat?.chatId === chat.chatId
                    ? "bg-indigo-100 border-l-4 border-indigo-600"
                    : ""
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img src={companyLogo} alt="Chat" className="w-10 h-10 rounded-full" />
                    <div>
                      <h3 className="font-semibold text-sm">
                        {chat.name ||
                          chat.participantIds
                            .filter((id) => id !== userId)
                            .map((id) => userMap[id] || id)
                            .join(", ")}
                      </h3>
                      <p className="text-xs text-gray-500">
                        {chat.lastMessageTime && formatMessageTime(chat.lastMessageTime)}
                      </p>
                    </div>
                  </div>
                  {chat.lastMessageTime && (
                    <span className="text-xs text-gray-400">
                      {formatMessageTime(chat.lastMessageTime)}
                    </span>
                  )}
                </div>
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
            <div 
              className="flex items-center justify-between p-4 border-b border-gray-300 bg-indigo-50 cursor-pointer"
              onClick={() => setShowChatDetails(true)}
            >
              <div className="flex items-center gap-3">
                <img src={companyLogo} alt="Chat" className="w-10 h-10 rounded-full" />
                <div>
                  <h2 className="text-lg font-semibold">
                    {selectedChat.name ||
                      selectedChat.participantIds
                        .filter((id) => id !== userId)
                        .map((id) => userMap[id] || id)
                        .join(", ")}
                  </h2>
                  <p className="text-sm text-gray-600">Click for details</p>
                </div>
              </div>

              {/* Call Menu */}
              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowCallMenu(!showCallMenu);
                  }}
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

            {/* Messages Area */}
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
                    className={`px-4 py-2 rounded-2xl shadow-sm max-w-xs ${
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

            {/* Fixed Message Input */}
            <div className="p-4 border-t border-gray-300 bg-white">
              <div className="flex items-center gap-2">
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
            </div>
          </>
        ) : (
          <div className="flex flex-1 items-center justify-center text-gray-400">
            <p>Select a chat to start messaging</p>
          </div>
        )}
      </div>

      {/* Chat Details Modal */}
      {showChatDetails && selectedChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Chat Details</h3>
              <button 
                onClick={() => setShowChatDetails(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            <div className="space-y-4">
              <h4 className="font-semibold">Participants:</h4>
              {selectedChat.participantIds
                .filter(id => id !== userId)
                .map((id) => (
                  <div key={id} className="flex items-center gap-3 p-2 bg-gray-50 rounded">
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    <div>
                      <p className="font-medium">{userMap[id] || "Unknown User"}</p>
                      <p className="text-sm text-gray-600">Active</p>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      )}

      {/* New Chat Modal */}
      {showNewChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-96 overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">New Chat</h3>
              <button 
                onClick={() => {
                  setShowNewChat(false);
                  setSelectedUsers([]);
                  setSearchTerm("");
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ✕
              </button>
            </div>
            
            {/* Search Bar */}
            <div className="mb-4">
              <div className="relative">
                <MagnifyingGlassIcon className="w-5 h-5 absolute left-3 top-3 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search by name, email, or role..."
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>

            {/* Selected Users */}
            {selectedUsers.length > 0 && (
              <div className="mb-4">
                <h4 className="font-semibold mb-2">Selected:</h4>
                <div className="flex flex-wrap gap-2">
                  {selectedUsers.map(user => (
                    <div key={user.userId} className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center gap-1">
                      {getUserDisplayName(user)}
                      <button 
                        onClick={() => toggleUserSelection(user)}
                        className="text-indigo-600 hover:text-indigo-800"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Users List */}
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {filteredUsers.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No users found</p>
              ) : (
                filteredUsers.map(user => (
                  <div
                    key={user.userId}
                    onClick={() => toggleUserSelection(user)}
                    className={`flex items-center gap-3 p-2 rounded cursor-pointer ${
                      selectedUsers.some(u => u.userId === user.userId)
                        ? 'bg-indigo-50 border border-indigo-200'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <UserCircleIcon className="w-8 h-8 text-gray-400" />
                    <div className="flex-1">
                      <p className="font-medium">{getUserDisplayName(user)}</p>
                      <p className="text-sm text-gray-600">
                        {getUserEmail(user)} • {getUserRole(user)}
                      </p>
                    </div>
                    <div className={`w-3 h-3 rounded-full ${
                      user.status === 'ACTIVE' ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                ))
              )}
            </div>

            {/* Create Chat Button */}
            <button
              onClick={handleCreateChat}
              disabled={selectedUsers.length === 0}
              className={`w-full mt-4 py-2 rounded-lg ${
                selectedUsers.length === 0
                  ? 'bg-gray-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700 text-white'
              }`}
            >
              Create Chat
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chat;