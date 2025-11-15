import { Navigate, useLocation } from "react-router-dom";
import { useGlobalContext } from "../context/context";
import React from "react";

const ProtectedRoute = ({ children }) => {
  const {user, loading, token} = useGlobalContext();
  const location = useLocation();

  if (loading) {
    return <div className="text-center mt-10 text-white font-bold text-3xl">Loading...</div>;
  }
  
  if (!user || !token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  if(!user.isProfileCompleted && window.location.pathname!== "/profilesetup"){
    return <Navigate to="/profilesetup" replace />;
  }
  return children;
};

export default ProtectedRoute;