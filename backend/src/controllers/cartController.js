import Cart from '../models/Cart.js';

const findOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

export const getCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user.id);
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch cart', error: error.message });
  }
};

export const addItemToCart = async (req, res) => {
  try {
    const { productId, quantity = 1 } = req.body;
    if (!productId) return res.status(400).json({ message: 'productId is required' });
    if (quantity < 1) return res.status(400).json({ message: 'quantity must be at least 1' });

    const cart = await findOrCreateCart(req.user.id);
    const existing = cart.items.find((item) => item.productId.toString() === productId);
    if (existing) {
      existing.quantity += quantity;
    } else {
      cart.items.push({ productId, quantity });
    }
    await cart.save();
    res.status(201).json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to add item', error: error.message });
  }
};

export const updateCartItem = async (req, res) => {
  try {
    const { quantity } = req.body;
    if (quantity == null) return res.status(400).json({ message: 'quantity is required' });
    const cart = await findOrCreateCart(req.user.id);
    const item = cart.items.find((i) => i.productId.toString() === req.params.productId);
    if (!item) return res.status(404).json({ message: 'Item not found in cart' });

    if (quantity <= 0) {
      cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    } else {
      item.quantity = quantity;
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to update item', error: error.message });
  }
};

export const removeCartItem = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user.id);
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((i) => i.productId.toString() !== req.params.productId);
    if (cart.items.length === initialLength) {
      return res.status(404).json({ message: 'Item not found in cart' });
    }
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(400).json({ message: 'Failed to remove item', error: error.message });
  }
};

export const clearCart = async (req, res) => {
  try {
    const cart = await findOrCreateCart(req.user.id);
    cart.items = [];
    await cart.save();
    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: 'Failed to clear cart', error: error.message });
  }
};
