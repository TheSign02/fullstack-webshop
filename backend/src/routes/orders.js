import { Router } from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { createOrder, getMyOrders, getAllOrders, updateOrderStatus } from '../controllers/orderController.js';

const router = Router();

/**
 * @openapi
 * /api/orders:
 *   post:
 *     summary: Create a new order
 *     tags:
 *       - Orders
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
 *               stripeSessionId:
 *                 type: string
 *     responses:
 *       201:
 *         description: Order created
 */
router.post('/', verifyToken, createOrder);

/**
 * @openapi
 * /api/orders:
 *   get:
 *     summary: Get orders for current user
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of current user's orders
 */
router.get('/', verifyToken, getMyOrders);

/**
 * @openapi
 * /api/orders/admin:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 */
router.get('/admin', verifyToken, verifyAdmin, getAllOrders);

/**
 * @openapi
 * /api/orders/{id}/status:
 *   patch:
 *     summary: Update order status (admin only)
 *     tags:
 *       - Orders
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [pending, paid, shipped, cancelled]
 *     responses:
 *       200:
 *         description: Updated order
 */
router.patch('/:id/status', verifyToken, verifyAdmin, updateOrderStatus);

export default router;
