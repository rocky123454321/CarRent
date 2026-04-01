 import { create } from "zustand";
import axios from "axios";

import { toast } from "sonner"

const API_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5000/api/cars"
    : "/api/cars";

axios.defaults.withCredentials = true;

export const useCarStore = create((set) => ({
  cars: [],
  car: null,
  isLoading: false,
  error: null,
  message: null,
  searchQuery: "",                                              // ✅ add
  setSearchQuery: (query) => set({ searchQuery: query }),      // ✅ add

  getCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(API_URL);
      set({ cars: res.data, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching cars",
        isLoading: false,
      });
    }
  },

  getallcarsadmin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${API_URL}/admin/${id}`);
      set({ cars: res.data.cars, isLoading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error fetching admin cars",
        isLoading: false,
      });
    }
  },

  createCar: async (brand, model, year, color, pricePerDay, fuelType, transmission, licensePlate, isAvailable, uploadedBy) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(API_URL, {
        brand, model, year, color, pricePerDay,
        fuelType, transmission, licensePlate, isAvailable, uploadedBy,
      });
      set((state) => ({
        cars: [...state.cars, res.data.car],
        isLoading: false,
        message: "Car added successfully",
      }));
      toast.success("Car added successfully");
      return res.data;
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error creating car",
        isLoading: false,
      });
      throw error;
    }
  },

  updateCar: async (id, carData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${API_URL}/${id}`, carData);
      set((state) => ({
        cars: state.cars.map((car) => (car._id === id ? res.data.car : car)),
        isLoading: false,
        message: "Car updated successfully",
      }));
      toast.success("Car updated successfully"); // ✅ added toast
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error updating car",
        isLoading: false,
      });
      toast.error("Failed to update car"); // ✅ added toast
    }
  },

  deleteCar: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${API_URL}/${id}`);
      set((state) => ({
        cars: state.cars.filter((car) => car._id !== id),
        isLoading: false,
        message: "Car deleted successfully",
      }));
      toast.success("Car deleted successfully"); // ✅ added toast
    } catch (error) {
      set({
        error: error.response?.data?.message || "Error deleting car",
        isLoading: false,
      });
      toast.error("Failed to delete car"); // ✅ added toast
    }
  },

}));

