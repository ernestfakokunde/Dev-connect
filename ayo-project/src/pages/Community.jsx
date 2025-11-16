import React, { useState, useEffect } from 'react'
import Navbar from '../components/Navbar'
import { FiFilter } from "react-icons/fi";
import { FaPlus } from 'react-icons/fa';
import { FaRocket, FaUsers } from 'react-icons/fa6';
import ProjectModal from '../components/ProjectModal';
import axiosInstance from '../api/axiosInstance';
import { useGlobalContext } from '../context/context';
import { toast } from 'react-toastify';
import { getImageUrl } from '../utils/imageUtils';

const Community = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [projects, setProjects] = useState([]);
  const [filteredProjects, setFilteredProjects] = useState([]);
  const [filter, setFilter] = useState("All Levels");
  const [loading, setLoading] = useState(true);
  const { user, token } = useGlobalContext();

  useEffect(() => {
    fetchProjects();
  }, []);

  useEffect(() => {
    // Filter projects based on selected level
    if (filter === "All Levels") {
      setFilteredProjects(projects);
    } else {
      setFilteredProjects(projects.filter(p => p.experienceLevel === filter));
    }
  }, [filter, projects]);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/projects");
      setProjects(response.data.projects || []);
    } catch (error) {
      console.error("Error fetching projects:", error);
      toast.error("Failed to load projects");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinProject = async (projectId) => {
    if (!token) {
      toast.error("Please log in to join projects");
      return;
    }
    try {
      await axiosInstance.post(`/projects/join/${projectId}`);
      toast.success("Successfully joined project!");
      fetchProjects(); // Refresh projects
    } catch (error) {
      console.error("Error joining project:", error);
      toast.error(error.response?.data?.message || "Failed to join project");
    }
  };

  const isUserOwner = (ownerId) => user?._id === ownerId || user?.id === ownerId;

  return (
    <>
      <Navbar />

      <section className="max-w-6xl mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-semibold text-white tracking-tight mb-4">Community Collaborations</h2>
          <p className="max-w-2xl text-slate-300 mb-8 text-lg">Discover exciting projects and connect with developers from around the world. Start your own collaboration or join existing teams.</p>

          <button
            onClick={() => setIsModalOpen(true)}
            className="inline-flex items-center gap-3 px-6 py-3 rounded-full text-white font-semibold bg-gradient-to-r from-[#7A00FF] via-[#5B6BFF] to-[#00B4FF] shadow-[0_20px_40px_rgba(122,0,255,0.18)] hover:opacity-95 transition"
          >
            <FaPlus className="w-4 h-4" />
            <span>Start Collaboration</span>
          </button>
          <p className='max-w-[400px] p-2 mt-4'>Note: When creating a collaboration. Please provide a valid link to your channel or community. Else users might not be able to join your project. <span className='font-bold text-white'> Click the Icon to join the required channel </span> </p>
        </div>

        {/* Filter row */}
        <div className="mt-12 flex items-center justify-between px-4 flex-col md:flex-row gap-4">
          <div className="flex items-center gap-4 p-3 rounded-lg w-full md:w-auto">
            <FiFilter className="text-slate-300 text-xl" />
            <div className="flex items-center gap-3">
              <span className="text-slate-300">Filter by experience:</span>
              <select 
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="bg-[#1a0b3a] border border-[#28103f] text-slate-100 rounded-md px-3 py-1 outline-none focus:ring-2 focus:ring-[#7A00FF] transition"
              >
                <option>All Levels</option>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>

          <div className="text-slate-400">{filteredProjects.length} projects</div>
        </div>

        {/* Projects Grid */}
        {loading ? (
          <div className="mt-8 flex justify-center">
            <div className="text-slate-300">Loading projects...</div>
          </div>
        ) : filteredProjects.length === 0 ? (
          <div className="mt-8 flex justify-center">
            <div className="text-slate-300">No projects found for this filter</div>
          </div>
        ) : (
          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="bg-gradient-to-br from-[#0b1228] to-[#1a223b] border border-[#1a223b] rounded-lg overflow-hidden hover:border-[#7A00FF] transition shadow-lg"
              >
                {/* Project Image */}
                {project.image && (
                  <img
                    src={getImageUrl(project.image)}
                    alt={project.projectName}
                    className="w-full h-48 object-cover"
                  />
                )}

                {/* Project Info */}
                <div className="p-4 space-y-3">
                  <h3 className="text-lg font-semibold text-white line-clamp-2">{project.projectName}</h3>
                  <p className="text-sm text-slate-300 line-clamp-2">{project.projectDescription}</p>

                  {/* Meta Info */}
                  <div className="flex items-center justify-between pt-2 border-t border-slate-600">
                    <div className="flex items-center gap-1 text-xs text-slate-400">
                      <FaUsers className="text-[#7A00FF]" />
                      <span>{project.memberCount || 0} members</span>
                    </div>
                    <span className="text-xs px-2 py-1 rounded bg-[#1a0b3a] text-slate-300">{project.experienceLevel}</span>
                  </div>

                  {/* Owner Info */}
                  <div className="flex items-center gap-2 py-2">
                    <img
                      src={getImageUrl(project.owner?.profilePic)}
                      alt={project.owner?.username}
                      className="w-8 h-8 rounded-full object-cover"
                    />
                    <div className="text-sm">
                      <p className="text-slate-200 font-medium">{project.owner?.username}</p>
                      <p className="text-xs text-slate-500">Project Owner</p>
                    </div>
                  </div>

                  {/* Communication Links */}
                  {(project.telegram || project.whatsapp || project.discord) && (
                    <div className="flex gap-2 pt-2">
                      {project.telegram && (
                        <a
                          href={project.telegram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded bg-blue-600 text-white hover:bg-blue-700 transition"
                        >
                          Telegram
                        </a>
                      )}
                      {project.whatsapp && (
                        <a
                          href={project.whatsapp}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded bg-green-600 text-white hover:bg-green-700 transition"
                        >
                          WhatsApp
                        </a>
                      )}
                      {project.discord && (
                        <a
                          href={project.discord}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-xs px-2 py-1 rounded bg-indigo-600 text-white hover:bg-indigo-700 transition"
                        >
                          Discord
                        </a>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div className="pt-3 flex gap-2">
                    {isUserOwner(project.owner?._id) ? (
                      <button className="flex-1 px-3 py-2 bg-slate-700 text-white text-sm rounded-md cursor-not-allowed">
                        Your Project
                      </button>
                    ) : (
                      <button
                        onClick={() => handleJoinProject(project._id)}
                        className="flex-1 px-3 py-2 bg-gradient-to-r from-[#7A00FF] to-[#00B4FF] text-white text-sm rounded-md hover:opacity-90 transition font-semibold flex items-center justify-center gap-1"
                      >
                        <FaRocket className="w-3 h-3" />
                        Join Project
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Project Modal */}
      <ProjectModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onProjectCreated={fetchProjects}
      />
    </>
  )
}

export default Community