import React, { useState } from 'react';
import { useGlobalContext } from '../../context/context';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { FaUser, FaCamera, FaMapMarkerAlt, FaBirthdayCake, FaVenusMars, FaFileAlt } from 'react-icons/fa';

const ProfileSetup = () => {
  const { user, token, updateProfile } = useGlobalContext();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    profileName: '',
    town: '',
    placeOfBirth: '',
    bio: '',
    gender: '',
    profilePic: null,
  });
  const [profilePicPreview, setProfilePicPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setFormData((prev) => ({ ...prev, profilePic: file }));
      setProfilePicPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.profileName.trim()) {
      toast.error('Please enter your display name');
      return;
    }

    setLoading(true);
    try {
      await updateProfile(formData);
      toast.success('Profile setup completed successfully! 🎉');
      // Navigate to feed after successful profile setup
      setTimeout(() => {
        navigate('/');
      }, 1000);
    } catch (error) {
      console.error('Profile setup error:', error);
      toast.error(error.message || 'Failed to complete profile setup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl bg-white rounded-lg shadow-lg p-8">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Complete Your Profile</h2>
          <p className="text-gray-600">Tell us a bit about yourself to get started</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Profile Picture Upload */}
          <div className="flex flex-col items-center mb-6">
            <div className="relative">
              <div className="w-32 h-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-[#1877F2]">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt="Profile preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <FaUser className="text-6xl text-gray-400" />
                )}
              </div>
              <label
                htmlFor="profilePic"
                className="absolute bottom-0 right-0 bg-[#1877F2] text-white p-3 rounded-full cursor-pointer hover:bg-[#1565C0] transition-colors shadow-lg"
              >
                <FaCamera className="text-xl" />
              </label>
              <input
                type="file"
                id="profilePic"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
            <p className="text-sm text-gray-500 mt-2">Click the camera icon to upload your profile picture</p>
          </div>

          {/* Display Name */}
          <div>
            <label htmlFor="profileName" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaUser className="inline mr-2" />
              Display Name *
            </label>
            <input
              type="text"
              id="profileName"
              name="profileName"
              value={formData.profileName}
              onChange={handleInputChange}
              placeholder="Enter your display name"
              required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-black placeholder-black"
            />
          </div>

          {/* Town and Place of Birth Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="town" className="block text-sm font-semibold text-gray-700 mb-2">
                <FaMapMarkerAlt className="inline mr-2" />
                Town/City
              </label>
              <input
                type="text"
                id="town"
                name="town"
                value={formData.town}
                onChange={handleInputChange}
                placeholder="Enter your town or city"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-black placeholder-black"
              />
            </div>
            <div>
              <label htmlFor="placeOfBirth" className="block text-sm font-semibold text-gray-700 mb-2">
                <FaBirthdayCake className="inline mr-2" />
                Place of Birth
              </label>
              <input
                type="text"
                id="placeOfBirth"
                name="placeOfBirth"
                value={formData.placeOfBirth}
                onChange={handleInputChange}
                placeholder="Where were you born?"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-black placeholder-black"
              />
            </div>
          </div>

          {/* Gender */}
          <div>
            <label htmlFor="gender" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaVenusMars className="inline mr-2" />
              Gender
            </label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent text-black"
            >
              <option value="">Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
              <option value="prefer-not-to-say">Prefer not to say</option>
            </select>
          </div>

          {/* Bio */}
          <div>
            <label htmlFor="bio" className="block text-sm font-semibold text-gray-700 mb-2">
              <FaFileAlt className="inline mr-2" />
              Bio
            </label>
            <textarea
              id="bio"
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              placeholder="Tell us about yourself..."
              rows="4"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1877F2] focus:border-transparent resize-none text-black placeholder-black"
            />
            <p className="text-xs text-gray-500 mt-1">Share a bit about yourself (optional)</p>
          </div>

          {/* Submit Button */}
          <div className="flex items-center justify-between pt-4">
            <button
              type="button"
              onClick={() => navigate('/feed')}
              className="px-6 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors font-semibold"
            >
              Skip for now
            </button>
            <button
              type="submit"
              disabled={loading || !formData.profileName.trim()}
              className="px-8 py-3 bg-[#1877F2] text-white rounded-lg hover:bg-[#1565C0] disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-semibold shadow-md"
            >
              {loading ? 'Saving...' : 'Complete Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProfileSetup;

