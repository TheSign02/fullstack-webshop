import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import passport from 'passport';
import { loginUser, logoutUser } from '../controllers/authController.js';
import { generateToken } from '../utils/token.js';
import { isGoogleOAuthConfigured } from '../config/passport.js';

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
 *     summary: Start Google OAuth flow
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to Google
 */

/**
 * @openapi
 * /api/auth/google/callback:
 *   get:
 *     summary: Google OAuth callback
 *     tags:
 *       - Auth
 *     responses:
 *       302:
 *         description: Redirects to frontend with a JWT
 */

const getFrontendRedirectUrl = () => {

  const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
  return process.env.FRONTEND_OAUTH_REDIRECT || `${frontendOrigin}/login-oauth`;
};

router.get('/google', (req, res, next) => {

  if (!isGoogleOAuthConfigured()) {
    return res.status(501).json({ message: 'Google OAuth not configured yet' });
  }

  return passport.authenticate('google', {
    scope: ['profile', 'email'],
    session: false,
    state: true,
    prompt: 'select_account',
  })(req, res, next);
});

router.get(

  '/google/callback',
  (req, res, next) => {
    if (!isGoogleOAuthConfigured()) {
      return res.status(501).json({ message: 'Google OAuth callback not configured yet' });
    }

    console.log('Query params:', req.query);
    console.log('Session:', req.session);
    return passport.authenticate('google', {
      session: false,
      failureRedirect: `${getFrontendRedirectUrl()}?oauth=failed`,
    })(req, res, next);
  },
  (req, res) => {
    console.log('req.user in callback:', req.user);
    const token = generateToken(req.user);
    console.log('OAuth token:', token);

    const redirectUrl = new URL(getFrontendRedirectUrl());
    redirectUrl.searchParams.set('token', token);
    redirectUrl.searchParams.set('provider', 'google');

    res.redirect(redirectUrl.toString());
  }
);

export default router;
