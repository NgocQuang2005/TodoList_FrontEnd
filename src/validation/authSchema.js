export function validateLogin(username, password) {
  const errors = {};
  if (!username || username.trim() === "") {
    errors.username = "Username không được để trống";
  } else if (username.length < 3) {
    errors.username = "Username phải có ít nhất 3 ký tự";
  }
  if (!password) {
    errors.password = "Password không được để trống";
  } else if (password.length < 6) {
    errors.password = "Mật khẩu phải lớn hơn 6 kí tự";
  }
  return errors;
}
export function validateRegister(username, password, email) {
  const errors = validateLogin(username, password);
  if (!email || email.trim() === "") {
    errors.email = "Email không được để trống";
  } else {
    // Regex kiểm tra email cơ bản
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.email = "Email không hợp lệ";
    }
  }
  return errors;
}
