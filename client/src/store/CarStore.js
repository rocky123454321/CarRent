import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const CARS = `${API_URL}/api/cars`;

axios.defaults.withCredentials = true;

export const useCarStore = create((set) => ({
  cars: [],
  car: null,
  isLoading: false,
  error: null,
  message: null,
  searchQuery: "",
  setSearchQuery: (query) => set({ searchQuery: query }),

  // GET /api/cars
  getCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(CARS);
      set({ cars: res.data, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching cars", isLoading: false });
    }
  },

  // GET /api/cars/admin/:id
  getallcarsadmin: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${CARS}/admin/${id}`);
      set({ cars: res.data.cars, isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching admin cars", isLoading: false });
    }
  },

  // POST /api/cars
  createCar: async (brand, model, year, color, pricePerDay, fuelType, transmission, licensePlate, isAvailable, uploadedBy) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.post(CARS, {
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
      set({ error: error.response?.data?.message || "Error creating car", isLoading: false });
      throw error;
    }
  },

  // PUT /api/cars/:id
  updateCar: async (id, carData) => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.put(`${CARS}/${id}`, carData);
      set((state) => ({
        cars: state.cars.map((car) => (car._id === id ? res.data.car : car)),
        isLoading: false,
        message: "Car updated successfully",
      }));
      toast.success("Car updated successfully");
    } catch (error) {
      set({ error: error.response?.data?.message || "Error updating car", isLoading: false });
      toast.error("Failed to update car");
    }
  },

  // DELETE /api/cars/:id
  deleteCar: async (id) => {
    set({ isLoading: true, error: null });
    try {
      await axios.delete(`${CARS}/${id}`);
      set((state) => ({
        cars: state.cars.filter((car) => car._id !== id),
        isLoading: false,
        message: "Car deleted successfully",
      }));
      toast.success("Car deleted successfully");
    } catch (error) {
      set({ error: error.response?.data?.message || "Error deleting car", isLoading: false });
      toast.error("Failed to delete car");
    }
  },

  // GET /api/cars/admin (for admin cars list)
  getAdminCars: async () => {
    set({ isLoading: true, error: null });
    try {
      const res = await axios.get(`${CARS}/admin`, { withCredentials: true });
      set({ cars: res.data.data || res.data.cars || [], isLoading: false });
    } catch (error) {
      set({ error: error.response?.data?.message || "Error fetching admin cars list", isLoading: false });
    }
  },
}));