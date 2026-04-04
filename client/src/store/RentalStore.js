import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RENTAL = `${API_URL}/api/users`;

axios.defaults.withCredentials = true;

export const useRentalStore = create((set, get) => ({
  userRentals: [],
  adminRentals: [],
  isLoading: false,
  updating: {},

  // GET /api/users/my-rentals
  fetchUserRentals: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${RENTAL}/my-rentals`, { withCredentials: true });
      set({ userRentals: res.data.data || [], isLoading: false });
    } catch {
      toast.error('Failed to load your rentals');
      set({ isLoading: false });
    }
  },

  // GET /api/users/admin/rentals
  fetchAdminRentals: async () => {
    set({ isLoading: true });
    try {
      const res = await axios.get(`${RENTAL}/admin/rentals`, { withCredentials: true });
      set({ adminRentals: res.data.data || [], isLoading: false });
    } catch {
      toast.error('Failed to load admin rentals');
      set({ isLoading: false });
    }
  },

  // PATCH /api/users/:rentalId/status
  updateRentalStatus: async (rentalId, status) => {
    const prev = get().updating;
    set({ updating: { ...prev, [rentalId]: true } });
    try {
      await axios.patch(`${RENTAL}/${rentalId}/status`, { status }, { withCredentials: true });
      toast.success('Status updated');
      get().fetchAdminRentals();
    } catch {
      toast.error('Failed to update status');
    } finally {
      set({ updating: { ...prev, [rentalId]: false } });
    }
  },// Add these inside your create((set, get) => ({ ... }))
// RentalStore.js

cancelRental: async (rentalId) => {
  try {
    // Siguraduhing tugma ang URL: /api/users/:id/status
    const res = await axios.patch(`${RENTAL}/${rentalId}/status`, 
      { status: 'cancelled' }, 
      { withCredentials: true }
    );
    
    // Optimistic Update sa UI
    set((state) => ({
      userRentals: state.userRentals.map(r => 
        r._id === rentalId ? { ...r, status: 'cancelled' } : r
      )
    }));
    
    return { success: true };
  } catch (err) {
    console.error("Cancel Error:", err.response?.data);
    return { 
      success: false, 
      message: err.response?.data?.message || "Failed to cancel rental" 
    };
  }
},
  deleteRental: async (rentalId) => {
    try {
      // Gamitin ang RENTAL variable na na-define mo na sa taas
      await axios.delete(`${RENTAL}/${rentalId}`, { withCredentials: true });
      
      set((state) => ({
        userRentals: state.userRentals.filter(r => r._id !== rentalId)
      }));
      return { success: true };
    } catch (err) {
      console.error("Delete Error:", err); // Para makita mo ang buong error
      return { success: false, message: err.response?.data?.message || "Route not found" };
    }
  },
}));


