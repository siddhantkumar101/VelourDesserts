import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { Menu, X, ShoppingBag, User, Search } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { toggleCart } from '../../stores/uiSlice';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const dispatch = useDispatch();
  const location = useLocation();
  const { items } = useSelector((state) => state.cart);
  const { isAuthenticated } = useSelector((state) => state.auth);

  const cartItemsCount = items.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
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
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-cream/90 backdrop-blur-md shadow-sm py-3' : 'bg-transparent py-5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between">
          
          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 -ml-2 text-chocolate hover:text-rose transition-colors focus:outline-none"
            onClick={() => setIsMobileMenuOpen(true)}
          >
            <Menu className="w-6 h-6" />
          </button>

          {/* Logo */}
          <Link to={ROUTES.HOME} className="flex-shrink-0 z-50">
            <h1 className="font-display text-2xl md:text-3xl font-bold tracking-tight text-chocolate">
              Velour <span className="text-rose italic font-normal">Desserts</span>
            </h1>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-sm font-medium text-chocolate hover:text-rose transition-colors tracking-wide uppercase relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-rose transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-2 sm:gap-4 z-50">
            <Link to={ROUTES.SEARCH} className="p-2 text-chocolate hover:text-rose transition-colors">
              <Search className="w-5 h-5" />
            </Link>
            
            <Link 
              to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN} 
              className="hidden sm:block p-2 text-chocolate hover:text-rose transition-colors"
            >
              <User className="w-5 h-5" />
            </Link>

            <button
              onClick={() => dispatch(toggleCart())}
              className="p-2 text-chocolate hover:text-rose transition-colors relative focus:outline-none"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItemsCount > 0 && (
                <span className="absolute top-0 right-0 w-4 h-4 bg-rose text-white text-[10px] font-bold rounded-full flex items-center justify-center translate-x-1 -translate-y-1">
                  {cartItemsCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed inset-0 bg-chocolate/50 backdrop-blur-sm z-40 transition-opacity duration-300 lg:hidden ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen(false)}
      />
      
      <div
        className={`fixed top-0 left-0 bottom-0 w-4/5 max-w-sm bg-cream z-50 shadow-2xl transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-chocolate/10">
          <h2 className="font-display text-xl font-bold text-chocolate">Menu</h2>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="p-2 text-chocolate hover:text-rose rounded-full bg-cream-dark/50"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto py-4 px-6 flex flex-col gap-6">
          <nav className="flex flex-col gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className="text-lg font-serif font-medium text-chocolate hover:text-rose transition-colors border-b border-chocolate/5 pb-2"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="p-6 bg-cream-dark/30 border-t border-chocolate/10">
          <Link
            to={isAuthenticated ? ROUTES.ACCOUNT : ROUTES.LOGIN}
            className="flex items-center gap-3 text-chocolate hover:text-rose font-medium transition-colors"
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
