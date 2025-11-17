import React from "react";
import { getImageUrl } from "../utils/imageUtils";

export default function ProfileHeader({ profile }) {
  return (
    <div className="bg-white rounded-xl shadow p-6">
      <div className="flex items-center gap-6">
        <img src={getImageUrl(profile.profilePic)} className="w-28 h-28 rounded-full object-cover" onError={(e) => {e.target.src = '/default-avatar.svg'}} />
        <div>
          <h1 className="text-2xl font-semibold">{profile.username}</h1>
          <p className="text-gray-500">{profile.bio || "No bio yet"}</p>
        </div>
      </div>
    </div>
  );
}
