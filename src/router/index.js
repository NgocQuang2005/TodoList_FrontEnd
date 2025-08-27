import Login from "@/pages/Login.vue";
import Register from "@/pages/Register.vue";
import TodoList from "@/pages/TodoList.vue";
import MainLayout from "@/pages/MainLayout.vue";
import { createRouter, createWebHistory } from "vue-router";
import ForgotPassword from "@/pages/ForgotPassword.vue";

const routes = [
  // sử dụng: meta: { requiresAuth: false }, ==> Route này bắt buộc login
  {
    path: "/login",
    name: "Login",
    component: Login,
    meta: { requiresAuth: false },
  },
  {
    path: "/register",
    name: "Register",
    component: Register,
    meta: { requiresAuth: false },
  },
  {
    path: "/forgot-password",
    name: "ForgotPassword",
    component: ForgotPassword,
    meta: { requiresAuth: false },
  },
  {
    path: "/",
    component: MainLayout, // layout chính
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "todos",
      },
      {
        path: "todos",
        name: "Todos",
        component: TodoList,
      },
      // bạn có thể thêm các trang khác cũng dùng layout này
    ],
  },
  // default router
  {
    path: "/:pathMatch(.*)*",
    redirect: "/login",
  },
];
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("tokenTodo");
  if (to.meta.requiresAuth && !token) {
    next("/login");
  } else if ((to.path === "/login" || to.path === "/register") && token) {
    next("/todos");
  } else {
    next();
  }
});
export default router;
