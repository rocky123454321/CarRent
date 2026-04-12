import express from "express";
import { getExploreCars } from "../controllers/promos.controller.js";

const router = express.Router();

router.get("/", getExploreCars);

export default router;
