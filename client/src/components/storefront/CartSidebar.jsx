import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { X, Trash2, ArrowRight } from 'lucide-react';
import { toggleCart } from '../../stores/uiSlice';
import { updateQuantity, removeFromCart, clearCart } from '../../stores/cartSlice';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../ui/Button';

const CartSidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isCartOpen } = useSelector((state) => state.ui);
  const { items } = useSelector((state) => state.cart);

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleCheckout = () => {
    dispatch(toggleCart());
    navigate(ROUTES.CHECKOUT);
  };

  return (
    <>
      {/* Overlay */}
      <div 
        className={`fixed inset-0 bg-chocolate/40 backdrop-blur-sm z-50 transition-opacity duration-300 ${
          isCartOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => dispatch(toggleCart())}
      />

      {/* Sidebar */}
      <div 
        className={`fixed top-0 right-0 bottom-0 w-full sm:w-[400px] bg-cream z-50 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${
          isCartOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-5 flex justify-between items-center border-b border-chocolate/10 bg-white">
          <h2 className="font-display text-2xl font-bold text-chocolate flex items-center gap-2">
            Your Cart <span className="text-sm font-sans text-rose font-medium bg-rose/10 px-2 py-0.5 rounded-full">{items.length}</span>
          </h2>
          <button 
            onClick={() => dispatch(toggleCart())}
            className="p-2 text-chocolate/60 hover:text-rose hover:bg-rose/10 rounded-full transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {items.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center gap-4 text-chocolate/60">
              <div className="w-20 h-20 bg-cream-dark rounded-full flex items-center justify-center mb-2">
                <ShoppingBagIcon className="w-10 h-10 text-chocolate/20" />
              </div>
              <p className="font-serif text-xl text-chocolate">Your cart is empty.</p>
              <p className="text-sm max-w-[250px]">Treat yourself to something sweet from our artisan collection.</p>
              <Button 
                className="mt-4"
                onClick={() => {
                  dispatch(toggleCart());
                  navigate(ROUTES.SHOP);
                }}
              >
                Browse Desserts
              </Button>
            </div>
          ) : (
            <div className="flex flex-col gap-6">
              {items.map((item, index) => (
                <div key={`${item.productId}-${item.variantLabel}-${index}`} className="flex gap-4 bg-white p-3 rounded-xl shadow-sm border border-chocolate/5">
                  <div className="w-20 h-24 bg-cream-dark rounded-lg overflow-hidden shrink-0">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex flex-col flex-1 py-1">
                    <div className="flex justify-between items-start">
                      <h3 className="font-serif font-bold text-chocolate leading-tight">{item.productName}</h3>
                      <button 
                        onClick={() => dispatch(removeFromCart(item))}
                        className="text-chocolate/40 hover:text-error transition-colors p-1 -mt-1 -mr-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="text-xs text-chocolate/70 flex flex-col gap-0.5 mt-1 mb-2">
                      <span>Size: {item.variantLabel}</span>
                      {item.flavour && <span>Flavour: {item.flavour}</span>}
                      {item.dietaryOption && <span>Dietary: {item.dietaryOption}</span>}
                    </div>
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center border border-chocolate/20 rounded-md bg-cream-dark/50">
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-chocolate hover:text-rose transition-colors font-medium"
                          onClick={() => dispatch(updateQuantity({ ...item, quantity: item.quantity - 1 }))}
                        >-</button>
                        <span className="w-6 text-center text-xs font-bold text-chocolate">{item.quantity}</span>
                        <button 
                          className="w-7 h-7 flex items-center justify-center text-chocolate hover:text-rose transition-colors font-medium"
                          onClick={() => dispatch(updateQuantity({ ...item, quantity: item.quantity + 1 }))}
                        >+</button>
                      </div>
                      <span className="font-bold text-chocolate">{formatCurrency(item.price * item.quantity)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-chocolate/10 bg-white p-5 flex flex-col gap-4">
            <div className="flex justify-between items-end">
              <div className="flex flex-col">
                <span className="text-chocolate/70 text-sm">Subtotal</span>
                <span className="text-xs text-chocolate/50">(Taxes & shipping calculated at checkout)</span>
              </div>
              <span className="font-display text-2xl font-bold text-chocolate">{formatCurrency(subtotal)}</span>
            </div>
            <Button size="lg" className="w-full flex items-center justify-center gap-2" onClick={handleCheckout}>
              Proceed to Checkout <ArrowRight className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    </>
  );
};

// SVG Icon Helper
const ShoppingBagIcon = ({ className }) => (
  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export default CartSidebar;
