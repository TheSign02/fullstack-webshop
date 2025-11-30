import { Router } from 'express';
const router = Router();

/**
 * @openapi
 * /healthcheck:
 *   get:
 *     summary: API health check
 *     tags:
 *       - Health
 *     responses:
 *       200:
 *         description: API is running
 */
router.get('/', (_req, res) => {
  res.set('Cache-Control', 'no-store');
  res.json({ health: 'ok' });
});
export default router;
