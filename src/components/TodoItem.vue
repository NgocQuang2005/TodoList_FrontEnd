<template>
  <!-- Checkbox Only Mode -->
  <Checkbox
    v-if="displayMode === 'checkbox-only'"
    v-model="localTodo.is_completed"
    binary
    :disabled="isOverdue"
    :class="{ 'opacity-50 overdue-tooltip': isOverdue }"
    @change="onToggleCompleted"
  />
  <span
    v-else-if="displayMode === 'title-only'"
    :class="{ 'opacity-50 overdue-tooltip': isOverdue }"
  >
    {{ localTodo.title }}
  </span>
  <span
    v-else-if="displayMode === 'priority-only'"
    :class="[
      getPriorityClass(localTodo.priority),
      { 'opacity-50 overdue-tooltip': isOverdue },
    ]"
  >
    {{ getPriorityLabel(localTodo.priority, priorityOptions) }}
  </span>
  <span
    v-else-if="displayMode === 'deadline-only'"
    :class="{
      'text-red-600 font-bold':
        localTodo.deadline &&
        new Date(localTodo.deadline) < new Date() &&
        !localTodo.is_completed,
      'opacity-50 overdue-tooltip': isOverdue,
    }"
  >
    {{ formatDate(localTodo.deadline) }}
    <i
      v-if="
        localTodo.deadline &&
        new Date(localTodo.deadline) < new Date() &&
        !localTodo.is_completed
      "
      class="pi pi-exclamation-triangle ml-1"
    ></i>
  </span>
  <div v-else-if="displayMode === 'actions-only'" class="flex gap-2">
    <Button
      icon="pi pi-pencil"
      class="p-button-warning p-button-text"
      :class="{ 'opacity-50 overdue-tooltip': isOverdue }"
      @click="onEdit"
      :disabled="isOverdue"
    />
    <Button
      icon="pi pi-trash"
      class="p-button-danger p-button-text"
      @click="onDelete"
    />
  </div>

  <!-- Full Mode (Default) -->
  <template v-else></template>
</template>

<script setup>
import { computed, ref, watch } from "vue";
import {
  getPriorityLabel,
  getPriorityClass,
  formatDate,
} from "@/utils/todoUtils";

const props = defineProps({
  todo: {
    type: Object,
    required: true,
  },
  displayMode: {
    type: String,
    default: "title-only", // 'checkbox-only', 'title-only', 'priority-only', 'deadline-only', 'actions-only'
  },
});

const emit = defineEmits(["update", "delete", "edit"]);

const localTodo = ref({ ...props.todo });

// Priority options (matching TodoList)
const priorityOptions = [
  { label: "Dễ", value: "low" },
  { label: "Vừa", value: "medium" },
  { label: "Khó", value: "high" },
];

watch(
  () => props.todo,
  (newTodo) => {
    localTodo.value = { ...newTodo };
  }
);

//deadline hết hạn
const isOverdue = computed(() => {
  return (
    localTodo.value.deadline &&
    new Date(localTodo.value.deadline) < new Date() &&
    !localTodo.value.is_completed
  );
});

function onToggleCompleted() {
  if (isOverdue.value) return; // Không cho phép thay đổi nếu hết hạn
  // Cập nhật trạng thái completed
  localTodo.value.is_completed = !localTodo.value.is_completed;
  emit("update", localTodo.value);
}

function onEdit() {
  if (isOverdue.value) {
    alert("Công việc này đã hết hạn, không thể chỉnh sửa!");
    return;
  }
  emit("edit", localTodo.value);
}

function onDelete() {
  emit("delete", localTodo.value.id);
}
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}

/* Custom tooltip for overdue items */
.overdue-tooltip {
  position: relative;
  cursor: not-allowed;
}

.overdue-tooltip:hover::after {
  content: "Todo đã hết hạn";
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #333;
  color: white;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 12px;
  white-space: nowrap;
  z-index: 1000;
  pointer-events: none;
}

.overdue-tooltip:hover::before {
  content: "";
  position: absolute;
  top: -6px;
  left: 50%;
  transform: translateX(-50%);
  border: 6px solid transparent;
  border-top-color: #333;
  z-index: 1000;
  pointer-events: none;
}
</style>
