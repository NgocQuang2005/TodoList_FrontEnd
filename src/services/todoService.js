// src/services/todoService.js
import api from "./api";

export const fetchTodos = async (page = 1, pageSize = 10, filters = {}) => {
  const params = { page, pageSize, ...filters };
  const res = await api.get("todos", { params });
  return res.data;
};

export const addTodo = (todo, imageFile = null) => {
  if (imageFile instanceof File) {
    const formData = new FormData();
    formData.append("todoData", JSON.stringify(todo));
    formData.append("image", imageFile);
    return api.post("todos", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return api.post("todos", todo,{
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};
export const updateTodo = (id, todo, imageFile = null) => {
  if (imageFile instanceof File) {
    const formData = new FormData();
    formData.append("todoData", JSON.stringify(todo));
    formData.append("image", imageFile);
    return api.put(`todos/${id}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  } else {
    return api.put(`todos/${id}`, todo,{
      headers: {
        "Content-Type": "application/json",
      },
    });
  }
};

export const deleteTodo = (id) => api.delete(`todos/${id}`);

export const getTodoHistory = async (todoId) => {
  const res = await api.get(`todo-history/${todoId}`);
  return res.data; // trả về mảng lịch sử
};
