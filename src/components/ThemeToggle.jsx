import React, { useState, useEffect } from "react";
import { MdLightMode, MdDarkMode } from "react-icons/md";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const darkMode = savedTheme ? savedTheme === "dark" : prefersDark;
    setIsDark(darkMode);
    applyTheme(darkMode);
  }, []);

  const applyTheme = (dark) => {
    if (dark) {
      document.documentElement.classList.add("dark-mode");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark-mode");
      localStorage.setItem("theme", "light");
    }
  };

  const toggleTheme = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    applyTheme(newDarkMode);
  };

  return (
    <button
      className="theme-toggle"
      onClick={toggleTheme}
      aria-label={isDark ? "Passer au mode clair" : "Passer au mode sombre"}
      title={isDark ? "Mode clair" : "Mode sombre"}
    >
      {isDark ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
    </button>
  );
}
