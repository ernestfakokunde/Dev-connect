import React, { useState, useEffect } from 'react';
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import FacebookNavbar from '../components/FacebookNavbar';
import PostCard from '../components/PostCard';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import { CiLogout } from "react-icons/ci";
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user, token, logout, updateProfile } = useGlobalContext();
  const [posts, setPosts] = useState([]);
  const [friendsCount, setFriendsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({
    profileName: '',
    bio: '',
    town: '',
    placeOfBirth: '',
    gender: '',
    profilePic: null,
  });
  const [profilePicPreview, setProfilePicPreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      setFormData({
        profileName: user.profileName || '',
        bio: user.bio || '',
        town: user.town || '',
        placeOfBirth: user.placeOfBirth || '',
        gender: user.gender || '',
        profilePic: null,
      });
      setProfilePicPreview(user.profilePic || null);
      fetchUserPosts();
      fetchFriendsCount();
      
      // Timeout: if still loading after 10 seconds, force stop
      const timeout = setTimeout(() => {
        console.warn('Profile loading timeout after 10s');
        setLoading(false);
        toast.error('Profile load timeout - some data may be missing');
      }, 10000);
      
      return () => clearTimeout(timeout);
    }
  }, [user]);

  const fetchUserPosts = async () => {
    // Use _id first (MongoDB), fallback to id
    const userId = user?._id || user?.id;
    if (!userId) {
      console.warn('No user ID (neither _id nor id), skipping fetch');
      setLoading(false);
      return;
    }
    try {
      console.log('Fetching posts for user:', userId);
      const response = await axiosInstance.get(`/posts/user/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Posts response:', response.data);
      setPosts(response.data.posts || []);
    } catch (error) {
      console.error('Error fetching user posts:', error.response?.data || error.message);
      toast.error('Failed to load posts');
    } finally {
      setLoading(false);
    }
  };

  const fetchFriendsCount = async () => {
    try {
      console.log('Fetching friends count...');
      const response = await axiosInstance.get('/friends', {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log('Friends response:', response.data);
      const friendsList = response.data.friends || [];
      setFriendsCount(friendsList.length);
    } catch (error) {
      console.error('Error fetching friends count:', error.response?.data || error.message);
      toast.error('Failed to load friends count');
    } finally {
      // Ensure loading is set to false even if both requests fail
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setEditing(false);
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData({
      profileName: user.profileName || '',
      bio: user.bio || '',
      town: user.town || '',
      placeOfBirth: user.placeOfBirth || '',
      gender: user.gender || '',
      profilePic: null,
    });
    setProfilePicPreview(user.profilePic || null);
    setEditing(false);
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
          <div className="text-gray-500">Loading profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100">
        <FacebookNavbar />
        <div className="flex items-center justify-center h-96">
          <div className="text-gray-500">Please log in to view your profile</div>
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Profile Picture */}
            <div className="relative">
              <img
                src={profilePicPreview || getImageUrl(user.profilePic)}
                alt={user.username}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#1877F2]"
              />
              {editing && (
                <label className="absolute bottom-0 right-0 bg-[#1877F2] text-white p-2 rounded-full cursor-pointer hover:bg-[#1565C0] transition-colors">
                  <FaEdit />
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Profile Info */}
            <div className="flex-1 text-center md:text-left">
              {editing ? (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Display Name
                    </label>
                    <input
                      type="text"
                      name="profileName"
                      value={formData.profileName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black"
                      placeholder="Enter your display name"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] resize-none text-black"
                      rows="3"
                      placeholder="Tell us about yourself"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Town
                      </label>
                      <input
                        type="text"
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1">
                        Place of Birth
                      </label>
                      <input
                        type="text"
                        name="placeOfBirth"
                        value={formData.placeOfBirth}
                        onChange={handleInputChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1">
                      Gender
                    </label>
                    <select
                      name="gender"
                      value={formData.gender}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] text-black"
                    >
                      <option value="">Select gender</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </select>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                    >
                      <FaSave />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                    >
                      <FaTimes />
                      <span>Cancel</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {user.profileName || user.username || 'User'}
                  </h1>
                  <p className="text-gray-600 mb-4">{user.bio || 'No bio yet'}</p>
                  {/* Stats: Posts and Friends */}
                  <div className="flex items-center space-x-6 text-sm text-gray-600 mb-4">
                    <div>
                      <span className="font-semibold text-gray-900">{posts.length}</span>
                      <span className="ml-1">Posts</span>
                    </div>
                    <div>
                      <button onClick={() => navigate('/friends')} className="font-semibold text-gray-900 hover:text-[#1877F2]">
                        {friendsCount}
                        <span className="ml-1 text-gray-600">Friends</span>
                      </button>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                    {user.town && (
                      <div>
                        <span className="font-semibold">Town:</span> {user.town}
                      </div>
                    )}
                    {user.placeOfBirth && (
                      <div>
                        <span className="font-semibold">Born:</span> {user.placeOfBirth}
                      </div>
                    )}
                    {user.gender && (
                      <div>
                        <span className="font-semibold">Gender:</span> {user.gender}
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => setEditing(true)}
                    className="mt-4 flex items-center space-x-2 px-4 py-2 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] transition-colors"
                  >
                    <FaEdit />
                    <span>Edit Profile</span>
                  </button>

                  <button 
                  onClick={logout}
                  className='mt-4 flex items-center space-x-2 px-3 py-2 bg-[#d56e6e] text-white rounded-lg hover:bg-[#e90752] transition-colors'>
                    <CiLogout />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* User Posts */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Posts</h2>
          {posts.length === 0 ? (
            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
              You haven't posted anything yet. Create your first post!
            </div>
          ) : (
            <div className="space-y-4">
              {posts.map((post) => (
                <PostCard
                  key={post._id}
                  post={post}
                  currentUser={user}
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

export default Profile;

