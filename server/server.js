import dotenv from 'dotenv';
dotenv.config(); 

import express from 'express';
import cors from 'cors';
import { connectDB } from './config/db.js';
import authRoutes from './routes/auth.js';

if (!process.env.MONGO_URI || !process.env.JWT_SECRET) {
    console.error('ERROR: Missing MONGO_URI or JWT_SECRET in .env file');
    process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());

// **CORS must come before routes**
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));

// Routes
app.use("/api/users", authRoutes);

// Connect to DB
await connectDB();

// Handle unhandled promise rejections
process.on('unhandledRejection', (err) => {
    console.error('UNHANDLED REJECTION:', err);
    process.exit(1);
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});