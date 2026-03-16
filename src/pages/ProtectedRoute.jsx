import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

/**
 * ProtectedRoute — CNER Dashboard
 * ================================
 * Utilisé dans App.js comme wrapper de routes :
 *
 *   <Route element={<ProtectedRoute />}>
 *     <Route element={<MainLayout />}>
 *       <Route path="/dashboard" element={<Dashboard />} />
 *       ...
 *     </Route>
 *   </Route>
 *
 * - Si authentifié  → rend <Outlet /> (les routes enfants)
 * - Si NON authentifié → redirige vers /login
 *   et sauvegarde l'URL demandée dans location.state.from
 *   pour rediriger après login.
 */
export default function ProtectedRoute() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        state={{ from: location }}
        replace
      />
    );
  }

  // Rend les routes enfants (MainLayout → Dashboard, etc.)
  return <Outlet />;
}