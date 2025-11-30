import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { loginUser, logoutUser, googleAuth, googleCallback } from '../controllers/authController.js';

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Login with email and password
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Logged in successfully
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', loginUser);

/**
 * @openapi
 * /api/auth/logout:
 *   post:
 *     summary: Logout current user
 *     tags:
 *       - Auth
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logged out
 */
router.post('/logout', verifyToken, logoutUser);

/**
 * @openapi
 * /api/auth/google:
 *   get:
 *     summary: Start Google OAuth flow (not yet configured)
 *     tags:
 *       - Auth
 *     responses:
 *       501:
 *         description: Not implemented
 */
router.get('/google', googleAuth);

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback (not yet configured)
 *     tags:
 *       - Auth
 *     responses:
 *       501:
 *         description: Not implemented
 */
router.get('/google/callback', googleCallback);

export default router;
