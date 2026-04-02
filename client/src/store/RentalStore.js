import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";


axios.defaults.withCredentials = true;

export const useRentalStore = create((set, get) => ({
  userRentals: [],
  adminRentals: [],
  isLoading: false,
  updating: {},

  fetchUserRentals: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/my-rentals`, { withCredentials: true });
      set({ userRentals: res.data.data || [], isLoading: false });
    } catch {
      toast.error('Failed to load your rentals');
      set({ isLoading: false });
    }
  },

  fetchAdminRentals: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/admin/rentals`, { withCredentials: true });
      set({ adminRentals: res.data.data || [], isLoading: false });
    } catch {
      toast.error('Failed to load admin rentals');
      set({ isLoading: false });
    }
  },

  updateRentalStatus: async (rentalId, status) => {
    const prev = get().updating;
    set({ updating: { ...prev, [rentalId]: true } });
    try {
      await axios.patch(`${API_URL}/${rentalId}/status`, { status }, { withCredentials: true });
      toast.success('Status updated');
      get().fetchAdminRentals();
    } catch {
      toast.error('Failed to update status');
    } finally {
      set({ updating: { ...prev, [rentalId]: false } });
    }
  },
}));
