import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useGlobalContext } from '../context/context';
import { FaHome, FaUserFriends, FaUser } from 'react-icons/fa';
import { FaMessage } from 'react-icons/fa6';
import { MdNotificationsNone } from 'react-icons/md';
import { RiUserCommunityLine } from "react-icons/ri";
import { getImageUrl } from '../utils/imageUtils';

const FacebookNavbar = () => {
  const { user, logout } = useGlobalContext();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/feed', icon: FaHome, label: 'Feed' },
    { path: '/messages', icon: FaMessage, label: 'Messages' },
    { path: '/friends', icon: FaUserFriends, label: 'Friends' },
    { path: '/profile', icon: FaUser, label: 'Profile' },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-[#101a42] text-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo (compact) */}
          <Link to="/feed" className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-white text-[#101a42] font-bold flex items-center justify-center">Dc</div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1 flex-1 justify-center">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#191f5f] text-white'
                      : 'hover:bg-[#0e2f55] text-white/90'
                  }`}
                >
                  <Icon className="text-xl" />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </div>

          {/* Mobile / Small-screen quick icons (replace toggle menu) */}
          <div className="flex items-center space-x-3 md:hidden">
            <button onClick={() => navigate('/feed')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Home'>
              <FaHome />
            </button>
            <button onClick={() => navigate('/messages')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Messages'>
              <FaMessage />
            </button>
            <button onClick={() => navigate('/community')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Notifications'>
               <RiUserCommunityLine />
            </button>
            <button onClick={() => navigate('/profile')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Profile'>
              <FaUser />
            </button>
          </div>

          {/* User Profile & actions for md+ */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <Link
                  to="/profile"
                  className="hidden sm:flex items-center space-x-2 hover:bg-[#1565C0] rounded-lg px-3 py-2 transition-colors"
                >
                  {user.profilePic ? (
                    <img
                      src={getImageUrl(user.profilePic)}
                      alt={user.username || 'Profile'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-white"
                      onError={(e) => {e.target.src = '/default-avatar.png'}}
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                      <FaUser />
                    </div>
                  )}
                  <span className="font-medium hidden lg:inline">{user.username || 'User'}</span>
                </Link>
                <button
                  onClick={logout}
                  className="hidden sm:block px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                >
                  Logout
                </button>
                <Link to={"/"} className='text-1xl font-mono'>
                  Go to Explore
                </Link>
              </>
            ) : (
              <div className="flex items-center space-x-2">
                <Link
                  to="/login"
                  className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-medium"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="px-4 py-2 bg-white text-[#1877F2] hover:bg-gray-100 rounded-lg transition-colors font-medium"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* (mobile menu removed — icons are displayed inline above) */}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default FacebookNavbar;

