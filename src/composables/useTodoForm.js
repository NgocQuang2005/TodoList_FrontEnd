import { ref } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { validateTodo } from "@/validation/todoSchema";

export function useTodoForm() {
  const todoStore = useTodoStore();
  const showDialog = ref(false);
  const editingTodo = ref(null);
  const selectedImageFile = ref(null);
  const showHistoryDialog = ref(false);
  const form = ref({
    title: "",
    description: "",
    priority: "medium",
    deadline: null,
  });
  const formErrors = ref({
    title: "",
    description: "",
    priority: "",
    deadline: "",
  });
  function openAddDialog() {
    editingTodo.value = null;
    selectedImageFile.value = null;
    form.value = {
      title: "",
      description: "",
      priority: "medium",
      deadline: null,
    };
    clearFormErrors();
    showDialog.value = true;
  }
  function startEdit(todo) {
    editingTodo.value = todo;
    selectedImageFile.value = null;
    form.value = {
      title: todo.title || "",
      description: todo.description || "",
      priority: todo.priority || "medium",
      deadline: todo.deadline ? new Date(todo.deadline) : null,
    };
    clearFormErrors();
    showDialog.value = true;
  }
  function cancelDialog() {
    showDialog.value = false;
    selectedImageFile.value = null;
    clearFormErrors();
  }
  function clearFormErrors() {
    formErrors.value = {
      title: "",
      description: "",
      priority: "",
      deadline: "",
    };
  }
  function handleImageSelect(imageFile) {
    selectedImageFile.value = imageFile;
  }
  async function saveTodo() {
    const payload = {
      title: form.value.title,
      description: form.value.description,
      priority: form.value.priority,
      deadline: form.value.deadline
        ? new Date(form.value.deadline).toISOString()
        : null,
    };
    if (
      editingTodo.value &&
      editingTodo.value.image_url &&
      !selectedImageFile.value
    ) {
      payload.image_url = editingTodo.value.image_url;
    }
    const errors = validateTodo(payload);
    clearFormErrors();
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(
        ([key, msg]) => (formErrors.value[key] = msg)
      );
      return;
    }
    try {
      if (editingTodo.value) {
        await todoStore.updateTodoItem(
          editingTodo.value.id,
          payload,
          selectedImageFile.value
        );
      } else {
        await todoStore.addNewTodo(payload, selectedImageFile.value);
      }
      // Refresh danh sách todos
      await todoStore.getTodos(
        todoStore.pagination.page,
        todoStore.pagination.pageSize,
        todoStore.currentFilters
      );
      showDialog.value = false;
      selectedImageFile.value = null;
    } catch (error) {
      console.error("Error saving todo", error);
    }
  }
  async function openHistoryDialog(todoId) {
    await todoStore.fetchTodoHistory(todoId);
    showHistoryDialog.value = true;
  }
  return {
    showDialog,
    editingTodo,
    form,
    formErrors,
    selectedImageFile,
    showHistoryDialog,
    openAddDialog,
    startEdit,
    cancelDialog,
    saveTodo,
    handleImageSelect,
    openHistoryDialog
  };
}
