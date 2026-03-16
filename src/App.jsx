import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// ── Contexts ──────────────────────────────────────────────────────────────────
import { ThemeProvider } from "./contexts/ThemeContext";
import { AuthProvider  } from "./contexts/AuthContext";

// ── Layout ────────────────────────────────────────────────────────────────────
import MainLayout from "./components/MainLayout";

// ── Route guard ───────────────────────────────────────────────────────────────
// IMPORTANT: import name must match filename on disk exactly (case-sensitive)
// Disk file: src/pages/Protectedroute.jsx  ← capital P, lowercase r
import ProtectedRoute from "./pages/ProtectedRoute";

// ── Public pages ──────────────────────────────────────────────────────────────
import Login    from "./pages/Login";      // src/pages/Login.jsx
import Register from "./pages/Register";   // src/pages/Register.jsx

// ── Protected pages ───────────────────────────────────────────────────────────
// Match filenames EXACTLY as they appear on disk (Windows is case-insensitive
// at runtime but webpack/ESLint enforces the on-disk casing on Linux/CI)

// ⚠️  Your file is named "GestionLoiFinance .jsx" (with a space).
//     Rename it to "GestionLoiFinance.jsx" (remove the space) then this import works.
import GestionLoiFinance from "./pages/GestionLoiFinance";
import GestionMarche from "./pages/GestionMarche";
import Schedule      from "./pages/Schedule";               // src/pages/Schedule.jsx

// Dashboard — create src/pages/Dashboard.jsx from the Dashboard.jsx we generated,
// or copy the content below into src/pages/Dashboard.jsx
import Dashboard from "./pages/Dashboard";                  // src/pages/Dashboard.jsx

export default function App() {
  return (
    <ThemeProvider>      {/* outermost — Login/Register also get the theme */}
      <AuthProvider>
        <BrowserRouter>
          <Routes>

            {/* ── Public ──────────────────────────────────────────────── */}
            <Route path="/login"    element={<Login />}    />
            <Route path="/register" element={<Register />} />

            {/* ── Protected ───────────────────────────────────────────── */}
            {/*
              Level 1: ProtectedRoute — if not authenticated → redirect /login
              Level 2: MainLayout    — renders Sidebar + Footer shell
              Level 3: page component (replaces <Outlet /> in MainLayout)
            */}
            <Route element={<ProtectedRoute />}>
              <Route element={<MainLayout />}>

                <Route path="/"                   element={<Navigate to="/dashboard" replace />} />
                <Route path="/dashboard"           element={<Dashboard />}         />
                <Route path="/gestion-loi-finance" element={<GestionLoiFinance />} />
                <Route path="/gestion-marche"      element={<GestionMarche />}     />
                <Route path="/schedule"            element={<Schedule />}          />

              </Route>
            </Route>

            {/* ── Fallback ────────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />

          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}
