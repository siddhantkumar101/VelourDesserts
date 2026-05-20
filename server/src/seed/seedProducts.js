require('dotenv').config();
const mongoose = require('mongoose');
const Product = require('../models/Product.model');
const connectDB = require('../config/db');

const products = [
  {
    name: 'Belgian Dark Chocolate Entremet',
    slug: 'belgian-dark-chocolate-entremet',
    description: 'Layers of 70% Valrhona dark chocolate mousse, hazelnut praline feuilletine crunch, and moist chocolate biscuit. Finished with a jet-black mirror glaze and gold leaf. The crown jewel of our patisserie.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&auto=format&fit=crop&q=80', altText: 'Belgian Dark Chocolate Entremet', isPrimary: true }],
    variants: [
      { label: '6" Round (8 pax)', size: '6 inch', servings: 8, priceINR: 2800, stockCapPerDay: 5, isAvailable: true },
      { label: '8" Round (15 pax)', size: '8 inch', servings: 15, priceINR: 4200, stockCapPerDay: 3, isAvailable: true }
    ],
    flavours: ['Dark Chocolate', 'Hazelnut'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 300 }],
    basePrice: 2800, hasGiftWrapping: true, giftWrappingSurcharge: 200,
    leadTimeDays: 3, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'Belgian Dark Chocolate Entremet | Velour Desserts',
    metaDescription: 'Luxury Valrhona dark chocolate mousse cake with mirror glaze. Order online.',
    tags: ['chocolate', 'premium', 'bestseller', 'entremet']
  },
  {
    name: 'Pistachio Rose Cream Tart',
    slug: 'pistachio-rose-cream-tart',
    description: 'Crisp pâte sucrée shell filled with pistachio frangipane and Chantilly cream, decorated with crystallised rose petals, fresh raspberries, and crushed Iranian pistachios. A showstopper for any occasion.',
    category: 'Tarts',
    images: [{ url: 'https://images.unsplash.com/photo-1519869325930-281384150729?w=800&auto=format&fit=crop&q=80', altText: 'Pistachio Rose Cream Tart', isPrimary: true }],
    variants: [
      { label: '7" Tart (8 pax)', size: '7 inch', servings: 8, priceINR: 1950, stockCapPerDay: 8, isAvailable: true }
    ],
    flavours: ['Pistachio', 'Rose'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 1950, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 2, allowsCustomMessage: false, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'Pistachio Rose Cream Tart | Velour Desserts',
    metaDescription: 'Elegant pistachio frangipane tart with rose cream and fresh raspberries.',
    tags: ['pistachio', 'rose', 'tart', 'floral']
  },
  {
    name: 'Tiramisu Layer Cake',
    slug: 'tiramisu-layer-cake',
    description: 'Soft espresso-drenched savoiardi sponge, layered with silky mascarpone zabaglione cream and dusted with premium Valrhona cocoa. Set in a luxury acetate collar for a stunning reveal.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=800&auto=format&fit=crop&q=80', altText: 'Tiramisu Layer Cake', isPrimary: true }],
    variants: [
      { label: '6" Round (8 pax)', size: '6 inch', servings: 8, priceINR: 2100, stockCapPerDay: 6, isAvailable: true },
      { label: '8" Round (14 pax)', size: '8 inch', servings: 14, priceINR: 3200, stockCapPerDay: 4, isAvailable: true }
    ],
    flavours: ['Espresso', 'Mascarpone'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 2100, hasGiftWrapping: true, giftWrappingSurcharge: 200,
    leadTimeDays: 2, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'Tiramisu Layer Cake | Velour Desserts',
    metaDescription: 'Classic Italian tiramisu elevated into a stunning layer cake.',
    tags: ['tiramisu', 'coffee', 'italian', 'classic']
  },
  {
    name: 'Lemon Meringue Tart',
    slug: 'lemon-meringue-tart',
    description: 'Zingy, citrusy lemon curd sits in a crisp all-butter pâte sablée shell, crowned with hand-torched Italian meringue peaks. A perfect balance of tart and sweet.',
    category: 'Tarts',
    images: [{ url: 'https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&auto=format&fit=crop&q=80', altText: 'Lemon Meringue Tart', isPrimary: true }],
    variants: [
      { label: '7" Tart (8 pax)', size: '7 inch', servings: 8, priceINR: 1750, stockCapPerDay: 8, isAvailable: true }
    ],
    flavours: ['Lemon', 'Meringue'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 1750, hasGiftWrapping: true, giftWrappingSurcharge: 100,
    leadTimeDays: 2, allowsCustomMessage: false, allowsSpecialInstructions: true,
    isActive: true, isFeatured: false,
    metaTitle: 'Lemon Meringue Tart | Velour Desserts',
    metaDescription: 'Classic French lemon meringue tart with torched Italian meringue.',
    tags: ['lemon', 'meringue', 'tart', 'citrus']
  },
  {
    name: 'Strawberry Vanilla Chantilly Cake',
    slug: 'strawberry-vanilla-chantilly-cake',
    description: 'Light, cloud-like vanilla genoise sponge layered with fresh strawberry coulis and whipped vanilla bean Chantilly cream. Topped with glazed whole strawberries and micro herbs.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=800&auto=format&fit=crop&q=80', altText: 'Strawberry Vanilla Chantilly Cake', isPrimary: true }],
    variants: [
      { label: '6" Round (8 pax)', size: '6 inch', servings: 8, priceINR: 1850, stockCapPerDay: 8, isAvailable: true },
      { label: '8" Round (14 pax)', size: '8 inch', servings: 14, priceINR: 2900, stockCapPerDay: 5, isAvailable: true }
    ],
    flavours: ['Vanilla', 'Strawberry'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 250 }],
    basePrice: 1850, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 2, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: false,
    metaTitle: 'Strawberry Vanilla Chantilly Cake | Velour Desserts',
    metaDescription: 'Delicate vanilla cake with fresh strawberries and Chantilly cream.',
    tags: ['strawberry', 'vanilla', 'chantilly', 'fresh']
  },
  {
    name: 'New York Blueberry Cheesecake',
    slug: 'new-york-blueberry-cheesecake',
    description: 'Dense, creamy New York-style cheesecake on a graham cracker and butter crust, topped with a vibrant fresh blueberry compote. No cracks. No shortcuts. Pure indulgence.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=800&auto=format&fit=crop&q=80', altText: 'New York Blueberry Cheesecake', isPrimary: true }],
    variants: [
      { label: '7" Round (10 pax)', size: '7 inch', servings: 10, priceINR: 2400, stockCapPerDay: 6, isAvailable: true }
    ],
    flavours: ['Vanilla', 'Blueberry'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 2400, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 3, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'New York Blueberry Cheesecake | Velour Desserts',
    metaDescription: 'Classic New York cheesecake with fresh blueberry compote topping.',
    tags: ['cheesecake', 'blueberry', 'newyork', 'classic']
  },
  {
    name: 'Salted Caramel Pecan Tart',
    slug: 'salted-caramel-pecan-tart',
    description: 'House-made salted caramel, roasted whole pecans, and a hint of fleur de sel, all nestled in a crisp butter tart shell. Served with our signature bourbon caramel drizzle.',
    category: 'Tarts',
    images: [{ url: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=800&auto=format&fit=crop&q=80', altText: 'Salted Caramel Pecan Tart', isPrimary: true }],
    variants: [
      { label: '7" Tart (8 pax)', size: '7 inch', servings: 8, priceINR: 1900, stockCapPerDay: 8, isAvailable: true }
    ],
    flavours: ['Salted Caramel', 'Pecan'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 1900, hasGiftWrapping: true, giftWrappingSurcharge: 100,
    leadTimeDays: 2, allowsCustomMessage: false, allowsSpecialInstructions: true,
    isActive: true, isFeatured: false,
    metaTitle: 'Salted Caramel Pecan Tart | Velour Desserts',
    metaDescription: 'Rich salted caramel and pecan tart with fleur de sel and butter pastry.',
    tags: ['caramel', 'pecan', 'tart', 'salted']
  },
  {
    name: 'Signature Chunky Cookie Box (12pc)',
    slug: 'signature-chunky-cookie-box-12pc',
    description: 'A baker\'s dozen of our legendary thick, chewy cookies. Each box features: 4x Sea Salt Dark Chocolate Chunk, 4x Brown Butter Macadamia White Choc, and 4x Espresso Double Fudge. Individually wrapped.',
    category: 'Cookies',
    images: [{ url: 'https://images.unsplash.com/photo-1499636136210-6f4ee915583e?w=800&auto=format&fit=crop&q=80', altText: 'Chunky Cookie Box', isPrimary: true }],
    variants: [
      { label: 'Box of 12', size: '12 pieces', servings: 12, priceINR: 1400, stockCapPerDay: 15, isAvailable: true },
      { label: 'Box of 6', size: '6 pieces', servings: 6, priceINR: 750, stockCapPerDay: 20, isAvailable: true }
    ],
    flavours: ['Assorted'],
    dietaryOptions: [],
    basePrice: 750, hasGiftWrapping: true, giftWrappingSurcharge: 100,
    leadTimeDays: 1, allowsCustomMessage: false, allowsSpecialInstructions: false,
    isActive: true, isFeatured: true,
    metaTitle: 'Signature Chunky Cookie Box | Velour Desserts',
    metaDescription: 'Box of thick, chewy artisan cookies. Perfect for gifting or indulging.',
    tags: ['cookies', 'chocolate', 'chunky', 'gifting']
  },
  {
    name: 'French Macaron Box (12pc)',
    slug: 'french-macaron-box-12pc',
    description: 'A curated box of 12 hand-piped Parisian macarons with perfectly ruffled feet. Flavours: Salted Caramel, Dark Chocolate Ganache, Pistachio, Raspberry Rose, Matcha, and Vanilla Bean.',
    category: 'Gifting',
    images: [{ url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=800&auto=format&fit=crop&q=80', altText: 'French Macaron Box', isPrimary: true }],
    variants: [
      { label: 'Box of 12', size: '12 pieces', servings: 12, priceINR: 2200, stockCapPerDay: 10, isAvailable: true },
      { label: 'Box of 6', size: '6 pieces', servings: 6, priceINR: 1200, stockCapPerDay: 15, isAvailable: true }
    ],
    flavours: ['Assorted'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 1200, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 2, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'French Macaron Box | Velour Desserts',
    metaDescription: 'Hand-piped Parisian macarons in 6 premium flavours. Perfect gifting box.',
    tags: ['macarons', 'french', 'gifting', 'premium']
  },
  {
    name: 'Luxury Dessert Hamper',
    slug: 'luxury-dessert-hamper',
    description: 'Our most indulgent gifting experience: a handcrafted wicker hamper containing one 6" entremet cake, a macaron box (6pc), a cookie box (6pc), a jar of house-made salted caramel sauce, and a 100g artisan chocolate bar. Ribbon-tied and personalised.',
    category: 'Gifting',
    images: [{ url: 'https://images.unsplash.com/photo-1607349913338-fca6f7fc42d0?w=800&auto=format&fit=crop&q=80', altText: 'Luxury Dessert Hamper', isPrimary: true }],
    variants: [
      { label: 'Standard Hamper', size: 'Assorted', servings: 10, priceINR: 5500, stockCapPerDay: 5, isAvailable: true },
      { label: 'Grand Hamper', size: 'Large', servings: 20, priceINR: 8500, stockCapPerDay: 3, isAvailable: true }
    ],
    flavours: ['Assorted'],
    dietaryOptions: [{ label: 'Eggless Options', isAvailable: true, surchargeINR: 600 }],
    basePrice: 5500, hasGiftWrapping: false, giftWrappingSurcharge: 0,
    leadTimeDays: 4, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true, isSeasonal: false,
    metaTitle: 'Luxury Dessert Hamper | Velour Desserts',
    metaDescription: 'Premium artisan dessert hamper with cake, macarons, cookies, and more.',
    tags: ['hamper', 'gifting', 'luxury', 'premium']
  },
  {
    name: 'Red Velvet Cream Cheese Cake',
    slug: 'red-velvet-cream-cheese-cake',
    description: 'Vibrant crimson velvet layers with a subtle cocoa depth, sandwiched with tangy cream cheese frosting and finished with velvet crumb coating. A timeless American classic done the Velour way.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1616541823729-00fe0aacd32c?w=800&auto=format&fit=crop&q=80', altText: 'Red Velvet Cream Cheese Cake', isPrimary: true }],
    variants: [
      { label: '6" Round (8 pax)', size: '6 inch', servings: 8, priceINR: 2000, stockCapPerDay: 7, isAvailable: true },
      { label: '8" Round (14 pax)', size: '8 inch', servings: 14, priceINR: 3100, stockCapPerDay: 4, isAvailable: true }
    ],
    flavours: ['Red Velvet', 'Cream Cheese'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 200 }],
    basePrice: 2000, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 2, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: false,
    metaTitle: 'Red Velvet Cream Cheese Cake | Velour Desserts',
    metaDescription: 'Classic red velvet cake with tangy cream cheese frosting. Order online.',
    tags: ['red velvet', 'cream cheese', 'classic', 'cake']
  },
  {
    name: 'Dark Chocolate Truffle Box (16pc)',
    slug: 'dark-chocolate-truffle-box-16pc',
    description: 'Hand-rolled Belgian dark chocolate truffles with silky ganache centres. Finishes include: cocoa powder, crushed pistachio, gold dust, and candied orange zest. Presented in a magnetic closure luxury box.',
    category: 'Gifting',
    images: [{ url: 'https://images.unsplash.com/photo-1544982503-9f984c14501a?w=800&auto=format&fit=crop&q=80', altText: 'Dark Chocolate Truffle Box', isPrimary: true }],
    variants: [
      { label: 'Box of 16', size: '16 pieces', servings: 8, priceINR: 2600, stockCapPerDay: 10, isAvailable: true },
      { label: 'Box of 9', size: '9 pieces', servings: 4, priceINR: 1550, stockCapPerDay: 15, isAvailable: true }
    ],
    flavours: ['Dark Chocolate', 'Assorted'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 1550, hasGiftWrapping: true, giftWrappingSurcharge: 150,
    leadTimeDays: 2, allowsCustomMessage: true, allowsSpecialInstructions: false,
    isActive: true, isFeatured: false,
    metaTitle: 'Dark Chocolate Truffle Box | Velour Desserts',
    metaDescription: 'Hand-rolled Belgian chocolate truffles in a luxury presentation box.',
    tags: ['truffles', 'chocolate', 'gifting', 'belgian']
  },
  {
    name: 'Mango Passionfruit Verrine',
    slug: 'mango-passionfruit-verrine',
    description: 'Tropical layers of fresh Alphonso mango mousse, tangy passionfruit curd, and a coconut panna cotta base served in elegant tall verrine glasses. Available as a set of 4.',
    category: 'Seasonal',
    images: [{ url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80', altText: 'Mango Passionfruit Verrine', isPrimary: true }],
    variants: [
      { label: 'Set of 4 glasses', size: '4 verrines', servings: 4, priceINR: 1600, stockCapPerDay: 10, isAvailable: true }
    ],
    flavours: ['Mango', 'Passionfruit', 'Coconut'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 1600, hasGiftWrapping: true, giftWrappingSurcharge: 100,
    leadTimeDays: 2, allowsCustomMessage: false, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'Mango Passionfruit Verrine | Velour Desserts',
    metaDescription: 'Tropical Alphonso mango and passionfruit verrine desserts. Set of 4.',
    tags: ['mango', 'tropical', 'seasonal', 'verrine']
  },
  {
    name: 'Hazelnut Praline Opera Cake',
    slug: 'hazelnut-praline-opera-cake',
    description: 'Six precision layers of coffee-soaked joconde sponge, hazelnut praline buttercream, and dark chocolate ganache — all crowned with a flawless chocolate mirror glaze. A true French masterpiece.',
    category: 'Cakes',
    images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80', altText: 'Hazelnut Praline Opera Cake', isPrimary: true }],
    variants: [
      { label: '6" Square (8 pax)', size: '6 inch square', servings: 8, priceINR: 3200, stockCapPerDay: 4, isAvailable: true }
    ],
    flavours: ['Coffee', 'Hazelnut', 'Dark Chocolate'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: false, surchargeINR: 0 }],
    basePrice: 3200, hasGiftWrapping: true, giftWrappingSurcharge: 200,
    leadTimeDays: 4, allowsCustomMessage: true, allowsSpecialInstructions: true,
    isActive: true, isFeatured: true,
    metaTitle: 'Hazelnut Praline Opera Cake | Velour Desserts',
    metaDescription: 'Classic French Opera cake with hazelnut praline. A patisserie masterpiece.',
    tags: ['opera', 'hazelnut', 'coffee', 'french', 'premium']
  },
  {
    name: 'Matcha White Chocolate Tart',
    slug: 'matcha-white-chocolate-tart',
    description: 'Premium ceremonial-grade Japanese matcha custard tart topped with silky white chocolate ganache rosettes and shaved matcha. A sophisticated Japanese-French fusion.',
    category: 'Tarts',
    images: [{ url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=800&auto=format&fit=crop&q=80', altText: 'Matcha White Chocolate Tart', isPrimary: true }],
    variants: [
      { label: '7" Tart (8 pax)', size: '7 inch', servings: 8, priceINR: 2100, stockCapPerDay: 6, isAvailable: true }
    ],
    flavours: ['Matcha', 'White Chocolate'],
    dietaryOptions: [{ label: 'Eggless', isAvailable: true, surchargeINR: 0 }],
    basePrice: 2100, hasGiftWrapping: true, giftWrappingSurcharge: 100,
    leadTimeDays: 2, allowsCustomMessage: false, allowsSpecialInstructions: true,
    isActive: true, isFeatured: false,
    metaTitle: 'Matcha White Chocolate Tart | Velour Desserts',
    metaDescription: 'Ceremonial grade matcha tart with white chocolate ganache. Japanese-French fusion.',
    tags: ['matcha', 'white chocolate', 'japanese', 'tart']
  }
];

const seedProducts = async () => {
  try {
    await connectDB();
    console.log('Clearing existing products...');
    await Product.deleteMany({});
    console.log('Inserting 15 premium products with real market prices...');
    await Product.insertMany(products);
    console.log('✅ 15 artisan products seeded successfully with genuine Indian market prices!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    process.exit(1);
  }
};

seedProducts();
