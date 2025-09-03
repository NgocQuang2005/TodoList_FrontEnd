// src/utils/debounce.js

/**
 * Debounce function - trì hoãn việc thực thi function
 * @param {Function} func - Function cần debounce
 * @param {number} delay - Thời gian delay (ms)
 * @returns {Function} - Debounced function
 */
export function debounce(func, delay) {
  let timeoutId;
  
  return function (...args) {
    const context = this;
    
    clearTimeout(timeoutId);
    
    timeoutId = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

/**
 * Throttle function - giới hạn số lần gọi function trong khoảng thời gian
 * @param {Function} func - Function cần throttle
 * @param {number} limit - Thời gian giới hạn (ms)
 * @returns {Function} - Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  
  return function (...args) {
    const context = this;
    
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}