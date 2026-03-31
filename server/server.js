import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './db/connectDb.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";
import carRoutes from "./routes/car.routes.js";
import ratingRoutes from "./routes/ratingRoutes.js";
dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin:["http://localhost:5173", "http://localhost:5174"],
  credentials: true
}));

// 1️⃣ Parse JSON bodies BEFORE routes
app.use(express.json());
app.use(cookieParser()); 

// 2️⃣ Mount routes
app.use("/api/auth", authRoutes);
app.use("/api/users", carRoutes)
app.use("/api/ratings", ratingRoutes);
await connectDb();
// 3️⃣ Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
