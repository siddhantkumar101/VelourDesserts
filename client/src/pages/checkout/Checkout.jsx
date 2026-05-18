import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { CheckCircle, CreditCard, MapPin, Calendar, ArrowLeft, Package } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { addToast } from '../../stores/uiSlice';
import { clearCart } from '../../stores/cartSlice';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';

// Load Stripe (Fallback to a dummy test key if env is missing for dev safety)
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'pk_test_TYooMQauvdEDq54NiTphI7jx');

const CheckoutForm = ({ clientSecret, orderId, totalAmount, onBack }) => {
  const stripe = useStripe();
  const elements = useElements();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;

    setIsLoading(true);

    const { error, paymentIntent } = await stripe.confirmPayment({
      elements,
      redirect: 'if_required', // We handle redirect manually so we can verify backend sync
    });

    if (error) {
      dispatch(addToast({ message: error.message, type: 'error' }));
      setIsLoading(false);
    } else if (paymentIntent && paymentIntent.status === 'succeeded') {
      // Clear the cart when payment succeeds
      dispatch(clearCart());
      // Navigate to success page using path parameter
      navigate(`/order-confirmation/${orderId}`);
    } else {
      dispatch(addToast({ message: 'Something went wrong with the payment.', type: 'error' }));
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-chocolate/5">
        <h3 className="font-display text-2xl font-bold text-chocolate mb-4 flex items-center gap-2">
          <CreditCard className="w-6 h-6 text-rose" /> Payment Details
        </h3>
        <PaymentElement />
      </div>
      
      <div className="flex gap-4">
        <Button variant="outline" type="button" onClick={onBack} disabled={isLoading} className="w-1/3">
          Back
        </Button>
        <Button type="submit" disabled={!stripe || isLoading} isLoading={isLoading} className="w-2/3 shadow-hover">
          Pay {formatCurrency(totalAmount)}
        </Button>
      </div>
    </form>
  );
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [clientSecret, setClientSecret] = useState('');
  const [orderId, setOrderId] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [fulfillmentMethod, setFulfillmentMethod] = useState('delivery');
  const [fulfillmentDate, setFulfillmentDate] = useState('');
  
  const [customerInfo, setCustomerInfo] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
  });

  const [shippingAddress, setShippingAddress] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
  });

  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState(null);

  // Cart Subtotal
  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const discountAmount = appliedCoupon 
    ? (appliedCoupon.discountType === 'percentage' 
        ? subtotal * (appliedCoupon.discountValue / 100) 
        : appliedCoupon.discountValue)
    : 0;
  const shippingFee = fulfillmentMethod === 'delivery' ? 100 : 0; // Flat 100 INR for delivery to match backend schema
  const total = subtotal - discountAmount + shippingFee;

  useEffect(() => {
    if (items.length === 0 && step === 1) {
      dispatch(addToast({ message: 'Your cart is empty', type: 'warning' }));
      navigate(ROUTES.SHOP);
    }
  }, [items, navigate, dispatch, step]);

  const handleInfoChange = (e) => setCustomerInfo({ ...customerInfo, [e.target.id]: e.target.value });
  const handleAddressChange = (e) => setShippingAddress({ ...shippingAddress, [e.target.id]: e.target.value });

  const validateStep1 = () => {
    if (!fulfillmentDate) {
      dispatch(addToast({ message: 'Please select a fulfillment date', type: 'error' }));
      return false;
    }
    // Very basic client-side validation for date > today
    if (new Date(fulfillmentDate) < new Date()) {
      dispatch(addToast({ message: 'Date must be in the future', type: 'error' }));
      return false;
    }
    return true;
  };

  const validateStep2 = () => {
    if (!customerInfo.name || !customerInfo.email || !customerInfo.phone) {
      dispatch(addToast({ message: 'Please fill in all customer details', type: 'error' }));
      return false;
    }
    if (fulfillmentMethod === 'delivery') {
      if (!shippingAddress.street || !shippingAddress.city || !shippingAddress.state || !shippingAddress.zipCode) {
        dispatch(addToast({ message: 'Please complete the shipping address', type: 'error' }));
        return false;
      }
    }
    return true;
  };

  const proceedToPayment = async () => {
    if (!validateStep2()) return;
    setIsProcessing(true);

    try {
      const payload = {
        items: items.map(item => ({
          productId: item.productId,
          variantLabel: item.variantLabel,
          quantity: item.quantity,
          flavour: item.flavour || '',
          dietaryOption: item.dietaryOption || '',
          hasGiftWrapping: !!item.hasGiftWrapping,
          customMessage: item.customMessage || '',
          specialInstructions: item.specialInstructions || ''
        })),
        fulfilmentType: fulfillmentMethod,
        couponCode: appliedCoupon?.code || undefined,
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        }
      };

      // 1. Create Stripe Payment Intent on the backend
      const res = await api.post('/checkout/create-payment-intent', payload);
      const { clientSecret, paymentIntentId, pricing, processedItems, couponId } = res.data;

      // 2. Pre-create the Pending Order in MongoDB database
      const confirmPayload = {
        paymentIntentId,
        couponCode: appliedCoupon?.code || '',
        couponId,
        fulfilmentDate: fulfillmentDate,
        fulfilmentType: fulfillmentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? shippingAddress : {},
        customer: {
          name: customerInfo.name,
          email: customerInfo.email,
          phone: customerInfo.phone
        },
        processedItems,
        pricing
      };

      const orderRes = await api.post('/checkout/confirm-order', confirmPayload);
      
      setClientSecret(clientSecret);
      setOrderId(orderRes.data.orderId);
      setStep(3);
    } catch (error) {
      console.error(error);
      dispatch(addToast({ 
        message: error.response?.data?.message || 'Failed to initialize order. Please try again.', 
        type: 'error' 
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const applyCoupon = async () => {
    if (!couponCode) return;
    try {
      const res = await api.post('/checkout/apply-coupon', { code: couponCode, subtotal });
      setAppliedCoupon({ 
        code: res.data.code, 
        discountType: res.data.type, 
        discountValue: res.data.value, 
        discountAmount: res.data.discountAmount 
      });
      dispatch(addToast({ message: 'Coupon applied successfully!', type: 'success' }));
    } catch (error) {
      dispatch(addToast({ message: error.response?.data?.message || 'Invalid coupon', type: 'error' }));
      setAppliedCoupon(null);
    }
  };

  return (
    <div className="w-full bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        
        {/* Left Column: Flow */}
        <div className="lg:col-span-7 flex flex-col gap-6">
          
          {/* Progress Indicator */}
          <div className="flex items-center justify-between mb-4 px-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                  step === i ? 'bg-rose text-white shadow-md' : step > i ? 'bg-rose/20 text-rose' : 'bg-chocolate/10 text-chocolate/50'
                }`}>
                  {step > i ? <CheckCircle className="w-5 h-5" /> : i}
                </div>
                <span className={`text-xs font-medium uppercase tracking-wider ${step >= i ? 'text-chocolate' : 'text-chocolate/50'}`}>
                  {i === 1 ? 'Fulfillment' : i === 2 ? 'Details' : 'Payment'}
                </span>
              </div>
            ))}
          </div>

          {/* STEP 1: FULFILLMENT */}
          {step === 1 && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-chocolate/5 fade-in">
              <h2 className="font-display text-3xl font-bold text-chocolate mb-6">Fulfillment Method</h2>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('delivery')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    fulfillmentMethod === 'delivery' ? 'border-rose bg-rose/5 text-rose' : 'border-chocolate/10 text-chocolate hover:border-chocolate/30'
                  }`}
                >
                  <MapPin className="w-6 h-6" />
                  <span className="font-bold">Home Delivery</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFulfillmentMethod('pickup')}
                  className={`p-4 rounded-xl border-2 flex flex-col items-center justify-center gap-2 transition-all ${
                    fulfillmentMethod === 'pickup' ? 'border-rose bg-rose/5 text-rose' : 'border-chocolate/10 text-chocolate hover:border-chocolate/30'
                  }`}
                >
                  <Package className="w-6 h-6" />
                  <span className="font-bold">Studio Pickup</span>
                </button>
              </div>

              <div className="flex flex-col gap-2 mb-8">
                <label className="text-sm font-medium text-chocolate flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Select Date
                </label>
                <input 
                  type="date" 
                  value={fulfillmentDate}
                  onChange={(e) => setFulfillmentDate(e.target.value)}
                  className="p-3 border border-chocolate/20 rounded-lg focus:outline-none focus:border-rose text-chocolate"
                />
                <p className="text-xs text-chocolate/60 mt-1">
                  We require at least 48 hours notice for most items.
                </p>
              </div>

              <Button 
                className="w-full" 
                onClick={() => { if(validateStep1()) setStep(2); }}
              >
                Continue to Details
              </Button>
            </div>
          )}

          {/* STEP 2: DETAILS */}
          {step === 2 && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-chocolate/5 fade-in">
              <div className="flex items-center gap-4 mb-6">
                <button onClick={() => setStep(1)} className="p-2 hover:bg-cream-dark rounded-full transition-colors text-chocolate/60 hover:text-chocolate">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-display text-3xl font-bold text-chocolate">Customer Details</h2>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <Input label="Full Name" id="name" value={customerInfo.name} onChange={handleInfoChange} />
                <Input label="Email Address" id="email" type="email" value={customerInfo.email} onChange={handleInfoChange} />
                <Input label="Phone Number" id="phone" type="tel" value={customerInfo.phone} onChange={handleInfoChange} wrapperClassName="md:col-span-2" />
              </div>

              {fulfillmentMethod === 'delivery' && (
                <>
                  <h3 className="font-serif text-xl font-bold text-chocolate mb-4">Shipping Address</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <Input label="Street Address" id="street" value={shippingAddress.street} onChange={handleAddressChange} wrapperClassName="md:col-span-2" />
                    <Input label="City" id="city" value={shippingAddress.city} onChange={handleAddressChange} />
                    <Input label="State" id="state" value={shippingAddress.state} onChange={handleAddressChange} />
                    <Input label="PIN / Zip Code" id="zipCode" value={shippingAddress.zipCode} onChange={handleAddressChange} />
                  </div>
                </>
              )}

              <Button 
                className="w-full mt-4" 
                onClick={proceedToPayment}
                isLoading={isProcessing}
              >
                Continue to Payment
              </Button>
            </div>
          )}

          {/* STEP 3: PAYMENT */}
          {step === 3 && clientSecret && (
            <div className="fade-in">
              <Elements stripe={stripePromise} options={{ clientSecret, appearance: { theme: 'stripe', variables: { colorPrimary: '#C9897B' } } }}>
                <CheckoutForm 
                  clientSecret={clientSecret} 
                  orderId={orderId} 
                  totalAmount={total}
                  onBack={() => setStep(2)} 
                />
              </Elements>
            </div>
          )}

        </div>

        {/* Right Column: Order Summary */}
        <div className="lg:col-span-5">
          <div className="bg-cream-dark/50 p-6 md:p-8 rounded-3xl border border-chocolate/5 sticky top-24">
            <h3 className="font-display text-2xl font-bold text-chocolate mb-6">Order Summary</h3>
            
            <div className="flex flex-col gap-4 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map((item, idx) => (
                <div key={idx} className="flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-chocolate/10">
                    <img src={item.image} alt={item.productName} className="w-full h-full object-cover" />
                    <span className="absolute -top-1 -right-1 bg-chocolate text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
                      {item.quantity}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-chocolate text-sm truncate">{item.productName}</p>
                    <p className="text-xs text-chocolate/60 truncate">{item.variantLabel} {item.flavour ? `| ${item.flavour}` : ''}</p>
                  </div>
                  <div className="font-bold text-chocolate text-sm">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            {/* Coupon Section (Only in step 1 or 2) */}
            {step < 3 && (
              <div className="flex gap-2 mb-6">
                <input 
                  type="text" 
                  placeholder="Discount code" 
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  disabled={!!appliedCoupon}
                  className="flex-1 px-3 py-2 border border-chocolate/20 rounded-md focus:outline-none focus:border-rose text-sm bg-white uppercase disabled:bg-cream-dark disabled:text-chocolate/50"
                />
                <Button 
                  variant={appliedCoupon ? 'outline' : 'primary'}
                  onClick={appliedCoupon ? () => { setAppliedCoupon(null); setCouponCode(''); } : applyCoupon}
                  className="px-4 text-sm"
                >
                  {appliedCoupon ? 'Remove' : 'Apply'}
                </Button>
              </div>
            )}

            <div className="flex flex-col gap-3 text-sm border-t border-chocolate/10 pt-6">
              <div className="flex justify-between text-chocolate/80">
                <span>Subtotal</span>
                <span className="font-medium">{formatCurrency(subtotal)}</span>
              </div>
              
              {appliedCoupon && (
                <div className="flex justify-between text-success">
                  <span>Discount ({appliedCoupon.code})</span>
                  <span className="font-medium">-{formatCurrency(discountAmount)}</span>
                </div>
              )}
              
              <div className="flex justify-between text-chocolate/80">
                <span>Shipping {fulfillmentMethod === 'pickup' && '(Pickup)'}</span>
                <span className="font-medium">
                  {fulfillmentMethod === 'pickup' ? 'Free' : formatCurrency(shippingFee)}
                </span>
              </div>
            </div>

            <div className="flex justify-between items-end border-t border-chocolate/20 mt-6 pt-6">
              <span className="font-bold text-chocolate text-lg">Total</span>
              <span className="font-display text-3xl font-bold text-rose">{formatCurrency(total)}</span>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;
