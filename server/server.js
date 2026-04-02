import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import { connectDb } from './db/connectDb.js';  // ✅ lowercase d, named export       // ✅ your actual path
import { initSocket } from './socket.js';

import authRoutes from './routes/auth.route.js';         // ✅ your actual path
import carRoutes from './routes/car.routes.js';
import rentalRoutes from './routes/rental.routes.js';
import ratingRoutes from './routes/ratingRoutes.js';

dotenv.config();

const app = express();
const httpServer = createServer(app);

const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:5173',
].filter(Boolean);

const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true
  }
});

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/cars', carRoutes);
app.use('/api/users', rentalRoutes);
app.use('/api/ratings', ratingRoutes);

initSocket(io);

const PORT = process.env.PORT || 5000;

connectDb().then(() => {
  httpServer.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});