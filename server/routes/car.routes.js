import express from 'express';
import { 
  addCar, updateCar, deleteCar,getAllCarbyAdmin,Settings, getAllCars, getCarById, rentCar, returnCar 
} from '../controllers/cars.controller.js';
import {verifyToken} from '../middleware/verifyToken.js'

const router = express.Router();

// ADMIN ROUTES 
router.post('/', addCar);
router.put('/:id', updateCar);
router.delete('/:id', deleteCar);
router.get('/:id', getAllCarbyAdmin);

// USER ROUTES
router.get('/', getAllCars);
router.get('/:id', getCarById);
router.post('/:id/rent', rentCar);
router.post('/:id/return', returnCar);
router.delete('/delete/:id', verifyToken, Settings);

export default router;   