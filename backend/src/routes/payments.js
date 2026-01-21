import express, { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = Router();

/**
 * @openapi
 * /api/payments/checkout-session:
 *   post:
 *     summary: Create a Stripe Checkout session and a pending Order
 *     tags:
 *       - Payments
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               products:
 *                 type: array
 *                 items:
 *                   type: object
 *                   required: [productId, quantity]
 *                   properties:
 *                     productId:
 *                       type: string
 *                     quantity:
 *                       type: integer
 *     responses:
 *       201:
 *         description: Checkout session created
 */
router.post('/checkout-session', express.json(), verifyToken, createCheckoutSession);

export default router;
