import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import FacebookNavbar from '../components/FacebookNavbar';
import { FaUserPlus, FaCheck, FaTimes, FaUserMinus, FaComment, FaEye } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const Friends = () => {
  const { user, token } = useGlobalContext();
  const navigate = useNavigate();
  const [friends, setFriends] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('suggestions'); // 'friends', 'requests', or 'suggestions'

  useEffect(() => {
    fetchFriendsAndRequests();
  }, []);

  useEffect(() => {
    // Fetch suggestions after friends are loaded
    if (friends.length >= 0 && pendingRequests.length >= 0) {
      fetchSuggestions();
    }
  }, [friends, pendingRequests]);

  const fetchFriendsAndRequests = async () => {
    try {
      const response = await axiosInstance.get('/friends');
      setFriends(response.data.friends || []);
      setPendingRequests(response.data.pending || []);
    } catch (error) {
      console.error('Error fetching friends:', error);
      toast.error('Failed to load friends');
    } finally {
      setLoading(false);
    }
  };

  const fetchSuggestions = async () => {
    try {
      const response = await axiosInstance.get('/users/all');
      // Filter out current user and existing friends
      const friendIds = friends.map(f => {
        const otherUser = getOtherUser(f);
        return (otherUser?._id || otherUser?.id)?.toString();
      }).filter(Boolean);
      
      const pendingIds = pendingRequests.map(req => {
        const otherUser = getOtherUser(req);
        return (otherUser?._id || otherUser?.id)?.toString();
      }).filter(Boolean);

      const filtered = response.data.filter(u => {
        const userId = (u._id || u.id)?.toString();
        const currentUserId = (user?.id || user?._id)?.toString();
        return userId && 
               userId !== currentUserId && 
               !friendIds.includes(userId) && 
               !pendingIds.includes(userId);
      });
      
      setSuggestions(filtered);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      toast.error('Failed to load suggestions');
    }
  };

  const handleSearchChange = async (q) => {
    setSearchTerm(q);
    if (!q || !q.trim()) {
      setSearchResults([]);
      return;
    }

    try {
      const response = await axiosInstance.get('/users/all');
      const filtered = response.data.filter((u) => {
        const name = (u.profileName || u.username || '').toLowerCase();
        return name.includes(q.toLowerCase());
      }).filter(u => (u._id || u.id)?.toString() !== (user?._id || user?.id)?.toString());

      setSearchResults(filtered);
    } catch (error) {
      console.error('Error searching users:', error);
      toast.error('Failed to search users');
    }
  };

  const handleSendRequest = async (receiverId) => {
    try {
      await axiosInstance.post('/friends/send', { receiverId });
      toast.success('Friend request sent!');
      fetchFriendsAndRequests();
      fetchSuggestions(); // Refresh suggestions
    } catch (error) {
      console.error('Error sending request:', error);
      toast.error(error.response?.data?.message || 'Failed to send request');
    }
  };

  const handleSendMessage = (userId) => {
    navigate(`/messages?user=${userId}`);
  };

  const handleViewProfile = (userId) => {
    navigate(`/user/${userId}`);
  };

  const handleRespondToRequest = async (requestId, action) => {
    try {
      await axiosInstance.post(`/friends/${requestId}/respond`, { action });
      toast.success(`Request ${action}ed!`);
      fetchFriendsAndRequests();
      fetchSuggestions();
    } catch (error) {
      console.error('Error responding to request:', error);
      toast.error('Failed to respond to request');
    }
  };

  const handleRemoveFriend = async (friendId) => {
    if (!window.confirm('Are you sure you want to remove this friend?')) return;
    
    try {
      await axiosInstance.delete(`/friends/remove/${friendId}`);
      toast.success('Friend removed');
      fetchFriendsAndRequests();
      fetchSuggestions();
    } catch (error) {
      console.error('Error removing friend:', error);
      toast.error('Failed to remove friend');
    }
  };

  const getOtherUser = (request) => {
    const senderId = request.sender?._id || request.sender;
    const receiverId = request.receiver?._id || request.receiver;
    const currentUserId = user?.id?.toString() || user?._id?.toString();
    const senderIdStr = senderId?.toString();
    const receiverIdStr = receiverId?.toString();
    
    return senderIdStr === currentUserId ? request.receiver : request.sender;
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return '/default-avatar.png';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${baseURL}${img}`;
    return `${baseURL}/${img}`;
  };

  const receivedRequests = pendingRequests.filter((req) => {
    const receiverId = req.receiver?._id || req.receiver;
    const currentUserId = user?.id?.toString() || user?._id?.toString();
    return receiverId?.toString() === currentUserId && req.status === 'pending';
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading friends...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <FacebookNavbar />
      {/* Mobile Back Button */}
      <div className="md:hidden p-2">
        <button onClick={() => navigate(-1)} className="p-2 text-gray-600 hover:bg-gray-200 rounded-full" title="Back">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      <div className="max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Friends</h1>

        {/* Search users (searches all users) */}
        <div className="mb-4">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder="Search users..."
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black"
          />
        </div>

        {/* Render search results when query present */}
        {searchTerm && searchTerm.trim().length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            {searchResults.length === 0 ? (
              <div className="text-center text-gray-500 py-8">No users found</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searchResults.map((u) => {
                  const userId = u._id || u.id;
                  return (
                    <div key={userId} className="bg-gray-50 rounded-lg p-4 flex flex-col items-center space-y-3">
                      <Link to={`/user/${userId}`} className="flex flex-col items-center">
                        <img src={getImageUrl(u.profilePic)} alt={u.username} className="w-20 h-20 rounded-full object-cover border-2 border-[#1877F2]" />
                        <div className="text-center mt-2">
                          <div className="font-semibold text-gray-900">{u.profileName || u.username || 'Unknown User'}</div>
                          <div className="text-sm text-gray-500">@{u.username}</div>
                        </div>
                      </Link>
                      <div className="flex flex-col space-y-2 w-full">
                        <button onClick={() => handleSendRequest(userId)} className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors font-semibold">
                          <FaUserPlus />
                          <span>Add Friend</span>
                        </button>
                        <div className="flex space-x-2">
                          <button onClick={() => handleSendMessage(userId)} className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                            <FaComment />
                            <span>Message</span>
                          </button>
                          <button onClick={() => handleViewProfile(userId)} className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold">
                            <FaEye />
                            <span>Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex space-x-4 mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('suggestions')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'suggestions'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Suggestions ({suggestions.length})
          </button>
          <button
            onClick={() => setActiveTab('friends')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'friends'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friends ({friends.length})
          </button>
          <button
            onClick={() => setActiveTab('requests')}
            className={`pb-2 px-4 font-semibold ${
              activeTab === 'requests'
                ? 'text-[#1877F2] border-b-2 border-[#1877F2]'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Friend Requests ({receivedRequests.length})
          </button>
        </div>

        {/* Suggestions Tab */}
        {activeTab === 'suggestions' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {suggestions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No suggestions available at the moment
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {suggestions.map((suggestion) => {
                  const userId = suggestion._id || suggestion.id;
                  return (
                    <div
                      key={userId}
                      className="bg-gray-50 rounded-lg p-4 flex flex-col items-center space-y-3 hover:shadow-lg transition-shadow"
                    >
                      <Link to={`/user/${userId}`} className="flex flex-col items-center">
                        <img
                          src={getImageUrl(suggestion.profilePic)}
                          alt={suggestion.username}
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#1877F2]"
                        />
                        <div className="text-center mt-2">
                          <div className="font-semibold text-gray-900">
                            {suggestion.profileName || suggestion.username || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">@{suggestion.username}</div>
                          {suggestion.town && (
                            <div className="text-xs text-gray-400 mt-1">{suggestion.town}</div>
                          )}
                        </div>
                      </Link>
                      
                      <div className="flex flex-col space-y-2 w-full">
                        <button
                          onClick={() => handleSendRequest(userId)}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors font-semibold"
                        >
                          <FaUserPlus />
                          <span>Add Friend</span>
                        </button>
                        
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSendMessage(userId)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                          >
                            <FaComment />
                            <span>Message</span>
                          </button>
                          
                          <button
                            onClick={() => handleViewProfile(userId)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                          >
                            <FaEye />
                            <span>Profile</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Friends List */}
        {activeTab === 'friends' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {friends.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No friends yet. Send friend requests to connect!
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {friends.map((friend, idx) => {
                  const otherUser = getOtherUser(friend);
                  if (!otherUser) return null;
                  const userId = otherUser._id || otherUser.id;
                  return (
                    <div
                      key={idx}
                      className="bg-gray-50 rounded-lg p-4 flex flex-col items-center space-y-3"
                    >
                      <Link to={`/user/${userId}`} className="flex flex-col items-center">
                        <img
                          src={getImageUrl(otherUser.profilePic)}
                          alt={otherUser.username}
                          className="w-20 h-20 rounded-full object-cover border-2 border-[#1877F2]"
                        />
                        <div className="text-center mt-2">
                          <div className="font-semibold text-gray-900">
                            {otherUser.profileName || otherUser.username || 'Unknown User'}
                          </div>
                          <div className="text-sm text-gray-500">@{otherUser.username}</div>
                        </div>
                      </Link>
                      
                      <div className="flex flex-col space-y-2 w-full">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleSendMessage(userId)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors text-sm font-semibold"
                          >
                            <FaComment />
                            <span>Message</span>
                          </button>
                          
                          <button
                            onClick={() => handleViewProfile(userId)}
                            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-semibold"
                          >
                            <FaEye />
                            <span>Profile</span>
                          </button>
                        </div>
                        
                        <button
                          onClick={() => handleRemoveFriend(userId)}
                          className="flex items-center justify-center space-x-2 px-4 py-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors font-semibold"
                        >
                          <FaUserMinus />
                          <span>Remove</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Friend Requests */}
        {activeTab === 'requests' && (
          <div className="bg-white rounded-lg shadow-md p-6">
            {receivedRequests.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No pending friend requests
              </div>
            ) : (
              <div className="space-y-4">
                {receivedRequests.map((request, idx) => {
                  const otherUser = getOtherUser(request);
                  if (!otherUser) return null;
                  const userId = otherUser._id || otherUser.id;
                  return (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center space-x-3">
                        <Link to={`/user/${userId}`}>
                          <img
                            src={getImageUrl(otherUser.profilePic)}
                            alt={otherUser.username}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        </Link>
                        <div>
                          <Link
                            to={`/user/${userId}`}
                            className="font-semibold text-gray-900 hover:text-[#1877F2]"
                          >
                            {otherUser.username || 'Unknown User'}
                          </Link>
                          <div className="text-sm text-gray-500">sent you a friend request</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleRespondToRequest(request._id, 'accept')}
                          className="flex items-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                        >
                          <FaCheck />
                          <span>Accept</span>
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(request._id, 'reject')}
                          className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                        >
                          <FaTimes />
                          <span>Decline</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Friends;
