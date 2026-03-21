import express from 'express';
import { login, register } from '../controllers/authcontrollers.js';
import { protect } from '../middleware/auth.js';

const router = express.Router();

// Register
router.post('/register', register);

// Login
router.post('/login', login);

// Protected route - current user
router.get('/me', protect, (req, res) => {
    res.status(200).json({
        message: 'User data retrieved successfully',
        user: req.user
    });
});

export default router;