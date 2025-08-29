<template>
  <!-- Checkbox Only Mode -->
  <Checkbox
    v-if="displayMode === 'checkbox-only'"
    v-model="localTodo.is_completed"
    binary
    @change="onToggleCompleted"
  />
  <span
    v-else-if="displayMode === 'title-only'"
    :class="{ 'line-through text-gray-400': localTodo.is_completed }"
  >
    {{ localTodo.title }}
  </span>
  <span
    v-else-if="displayMode === 'priority-only'"
    :class="getPriorityClass(localTodo.priority)"
  >
    {{ getPriorityLabel(localTodo.priority, priorityOptions) }}
  </span>
  <span v-else-if="displayMode === 'deadline-only'">
    {{ formatDate(localTodo.deadline) }}
  </span>
  <div v-else-if="displayMode === 'actions-only'" class="flex gap-2">
    <Button
      icon="pi pi-pencil"
      class="p-button-warning p-button-text"
      @click="onEdit"
    />
    <Button
      icon="pi pi-trash"
      class="p-button-danger p-button-text"
      @click="onDelete"
    />
  </div>

  <!-- Full Mode (Default) -->
  <li v-else class="flex items-center justify-between py-2 border-b">
    <div class="flex items-center gap-2">
      <Checkbox
        v-model="localTodo.is_completed"
        binary
        @change="onToggleCompleted"
      />
      <div class="flex flex-col">
        <span :class="{ 'line-through text-gray-400': localTodo.is_completed }">
          {{ localTodo.title }}
        </span>
        <span v-if="localTodo.description" class="text-sm text-gray-600">
          {{ localTodo.description }}
        </span>
      </div>
    </div>

    <div class="flex items-center gap-3">
      <!-- Priority Badge -->
      <span :class="getPriorityClass(localTodo.priority)">
        {{ getPriorityLabel(localTodo.priority, priorityOptions) }}
      </span>

      <!-- Deadline -->
      <span v-if="localTodo.deadline" class="text-sm text-gray-600">
        {{ formatDate(localTodo.deadline) }}
      </span>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <Button
          icon="pi pi-pencil"
          class="p-button-warning p-button-text"
          @click="onEdit"
        />
        <Button
          icon="pi pi-trash"
          class="p-button-danger p-button-text"
          @click="onDelete"
        />
      </div>
    </div>
  </li>
</template>

<script setup>
import { ref, watch } from "vue";
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
    default: "full", // 'checkbox-only', 'title-only', 'priority-only', 'deadline-only', 'actions-only', 'full'
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

function onToggleCompleted() {
  emit("update", localTodo.value);
}

function onEdit() {
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
</style>
