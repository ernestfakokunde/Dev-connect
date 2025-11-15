import React from "react";

export default function ProfileHeader({ profile }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-6">
        <img src={profile.profilePic || "/uploads/default-avatar.png"} className="w-28 h-28 rounded-full object-cover" />
        <div>
          <h1 className="text-2xl font-semibold">{profile.username}</h1>
          <p className="text-gray-500">{profile.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
}
