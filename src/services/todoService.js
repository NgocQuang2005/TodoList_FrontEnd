// src/services/todoService.js
import api from "./api";
import { TODO_CONSTANTS } from "@/constants";
import { handleApiError, logError } from "@/utils/errorHandler";

/**
 * Lấy danh sách todos với phân trang và filter
 * @param {number} page - Số trang
 * @param {number} pageSize - Số item mỗi trang
 * @param {Object} filters - Bộ lọc
 * @returns {Promise<Object>} - Dữ liệu todos và pagination
 */
export const fetchTodos = async (page = 1, pageSize = TODO_CONSTANTS.DEFAULT_PAGE_SIZE, filters = {}) => {
  try {
    const params = { page, pageSize, ...filters };
    const res = await api.get("todos", { params });
    return res.data;
  } catch (error) {
    logError('fetchTodos', error);
    throw error;
  }
};

/**
 * Thêm todo mới
 * @param {Object} todo - Dữ liệu todo
 * @param {File|null} imageFile - File ảnh (optional)
 * @returns {Promise<Object>} - Response từ API
 */
export const addTodo = async (todo, imageFile = null) => {
  try {
    if (imageFile instanceof File) {
      const formData = new FormData();
      formData.append("todoData", JSON.stringify(todo));
      formData.append("image", imageFile);
      return await api.post("todos", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return await api.post("todos", todo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    logError('addTodo', error);
    throw error;
  }
};

/**
 * Cập nhật todo
 * @param {string|number} id - ID của todo
 * @param {Object} todo - Dữ liệu todo cần cập nhật
 * @param {File|null} imageFile - File ảnh (optional)
 * @returns {Promise<Object>} - Response từ API
 */
export const updateTodo = async (id, todo, imageFile = null) => {
  try {
    if (imageFile instanceof File) {
      const formData = new FormData();
      formData.append("todoData", JSON.stringify(todo));
      formData.append("image", imageFile);
      return await api.put(`todos/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
      return await api.put(`todos/${id}`, todo, {
        headers: {
          "Content-Type": "application/json",
        },
      });
    }
  } catch (error) {
    logError('updateTodo', error);
    throw error;
  }
};

/**
 * Xóa todo
 * @param {string|number} id - ID của todo cần xóa
 * @returns {Promise<Object>} - Response từ API
 */
export const deleteTodo = async (id) => {
  try {
    return await api.delete(`todos/${id}`);
  } catch (error) {
    logError('deleteTodo', error);
    throw error;
  }
};

/**
 * Lấy lịch sử cập nhật của todo
 * @param {string|number} todoId - ID của todo
 * @returns {Promise<Array>} - Mảng lịch sử cập nhật
 */
export const getTodoHistory = async (todoId) => {
  try {
    const res = await api.get(`todo-history/${todoId}`);
    return res.data;
  } catch (error) {
    logError('getTodoHistory', error);
    throw error;
  }
};
