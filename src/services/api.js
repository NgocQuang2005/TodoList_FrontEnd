import router from "@/router";
import axios from "axios";
import { API_CONFIG, STORAGE_KEYS, ERROR_MESSAGES } from "@/constants";
import { handleApiError, logError } from "@/utils/errorHandler";

const api = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
});

// Interceptor để thêm token vào mỗi request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    logError('API Request', error);
    return Promise.reject(error);
  }
);

// Interceptor để xử lý lỗi response
api.interceptors.response.use(
  (response) => response,
  (error) => {
    logError('API Response', error);
    
    if (error.response?.status === 401) {
      localStorage.removeItem(STORAGE_KEYS.TOKEN);
      
      // Chỉ hiển thị thông báo nếu không phải trang login
      if (router.currentRoute.value.path !== '/login') {
        // Thay alert bằng notification system tốt hơn
        console.warn(ERROR_MESSAGES.UNAUTHORIZED);
        router.push("/login");
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Tạo URL cho static files
 * @param {string} path - Đường dẫn file
 * @returns {string} - URL đầy đủ
 */
export const getStaticUrl = (path) => {
  if (!path) return "";
  return `${API_CONFIG.STATIC_URL}${path}`;
};

export default api;
