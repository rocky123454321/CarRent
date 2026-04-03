import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner"; // O kahit anong notification library na gamit mo

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

axios.defaults.withCredentials = true;

export const useAdminCarStore = create((set, get) => ({
  cars: [],
  isLoading: false,
  error: null,

  // 1. GET Admin's own cars
  getAdminCars: async (adminId) => {
    if (!adminId) return;
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/api/cars/admin/${adminId}`);
      set({ cars: res.data.cars || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load admin cars", isLoading: false });
    }
  },

  // 2. CREATE /api/cars — Add new car
  createCar: async (carData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(`${API_URL}/api/cars`, carData);
      set((state) => ({
        cars: [...state.cars, res.data.car],
        isLoading: false,
      }));
      toast.success("Car added successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to add car";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw err;
    }
  },

  // 3. DELETE /api/cars/:id
  deleteCar: async (id) => {
    try {
      await axios.delete(`${API_URL}/api/cars/${id}`);
      set((state) => ({
        cars: state.cars.filter((c) => c._id !== id)
      }));
      toast.success("Car deleted successfully");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete car");
      console.error("Delete error:", err);
    }
  },

  // 4. PUT /api/cars/:id — General update
  updateCar: async (id, updates) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${API_URL}/api/cars/${id}`, updates);
      set((state) => ({
        cars: state.cars.map((c) => (c._id === id ? res.data.car || { ...c, ...updates } : c)),
        isLoading: false,
      }));
      toast.success("Car updated successfully!");
      return res.data;
    } catch (err) {
      const msg = err.response?.data?.message || "Failed to update car";
      set({ error: msg, isLoading: false });
      toast.error(msg);
      throw err;
    }
  },

  // 5. Toggle Availability (Utility)
  toggleAvailability: async (id, isAvailable) => {
    await get().updateCar(id, { isAvailable });
  },

  // 6. Old fetch all cars (deprecated)
  fetchAdminCars: async () => {
    if (get().isLoading) return;
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/api/cars`);
      set({ cars: res.data || [], isLoading: false });
    } catch (err) {
      set({ error: err.response?.data?.message || "Failed to load cars", isLoading: false });
    }
  }
}));