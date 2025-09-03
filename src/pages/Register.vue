<template>
  <div
    class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8 h-[100vh]"
  >
    <Card style="overflow: hidden">
      <template #content>
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
          <img
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=500"
            alt="Your Company"
            class="mx-auto h-10 w-auto"
          />
          <h2
            class="mt-5 text-center text-2xl/9 font-bold tracking-tight text-gray-900"
          >
            Đăng ký tài Khoản
          </h2>
        </div>
        <div class="mt-5 sm:mx-auto sm:w-full sm:max-w-sm">
          <div>
            <label
              for="username"
              class="block text-sm/6 font-medium text-gray-900"
              >UserName</label
            >
            <div class="mt-2">
              <InputText
                id="username"
                v-model="username"
                :class="{ 'p-invalid': errors.username }"
                placeholder="Nhập tên đăng nhập"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            <small v-if="errors.username" class="text-red-500">
              {{ errors.username }}
            </small>
          </div>
          <div>
            <label for="email" class="block text-sm/6 font-medium text-gray-900"
              >Email</label
            >
            <div class="mt-2">
              <InputText
                id="email"
                v-model="email"
                :class="{ 'p-invalid': errors.email }"
                placeholder="Nhập Email"
                class="block w-full rounded-md bg-white/5 px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              />
            </div>
            <small v-if="errors.email" class="text-red-500">
              {{ errors.email }}
            </small>
          </div>
          <div class="mt-2">
            <div class="flex items-center justify-between">
              <label
                for="password"
                class="block text-sm/6 font-medium text-gray-900"
                >Password</label
              >
            </div>
            <Password
              id="password"
              v-model="password"
              :class="{ 'p-invalid': errors.password }"
              placeholder="Nhập mật khẩu"
              class="block w-full mt-2 rounded-md bg-white/5 text-base text-gray-900 outline-1 -outline-offset-1 outline-white/10 placeholder:text-gray-500 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-500 sm:text-sm/6"
              toggleMask
              :feedback="false"
            />

            <small v-if="errors.password" class="text-red-500">
              {{ errors.password }}
            </small>
          </div>

          <div class="mt-3">
            <Button
              @click="onRegister"
              class="flex w-full justify-center rounded-md bg-indigo-500 px-3 py-1.5 text-sm/6 font-semibold text-white hover:bg-indigo-400 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
            >
              Đăng Kí
            </Button>
            <small v-if="errors.general" class="text-red-500 text-sm">
              {{ errors.general }}
            </small>
            <p class="mt-10 text-center text-sm/6 text-gray-400">
              Quay về trang đăng nhập?
              <RouterLink
                to="/login"
                class="text-blue-500 font-medium hover:underline ml-1"
                >Đăng Nhập</RouterLink
              >
            </p>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useAuthStore } from "@/stores/authStore";
import router from "@/router";
import { validateRegister } from "@/validation/authSchema";

const username = ref("");
const email = ref("");
const password = ref("");
const errors = ref({});

async function onRegister() {
  errors.value = validateRegister({
    username: username.value,
    password: password.value,
    email: email.value,
  });

  if (Object.keys(errors.value).length === 0) {
    try {
      const auth = useAuthStore();
      await auth.registerAction(username.value, password.value, email.value);
      router.push("/login");
    } catch (error) {
      errors.value.general =
        error.response?.data?.message || "Đăng ký thất bại";
    }
  }
}
</script>

<style>
.p-invalid {
  border: 1px solid red !important;
}
</style>
