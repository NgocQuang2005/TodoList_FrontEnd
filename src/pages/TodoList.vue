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
            @keyup.enter="applyFilters"
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
          v-if="
            todoStore.currentFilters.title &&
            todoStore.currentFilters.title.trim()
          "
          class="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
        >
          "{{ todoStore.currentFilters.title }}"
          <button
            @click="clearFilter('title')"
            class="ml-1 hover:text-blue-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
        <span
          v-if="
            todoStore.currentFilters.status !== null &&
            todoStore.currentFilters.status !== undefined &&
            todoStore.currentFilters.status !== 'all'
          "
          class="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
        >
          {{ getStatusLabel(todoStore.currentFilters.status, statusOptions) }}
          <button
            @click="clearFilter('status')"
            class="ml-1 hover:text-green-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
        <span
          v-if="
            todoStore.currentFilters.priority !== null &&
            todoStore.currentFilters.priority !== undefined &&
            todoStore.currentFilters.priority !== 'all'
          "
          class="inline-flex items-center px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded-full"
        >
          {{
            getPriorityLabel(todoStore.currentFilters.priority, priorityOptions)
          }}
          <button
            @click="clearFilter('priority')"
            class="ml-1 hover:text-orange-600"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
        </span>
      </div>
    </div>
    <!-- Loading Skeleton -->
    <LoadingSkeleton v-if="loading" type="todo-list" :rows="pagination.pageSize" />
    
    <!-- Bảng dữ liệu -->
    <div v-else-if="filteredTodos.length > 0">
      <DataTable
        :value="filteredTodos"
        :paginator="true"
        :rows="pagination.pageSize"
        :rowsPerPageOptions="PAGE_SIZE_OPTIONS"
        :totalRecords="pagination.total"
        :first="(pagination.page - 1) * pagination.pageSize"
        :lazy="true"
        @page="onPageChange"
        @rowsPerPageChange="onRowsPerPageChange"
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
      <div class="flex justify-end">
        <Button
          v-if="editingTodo"
          label="Lịch sử cập nhật"
          icon="pi pi-history"
          class="p-button-info"
          @click="openHistoryDialog(editingTodo.id)"
        />
      </div>
      <div class="flex flex-col gap-5 mt-2">
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
            showTime
            hourFormat="24"
            :stepHour="1"
            :stepMinute="1"
            :stepSecond="1"
          />
          <span v-if="formErrors.deadline" class="text-red-600 text-sm">
            {{ formErrors.deadline }}
          </span>
        </div>
        <ImageUpload
          v-model="selectedImageFile"
          :existing-image-url="editingTodo?.image_url"
          @update:modelValue="handleImageSelect"
        />
        <div class="flex justify-end gap-3 mt-4">
          <Button
            label="Hủy"
            class="p-button-secondary"
            @click="cancelDialog"
            :disabled="isSubmitting"
          />
          <Button 
            :label="isSubmitting ? 'Đang lưu...' : 'Lưu'" 
            class="p-button-success" 
            @click="saveTodo"
            :disabled="isSubmitting"
            :loading="isSubmitting"
          />
        </div>
      </div>
    </Dialog>
    <!-- history -->
    <!-- Dialog lịch sử -->
    <Dialog
      header="Lịch sử cập nhật"
      v-model:visible="showHistoryDialog"
      modal
      :style="{ width: '600px' }"
    >
      <!-- Loading Skeleton for History -->
      <LoadingSkeleton v-if="todoStore.historyLoading" type="todo-history" />
      
      <div v-else-if="todoStore.todoHistory.length > 0" class="space-y-3">
        <div
          v-for="(history, index) in todoStore.todoHistory"
          :key="index"
          class="p-3 border rounded-lg bg-gray-50"
        >
          <p class="text-sm text-gray-600">
            <strong>Ngày cập nhật:</strong>
            {{ new Date(history.updated_at).toLocaleString() }}
          </p>
          <p class="text-sm"><strong>Tiêu đề:</strong> {{ history.title }}</p>
          <p class="text-sm">
            <strong>Mô tả:</strong> {{ history.description }}
          </p>
          <p class="text-sm">
            <strong>Ưu tiên:</strong>
            {{ getPriorityLabel(history.priority, priorityOptions) }}
          </p>
          <p class="text-sm">
            <strong>Trạng thái:</strong>
            {{ history.is_completed ? "Hoàn thành" : "Chưa hoàn thành" }}
          </p>
          
        </div>
      </div>
      <div v-else class="text-center py-6 text-gray-500">
        Không có lịch sử nào cho todo này.
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
import { 
  PRIORITY_OPTIONS, 
  STATUS_OPTIONS, 
  PRIORITY_FILTER_OPTIONS,
  PAGE_SIZE_OPTIONS,
  ERROR_MESSAGES,
  TODO_CONSTANTS
} from "@/constants";
import { useToast } from "@/composables/useToast";
import TodoItem from "@/components/TodoItem.vue";
import ImageUpload from "@/components/ImageUpload.vue";
import LoadingSkeleton from "@/components/LoadingSkeleton.vue";

// Store
const todoStore = useTodoStore();
const { todos, pagination, loading } = storeToRefs(todoStore);

// Form
const {
  showDialog,
  editingTodo,
  form,
  formErrors,
  selectedImageFile,
  showHistoryDialog,
  isSubmitting,
  openAddDialog,
  startEdit,
  cancelDialog,
  saveTodo,
  handleImageSelect,
  openHistoryDialog,
} = useTodoForm();

// Filter
const {
  searchFilters,
  appliedFilters,
  filteredTodos,
  hasActiveFilters,
  hasUnappliedChanges,
  applyFilters,
  resetFilters,
  clearFilter,
  syncWithStore,
} = useTodoFilter(todos, todoStore);

// Toast
const { todoDeleted, todoCompleted, showError, confirmDelete } = useToast();

// Options từ constants
const priorityOptions = PRIORITY_OPTIONS;
const statusOptions = STATUS_OPTIONS;
const priorityFilterOptions = PRIORITY_FILTER_OPTIONS;

/**
 * Xử lý chuyển trang
 */
async function onPageChange(event) {
  const page = event.first / event.rows + 1;
  const pageSize = event.rows;
  await todoStore.getTodos(page, pageSize, todoStore.currentFilters);
}

/**
 * Xử lý thay đổi số item mỗi trang
 */
async function onRowsPerPageChange(event) {
  await todoStore.changePageSize(event.rows);
}

/**
 * Xử lý xóa todo với toast confirmation
 */
async function onDelete(id) {
  // Sử dụng confirm dialog thay vì alert
  if (confirm(ERROR_MESSAGES.DELETE_CONFIRM)) {
    const result = await todoStore.deleteTodoItem(id);
    if (result.success) {
      todoDeleted();
    } else {
      showError('Không thể xóa!', result.error || 'Có lỗi xảy ra khi xóa todo');
    }
  }
}

/**
 * Toggle trạng thái hoàn th��nh với toast feedback
 */
async function toggleCompleted(todo) {
  const result = await todoStore.updateTodoItem(todo.id, { 
    is_completed: !todo.is_completed 
  });
  
  if (result.success) {
    if (!todo.is_completed) {
      todoCompleted();
    }
  } else {
    showError('Không thể cập nhật!', result.error || 'Có lỗi xảy ra khi cập nhật trạng thái');
  }
}

// Khởi tạo dữ liệu khi component mount
onMounted(() => {
  todoStore.getTodos(1, TODO_CONSTANTS.DEFAULT_PAGE_SIZE);
});
</script>

<style>
.p-datatable-paginator-bottom {
  display: flex;
  justify-content: end;
  align-items: center;
}
</style>
