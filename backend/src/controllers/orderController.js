import Order from '../models/Order.js';
import Product from '../models/Product.js';

const buildOrderProducts = async (products = []) => {
  if (!Array.isArray(products) || products.length === 0) {
    throw new Error('At least one product is required');
  }

  const detailed = [];
  for (const item of products) {
    const { productId, quantity } = item;
    if (!productId || !quantity || quantity < 1) {
      throw new Error('Each product needs productId and quantity >= 1');
    }
    const product = await Product.findById(productId);
    if (!product) {
      throw new Error(`Product ${productId} not found`);
    }
    detailed.push({
      productId,
      quantity,
      priceAtPurchase: product.price,
    });
  }
  return detailed;
};

export const createOrder = async (req, res) => {
  try {
    const products = await buildOrderProducts(req.body.products);
    const totalAmount = products.reduce((sum, p) => sum + p.priceAtPurchase * p.quantity, 0);
    const order = await Order.create({
      userId: req.user.id,
      products,
      totalAmount,
      status: 'pending',
      stripeSessionId: req.body.stripeSessionId || null,
    });
    res.status(201).json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to create order', error: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user.id }).sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
};

export const getAllOrders = async (_req, res) => {
  try {
    const orders = await Order.find().populate('userId', 'name email').sort({ createdAt: -1 });
    res.json({ orders });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch all orders', error: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!status) return res.status(400).json({ message: 'Status is required' });
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update order status', error: error.message });
  }
};
