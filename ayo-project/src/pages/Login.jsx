import React, { useState } from 'react'
import axios from "axios"
import { useGlobalContext } from '../context/context'
import { Link, useLocation, useNavigate } from 'react-router-dom' 
import { toast } from 'react-toastify'
const Login = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { login, user, token, loading} = useGlobalContext();
  const from = location.state?.from?.pathname || "/";

  const [email, setEmail]= useState('')
  const [password, setPassword]= useState('')

  const handleEmailChange = (e)=>{
    setEmail(e.target.value)
  }
  const handlePasswordChange = (e)=>{
    setPassword(e.target.value)
  }
  
  const handleSubmit = async (e)=>{
    e.preventDefault();
    try {
      const success = await login(email,password)
      if(success) {
        navigate(from, { replace: true })
        toast.success("Login Successful 🎉🎉")
      }else{
        toast.error("Login Failed ❌❌")
      }
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div className='min-h-screen flex items-center justify-center px-4 py-12'> 
      <div className='w-full max-w-md card-base border border-white/10 p-8 shadow-soft'>
        <div className='text-center mb-8'>
          <h2 className='text-3xl font-bold text-[var(--color-text-strong)] mb-2'>Welcome Back</h2>
          <p className='text-white/70'>Sign in to your DevConnect account</p>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <input type="email"
          value={email}
           name='email'
           onChange={handleEmailChange}
           placeholder='Enter email'
           required
           className='w-full p-3 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]' />

            <input type="password"
           name='password'
           value={password}
           placeholder='Enter password'
           onChange={handlePasswordChange}
           required
           className='w-full p-3 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]' />

           <button
            type='submit'
            disabled={loading}
            className='w-full btn-gradient text-white py-3 rounded-md font-semibold shadow-soft hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
           >
              {loading ? 'Please wait...' : 'Login'}
           </button>

           <p className='text-center text-white/70 mt-4'>Don't have an account? <Link to={'/register'} className='text-[var(--color-accent)] hover:text-[var(--color-text-strong)] transition'>Register</Link></p>
        </form>
      </div>
    </div>
  )
}

export default Login