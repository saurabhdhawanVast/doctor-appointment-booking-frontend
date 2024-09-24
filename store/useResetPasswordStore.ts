"use client";
import { create } from "zustand";
import { toast } from "react-toastify";

interface ResetPasswordState {
  loading: boolean;
  error: string | null;
  resetPassword: (newPassword: string, resetToken: string) => Promise<void>;
}

const useResetPasswordStore = create<ResetPasswordState>((set) => ({
  loading: false,
  error: null,

  resetPassword: async (newPassword, resetToken) => {
    set({ loading: true, error: null });



    try {
      const response = await fetch(
        "http://localhost:3000/auth/reset-password",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newPassword,
            resetToken,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to reset password");
      }

      toast.success("Password has been successfully reset.");
      window.location.href = "/login"; // Redirect on success
    } catch (error) {
      if (error instanceof Error) {
        set({ error: error.message });
        toast.error(error.message);
      } else {
        set({ error: "An unexpected error occurred." });
        toast.error("An unexpected error occurred.");
      }
    } finally {
      set({ loading: false });
    }
  },
}));

export default useResetPasswordStore;
