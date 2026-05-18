import React, { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, Sparkles, HelpCircle } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';
import { productService } from '../../services/product.service';
import { formatCurrency } from '../../utils/formatCurrency';
import { handleImageErrorDark } from '../../utils/imageFallback';

const Home = () => {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // Mouse position for cursor glow
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const canvasRef = useRef(null);

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // HTML5 Canvas Sparkle Dust particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    const particles = [];
    const particleCount = 65;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 2 + 0.5,
        speedX: Math.random() * 0.4 - 0.2,
        speedY: Math.random() * 0.5 + 0.2,
        opacity: Math.random() * 0.6 + 0.2,
        color: Math.random() > 0.5 ? '#C9897B' : '#E8C5BC', // Rose or Rose light
      });
    }

    const drawParticles = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.opacity;
        ctx.fill();

        // Update positions
        p.x += p.speedX;
        p.y += p.speedY;

        // Reset if particles fall off bottom
        if (p.y > height) {
          p.y = 0;
          p.x = Math.random() * width;
        }
        if (p.x > width) p.x = 0;
        if (p.x < 0) p.x = width;
      });

      animationFrameId = requestAnimationFrame(drawParticles);
    };

    drawParticles();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  const MOCK_FEATURED = [
    {
      _id: 'mock1',
      name: 'Classic Velvet Rose Cake',
      slug: 'classic-velvet-rose',
      category: 'Signature Cakes',
      basePrice: 1850,
      images: [{ url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80', isPrimary: true }],
      dietaryOptions: [{ label: 'Eggless' }]
    },
    {
      _id: 'mock2',
      name: 'Gourmet Chocolate Truffle',
      slug: 'gourmet-chocolate-truffle',
      category: 'Luxurious Truffles',
      basePrice: 2100,
      images: [{ url: 'https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&auto=format&fit=crop&q=80', isPrimary: true }],
      dietaryOptions: [{ label: 'Eggless' }]
    },
    {
      _id: 'mock3',
      name: 'Artisanal Macaron Carousel',
      slug: 'artisanal-macaron-carousel',
      category: 'French Macarons',
      basePrice: 1250,
      images: [{ url: 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?w=600&auto=format&fit=crop&q=80', isPrimary: true }],
      dietaryOptions: []
    }
  ];

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getFeaturedProducts();
        if (response?.data?.products && response.data.products.length > 0) {
          setFeaturedProducts(response.data.products);
        } else {
          setFeaturedProducts(MOCK_FEATURED);
        }
      } catch (error) {
        console.error('Failed to load featured products from database, loading default creations', error);
        setFeaturedProducts(MOCK_FEATURED);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div className="w-full bg-[#0F0805] text-[#FAF6F1] relative overflow-hidden select-none">
      
      {/* Custom Physics & Orbital styles */}
      <style>{`
        @keyframes drift {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-22px) rotate(3deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes driftSlow {
          0% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(18px) rotate(-4deg); }
          100% { transform: translateY(0px) rotate(0deg); }
        }
        @keyframes orbitCW {
          0% { transform: rotate(0deg) translate(220px) rotate(0deg); }
          100% { transform: rotate(360deg) translate(220px) rotate(-360deg); }
        }
        @keyframes orbitCCW {
          0% { transform: rotate(180deg) translate(300px) rotate(-180deg); }
          100% { transform: rotate(-180deg) translate(300px) rotate(180deg); }
        }
        .gravity-float {
          animation: drift 8s infinite ease-in-out;
        }
        .gravity-float-slow {
          animation: driftSlow 11s infinite ease-in-out;
        }
        .orbit-item-1 {
          animation: orbitCW 24s infinite linear;
        }
        .orbit-item-2 {
          animation: orbitCCW 32s infinite linear;
        }
        .neon-glow-rose {
          box-shadow: 0 0 50px 10px rgba(201, 137, 123, 0.25);
        }
        .neon-glow-gold {
          box-shadow: 0 0 60px 15px rgba(184, 150, 90, 0.2);
        }
      `}</style>

      {/* Magical Interactive Background Glow Follower */}
      <div 
        className="hidden lg:block fixed pointer-events-none z-0 w-[450px] h-[450px] rounded-full blur-[140px] transition-all duration-200 opacity-40 bg-gradient-to-r from-rose/30 to-gold/25"
        style={{
          left: `${mousePos.x - 225}px`,
          top: `${mousePos.y - 225}px`,
        }}
      />

      {/* Sugar Dust Canvas Overlay */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none z-10" />

      {/* HERO SECTION: Zero-Gravity Space */}
      <section className="relative w-full min-h-screen py-24 flex items-center justify-center overflow-hidden">
        
        {/* Soft magical background gradients */}
        <div className="absolute top-[20%] left-[10%] w-96 h-96 bg-rose/10 rounded-full blur-3xl z-0" />
        <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-gold/5 rounded-full blur-3xl z-0" />

        {/* Orbit Area & Floating centerpiece */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          
          {/* Outer Rotating orbit (Chocolate Donut) */}
          <div className="absolute orbit-item-1 hidden md:block">
            <div className="w-16 h-16 rounded-full overflow-hidden border border-white/10 shadow-lg p-1 bg-chocolate/60 backdrop-blur-md scale-90">
              <img 
                src="https://images.unsplash.com/photo-1551024601-bec78aea704b?w=150&auto=format&fit=crop&q=80" 
                alt="Orbit Donut" 
                className="w-full h-full object-cover rounded-full"
                onError={handleImageErrorDark}
              />
            </div>
          </div>

          {/* Inner Rotating orbit (Raspberry Macaron) */}
          <div className="absolute orbit-item-2 hidden md:block">
            <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shadow-lg p-1 bg-chocolate/60 backdrop-blur-md scale-95">
              <img 
                src="https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=150&auto=format&fit=crop&q=80" 
                alt="Orbit Macaron" 
                className="w-full h-full object-cover rounded-full"
                onError={handleImageErrorDark}
              />
            </div>
          </div>

          {/* Drifter Top Left (Strawberry Cupcake) */}
          <div className="absolute top-28 left-[8%] gravity-float hidden lg:block">
            <div className="w-24 h-24 rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-1 bg-[#1A0E0A]/40 backdrop-blur-md rotate-[-6deg] hover-glow">
              <img 
                src="https://images.unsplash.com/photo-1587314168485-3236d6710814?w=200&auto=format&fit=crop&q=80" 
                alt="Floating Cupcake" 
                className="w-full h-full object-cover rounded-2xl"
                onError={handleImageErrorDark}
              />
            </div>
          </div>

          {/* Drifter Mid Right (Cream Tart) */}
          <div className="absolute top-[40%] right-[7%] gravity-float-slow hidden lg:block">
            <div className="w-28 h-28 rounded-3xl overflow-hidden border border-white/5 shadow-2xl p-1 bg-[#1A0E0A]/40 backdrop-blur-md rotate-[12deg] hover-glow">
              <img 
                src="https://images.unsplash.com/photo-1519869325930-281384150729?w=200&auto=format&fit=crop&q=80" 
                alt="Floating Tart" 
                className="w-full h-full object-cover rounded-2xl"
                onError={handleImageErrorDark}
              />
            </div>
          </div>

        </div>

        {/* HERO CONTENT: Futuristic Text & Core Centerpiece */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center w-full">
          
          {/* Text panel */}
          <div className="lg:col-span-6 flex flex-col gap-6 text-center lg:text-left items-center lg:items-start page-transition">
            
            <span className="text-[#FF7B93] tracking-[0.3em] uppercase text-xs font-bold bg-[#FF7B93]/10 border border-[#FF7B93]/20 px-5 py-2 rounded-full flex items-center gap-1.5 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#FF7B93]" /> Fine Artisanal Pâtisserie
            </span>
            
            <h1 className="font-display text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-cream leading-tight tracking-tight">
              Velour <br />
              <span className="text-[#FF7B93] italic font-normal drop-shadow-[0_0_20px_rgba(255,123,147,0.45)]">Desserts</span>
            </h1>
            
            <p className="text-[#D4C3B9] text-lg md:text-xl font-serif leading-relaxed max-w-xl">
              Welcome to a premium dessert universe where gourmet cakes, rich chocolates, and delicate pastries drift in zero gravity with magical neon caramel glows.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mt-4 w-full sm:w-auto">
              <Link to={ROUTES.SHOP}>
                <Button size="lg" className="w-full sm:w-auto px-8 bg-rose text-white hover:bg-rose-dark shadow-lg shadow-rose/10 text-base py-4 rounded-2xl font-bold">
                  Explore the Boutique
                </Button>
              </Link>
              <Link to="/custom-orders">
                <Button variant="ghost" size="lg" className="w-full sm:w-auto text-cream hover:bg-white/5 border border-white/10 text-base py-4 rounded-2xl font-bold backdrop-blur-sm">
                  Design Bespoke Cake
                </Button>
              </Link>
            </div>

          </div>

          {/* Center Giant Floating Centerpiece Cake */}
          <div className="lg:col-span-6 flex items-center justify-center relative">
            <div className="relative w-80 sm:w-[420px] aspect-square rounded-full flex items-center justify-center gravity-float relative">
              
              {/* Outer Glowing Rings */}
              <div className="absolute inset-0 rounded-full border border-white/5 bg-gradient-to-tr from-rose/10 to-gold/5 blur-[2px] scale-105" />
              <div className="absolute inset-4 rounded-full border-2 border-dashed border-[#FF7B93]/10 animate-[spin_50s_infinite_linear]" />
              
              {/* Core Glass circular card */}
              <div className="w-[85%] h-[85%] rounded-full overflow-hidden border border-white/15 p-2 bg-white/[0.02] backdrop-blur-xl shadow-2xl relative z-10 flex items-center justify-center neon-glow-rose">
                <img 
                  src="https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=700&auto=format&fit=crop&q=80" 
                  alt="Giant Centerpiece Cake" 
                  className="w-full h-full object-cover rounded-full border-2 border-white/10 scale-[1.01]"
                  onError={handleImageErrorDark}
                />
              </div>

              {/* Orbital particles overlay */}
              <div className="absolute -top-4 -left-4 w-12 h-12 bg-gold/20 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-rose/20 rounded-full blur-xl animate-pulse" />

            </div>
          </div>

        </div>

      </section>

      {/* DRIPPING CHOCOLATE WAVE SEPARATOR (Rotated 180 degrees to drip down) */}
      <div className="w-full relative pointer-events-none z-20 -mt-10 overflow-hidden">
        <svg viewBox="0 0 1440 150" className="w-full fill-[#160B06] transform rotate-180 relative z-20">
          <path d="M0,0 L1440,0 L1440,35 C1400,55 1350,75 1300,40 C1250,5 1200,25 1150,85 C1100,145 1050,125 1000,45 C950,-35 900,5 850,75 C800,145 750,105 700,35 C650,-35 600,5 550,95 C500,185 450,135 400,35 C350,-65 300,5 250,85 C200,165 150,105 100,35 C50,-35 0,15 0,15 Z" />
        </svg>
      </div>

      {/* FEATURED COLLECTION: Deep dark velvet luxury showcase */}
      <section className="py-24 bg-[#160B06] px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-7xl mx-auto">
          
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6 reveal-left">
            <div className="max-w-2xl">
              <h2 className="font-display text-4xl md:text-5xl text-cream font-bold mb-4">
                Signature <span className="italic text-[#FF7B93] font-normal drop-shadow-[0_0_10px_rgba(255,123,147,0.2)]">Creations</span>
              </h2>
              <p className="text-[#D4C3B9] font-serif text-lg leading-relaxed">
                Discover our zero-gravity favorites, meticulously baked and glazed inside our premium Bangalore studio.
              </p>
            </div>
            <Link 
              to={ROUTES.SHOP} 
              className="group flex items-center gap-2 text-[#FF7B93] font-bold tracking-wider hover:text-white transition-colors whitespace-nowrap uppercase text-sm border-b border-[#FF7B93]/20 pb-1"
            >
              Browse All Pastries 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse flex flex-col gap-4">
                  <div className="bg-white/5 w-full aspect-[4/5] rounded-[32px] border border-white/5" />
                  <div className="bg-white/5 h-6 w-3/4 rounded" />
                  <div className="bg-white/5 h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.slice(0, 3).map((product) => (
                <Link 
                  key={product._id} 
                  to={ROUTES.PRODUCT_DETAIL(product.slug)} 
                  className="group flex flex-col gap-5 hover-lift hover-glow bg-white/[0.02] border border-white/[0.04] backdrop-blur-xl p-5 rounded-[32px] shadow-2xl transition-all duration-300 relative"
                >
                  {/* Neon caramel glow behind product cards */}
                  <div className="absolute inset-0 bg-[#FF7B93]/5 rounded-[32px] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-white/5 border border-white/5">
                    <img 
                      src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                      loading="lazy"
                      onError={handleImageErrorDark}
                    />
                    <div className="absolute top-4 left-4 flex flex-col gap-2">
                      {product.dietaryOptions.some(d => d.label.toLowerCase().includes('eggless')) && (
                        <span className="bg-[#160B06]/85 backdrop-blur-md text-[#FF7B93] border border-[#FF7B93]/20 px-3.5 py-1.5 text-[9px] font-bold uppercase tracking-widest rounded-full shadow-lg">
                          Eggless
                        </span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 px-1 relative z-10">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif text-2xl font-bold text-cream group-hover:text-[#FF7B93] transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2 text-[#D4C3B9] text-xs">
                      <span className="uppercase tracking-widest font-bold text-[#FF7B93]">{product.category}</span>
                    </div>
                    <p className="text-white font-display font-black mt-1 text-xl flex items-center justify-between border-t border-white/5 pt-4 mt-2">
                      <span className="text-[#D4C3B9] text-xs uppercase tracking-wider font-semibold">Base Price</span>
                      <span className="text-[#FF7B93] drop-shadow-[0_0_8px_rgba(255,123,147,0.25)]">{formatCurrency(product.basePrice)}</span>
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* BRAND PHILOSOPHY: Floating Testimonials / Chef special space */}
      <section className="py-24 bg-[#0F0805] text-cream relative overflow-hidden border-t border-white/5">
        
        {/* Neon caramel glow blobs */}
        <div className="absolute top-1/2 left-[50%] -translate-y-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-rose/5 rounded-full blur-[140px] pointer-events-none z-0" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Visual Narrative */}
            <div className="flex flex-col gap-8 reveal-left">
              <span className="text-[#FF7B93] tracking-[0.2em] uppercase text-xs font-bold bg-[#FF7B93]/10 border border-[#FF7B93]/20 px-4 py-2 rounded-full w-fit">
                Our Master Culinary Principles
              </span>
              <h2 className="font-display text-4xl md:text-5xl font-black leading-tight">
                Crafted Without <br />
                <span className="italic text-[#FF7B93] font-normal drop-shadow-[0_0_12px_rgba(255,123,147,0.3)]">Compromise</span>
              </h2>
              <div className="flex flex-col gap-6 font-serif text-lg text-[#D4C3B9] leading-relaxed">
                <p>
                  At Velour Desserts, we believe that true luxury lies in the details. Every element of our creations is meticulously handcrafted from scratch in our studio.
                </p>
                <p>
                  We never use artificial flavorings or pre-made mixes. From our pure pistachio pastes to our house-made fruit conserves and rich Belgian chocolate ganaches, we source only the finest ingredients globally and locally to ensure an unforgettable tasting experience.
                </p>
              </div>
              
              <div className="grid grid-cols-2 gap-6 mt-4">
                <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/[0.03] p-5 rounded-2xl hover-glow">
                  <Star className="w-6 h-6 text-[#FF7B93]" />
                  <h4 className="font-bold text-cream uppercase tracking-wider text-xs">Premium Sourcing</h4>
                  <p className="text-xs text-[#D4C3B9]">Finest Callebaut chocolate and fresh local produce.</p>
                </div>
                <div className="flex flex-col gap-2 bg-white/[0.01] border border-white/[0.03] p-5 rounded-2xl hover-glow">
                  <Star className="w-6 h-6 text-[#FF7B93]" />
                  <h4 className="font-bold text-cream uppercase tracking-wider text-xs">Made to Order</h4>
                  <p className="text-xs text-[#D4C3B9]">Baked fresh specifically for your scheduled delivery.</p>
                </div>
              </div>
            </div>
            
            {/* 3D-effect Chef Graphic */}
            <div className="relative flex items-center justify-center reveal-right">
              <div className="aspect-[4/5] w-full max-w-[400px] rounded-[40px] overflow-hidden shadow-2xl relative z-10 border border-white/10 hover-glow scale-95 gravity-float">
                <img 
                  src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=80" 
                  alt="Chef Crafting" 
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-700 ease-out"
                  onError={handleImageErrorDark}
                />
              </div>
              {/* Glowing Ambient light orbits */}
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-[#FF7B93]/15 rounded-full blur-3xl z-0" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-gold/10 rounded-full blur-3xl z-0" />
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Home;
