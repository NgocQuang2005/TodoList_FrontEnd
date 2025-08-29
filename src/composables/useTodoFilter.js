// src/composables/useTodoFilter.js
import { ref, computed } from "vue";

export function useTodoFilter(todos) {
  const searchFilters = ref({ title: "", status: null, priority: null });
  const appliedFilters = ref({ title: "", status: null, priority: null });
  const filteredTodos = computed(() => {
    let filtered = todos.value;
    if (appliedFilters.value.title?.trim()) {
      filtered = filtered.filter((todo) =>
        todo.title
          .toLowerCase()
          .includes(appliedFilters.value.title.toLowerCase())
      );
    }
    if (appliedFilters.value.status !== null) {
      filtered = filtered.filter(
        (todo) => todo.is_completed === appliedFilters.value.status
      );
    }
    if (appliedFilters.value.priority !== null) {
      filtered = filtered.filter(
        (todo) => todo.priority === appliedFilters.value.priority
      );
    }
    return filtered;
  });
  const hasActiveFilters = computed(
    () =>
      appliedFilters.value.title !== "" ||
      appliedFilters.value.status !== null ||
      appliedFilters.value.priority !== null
  );

  function applyFilters() {
    appliedFilters.value = { ...searchFilters.value };
  }
  function resetFilters() {
    searchFilters.value = { title: "", status: null, priority: null };
    appliedFilters.value = { title: "", status: null, priority: null };
  }
  function clearFilter(type) {
    searchFilters.value[type] = type === "title" ? "" : null;
    appliedFilters.value[type] = type === "title" ? "" : null;
  }
  return {
    searchFilters,
    appliedFilters,
    filteredTodos,
    hasActiveFilters,
    applyFilters,
    resetFilters,
    clearFilter,
  };
}
