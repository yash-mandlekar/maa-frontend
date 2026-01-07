import api from "../lib/api";
import useAuthStore from "../store/authStore";

export const authService = {
  async login(email, password) {
    const response = await api.post("/auth/login", { email, password });
    const { user, token } = response.data.data;

    // Store in localStorage
    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Update store
    useAuthStore.getState().setAuth(user, token);

    return { user, token };
  },

  async register(userData) {
    const response = await api.post("/auth/register", userData);
    const { user, token } = response.data.data;

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    useAuthStore.getState().setAuth(user, token);

    return { user, token };
  },

  async getMe() {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  },

  logout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    useAuthStore.getState().logout();
  },

  getToken() {
    return localStorage.getItem("token");
  },

  isAuthenticated() {
    return !!this.getToken();
  },
};
