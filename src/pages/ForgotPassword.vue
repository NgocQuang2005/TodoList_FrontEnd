<template>
  <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-[100vh]">
    <Card style="overflow: hidden">
      <template #content>
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            class="mx-auto h-10 w-auto"
          />
          <h2 class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900">
            {{ step === 1 ? "Quên mật khẩu" : "Đặt lại mật khẩu" }}
          </h2>
        </div>

        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <!-- Step 1: Nhập email -->
          <div v-if="step === 1">
            <label for="email" class="block text-sm/6 font-medium text-gray-900">
              Vui lòng nhập email đăng ký của bạn
            </label>
            <div class="mt-2">
              <InputText
                id="email"
                v-model="email"
                :class="{ 'p-invalid': errors.email }"
                placeholder="Nhập email..."
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900"
              />
            </div>
            <small v-if="errors.email" class="text-red-500">{{ errors.email }}</small>
          </div>

          <!-- Step 2: Nhập code + mật khẩu mới -->
          <div v-if="step === 2">
            <label class="block text-sm/6 font-medium text-gray-900">Email</label>
            <InputText
              v-model="email"
              disabled
              class="block w-full rounded-md bg-gray-100 px-3 py-1.5 text-base text-gray-500"
            />

            <label class="block mt-3 text-sm/6 font-medium text-gray-900">Mã code</label>
            <InputText
              v-model="resetCode"
              :class="{ 'p-invalid': errors.resetCode }"
              placeholder="Nhập mã code"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900"
            />
            <small v-if="errors.resetCode" class="text-red-500">{{ errors.resetCode }}</small>

            <label class="block mt-3 text-sm/6 font-medium text-gray-900">Mật khẩu mới</label>
            <InputText
              v-model="newPassword"
              type="password"
              :class="{ 'p-invalid': errors.newPassword }"
              placeholder="Nhập mật khẩu mới"
              class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900"
            />
            <small v-if="errors.newPassword" class="text-red-500">{{ errors.newPassword }}</small>
          </div>

          <div class="mt-3">
            <Button
              @click="onSubmit"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400"
            >
              {{ step === 1 ? "Kiểm tra" : "Hoàn tất" }}
            </Button>
            <small v-if="errors.general" class="text-red-500 text-sm">{{ errors.general }}</small>
          </div>

          <p class="mt-10 text-center text-sm/6 text-gray-400">
            Quay lại trang đăng nhập?
            <RouterLink
              to="/login"
              class="text-blue-500 font-medium hover:underline ml-1"
            >
              Đăng nhập
            </RouterLink>
          </p>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useUserStore } from "@/stores/userStore";
import router from "@/router";

const userStore = useUserStore();

const step = ref(1); // step 1: gửi email, step 2: nhập code + password
const email = ref("");
const resetCode = ref("");
const newPassword = ref("");
const errors = ref({});

async function onSubmit() {
  errors.value = {}; // reset errors

  if (!email.value) {
    errors.value.email = "Email không được để trống";
    return;
  }

  if (step.value === 1) {
    // Gửi email quên mật khẩu
    try {
      await userStore.forgotUserPassword(email.value);
      step.value = 2; // chuyển sang nhập code + password
    } catch (err) {
      errors.value.general = err.response?.data?.message || "Gửi email thất bại";
    }
  } else if (step.value === 2) {
    // Check code + reset password
    if (!resetCode.value) errors.value.resetCode = "Mã code không được để trống";
    if (!newPassword.value) errors.value.newPassword = "Mật khẩu mới không được để trống";

    if (Object.keys(errors.value).length > 0) return;

    try {
      await userStore.resetUserPassword({
        email: email.value,
        resetCode: resetCode.value,
        newPassword: newPassword.value
      });
      router.push("/login"); // chuyển về login
    } catch (err) {
      errors.value.general = err.response?.data?.message || "Đặt lại mật khẩu thất bại";
    }
  }
}
</script>

<style>
.p-invalid {
  border: 1px solid red !important;
}
</style>
