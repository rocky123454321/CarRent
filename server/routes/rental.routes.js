// rental.routes.js
import express from 'express';
import {
  getUserRentals,
  rentCar,
  adminGetAllRentals,
  updateRentalStatus,
  deleteRental // Siguraduhin na i-import mo ito kung gagawa ka ng bago
} from '../controllers/rental.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router({ mergeParams: true });

router.get('/my-rentals', verifyToken, getUserRentals);
router.post('/:carId/rent', verifyToken, rentCar);
router.get('/admin/rentals', verifyToken, adminGetAllRentals);

// PATCH /api/users/:id/status -> Ito ang ginagamit mo sa Cancel at Admin update
// Siguraduhin na ang updateRentalStatus controller ay handle ang parehong Admin at User logic
router.patch('/:id/status', verifyToken, updateRentalStatus);

// DELETE /api/users/:id -> ITO ANG KULANG KAYA KA NAG-404
router.delete('/:id', verifyToken, deleteRental); 

export default router;