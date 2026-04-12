import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  createPromo,
  deletePromo,
  getPromos,
  updatePromo,
} from "../controllers/promos.controller.js";

const router = express.Router();

router.get("/", getPromos);
router.post("/", verifyToken, createPromo);
router.put("/:id", verifyToken, updatePromo);
router.delete("/:id", verifyToken, deletePromo);

export default router;
