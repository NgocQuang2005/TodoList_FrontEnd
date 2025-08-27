import { defineStore } from "pinia";
import { login, register, logout } from "@/services/authService";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    token: localStorage.getItem("tokenTodo") || null,
    user: null, // Nếu backend có trả thêm user info thì lưu vào đây
  }),
  getters: {
    isLoggedIn: (state) => !!state.token,
  },
  actions: {
    async loginAction(username, password) {
      try {
        const res = await login(username, password);
        const token = res.data.user.token;
        
        this.token = token;
        localStorage.setItem("tokenTodo", token);

        return true;
      } catch (error) {
        console.error("Login failed:", error);
        throw error;
      }
    },

    async registerAction(username, password, email) {
      try {
        await register(username, password,email);
        return true;
      } catch (error) {
        console.error("Register failed:", error);
        throw error;
      }
    },

    logoutAction() {
      logout();
      this.token = null;
      this.user = null;
      localStorage.removeItem("tokenTodo");
    },
  },
});
