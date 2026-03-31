import express from "express";
import { addRating, getCarRatings } from "../controllers/ratingsController.js";
import {verifyToken} from '../middleware/verifyToken.js' // your auth middleware

const router = express.Router();

router.post("/", verifyToken, addRating);           // POST /api/ratings
router.get("/:carId", getCarRatings);           // GET  /api/ratings/:carId

export default router;