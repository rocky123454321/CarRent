import express from 'express';
import {
  getUserRentals,
  rentCar,
  adminGetAllRentals,
  updateRentalStatus
} from '../controllers/rental.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router({ mergeParams: true });

// User: get own rentals  →  GET /api/users/my-rentals
router.get('/my-rentals', verifyToken, getUserRentals);

// User: rent a car  →  POST /api/users/:carId/rent
router.post('/:carId/rent', verifyToken, rentCar);

// Admin: all rentals  →  GET /api/users/admin/rentals
router.get('/admin/rentals', verifyToken, adminGetAllRentals);

// Admin: update rental status  →  PATCH /api/users/:id/status
router.patch('/:id/status', verifyToken, updateRentalStatus);

export default router;