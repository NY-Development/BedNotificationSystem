import React from 'react';
import { Navigate, useLocation, Outlet } from 'react-router-dom';

const UniversityWrapper = () => {
  const university = localStorage.getItem("university");
  const location = useLocation();

  // If no university is selected, force redirect
  if (university === null) {
    return <Navigate to="/choice" state={{ from: location.pathname }} replace />;
  }

  // Outlet renders the matched child route
  return <Outlet />;
};

export default UniversityWrapper;