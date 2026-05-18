import React from 'react';
import { Link } from 'react-router-dom';
import { Instagram, Facebook, Twitter, ArrowRight } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const Footer = () => {
  return (
    <footer className="bg-chocolate text-cream pt-16 pb-8 border-t-[8px] border-rose">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-12">
          
          {/* Brand Col */}
          <div className="flex flex-col gap-6">
            <Link to={ROUTES.HOME}>
              <h2 className="font-display text-3xl font-bold tracking-tight text-white">
                Velour <span className="text-rose italic font-normal">Desserts</span>
              </h2>
            </Link>
            <p className="text-cream/80 text-sm leading-relaxed max-w-sm">
              Artisan desserts handcrafted with premium ingredients, love, and a touch of elegance. Elevating your everyday celebrations.
            </p>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors">
                <Instagram className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors">
                <Facebook className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors">
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links Col 1 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-semibold text-white mb-2">Shop</h3>
            <Link to={ROUTES.SHOP} className="text-cream/80 hover:text-rose transition-colors w-fit">All Desserts</Link>
            <Link to={`${ROUTES.SHOP}?category=Cakes`} className="text-cream/80 hover:text-rose transition-colors w-fit">Signature Cakes</Link>
            <Link to={`${ROUTES.SHOP}?category=Tarts`} className="text-cream/80 hover:text-rose transition-colors w-fit">Artisan Tarts</Link>
            <Link to={`${ROUTES.SHOP}?category=Cookies`} className="text-cream/80 hover:text-rose transition-colors w-fit">Chunky Cookies</Link>
            <Link to={`${ROUTES.SHOP}?category=Gifting`} className="text-cream/80 hover:text-rose transition-colors w-fit">Gifting Hampers</Link>
          </div>

          {/* Links Col 2 */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-semibold text-white mb-2">Customer Care</h3>
            <Link to="/faq" className="text-cream/80 hover:text-rose transition-colors w-fit">FAQ</Link>
            <Link to="/shipping" className="text-cream/80 hover:text-rose transition-colors w-fit">Shipping & Delivery</Link>
            <Link to="/returns" className="text-cream/80 hover:text-rose transition-colors w-fit">Returns Policy</Link>
            <Link to="/contact" className="text-cream/80 hover:text-rose transition-colors w-fit">Contact Us</Link>
            <Link to="/privacy" className="text-cream/80 hover:text-rose transition-colors w-fit">Privacy Policy</Link>
          </div>

          {/* Newsletter Col */}
          <div className="flex flex-col gap-4">
            <h3 className="font-serif text-xl font-semibold text-white mb-2">Stay Connected</h3>
            <p className="text-cream/80 text-sm">
              Subscribe to our newsletter for exclusive offers, new product launches, and dessert inspiration.
            </p>
            <form className="mt-2 flex">
              <input
                type="email"
                placeholder="Your email address"
                className="bg-cream/10 border border-cream/20 text-white placeholder:text-cream/40 px-4 py-2.5 rounded-l-md w-full focus:outline-none focus:border-rose transition-colors"
                required
              />
              <button
                type="submit"
                className="bg-rose text-white px-4 py-2.5 rounded-r-md hover:bg-rose-dark transition-colors flex items-center justify-center"
              >
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </div>

        </div>

        <div className="border-t border-cream/10 pt-8 mt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream/60">
          <p>&copy; {new Date().getFullYear()} Velour Desserts Co. All rights reserved.</p>
          <div className="flex gap-4">
            <span>Built with ♥ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
