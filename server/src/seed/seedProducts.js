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
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', altText: 'Belgian Chocolate Entremet', isPrimary: true }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80', altText: 'Pistachio Rose Tart', isPrimary: true }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80', altText: 'Victoria Sponge', isPrimary: true }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80', altText: 'Cookie Box', isPrimary: true }],
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
    images: [{ url: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&auto=format&fit=crop&q=80', altText: 'Gifting Hamper', isPrimary: true }],
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

// Rich descriptions, gourmet names and real food photography for remaining 25 items
const menuTemplates = [
  {
    name: 'Tiramisu Classic Cake',
    category: 'Cakes',
    description: 'Espresso-soaked ladyfingers layered with rich vanilla bean mascarpone zabaglione and dusted with premium cocoa powder.',
    image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80',
    flavours: ['Coffee', 'Mascarpone'],
    basePrice: 1900
  },
  {
    name: 'Lemon Meringue Tart',
    category: 'Tarts',
    description: 'Crisp pastry shell loaded with tangy, zesty lemon curd, crowned with toasted pillowy Italian meringue swirls.',
    image: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80',
    flavours: ['Lemon', 'Meringue'],
    basePrice: 1600
  },
  {
    name: 'Double Chocolate Fudge Cookie Box',
    category: 'Cookies',
    description: 'Decadent chocolate cookies loaded with rich chocolate fudge chips and topped with a sprinkle of maldon sea salt.',
    image: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80',
    flavours: ['Double Chocolate'],
    basePrice: 950
  },
  {
    name: 'Gourmet Macaron Assortment (12pc)',
    category: 'Gifting',
    description: 'An elegant selection of French macarons featuring Salted Caramel, Dark Chocolate Ganache, Pistachio, and Raspberry.',
    image: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop&q=80',
    flavours: ['Assorted'],
    basePrice: 2100
  },
  {
    name: 'Summer Berry Cheesecake',
    category: 'Cakes',
    description: 'Creamy New York style cheesecake on a graham cracker crust, topped with fresh strawberries, blueberries, and raspberries.',
    image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80',
    flavours: ['Vanilla', 'Mixed Berry'],
    basePrice: 2400
  },
  {
    name: 'Salted Caramel Pecan Tart',
    category: 'Tarts',
    description: 'Rich, gooey house-made salted caramel and toasted premium pecans inside a crisp, buttery pastry crust.',
    image: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&auto=format&fit=crop&q=80',
    flavours: ['Caramel', 'Pecan'],
    basePrice: 1750
  },
  {
    name: 'Red Velvet Gourmet Cupcakes (6pc)',
    category: 'Seasonal',
    description: 'Moist red velvet cupcakes with a hint of cocoa, piled high with velvety cream cheese frosting and sugar pearls.',
    image: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&auto=format&fit=crop&q=80',
    flavours: ['Vanilla', 'Cream Cheese'],
    basePrice: 1100
  },
  {
    name: 'Dark Chocolate Truffle Box (16pc)',
    category: 'Gifting',
    description: 'Silky smooth hand-rolled Belgian dark chocolate truffles, dusted in cocoa and fine pistachio crumble.',
    image: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&auto=format&fit=crop&q=80',
    flavours: ['Dark Chocolate'],
    basePrice: 2200
  }
];

// Generate the remaining 25 products dynamically using these gorgeous templates
for (let i = 1; i <= 25; i++) {
  const template = menuTemplates[(i - 1) % menuTemplates.length];
  const uniqueName = i > 8 ? `${template.name} Series II` : template.name;
  products.push({
    name: uniqueName,
    slug: `${template.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}-${i}`,
    description: template.description,
    category: template.category,
    images: [{ url: template.image, altText: uniqueName, isPrimary: true }],
    variants: [
      { label: 'Standard size', size: 'Regular', servings: 6, priceINR: template.basePrice + (i * 20), stockCapPerDay: 12, isAvailable: true }
    ],
    flavours: template.flavours,
    dietaryOptions: [{ label: 'Eggless Option', isAvailable: true, surchargeINR: 150 }],
    basePrice: template.basePrice + (i * 20),
    hasGiftWrapping: i % 2 === 0,
    giftWrappingSurcharge: 120,
    leadTimeDays: 2,
    allowsCustomMessage: true,
    allowsSpecialInstructions: true,
    isActive: true,
    isFeatured: i % 4 === 0,
    metaTitle: `${uniqueName} | Velour Desserts`,
    metaDescription: template.description,
    tags: ['dessert', 'artisan', 'gourmet']
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
