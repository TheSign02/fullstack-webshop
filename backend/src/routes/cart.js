import { Router } from 'express';
import { verifyToken } from '../middleware/auth.js';
import {
  getCart,
  addItemToCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} from '../controllers/cartController.js';

const router = Router();

/**
 * @openapi
 * /api/cart:
 *   get:
 *     summary: Get current user's cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart returned
 */
router.get('/', verifyToken, getCart);

/**
 * @openapi
 * /api/cart:
 *   post:
 *     summary: Add an item to the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [productId]
 *             properties:
 *               productId:
 *                 type: string
 *               quantity:
 *                 type: integer
 *                 default: 1
 *     responses:
 *       201:
 *         description: Item added
 */
router.post('/', verifyToken, addItemToCart);

/**
 * @openapi
 * /api/cart/item/{productId}:
 *   put:
 *     summary: Update quantity for a cart item
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
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
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart updated
 */
router.put('/item/:productId', verifyToken, updateCartItem);

/**
 * @openapi
 * /api/cart/item/{productId}:
 *   delete:
 *     summary: Remove an item from the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item removed
 */
router.delete('/item/:productId', verifyToken, removeCartItem);

/**
 * @openapi
 * /api/cart:
 *   delete:
 *     summary: Clear the cart
 *     tags:
 *       - Cart
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */
router.delete('/', verifyToken, clearCart);

export default router;
