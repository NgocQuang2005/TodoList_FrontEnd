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

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    pagination: {
      page: 1,
      pageSize: 5,
      total: 0,
      totalPages: 0,
    },
    currentFilters: {}, // Lưu filters hiện tại
    loading: false,
    error: null,
    todoHistory: [],
    historyLoading: false,
  }),
  actions: {
    async getTodos(page = 1, pageSize = 10, filters = {}) {
      this.loading = true;
      this.error = null;
      const currentPage = page || this.pagination.page;
      const currentPageSize = pageSize || this.pagination.pageSize;

      // Lưu filters hiện tại
      this.currentFilters = { ...filters };
      try {
        const apiFilters = {};
        if (
          filters.title &&
          typeof filters.title === "string" &&
          filters.title.trim()
        ) {
          apiFilters.title = filters.title.trim();
        }
        if (
          filters.status !== null &&
          filters.status !== undefined &&
          filters.status !== "" &&
          filters.status !== "all"
        ) {
          apiFilters.status = filters.status;
        }
        if (
          filters.priority !== null &&
          filters.priority !== undefined &&
          filters.priority !== "" &&
          filters.priority !== "all"
        ) {
          apiFilters.priority = filters.priority;
        }
        const data = await fetchTodos(currentPage, currentPageSize, apiFilters);
        this.todos = data.todos || [];
        this.pagination = {
          page: currentPage,
          pageSize: currentPageSize,
          total: data.pagination?.total || 0,
          totalPages: data.pagination?.totalPages || 0,
        };
      } catch (err) {
        this.error = err.response?.data?.message || "Lỗi khi tải todos";
        this.todos = [];
        this.pagination.total = 0;
        this.pagination.totalPages = 0;
      } finally {
        this.loading = false;
        console.log("=== getTodos END ===");
      }
    },
    async changePage(page) {
      await this.getTodos(page, this.pagination.pageSize, this.currentFilters);
    },
    async changePageSize(pageSize) {
      await this.getTodos(1, pageSize, this.currentFilters);
    },
    async addNewTodo(todo, imageFile = null) {
      this.error = null;
      const errors = validateTodo(todo);
      if (Object.keys(errors).length > 0) {
        this.error = errors;
        return;
      }
      try {
        await addTodo(todo, imageFile);
        await this.getTodos(
          this.pagination.page,
          this.pagination.pageSize,
          this.currentFilters
        );
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể thêm todo";
      }
    },
    async updateTodoItem(id, todo, imageFile = null) {
      this.error = null;
      try {
        const res = await updateTodo(id, todo, imageFile);
        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], ...res.data };
        }
        await this.getTodos(
          this.pagination.page,
          this.pagination.pageSize,
          this.currentFilters
        );
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể cập nhật todo";
      }
    },
    async deleteTodoItem(id) {
      this.error = null;
      try {
        await deleteTodo(id);
        await this.getTodos(
          this.pagination.page,
          this.pagination.pageSize,
          this.currentFilters
        );
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể xóa todo";
      }
    },
    
    async fetchTodoHistory(todoId) {
      this.historyLoading = true;
      this.error = null;
      try {
        this.todoHistory = await getTodoHistory(todoId);
      } catch (err) {
        this.error =
          err.response?.data?.message || "Không thể tải lịch sử todo";
        this.todoHistory = [];
      } finally {
        this.historyLoading = false;
      }
    },
  },
});
