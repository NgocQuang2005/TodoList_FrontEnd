<template>
  <div class="loading-skeleton">
    <!-- Todo List Skeleton -->
    <div v-if="type === 'todo-list'" class="space-y-4">
      <!-- Header Skeleton -->
      <div class="flex justify-between items-center mb-6">
        <Skeleton width="200px" height="2rem" />
        <Skeleton width="120px" height="2.5rem" />
      </div>

      <!-- Filter Skeleton -->
      <div class="bg-white p-4 rounded-lg shadow-sm border mb-4">
        <div class="flex flex-wrap items-end gap-3">
          <div class="flex-1 min-w-[200px]">
            <Skeleton width="80px" height="1rem" class="mb-2" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
          <div class="w-40">
            <Skeleton width="60px" height="1rem" class="mb-2" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
          <div class="w-32">
            <Skeleton width="50px" height="1rem" class="mb-2" />
            <Skeleton width="100%" height="2.5rem" />
          </div>
          <div class="flex gap-2">
            <Skeleton width="40px" height="2.5rem" />
            <Skeleton width="40px" height="2.5rem" />
          </div>
        </div>
      </div>

      <!-- Table Skeleton -->
      <div class="bg-white rounded-lg shadow-sm border overflow-hidden">
        <!-- Table Header -->
        <div class="bg-gray-50 p-4 border-b">
          <div class="grid grid-cols-6 gap-4">
            <Skeleton width="80px" height="1rem" />
            <Skeleton width="60px" height="1rem" />
            <Skeleton width="50px" height="1rem" />
            <Skeleton width="60px" height="1rem" />
            <Skeleton width="70px" height="1rem" />
            <Skeleton width="80px" height="1rem" />
          </div>
        </div>

        <!-- Table Rows -->
        <div v-for="i in rows" :key="i" class="p-4 border-b last:border-b-0">
          <div class="grid grid-cols-6 gap-4 items-center">
            <Skeleton width="20px" height="20px" />
            <Skeleton :width="getTitleWidth(i)" height="1rem" />
            <Skeleton :width="getDescWidth(i)" height="1rem" />
            <Skeleton width="60px" height="1.5rem" />
            <Skeleton width="80px" height="1rem" />
            <div class="flex gap-2">
              <Skeleton width="30px" height="30px" />
              <Skeleton width="30px" height="30px" />
            </div>
          </div>
        </div>

        <!-- Pagination Skeleton -->
        <div class="p-4 border-t bg-gray-50">
          <div class="flex justify-between items-center">
            <Skeleton width="150px" height="1rem" />
            <div class="flex gap-2">
              <Skeleton width="30px" height="30px" />
              <Skeleton width="30px" height="30px" />
              <Skeleton width="30px" height="30px" />
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Todo Form Skeleton -->
    <div v-else-if="type === 'todo-form'" class="space-y-5">
      <div class="space-y-2">
        <Skeleton width="80px" height="1rem" />
        <Skeleton width="100%" height="2.5rem" />
      </div>
      
      <div class="space-y-2">
        <Skeleton width="60px" height="1rem" />
        <Skeleton width="100%" height="6rem" />
      </div>
      
      <div class="space-y-2">
        <Skeleton width="70px" height="1rem" />
        <Skeleton width="100%" height="2.5rem" />
      </div>
      
      <div class="space-y-2">
        <Skeleton width="70px" height="1rem" />
        <Skeleton width="100%" height="2.5rem" />
      </div>

      <div class="space-y-2">
        <Skeleton width="90px" height="1rem" />
        <Skeleton width="100%" height="8rem" />
      </div>

      <div class="flex justify-end gap-3">
        <Skeleton width="80px" height="2.5rem" />
        <Skeleton width="80px" height="2.5rem" />
      </div>
    </div>

    <!-- Todo History Skeleton -->
    <div v-else-if="type === 'todo-history'" class="space-y-3">
      <div v-for="i in 3" :key="i" class="p-3 border rounded-lg bg-gray-50">
        <div class="space-y-2">
          <Skeleton width="200px" height="1rem" />
          <Skeleton :width="getHistoryTitleWidth(i)" height="1rem" />
          <Skeleton :width="getHistoryDescWidth(i)" height="1rem" />
          <Skeleton width="120px" height="1rem" />
          <Skeleton width="150px" height="1rem" />
        </div>
      </div>
    </div>

    <!-- Card Skeleton -->
    <div v-else-if="type === 'card'" class="bg-white p-4 rounded-lg shadow-sm border">
      <div class="space-y-3">
        <Skeleton width="70%" height="1.5rem" />
        <Skeleton width="100%" height="1rem" />
        <Skeleton width="85%" height="1rem" />
        <div class="flex justify-between items-center pt-2">
          <Skeleton width="80px" height="1.5rem" />
          <Skeleton width="60px" height="1rem" />
        </div>
      </div>
    </div>

    <!-- Simple Loading -->
    <div v-else-if="type === 'simple'" class="flex justify-center items-center py-8">
      <ProgressSpinner style="width: 50px; height: 50px" strokeWidth="4" />
    </div>

    <!-- Custom Skeleton -->
    <div v-else>
      <Skeleton :width="width" :height="height" />
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  type: {
    type: String,
    default: 'simple',
    validator: (value) => ['todo-list', 'todo-form', 'todo-history', 'card', 'simple', 'custom'].includes(value)
  },
  rows: {
    type: Number,
    default: 5
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: String,
    default: '1rem'
  }
});

// Generate random widths for more realistic skeleton
const getTitleWidth = (index) => {
  const widths = ['120px', '180px', '150px', '200px', '160px'];
  return widths[index % widths.length];
};

const getDescWidth = (index) => {
  const widths = ['200px', '250px', '180px', '220px', '190px'];
  return widths[index % widths.length];
};

const getHistoryTitleWidth = (index) => {
  const widths = ['160px', '140px', '180px'];
  return widths[index % widths.length];
};

const getHistoryDescWidth = (index) => {
  const widths = ['240px', '200px', '260px'];
  return widths[index % widths.length];
};
</script>

<style scoped>
.loading-skeleton {
  animation: pulse 1.5s ease-in-out infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.8;
  }
}
</style>