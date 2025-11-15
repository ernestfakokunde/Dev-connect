import React from 'react'
import { FiMenu, FiX, FiArrowLeft } from 'react-icons/fi'
import { useNavigate } from 'react-router-dom'
import { MdNotificationsNone } from "react-icons/md";
import { FaMessage } from 'react-icons/fa6'
import { FaUser } from 'react-icons/fa'
import { CiHome } from 'react-icons/ci'

const Topbar = ({ onToggleSidebar, isSidebarOpen = false, showBack = false }) => {
  const navigate = useNavigate();

  return (
    <header className='w-full bg-[rgba(11,19,43,0.75)] border-b border-white/10 sticky top-0 z-30'>
      <div className='max-w-7xl mx-auto px-4 py-3 flex items-center gap-3'>
        <button onClick={onToggleSidebar} className='text-white p-2 rounded hover:bg-white/10 lg:hidden'>
          {isSidebarOpen ? <FiX /> : <FiMenu />}
        </button>

        {showBack ? (
          <button onClick={() => navigate(-1)} className='text-white p-2 rounded hover:bg-white/10 l'>
            <FiArrowLeft />
          </button>
        ) : (
          <div className='text-white font-semibold'>Community</div>
        )}

        <div className='flex-1' />

        {/* Mobile-only icons: messages, notifications, profile */}
        <div className='flex items-center gap-3 md:hidden'>
          <button onClick={() => navigate('/')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Home'>
            <CiHome />
          </button>
          <button onClick={() => navigate('/messages')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Messages'>
            <FaMessage />
          </button>
          <button onClick={() => navigate('/notification')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Notifications'>
            <MdNotificationsNone />
          </button>
          <button onClick={() => navigate('/profile')} className='text-white p-2 rounded hover:bg-white/10' aria-label='Profile'>
            <FaUser />
          </button>
        </div>

        {/* On larger screens this area can be left empty or used for other controls */}
      </div>
    </header>
  )
}

export default Topbar
