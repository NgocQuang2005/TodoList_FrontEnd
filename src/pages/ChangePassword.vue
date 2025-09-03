<template>
  <div
    class="min-h-screen bg-gradient-to-br from-purple-100 to-blue-100 p-6 relative"
  >
    <!-- Background Image -->
    <div class="absolute inset-0 opacity-30">
      <div
        class="w-full h-full bg-cover bg-center"
        style="
          background-image: url('https://cdn-media.sforum.vn/storage/app/media/wp-content/uploads/2024/02/anh-thien-nhien-Thumbnail.jpg');
        "
      ></div>
    </div>

    <!-- Overlay -->
    <div class="absolute inset-0 bg-white/20 backdrop-blur-sm"></div>

    <div class="relative max-w-md mx-auto">
      <!-- Main Card -->
      <div
        class="bg-white/95 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden border border-white/50"
      >
        <!-- Header -->
        <div
          class="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-center"
        >
          <div
            class="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <i class="pi pi-lock text-white text-2xl"></i>
          </div>
          <h2 class="text-2xl font-bold text-white mb-2">Đổi mật khẩu</h2>
          <p class="text-white/80 text-sm">
            Cập nhật mật khẩu để bảo mật tài khoản
          </p>
        </div>

        <!-- Form -->
        <div class="p-6">
          <form @submit.prevent="submitPassword" class="space-y-5">
            <!-- Old Password -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <i class="pi pi-key text-orange-500"></i>
                Mật khẩu cũ
              </label>
              <Password
                v-model="oldPassword"
                toggleMask
                :feedback="false"
                placeholder="Nhập mật khẩu hiện tại"
              />
            </div>

            <!-- New Password -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <i class="pi pi-shield text-blue-500"></i>
                Mật khẩu mới
              </label>
              <Password
                v-model="newPassword"
                toggleMask
                :feedback="false"
                placeholder="Nhập mật khẩu mới"
              />
            </div>

            <!-- Confirm Password -->
            <div>
              <label
                class="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2"
              >
                <i class="pi pi-check-circle text-green-500"></i>
                Xác nhận mật khẩu
              </label>
              <Password
                v-model="confirmPassword"
                toggleMask
                :feedback="false"
                placeholder="Nhập lại mật khẩu mới"
              />
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              class="w-full bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 text-white font-semibold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 mt-6"
            >
              Đổi mật khẩu
            </button>
          </form>
        </div>

        <!-- Tips -->
        <div class="bg-gray-50/80 p-4 border-t">
          <div class="flex gap-3">
            <i class="pi pi-info-circle text-blue-500 mt-0.5"></i>
            <div>
              <h4 class="font-medium text-gray-800 mb-1">Mẹo bảo mật</h4>
              <p class="text-xs text-gray-600">
                Sử dụng ít nhất 8 ký tự, kết hợp chữ hoa, thường, số và ký tự
                đặc biệt
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const userStore = useUserStore();

const oldPassword = ref("");
const newPassword = ref("");
const confirmPassword = ref("");

async function submitPassword() {
  if (newPassword.value !== confirmPassword.value) {
    alert("Mật khẩu mới và xác nhận không khớp");
    return;
  }

  try {
    await userStore.changeUserPassword({
      oldPassword: oldPassword.value,
      newPassword: newPassword.value,
    });
    alert("Đổi mật khẩu thành công");
    router.push("/");
  } catch (err) {
    alert("Đổi mật khẩu thất bại");
    console.error(err);
  }
}
</script>

<style scoped>
.backdrop-blur-lg {
  backdrop-filter: blur(12px);
}
.p-password{
  width: 100%;
}
.p-password >>> input{
  width: 100%;
  color: red !important;
}
</style>
