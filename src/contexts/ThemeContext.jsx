/**
 * ThemeContext.jsx
 * ─────────────────────────────────────────────────────────────────────────────
 * Provides a global dark / light theme that:
 *   • Persists to localStorage under the key "cner_theme"
 *   • Injects CSS custom-properties on <html> so every component can use them
 *   • Exposes { theme, isDark, toggleTheme, setTheme } to all consumers
 *
 * Usage:
 *   // Wrap your app (done in App.js):
 *   <ThemeProvider> … </ThemeProvider>
 *
 *   // Consume anywhere:
 *   const { isDark, toggleTheme } = useTheme();
 * ─────────────────────────────────────────────────────────────────────────────
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";

// ─── Token maps ──────────────────────────────────────────────────────────────
// Each key becomes a CSS variable: --bg, --surface, --text, etc.
// Components reference these via var(--bg), var(--text), …

const DARK_TOKENS = {
  // Backgrounds
  "--bg":           "#020b1e",
  "--surface":      "rgba(8,18,46,0.92)",
  "--surface-alt":  "rgba(12,24,58,0.85)",
  "--card":         "rgba(10,20,50,0.95)",
  "--sidebar-bg":   "rgba(5,11,24,0.97)",

  // Borders & dividers
  "--border":       "rgba(38,92,190,0.18)",
  "--border-hov":   "rgba(67,138,255,0.4)",
  "--divider":      "rgba(38,92,190,0.12)",

  // Brand blues
  "--blue":         "#2a6cd4",
  "--blue-light":   "#60a5fa",
  "--blue-dim":     "#1a3e8c",
  "--blue-glow":    "0 0 0 3px rgba(38,92,190,0.16)",

  // Text
  "--text":         "#b8d4f8",
  "--text-dim":     "#5a80a8",
  "--label":        "#3a608e",
  "--muted":        "#1e3a5a",

  // Status
  "--success":      "#10b981",
  "--warning":      "#f59e0b",
  "--danger":       "#ef4444",
  "--info":         "#38bdf8",

  // Input
  "--input-bg":     "rgba(4,9,22,0.8)",
  "--input-border": "rgba(38,92,190,0.22)",

  // Shadows
  "--shadow-sm":    "0 2px 8px rgba(0,0,0,0.4)",
  "--shadow-md":    "0 8px 32px rgba(0,0,0,0.55)",
  "--shadow-lg":    "0 24px 64px rgba(0,0,0,0.7)",

  // Font
  "--font":         "'DM Sans','Segoe UI',system-ui,sans-serif",

  // Scrollbar
  "--scroll-thumb": "rgba(38,92,190,0.22)",
};

const LIGHT_TOKENS = {
  "--bg":           "#f0f5ff",
  "--surface":      "rgba(255,255,255,0.97)",
  "--surface-alt":  "rgba(240,246,255,0.9)",
  "--card":         "rgba(255,255,255,0.98)",
  "--sidebar-bg":   "rgba(255,255,255,0.98)",

  "--border":       "rgba(38,92,190,0.12)",
  "--border-hov":   "rgba(38,92,190,0.38)",
  "--divider":      "rgba(38,92,190,0.08)",

  "--blue":         "#1a52d0",
  "--blue-light":   "#2a6cd4",
  "--blue-dim":     "#93b8f8",
  "--blue-glow":    "0 0 0 3px rgba(38,92,190,0.13)",

  "--text":         "#0d1e3c",
  "--text-dim":     "#3a5278",
  "--label":        "#607898",
  "--muted":        "#9ab8d8",

  "--success":      "#059669",
  "--warning":      "#d97706",
  "--danger":       "#dc2626",
  "--info":         "#0284c7",

  "--input-bg":     "rgba(240,246,255,0.9)",
  "--input-border": "rgba(38,92,190,0.18)",

  "--shadow-sm":    "0 2px 8px rgba(38,92,190,0.08)",
  "--shadow-md":    "0 8px 32px rgba(38,92,190,0.12)",
  "--shadow-lg":    "0 24px 64px rgba(38,92,190,0.16)",

  "--font":         "'DM Sans','Segoe UI',system-ui,sans-serif",

  "--scroll-thumb": "rgba(38,92,190,0.15)",
};

// ─── Apply tokens to <html> ───────────────────────────────────────────────────
function applyTokens(tokens) {
  const root = document.documentElement;
  Object.entries(tokens).forEach(([key, val]) => root.style.setProperty(key, val));
  // Also set a data-theme attribute so you can scope CSS selectors if needed
  root.setAttribute("data-theme", tokens["--bg"].startsWith("#f") ? "light" : "dark");
}

// ─── Context ──────────────────────────────────────────────────────────────────
const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const [theme, setThemeState] = useState(
    () => localStorage.getItem("cner_theme") || "dark"
  );

  const isDark = theme === "dark";

  // Inject CSS variables whenever theme changes
  useEffect(() => {
    applyTokens(isDark ? DARK_TOKENS : LIGHT_TOKENS);
    localStorage.setItem("cner_theme", theme);

    // Apply base body styles
    document.body.style.background    = isDark ? DARK_TOKENS["--bg"]   : LIGHT_TOKENS["--bg"];
    document.body.style.color         = isDark ? DARK_TOKENS["--text"] : LIGHT_TOKENS["--text"];
    document.body.style.fontFamily    = "'DM Sans','Segoe UI',system-ui,sans-serif";
    document.body.style.margin        = "0";
    document.body.style.minHeight     = "100vh";
    document.body.style.transition    = "background 0.35s, color 0.35s";
  }, [theme, isDark]);

  const toggleTheme = useCallback(() => {
    setThemeState(t => (t === "dark" ? "light" : "dark"));
  }, []);

  const setTheme = useCallback((val) => {
    if (val === "dark" || val === "light") setThemeState(val);
  }, []);

  return (
    <ThemeContext.Provider value={{ theme, isDark, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

/**
 * useTheme() — consume theme context anywhere.
 * Returns: { theme, isDark, toggleTheme, setTheme }
 */
export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error("useTheme must be used inside <ThemeProvider>");
  return ctx;
}

export default ThemeContext;