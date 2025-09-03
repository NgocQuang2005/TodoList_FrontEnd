// src/utils/errorHandler.js
import { ERROR_MESSAGES } from '@/constants';

/**
 * Xử lý lỗi API và trả về message phù hợp
 * @param {Error} error - Lỗi từ API
 * @returns {string} - Message lỗi để hiển thị
 */
export function handleApiError(error) {
  if (!error.response) {
    return ERROR_MESSAGES.NETWORK_ERROR;
  }

  const { status, data } = error.response;

  switch (status) {
    case 400:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 401:
      return ERROR_MESSAGES.UNAUTHORIZED;
    case 403:
      return 'Bạn không có quyền thực hiện hành động này.';
    case 404:
      return 'Không tìm thấy dữ liệu yêu cầu.';
    case 422:
      return data?.message || ERROR_MESSAGES.VALIDATION_ERROR;
    case 500:
      return ERROR_MESSAGES.SERVER_ERROR;
    default:
      return data?.message || ERROR_MESSAGES.SERVER_ERROR;
  }
}

/**
 * Xử lý lỗi validation và format thành object
 * @param {Error} error - Lỗi validation
 * @returns {Object} - Object chứa lỗi theo field
 */
export function handleValidationError(error) {
  if (error.response?.data?.errors) {
    return error.response.data.errors;
  }
  
  if (error.response?.data?.message) {
    return { general: error.response.data.message };
  }
  
  return { general: ERROR_MESSAGES.VALIDATION_ERROR };
}

/**
 * Log lỗi trong development mode
 * @param {string} context - Context của lỗi
 * @param {Error} error - Lỗi cần log
 */
export function logError(context, error) {
  if (import.meta.env.VITE_DEBUG === 'true') {
    console.group(`🚨 Error in ${context}`);
    console.error('Error:', error);
    console.error('Stack:', error.stack);
    if (error.response) {
      console.error('Response:', error.response);
    }
    console.groupEnd();
  }
}

/**
 * Tạo error object chuẩn
 * @param {string} message - Message lỗi
 * @param {string} code - Mã lỗi
 * @param {Object} details - Chi tiết lỗi
 * @returns {Object} - Error object chuẩn
 */
export function createError(message, code = 'UNKNOWN_ERROR', details = null) {
  return {
    message,
    code,
    details,
    timestamp: new Date().toISOString()
  };
}