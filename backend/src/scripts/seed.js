/**
 * Seed script for webshop MongoDB
 *
 * Usage:
 *   # From the backend folder:
 *   npm run seed
 *     - Inserts 10 categories and 100 products if collections are empty.
 *
 *   npm run seed:reset
 *     - Wipes all products and categories, then reseeds with demo data.
 * 
 */
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const RESET_FLAG = process.argv.includes('--reset') || process.argv.includes('--drop');

const mustGetMongoUri = () => {
  const uri = process.env.MONGO_URI;
  if (!uri) {
    throw new Error('MONGO_URI is not set (check backend/.env).');
  }
  return uri;
};

const categories = [
  {
    name: 'Electronics',
    description: 'Phones, audio, accessories, and everyday tech essentials.',
  },
  {
    name: 'Home & Kitchen',
    description: 'Cookware, storage, and practical home upgrades.',
  },
  {
    name: 'Fashion',
    description: 'Clothing, shoes, and accessories for everyday wear.',
  },
  {
    name: 'Beauty',
    description: 'Skincare, haircare, and personal care basics.',
  },
  {
    name: 'Sports & Outdoors',
    description: 'Fitness gear and outdoor essentials for active life.',
  },
  {
    name: 'Books',
    description: 'Popular reads, reference, and learning materials.',
  },
  {
    name: 'Toys & Games',
    description: 'Board games, creative toys, and fun for all ages.',
  },
  {
    name: 'Groceries',
    description: 'Pantry staples and everyday snacks.',
  },
  {
    name: 'Office Supplies',
    description: 'Desk organization and productivity essentials.',
  },
  {
    name: 'Pets',
    description: 'Pet food, toys, and care accessories.',
  },
];

const productsByCategory = {
  Electronics: [
    {
      title: 'Wireless Bluetooth Earbuds',
      description: 'Compact earbuds with charging case and touch controls.',
      price: 39.99,
      stock: 120,
    },
    {
      title: 'USB-C Fast Charger 45W',
      description: 'Fast charging adapter for phones, tablets, and laptops.',
      price: 24.99,
      stock: 200,
    },
    {
      title: 'Braided USB-C Cable 2m',
      description: 'Durable braided cable for charging and data transfer.',
      price: 9.99,
      stock: 350,
    },
    {
      title: 'Portable Power Bank 10000mAh',
      description: 'Pocket-sized battery pack with dual USB output.',
      price: 29.99,
      stock: 150,
    },
    {
      title: 'Bluetooth Speaker Mini',
      description: 'Small speaker with surprisingly big sound and bass.',
      price: 34.99,
      stock: 90,
    },
    {
      title: 'Laptop Stand Adjustable',
      description: 'Aluminum stand for better posture and cooling.',
      price: 27.5,
      stock: 80,
    },
    {
      title: 'Wireless Mouse Silent Click',
      description: 'Ergonomic mouse with quiet buttons and smooth tracking.',
      price: 14.99,
      stock: 160,
    },
    {
      title: 'Mechanical Keyboard TKL',
      description: 'Tenkeyless keyboard with tactile switches and backlight.',
      price: 69.99,
      stock: 45,
    },
    {
      title: 'Webcam Full HD 1080p',
      description: 'USB webcam with built-in mic for calls and streaming.',
      price: 49.99,
      stock: 70,
    },
    {
      title: 'Noise Cancelling Headphones',
      description: 'Over-ear headphones with active noise reduction.',
      price: 89.99,
      stock: 35,
    },
  ],
  'Home & Kitchen': [
    {
      title: 'Non-stick Frying Pan 28cm',
      description: 'Everyday pan with non-stick coating and easy cleanup.',
      price: 22.99,
      stock: 110,
    },
    {
      title: 'Chef Knife 20cm',
      description: 'Sharp stainless steel knife for daily prep work.',
      price: 19.99,
      stock: 60,
    },
    {
      title: 'Cutting Board Bamboo',
      description: 'Bamboo board that is gentle on knives and easy to clean.',
      price: 12.99,
      stock: 140,
    },
    {
      title: 'Food Storage Containers (10 pcs)',
      description: 'Reusable containers with leak-resistant lids.',
      price: 18.49,
      stock: 95,
    },
    {
      title: 'Electric Kettle 1.7L',
      description: 'Quick-boil kettle with auto shutoff and boil-dry protection.',
      price: 29.99,
      stock: 50,
    },
    {
      title: 'Reusable Water Bottle 750ml',
      description: 'BPA-free bottle for home, work, or gym.',
      price: 11.99,
      stock: 210,
    },
    {
      title: 'Microfiber Cleaning Cloths (12 pcs)',
      description: 'Soft cloths for streak-free cleaning on any surface.',
      price: 9.49,
      stock: 180,
    },
    {
      title: 'LED Desk Lamp',
      description: 'Dimmable lamp with warm/cool modes and USB port.',
      price: 26.99,
      stock: 65,
    },
    {
      title: 'Vacuum Sealer Bags (50 pcs)',
      description: 'Embossed bags for vacuum sealing and freezer storage.',
      price: 14.99,
      stock: 130,
    },
    {
      title: 'Spice Rack Organizer',
      description: 'Keeps spices neat and visible in cabinet or countertop.',
      price: 21.99,
      stock: 40,
    },
  ],
  Fashion: [
    {
      title: 'Unisex Cotton T-Shirt',
      description: 'Soft cotton tee, regular fit, easy to pair with anything.',
      price: 12.99,
      stock: 220,
    },
    {
      title: 'Hoodie Classic',
      description: 'Warm hoodie with kangaroo pocket and adjustable hood.',
      price: 29.99,
      stock: 90,
    },
    {
      title: 'Denim Jeans Slim Fit',
      description: 'Comfort stretch slim jeans for everyday wear.',
      price: 34.99,
      stock: 75,
    },
    {
      title: 'Sneakers Everyday',
      description: 'Lightweight sneakers with breathable upper.',
      price: 44.99,
      stock: 60,
    },
    {
      title: 'Crew Socks (5 pairs)',
      description: 'Comfortable cotton blend socks for daily use.',
      price: 8.99,
      stock: 250,
    },
    {
      title: 'Baseball Cap Adjustable',
      description: 'Classic cap with adjustable strap and curved brim.',
      price: 10.99,
      stock: 140,
    },
    {
      title: 'Winter Beanie',
      description: 'Warm knit beanie for cold days.',
      price: 9.49,
      stock: 130,
    },
    {
      title: 'Leather Belt',
      description: 'Genuine leather belt with metal buckle.',
      price: 18.99,
      stock: 55,
    },
    {
      title: 'Sunglasses UV400',
      description: 'Stylish sunglasses with UV400 protection.',
      price: 16.99,
      stock: 85,
    },
    {
      title: 'Backpack Daypack',
      description: 'Lightweight daypack with laptop sleeve and pockets.',
      price: 27.99,
      stock: 70,
    },
  ],
  Beauty: [
    {
      title: 'Face Cleanser Gentle',
      description: 'Gentle daily cleanser suitable for most skin types.',
      price: 11.99,
      stock: 120,
    },
    {
      title: 'Moisturizer Hydrating',
      description: 'Lightweight moisturizer for day and night use.',
      price: 14.99,
      stock: 95,
    },
    {
      title: 'Sunscreen SPF 50',
      description: 'Broad spectrum sunscreen with non-greasy finish.',
      price: 16.49,
      stock: 80,
    },
    {
      title: 'Shampoo Daily Care',
      description: 'Everyday shampoo for clean, fresh hair.',
      price: 8.99,
      stock: 140,
    },
    {
      title: 'Conditioner Smooth',
      description: 'Conditioner that helps detangle and add shine.',
      price: 8.99,
      stock: 130,
    },
    {
      title: 'Body Lotion',
      description: 'Moisturizing lotion for soft skin all day.',
      price: 9.99,
      stock: 110,
    },
    {
      title: 'Lip Balm Pack (3 pcs)',
      description: 'Hydrating lip balm assortment for daily use.',
      price: 6.99,
      stock: 200,
    },
    {
      title: 'Hand Cream',
      description: 'Non-sticky hand cream for dry hands.',
      price: 5.99,
      stock: 170,
    },
    {
      title: 'Shower Gel',
      description: 'Refreshing shower gel with clean scent.',
      price: 4.99,
      stock: 190,
    },
    {
      title: 'Hair Brush Detangling',
      description: 'Comfortable brush designed to reduce breakage.',
      price: 7.49,
      stock: 90,
    },
  ],
  'Sports & Outdoors': [
    {
      title: 'Yoga Mat Non-slip',
      description: 'Cushioned mat with non-slip surface for workouts.',
      price: 19.99,
      stock: 85,
    },
    {
      title: 'Resistance Bands Set',
      description: 'Set of 5 bands with different resistance levels.',
      price: 14.99,
      stock: 120,
    },
    {
      title: 'Dumbbells Pair 2x5kg',
      description: 'Compact dumbbells for home strength training.',
      price: 39.99,
      stock: 40,
    },
    {
      title: 'Stainless Steel Water Bottle 1L',
      description: 'Insulated bottle that keeps drinks cold or hot longer.',
      price: 21.99,
      stock: 75,
    },
    {
      title: 'Running Waist Belt',
      description: 'Carry phone and keys comfortably during runs.',
      price: 12.49,
      stock: 95,
    },
    {
      title: 'Camping Headlamp',
      description: 'Bright LED headlamp with adjustable strap.',
      price: 17.99,
      stock: 70,
    },
    {
      title: 'Hiking Backpack 30L',
      description: 'Comfortable hiking pack with multiple compartments.',
      price: 49.99,
      stock: 30,
    },
    {
      title: 'Jump Rope Adjustable',
      description: 'Smooth rotating jump rope with adjustable length.',
      price: 9.99,
      stock: 110,
    },
    {
      title: 'Fitness Gloves',
      description: 'Grip-enhancing gloves for weight training sessions.',
      price: 13.99,
      stock: 60,
    },
    {
      title: 'Trekking Poles Pair',
      description: 'Lightweight poles for stability on trails.',
      price: 34.99,
      stock: 35,
    },
  ],
  Books: [
    {
      title: 'The Minimalist Home (Paperback)',
      description: 'Practical tips for simplifying spaces and routines.',
      price: 12.49,
      stock: 55,
    },
    {
      title: 'Cooking Basics: 100 Recipes',
      description: 'Beginner-friendly recipes with simple ingredients.',
      price: 15.99,
      stock: 45,
    },
    {
      title: 'JavaScript for Beginners',
      description: 'A friendly introduction to modern JavaScript.',
      price: 24.99,
      stock: 35,
    },
    {
      title: 'Learn MongoDB Quickly',
      description: 'Hands-on guide to MongoDB concepts and querying.',
      price: 22.99,
      stock: 30,
    },
    {
      title: 'Time Management Toolkit',
      description: 'Strategies for planning, prioritizing, and focus.',
      price: 13.99,
      stock: 60,
    },
    {
      title: 'Mindful Habits Journal',
      description: 'Daily prompts to build better habits over time.',
      price: 9.99,
      stock: 80,
    },
    {
      title: 'Personal Finance 101',
      description: 'Simple budgeting and saving advice for beginners.',
      price: 16.99,
      stock: 40,
    },
    {
      title: 'Photography Essentials',
      description: 'Learn composition, lighting, and camera basics.',
      price: 18.49,
      stock: 25,
    },
    {
      title: 'Healthy Meal Prep Guide',
      description: 'Plan meals efficiently with easy prep routines.',
      price: 14.49,
      stock: 50,
    },
    {
      title: 'The Cozy Mystery Collection',
      description: 'A fun compilation of light mystery stories.',
      price: 11.99,
      stock: 35,
    },
  ],
  'Toys & Games': [
    {
      title: 'Classic Board Game Set',
      description: 'A family-friendly board game for game nights.',
      price: 19.99,
      stock: 45,
    },
    {
      title: 'Puzzle 1000 Pieces',
      description: 'High-quality puzzle with vibrant print.',
      price: 12.99,
      stock: 70,
    },
    {
      title: 'Building Blocks Starter Kit',
      description: 'Creative building blocks for ages 6+.',
      price: 24.99,
      stock: 55,
    },
    {
      title: 'Remote Control Car',
      description: 'Fast RC car with durable wheels and rechargeable battery.',
      price: 29.99,
      stock: 30,
    },
    {
      title: 'Kids Art Supplies Pack',
      description: 'Markers, crayons, and paper for creative play.',
      price: 14.99,
      stock: 80,
    },
    {
      title: 'Card Game Party Edition',
      description: 'Quick and fun card game for groups.',
      price: 9.99,
      stock: 100,
    },
    {
      title: 'Plush Toy Soft Bear',
      description: 'Super soft plush bear, great as a gift.',
      price: 13.49,
      stock: 60,
    },
    {
      title: 'Strategy Board Game',
      description: 'Deeper strategy game for experienced players.',
      price: 34.99,
      stock: 25,
    },
    {
      title: 'Educational STEM Kit',
      description: 'Hands-on experiments to learn basic STEM concepts.',
      price: 27.99,
      stock: 40,
    },
    {
      title: 'Outdoor Bubble Wand Set',
      description: 'Big bubbles for outdoor fun in the park.',
      price: 7.99,
      stock: 120,
    },
  ],
  Groceries: [
    {
      title: 'Arabica Coffee Beans 500g',
      description: 'Medium roast beans with smooth flavor.',
      price: 11.99,
      stock: 90,
    },
    {
      title: 'Green Tea Bags (50 pcs)',
      description: 'Refreshing green tea for daily sipping.',
      price: 6.49,
      stock: 140,
    },
    {
      title: 'Pasta Spaghetti 1kg',
      description: 'Quality durum wheat pasta for quick meals.',
      price: 3.49,
      stock: 200,
    },
    {
      title: 'Tomato Sauce 700g',
      description: 'Rich tomato sauce for pasta and cooking.',
      price: 2.99,
      stock: 180,
    },
    {
      title: 'Olive Oil Extra Virgin 500ml',
      description: 'Cold-pressed olive oil for cooking and salads.',
      price: 8.99,
      stock: 65,
    },
    {
      title: 'Breakfast Cereal 750g',
      description: 'Crunchy cereal with whole grains.',
      price: 4.99,
      stock: 110,
    },
    {
      title: 'Peanut Butter 350g',
      description: 'Creamy peanut butter with no unnecessary additives.',
      price: 3.99,
      stock: 95,
    },
    {
      title: 'Dark Chocolate 70% 100g',
      description: 'Smooth dark chocolate bar, 70% cocoa.',
      price: 2.49,
      stock: 160,
    },
    {
      title: 'Mixed Nuts 400g',
      description: 'Roasted mixed nuts for snacking.',
      price: 7.49,
      stock: 85,
    },
    {
      title: 'Sparkling Water 6x1.5L',
      description: 'Refreshing sparkling mineral water multipack.',
      price: 4.49,
      stock: 75,
    },
  ],
  'Office Supplies': [
    {
      title: 'Notebook A5 Lined',
      description: 'A5 lined notebook for notes and planning.',
      price: 4.99,
      stock: 200,
    },
    {
      title: 'Ballpoint Pens (10 pack)',
      description: 'Smooth writing pens with comfortable grip.',
      price: 3.49,
      stock: 240,
    },
    {
      title: 'Highlighters Set (6 colors)',
      description: 'Bright highlighters for study and work.',
      price: 5.99,
      stock: 120,
    },
    {
      title: 'Sticky Notes (8 pads)',
      description: 'Assorted sticky notes for quick reminders.',
      price: 6.49,
      stock: 150,
    },
    {
      title: 'Desk Organizer',
      description: 'Keep pens, clips, and small items organized.',
      price: 12.99,
      stock: 60,
    },
    {
      title: 'Stapler Mini',
      description: 'Compact stapler with starter staples included.',
      price: 7.99,
      stock: 90,
    },
    {
      title: 'Paper Clips (200 pcs)',
      description: 'Metal paper clips for everyday use.',
      price: 2.49,
      stock: 300,
    },
    {
      title: 'Printer Paper A4 500 sheets',
      description: 'Bright A4 paper for printing and copying.',
      price: 6.99,
      stock: 100,
    },
    {
      title: 'Whiteboard Markers (4 pack)',
      description: 'Low-odor markers that erase cleanly.',
      price: 5.49,
      stock: 85,
    },
    {
      title: 'Desk Calendar',
      description: 'Monthly desk calendar for easy planning.',
      price: 8.49,
      stock: 70,
    },
  ],
  Pets: [
    {
      title: 'Dog Treats (Chicken) 200g',
      description: 'Tasty training treats for dogs.',
      price: 4.99,
      stock: 140,
    },
    {
      title: 'Cat Toy Feather Wand',
      description: 'Interactive toy to keep cats active and entertained.',
      price: 6.99,
      stock: 80,
    },
    {
      title: 'Pet Bowl Stainless Steel',
      description: 'Easy-clean stainless steel bowl for food or water.',
      price: 7.49,
      stock: 110,
    },
    {
      title: 'Dog Leash 1.5m',
      description: 'Strong leash with comfortable handle.',
      price: 9.99,
      stock: 65,
    },
    {
      title: 'Cat Litter 10L',
      description: 'Clumping litter for easy odor control.',
      price: 8.99,
      stock: 70,
    },
    {
      title: 'Pet Grooming Brush',
      description: 'Brush that helps reduce shedding and tangles.',
      price: 8.49,
      stock: 95,
    },
    {
      title: 'Dog Shampoo Gentle',
      description: 'Gentle shampoo formulated for dogs.',
      price: 7.99,
      stock: 60,
    },
    {
      title: 'Cat Food Dry 2kg',
      description: 'Complete dry food for adult cats.',
      price: 12.99,
      stock: 55,
    },
    {
      title: 'Dog Food Dry 3kg',
      description: 'Balanced dry food for adult dogs.',
      price: 16.99,
      stock: 50,
    },
    {
      title: 'Pet Waste Bags (120 pcs)',
      description: 'Strong and leak-resistant waste bags.',
      price: 5.99,
      stock: 160,
    },
  ],
};

const makeImageUrl = (category, title) => {
  const seed = `${category}-${title}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
  return `https://picsum.photos/seed/${encodeURIComponent(seed)}/600/600`;
};

const main = async () => {
  const uri = mustGetMongoUri();
  await mongoose.connect(uri);

  if (RESET_FLAG) {
    await Product.deleteMany({});
    await Category.deleteMany({});
  } else {
    const existingProducts = await Product.countDocuments();
    const existingCategories = await Category.countDocuments();
    if (existingProducts > 0 || existingCategories > 0) {
      console.log(
        `DB already has data (categories=${existingCategories}, products=${existingProducts}).`
      );
      console.log('Run with --reset to wipe and reseed.');
      return;
    }
  }

  // Upsert categories by unique name
  for (const cat of categories) {
    await Category.findOneAndUpdate(
      { name: cat.name },
      { $set: { description: cat.description }, $setOnInsert: { name: cat.name } },
      { upsert: true, new: true }
    );
  }

  const productDocs = [];
  let globalIndex = 0;
  for (const cat of categories) {
    const list = productsByCategory[cat.name];
    if (!Array.isArray(list) || list.length !== 10) {
      throw new Error(
        `Expected exactly 10 products for category "${cat.name}" but got ${
          Array.isArray(list) ? list.length : 'none'
        }.`
      );
    }

    for (const p of list) {
      globalIndex += 1;
      productDocs.push({
        title: p.title,
        description: p.description,
        price: p.price,
        category: cat.name,
        imageUrl: makeImageUrl(cat.name, p.title),
        stock: p.stock,
        isFeatured: globalIndex % 9 === 0,
      });
    }
  }

  // This results in: 10 categories + 100 products
  await Product.insertMany(productDocs);

  const categoryCount = await Category.countDocuments();
  const productCount = await Product.countDocuments();
  console.log(`Seed complete: categories=${categoryCount}, products=${productCount}`);
};

main()
  .catch((err) => {
    console.error('Seed failed:', err.message);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect().catch(() => undefined);
  });
