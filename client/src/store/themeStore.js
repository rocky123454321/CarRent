import { create } from "zustand";

export const useThemeStore = create((set) => ({
  darkMode: localStorage.getItem("theme") === "dark" || 
           (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches),

  toggleTheme: () =>
    set((state) => {
      const newMode = !state.darkMode;
      const root = window.document.documentElement;
      
      if (newMode) {
        root.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        root.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
      
      return { darkMode: newMode };
    }),

  initTheme: () => {
    const root = window.document.documentElement;
    const isDark = localStorage.getItem("theme") === "dark" || 
                  (!("theme" in localStorage) && window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    if (isDark) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    set({ darkMode: isDark });
  },
}));