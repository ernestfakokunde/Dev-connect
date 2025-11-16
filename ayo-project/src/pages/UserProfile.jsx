import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import FacebookNavbar from '../components/FacebookNavbar';
import PostCard from '../components/PostCard';
import { FaUserPlus, FaComment, FaArrowLeft } from 'react-icons/fa';

const UserProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser, token } = useGlobalContext();
  const [profileUser, setProfileUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relation, setRelation] = useState(null);

  useEffect(() => {
    if (id) {
      fetchUserProfile();
      fetchUserPosts();
      // Timeout: if still loading after 10 seconds, force it to stop
      const timeout = setTimeout(() => {
        if (loading) {
          console.warn('Profile fetch timeout after 10s');
          setLoading(false);
          toast.error('Failed to load profile (timeout)');
        }
      }, 10000);
      return () => clearTimeout(timeout);
    }
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      console.log('Fetching user profile for id:', id);
      const response = await axiosInstance.get(`/users/profile/${id}`);
      console.log('Profile response:', response.data);
      setProfileUser(response.data.user);
      setRelation(response.data.relation);
    } catch (error) {
      console.error('Error fetching user profile:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to load user profile');
      setProfileUser(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const response = await axiosInstance.get(`/posts/user/${id}`);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    }
  };

  const handleSendFriendRequest = async () => {
    try {
      await axiosInstance.post('/friends/send', { receiverId: id });
      toast.success('Friend request sent!');
      fetchUserProfile(); // Refresh to update relation
    } catch (error) {
      console.error('Error sending friend request:', error);
      toast.error(error.response?.data?.message || 'Failed to send friend request');
    }
  };

  const handleSendMessage = () => {
    navigate(`/messages?user=${id}`);
  };

  const baseURL = import.meta.env.VITE_API_BASE_URL?.replace('/api', '') || 'http://localhost:5000';
  const getImageUrl = (img) => {
    if (!img) return '/default-avatar.png';
    if (img.startsWith('http')) return img;
    if (img.startsWith('/')) return `${baseURL}${img}`;
    return `${baseURL}/${img}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">User not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <FacebookNavbar />
      {/* Mobile Back Button */}
      <div className="md:hidden p-2">
        <button
          onClick={() => navigate(-1)}
          className="p-2 text-gray-600 hover:bg-gray-200 rounded-full"
          title="Back"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="mb-4 flex items-center space-x-2 text-gray-600 hover:text-gray-900"
        >
          <FaArrowLeft />
          <span>Back</span>
        </button>

        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <img
              src={getImageUrl(profileUser.profilePic)}
              alt={profileUser.username}
              className="w-32 h-32 rounded-full object-cover border-4 border-[#1877F2]"
            />

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {profileUser.profileName || profileUser.username || 'User'}
              </h1>
              <p className="text-gray-600 mb-4">{profileUser.bio || 'No bio yet'}</p>
              <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-4">
                {profileUser.town && (
                  <div>
                    <span className="font-semibold">Town:</span> {profileUser.town}
                  </div>
                )}
                {profileUser.placeOfBirth && (
                  <div>
                    <span className="font-semibold">Born:</span> {profileUser.placeOfBirth}
                  </div>
                )}
                {profileUser.gender && (
                  <div>
                    <span className="font-semibold">Gender:</span> {profileUser.gender}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              {currentUser?.id?.toString() !== id?.toString() && (
                <div className="flex items-center space-x-3">
                  {!relation?.isFriend && !relation?.requestSent && (
                    <button
                      onClick={handleSendFriendRequest}
                      className="flex items-center space-x-2 px-6 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors font-semibold"
                    >
                      <FaUserPlus />
                      <span>Add Friend</span>
                    </button>
                  )}
                  {relation?.requestSent && (
                    <button
                      disabled
                      className="px-6 py-2 bg-gray-300 text-gray-600 rounded-lg font-semibold cursor-not-allowed"
                    >
                      Request Sent
                    </button>
                  )}
                  {relation?.isFriend && (
                    <button
                      onClick={handleSendMessage}
                      className="flex items-center space-x-2 px-6 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors font-semibold"
                    >
                      <FaComment />
                      <span>Message</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            {profileUser.profileName || profileUser.username}'s Posts
          </h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              No posts yet.
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={currentUser}
                  token={token}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;

