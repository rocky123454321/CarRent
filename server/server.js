import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import { connectDb } from './db/connectDb.js';
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.route.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// 1️⃣ Parse JSON bodies BEFORE routes
app.use(express.json());
app.use(cookieParser()); 

// 2️⃣ Mount routes
app.use("/api/auth", authRoutes);

// 3️⃣ Start server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
connectDb();