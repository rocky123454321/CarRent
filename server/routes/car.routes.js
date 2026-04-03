import express from 'express';
import {
  addCar, updateCar, deleteCar, getAllCarbyAdmin,
  Settings, getAllCars, getCarById, rentCar, returnCar
} from '../controllers/cars.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';
import { upload } from '../config/cloudinary.js';

const router = express.Router();

// ── USER ROUTES ──────────────────────────────────
router.get('/', getAllCars);
router.post('/:id/rent',    verifyToken, rentCar);
router.post('/:id/return',  verifyToken, returnCar);

// ── ADMIN ROUTES ─────────────────────────────────
router.post('/',    verifyToken, upload.single('image'), addCar);    // ✅ may upload
router.put('/:id',  verifyToken, upload.single('image'), updateCar); // ✅ may upload
router.delete('/:id', verifyToken, deleteCar);
router.delete('/delete/:id', verifyToken, Settings);

// !! specific paths BEFORE wildcard /:id !!
router.get('/admin/:adminId', verifyToken, getAllCarbyAdmin);
router.get('/:id', getCarById);

export default router;