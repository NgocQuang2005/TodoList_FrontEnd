import router from "@/router";
import axios from "axios";
const api = axios.create({
  baseURL: "http://localhost:3443/api/",
  timeout: 5000,
});
// Interceptor để thêm token vào mỗi request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("tokenTodo");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
// Interceptor để xử lý lỗi response (vd: token hết hạn)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.log(error.response.status);
    if (error.response && error.response.status === 401) {
      localStorage.removeItem("tokenTodo");
      alert("Token đã hết hạn, hãy đăng nhập lại");
      router.push("/login");
    }
    return Promise.reject(error);
  }
);
export const getStaticUrl = (path) => {
  if (!path) return "";
  return `http://localhost:3443${path}`;
};
export default api;
