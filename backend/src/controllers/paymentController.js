import Stripe from 'stripe';
import Order from '../models/Order.js';
import Product from '../models/Product.js';

const mustGetStripe = () => {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  if (!secretKey) {
    throw new Error('STRIPE_SECRET_KEY is not set');
  }
  return new Stripe(secretKey);
};

const toStripeImages = (maybeUrl) => {
  if (!maybeUrl) return undefined;
  if (typeof maybeUrl !== 'string') return undefined;
  if (!/^https?:\/\//i.test(maybeUrl)) return undefined;
  return [maybeUrl];
};

const toStripeUnitAmount = (price) => {
  const amount = Math.round(Number(price) * 100);
  if (!Number.isFinite(amount) || amount < 0) {
    throw new Error('Invalid product price');
  }
  return amount;
};

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
      _product: product,
    });
  }

  return detailed;
};

export const createCheckoutSession = async (req, res) => {
  try {
    const stripe = mustGetStripe();
    const frontendOrigin = process.env.FRONTEND_ORIGIN || 'http://localhost:4200';
    const currency = (process.env.STRIPE_CURRENCY || 'usd').toLowerCase();

    const detailedProducts = await buildOrderProducts(req.body.products);

    const productsForOrder = detailedProducts.map(({ productId, quantity, priceAtPurchase }) => ({
      productId,
      quantity,
      priceAtPurchase,
    }));

    const totalAmount = productsForOrder.reduce(
      (sum, p) => sum + p.priceAtPurchase * p.quantity,
      0
    );

    const order = await Order.create({
      userId: req.user.id,
      products: productsForOrder,
      totalAmount,
      status: 'pending',
    });

    const lineItems = detailedProducts.map(({ quantity, priceAtPurchase, _product }) => ({
      quantity,
      price_data: {
        currency,
        unit_amount: toStripeUnitAmount(priceAtPurchase),
        product_data: {
          name: _product.size ? `${_product.title} (${_product.size})` : _product.title,
          description: _product.description || undefined,
          images: toStripeImages(_product.imageUrl),
        },
      },
    }));

    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      success_url: `${frontendOrigin}/checkout-success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendOrigin}/checkout-cancelled`,
      metadata: {
        orderId: order._id.toString(),
        userId: String(req.user.id),
      },
    });

    order.stripeSessionId = session.id;
    await order.save();

    return res.status(201).json({
      orderId: order._id,
      sessionId: session.id,
      url: session.url,
    });
  } catch (error) {
    return res.status(400).json({ message: 'Failed to create checkout session', error: error.message });
  }
};
