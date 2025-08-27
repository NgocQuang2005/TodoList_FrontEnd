<template>
  <li class="p-d-flex p-ai-center p-jc-between p-py-2 p-border-bottom">
    <div class="p-d-flex p-ai-center gap-2">
      <Checkbox v-model="localTodo.is_completed" :binary="true" @change="onToggleCompleted" />
      <span :class="{ 'line-through text-gray-400': localTodo.is_completed }">
        {{ localTodo.title }}
      </span>
    </div>
    <div class="flex gap-2">
      <Button icon="pi pi-pencil" class="p-button-warning p-button-text" @click="onEdit"/>
      <Button icon="pi pi-trash" class="p-button-danger p-button-text" @click="onDelete"/>
    </div>
  </li>
</template>

<script setup>
import { ref, watch } from 'vue';
import Checkbox from 'primevue/checkbox';
import Button from 'primevue/button';

const props = defineProps({
  todo: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['update', 'delete', 'edit']);

const localTodo = ref({ ...props.todo });

// Watch khi prop thay đổi (ví dụ store cập nhật)
watch(() => props.todo, (newTodo) => {
  localTodo.value = { ...newTodo };
});

function onToggleCompleted() {
  emit('update', localTodo.value);
}

function onEdit() {
  emit('edit', localTodo.value);
}

function onDelete() {
  emit('delete', localTodo.value.id);
}
</script>

<style scoped>
.line-through {
  text-decoration: line-through;
}
</style>
