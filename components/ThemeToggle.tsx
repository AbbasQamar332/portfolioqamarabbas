"use client";

import { useTheme } from "./ThemeProvider";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="btn btn-secondary fixed top-5 right-5 z-50 !p-3 !w-12 !h-12 flex items-center justify-center rounded-full"
      aria-label="Toggle theme"
    >
      <i className={`fas ${theme === "dark" ? "fa-sun" : "fa-moon"}`}></i>
    </button>
  );
}
