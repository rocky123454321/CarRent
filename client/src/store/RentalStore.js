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
      const currentUpdating = get().updating;
      const { [rentalId]: _, ...rest } = currentUpdating;
      set({ updating: rest });
    }
  },

  // CANCEL RENTAL
  cancelRental: async (rentalId) => {
    try {
      await axios.patch(`${RENTAL}/${rentalId}/status`, 
        { status: 'cancelled' }, 
        { withCredentials: true }
      );
      
      set((state) => ({
        userRentals: state.userRentals.map(r => 
          r._id === rentalId ? { ...r, status: 'cancelled' } : r
        )
      }));
      
      toast.success("Rental cancelled successfully");
      return { success: true };
    } catch (err) {
      console.error("Cancel Error:", err.response?.data);
      const msg = err.response?.data?.message || "Failed to cancel rental";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },

  // DELETE RENTAL
  deleteRental: async (rentalId) => {
    try {
      await axios.delete(`${RENTAL}/${rentalId}`, { withCredentials: true });
      
      set((state) => ({
        userRentals: state.userRentals.filter(r => r._id !== rentalId),
        adminRentals: state.adminRentals.filter(r => r._id !== rentalId)
      }));

      toast.success("Rental record deleted");
      return { success: true };
    } catch (err) {
      console.error("Delete Error:", err);
      const msg = err.response?.data?.message || "Failed to delete rental";
      toast.error(msg);
      return { success: false, message: msg };
    }
  },
}));