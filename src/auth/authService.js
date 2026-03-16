/**
 * authService.js
 * Centralized authentication logic for CNER platform.
 * Swap the MOCK section with a real API call when backend is ready.
 */

const AUTH_KEY = "cner_auth";

// ─── Shape stored in localStorage ────────────────────────────────────────────
// {
//   token:     string   (JWT or session token from real API)
//   user:      { name, email, role }
//   expiresAt: number   (Unix ms timestamp)
// }

// ─── Mock credentials (replace with real API call) ───────────────────────────
const MOCK_USERS = [
  {
    email: "admin@cner.ma",
    password: "123456",
    user: { name: "Admin CNER", email: "admin@cner.ma", role: "Administrateur" },
  },
];

const SESSION_DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours

// ─── Public API ──────────────────────────────────────────────────────────────

/**
 * Attempt login. Returns { success, user?, error? }.
 * Replace the mock block with:  const res = await fetch("/api/auth/login", { ... })
 */
export async function login(email, password) {
  // Simulate network latency
  await new Promise((r) => setTimeout(r, 1200));

  // ── MOCK AUTHENTICATION ──────────────────────────────────────────────────
  const match = MOCK_USERS.find(
    (u) =>
      u.email.toLowerCase() === email.trim().toLowerCase() &&
      u.password === password
  );

  if (!match) {
    return {
      success: false,
      error: "Identifiants invalides. Vérifiez votre adresse électronique et votre mot de passe.",
    };
  }

  const session = {
    token: `mock-jwt-${Date.now()}`,   // ← replace with real JWT from API
    user: match.user,
    expiresAt: Date.now() + SESSION_DURATION_MS,
  };

  localStorage.setItem(AUTH_KEY, JSON.stringify(session));
  return { success: true, user: match.user };
  // ── END MOCK ─────────────────────────────────────────────────────────────
}

/**
 * Clear session and log out.
 */
export function logout() {
  localStorage.removeItem(AUTH_KEY);
}

/**
 * Returns the stored session object, or null if absent / expired.
 */
export function getSession() {
  try {
    const raw = localStorage.getItem(AUTH_KEY);
    if (!raw) return null;

    const session = JSON.parse(raw);

    // Invalidate expired sessions automatically
    if (Date.now() > session.expiresAt) {
      logout();
      return null;
    }

    return session;
  } catch {
    logout();
    return null;
  }
}

/**
 * True if the user has a valid, non-expired session.
 */
export function isAuthenticated() {
  return getSession() !== null;
}

/**
 * Returns the authenticated user object, or null.
 */
export function getUser() {
  return getSession()?.user ?? null;
}