import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const PROMOS = `${API_URL}/api/promos`;
const EXPLORE = `${API_URL}/api/explore`;

axios.defaults.withCredentials = true;

export const usePromoStore = create((set) => ({
  promos: [],
  exploreCars: [],
  isLoading: false,
  isSubmitting: false,
  error: null,

  fetchPromos: async (params = {}) => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(PROMOS, { params });
      set({
        promos: Array.isArray(response.data?.promos) ? response.data.promos : [],
        isLoading: false,
      });
      return response.data?.promos || [];
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch promos";
      set({ isLoading: false, error: message });
      return [];
    }
  },

  fetchExploreCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await axios.get(EXPLORE);
      set({
        exploreCars: Array.isArray(response.data?.cars) ? response.data.cars : [],
        isLoading: false,
      });
      return response.data?.cars || [];
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch explore cars";
      set({ isLoading: false, error: message });
      return [];
    }
  },

  createPromo: async (payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.post(PROMOS, payload, { withCredentials: true });
      set((state) => ({
        promos: [response.data.promo, ...state.promos.filter((promo) => promo._id !== response.data.promo?._id)],
        isSubmitting: false,
      }));
      toast.success("Promo created successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to create promo";
      set({ isSubmitting: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  updatePromo: async (id, payload) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.put(`${PROMOS}/${id}`, payload, { withCredentials: true });
      set((state) => ({
        promos: state.promos.map((promo) => (promo._id === id ? response.data.promo : promo)),
        isSubmitting: false,
      }));
      toast.success("Promo updated successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to update promo";
      set({ isSubmitting: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  deletePromo: async (id) => {
    set({ isSubmitting: true, error: null });
    try {
      const response = await axios.delete(`${PROMOS}/${id}`, { withCredentials: true });
      set((state) => ({
        promos: state.promos.filter((promo) => promo._id !== id),
        isSubmitting: false,
      }));
      toast.success("Promo deleted successfully");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to delete promo";
      set({ isSubmitting: false, error: message });
      toast.error(message);
      throw error;
    }
  },

  clearPromoError: () => set({ error: null }),
}));
