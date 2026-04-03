import { create } from "zustand";
import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.defaults.withCredentials = true;

export const useAdminCarStore = create((set, get) => ({
  cars: [],
  isLoading: false,
  error: null,

  // GET /api/cars  — all cars for admin view
  fetchAdminCars: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/api/cars`, { withCredentials: true });
      set({ cars: res.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load cars", isLoading: false });
    }
  },

  // DELETE /api/cars/:id
  deleteCar: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/cars/${id}`, { withCredentials: true });
      set((state) => ({ cars: state.cars.filter((c) => c._id !== id) }));
    } catch (err) {
      console.error("Failed to delete car:", err);
    }
  },

  // PATCH /api/cars/:id — toggle availability
  toggleAvailability: async (id, isAvailable) => {
    try {
      const res = await axios.put(`${API_URL}/api/cars/${id}`, { isAvailable }, { withCredentials: true });
      set((state) => ({
        cars: state.cars.map((c) => c._id === id ? { ...c, isAvailable: res.data.car?.isAvailable } : c),
      }));
    } catch (err) {
      console.error("Failed to update availability:", err);
    }
  },
}));