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
  "Electronics": [
    {
      "title": "Wireless Bluetooth Earbuds",
      "size": "Standard",
      "description": "Compact earbuds with charging case and touch controls.",
      "price": 39.99,
      "stock": 120
    },
    {
      "title": "Wireless Bluetooth Earbuds",
      "size": "Plus",
      "description": "Compact earbuds with charging case and touch controls.",
      "price": 39.99,
      "stock": 120
    },
    {
      "title": "USB-C Fast Charger",
      "size": "45W",
      "description": "Fast charging adapter for phones, tablets, and laptops.",
      "price": 24.99,
      "stock": 200
    },
    {
      "title": "USB-C Fast Charger",
      "size": "65W",
      "description": "Fast charging adapter for phones, tablets, and laptops.",
      "price": 24.99,
      "stock": 200
    },
    {
      "title": "Braided USB-C Cable",
      "size": "1 m",
      "description": "Durable braided cable for charging and data transfer.",
      "price": 9.99,
      "stock": 350
    },
    {
      "title": "Braided USB-C Cable",
      "size": "2 m",
      "description": "Durable braided cable for charging and data transfer.",
      "price": 9.99,
      "stock": 350
    },
    {
      "title": "Portable Power Bank",
      "size": "10,000 mAh",
      "description": "Pocket-sized battery pack with dual USB output.",
      "price": 29.99,
      "stock": 150
    },
    {
      "title": "Portable Power Bank",
      "size": "20,000 mAh",
      "description": "Pocket-sized battery pack with dual USB output.",
      "price": 29.99,
      "stock": 150
    },
    {
      "title": "Bluetooth Speaker",
      "size": "Mini",
      "description": "Small speaker with surprisingly big sound and bass.",
      "price": 34.99,
      "stock": 90
    },
    {
      "title": "Bluetooth Speaker",
      "size": "Max",
      "description": "Small speaker with surprisingly big sound and bass.",
      "price": 34.99,
      "stock": 90
    }
  ],
  "Home & Kitchen": [
    {
      "title": "Non-stick Frying Pan",
      "size": "24 cm",
      "description": "Everyday pan with non-stick coating and easy cleanup.",
      "price": 22.99,
      "stock": 110
    },
    {
      "title": "Non-stick Frying Pan",
      "size": "28 cm",
      "description": "Everyday pan with non-stick coating and easy cleanup.",
      "price": 22.99,
      "stock": 110
    },
    {
      "title": "Chef Knife",
      "size": "20 cm",
      "description": "Sharp stainless steel knife for daily prep work.",
      "price": 19.99,
      "stock": 60
    },
    {
      "title": "Chef Knife",
      "size": "25 cm",
      "description": "Sharp stainless steel knife for daily prep work.",
      "price": 19.99,
      "stock": 60
    },
    {
      "title": "Cutting Board Bamboo",
      "size": "Small",
      "description": "Bamboo board that is gentle on knives and easy to clean.",
      "price": 12.99,
      "stock": 140
    },
    {
      "title": "Cutting Board Bamboo",
      "size": "Large",
      "description": "Bamboo board that is gentle on knives and easy to clean.",
      "price": 12.99,
      "stock": 140
    },
    {
      "title": "Food Storage Containers",
      "size": "5 pcs",
      "description": "Reusable containers with leak-resistant lids.",
      "price": 18.49,
      "stock": 95
    },
    {
      "title": "Food Storage Containers",
      "size": "10 pcs",
      "description": "Reusable containers with leak-resistant lids.",
      "price": 18.49,
      "stock": 95
    },
    {
      "title": "Electric Kettle",
      "size": "1.0 L",
      "description": "Quick-boil kettle with auto shutoff and boil-dry protection.",
      "price": 29.99,
      "stock": 50
    },
    {
      "title": "Electric Kettle",
      "size": "1.7 L",
      "description": "Quick-boil kettle with auto shutoff and boil-dry protection.",
      "price": 29.99,
      "stock": 50
    }
  ],
  "Fashion": [
    {
      "title": "Unisex Cotton T-Shirt",
      "size": "S",
      "description": "Soft cotton tee, regular fit, easy to pair with anything.",
      "price": 12.99,
      "stock": 220
    },
    {
      "title": "Unisex Cotton T-Shirt",
      "size": "M",
      "description": "Soft cotton tee, regular fit, easy to pair with anything.",
      "price": 12.99,
      "stock": 220
    },
    {
      "title": "Hoodie Classic",
      "size": "M",
      "description": "Warm hoodie with kangaroo pocket and adjustable hood.",
      "price": 29.99,
      "stock": 90
    },
    {
      "title": "Hoodie Classic",
      "size": "L",
      "description": "Warm hoodie with kangaroo pocket and adjustable hood.",
      "price": 29.99,
      "stock": 90
    },
    {
      "title": "Denim Jeans Slim Fit",
      "size": "32",
      "description": "Comfort stretch slim jeans for everyday wear.",
      "price": 34.99,
      "stock": 75
    },
    {
      "title": "Denim Jeans Slim Fit",
      "size": "34",
      "description": "Comfort stretch slim jeans for everyday wear.",
      "price": 34.99,
      "stock": 75
    },
    {
      "title": "Sneakers Everyday",
      "size": "EU 42",
      "description": "Lightweight sneakers with breathable upper.",
      "price": 44.99,
      "stock": 60
    },
    {
      "title": "Sneakers Everyday",
      "size": "EU 44",
      "description": "Lightweight sneakers with breathable upper.",
      "price": 44.99,
      "stock": 60
    },
    {
      "title": "Crew Socks",
      "size": "3 pairs",
      "description": "Comfortable cotton blend socks for daily use.",
      "price": 8.99,
      "stock": 250
    },
    {
      "title": "Crew Socks",
      "size": "5 pairs",
      "description": "Comfortable cotton blend socks for daily use.",
      "price": 8.99,
      "stock": 250
    }
  ],
  "Beauty": [
    {
      "title": "Face Cleanser Gentle",
      "size": "150 ml",
      "description": "Gentle daily cleanser suitable for most skin types.",
      "price": 11.99,
      "stock": 120
    },
    {
      "title": "Face Cleanser Gentle",
      "size": "300 ml",
      "description": "Gentle daily cleanser suitable for most skin types.",
      "price": 11.99,
      "stock": 120
    },
    {
      "title": "Moisturizer Hydrating",
      "size": "50 ml",
      "description": "Lightweight moisturizer for day and night use.",
      "price": 14.99,
      "stock": 95
    },
    {
      "title": "Moisturizer Hydrating",
      "size": "100 ml",
      "description": "Lightweight moisturizer for day and night use.",
      "price": 14.99,
      "stock": 95
    },
    {
      "title": "Sunscreen SPF 50",
      "size": "50 ml",
      "description": "Broad spectrum sunscreen with non-greasy finish.",
      "price": 16.49,
      "stock": 80
    },
    {
      "title": "Sunscreen SPF 50",
      "size": "100 ml",
      "description": "Broad spectrum sunscreen with non-greasy finish.",
      "price": 16.49,
      "stock": 80
    },
    {
      "title": "Shampoo Daily Care",
      "size": "250 ml",
      "description": "Everyday shampoo for clean, fresh hair.",
      "price": 8.99,
      "stock": 140
    },
    {
      "title": "Shampoo Daily Care",
      "size": "500 ml",
      "description": "Everyday shampoo for clean, fresh hair.",
      "price": 8.99,
      "stock": 140
    },
    {
      "title": "Conditioner Smooth",
      "size": "250 ml",
      "description": "Conditioner that helps detangle and add shine.",
      "price": 8.99,
      "stock": 130
    },
    {
      "title": "Conditioner Smooth",
      "size": "500 ml",
      "description": "Conditioner that helps detangle and add shine.",
      "price": 8.99,
      "stock": 130
    }
  ],
  "Sports & Outdoors": [
    {
      "title": "Yoga Mat Non-slip",
      "size": "4 mm",
      "description": "Cushioned mat with non-slip surface for workouts.",
      "price": 19.99,
      "stock": 85
    },
    {
      "title": "Yoga Mat Non-slip",
      "size": "8 mm",
      "description": "Cushioned mat with non-slip surface for workouts.",
      "price": 19.99,
      "stock": 85
    },
    {
      "title": "Resistance Bands Set",
      "size": "3 bands",
      "description": "Set of 5 bands with different resistance levels.",
      "price": 14.99,
      "stock": 120
    },
    {
      "title": "Resistance Bands Set",
      "size": "5 bands",
      "description": "Set of 5 bands with different resistance levels.",
      "price": 14.99,
      "stock": 120
    },
    {
      "title": "Dumbbells Pair",
      "size": "2x5 kg",
      "description": "Compact dumbbells for home strength training.",
      "price": 39.99,
      "stock": 40
    },
    {
      "title": "Dumbbells Pair",
      "size": "2x10 kg",
      "description": "Compact dumbbells for home strength training.",
      "price": 39.99,
      "stock": 40
    },
    {
      "title": "Stainless Steel Water Bottle",
      "size": "750 ml",
      "description": "Insulated bottle that keeps drinks cold or hot longer.",
      "price": 21.99,
      "stock": 75
    },
    {
      "title": "Stainless Steel Water Bottle",
      "size": "1 L",
      "description": "Insulated bottle that keeps drinks cold or hot longer.",
      "price": 21.99,
      "stock": 75
    },
    {
      "title": "Running Waist Belt",
      "size": "S/M",
      "description": "Carry phone and keys comfortably during runs.",
      "price": 12.49,
      "stock": 95
    },
    {
      "title": "Running Waist Belt",
      "size": "L/XL",
      "description": "Carry phone and keys comfortably during runs.",
      "price": 12.49,
      "stock": 95
    }
  ],
  "Books": [
    {
      "title": "The Minimalist Home",
      "size": "Paperback",
      "description": "Practical tips for simplifying spaces and routines.",
      "price": 12.49,
      "stock": 55
    },
    {
      "title": "The Minimalist Home",
      "size": "Hardcover",
      "description": "Practical tips for simplifying spaces and routines.",
      "price": 12.49,
      "stock": 55
    },
    {
      "title": "Cooking Basics: 100 Recipes",
      "size": "Paperback",
      "description": "Beginner-friendly recipes with simple ingredients.",
      "price": 15.99,
      "stock": 45
    },
    {
      "title": "Cooking Basics: 100 Recipes",
      "size": "Hardcover",
      "description": "Beginner-friendly recipes with simple ingredients.",
      "price": 15.99,
      "stock": 45
    },
    {
      "title": "JavaScript for Beginners",
      "size": "Paperback",
      "description": "A friendly introduction to modern JavaScript.",
      "price": 24.99,
      "stock": 35
    },
    {
      "title": "JavaScript for Beginners",
      "size": "Hardcover",
      "description": "A friendly introduction to modern JavaScript.",
      "price": 24.99,
      "stock": 35
    },
    {
      "title": "Learn MongoDB Quickly",
      "size": "Paperback",
      "description": "Hands-on guide to MongoDB concepts and querying.",
      "price": 22.99,
      "stock": 30
    },
    {
      "title": "Learn MongoDB Quickly",
      "size": "Hardcover",
      "description": "Hands-on guide to MongoDB concepts and querying.",
      "price": 22.99,
      "stock": 30
    },
    {
      "title": "Time Management Toolkit",
      "size": "Paperback",
      "description": "Strategies for planning, prioritizing, and focus.",
      "price": 13.99,
      "stock": 60
    },
    {
      "title": "Time Management Toolkit",
      "size": "Hardcover",
      "description": "Strategies for planning, prioritizing, and focus.",
      "price": 13.99,
      "stock": 60
    }
  ],
  "Toys & Games": [
    {
      "title": "Classic Board Game Set",
      "size": "Standard",
      "description": "A family-friendly board game for game nights.",
      "price": 19.99,
      "stock": 45
    },
    {
      "title": "Classic Board Game Set",
      "size": "Deluxe",
      "description": "A family-friendly board game for game nights.",
      "price": 19.99,
      "stock": 45
    },
    {
      "title": "Puzzle",
      "size": "500 pieces",
      "description": "High-quality puzzle with vibrant print.",
      "price": 12.99,
      "stock": 70
    },
    {
      "title": "Puzzle",
      "size": "1000 pieces",
      "description": "High-quality puzzle with vibrant print.",
      "price": 12.99,
      "stock": 70
    },
    {
      "title": "Building Blocks Starter Kit",
      "size": "150 pcs",
      "description": "Creative building blocks for ages 6+.",
      "price": 24.99,
      "stock": 55
    },
    {
      "title": "Building Blocks Starter Kit",
      "size": "300 pcs",
      "description": "Creative building blocks for ages 6+.",
      "price": 24.99,
      "stock": 55
    },
    {
      "title": "Remote Control Car",
      "size": "Standard",
      "description": "Fast RC car with durable wheels and rechargeable battery.",
      "price": 29.99,
      "stock": 30
    },
    {
      "title": "Remote Control Car",
      "size": "Pro",
      "description": "Fast RC car with durable wheels and rechargeable battery.",
      "price": 29.99,
      "stock": 30
    },
    {
      "title": "Kids Art Supplies Pack",
      "size": "Small",
      "description": "Markers, crayons, and paper for creative play.",
      "price": 14.99,
      "stock": 80
    },
    {
      "title": "Kids Art Supplies Pack",
      "size": "Large",
      "description": "Markers, crayons, and paper for creative play.",
      "price": 14.99,
      "stock": 80
    }
  ],
  "Groceries": [
    {
      "title": "Arabica Coffee Beans",
      "size": "250 g",
      "description": "Medium roast beans with smooth flavor.",
      "price": 11.99,
      "stock": 90
    },
    {
      "title": "Arabica Coffee Beans",
      "size": "500 g",
      "description": "Medium roast beans with smooth flavor.",
      "price": 11.99,
      "stock": 90
    },
    {
      "title": "Green Tea Bags",
      "size": "25 pcs",
      "description": "Refreshing green tea for daily sipping.",
      "price": 6.49,
      "stock": 140
    },
    {
      "title": "Green Tea Bags",
      "size": "50 pcs",
      "description": "Refreshing green tea for daily sipping.",
      "price": 6.49,
      "stock": 140
    },
    {
      "title": "Pasta Spaghetti",
      "size": "500 g",
      "description": "Quality durum wheat pasta for quick meals.",
      "price": 3.49,
      "stock": 200
    },
    {
      "title": "Pasta Spaghetti",
      "size": "1 kg",
      "description": "Quality durum wheat pasta for quick meals.",
      "price": 3.49,
      "stock": 200
    },
    {
      "title": "Tomato Sauce",
      "size": "400 g",
      "description": "Rich tomato sauce for pasta and cooking.",
      "price": 2.99,
      "stock": 180
    },
    {
      "title": "Tomato Sauce",
      "size": "700 g",
      "description": "Rich tomato sauce for pasta and cooking.",
      "price": 2.99,
      "stock": 180
    },
    {
      "title": "Olive Oil Extra Virgin",
      "size": "250 ml",
      "description": "Cold-pressed olive oil for cooking and salads.",
      "price": 8.99,
      "stock": 65
    },
    {
      "title": "Olive Oil Extra Virgin",
      "size": "500 ml",
      "description": "Cold-pressed olive oil for cooking and salads.",
      "price": 8.99,
      "stock": 65
    }
  ],
  "Office Supplies": [
    {
      "title": "Notebook",
      "size": "A5",
      "description": "A5 lined notebook for notes and planning.",
      "price": 4.99,
      "stock": 200
    },
    {
      "title": "Notebook",
      "size": "A4",
      "description": "A5 lined notebook for notes and planning.",
      "price": 4.99,
      "stock": 200
    },
    {
      "title": "Ballpoint Pens",
      "size": "5 pack",
      "description": "Smooth writing pens with comfortable grip.",
      "price": 3.49,
      "stock": 240
    },
    {
      "title": "Ballpoint Pens",
      "size": "10 pack",
      "description": "Smooth writing pens with comfortable grip.",
      "price": 3.49,
      "stock": 240
    },
    {
      "title": "Highlighters Set",
      "size": "4 colors",
      "description": "Bright highlighters for study and work.",
      "price": 5.99,
      "stock": 120
    },
    {
      "title": "Highlighters Set",
      "size": "6 colors",
      "description": "Bright highlighters for study and work.",
      "price": 5.99,
      "stock": 120
    },
    {
      "title": "Sticky Notes",
      "size": "4 pads",
      "description": "Assorted sticky notes for quick reminders.",
      "price": 6.49,
      "stock": 150
    },
    {
      "title": "Sticky Notes",
      "size": "8 pads",
      "description": "Assorted sticky notes for quick reminders.",
      "price": 6.49,
      "stock": 150
    },
    {
      "title": "Desk Organizer",
      "size": "Compact",
      "description": "Keep pens, clips, and small items organized.",
      "price": 12.99,
      "stock": 60
    },
    {
      "title": "Desk Organizer",
      "size": "Large",
      "description": "Keep pens, clips, and small items organized.",
      "price": 12.99,
      "stock": 60
    }
  ],
  "Pets": [
    {
      "title": "Dog Treats",
      "size": "200 g",
      "description": "Tasty training treats for dogs.",
      "price": 4.99,
      "stock": 140
    },
    {
      "title": "Dog Treats",
      "size": "500 g",
      "description": "Tasty training treats for dogs.",
      "price": 4.99,
      "stock": 140
    },
    {
      "title": "Cat Toy Feather Wand",
      "size": "Short",
      "description": "Interactive toy to keep cats active and entertained.",
      "price": 6.99,
      "stock": 80
    },
    {
      "title": "Cat Toy Feather Wand",
      "size": "Long",
      "description": "Interactive toy to keep cats active and entertained.",
      "price": 6.99,
      "stock": 80
    },
    {
      "title": "Pet Bowl Stainless Steel",
      "size": "Small",
      "description": "Easy-clean stainless steel bowl for food or water.",
      "price": 7.49,
      "stock": 110
    },
    {
      "title": "Pet Bowl Stainless Steel",
      "size": "Large",
      "description": "Easy-clean stainless steel bowl for food or water.",
      "price": 7.49,
      "stock": 110
    },
    {
      "title": "Dog Leash",
      "size": "1.5 m",
      "description": "Strong leash with comfortable handle.",
      "price": 9.99,
      "stock": 65
    },
    {
      "title": "Dog Leash",
      "size": "3 m",
      "description": "Strong leash with comfortable handle.",
      "price": 9.99,
      "stock": 65
    },
    {
      "title": "Cat Litter",
      "size": "5 L",
      "description": "Clumping litter for easy odor control.",
      "price": 8.99,
      "stock": 70
    },
    {
      "title": "Cat Litter",
      "size": "10 L",
      "description": "Clumping litter for easy odor control.",
      "price": 8.99,
      "stock": 70
    }
  ]
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
        size: p.size,
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
