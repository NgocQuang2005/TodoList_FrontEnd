// src/stores/todoStore.js
import { defineStore } from "pinia";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
  getTodoHistory,
} from "@/services/todoService";
import { validateTodo } from "@/validation/todoSchema";
import { TODO_CONSTANTS, SUCCESS_MESSAGES } from "@/constants";
import { handleApiError, logError } from "@/utils/errorHandler";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    pagination: {
      page: 1,
      pageSize: TODO_CONSTANTS.DEFAULT_PAGE_SIZE,
      total: 0,
      totalPages: 0,
    },
    currentFilters: {}, // Lưu filters hiện tại
    loading: false,
    error: null,
    todoHistory: [],
    historyLoading: false,
    // Cache để tránh gọi API không cần thiết
    lastFetchParams: null,
  }),
  actions: {
    /**
     * Lấy danh sách todos với cache checking
     */
    async getTodos(page = 1, pageSize = TODO_CONSTANTS.DEFAULT_PAGE_SIZE, filters = {}) {
      this.loading = true;
      this.error = null;
      
      const currentPage = page || this.pagination.page;
      const currentPageSize = pageSize || this.pagination.pageSize;

      // Lưu filters hiện tại
      this.currentFilters = { ...filters };
      
      // Tạo cache key để kiểm tra
      const cacheKey = JSON.stringify({ page: currentPage, pageSize: currentPageSize, filters });
      
      try {
        const apiFilters = this._buildApiFilters(filters);
        const data = await fetchTodos(currentPage, currentPageSize, apiFilters);
        
        this.todos = data.todos || [];
        this.pagination = {
          page: currentPage,
          pageSize: currentPageSize,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        };
        
        this.lastFetchParams = cacheKey;
        
      } catch (err) {
        logError('getTodos', err);
        this.error = handleApiError(err);
        this.todos = [];
        this.pagination.total = 0;
        this.pagination.totalPages = 0;
      } finally {
        this.loading = false;
      }
    },

    /**
     * Chuyển trang
     */
    async changePage(page) {
      await this.getTodos(page, this.pagination.pageSize, this.currentFilters);
    },

    /**
     * Thay đổi số item mỗi trang
     */
    async changePageSize(pageSize) {
      await this.getTodos(1, pageSize, this.currentFilters);
    },

    /**
     * Thêm todo mới - KHÔNG gọi lại getTodos (để tránh duplicate)
     */
    async addNewTodo(todo, imageFile = null) {
      this.error = null;
      
      const errors = validateTodo(todo);
      if (Object.keys(errors).length > 0) {
        this.error = errors;
        return { success: false, errors };
      }
      
      try {
        const response = await addTodo(todo, imageFile);
        
        // Thêm todo mới vào đầu danh sách thay vì gọi lại API
        if (response.data) {
          this.todos.unshift(response.data);
          this.pagination.total += 1;
          
          // Nếu vượt quá pageSize, xóa item cuối
          if (this.todos.length > this.pagination.pageSize) {
            this.todos.pop();
          }
        }
        
        return { success: true, data: response.data };
        
      } catch (err) {
        logError('addNewTodo', err);
        this.error = handleApiError(err);
        return { success: false, error: this.error };
      }
    },

    /**
     * Cập nh��t todo - Optimistic update
     */
    async updateTodoItem(id, todo, imageFile = null) {
      this.error = null;
      
      const index = this.todos.findIndex((t) => t.id === id);
      const originalTodo = index !== -1 ? { ...this.todos[index] } : null;
      
      // Optimistic update
      if (index !== -1) {
        this.todos[index] = { ...this.todos[index], ...todo };
      }
      
      try {
        const response = await updateTodo(id, todo, imageFile);
        
        // Cập nhật với dữ liệu từ server
        if (index !== -1 && response.data) {
          this.todos[index] = response.data;
        }
        
        return { success: true, data: response.data };
        
      } catch (err) {
        logError('updateTodoItem', err);
        
        // Rollback optimistic update
        if (index !== -1 && originalTodo) {
          this.todos[index] = originalTodo;
        }
        
        this.error = handleApiError(err);
        return { success: false, error: this.error };
      }
    },

    /**
     * Xóa todo - Optimistic delete
     */
    async deleteTodoItem(id) {
      this.error = null;
      
      const index = this.todos.findIndex((t) => t.id === id);
      const originalTodo = index !== -1 ? { ...this.todos[index] } : null;
      
      // Optimistic delete
      if (index !== -1) {
        this.todos.splice(index, 1);
        this.pagination.total -= 1;
      }
      
      try {
        await deleteTodo(id);
        return { success: true };
        
      } catch (err) {
        logError('deleteTodoItem', err);
        
        // Rollback optimistic delete
        if (originalTodo && index !== -1) {
          this.todos.splice(index, 0, originalTodo);
          this.pagination.total += 1;
        }
        
        this.error = handleApiError(err);
        return { success: false, error: this.error };
      }
    },
    
    /**
     * Lấy lịch sử todo
     */
    async fetchTodoHistory(todoId) {
      this.historyLoading = true;
      this.error = null;
      
      try {
        this.todoHistory = await getTodoHistory(todoId);
        return { success: true, data: this.todoHistory };
        
      } catch (err) {
        logError('fetchTodoHistory', err);
        this.error = handleApiError(err);
        this.todoHistory = [];
        return { success: false, error: this.error };
        
      } finally {
        this.historyLoading = false;
      }
    },

    /**
     * Refresh dữ liệu hiện tại
     */
    async refreshCurrentData() {
      await this.getTodos(
        this.pagination.page,
        this.pagination.pageSize,
        this.currentFilters
      );
    },

    /**
     * Helper: Build API filters
     */
    _buildApiFilters(filters) {
      const apiFilters = {};
      
      if (filters.title && typeof filters.title === "string" && filters.title.trim()) {
        apiFilters.title = filters.title.trim();
      }
      
      if (filters.status !== null && filters.status !== undefined && 
          filters.status !== "" && filters.status !== "all") {
        apiFilters.status = filters.status;
      }
      
      if (filters.priority !== null && filters.priority !== undefined && 
          filters.priority !== "" && filters.priority !== "all") {
        apiFilters.priority = filters.priority;
      }
      
      return apiFilters;
    },

    /**
     * Clear error state
     */
    clearError() {
      this.error = null;
    },
  },
});
