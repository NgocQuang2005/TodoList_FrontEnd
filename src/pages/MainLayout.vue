<template>
  <div class="main-layout min-h-screen bg-gray-50">
    <!-- Header -->
    <header
      class="sticky top-0 z-40 bg-white shadow-sm border-b border-gray-200"
    >
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo/Title -->
          <div class="flex items-center">
            <div class="flex-shrink-0">
              <h1
                class="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2"
              >
                <RouterLink to="/">
                  <i class="pi pi-check-circle text-blue-600"></i>
                  <span class="hidden sm:inline">My Todo App</span>
                  <span class="sm:hidden">Todo</span>
                </RouterLink>
              </h1>
            </div>
          </div>

          <!-- User Menu -->
          <div class="relative">
            <Button
              @click="toggleUserMenu"
              class="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors duration-200 hover:bg-gray-50 border border-gray-200"
              text
              severity="secondary"
            >
              <Avatar
                :label="getUserInitials(userName)"
                class="w-8 h-8 text-sm"
                shape="circle"
                style="
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                  color: white;
                  width: 20px !important;
                  height: 20px;
                "
              />
              <span
                class="hidden sm:inline text-sm font-medium text-gray-700"
                >{{ userName }}</span
              >
              <i
                class="pi pi-chevron-down text-xs text-gray-500 transition-transform duration-200"
                :class="{ 'rotate-180': showUserMenu }"
              ></i>
            </Button>

            <!-- Dropdown Menu -->
            <div
              v-if="showUserMenu"
              class="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-2"
              @click.stop
            >
              <!-- User Info -->
              <div class="px-4 py-3 border-b border-gray-100">
                <div class="flex items-center gap-3">
                  <Avatar
                    :label="getUserInitials(userName)"
                    class="w-10 h-10"
                    shape="circle"
                    style="
                      background: linear-gradient(
                        135deg,
                        #667eea 0%,
                        #764ba2 100%
                      );
                      color: white;
                      width: 30px !important;
                      height: 30px;
                    "
                  />
                  <div>
                    <p class="text-sm font-medium text-gray-900">
                      {{ userName }}
                    </p>
                    <p class="text-xs text-gray-500">{{ email }}</p>
                  </div>
                </div>
              </div>

              <!-- Menu Items -->
              <div class="py-1">
                <button
                  @click="viewProfile"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <i class="pi pi-user text-gray-400"></i>
                  <span>Xem thông tin</span>
                </button>

                <button
                  @click="changePassword"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors duration-150"
                >
                  <i class="pi pi-key text-gray-400"></i>
                  <span>Đổi mật khẩu</span>
                </button>

                <div class="border-t border-gray-100 my-1"></div>

                <button
                  @click="logoutApp"
                  class="w-full flex items-center gap-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors duration-150"
                >
                  <i class="pi pi-sign-out text-red-500"></i>
                  <span>Đăng xuất</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div
        class="bg-white rounded-lg shadow-sm border border-gray-200 min-h-[calc(100vh-8rem)]"
      >
        <RouterView />
      </div>
    </main>

    <!-- Mobile Menu Backdrop -->
    <div
      v-if="showUserMenu"
      @click="showUserMenu = false"
      class="fixed inset-0 z-30 bg-black bg-opacity-25 sm:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import { useRouter } from "vue-router";
import { logout } from "@/services/authService";
import { useUserStore } from "@/stores/userStore";

const router = useRouter();
const userStore = useUserStore();

const showUserMenu = ref(false);

const userName = ref(""); // thay cho hardcode
const email = ref(""); // thay cho hardcode

function toggleUserMenu() {
  showUserMenu.value = !showUserMenu.value;
}

function getUserInitials(name) {
  return name
    ? name
        .split(" ")
        .map((word) => word.charAt(0))
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";
}

async function fetchUserInfo() {
  try {
    const data = await userStore.getUserDetail();
    console.log(data);
    userName.value = data.username || "Người dùng";
    email.value = data.email || "user@gmail.com";
  } catch (err) {
    console.error("Không lấy được thông tin user:", err);
  }
}

function logoutApp() {
  logout();
  router.push("/login");
  showUserMenu.value = false;
}

function viewProfile() {
  router.push("/profile"); // tạo trang profile riêng
  showUserMenu.value = false;
}

function changePassword() {
  router.push("/change-password"); // tạo trang đổi mật khẩu
  showUserMenu.value = false;
}

// Close menu when clicking outside
function handleClickOutside(event) {
  if (showUserMenu.value && !event.target.closest(".relative")) {
    showUserMenu.value = false;
  }
}

onMounted(() => {
  fetchUserInfo();
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

<style scoped>
/* Custom scrollbar for dropdown */
.dropdown-menu::-webkit-scrollbar {
  width: 4px;
}

.dropdown-menu::-webkit-scrollbar-track {
  background: #f1f1f1;
}

.dropdown-menu::-webkit-scrollbar-thumb {
  background: #c1c1c1;
  border-radius: 2px;
}

.dropdown-menu::-webkit-scrollbar-thumb:hover {
  background: #a8a8a8;
}

/* Smooth transitions */
.transition-all {
  transition: all 0.2s ease-in-out;
}

/* Mobile menu animation */
@media (max-width: 640px) {
  .absolute {
    position: fixed !important;
    right: 1rem !important;
    top: 4rem !important;
    left: 1rem !important;
    width: auto !important;
  }
}
</style>
