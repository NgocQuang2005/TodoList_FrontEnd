<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 p-6 relative">
    <!-- Background -->
    <div class="absolute inset-0 opacity-20">
      <div 
        class="w-full h-full bg-cover bg-center"
        style="background-image: url('https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/02/anh-thien-nhien-Thumbnail.jpg')"
      ></div>
    </div>

    <div class="relative max-w-lg mx-auto">
      <!-- Profile Card -->
      <div class="bg-white/90 backdrop-blur-lg rounded-2xl shadow-xl overflow-hidden">
        <!-- Header -->
        <div class="bg-gradient-to-r from-blue-500 to-purple-600 p-6 text-center">
          <div class="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center">
            <i class="pi pi-user text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-white">Thông tin người dùng</h2>
        </div>

        <!-- Content -->
        <div class="p-6">
          <div v-if="userStore.userInfo" class="space-y-4">
            <!-- User Info -->
            <div class="space-y-3">
              <div class="flex items-center gap-3 p-3 bg-blue-50 rounded-xl">
                <i class="pi pi-id-card text-blue-500 text-lg"></i>
                <div>
                  <p class="text-sm text-gray-600">Tên đăng nhập</p>
                  <p class="font-semibold">{{ userStore.userInfo.username }}</p>
                </div>
              </div>
              
              <div class="flex items-center gap-3 p-3 bg-purple-50 rounded-xl">
                <i class="pi pi-envelope text-purple-500 text-lg"></i>
                <div>
                  <p class="text-sm text-gray-600">Email</p>
                  <p class="font-semibold">{{ userStore.userInfo.email }}</p>
                </div>
              </div>
            </div>

            <!-- Edit Button -->
            <Button
              label="Chỉnh sửa"
              icon="pi pi-edit"
              class="w-full mt-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white border-0 rounded-xl font-semibold"
              @click="openEditDialog"
            />
          </div>

          <div v-else class="text-center py-8 text-gray-500">
            Không có thông tin user.
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Dialog -->
    <Dialog v-model:visible="showEdit" header="Chỉnh sửa thông tin" modal :style="{ width: '28rem' }">
      <form @submit.prevent="updateProfile" class="space-y-4">
        <!-- Username -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Họ tên</label>
          <InputText
            v-model="editForm.username"
            class="w-full p-3 border border-gray-300 rounded-lg"
            placeholder="Nhập họ tên"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email</label>
          <InputText
            v-model="editForm.email"
            class="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
            readonly
          />
        </div>

        <!-- Buttons -->
        <div class="flex gap-3 pt-4">
          <Button
            label="Hủy"
            icon="pi pi-times"
            class="flex-1 py-3 bg-gray-200 hover:bg-gray-300 text-gray-700 border-0 rounded-lg"
            @click="showEdit = false"
            type="button"
          />
          <Button 
            label="Lưu" 
            icon="pi pi-check" 
            class="flex-1 py-3 bg-green-500 hover:bg-green-600 text-white border-0 rounded-lg"
            type="submit" 
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
const userStore = useUserStore();
const showEdit = ref(false);

const editForm = ref({
  username: "",
  email: "",
});

function openEditDialog() {
  if (userStore.userInfo) {
    editForm.value.username = userStore.userInfo.username;
    editForm.value.email = userStore.userInfo.email;
  }
  showEdit.value = true;
}

async function updateProfile() {
  try {
    const updated = await userStore.updateUser(editForm.value);
    editForm.value.username = updated.username;
    editForm.value.email = updated.email;

    alert("Cập nhật thông tin thành công!");
    showEdit.value = false;
  } catch (err) {
    console.error("Lỗi cập nhật:", err);
    alert("Cập nhật thất bại!");
  }
}
</script>

<style scoped>
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}
</style>