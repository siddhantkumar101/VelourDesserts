import React, { useEffect, useState } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, Home } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { clearCart } from '../../stores/cartSlice';
import { ROUTES } from '../../constants/routes';
import Button from '../../components/ui/Button';

const OrderConfirmation = () => {
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get('orderId');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    // Clear the cart when landing on success page
    dispatch(clearCart());
  }, [dispatch]);

  useEffect(() => {
    if (!orderId) {
      navigate(ROUTES.HOME);
    }
  }, [orderId, navigate]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate(ROUTES.ACCOUNT);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [navigate]);

  if (!orderId) return null;

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cream">
      <div className="max-w-lg w-full bg-white p-8 rounded-3xl shadow-lg border border-chocolate/5 text-center">
        
        <div className="w-24 h-24 bg-success/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle className="w-12 h-12 text-success" />
        </div>

        <h1 className="font-display text-4xl font-bold text-chocolate mb-2">Order Confirmed</h1>
        <p className="text-chocolate/70 font-serif text-lg mb-6">
          Thank you for choosing Velour Desserts. Your artisan treats are being prepared with love.
        </p>

        <div className="bg-cream-dark p-6 rounded-2xl mb-8">
          <p className="text-sm font-bold text-chocolate/50 uppercase tracking-wider mb-1">Order Reference</p>
          <p className="font-mono text-xl font-bold text-chocolate flex items-center justify-center gap-2">
            <Package className="w-5 h-5 text-rose" />
            {orderId}
          </p>
        </div>

        <p className="text-sm text-chocolate/60 mb-8">
          We've sent a confirmation email to you with the order details and receipt.
          <br />
          Redirecting to your dashboard in <span className="font-bold text-rose">{countdown}</span> seconds...
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to={ROUTES.ACCOUNT} className="w-full sm:w-auto">
            <Button className="w-full flex items-center justify-center gap-2">
              View Order Details <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to={ROUTES.HOME} className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full flex items-center justify-center gap-2">
              <Home className="w-4 h-4" /> Back to Home
            </Button>
          </Link>
        </div>

      </div>
    </div>
  );
};

export default OrderConfirmation;
