import Category from '../../src/models/Category.js';
import Product from '../../src/models/Product.js';
import User from '../../src/models/User.js';

export const clearDatabase = async () => {
  await Promise.all([
    Product.deleteMany({}),
    Category.deleteMany({}),
    User.deleteMany({}),
  ]);
};
