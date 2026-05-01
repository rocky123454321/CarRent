import express from 'express';
import {
  addCar, updateCar, deleteCar, getAllCarbyAdmin,
  Settings, getAllCars, getCarById, rentCar, returnCar,
  expirePromo
} from '../controllers/cars.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// ── SPECIFIC PATHS FIRST (before any /:id wildcard) ──────────────

// Admin: get all cars by admin
router.get('/admin/:adminId', verifyToken, getAllCarbyAdmin);

// ── USER ROUTES ───────────────────────────────────────────────────

// Get all cars (public)
router.get('/', getAllCars);

// Rent / return a car
router.post('/:id/rent',   verifyToken, rentCar);
router.post('/:id/return', verifyToken, returnCar);

// Expire promo (specific action before wildcard GET /:id)
router.patch('/:id/expire-promo', verifyToken, expirePromo);

// Get single car by ID (wildcard — must come AFTER all specific GET routes)
router.get('/:id', getCarById);

// ── ADMIN ROUTES ──────────────────────────────────────────────────

// Add a new car
router.post(
  '/',
  verifyToken,
  upload.fields([
    { name: 'image',  maxCount: 1 },
    { name: 'images', maxCount: 2 },
  ]),
  addCar
);

// Update a car
router.put('/:id', verifyToken, upload.single('image'), updateCar);

// Delete by specific path BEFORE wildcard DELETE /:id
router.delete('/delete/:id', verifyToken, Settings);

// Delete by ID (wildcard — must come AFTER /delete/:id)
router.delete('/:id', verifyToken, deleteCar);

export default router;