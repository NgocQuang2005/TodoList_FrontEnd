import Ajv from "ajv";
import addFormats from "ajv-formats";
const ajv = new Ajv({ allErrors: true });
addFormats(ajv);
// ================= Login Schema =================
const loginSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 6 },
  },
  required: ["username", "password"],
  additionalProperties: false,
};

export function validateLogin(data) {
  const validate = ajv.compile(loginSchema);
  const valid = validate(data);
  
  if (valid) return {};

  const errors = {};
  validate.errors.forEach((err) => {
    const field = err.instancePath.replace("/", "");
    if (err.keyword === "minLength") {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} ${
        err.message
      }`;
    } else if (err.keyword === "required") {
      errors[err.params.missingProperty] = `${
        err.params.missingProperty.charAt(0).toUpperCase() +
        err.params.missingProperty.slice(1)
      } không được để trống`;
    }
  });
  return errors;
}

// ================= Register Schema =================
const registerSchema = {
  type: "object",
  properties: {
    username: { type: "string", minLength: 3 },
    password: { type: "string", minLength: 6 },
    email: { type: "string", format: "email" },
  },
  required: ["username", "password", "email"],
  additionalProperties: false,
};

export function validateRegister(data) {
  const validate = ajv.compile(registerSchema);
  const valid = validate(data);
  if (validate.errors) {
    localize.vi(validate.errors);
  }
  if (valid) return {};

  const errors = {};
  validate.errors.forEach((err) => {
    const field = err.instancePath.replace("/", "");
    if (err.keyword === "minLength") {
      errors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} ${
        err.message
      }`;
    } else if (err.keyword === "required") {
      errors[err.params.missingProperty] = `${
        err.params.missingProperty.charAt(0).toUpperCase() +
        err.params.missingProperty.slice(1)
      } không được để trống`;
    } else if (err.keyword === "format" && err.params.format === "email") {
      errors[field] = "Email không hợp lệ";
    }
  });
  return errors;
}
