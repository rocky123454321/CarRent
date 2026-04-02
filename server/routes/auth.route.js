import express from 'express'
import {
  signup, login, logout, verifyEmail, checkAuth,
  resendVerificationEmail, forgotPassword, resetPassword,
  Delete, getAdminId, updateProfile, getUserById
} from '../controllers/auth.controller.js'
import { verifyToken } from '../middleware/verifyToken.js'

const router = express.Router();

router.get("/check-auth", verifyToken, checkAuth);
router.get("/admin-id", verifyToken, getAdminId);
router.get("/user/:id", verifyToken, getUserById);   // ✅ NEW — fetch any user by id

router.post('/signup', signup);
router.post('/login', login);
router.post('/logout', logout);
router.post("/verify-email", verifyEmail);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);
router.post("/resend-verification", verifyToken, resendVerificationEmail);

router.patch('/profile', verifyToken, updateProfile);
router.delete('/delete/me', verifyToken, Delete);

export default router;