import { defineStore } from "pinia";
import {
  getUserLoginDeltail,
  changePassword,
  editUser,
  forgotPassword,
  resetPassword,
} from "@/services/userService";

export const useUserStore = defineStore("user", {
  state: () => ({
    userInfo: null,
  }),
  actions: {
    async getUserDetail() {
      try {
        const res = await getUserLoginDeltail();
        this.userInfo = res.data;
        return res.data;
      } catch (error) {
        console.error("Lấy thông tin user thất bại:", error);
        this.userInfo = null;
        throw error;
      }
    },
    async updateUser(data) {
      try {
        const res = await editUser(data);
        this.userInfo = res.data;
        return res.data;
      } catch (error) {
        console.error("Cập nhật user thất bại:", error);
        throw error;
      }
    },
    async changeUserPassword(data) {
      try {
        const res = await changePassword(data);
        return res.data;
      } catch (error) {
        console.error("Đổi mật khẩu thất bại:", error);
        throw error;
      }
    },
    async forgotUserPassword(email) {
      try {
        const res = await forgotPassword({ email });
        return res.data;
      } catch (error) {
        console.error("Gửi email quên mật khẩu thất bại:", error);
        throw error;
      }
    },
    async resetUserPassword(data) {
      try {
        const res = await resetPassword(data);
        return res.data;
      } catch (error) {
        console.error("Reset mật khẩu thất bại:", error);
        throw error;
      }
    },
  },
});
