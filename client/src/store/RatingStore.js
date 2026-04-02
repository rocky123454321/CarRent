import { create } from "zustand";
import axios from "axios";
import { toast } from "sonner";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

export const useRatingStore = create((set, get) => ({
  ratings: [],
  averageRating: 0,
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  submitting: false,

  // GET /api/ratings/:carId
  fetchRatings: async (carId, page = 1, limit = 10) => {
    if (!carId) return;
    set({ isLoading: true });
    try {
      const res = await axios.get(`${API_URL}/api/ratings/${carId}`, {
        params: { page, limit },
        withCredentials: true,
      });
      set({
        ratings:       res.data.data,
        averageRating: parseFloat(res.data.averageRating.toFixed(1)),
        total:         res.data.total,
        page:          res.data.page,
        pages:         res.data.pages,
      });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load reviews");
    } finally {
      set({ isLoading: false });
    }
  },

  // POST /api/ratings  — expects { carId, rating, review }
  submitReview: async (carId, rating, review = "") => {
    set({ submitting: true });
    try {
      const res = await axios.post(
        `${API_URL}/api/ratings`,
        { carId, rating, review },
        { withCredentials: true }
      );
      toast.success("Review submitted!");

      // Re-fetch para ma-update yung list at average
      await get().fetchRatings(carId);
      return true;
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to submit review");
      return false;
    } finally {
      set({ submitting: false });
    }
  },

  // Reset store kapag nag-unmount o nag-navigate away
  reset: () => set({
    ratings:       [],
    averageRating: 0,
    total:         0,
    page:          1,
    pages:         1,
    isLoading:     false,
    submitting:    false,
  }),
}));