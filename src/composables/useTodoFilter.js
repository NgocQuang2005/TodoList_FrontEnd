// src/composables/useTodoFilter.js
import { ref, computed } from "vue";

export function useTodoFilter(todos, todoStore) {
  const searchFilters = ref({ title: "", status: null, priority: null });

  const filteredTodos = computed(() => {
    return todos.value;
  });

  const hasActiveFilters = computed(() => {
    const currentFilters = todoStore.currentFilters || {};
    return (
      (currentFilters.title &&
        typeof currentFilters.title === "string" &&
        currentFilters.title.trim() !== "") ||
      (currentFilters.status !== null &&
        currentFilters.status !== undefined &&
        currentFilters.status !== "" &&
        currentFilters.status !== "all") ||
      (currentFilters.priority !== null &&
        currentFilters.priority !== undefined &&
        currentFilters.priority !== "" &&
        currentFilters.priority !== "all")
    );
  });

  async function applyFilters() {
    console.log("applyFilters called with:", searchFilters.value);

    const filters = {};
    if (searchFilters.value.title && searchFilters.value.title.trim()) {
      filters.title = searchFilters.value.title.trim();
    }
    if (
      searchFilters.value.status !== null &&
      searchFilters.value.status !== undefined &&
      searchFilters.value.status !== "" &&
      searchFilters.value.status !== "all"
    ) {
      filters.status = searchFilters.value.status;
    }
    if (
      searchFilters.value.priority !== null &&
      searchFilters.value.priority !== undefined &&
      searchFilters.value.priority !== "" &&
      searchFilters.value.priority !== "all"
    ) {
      filters.priority = searchFilters.value.priority;
    }

    console.log("Sending filters to API:", filters);
    // Gọi API với filters và reset về trang 1
    await todoStore.getTodos(1, todoStore.pagination.pageSize, filters);
  }

  async function resetFilters() {
    searchFilters.value = { title: "", status: "all", priority: "all" };
    // Reset về trang 1 khi clear filters
    await todoStore.getTodos(1, todoStore.pagination.pageSize, {});
  }

  async function clearFilter(type) {
    if (type === "title") {
      searchFilters.value.title = "";
    } else if (type === "status") {
      searchFilters.value.status = "all";
    } else if (type === "priority") {
      searchFilters.value.priority = "all";
    }
    await applyFilters();
  }

  return {
    searchFilters,
    filteredTodos,
    hasActiveFilters,
    applyFilters,
    resetFilters,
    clearFilter,
  };
}
