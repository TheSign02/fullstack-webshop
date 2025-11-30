import { Router } from 'express';
import { verifyToken, verifyAdmin } from '../middleware/auth.js';
import { listCategories, createCategory, updateCategory, deleteCategory } from '../controllers/categoryController.js';

const router = Router();

/**
 * @openapi
 * /api/categories:
 *   get:
 *     summary: List all categories
 *     tags:
 *       - Categories
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/', listCategories);

/**
 * @openapi
 * /api/categories:
 *   post:
 *     summary: Create a category (admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name]
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created
 */
router.post('/', verifyToken, verifyAdmin, createCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category (admin only)
 *     tags:
 *       - Categories
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
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated
 */
router.put('/:id', verifyToken, verifyAdmin, updateCategory);

/**
 * @openapi
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category (admin only)
 *     tags:
 *       - Categories
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Category deleted
 */
router.delete('/:id', verifyToken, verifyAdmin, deleteCategory);

export default router;
