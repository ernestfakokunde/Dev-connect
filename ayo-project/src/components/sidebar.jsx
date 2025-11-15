import React from 'react'
import { FaHome, FaUserFriends, FaBell, FaEnvelope, FaBookmark, FaListAlt, FaUser, FaEllipsisH } from 'react-icons/fa'
import { FaMessage } from "react-icons/fa6";
import { NavLink } from 'react-router-dom';
import { useGlobalContext } from '../context/context';

// Controlled Sidebar component. Parent should pass `isOpen` and `onToggle`.
const Sidebar = ({ isOpen = true, onToggle = () => {} }) => {
  const { user, logout } = useGlobalContext();
  const linkBase = 'flex gap-3 items-center text-black text-md p-3 rounded-md';

  // On mobile we slide the sidebar in/out using translateX. On md+ we keep it visible
  // but allow collapsing the width to an icon-only sidebar when isOpen is false.
  const transformClass = isOpen ? 'translate-x-0' : '-translate-x-full';
  const desktopWidthClass = isOpen ? 'md:w-[250px]' : 'md:w-16';
  const baseWidthClass = isOpen ? 'w-[250px]' : 'w-16';

  return (
    <aside className={`fixed top-0 left-0 h-screen bg-[#faf7f7] text-black p-4 flex flex-col justify-between transition-all duration-200 z-40 ${baseWidthClass} ${desktopWidthClass} ${transformClass} md:translate-x-0`}>
      {/* Top section: hamburger + primary navigation */}
      <div className='flex flex-col gap-3.5 items-start text-black'>
        <button onClick={onToggle} aria-label='Toggle sidebar' className='text-gray mb-2 p-2 rounded hover:bg-white/10'>
          <div className='w-6 h-0.5 bg-black mb-1' />
          <div className='w-6 h-0.5 bg-black mb-1' />
          <div className='w-6 h-0.5 bg-black mb-1' />
        </button>

        <NavLink to={'/feeds'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#e9f2f3]' : 'hover:bg-[#e9f2f3]'}`}>
          <FaHome />
          {isOpen && <span>Feed</span>}
        </NavLink>

        <NavLink to={'/feeds/message'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#e9f2f3]' : 'hover:bg-[#e9f2f3]'}`}>
          <FaMessage />
          {isOpen && <span>Messages</span>}
        </NavLink>

        <NavLink to={'/search-friends'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#e9f2f3]' : 'hover:bg-[#e9f2f3]'}`}>
          <FaUserFriends />
          {isOpen && <span>Find Friends</span>}
        </NavLink>

        <NavLink to={'/feeds/connections'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[#e9f2f3]' : 'hover:bg-[#e9f2f3]'}`}>
          <FaListAlt />
          {isOpen && <span>Connections</span>}
        </NavLink>

        <NavLink to={'/Notifications'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[ #e9f2f3]' : 'hover:bg-[ #e9f2f3]'}`}>
          <FaBell />
          {isOpen && <span>Notifications</span>}
        </NavLink>
      </div>

      {/* Bottom section: profile / utilities */}
      <div className='flex flex-col gap-3.5 items-start'>
        <NavLink to={'/Profile'} className={({ isActive }) => `${linkBase} ${isActive ? 'bg-[ #e9f2f3]' : 'hover:bg-[ #e9f2f3]'}`}>
          <FaUser />
          {isOpen && <span>Profile</span>}
        </NavLink>

        <button onClick={logout} className={`${linkBase} text-left hover:bg-[#3a506b]`}>
          <FaEllipsisH />
          {isOpen && <span>Logout</span>}
        </button>
      </div>
    </aside>
  )
}

export default Sidebar