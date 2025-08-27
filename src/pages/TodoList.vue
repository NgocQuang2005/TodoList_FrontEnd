<template>
  <div class="max-w-2xl p-5 mx-auto">
    <h2 class="mb-5 text-2xl font-bold">Todo List</h2>

    <!-- Form thêm Todo -->
    <div class="flex gap-2 mb-3">
      <InputText
        v-model="newTitle"
        placeholder="Nhập tiêu đề công việc"
        @keyup.enter="onAddTodo"
        class="flex-1"
      />
      <Button
        label="Thêm"
        icon="pi pi-plus"
        class="p-button-success"
        @click="onAddTodo"
      />
    </div>
    <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
    <!-- Danh sách Todo -->
    <ul class="mt-4 p-list">
      <TodoItem
        v-for="todo in todos"
        :key="todo.id"
        :todo="todo"
        @update="toggleCompleted"
        @delete="onDelete"
        @edit="startEdit"
      />
    </ul>

    <!-- Dialog sửa Todo -->
    <Dialog
      header="Sửa công việc"
      :visible="editingTodo !== null"
      :modal="true"
      :closable="false"
    >
      <div class="p-field">
        <InputText v-model="editingTitle" @keyup.enter="onUpdateTodo" />
        <small v-if="errors.title" class="p-error">{{ errors.title }}</small>
      </div>
      <div class="gap-2 mt-3 p-d-flex p-jc-end">
        <Button label="Hủy" class="p-button-secondary" @click="cancelEdit" />
        <Button label="Lưu" class="p-button-success" @click="onUpdateTodo" />
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useTodoStore } from "@/stores/todoStore";
import { storeToRefs } from "pinia";

// PrimeVue components
import InputText from "primevue/inputtext";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import TodoItem from "@/components/TodoItem.vue";
import { validateTodo } from "@/validation/todoSchema";

const todoStore = useTodoStore();
const editingTitle = ref("");
const newTitle = ref("");
const editingTodo = ref(null);
const errors = ref({});

onMounted(() => {
  todoStore.getTodos();
});

const { todos } = storeToRefs(todoStore);

async function onAddTodo() {
  errors.value = validateTodo(newTitle.value);
  if (Object.keys(errors.value).length > 0) return;

  await todoStore.addNewTodo({ title: newTitle.value });
  newTitle.value = "";
}

async function onDelete(id) {
  if (confirm("Bạn có chắc muốn xóa công việc này?")) {
    await todoStore.deleteTodoItem(id);
  }
}

function startEdit(todo) {
  editingTodo.value = { ...todo };
  editingTitle.value = todo.title; // copy giá trị
  errors.value = {};
}

async function onUpdateTodo() {
  errors.value = validateTodo(editingTitle.value);
  if (Object.keys(errors.value).length > 0) return;

  await todoStore.updateTodoItem(editingTodo.value.id, {
    // luôn gửi đủ dữ liệu
    title: editingTitle.value, 
    is_completed: editingTodo.value.is_completed 
  });
  editingTodo.value = null;
  editingTitle.value = "";
}

async function toggleCompleted(todo) {
  await todoStore.updateTodoItem(todo.id, {
    title: todo.title,           
    is_completed: todo.is_completed 
  });
}
function cancelEdit() {
  editingTodo.value = null;
  editingTitle.value = "";
  errors.value = {};
}

</script>
