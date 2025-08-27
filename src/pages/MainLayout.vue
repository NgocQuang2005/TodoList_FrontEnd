<template>
  <div class="main-layout p-4">
    <!-- Header -->
    <header class="mb-4 flex justify-between items-center border-b pb-2">
      <h1 class="text-2xl font-bold">My Todo App</h1>
      <button class="p-button p-component p-button-text" @click="logoutApp">
        <i class="pi pi-sign-out"></i> Logout
      </button>
    </header>

    <!-- Main content -->
    <main>
      <RouterView/>
    </main>
  </div>
</template>

<script setup>
import { logout } from "@/services/authService";
import { useRouter } from "vue-router";

const router = useRouter();

function logoutApp() {
  logout();
  router.push("/login");
}
</script>

<style scoped>
.main-layout {
  max-width: 800px;
  margin: 0 auto;
}
</style>
