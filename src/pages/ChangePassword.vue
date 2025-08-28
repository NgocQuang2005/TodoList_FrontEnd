<template>
  <div class="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
    <h2 class="text-xl font-bold mb-4">Đổi mật khẩu</h2>
    <form @submit.prevent="submitPassword">
      <div class="mb-4">
        <label class="block mb-1">Mật khẩu cũ</label>
        <input v-model="oldPassword" type="password" class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="mb-4">
        <label class="block mb-1">Mật khẩu mới</label>
        <input v-model="newPassword" type="password" class="w-full border rounded px-3 py-2"/>
      </div>
      <div class="mb-4">
        <label class="block mb-1">Xác nhận mật khẩu mới</label>
        <input v-model="confirmPassword" type="password" class="w-full border rounded px-3 py-2"/>
      </div>
      <button type="submit" class="bg-blue-600 text-white px-4 py-2 rounded-lg">
        Đổi mật khẩu
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";

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
  } catch (err) {
    alert("Đổi mật khẩu thất bại");
    console.error(err);
  }
}
</script>
