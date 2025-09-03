import { ref } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { validateTodo } from "@/validation/todoSchema";
import { TODO_CONSTANTS, SUCCESS_MESSAGES, ERROR_MESSAGES } from "@/constants";

export function useTodoForm() {
  const todoStore = useTodoStore();
  const showDialog = ref(false);
  const editingTodo = ref(null);
  const selectedImageFile = ref(null);
  const showHistoryDialog = ref(false);
  const isSubmitting = ref(false);
  
  const form = ref({
    title: "",
    description: "",
    priority: TODO_CONSTANTS.DEFAULT_PRIORITY,
    deadline: null,
  });
  
  const formErrors = ref({
    title: "",
    description: "",
    priority: "",
    deadline: "",
  });
  /**
   * Mở dialog thêm todo mới
   */
  function openAddDialog() {
    editingTodo.value = null;
    selectedImageFile.value = null;
    form.value = {
      title: "",
      description: "",
      priority: TODO_CONSTANTS.DEFAULT_PRIORITY,
      deadline: null,
    };
    clearFormErrors();
    showDialog.value = true;
  }

  /**
   * Bắt đầu chỉnh sửa todo
   */
  function startEdit(todo) {
    editingTodo.value = todo;
    selectedImageFile.value = null;
    form.value = {
      title: todo.title || "",
      description: todo.description || "",
      priority: todo.priority || TODO_CONSTANTS.DEFAULT_PRIORITY,
      deadline: todo.deadline ? new Date(todo.deadline) : null,
    };
    clearFormErrors();
    showDialog.value = true;
  }

  /**
   * Hủy dialog
   */
  function cancelDialog() {
    if (isSubmitting.value) return; // Không cho phép hủy khi đang submit
    
    showDialog.value = false;
    selectedImageFile.value = null;
    clearFormErrors();
  }

  /**
   * Xóa lỗi form
   */
  function clearFormErrors() {
    formErrors.value = {
      title: "",
      description: "",
      priority: "",
      deadline: "",
    };
  }

  /**
   * Xử lý khi chọn ảnh
   */
  function handleImageSelect(imageFile) {
    selectedImageFile.value = imageFile;
  }

  /**
   * Lưu todo - ĐÃ FIX: Không gọi lại getTodos (tránh duplicate)
   */
  async function saveTodo() {
    if (isSubmitting.value) return; // Tránh double submit
    
    isSubmitting.value = true;
    clearFormErrors();
    
    try {
      const payload = {
        title: form.value.title?.trim(),
        description: form.value.description?.trim(),
        priority: form.value.priority,
        deadline: form.value.deadline
          ? new Date(form.value.deadline).toISOString()
          : null,
      };

      // Giữ lại image_url cũ nếu không upload ảnh mới
      if (editingTodo.value?.image_url && !selectedImageFile.value) {
        payload.image_url = editingTodo.value.image_url;
      }

      // Validate trước khi gửi
      const errors = validateTodo(payload);
      if (Object.keys(errors).length > 0) {
        Object.entries(errors).forEach(([key, msg]) => {
          formErrors.value[key] = msg;
        });
        return;
      }

      let result;
      if (editingTodo.value) {
        result = await todoStore.updateTodoItem(
          editingTodo.value.id,
          payload,
          selectedImageFile.value
        );
      } else {
        result = await todoStore.addNewTodo(payload, selectedImageFile.value);
      }

      // Kiểm tra kết quả và đóng dialog nếu thành công
      if (result.success) {
        showDialog.value = false;
        selectedImageFile.value = null;
        
        // Hiển thị thông báo thành công (có thể thêm toast notification)
        console.log(editingTodo.value ? SUCCESS_MESSAGES.TODO_UPDATED : SUCCESS_MESSAGES.TODO_ADDED);
      } else {
        // Xử lý lỗi từ store
        if (result.errors) {
          Object.entries(result.errors).forEach(([key, msg]) => {
            formErrors.value[key] = msg;
          });
        }
      }

    } catch (error) {
      console.error("Error saving todo:", error);
      // Có thể hiển thị toast error ở đây
    } finally {
      isSubmitting.value = false;
    }
  }

  /**
   * Mở dialog lịch sử
   */
  async function openHistoryDialog(todoId) {
    const result = await todoStore.fetchTodoHistory(todoId);
    if (result.success) {
      showHistoryDialog.value = true;
    }
  }

  return {
    // State
    showDialog,
    editingTodo,
    form,
    formErrors,
    selectedImageFile,
    showHistoryDialog,
    isSubmitting,
    
    // Methods
    openAddDialog,
    startEdit,
    cancelDialog,
    saveTodo,
    handleImageSelect,
    openHistoryDialog,
    clearFormErrors,
  };
}
