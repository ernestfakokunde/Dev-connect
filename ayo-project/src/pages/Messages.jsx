import React, { useState, useEffect, useRef } from 'react';
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useSearchParams } from 'react-router-dom';
import FacebookNavbar from '../components/FacebookNavbar';
import { FaPaperPlane, FaImage } from 'react-icons/fa';
import formatTime from '../utils/formatTime';
import { useSocket } from '../context/SocketContext'; // Import useSocket

const Messages = () => {
  const { user, token } = useGlobalContext();
  const { socket } = useSocket(); // Get socket from context
  // robust current user id (handles both `_id` and `id` shapes)
  const myId = user?._id || user?.id || user?.userId || null;
  const [searchParams] = useSearchParams();
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [messageText, setMessageText] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef(null);

  // Helper to deduplicate messages by unique id (fallback to composite key)
  const dedupeMessages = (arr) => {
    const map = new Map();
    arr.forEach((m) => {
      const id = m._id || m.id || `${m.sender || ''}-${m.createdAt || ''}-${m.text || ''}`;
      if (!map.has(id)) map.set(id, m);
    });
    return Array.from(map.values());
  };

  useEffect(() => {
    fetchConversations();
    
    // Check if there's a user query parameter to start a conversation
    const userId = searchParams.get('user');
    if (userId) {
      // Fetch user info and set as selected conversation
      fetchUserAndStartConversation(userId);
    }
  }, []);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (message) => {
      const senderId = message.sender?._id || message.sender;
      const receiverId = message.receiver?._id || message.receiver;
      const selectedId = selectedConversation?._id || selectedConversation?.id;

      if (
        senderId?.toString() === selectedId?.toString() ||
        receiverId?.toString() === selectedId?.toString()
      ) {
        setMessages((prev) => dedupeMessages([...prev, message]));
      }
      fetchConversations(); // Refresh conversations list
    };

    socket.on('newMessage', handleNewMessage);

    return () => {
      socket.off('newMessage', handleNewMessage);
    };
  }, [socket, selectedConversation]);

  useEffect(() => {
    if (selectedConversation) {
      fetchMessages(selectedConversation._id || selectedConversation.id);
    }
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const fetchConversations = async () => {
    try {
      const response = await axiosInstance.get('/messages/conversations', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setConversations(response.data);
    } catch (error) {
      console.error('Error fetching conversations:', error);
      toast.error('Failed to load conversations');
    } finally {
      setLoading(false);
    }
  };

  const fetchUserAndStartConversation = async (userId) => {
    try {
      // Fetch user info from the backend
      const response = await axiosInstance.get(`/users/profile/${userId}`);
      if (response.data?.user) {
        setSelectedConversation(response.data.user);
        // Fetch messages with this user
        fetchMessages(userId);
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      toast.error('Failed to load user');
    }
  };

  const fetchMessages = async (otherUserId) => {
    try {
      const response = await axiosInstance.get(`/messages/${otherUserId}`);
      setMessages(dedupeMessages(response.data));
    } catch (error) {
      console.error('Error fetching messages:', error);
      toast.error('Failed to load messages');
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || !selectedConversation) return;

    setSending(true);
    try {
      const receiverId = selectedConversation._id || selectedConversation.id;
      const response = await axiosInstance.post(
        '/messages',
        {
          receiverId,
          text: messageText,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessages((prev) => dedupeMessages([...prev, response.data]));
      setMessageText('');
      fetchConversations(); // Refresh conversations
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message');
    } finally {
      setSending(false);
    }
  };

  const getOtherUser = (conversation) => {
    if (!conversation.sender || !conversation.receiver) return null;
    const senderId = conversation.sender._id || conversation.sender;
    const receiverId = conversation.receiver._id || conversation.receiver;
    return senderId.toString() === myId?.toString()
      ? conversation.receiver
      : conversation.sender;
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return '/default-avatar.svg';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${baseURL}${img}`;
    return `${baseURL}/${img}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading messages...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <FacebookNavbar />
      <div className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar - Hidden on mobile when a conversation is selected */}
        <div className={`${selectedConversation ? 'hidden' : 'w-full'} md:w-80 md:block bg-white border-r border-gray-200 flex flex-col`}>
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900">Messages</h2>
          </div>
          <div className="flex-1 overflow-y-auto">
            {conversations.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No conversations yet. Start chatting with friends!
              </div>
            ) : (
              conversations.map((conv, idx) => {
                const otherUser = getOtherUser(conv);
                if (!otherUser) return null;
                return (
                  <button
                    key={idx}
                    onClick={() => setSelectedConversation(otherUser)}
                    className={`w-full p-4 flex items-center space-x-3 hover:bg-gray-50 transition-colors ${
                      selectedConversation?._id === otherUser._id ||
                      selectedConversation?.id === otherUser._id ||
                      selectedConversation?._id === otherUser.id
                        ? 'bg-blue-50 border-l-4 border-[#1877F2]'
                        : ''
                    }`}
                  >
                    <img
                      src={getImageUrl(otherUser.profilePic)}
                      alt={otherUser.username}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div className="flex-1 text-left">
                      <div className="font-semibold text-gray-900">
                        {otherUser.username || 'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {conv.text || 'No messages yet'}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Messages Area - Hidden on mobile when no conversation is selected */}
        <div className={`${selectedConversation ? 'flex' : 'hidden'} md:flex flex-1 flex-col`}>
          {selectedConversation ? (
            <>
              {/* Chat Header */}
              <div className="bg-white border-b border-gray-200 p-4 flex items-center space-x-3">
                {/* Back Button - Mobile Only */}
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-full"
                  title="Back to conversations"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <img
                  src={getImageUrl(selectedConversation.profilePic)}
                  alt={selectedConversation.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <div className="font-semibold text-gray-900">
                    {selectedConversation.username || 'Unknown User'}
                  </div>
                </div>
              </div>

              {/* Messages List */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.map((msg) => {
                  const senderId = msg.sender?._id || msg.sender;
                  const isOwn = senderId?.toString() === myId?.toString();
                  return (
                    <div
                      key={msg._id || msg.id || `${msg.sender}-${msg.createdAt}`}
                      className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                          isOwn
                            ? 'bg-[#1877F2] text-white'
                            : 'bg-white text-gray-900'
                        }`}
                      >
                        <div className={`text-sm ${isOwn ? 'text-white' : 'text-gray-900'}`}>{msg.text}</div>
                        {msg.images && msg.images.length > 0 && (
                          <div className="mt-2 space-y-2">
                            {msg.images.map((img, i) => (
                              <img
                                key={i}
                                src={getImageUrl(img)}
                                alt={`Message ${i + 1}`}
                                className="w-full h-48 object-cover rounded"
                              />
                            ))}
                          </div>
                        )}
                        <div className={`text-xs mt-1 ${isOwn ? 'text-blue-100' : 'text-gray-500'}`}>
                          {formatTime(msg.createdAt)}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <form
                onSubmit={handleSendMessage}
                className="bg-white border-t border-gray-200 p-4 flex items-center space-x-2"
              >
                <input
                  type="text"
                  value={messageText}
                  onChange={(e) => setMessageText(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black placeholder-gray-700"
                />
                <button
                  type="submit"
                  disabled={sending || !messageText.trim()}
                  className="p-3 bg-[#1877F2] text-white rounded-full hover:bg-[#1565C0] disabled:opacity-50 transition-colors"
                >
                  <FaPaperPlane className='text-blue' />
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center text-gray-500">
              Select a conversation to start chatting
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Messages;

