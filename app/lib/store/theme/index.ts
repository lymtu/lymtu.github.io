import { useEffect, useSyncExternalStore } from "react";

type Theme = "os" | "light" | "dark";
type CurrentTheme = Exclude<Theme, "os">;
type Listener = () => void;

const SESSION_STORAGE_KEY = "theme";

let expectTheme: Theme = "os";
let currentTheme: CurrentTheme = "light";
let themeMatchMedia: boolean = false;
let snapshot: { expectTheme: Theme; currentTheme: CurrentTheme } = {
  expectTheme,
  currentTheme,
};

const setupTheme = (current: CurrentTheme) => {
  if (current === "dark") {
    document.documentElement.classList.add("dark");
    return;
  }

  document.documentElement.classList.remove("dark");
};

const changeTheme = (newTheme: Theme) => {
  expectTheme = newTheme;

  if (newTheme === "os") {
    currentTheme = themeMatchMedia ? "dark" : "light";
    sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } else {
    currentTheme = newTheme;
    sessionStorage.setItem(SESSION_STORAGE_KEY, newTheme);
  }

  snapshot = { expectTheme, currentTheme };

  setupTheme(currentTheme);

  for (const listener of listeners) {
    listener();
  }
};

let listeners: Listener[] = [];

const subscribe = (listener: Listener) => {
  listeners = [...listeners, listener];
  return () => {
    listeners = listeners.filter((l) => l !== listener);
  };
};

const getSnapshot = () => snapshot;

const init = () => {
  if (typeof window !== "undefined") {
    themeMatchMedia = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const sessionTheme = sessionStorage.getItem(
      SESSION_STORAGE_KEY,
    ) as CurrentTheme;

    if (sessionTheme) {
      expectTheme = sessionTheme;
      currentTheme = sessionTheme;
    } else {
      expectTheme = "os";
      currentTheme = themeMatchMedia ? "dark" : "light";
    }

    snapshot = { expectTheme, currentTheme };

    setupTheme(currentTheme);
  }
};

const useTheme = () => {
  useEffect(() => {
    init();
  }, []);
  return useSyncExternalStore(subscribe, getSnapshot, () => snapshot);
};

export { useTheme, changeTheme };
