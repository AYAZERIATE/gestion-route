import React, { createContext, useContext, useState, useEffect } from "react";

// =============================================================================
// AuthContext — CNER Dashboard  (Mode MOCK — 0 appel Laravel)
// =============================================================================

export const AuthContext = createContext(null);

const MOCK_TOKEN = "mock-jwt-cner-2026";

const makeMockUser = (name, email) => ({
  id:         1,
  name:       name  || "Jean Dupont",
  email:      email || "admin@cner.ma",
  role:       "admin",
  department: "Direction Générale",
  phone:      "+212 5 37 00 00 00",
  is_active:  true,
  created_at: new Date().toISOString(),
});

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// =============================================================================
export function AuthProvider({ children }) {

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("cner_user")) || null; }
    catch { return null; }
  });

  const [token, setToken] = useState(
    () => localStorage.getItem("cner_token") || null
  );

  useEffect(() => {
    token ? localStorage.setItem("cner_token", token)
          : localStorage.removeItem("cner_token");
  }, [token]);

  useEffect(() => {
    user ? localStorage.setItem("cner_user", JSON.stringify(user))
         : localStorage.removeItem("cner_user");
  }, [user]);

  // ── login(email, password) ─────────────────────────────────────────────────
  // Retourne { success: true, user, token } — accepte n'importe quels identifiants
  const login = async (email, password) => {
    try {
      await sleep(600);
      const mockUser = makeMockUser("Jean Dupont", email);
      setUser(mockUser);
      setToken(MOCK_TOKEN);
      return { success: true, user: mockUser, token: MOCK_TOKEN };
    } catch (err) {
      return { success: false, message: err.message || "Erreur de connexion." };
    }
  };

  // ── register(name, email, password) ───────────────────────────────────────
  // Retourne { success: true } — ne connecte PAS, redirige vers /login
  const register = async (name, email, password) => {
    try {
      await sleep(600);
      const mockUser = makeMockUser(name, email);
      return { success: true, user: mockUser };
    } catch (err) {
      return { success: false, message: err.message || "Erreur d'inscription." };
    }
  };

  // ── logout() ──────────────────────────────────────────────────────────────
  const logout = () => {
    setUser(null);
    setToken(null);
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

// ── Hooks ─────────────────────────────────────────────────────────────────────

/** Pour pages protégées (Dashboard, etc.) — lance erreur si hors provider */
export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth() doit être dans <AuthProvider>.");
  return ctx;
}

/** Pour pages publiques (Login, Register) — jamais d'erreur */
export function useAuthSafe() {
  return useContext(AuthContext);
}