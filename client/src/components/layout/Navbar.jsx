import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ShoppingBag, User, Search, Sparkles } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { toggleCart } from '../../stores/uiSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const isDarkPage = location.pathname === '/';
  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { label: 'Home', path: ROUTES.HOME },
    { label: 'Shop', path: ROUTES.SHOP },
    { label: 'Custom Orders', path: '/custom-orders' },
    { label: 'Our Story', path: '/about' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div 
          className="pointer-events-auto mx-auto flex items-center justify-between transition-all duration-500 ease-out bg-[#160B06]/85 border border-white/[0.08] shadow-[0_12px_40px_rgba(0,0,0,0.55)] rounded-[32px] py-3.5 px-8 max-w-5xl"
        >
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 text-cream hover:text-[#FF7B93] transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Brand Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0 z-50 transition-transform duration-300 hover:scale-[1.03]">
            <h1 className="font-display text-xl md:text-2xl font-black tracking-[0.1em] text-cream">
              VELOUR <span className="text-[#FF7B93] italic font-normal">DESSERTS</span>
            </h1>
          </Link>

          {/* Desktop Floating Navigation Links */}
          <nav className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-xs font-bold text-cream/90 hover:text-[#FF7B93] transition-all tracking-[0.25em] uppercase relative group py-1.5"
              >
                {link.label}
                <span className="absolute -bottom-0.5 left-0 w-0 h-[2px] bg-[#FF7B93] transition-all duration-300 group-hover:w-full rounded-full shadow-[0_0_8px_#FF7B93]" />
              </Link>
            ))}
          </nav>

          {/* Action Icons */}
          <div className="flex items-center gap-3 sm:gap-5 z-50 text-cream">
            <Link to={ROUTES.SEARCH} className="p-2 hover:text-[#FF7B93] transition-all hover:scale-110 duration-200">
              <Search className="w-5 h-5" />
            </Link>
            
            <Link 
              to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN} 
              className="hidden sm:block p-2 hover:text-[#FF7B93] transition-all hover:scale-110 duration-200"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 hover:text-[#FF7B93] transition-all hover:scale-110 duration-200 relative focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5 animate-[bounce_4s_infinite]" />
              {cartItemsCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4.5 h-4.5 bg-[#FF7B93] text-[#160B06] text-[9px] font-black rounded-full flex items-center justify-center translate-x-1.5 -translate-y-1.5 shadow-[0_0_8px_#FF7B93] animate-pulse">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      <div
        className={`pointer-events-auto fixed inset-0 bg-[#0F0805]/60 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      {/* Mobile Navigation Drawer */}
      <div
        className={`pointer-events-auto fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-[#160B06] z-50 shadow-[20px_0_50px_rgba(0,0,0,0.6)] transition-transform duration-300 ease-out lg:hidden flex flex-col border-r border-white/5 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-white/5 bg-[#0F0805]">
          <h2 className="font-display text-lg font-bold text-cream tracking-widest uppercase">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-cream hover:text-[#FF7B93] rounded-full bg-white/5"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-6 px-8 flex flex-col gap-8 bg-[#160B06]">
          <nav className="flex flex-col gap-5">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-serif font-medium text-cream hover:text-[#FF7B93] transition-all border-b border-white/5 pb-3 flex items-center justify-between group"
              >
                <span>{link.label}</span>
                <Sparkles className="w-4 h-4 text-[#FF7B93] opacity-0 group-hover:opacity-100 transition-opacity" />
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 bg-[#0F0805] border-t border-white/5">
          <Link
            to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
            className="flex items-center gap-3 text-cream hover:text-[#FF7B93] font-bold tracking-wider uppercase text-xs transition-colors"
          >
            <User className="w-5 h-5" />
            {isAuthenticated ? 'My Account' : 'Sign In / Register'}
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
