import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';
import { productService } from '../../services/product.service';
import { formatCurrency } from '../../utils/formatCurrency';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        setFeaturedProducts(response.data.products);
      } catch (error) {
        console.error('Failed to load featured products', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: 'url(https://placehold.co/1920x1080/2C1810/FAF6F1?text=Luxury+Desserts)' }}
        >
          <div className="absolute inset-0 bg-chocolate/40 backdrop-blur-[2px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 page-transition">
          <span className="text-rose-light tracking-[0.2em] uppercase text-sm font-semibold">
            Handcrafted with Passion
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-bold leading-tight">
            Elevate Your Everyday <br className="hidden md:block" />
            <span className="text-rose-light italic font-normal">Celebrations</span>
          </h1>
          <p className="text-cream/90 text-lg md:text-xl max-w-2xl font-serif">
            Artisanal entremets, signature tarts, and chunky cookies made to order using the finest Belgian chocolate and locally sourced ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <Link to={ROUTES.SHOP}>
              <Button size="lg" className="w-full sm:w-auto px-10 shadow-modal">
                Shop the Collection
              </Button>
            </Link>
            <Link to="/custom-orders">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-cream hover:bg-white/10 hover:text-white border border-cream/20">
                Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-24 bg-cream px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl text-chocolate font-bold mb-4">
                Signature <span className="italic text-rose font-normal">Creations</span>
              </h2>
              <p className="text-chocolate/70 font-serif text-lg">
                Discover our most loved artisanal desserts, handcrafted daily in small batches to ensure absolute perfection.
              </p>
            </div>
            <Link to={ROUTES.SHOP} className="group flex items-center gap-2 text-rose font-medium hover:text-rose-dark transition-colors whitespace-nowrap">
              View Entire Menu 
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-cream-dark w-full aspect-[4/5] rounded-xl" />
                  <div className="bg-cream-dark h-6 w-3/4 rounded" />
                  <div className="bg-cream-dark h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {featuredProducts.slice(0, 3).map((product) => (
                <Link key={product._id} to={ROUTES.PRODUCT_DETAIL(product.slug)} className="group flex flex-col gap-4 hover-lift">
                  <div className="relative w-full aspect-[4/5] rounded-xl overflow-hidden bg-cream-dark">
                    <img 
                      src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.dietaryOptions.some(d => d.label.toLowerCase().includes('eggless')) && (
                        <span className="bg-white/90 backdrop-blur-sm text-chocolate px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full shadow-sm">
                          Eggless Option
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-2xl font-semibold text-chocolate group-hover:text-rose transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-chocolate/60 text-sm mb-1">
                      <span className="uppercase tracking-widest text-[10px] font-bold text-rose">{product.category}</span>
                    </div>
                    <p className="text-chocolate font-medium mt-1 text-lg">
                      From {formatCurrency(product.basePrice)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Brand Value Section */}
      <section className="py-24 bg-chocolate text-cream relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Crafted Without <br />
                <span className="italic text-rose font-normal">Compromise</span>
              </h2>
              <div className="flex flex-col gap-6 font-serif text-lg text-cream/80">
                <p>
                  At Velour Desserts, we believe that true luxury lies in the details. Every element of our creations is meticulously handcrafted from scratch in our studio.
                </p>
                <p>
                  We never use artificial flavorings or pre-made mixes. From our pure pistachio pastes to our house-made fruit conserves and rich Belgian chocolate ganaches, we source only the finest ingredients globally and locally to ensure an unforgettable tasting experience.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-2">
                  <Star className="w-8 h-8 text-rose" />
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Premium Sourcing</h4>
                  <p className="text-sm text-cream/70">Finest Callebaut chocolate and fresh local produce.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Star className="w-8 h-8 text-rose" />
                  <h4 className="font-bold text-white uppercase tracking-wider text-sm">Made to Order</h4>
                  <p className="text-sm text-cream/70">Baked fresh specifically for your scheduled delivery.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] w-full rounded-2xl overflow-hidden shadow-2xl relative z-10 border-4 border-rose/20">
                <img 
                  src="https://placehold.co/800x1000/3A2012/FFFFFF?text=Studio+Craftsmanship" 
                  alt="Pastry Chef Crafting" 
                  className="w-full h-full object-cover"
                />
              </div>
              {/* Decorative elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-rose/20 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-10 -left-10 w-64 h-64 bg-gold/10 rounded-full blur-3xl z-0" />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
