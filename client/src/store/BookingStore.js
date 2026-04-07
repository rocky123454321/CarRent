// src/store/BookingStore.js
import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";
const RENTAL  = `${API_URL}/api/users`;

axios.defaults.withCredentials = true;

export const useBookingStore = create((set, get) => ({

  // ── State ──
  rentals:       [],
  isLoading:     false,
  updating:      {}, // { [rentalId]: true/false }

  // ── Admin: fetch all rentals ──
  // GET /api/users/admin/rentals
  fetchRentals: async () => {
    if (get().isLoading) return;
    set({ isLoading: true });
    try {
      const res = await axios.get(`${RENTAL}/admin/rentals`, { withCredentials: true });
      set({ rentals: res.data.data || [], isLoading: false });
    } catch {
      set({ isLoading: false });
    }
  },

  // ── Admin: update rental status ──
  // PATCH /api/users/:rentalId/status
  updateStatus: async (rentalId, status) => {
    set((s) => ({ updating: { ...s.updating, [rentalId]: true } }));
    try {
      await axios.patch(`${RENTAL}/${rentalId}/status`, { status }, { withCredentials: true });
      toast.success("Status updated");
      // optimistic update
      set((s) => ({
        rentals: s.rentals.map((r) => r._id === rentalId ? { ...r, status } : r),
        updating: { ...s.updating, [rentalId]: false },
      }));
    } catch {
      toast.error("Failed to update status");
      set((s) => ({ updating: { ...s.updating, [rentalId]: false } }));
    }
  },

  // ── User: book a car ──
  // POST /api/users/:carId/rent
 // User: book a car
bookCar: async (carId, payload) => {
  try {
    // payload now includes totalDays and totalPrice
    const res = await axios.post(`${RENTAL}/${carId}/rent`, payload, { withCredentials: true });
    return { success: true, rental: res.data.rental };
  } catch (err) {
    const message = err.response?.data?.message || "Booking failed";
    toast.error(message);
    return { success: false, message };
  }
},
}));