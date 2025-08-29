// ✅ Lấy nhãn (label) từ priority value (low/medium/high)
export function getPriorityLabel(priority, options) {
  return options.find((opt) => opt.value === priority)?.label || priority;
}
// ✅ Lấy nhãn (label) từ status value (true/false/null)
export function getStatusLabel(status, options) {
  return options.find((opt) => opt.value === status)?.label || status;
}
// ✅ Trả về class CSS tương ứng với priority
//   - low  → chữ xanh lá
//   - medium → chữ vàng
//   - high → chữ đỏ
//   - dùng để highlight mức ưu tiên trong bảng todo
export function getPriorityClass(priority) {
  const classes = {
    low: "text-green-600 font-medium",
    medium: "text-yellow-600 font-medium",
    high: "text-red-600 font-medium",
  };
  return classes[priority] || "";
}
// ✅ Định dạng ngày (deadline) theo chuẩn "vi-VN"
export function formatDate(date) {
  if (!date) return "";
  return new Date(date).toLocaleString("vi-VN", {
    dateStyle: "short",
    timeStyle: "short",
  });
}
