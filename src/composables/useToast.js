// src/composables/useToast.js
import { useToast as usePrimeToast } from 'primevue/usetoast';
import { SUCCESS_MESSAGES, ERROR_MESSAGES, LOADING_MESSAGES } from '@/constants';

export function useToast() {
  const toast = usePrimeToast();

  /**
   * Hiển thị toast thành công
   * @param {string} message - Message để hiển thị
   * @param {string} detail - Chi tiết (optional)
   * @param {number} life - Thời gian hiển thị (ms)
   */
  const showSuccess = (message, detail = '', life = 3000) => {
    toast.add({
      severity: 'success',
      summary: message,
      detail: detail,
      life: life,
      group: 'app'
    });
  };

  /**
   * Hiển thị toast lỗi
   * @param {string} message - Message để hiển thị
   * @param {string} detail - Chi tiết (optional)
   * @param {number} life - Thời gian hiển thị (ms)
   */
  const showError = (message, detail = '', life = 5000) => {
    toast.add({
      severity: 'error',
      summary: message,
      detail: detail,
      life: life,
      group: 'app'
    });
  };

  /**
   * Hiển thị toast cảnh báo
   * @param {string} message - Message để hiển thị
   * @param {string} detail - Chi tiết (optional)
   * @param {number} life - Thời gian hiển thị (ms)
   */
  const showWarn = (message, detail = '', life = 4000) => {
    toast.add({
      severity: 'warn',
      summary: message,
      detail: detail,
      life: life,
      group: 'app'
    });
  };

  /**
   * Hiển thị toast thông tin
   * @param {string} message - Message để hiển thị
   * @param {string} detail - Chi tiết (optional)
   * @param {number} life - Thời gian hiển thị (ms)
   */
  const showInfo = (message, detail = '', life = 3000) => {
    toast.add({
      severity: 'info',
      summary: message,
      detail: detail,
      life: life,
      group: 'app'
    });
  };

  /**
   * Xóa tất cả toast
   */
  const clear = () => {
    toast.removeAllGroups();
  };

  // Predefined toast messages
  const toastMessages = {
    // Success messages
    todoAdded: () => showSuccess('Thành công!', SUCCESS_MESSAGES.TODO_ADDED),
    todoUpdated: () => showSuccess('Thành công!', SUCCESS_MESSAGES.TODO_UPDATED),
    todoDeleted: () => showSuccess('Thành công!', SUCCESS_MESSAGES.TODO_DELETED),
    todoCompleted: () => showSuccess('Thành công!', SUCCESS_MESSAGES.TODO_COMPLETED),

    // Error messages
    networkError: () => showError('Lỗi kết nối!', ERROR_MESSAGES.NETWORK_ERROR),
    unauthorized: () => showError('Phiên hết hạn!', ERROR_MESSAGES.UNAUTHORIZED),
    validationError: (detail) => showError('Dữ liệu không hợp lệ!', detail || ERROR_MESSAGES.VALIDATION_ERROR),
    serverError: () => showError('Lỗi server!', ERROR_MESSAGES.SERVER_ERROR),
    imageUploadError: () => showError('Lỗi tải ảnh!', ERROR_MESSAGES.IMAGE_UPLOAD_ERROR),
    imageSizeError: () => showError('Ảnh quá lớn!', ERROR_MESSAGES.IMAGE_SIZE_ERROR),
    imageFormatError: () => showError('Định dạng ảnh không hỗ trợ!', ERROR_MESSAGES.IMAGE_FORMAT_ERROR),

    // Info messages
    loading: (message) => showInfo('Đang xử lý...', message || 'Vui lòng đợi...'),
    noData: () => showInfo('Không có dữ liệu', 'Danh sách trống'),
    noResults: () => showInfo('Không tìm thấy', 'Không có kết quả phù hợp'),

    // Warning messages
    confirmDelete: () => showWarn('Xác nhận xóa', 'Hành động này không thể hoàn tác'),
    unsavedChanges: () => showWarn('Có thay đổi chưa lưu', 'Bạn có muốn tiếp tục?'),
  };

  return {
    // Core methods
    showSuccess,
    showError,
    showWarn,
    showInfo,
    clear,
    
    // Predefined messages
    ...toastMessages,
    
    // Raw toast instance for advanced usage
    toast
  };
}