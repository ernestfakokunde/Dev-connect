import React from 'react'
import { FaShop } from "react-icons/fa6";
import { BsChatDotsFill } from "react-icons/bs";
import { FaSearch } from "react-icons/fa";
import { Link } from 'react-router-dom';
import { FaUser } from "react-icons/fa";
import { CiHome } from "react-icons/ci";
import { MdNotificationsNone } from "react-icons/md";
import { RiUserCommunityLine } from "react-icons/ri";
import { CgCommunity } from "react-icons/cg";
import { FaShoppingCart } from "react-icons/fa";
import { GrResources } from "react-icons/gr";
import { IoChatbox } from "react-icons/io5"; 
import { useGlobalContext } from '../context/context';
const Navbar = () => {

  const {setSearchQuery , cartQuantity, user, logout } = useGlobalContext();

  return (
     <nav className='sticky top-0 z-40 w-full backdrop-blur bg-[rgba(11,19,43,0.75)] border-b border-white/10'>
        <div className='max-w-7xl mx-auto px-4 py-3 flex items-center justify-between'>
          {/* Logo */}
          <Link to='/' className='flex items-center gap-2'>
            <div className='h-9 w-9 rounded-xl bg-[var(--color-accent)] grid place-items-center shadow-soft'>
              <span className='text-[var(--color-text-strong)] font-bold'>DC</span>
            </div>
            <span className='text-lg font-semibold text-[var(--color-text-strong)]'>DevConnect</span>
          </Link>

          {/* Nav links */}
          <div className='hidden md:flex items-center gap-6 text-sm'>
            <Link to='/' className='text-[var(--color-text)] hover:text-[var(--color-text-strong)] transition'>Home</Link>
            <Link to='/community' className='text-[var(--color-text)] hover:text-[var(--color-text-strong)] transition'>Community</Link>
            <Link to='/feed' className='text-[var(--color-text)] hover:text-[var(--color-text-strong)] transition'>Chat</Link>
            <Link to='/resources' className='text-[var(--color-text)] hover:text-[var(--color-text-strong)] transition'>Resources</Link>
          </div>

          {/* Search + Icons */}
          <div className='flex items-center gap-4'>
            <div className='relative hidden sm:block'>
              <FaSearch className='absolute left-3 top-1/2 -translate-y-1/2 text-white/50' />
              <input
                className='bg-[rgba(28,37,65,0.8)] text-white text-sm rounded-full pl-9 pr-4 py-2 border border-white/10 focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)] placeholder:text-white/50'
                type="text"
                onChange={(e)=> setSearchQuery(e.target.value)}
                placeholder='Search items...'/>
            </div>
            {user ? (
              <>
                
                <Link to='/community' className='text-white hover:text-[var(--color-accent)] transition'>
                  <CgCommunity className='text-2xl' />
                </Link>
                <Link to='/feed' className='text-[var(--color-text)] hover:text-[var(--color-text-strong)] transition'><IoChatbox /></Link>
                <Link to='/resources' className='text-white hover:text-[var(--color-accent)] transition'>
                  <GrResources className='text-2xl' />
                </Link>
                {user?.profilePic && (
                  <Link to='/profile' className='shrink-0'>
                    <img
                      src={user.profilePic}
                      alt={user?.username || 'Profile'}
                      className='w-8 h-8 rounded-full object-cover border border-white/20'
                    />
                  </Link>
                )}
                <button 
                  onClick={logout}
                  className='text-white hover:text-[var(--color-accent)] transition text-sm px-3 py-1 rounded-md border border-white/20 hover:border-[var(--color-accent)]'
                >
                  Logout
                </button>
              </>
            ) : (
              <div className='flex items-center gap-2'>
                <Link 
                  to='/login' 
                  className='text-white hover:text-[var(--color-accent)] transition text-sm px-3 py-1 rounded-md border border-white/20 hover:border-[var(--color-accent)]'
                >
                  Login
                </Link>
                <Link 
                  to='/register' 
                  className='bg-[var(--color-accent)] text-[var(--color-text-strong)] hover:opacity-90 transition text-sm px-3 py-1 rounded-md font-medium'
                >
                  Sign Up
                </Link>
              </div>
            )}
            
          </div>
        </div>
     </nav>
  )
}

export default Navbar