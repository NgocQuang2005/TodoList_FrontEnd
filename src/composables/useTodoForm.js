import { ref } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { validateTodo } from "@/validation/todoSchema";

export function useTodoForm() {
  const todoStore = useTodoStore();
  // ✅ Trạng thái hiển thị dialog (true/false)
  // => Dùng để mở form "Thêm / Sửa Todo"
  const showDialog = ref(false);
  // ✅ Lưu todo đang được chỉnh sửa (nếu có)
  // => Nếu null thì nghĩa là đang thêm mới
  const editingTodo = ref(null);
  // ✅ Dữ liệu form Todo
  // => Khi thêm mới sẽ rỗng, khi sửa sẽ gán dữ liệu từ todo
  const form = ref({
    title: "",
    description: "",
    priority: "medium",
    deadline: null,
  });
  // ✅ Lưu lỗi validate form
  // => Nếu validateTodo() trả về lỗi thì hiển thị ở dialog
  const formErrors = ref({
    title: "",
    description: "",
    priority: "",
    deadline: "",
  });
  // ✅ Mở dialog để thêm mới Todo
  // => Reset lại form và editingTodo
  function openAddDialog() {
    editingTodo.value = null;
    form.value = {
      title: "",
      description: "",
      priority: "medium",
      deadline: null,
    };
    showDialog.value = true;
  }
  // ✅ Bắt đầu sửa một Todo
  // => Gán dữ liệu todo đó vào form và lưu lại todo đang sửa
  function startEdit(todo) {
    editingTodo.value = todo;
    form.value = { ...todo };
    showDialog.value = true;
  }
  // ✅ Đóng dialog (không lưu)
  function cancelDialog() {
    showDialog.value = false;
  }
  // ✅ Lưu Todo (dùng cho cả thêm mới & chỉnh sửa)
  // 1. Validate dữ liệu bằng validateTodo()
  // 2. Nếu có lỗi => hiển thị dưới input
  // 3. Nếu ok:
  //    - Nếu đang sửa => gọi updateTodoItem
  //    - Nếu thêm mới => gọi addNewTodo
  async function saveTodo() {
    const payload = {
      ...form.value,
      deadline: form.value.deadline
        ? new Date(form.value.deadline).toISOString()
        : null,
    };
    const errors = validateTodo(payload);
    // Reset lỗi cũ
    formErrors.value = {
      title: "",
      description: "",
      priority: "",
      deadline: "",
    };
    // Nếu có lỗi => gán lỗi vào formErrors để hiển thị
    if (Object.keys(errors).length > 0) {
      Object.entries(errors).forEach(
        ([key, msg]) => (formErrors.value[key] = msg)
      );
      return;
    }
    // Nếu đang sửa => gọi API update
    if (editingTodo.value) {
      await todoStore.updateTodoItem(editingTodo.value.id, payload);
    } else {
      // Nếu thêm mới => gọi API add
      await todoStore.addNewTodo(payload);
    }
    // Sau khi lưu thì đóng dialog
    showDialog.value = false;
  }
  // ✅ Trả về các biến & hàm để sử dụng trong component
  return {
    showDialog,
    editingTodo,
    form,
    formErrors,
    openAddDialog,
    startEdit,
    cancelDialog,
    saveTodo,
  };
}
