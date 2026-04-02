import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const AUTH = `${API_URL}/api/auth`;

axios.defaults.withCredentials = true;

export const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  error: null,
  isLoading: false,
  isCheckingAuth: true,
  message: null,

  signup: async (email, password, name) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH}/signup`, { email, password, name });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error signing up", isLoading: false });
      throw error;
    }
  },

  login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH}/login`, { email, password });
      set({ isAuthenticated: true, user: response.data.user, error: null, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
      throw error;
    }
  },

  logout: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.post(`${AUTH}/logout`);
      set({ user: null, isAuthenticated: false, error: null, isLoading: false });
    } catch (error) {
      set({ error: "Error logging out", isLoading: false });
      throw error;
    }
  },

  verifyEmail: async (code) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH}/verify-email`, { code });
      set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      return response.data;
    } catch (error) {
      set({ error: error.response?.data?.message || "Error verifying email", isLoading: false });
      throw error;
    }
  },

  checkAuth: async () => {
    set({ isCheckingAuth: true, error: null });
    try {
      const response = await axios.get(`${AUTH}/check-auth`);
      set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false });
    } catch (error) {
      set({ error: null, isCheckingAuth: false, isAuthenticated: false });
    }
  },

  forgotPassword: async (email) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH}/forgot-password`, { email });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error sending reset password email" });
      throw error;
    }
  },

  resetPassword: async (token, password) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.post(`${AUTH}/reset-password/${token}`, { password });
      set({ message: response.data.message, isLoading: false });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Error resetting password" });
      throw error;
    }
  },

  resendVerificationEmail: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${AUTH}/resend-verification`);
      set({ isLoading: false });
      return res.data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Failed to resend" });
      throw error;
    }
  },

  updateProfile: async ({ name, email, password }) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.patch(`${AUTH}/profile`, { name, email, password });
      set({ user: response.data.user, isLoading: false, error: null });
      return response.data;
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Failed to update profile" });
      throw error;
    }
  },

  deleteAccount: async () => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${AUTH}/delete/me`);
      set({ user: null, isAuthenticated: false, isLoading: false, error: null });
    } catch (error) {
      set({ isLoading: false, error: error.response?.data?.message || "Failed to delete account" });
      throw error;
    }
  },
}));