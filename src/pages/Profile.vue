<template>
  <div class="max-w-xl  bg-white p-6 ">
    <h2 class="text-2xl font-bold mb-6 text-gray-800 flex items-center gap-2">
      <i class="pi pi-user text-blue-500"></i>
      Thông tin người dùng
    </h2>

    <div v-if="userStore.userInfo" class="space-y-3">
      <p class="flex items-center gap-2">
        <i class="pi pi-id-card text-gray-500"></i>
        <span><strong>Tên đăng nhập:</strong> {{ userStore.userInfo.username }}</span>
      </p>
      <p class="flex items-center gap-2">
        <i class="pi pi-envelope text-gray-500"></i>
        <span><strong>Email:</strong> {{ userStore.userInfo.email }}</span>
      </p>

      <Button
        label="Chỉnh sửa thông tin"
        icon="pi pi-user-edit"
        class="mt-5 p-button-info"
        @click="openEditDialog"
      />
    </div>

    <div v-else class="text-gray-500 italic">
      Không có thông tin user.
    </div>

    <!-- Dialog chỉnh sửa -->
    <Dialog
      v-model:visible="showEdit"
      header="Chỉnh sửa thông tin"
      modal
      :style="{ width: '32rem' }"
    >
      <form @submit.prevent="updateProfile" class="flex flex-col gap-5">
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Họ tên</label>
          <InputText
            v-model="editForm.username"
            class="w-full"
            placeholder="Nhập họ tên"
          />
        </div>
        <div>
          <label class="block mb-1 text-sm font-medium text-gray-700">Email</label>
          <InputText
            v-model="editForm.email"
            class="w-full opacity-80"
          />
        </div>
        <div class="flex justify-end gap-3 mt-6">
          <Button
            label="Hủy"
            icon="pi pi-times"
            severity="secondary"
            outlined
            @click="showEdit = false"
            type="button"
          />
          <Button label="Lưu" icon="pi pi-check" severity="success" type="submit" />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import Button from "primevue/button";
import Dialog from "primevue/dialog";
import InputText from "primevue/inputtext";

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
