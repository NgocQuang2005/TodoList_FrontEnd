<template>
  <div class="image-upload-container">
    <div class="flex flex-col gap-3">
      <!-- Label -->
      <label class="font-medium text-sm">Hình ảnh</label>

      <!-- Upload Area -->
      <div
        class="relative border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-blue-400 transition-colors"
        :class="{
          'border-blue-400 bg-blue-50': isDragging,
          'border-gray-400': !isDragging,
        }"
        @click="triggerFileInput"
        @drop.prevent="handleDrop"
        @dragover.prevent="isDragging = true"
        @dragenter.prevent="isDragging = true"
        @dragleave.prevent="isDragging = false"
      >
        <!-- File Input (Hidden) -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileInputChange"
        />

        <!-- Preview Image -->
        <div v-if="imagePreview" class="relative inline-block">
          <img
            :src="imagePreview"
            alt="Preview"
            class="w-32 h-32 object-cover rounded-lg shadow-md mx-auto"
          />
          <button
            type="button"
            class="absolute -top-2 -right-2 bg-red-500 text-white rounded-xs w-2 h-6 flex items-center justify-center hover:bg-red-600 transition-colors"
            @click.stop="removeImage"
          >
            <i class="pi pi-times text-xs"></i>
          </button>
          <div class="mt-2 text-sm text-gray-600">Click để thay đổi ảnh</div>
        </div>

        <!-- Processing State -->
        <div v-else-if="isProcessing" class="py-8">
          <i class="pi pi-spin pi-spinner text-2xl text-blue-500 mb-2"></i>
          <div class="text-sm text-gray-600">Đang tối ưu hóa ảnh...</div>
          <div class="text-xs text-gray-500 mt-1">
            Ảnh sẽ được tự động resize về tối đa 1MB
          </div>
        </div>

        <!-- Upload Placeholder -->
        <div v-else class="py-8">
          <i class="pi pi-cloud-upload text-3xl text-gray-400 mb-3"></i>
          <div class="text-sm text-gray-600 mb-1">
            Click để chọn ảnh hoặc kéo thả vào đây
          </div>
          <div class="text-xs text-gray-500">
            JPG, PNG, GIF (bất kỳ kích thước nào)
          </div>
          <div class="text-xs text-gray-500 mt-1">
            Ảnh sẽ được tự động tối ưu về tối đa 1MB
          </div>
        </div>
      </div>

      <!-- Error Message -->
      <div v-if="errorMessage" class="text-red-600 text-sm">
        {{ errorMessage }}
      </div>

      <!-- Image Info -->
      <div
        v-if="imageFile"
        class="text-xs text-gray-500 bg-gray-50 p-2 rounded"
      >
        <div class="flex justify-between">
          <span>Ảnh đã tối ưu</span>
          <span>Dung lượng: {{ formatFileSize(imageFile.size) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onUnmounted } from "vue";
import { useImageUpload } from "@/composables/useImageUpload";
import { getStaticUrl } from "@/services/api";

const props = defineProps({
  modelValue: {
    type: File,
    default: null,
  },
  existingImageUrl: {
    type: String,
    default: null,
  },
});

const emit = defineEmits(["update:modelValue"]);

const fileInput = ref(null);
const isDragging = ref(false);
const errorMessage = ref("");

const {
  imageFile,
  imagePreview,
  isProcessing,
  handleFileSelect,
  resetImage,
  cleanup,
} = useImageUpload();

// Watch for changes and emit to parent
watch(imageFile, (newFile) => {
  emit("update:modelValue", newFile);
});

// Watch for existing image URL (for edit mode)
watch(
  () => props.existingImageUrl,
  (newUrl) => {
    if (newUrl && !imagePreview.value) {
      imagePreview.value = getStaticUrl(newUrl);
    }
  },
  { immediate: true }
);

// Watch for external model value changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!newValue && imagePreview.value && !props.existingImageUrl) {
      resetImage();
    }
  }
);

// Trigger file input
const triggerFileInput = () => {
  fileInput.value?.click();
};

// Handle file input change
const handleFileInputChange = async (event) => {
  const file = event.target.files?.[0];
  if (file) {
    await processFile(file);
  }
};

// Handle drag and drop
const handleDrop = async (event) => {
  isDragging.value = false;
  const files = event.dataTransfer?.files;
  if (files?.length > 0) {
    await processFile(files[0]);
  }
};

// Process selected file
const processFile = async (file) => {
  errorMessage.value = "";

  try {
    await handleFileSelect(file);
  } catch (error) {
    errorMessage.value = error.message;
  }
};

// Remove image
const removeImage = () => {
  resetImage();
  emit("update:modelValue", null);
  if (fileInput.value) {
    fileInput.value.value = "";
  }
};

// Format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
};

// Cleanup on unmount
onUnmounted(() => {
  cleanup();
});

// Expose reset method for parent component
defineExpose({
  resetImage,
});
</script>

<style scoped>
.image-upload-container {
  width: 100%;
}

.pi-cloud-upload {
  display: block;
  margin: 0 auto;
}
</style>
