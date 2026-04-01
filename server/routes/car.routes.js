import express from 'express';
import {
  addCar, updateCar, deleteCar, getAllCarbyAdmin,
  Settings, getAllCars, getCarById, rentCar, returnCar
} from '../controllers/cars.controller.js';
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
//==
// ── USER ROUTES ──────────────────────────────────
router.get('/', getAllCars);                          // GET  /api/cars
router.post('/:id/rent', verifyToken, rentCar);      // POST /api/cars/:id/rent
router.post('/:id/return', verifyToken, returnCar);  // POST /api/cars/:id/return

// ── ADMIN ROUTES ─────────────────────────────────
router.post('/', verifyToken, addCar);               // POST /api/cars
router.put('/:id', verifyToken, updateCar);          // PUT  /api/cars/:id
router.delete('/:id', verifyToken, deleteCar);       // DELETE /api/cars/:id

// Delete own account (user settings)
router.delete('/delete/:id', verifyToken, Settings); // DELETE /api/cars/delete/:id

// !! IMPORTANT: specific paths BEFORE wildcard /:id !!
// GET admin cars by uploader id  →  /api/cars/admin/:adminId
router.get('/admin/:adminId', verifyToken, getAllCarbyAdmin);

// GET single car by id  →  /api/cars/:id
router.get('/:id', getCarById);

export default router;