import React, { useState } from 'react'
import { useGlobalContext } from '../context/context';
import axiosInstance from '../api/axiosInstance';
import { toast } from 'react-toastify';
import { FaTimes } from 'react-icons/fa';

const ProjectModal = ({ isOpen, onClose, onProjectCreated }) => {

   const [form, setForm] = useState({
    title: "",
    description: "",
    experienceLevel: "Beginner",
    telegram: "",
    whatsapp: "",
    discord: "",
  });

   const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const { token } = useGlobalContext();

  const handleChange = (e)=>{
    setForm({...form, [e.target.name]: e.target.value});
  }
  const handleImageChange = (e)=>{
    setImage(e.target.files[0]);
  }

  const handleSubmit = async (e)=>{
    e.preventDefault();
   setLoading(true);
    try {
      //create a new formData to send to the backend
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("experienceLevel", form.experienceLevel);
      formData.append("telegram", form.telegram);
      formData.append("whatsapp", form.whatsapp);
      formData.append("discord", form.discord);
      if (image) formData.append("image", image);

    const res = await axiosInstance.post("/projects", formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`,
        },
      }
    )

    toast.success("Project created successfully!");
    setForm({ title: "", description: "", experienceLevel: "Beginner", telegram: "", whatsapp: "", discord: "" });
    setImage(null);
    onClose();
    if (onProjectCreated) onProjectCreated();
    } catch (error) {
      console.error("Error creating project:", error);
      toast.error(error.response?.data?.message || "Failed to create project");
    } finally {
      setLoading(false);
    }
  }

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-[#0b1228] border border-[#1a223b] rounded-lg shadow-lg max-w-lg w-full p-6 my-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-semibold text-white">Start a Collaboration</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition"
          >
            <FaTimes className="text-xl" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Project Name *</label>
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="e.g. React Devs needed for startup"
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Project Description *</label>
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe your project, what you're building, and what kind of help you need..."
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition resize-none"
              rows="3"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Experience Level *</label>
            <select
              name="experienceLevel"
              value={form.experienceLevel}
              onChange={handleChange}
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
            >
              <option>Beginner</option>
              <option>Intermediate</option>
              <option>Advanced</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Project Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
            />
          </div>

          <div className="text-sm text-slate-400 font-semibold mb-3">Communication Links (Optional)</div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Telegram</label>
            <input
              type="text"
              name="telegram"
              value={form.telegram}
              onChange={handleChange}
              placeholder="https://t.me/yourgroup"
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">WhatsApp</label>
            <input
              type="text"
              name="whatsapp"
              value={form.whatsapp}
              onChange={handleChange}
              placeholder="https://wa.me/yourgroup"
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-300 mb-1">Discord</label>
            <input
              type="text"
              name="discord"
              value={form.discord}
              onChange={handleChange}
              placeholder="https://discord.gg/yourserver"
              className="w-full bg-[#061026] border border-[#1a223b] text-slate-100 rounded-md px-3 py-2 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-gradient-to-r from-[#7A00FF] via-[#5B6BFF] to-[#00B4FF] text-white font-semibold py-2 rounded-lg hover:opacity-90 transition disabled:opacity-50"
            >
              {loading ? "Creating..." : "Create Project"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-700 text-white font-semibold py-2 rounded-lg hover:bg-gray-600 transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProjectModal