// src/constants/index.js

// API Configuration
export const API_CONFIG = {
  BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3443/api/',
  TIMEOUT: 5000,
  STATIC_URL: import.meta.env.VITE_STATIC_BASE_URL || 'http://localhost:3443'
};

// Todo Constants
export const TODO_CONSTANTS = {
  DEFAULT_PAGE_SIZE: 5,
  DEFAULT_PRIORITY: 'medium',
  MAX_TITLE_LENGTH: 255,
  MIN_DESCRIPTION_LENGTH: 4,
  DEBOUNCE_DELAY: 500,
  IMAGE_MAX_SIZE_MB: 1,
  IMAGE_RESIZE_DIMENSIONS: {
    WIDTH: 200,
    HEIGHT: 200
  }
};

// Priority Options
export const PRIORITY_OPTIONS = [
  { label: 'Dễ', value: 'low' },
  { label: 'Vừa', value: 'medium' },
  { label: 'Khó', value: 'high' }
];

// Status Options
export const STATUS_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  { label: 'Hoàn thành', value: true },
  { label: 'Chưa hoàn thành', value: false }
];

// Filter Options
export const PRIORITY_FILTER_OPTIONS = [
  { label: 'Tất cả', value: 'all' },
  ...PRIORITY_OPTIONS
];

// Page Size Options
export const PAGE_SIZE_OPTIONS = [5, 10, 20];

// Local Storage Keys
export const STORAGE_KEYS = {
  TOKEN: 'tokenTodo',
  USER_PREFERENCES: 'todoUserPreferences'
};

// Error Messages
export const ERROR_MESSAGES = {
  NETWORK_ERROR: 'Lỗi kết nối mạng. Vui lòng thử lại.',
  UNAUTHORIZED: 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.',
  VALIDATION_ERROR: 'Dữ liệu không hợp lệ. Vui lòng kiểm tra lại.',
  SERVER_ERROR: 'Lỗi server. Vui lòng thử lại sau.',
  DELETE_CONFIRM: 'Bạn có chắc muốn xóa công việc này?',
  IMAGE_UPLOAD_ERROR: 'Lỗi khi tải ảnh lên. Vui lòng thử lại.',
  IMAGE_SIZE_ERROR: 'Kích thước ảnh quá lớn. Vui lòng chọn ảnh nhỏ hơn.',
  IMAGE_FORMAT_ERROR: 'Định dạng ảnh không được hỗ trợ. Vui lòng chọn file JPG, PNG hoặc GIF.'
};

// Success Messages
export const SUCCESS_MESSAGES = {
  TODO_ADDED: 'Thêm công việc thành công!',
  TODO_UPDATED: 'Cập nhật công việc thành công!',
  TODO_DELETED: 'Xóa công việc thành công!',
  TODO_COMPLETED: 'Cập nhật trạng thái thành công!'
};

// Loading Messages
export const LOADING_MESSAGES = {
  FETCHING_TODOS: 'Đang tải danh sách công việc...',
  SAVING_TODO: 'Đang lưu công việc...',
  DELETING_TODO: 'Đang xóa công việc...',
  UPLOADING_IMAGE: 'Đang tải ảnh lên...',
  PROCESSING_IMAGE: 'Đang xử lý ảnh...',
  FETCHING_HISTORY: 'Đang tải lịch sử...'
};

// Validation Rules
export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 1,
    MAX_LENGTH: 255
  },
  DESCRIPTION: {
    MIN_LENGTH: 4
  },
  PRIORITY: {
    ALLOWED_VALUES: ['low', 'medium', 'high']
  }
};