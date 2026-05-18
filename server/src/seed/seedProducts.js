require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const connectDB = require('../config/db');

const products = [
  {
    name: 'Belgian Chocolate Entremet',
    slug: 'belgian-chocolate-entremet',
    description: 'A luxurious dark chocolate mousse layered with hazelnut praline crunch and moist chocolate sponge, finished with a mirror glaze.',
    category: 'Cakes',
    images: [{ url: 'https://placehold.co/800x1000/2C1810/FFFFFF?text=Belgian+Chocolate+Entremet', altText: 'Belgian Chocolate Entremet', isPrimary: true }],
    variants: [
      { label: '6" Round', size: '6 inch', servings: 8, priceINR: 2200, stockCapPerDay: 5, isAvailable: true },
      { label: '8" Round', size: '8 inch', servings: 15, priceINR: 3500, stockCapPerDay: 3, isAvailable: true }
    ],
    flavours: ['Dark Chocolate', 'Hazelnut'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 200 }],
    basePrice: 2200,
    hasGiftWrapping: true,
    giftWrappingSurcharge: 150,
    leadTimeDays: 3,
    allowsCustomMessage: true,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: true,
    metaTitle: 'Belgian Chocolate Entremet | Velour Desserts',
    metaDescription: 'Luxurious dark chocolate mousse layered with hazelnut praline crunch. Perfect for celebrations.',
    tags: ['chocolate', 'premium', 'bestseller']
  },
  {
    name: 'Pistachio Rose Tart',
    slug: 'pistachio-rose-tart',
    description: 'Crisp buttery tart shell filled with fragrant pistachio frangipane, topped with rose-infused white chocolate ganache and dried petals.',
    category: 'Tarts',
    images: [{ url: 'https://placehold.co/800x1000/4A7C59/FFFFFF?text=Pistachio+Rose+Tart', altText: 'Pistachio Rose Tart', isPrimary: true }],
    variants: [
      { label: '8" Tart', size: '8 inch', servings: 8, priceINR: 1800, stockCapPerDay: 8, isAvailable: true }
    ],
    flavours: ['Pistachio', 'Rose'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 1800,
    hasGiftWrapping: true,
    giftWrappingSurcharge: 100,
    leadTimeDays: 2,
    allowsCustomMessage: false,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: true,
    metaTitle: 'Pistachio Rose Tart | Velour Desserts',
    metaDescription: 'Fragrant pistachio frangipane tart with rose-infused ganache.',
    tags: ['pistachio', 'rose', 'floral']
  },
  {
    name: 'Classic Victoria Sponge',
    slug: 'classic-victoria-sponge',
    description: 'Light and airy vanilla sponge layered with house-made strawberry conserve and whipped vanilla bean mascarpone cream.',
    category: 'Cakes',
    images: [{ url: 'https://placehold.co/800x1000/E8C5BC/2C1810?text=Victoria+Sponge', altText: 'Victoria Sponge', isPrimary: true }],
    variants: [
      { label: '6" Round', size: '6 inch', servings: 8, priceINR: 1500, stockCapPerDay: 10, isAvailable: true },
      { label: '8" Round', size: '8 inch', servings: 15, priceINR: 2400, stockCapPerDay: 6, isAvailable: true }
    ],
    flavours: ['Vanilla', 'Strawberry'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 1500,
    hasGiftWrapping: true,
    giftWrappingSurcharge: 150,
    leadTimeDays: 2,
    allowsCustomMessage: true,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: false,
    metaTitle: 'Classic Victoria Sponge Cake | Velour Desserts',
    metaDescription: 'Traditional Victoria sponge with house-made strawberry conserve and mascarpone cream.',
    tags: ['vanilla', 'classic', 'fruit']
  },
  {
    name: 'Assorted Cookie Box (12pc)',
    slug: 'assorted-cookie-box-12pc',
    description: 'A selection of our signature chunky cookies: Sea Salt Chocolate Chunk, Double Chocolate Fudge, and Brown Butter Macadamia.',
    category: 'Cookies',
    images: [{ url: 'https://placehold.co/800x1000/B8965A/FFFFFF?text=Cookie+Box', altText: 'Cookie Box', isPrimary: true }],
    variants: [
      { label: 'Box of 12', size: '12 pieces', servings: 12, priceINR: 1200, stockCapPerDay: 15, isAvailable: true }
    ],
    flavours: ['Assorted'],
    dietaryOptions: [],
    basePrice: 1200,
    hasGiftWrapping: true,
    giftWrappingSurcharge: 100,
    leadTimeDays: 2,
    allowsCustomMessage: false,
    allowsSpecialInstructions: false,
    isActive: true,
    isFeatured: true,
    metaTitle: 'Assorted Chunky Cookie Box | Velour Desserts',
    metaDescription: 'Box of 12 signature chunky cookies. Perfect for gifting or sharing.',
    tags: ['cookies', 'gifting', 'chocolate']
  },
  {
    name: 'Festive Gifting Hamper',
    slug: 'festive-gifting-hamper',
    description: 'The ultimate luxury hamper featuring an assortment of tarts, cookies, macarons, and a jar of house-made salted caramel.',
    category: 'Gifting',
    images: [{ url: 'https://placehold.co/800x1000/C9897B/FFFFFF?text=Gifting+Hamper', altText: 'Gifting Hamper', isPrimary: true }],
    variants: [
      { label: 'Standard Hamper', size: 'Assorted', servings: 10, priceINR: 4500, stockCapPerDay: 5, isAvailable: true },
      { label: 'Premium Hamper', size: 'Large Assortment', servings: 20, priceINR: 6500, stockCapPerDay: 3, isAvailable: true }
    ],
    flavours: ['Assorted'],
    dietaryOptions: [{ label: 'Eggless Options', isAvailable: true, surchargeINR: 500 }],
    basePrice: 4500,
    hasGiftWrapping: true,
    giftWrappingSurcharge: 0,
    leadTimeDays: 4,
    allowsCustomMessage: true,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: true,
    isSeasonal: true,
    metaTitle: 'Luxury Festive Gifting Hamper | Velour Desserts',
    metaDescription: 'Premium assortment of artisanal desserts in a beautiful gifting box.',
    tags: ['hamper', 'gifting', 'festive']
  }
];

// Add 25 more similar items to reach 30 products
for (let i = 1; i <= 25; i++) {
  products.push({
    name: `Artisan Dessert Model ${i}`,
    slug: `artisan-dessert-model-${i}`,
    description: 'A beautifully handcrafted dessert perfect for any occasion. Made with premium ingredients.',
    category: ['Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'][i % 5],
    images: [{ url: `https://placehold.co/800x1000/F0E8DF/5C3D2E?text=Dessert+${i}`, altText: `Dessert ${i}`, isPrimary: true }],
    variants: [
      { label: 'Standard', size: 'Regular', servings: 4, priceINR: 800 + (i * 100), stockCapPerDay: 10, isAvailable: true }
    ],
    flavours: ['Vanilla', 'Chocolate', 'Fruit'][i % 3],
    dietaryOptions: [],
    basePrice: 800 + (i * 100),
    hasGiftWrapping: i % 2 === 0,
    giftWrappingSurcharge: 100,
    leadTimeDays: (i % 3) + 2,
    allowsCustomMessage: i % 2 === 0,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: i % 7 === 0,
    metaTitle: `Artisan Dessert ${i} | Velour Desserts`,
    metaDescription: 'Premium handcrafted dessert.',
    tags: ['dessert', 'artisan']
  });
}

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    
    console.log('Inserting seed products...');
    await Product.insertMany(products);
    
    console.log('✅ 30 products seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
