import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
const todoSchema = {
  type: "object",
  properties: {
    title: { type: "string", minLength: 1, maxLength: 255 },
    description: { type: "string", minLength: 4 },
    priority: { type: "string", enum: ["low", "medium", "high"] },
    deadline: { type: "string", format: "date-time" },
  },
  required: ["title", "description"],
  additionalProperties: false,
};

export function validateTodo(data) {
  const validate = ajv.compile(todoSchema);
  const valid = validate(data);
  const errors = {};
  if (!valid) {
    validate.errors.forEach(err => {
      const field = err.instancePath.replace("/", "");
      if (err.keyword === "minLength") {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } ${err.message}`;
      } else if (err.keyword === "maxLength") {
        errors[field] = `${
          field.charAt(0).toUpperCase() + field.slice(1)
        } ${err.message}`;
      } else if (err.keyword === "enum") {
        errors[field] = "Mức độ ưu tiên không hợp lệ";
      } else if (err.keyword === "required") {
        errors[err.params.missingProperty] = `${
          err.params.missingProperty.charAt(0).toUpperCase() +
          err.params.missingProperty.slice(1)
        } không được để trống`;
      } else if (err.keyword === "format" && field === "deadline") {
        errors[field] = "Deadline không hợp lệ";
      }
    });
  }
  // Custom: deadline không được quá khứ
  if (data.deadline && new Date(data.deadline) < new Date()) {
    errors.deadline = "Deadline không được chọn ngày quá khứ";
  }
  return errors;
}
