

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve destination so Login can redirect back after success
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
}