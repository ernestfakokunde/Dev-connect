import axios from "axios";
import { useState } from "react";
import { useGlobalContext } from "../context/context";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import React from 'react'
import { toast } from "react-toastify";

const Register = () => {
const navigate = useNavigate();
const { register, loading} = useGlobalContext(); 
const [formData, setFormData]= useState({
  username:"",
  email:"",
  password:""
})

const handleChange = (e)=>{
  setFormData((prev)=> ({...prev, [e.target.name]: e.target.value}))
}

const handleSubmit = async(e)=>{
  e.preventDefault();
  try {
    const success = await register(formData);
    if(success){
      toast.success("Register Successful 🎉");
      navigate('/profilesetup');
    }
  } catch (error) {
    console.error(error);
    // Show specific error message from backend
    if (error.message === "user already exists") {
      toast.error("User already exists! Please try a different email 📧");
    } else if (error.message === "please fill in all fields") {
      toast.error("Please fill in all fields 📝");
    } else {
      toast.error(error.message || "Registration failed ❌");
    }
  }
}

  return (
      <div className='min-h-screen flex items-center justify-center px-4 py-12'> 
        <div className='w-full max-w-md card-base border border-white/10 p-8 shadow-soft'>
          <div className='text-center mb-8'>
            <h2 className='text-3xl font-bold text-[var(--color-text-strong)] mb-2'>Create Account</h2>
            <p className='text-white/70'>Join DevConnect and start your journey</p>
          </div>
          
          <form onSubmit={handleSubmit} className='space-y-4'>
             <input type="text"
             name='username'
             value={formData.username}
             placeholder='Enter username'
             onChange={handleChange}
             required
             className='w-full p-3 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]' />

            <input type="email"
            value={formData.email}
             name='email'
             onChange={handleChange}
             placeholder='Enter email'
             required
             className='w-full p-3 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]' />

              <input type="password"
             name='password'
             value={formData.password}
             placeholder='Enter password'
             onChange={handleChange}
             required
             className='w-full p-3 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]' />

             <button
              type='submit'
              disabled={loading}
              className='w-full btn-gradient text-white py-3 rounded-md font-semibold shadow-soft hover:opacity-95 transition disabled:opacity-50 disabled:cursor-not-allowed'
             >
                {loading ? 'Please wait...' : 'Register'}
             </button>
             <p className='text-center text-white/70 mt-4'>Already have an account? <Link to={'/login'} className='text-[var(--color-accent)] hover:text-[var(--color-text-strong)] transition'>Login</Link></p>
          </form>
        </div>
    </div>
  )
}

export default Register