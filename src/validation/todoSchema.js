import Ajv from "ajv";
import addFormats from "ajv-formats";
import { VALIDATION_RULES } from "@/constants";

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const todoSchema = {
  type: "object",
  properties: {
    title: { 
      type: "string", 
      minLength: VALIDATION_RULES.TITLE.MIN_LENGTH, 
      maxLength: VALIDATION_RULES.TITLE.MAX_LENGTH 
    },
    description: { 
      type: "string", 
      minLength: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH 
    },
    priority: { 
      type: "string", 
      enum: VALIDATION_RULES.PRIORITY.ALLOWED_VALUES 
    },
    deadline: { 
      anyOf: [
        { type: "string", format: "date-time" },
        { type: "null" }
      ]
    },
    image_url: {
      type: "string"
    }
  },
  required: ["title", "description"],
  additionalProperties: true, // Cho phép các properties khác
};

/**
 * Validate dữ liệu todo
 * @param {Object} data - Dữ liệu cần validate
 * @returns {Object} - Object chứa lỗi validation
 */
export function validateTodo(data) {
  const validate = ajv.compile(todoSchema);
  const valid = validate(data);
  const errors = {};

  if (!valid) {
    validate.errors.forEach(err => {
      const field = err.instancePath.replace("/", "") || err.params?.missingProperty;
      
      switch (err.keyword) {
        case "minLength":
          if (field === "title") {
            errors[field] = "Tiêu đề không được để trống";
          } else if (field === "description") {
            errors[field] = `Mô tả phải có ít nhất ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} ký tự`;
          } else {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} ${err.message}`;
          }
          break;
          
        case "maxLength":
          if (field === "title") {
            errors[field] = `Tiêu đề không được vượt quá ${VALIDATION_RULES.TITLE.MAX_LENGTH} ký tự`;
          } else {
            errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} ${err.message}`;
          }
          break;
          
        case "enum":
          errors[field] = "Mức độ ưu tiên không hợp lệ";
          break;
          
        case "required":
          const missingField = err.params.missingProperty;
          if (missingField === "title") {
            errors[missingField] = "Tiêu đề không được để trống";
          } else if (missingField === "description") {
            errors[missingField] = "Mô tả không được để trống";
          } else {
            errors[missingField] = `${missingField.charAt(0).toUpperCase() + missingField.slice(1)} không được để trống`;
          }
          break;
          
        case "format":
          if (field === "deadline") {
            errors[field] = "Định dạng thời hạn không hợp lệ";
          }
          break;
          
        default:
          errors[field] = err.message;
      }
    });
  }

  // Custom validation: deadline không được là quá khứ
  if (data.deadline) {
    const deadlineDate = new Date(data.deadline);
    const now = new Date();
    
    if (deadlineDate < now) {
      errors.deadline = "Thời hạn không được chọn ngày trong quá khứ";
    }
  }

  return errors;
}

/**
 * Validate một field cụ thể
 * @param {string} field - Tên field
 * @param {any} value - Giá trị cần validate
 * @returns {string|null} - Lỗi validation hoặc null nếu hợp lệ
 */
export function validateField(field, value) {
  const tempData = { [field]: value };
  
  // Thêm các field required khác để tránh lỗi required
  if (field !== 'title') tempData.title = 'temp';
  if (field !== 'description') tempData.description = 'temp description';
  
  const errors = validateTodo(tempData);
  return errors[field] || null;
}
