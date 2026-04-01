import express from "express";
import { addRating, getCarRatings } from "../controllers/ratingsController.js";
import { verifyToken } from '../middleware/verifyToken.js';

const router = express.Router();
//==
// POST rating: expects { carId, rating, review } in body
router.post("/", verifyToken, addRating);

// GET ratings for a specific car: /api/ratings/:carId?page=1&limit=10
router.get("/:carId", getCarRatings);

export default router;