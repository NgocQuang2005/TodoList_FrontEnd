// src/composables/useTodoFilter.js
import { ref, computed } from "vue";
import { TODO_CONSTANTS } from "@/constants";

export function useTodoFilter(todos, todoStore) {
  // Chỉ sử dụng một biến searchFilters duy nhất
  const searchFilters = ref({
    title: "",
    status: "all",
    priority: "all",
  });

  /**
   * Computed property để check có filter active không (dựa trên store.currentFilters)
   */
  const hasActiveFilters = computed(() => {
    const currentFilters = todoStore.currentFilters || {};
    return (
      (currentFilters.title && currentFilters.title.trim()) ||
      (currentFilters.status !== null && currentFilters.status !== undefined) ||
      (currentFilters.priority !== null && currentFilters.priority !== undefined)
    );
  });

  /**
   * Computed property trả về todos từ server (không filter client-side)
   */
  const filteredTodos = computed(() => {
    return todos.value || [];
  });

  /**
   * Apply filters - CHỈ gọi khi nhấn nút tìm kiếm
   */
  async function applyFilters() {
    const filters = {
      title: searchFilters.value.title?.trim() || "",
      status: searchFilters.value.status === "all" ? null : searchFilters.value.status,
      priority: searchFilters.value.priority === "all" ? null : searchFilters.value.priority,
    };

    // Gọi API
    await todoStore.getTodos(1, todoStore.pagination.pageSize, filters);
  }

  /**
   * Reset tất cả filters
   */
  async function resetFilters() {
    searchFilters.value = {
      title: "",
      status: "all",
      priority: "all",
    };
    
    await todoStore.getTodos(1, todoStore.pagination.pageSize, {});
  }

  /**
   * Clear một filter cụ thể và apply ngay
   */
  async function clearFilter(filterName) {
    switch (filterName) {
      case 'title':
        searchFilters.value.title = "";
        break;
      case 'status':
        searchFilters.value.status = "all";
        break;
      case 'priority':
        searchFilters.value.priority = "all";
        break;
    }
    
    await applyFilters();
  }

  /**
   * Set filters từ bên ngoài (ví dụ từ URL params)
   */
  function setFilters(filters) {
    searchFilters.value = {
      title: filters.title || "",
      status: filters.status || "all",
      priority: filters.priority || "all",
    };
  }

  /**
   * Get current filter values
   */
  function getCurrentFilters() {
    return {
      title: searchFilters.value.title?.trim() || null,
      status: searchFilters.value.status === "all" ? null : searchFilters.value.status,
      priority: searchFilters.value.priority === "all" ? null : searchFilters.value.priority,
    };
  }

  /**
   * Sync search filters với current filters từ store
   */
  function syncWithStore() {
    const currentFilters = todoStore.currentFilters || {};
    
    searchFilters.value = {
      title: currentFilters.title || "",
      status: currentFilters.status !== null && currentFilters.status !== undefined 
        ? currentFilters.status 
        : "all",
      priority: currentFilters.priority || "all",
    };
  }

  return {
    searchFilters,
    filteredTodos,
    hasActiveFilters,
    applyFilters,
    resetFilters,
    clearFilter,
    setFilters,
    getCurrentFilters,
    syncWithStore,
  };
}