import api from "./api";

export const getUserLoginDeltail =()=> api.get("user/user-detail");
export const editUser = (user) => api.put("user/edit-user", user);
export const changePassword = (user) => api.put("user/change-password", user)
export const forgotPassword = (email) => api.post("user/forgot-password", email)
export const resetPassword = (user) => api.post("user/reset-password", user)