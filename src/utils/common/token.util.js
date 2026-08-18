import { STORAGE_KEYS } from "@/constants";
import storage from "./storage.util";

const token = {
  getAccessToken() {
    return storage.get(STORAGE_KEYS.ACCESS_TOKEN);
  },

  setAccessToken(accessToken) {
    storage.set(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
  },

  removeAccessToken() {
    storage.remove(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getRefreshToken() {
    return storage.get(STORAGE_KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(refreshToken) {
    storage.set(STORAGE_KEYS.REFRESH_TOKEN, refreshToken);
  },

  removeRefreshToken() {
    storage.remove(STORAGE_KEYS.REFRESH_TOKEN);
  },

  clear() {
    this.removeAccessToken();
    this.removeRefreshToken();
  },
};

export default token;
