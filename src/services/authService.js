// src/services/authService.js
import api from "./api";

export const login = (username, password) => {
  return api.post("auth/login", { username, password });
};

export const register = (username, password, email) => {
  return api.post("auth/register", { username, password, email });
};

export const logout = () => {
  localStorage.removeItem("tokenTodo");
};
