// src/composables/useTodoFilter.js
import { ref, computed, watch } from "vue";
import { debounce } from "@/utils/debounce";
import { TODO_CONSTANTS } from "@/constants";

export function useTodoFilter(todos, todoStore) {
  const searchFilters = ref({
    title: "",
    status: "all",
    priority: "all",
  });

  // Debounced search function
  const debouncedSearch = debounce(async () => {
    await applyFilters();
  }, TODO_CONSTANTS.DEBOUNCE_DELAY);

  // Watch for title changes and apply debounced search
  watch(
    () => searchFilters.value.title,
    () => {
      if (searchFilters.value.title !== todoStore.currentFilters.title) {
        debouncedSearch();
      }
    }
  );

  // Watch for immediate filter changes (status, priority)
  watch(
    [() => searchFilters.value.status, () => searchFilters.value.priority],
    () => {
      applyFilters();
    }
  );

  /**
   * Computed property ��ể check có filter active không
   */
  const hasActiveFilters = computed(() => {
    return (
      (searchFilters.value.title && searchFilters.value.title.trim()) ||
      (searchFilters.value.status !== "all" && searchFilters.value.status !== null) ||
      (searchFilters.value.priority !== "all" && searchFilters.value.priority !== null)
    );
  });

  /**
   * Computed property cho filtered todos (client-side filtering for immediate feedback)
   */
  const filteredTodos = computed(() => {
    if (!todos.value || todos.value.length === 0) {
      return [];
    }

    let filtered = [...todos.value];

    // Client-side filtering for immediate feedback
    if (searchFilters.value.title && searchFilters.value.title.trim()) {
      const searchTerm = searchFilters.value.title.toLowerCase().trim();
      filtered = filtered.filter(todo =>
        todo.title?.toLowerCase().includes(searchTerm) ||
        todo.description?.toLowerCase().includes(searchTerm)
      );
    }

    if (searchFilters.value.status !== "all" && searchFilters.value.status !== null) {
      filtered = filtered.filter(todo => todo.is_completed === searchFilters.value.status);
    }

    if (searchFilters.value.priority !== "all" && searchFilters.value.priority !== null) {
      filtered = filtered.filter(todo => todo.priority === searchFilters.value.priority);
    }

    return filtered;
  });

  /**
   * Apply filters - gọi API với filters mới
   */
  async function applyFilters() {
    const filters = {
      title: searchFilters.value.title?.trim() || "",
      status: searchFilters.value.status === "all" ? null : searchFilters.value.status,
      priority: searchFilters.value.priority === "all" ? null : searchFilters.value.priority,
    };

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
   * Clear một filter cụ thể
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

  return {
    searchFilters,
    filteredTodos,
    hasActiveFilters,
    applyFilters,
    resetFilters,
    clearFilter,
    setFilters,
    getCurrentFilters,
  };
}