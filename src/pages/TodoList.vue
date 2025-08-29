<template>
  <div class="max-w-4xl p-5 mx-auto">
    <h2 class="mb-5 text-2xl font-bold text-center">Todo List</h2>

    <!-- Nút thêm -->
    <div class="flex justify-end w-full">
      <Button
        label="Thêm Todo"
        icon="pi pi-plus"
        class="p-button-success mb-4"
        @click="openAddDialog"
      />
    </div>

    <!-- Bộ lọc tìm kiếm - Compact Design -->
    <div class="bg-white p-4 mb-4 rounded-lg shadow-sm border">
      <div class="flex flex-wrap items-end gap-3">
        <!-- Tìm kiếm -->
        <div class="flex-1 min-w-[200px]">
          <label class="block text-sm font-medium mb-1">Tìm kiếm</label>
          <InputText
            v-model="searchFilters.title"
            placeholder="Nhập tiêu đề..."
            class="w-full"
          />
        </div>

        <!-- Trạng thái -->
        <div class="w-40">
          <label class="block text-sm font-medium mb-1">Trạng thái</label>
          <Dropdown
            v-model="searchFilters.status"
            :options="statusOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tất cả"
            class="w-full"
          />
        </div>

        <!-- Ưu tiên -->
        <div class="w-32">
          <label class="block text-sm font-medium mb-1">Ưu tiên</label>
          <Dropdown
            v-model="searchFilters.priority"
            :options="priorityFilterOptions"
            optionLabel="label"
            optionValue="value"
            placeholder="Tất cả"
            class="w-full"
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-2">
          <Button
            icon="pi pi-search"
            class="p-button-primary"
            @click="applyFilters"
            v-tooltip.top="'Tìm kiếm'"
          />
          <Button
            icon="pi pi-refresh"
            class="p-button-secondary"
            @click="resetFilters"
            v-tooltip.top="'Làm mới'"
          />
        </div>
      </div>

      <!-- Active Filters Tags -->
      <div
        v-if="hasActiveFilters"
        class="flex flex-wrap gap-2 mt-3 pt-3 border-t"
      >
        <span class="text-xs text-gray-500">Đang lọc:</span>
        <span
          v-if="appliedFilters.title"
          class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          "{{ appliedFilters.title }}"
          <button
            @click="clearFilter('title')"
            class="ml-1 hover:text-blue-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
        <span
          v-if="appliedFilters.status !== null"
          class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
        >
          {{ getStatusLabel(appliedFilters.status, statusOptions) }}
          <button
            @click="clearFilter('status')"
            class="ml-1 hover:text-green-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
        <span
          v-if="appliedFilters.priority !== null"
          class="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
        >
          {{ getPriorityLabel(appliedFilters.priority, priorityOptions) }}
          <button
            @click="clearFilter('priority')"
            class="ml-1 hover:text-orange-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
      </div>
    </div>

    <!-- Bảng dữ liệu -->
    <div v-if="filteredTodos.length > 0">
      <DataTable
        :value="filteredTodos"
        :paginator="true"
        :rows="5"
        :rowsPerPageOptions="[5, 10, 20]"
        class="p-datatable-striped"
        responsiveLayout="scroll"
      >
        <Column header="Trạng thái">
          <template #body="slotProps">
            <TodoItem
              :todo="slotProps.data"
              display-mode="checkbox-only"
              @update="toggleCompleted"
            />
          </template>
        </Column>

        <Column field="title" header="Tiêu đề">
          <template #body="slotProps">
            <TodoItem :todo="slotProps.data" display-mode="title-only" />
          </template>
        </Column>

        <Column field="description" header="Mô tả" />

        <Column field="priority" header="Ưu tiên">
          <template #body="slotProps">
            <TodoItem :todo="slotProps.data" display-mode="priority-only" />
          </template>
        </Column>

        <Column field="deadline" header="Thời hạn">
          <template #body="slotProps">
            <TodoItem :todo="slotProps.data" display-mode="deadline-only" />
          </template>
        </Column>

        <Column header="Hành động">
          <template #body="slotProps">
            <TodoItem
              :todo="slotProps.data"
              display-mode="actions-only"
              @edit="startEdit"
              @delete="onDelete"
            />
          </template>
        </Column>
      </DataTable>
    </div>
    <div v-else-if="hasActiveFilters" class="text-center py-8">
      <i class="pi pi-search text-4xl text-gray-400 mb-4"></i>
      <p class="text-lg text-gray-600">Không tìm thấy kết quả phù hợp</p>
      <Button
        label="Reset bộ lọc"
        class="p-button-link mt-2"
        @click="resetFilters"
      />
    </div>
    <div v-else class="text-center py-8">
      <i class="pi pi-inbox text-4xl text-gray-400 mb-4"></i>
      <p class="text-lg text-gray-600">Chưa có dữ liệu todo, hãy thêm mới!</p>
    </div>

    <!-- Dialog thêm/sửa -->
    <Dialog
      :header="editingTodo ? 'Sửa Todo' : 'Thêm Todo'"
      v-model:visible="showDialog"
      modal
      :closable="false"
      :style="{ width: '600px' }"
    >
      <div class="flex flex-col gap-5">
        <div class="flex flex-col gap-2">
          <label class="font-medium">
            Tiêu đề <span class="text-red-600 ml-0.5">*</span>
          </label>
          <InputText v-model="form.title" class="w-full" />
          <span v-if="formErrors.title" class="text-red-600 text-sm">
            {{ formErrors.title }}
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">
            Mô tả <span class="text-red-600 ml-0.5">*</span>
          </label>
          <Textarea
            v-model="form.description"
            class="w-full border-1 border-[#ccc] rounded-[7px] p-2"
            rows="5"
            autoResize
          />
          <span v-if="formErrors.description" class="text-red-600 text-sm">
            {{ formErrors.description }}
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">
            Ưu tiên <span class="text-red-600 ml-0.5">*</span>
          </label>
          <Dropdown
            v-model="form.priority"
            :options="priorityOptions"
            optionLabel="label"
            optionValue="value"
            class="w-full"
          />
          <span v-if="formErrors.priority" class="text-red-600 text-sm">
            {{ formErrors.priority }}
          </span>
        </div>

        <div class="flex flex-col gap-2">
          <label class="font-medium">Thời hạn</label>
          <Calendar
            v-model="form.deadline"
            showIcon
            class="w-full"
            :minDate="new Date()"
            :manualInput="false"
            monthNavigator
            yearNavigator
            :yearRange="'2024:2035'"
          />
          <span v-if="formErrors.deadline" class="text-red-600 text-sm">
            {{ formErrors.deadline }}
          </span>
        </div>

        <div class="flex justify-end gap-3 mt-4">
          <Button
            label="Hủy"
            class="p-button-secondary"
            @click="cancelDialog"
          />
          <Button label="Lưu" class="p-button-success" @click="saveTodo" />
        </div>
      </div>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useTodoStore } from "@/stores/todoStore";
import { useTodoForm } from "@/composables/useTodoForm";
import { useTodoFilter } from "@/composables/useTodoFilter";
import { getPriorityLabel, getStatusLabel } from "@/utils/todoUtils";
import TodoItem from "@/components/TodoItem.vue";
// Store
const todoStore = useTodoStore();
const { todos } = storeToRefs(todoStore);
// Form
const {
  showDialog,
  editingTodo,
  form,
  formErrors,
  openAddDialog,
  startEdit,
  cancelDialog,
  saveTodo,
} = useTodoForm();
// Filter
const {
  searchFilters,
  appliedFilters,
  filteredTodos,
  hasActiveFilters,
  applyFilters,
  resetFilters,
  clearFilter,
} = useTodoFilter(todos);
// Options
const priorityOptions = [
  { label: "Dễ", value: "low" },
  { label: "Vừa", value: "medium" },
  { label: "Khó", value: "high" },
];
const statusOptions = [
  { label: "Tất cả", value: null },
  { label: "Hoàn thành", value: true },
  { label: "Chưa hoàn thành", value: false },
];
const priorityFilterOptions = [
  { label: "Tất cả", value: null },
  ...priorityOptions,
];
onMounted(() => {
  todoStore.getTodos();
});
async function onDelete(id) {
  if (confirm("Bạn có chắc muốn xóa công việc này?")) {
    await todoStore.deleteTodoItem(id);
  }
}
async function toggleCompleted(todo) {
  await todoStore.updateTodoItem(todo.id, {
    ...todo,
    is_completed: todo.is_completed,
  });
}
</script>

<style>
.p-datatable-paginator-bottom {
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
