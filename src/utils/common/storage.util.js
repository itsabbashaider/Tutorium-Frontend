const isBrowser = typeof window !== "undefined";

export const storage = {
  get(key) {
    if (!isBrowser) return null;

    try {
      return localStorage.getItem(key);
    } catch {
      return null;
    }
  },

  set(key, value) {
    if (!isBrowser) return;

    try {
      localStorage.setItem(key, value);
    } catch {}
  },

  remove(key) {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(key);
    } catch {}
  },

  clear() {
    if (!isBrowser) return;

    try {
      localStorage.clear();
    } catch {}
  },
};

export default storage;