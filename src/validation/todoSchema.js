export function validateTodo({ title, description, priority, deadline }) {
  const errors = {};
  if (!title || title.trim() === "") {
    errors.title = "Tiêu đề không được để trống";
  } else if (title.length > 255) {
    errors.title = "Tiêu đề không được quá 255 kí tự";
  }
  if (!description || description.trim() === "") {
    errors.description = "Mô tả không được để trống";
  } else if (description.length < 4) {
    errors.description = "Mô tả phải có ít nhất 4 kí tự";
  }
  if (priority && !["low", "medium", "high"].includes(priority)) {
    errors.priority = "Mức độ ưu tiên không hợp lệ";
  }
  if (deadline && new Date(deadline) < new Date()) {
    errors.deadline = "Deadline không được chọn ngày quá khứ";
  }
  return errors;
}
