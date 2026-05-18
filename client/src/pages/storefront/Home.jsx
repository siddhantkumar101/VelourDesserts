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
      <section className="relative w-full h-[90vh] min-h-[650px] flex items-center justify-center overflow-hidden">
        {/* Background Image & Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat scale-105 animate-[pulse_10s_infinite]"
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=1600&auto=format&fit=crop&q=80)' }}
        >
          <div className="absolute inset-0 bg-chocolate/45 backdrop-blur-[1px]" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center px-4 max-w-4xl mx-auto flex flex-col items-center gap-6 page-transition">
          <span className="text-rose-light tracking-[0.25em] uppercase text-xs font-semibold bg-rose/20 px-3 py-1.5 rounded-full border border-rose-light/10">
            Handcrafted with Passion
          </span>
          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl text-cream font-bold leading-tight drop-shadow-md">
            Elevate Your Everyday <br className="hidden md:block" />
            <span className="text-rose-light italic font-normal">Celebrations</span>
          </h1>
          <p className="text-cream/90 text-lg md:text-xl max-w-2xl font-serif leading-relaxed drop-shadow-sm">
            Artisanal entremets, signature tarts, and chunky cookies made to order using the finest Belgian chocolate and locally sourced ingredients.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <Link to={ROUTES.SHOP}>
              <Button size="lg" className="w-full sm:w-auto px-10 shadow-modal bg-rose text-white hover:bg-rose-dark shadow-hover text-base">
                Shop the Collection
              </Button>
            </Link>
            <Link to="/custom-orders">
              <Button variant="ghost" size="lg" className="w-full sm:w-auto text-cream hover:bg-cream hover:text-chocolate border border-cream/35 text-base transition-colors duration-300">
                Request Custom Order
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Collection Section */}
      <section className="py-24 bg-cream px-4 sm:px-6 lg:px-8 reveal-left">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl text-chocolate font-bold mb-4">
                Signature <span className="italic text-rose font-normal">Creations</span>
              </h2>
              <p className="text-chocolate/70 font-serif text-lg leading-relaxed">
                Discover our most loved artisanal desserts, handcrafted daily in small batches to ensure absolute perfection.
              </p>
            </div>
            <Link to={ROUTES.SHOP} className="group flex items-center gap-2 text-rose font-semibold tracking-wider hover:text-rose-dark transition-colors whitespace-nowrap uppercase text-sm border-b border-rose/25 pb-1">
              View Entire Menu 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-cream-dark w-full aspect-[4/5] rounded-3xl" />
                  <div className="bg-cream-dark h-6 w-3/4 rounded" />
                  <div className="bg-cream-dark h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => (
                <Link 
                  key={product._id} 
                  to={ROUTES.PRODUCT_DETAIL(product.slug)} 
                  className="group flex flex-col gap-5 hover-lift hover-glow bg-white p-5 rounded-[32px] border border-chocolate/5 shadow-sm transition-all duration-300"
                >
                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-cream-dark">
                    <img 
                      src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.dietaryOptions.some(d => d.label.toLowerCase().includes('eggless')) && (
                        <span className="bg-white/95 backdrop-blur-sm text-chocolate px-3 py-1 text-[10px] font-bold uppercase tracking-widest rounded-full shadow-sm">
                          Eggless Option
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 px-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-2xl font-bold text-chocolate group-hover:text-rose transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-chocolate/60 text-xs">
                      <span className="uppercase tracking-widest font-bold text-rose">{product.category}</span>
                    </div>
                    <p className="text-rose font-display font-bold mt-1 text-xl">
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
      <section className="py-24 bg-chocolate text-cream relative overflow-hidden reveal-right">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="flex flex-col gap-8">
              <h2 className="font-display text-4xl md:text-5xl font-bold leading-tight">
                Crafted Without <br />
                <span className="italic text-rose font-normal">Compromise</span>
              </h2>
              <div className="flex flex-col gap-6 font-serif text-lg text-cream/80 leading-relaxed">
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
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">Premium Sourcing</h4>
                  <p className="text-sm text-cream/70">Finest Callebaut chocolate and fresh local produce.</p>
                </div>
                <div className="flex flex-col gap-2">
                  <Star className="w-8 h-8 text-rose" />
                  <h4 className="font-bold text-white uppercase tracking-wider text-xs">Made to Order</h4>
                  <p className="text-sm text-cream/70">Baked fresh specifically for your scheduled delivery.</p>
                </div>
              </div>
            </div>
            
            <div className="relative">
              <div className="aspect-[4/5] w-full rounded-[36px] overflow-hidden shadow-2xl relative z-10 border border-white/10 hover-glow">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80" 
                  alt="Pastry Chef Crafting" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
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
