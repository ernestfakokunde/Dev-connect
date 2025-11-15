import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import React from "react";

// This route allows access to ProfileSetup even if profile is not completed
const ProfileSetupRoute = ({ children }) => {
  const {user, loading, token} = useGlobalContext();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-white font-bold text-3xl">Loading...</div>;
  }
  
  // Must be logged in to access profile setup
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If profile is already completed, redirect to feed
  if(user.isProfileCompleted) {
    return <Navigate to="/feed" replace />;
  }
  
  return children;
};

export default ProfileSetupRoute;

