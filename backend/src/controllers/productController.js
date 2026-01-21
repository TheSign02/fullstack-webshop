import Product from "../models/Product.js";

export const listProducts = async (req, res) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "100", 10);
    const skip = (page - 1) * limit;
    const [items, total] = await Promise.all([
      Product.find().skip(skip).limit(limit).sort({ createdAt: -1 }),
      Product.countDocuments(),
    ]);
    res.json({ items, page, limit, total });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: error.message });
  }
};

export const searchProducts = async (req, res) => {
  try {
    const { q = "", category } = req.query;
    const cond = {
      ...(q ? { title: { $regex: q, $options: "i" } } : {}),
      ...(category ? { category } : {}),
    };
    const items = await Product.find(cond).limit(50);
    res.json({ items });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to search products", error: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const item = await Product.findById(req.params.id);
    if (!item) return res.status(404).json({ message: "Not found" });
    res.json(item);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch product", error: error.message });
  }
};

export const createProduct = async (req, res) => {
  try {
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create product", error: error.message });
  }
};

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json(product);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to update product", error: error.message });
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ message: "Not found" });
    res.json({ ok: true });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to delete product", error: error.message });
  }
};
