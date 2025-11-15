import React from 'react'
import { useGlobalContext } from '../context/context';
import connect from '../assets/connect.jpg'
import Marketplace from '../components/Marketplace';
import Groups from '../components/Groups';
import Plans from '../components/Plans';
import { useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import Footer from '../components/Footer';
import Navbar from '../components/Navbar';

const Home = () => {
  const {user,token}= useGlobalContext();
  const [loading, setLoading] = React.useState(false);
  const handlePayment = async()=>{
    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/users/initializePayment",
        {email:user.email,amount:5000},
        {headers:{Authorization:`Bearer ${token}`}}
      )
      window.location.href=res.data.authorization_url;
    } catch (error) {
      console.error(error.response?.data || error.message)
      toast.error("failed to start payment")
    } finally {
      setLoading(false);
    }
  }

   const developers = [
  {
    id: 1,
    name: "Kai Matsuo",
    role: "UX Engineer",
    image: "https://randomuser.me/api/portraits/men/32.jpg",
    skills: ["Design Systems", "Figma", "A11y"],
  },
  {
    id: 2,
    name: "Marcus Chen",
    role: "AI/ML Engineer",
    image: "https://randomuser.me/api/portraits/men/33.jpg",
    skills: ["Python", "TensorFlow", "PyTorch"],
  },
  {
    id: 3,
    name: "Ava Brooks",
    role: "Frontend Developer",
    image: "https://randomuser.me/api/portraits/women/45.jpg",
    skills: ["React", "Tailwind CSS", "TypeScript"],
  },
];
  return (
    <>
      <Navbar/>
     {/* Hero */}
     <section className='relative max-w-7xl mx-auto px-6 md:px-10 mt-16'>
         <div className='rounded-2xl bg-[rgba(28,37,65,0.6)] border border-white/10 shadow-soft p-10 md:p-14 grid md:grid-cols-2 gap-10 items-center'>
           <div className=''>
             <h1 className='text-4xl md:text-6xl font-extrabold leading-tight text-[var(--color-text-strong)]'>Connect and Scale semalessly</h1>
             <h2 className='mt-4 text-lg md:text-xl text-[var(--color-text)]'>Connect. Create. Scale your marketplace in minutes.</h2>
             <p className='mt-4 text-sm md:text-base text-white/70 max-w-xl'>A unified platform for developers to connect, collaborate, and create together. Whether you're a seasoned pro or just starting out, our community is here to support you.</p>

             <div className='flex gap-4 mt-6'>
               <button className='btn-gradient text-white px-6 py-3 rounded-full font-semibold shadow-soft hover:opacity-95 transition'>Get Started</button>
               <button className='bg-transparent border border-white/20 text-white px-6 py-3 rounded-full font-semibold hover:border-white/40 transition'>Learn More</button>
             </div>
           </div>
          
          <div className='flex justify-center'>
            <img src={connect} alt="Hero" className='w-full max-w-md rounded-2xl shadow-soft object-cover'/>
          </div>
         </div>
     </section>
      <section className="flex flex-col gap-6 max-w-6xl mx-auto p-[30px]">
  <h2 className="text-2xl font-bold text-[var(--color-text-strong)] mb-2 text-center">
    Top Developers
  </h2>

  <div className="flex flex-wrap justify-center gap-6">
    {developers.map((dev) => (
      <div
        key={dev.id}
        className="flex flex-col w-[260px] items-center card-base border border-white/10 p-5 shadow-soft"
      >
        <img
          src={dev.image}
          alt={dev.name}
          className="w-20 h-20 mb-3 rounded-full object-cover border-2 border-[#0fa67c]"
        />

        <h3 className="text-lg font-semibold text-[var(--color-text-strong)]">{dev.name}</h3>
        <p className="text-sm text-white/70 mb-2">{dev.role}</p>

        <div className="flex flex-wrap justify-center gap-2 mb-4">
          {dev.skills.map((skill, index) => (
            <span
              key={index}
              className="bg-[rgba(58,80,107,0.25)] text-[var(--color-text-strong)] px-2 py-1 rounded-full text-xs font-semibold border border-white/10"
            >
              {skill}
            </span>
          ))}
        </div>

        <button className="btn-gradient text-white px-4 py-2 rounded-full text-sm font-bold transition shadow-soft">
          View Profile
        </button>
      </div>
    ))}
  </div>
</section>
      <Marketplace />
      <main className='flex flex-col text-center align-center'>
          <h2 className='font-bold text-4xl text-[var(--color-text-strong)]'>Join Popular groups</h2>
          <p className='text-center mt-3 max-w-[700px] mx-auto text-white/70 text-1xl md:text-2xl '>
            Explore and connect with like-minded developers in our popular groups. Share knowledge, collaborate on projects, and grow your network in a supportive community.
          </p>
          <div className='flex gap-5 align-center justify-center mt-4 mb-3'>  
             <button className='p-2 px-4 btn-gradient font-bold text-white border-none rounded-full shadow-soft'>Explore groups</button>
             <button className='border border-white/20 text-white font-bold p-2 px-4 rounded-full hover:border-white/40'>Join a chat </button>
          </div>
      </main>
      <section className="py-12 px-6">
      <div className="max-w-xl mx-auto text-center">
        <h2 className="text-2xl font-bold text-[var(--color-text-strong)] mb-2">
          Stay Updated
        </h2>
        <p className="text-white/70 mb-6">
          Get the latest updates on products, features, and community events.
        </p>
        <form className="flex flex-col sm:flex-row items-center gap-4">
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full px-4 py-2 bg-[rgba(28,37,65,0.6)] border border-white/10 text-white placeholder:text-white/50 rounded-md focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
          />
          <button
            type="submit"
            className="px-6 py-2 btn-gradient text-white rounded-md transition-transform hover:-translate-y-1 shadow-soft"
          >
            Subscribe
          </button>
        </form>
      </div>
    </section>

      <Groups />
        <div className="flex flex-wrap gap-5 justify-center text-center items-center p-8">
      {/* Free Plan */}
      <div className="flex flex-col justify-between items-center bg-[#111827] text-white font-bold w-[250px] h-[400px] rounded-2xl shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Free Plan</h2>
          <p className="text-sm text-gray-50 mb-4">For individuals just getting started</p>
          <ul className="text-left space-y-2 text-sm">
            <li>✅ Access to basic features</li>
            <li>✅ Community support</li>
            <li>✅ Limited storage (500MB)</li>
            <li>✅ One active project</li>
            <li>✅ Email notifications</li>
          </ul>
        </div>
        <button className="mt-6 bg-gray-800 text-white font-semibold px-4 py-2 rounded-full hover:bg-gray-700 transition">
          Choose Free
        </button>
      </div>

      {/* Premium Plan */}
      <div className="flex flex-col justify-between items-center bg-[#111827] font-bold text-white w-[250px] h-[400px] rounded-2xl shadow-md p-6">
        <div>
          <h2 className="text-2xl font-bold mb-2">Premium Plan</h2>
          <p className="text-sm text-gray-100 mb-4 font-bold">For teams and professionals</p>
          <ul className="text-left space-y-2 text-sm">
            <li>🌟 Unlimited projects</li>
            <li>🌟 Advanced analytics</li>
            <li>🌟 Priority support</li>
            <li>🌟 10GB cloud storage</li>
            <li>🌟 Team collaboration tools</li>
          </ul>
        </div>
        <button className="mt-6 bg-blue-600 text-white font-semibold px-4 py-2 rounded-full hover:bg-blue-500 transition"onClick={handlePayment} disabled={loading}>
          {loading ? 'Processing...' : 'Upgrade Now'}
        </button>
      </div>
    </div>
      <Footer/>
    </>
     
  )
}

export default Home