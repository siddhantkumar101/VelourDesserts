import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
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
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors" aria-label="Instagram">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.051C.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors" aria-label="Facebook">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M9 8H7v3h2v9h4v-9h3.61L16 8h-3V6.707c0-.955.2-1.293 1.037-1.293H16V2h-3.328C9.728 2 9 3.238 9 5.333V8z"/>
                </svg>
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-cream/10 flex items-center justify-center hover:bg-rose hover:text-white transition-colors" aria-label="Twitter">
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                </svg>
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
          <div className="flex gap-6 items-center">
            <Link to={ROUTES.ADMIN_LOGIN} className="hover:text-rose transition-colors font-bold uppercase tracking-widest text-[9px]">Admin Console</Link>
            <span>Built with ♥ in India</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
