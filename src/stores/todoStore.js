// src/stores/todoStore.js
import { defineStore } from "pinia";
import {
  fetchTodos,
  addTodo,
  updateTodo,
  deleteTodo,
} from "@/services/todoService";
import { validateTodo } from "@/validation/todoSchema";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
    loading: false,
    error: null,
  }),
  getters: {
    completedTodos: (state) => state.todos.filter((t) => t.is_completed),
    pendingTodos: (state) => state.todos.filter((t) => !t.is_completed),
    sortedByDeadline: (state) =>
      [...state.todos].sort(
        (a, b) => new Date(a.deadline) - new Date(b.deadline)
      ),
  },

  actions: {
    async getTodos() {
      this.loading = true;
      this.error = null;
      try {
        const res = await fetchTodos();
        this.todos = res.data; 
      } catch (err) {
        this.error = err.response?.data?.message || "Lỗi khi tải todos";
      } finally {
        this.loading = false;
      }
    },

    async addNewTodo(todo) {
      this.error = null;
      const errors = validateTodo(todo);
      if (Object.keys(errors).length > 0) {
        this.error = errors;
        return; // dừng lại, không gọi API
      }
      try {
        const res = await addTodo(todo);
        this.todos.push(res.data);
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể thêm todo";
      }
    },

    async updateTodoItem(id, todo) {
      this.error = null;
      try {
        const res = await updateTodo(id, todo);
        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], ...res.data }; // merge thay vì overwrite
        }
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể cập nhật todo";
      }
    },

    async toggleCompleted(id, completed) {
      try {
        const res = await updateTodo(id, { is_completed: completed });
        const index = this.todos.findIndex((t) => t.id === id);
        if (index !== -1) {
          this.todos[index] = { ...this.todos[index], ...res.data };
        }
      } catch (err) {
        this.error =
          err.response?.data?.message || "Không thể đổi trạng thái todo";
      }
    },

    async deleteTodoItem(id) {
      this.error = null;
      try {
        await deleteTodo(id);
        this.todos = this.todos.filter((t) => t.id !== id);
      } catch (err) {
        this.error = err.response?.data?.message || "Không thể xóa todo";
      }
    },
  },
});
