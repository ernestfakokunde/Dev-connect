import React from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
const groups = [
  {
    id: 1,
    name: "AI & ML Builders",
    members: "12.4k members",
    online: "1.2k online",
    description:
      "Focus: Model fine-tuning, deployment pipelines, and ethical AI practices. Weekly code reviews and demo nights.",
  },
  {
    id: 2,
    name: "React Devs Hub",
    members: "9.8k members",
    online: "700 online",
    description:
      "Learn, build, and share React projects. Perfect for frontend developers improving skills through real-world collaboration.",
  },
  {
    id: 3,
    name: "Full Stack Innovators",
    members: "10.1k members",
    online: "1k online",
    description:
      "Node.js, Express, and MongoDB enthusiasts. Weekly backend deep-dives and hands-on API sessions.",
  },
  {
    id: 4,
    name: "UI/UX Designers",
    members: "6.5k members",
    online: "400 online",
    description:
      "Design meets function. Join to collaborate on modern UX patterns, accessibility, and color system principles.",
  },
];



const Groups = () => {
  const navigate = useNavigate();

  const handleJoinGroup = () => {
    navigate('/feed');
  };

  const handleViewEvents = () => {
    navigate('/messages');
  };
  return (
    <section className="max-w-6xl mx-auto p-6 items-center mt-12">
      <h2 className="text-3xl font-bold text-center text-white mb-6">
        Popular Developer Groups ( Soon )
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bg-[rgba(28,37,65,0.6)] border border-white/10 shadow-soft rounded-xl p-5 transition transform hover:-translate-y-1"
          >
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-white text-lg">
                {group.name}
              </h3>
              <span className="text-xs text-green-400 font-semibold">
                {group.online}
              </span>
            </div>

            <p className="text-white/70 text-sm mb-1">{group.members}</p>
            <p className="text-white/90 text-sm mb-4">{group.description}</p>

            <div className="flex gap-3 justify-between">
              <button onClick={handleJoinGroup} className="btn-gradient text-white font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition">
                Join Group
              </button>
              <button onClick={handleViewEvents} className="border border-white/20 text-white font-semibold text-sm px-4 py-2 rounded-full hover:border-white/40 transition">
                View Events
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Groups;
