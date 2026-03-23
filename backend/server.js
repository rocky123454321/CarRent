import express from 'express';
import dotenv from 'dotenv';
import { connectDb } from './db/connectDb.js';
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// 1️⃣ Parse JSON bodies BEFORE routes
app.use(express.json());

// 2️⃣ Mount routes
app.use("/api/auth", authRoutes);

// 3️⃣ Start server
app.listen(PORT, () => {
    connectDb();
    console.log(`Server is running on port ${PORT}`);
});