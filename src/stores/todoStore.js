// src/stores/todoStore.js
import { defineStore } from "pinia";
import { fetchTodos, addTodo, updateTodo, deleteTodo } from "@/services/todoService";

export const useTodoStore = defineStore("todo", {
  state: () => ({
    todos: [],
  }),
  actions: {
    async getTodos() {
      const res = await fetchTodos();
      this.todos = res.data;
    },
    async addNewTodo(todo) {
      const res = await addTodo(todo);
      this.todos.push(res.data);
    },
    async updateTodoItem(id, todo) {
      const res = await updateTodo(id, todo);
      const index = this.todos.findIndex((t) => t.id === id);
      if (index !== -1) this.todos[index] = res.data;
    },
    async deleteTodoItem(id) {
      await deleteTodo(id);
      this.todos = this.todos.filter((t) => t.id !== id);
    },
  },
});
