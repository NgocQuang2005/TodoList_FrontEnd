export function validateTodo(title){
  const errors = {};
  if(!title || title.trim() === ""){
    errors.title = "Tiêu đề không được để trống"
  }else if(title.length > 150){
    errors.title = "Tiêu đề không được quá 150 kí tự"
  }
  return errors;
}