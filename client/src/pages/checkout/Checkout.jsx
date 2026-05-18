import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, CreditCard, MapPin, Calendar, ArrowLeft, Package } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import { addToast } from '../../stores/uiSlice';
import { clearCart } from '../../stores/cartSlice';
import api from '../../services/api';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { getFallbackImage } from '../../utils/imageFallback';

// Load Razorpay dynamically in DOM
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const Checkout = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { items } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('razorpay'); // 'razorpay' or 'COD'
  const [razorpayOrderData, setRazorpayOrderData] = useState(null);

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
        },
        paymentMethod: paymentMethod
      };

      // Create Razorpay Order or COD Mock Intent on backend
      const res = await api.post('/checkout/create-payment-intent', payload);
      
      setRazorpayOrderData(res.data);
      setStep(3);
    } catch (error) {
      console.error(error);
      dispatch(addToast({ 
        message: error.response?.data?.message || 'Failed to initialize checkout. Please try again.', 
        type: 'error' 
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCODPayment = async () => {
    setIsProcessing(true);
    try {
      const confirmPayload = {
        paymentIntentId: razorpayOrderData.paymentIntentId,
        couponCode: appliedCoupon?.code || '',
        couponId: razorpayOrderData.couponId,
        fulfilmentDate: fulfillmentDate,
        fulfilmentType: fulfillmentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? shippingAddress : {},
        customer: customerInfo,
        processedItems: razorpayOrderData.processedItems,
        pricing: razorpayOrderData.pricing,
        isCOD: true
      };

      const confirmRes = await api.post('/checkout/confirm-order', confirmPayload);
      dispatch(clearCart());
      navigate(`/order-confirmation/${confirmRes.data.orderId}`);
      dispatch(addToast({ message: 'COD Order placed successfully!', type: 'success' }));
    } catch (error) {
      dispatch(addToast({ message: 'Failed to place COD order.', type: 'error' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMockRazorpayPayment = async () => {
    setIsProcessing(true);
    try {
      const confirmPayload = {
        paymentIntentId: razorpayOrderData.razorpayOrderId,
        couponCode: appliedCoupon?.code || '',
        couponId: razorpayOrderData.couponId,
        fulfilmentDate: fulfillmentDate,
        fulfilmentType: fulfillmentMethod,
        deliveryAddress: fulfillmentMethod === 'delivery' ? shippingAddress : {},
        customer: customerInfo,
        processedItems: razorpayOrderData.processedItems,
        pricing: razorpayOrderData.pricing,
      };

      const confirmRes = await api.post('/checkout/confirm-order', confirmPayload);
      dispatch(clearCart());
      navigate(`/order-confirmation/${confirmRes.data.orderId}`);
      dispatch(addToast({ message: 'Order completed in Sandbox mode!', type: 'success' }));
    } catch (error) {
      dispatch(addToast({ message: 'Failed to confirm Sandbox order.', type: 'error' }));
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRealRazorpayPayment = async () => {
    setIsProcessing(true);
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      dispatch(addToast({ message: 'Failed to load Razorpay Checkout. Please check your internet connection.', type: 'error' }));
      setIsProcessing(false);
      return;
    }

    const options = {
      key: razorpayOrderData.keyId,
      amount: razorpayOrderData.amount,
      currency: razorpayOrderData.currency,
      name: "Velour Desserts Co.",
      description: "Artisanal Dessert Order",
      order_id: razorpayOrderData.razorpayOrderId,
      handler: async function (response) {
        setIsProcessing(true);
        try {
          const confirmPayload = {
            paymentIntentId: response.razorpay_order_id,
            razorpayPaymentId: response.razorpay_payment_id,
            razorpaySignature: response.razorpay_signature,
            couponCode: appliedCoupon?.code || '',
            couponId: razorpayOrderData.couponId,
            fulfilmentDate: fulfillmentDate,
            fulfilmentType: fulfillmentMethod,
            deliveryAddress: fulfillmentMethod === 'delivery' ? shippingAddress : {},
            customer: customerInfo,
            processedItems: razorpayOrderData.processedItems,
            pricing: razorpayOrderData.pricing,
          };
          const confirmRes = await api.post('/checkout/confirm-order', confirmPayload);
          dispatch(clearCart());
          navigate(`/order-confirmation/${confirmRes.data.orderId}`);
          dispatch(addToast({ message: 'Payment successful! Order confirmed.', type: 'success' }));
        } catch (err) {
          dispatch(addToast({ message: 'Payment verification failed.', type: 'error' }));
        } finally {
          setIsProcessing(false);
        }
      },
      prefill: {
        name: customerInfo.name,
        email: customerInfo.email,
        contact: customerInfo.phone,
      },
      theme: {
        color: "#C9897B",
      },
      modal: {
        ondismiss: function () {
          setIsProcessing(false);
        }
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
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

              {/* Payment selector early bind */}
              <div className="border-t border-chocolate/5 pt-6 mt-4">
                <h3 className="font-serif text-xl font-bold text-chocolate mb-4">Select Payment Method</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('razorpay')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      paymentMethod === 'razorpay' ? 'border-rose bg-rose/5' : 'border-chocolate/10 hover:border-chocolate/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'razorpay' ? 'border-rose bg-rose' : 'border-chocolate/20'
                    }`}>
                      {paymentMethod === 'razorpay' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-chocolate text-xs uppercase tracking-wider">Online (UPI/Cards)</h4>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`p-4 rounded-xl border-2 flex items-center gap-3 text-left transition-all ${
                      paymentMethod === 'COD' ? 'border-rose bg-rose/5' : 'border-chocolate/10 hover:border-chocolate/20'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                      paymentMethod === 'COD' ? 'border-rose bg-rose' : 'border-chocolate/20'
                    }`}>
                      {paymentMethod === 'COD' && <div className="w-2 h-2 bg-white rounded-full" />}
                    </div>
                    <div>
                      <h4 className="font-bold text-chocolate text-xs uppercase tracking-wider">Cash on Delivery</h4>
                    </div>
                  </button>
                </div>
              </div>

              <Button 
                className="w-full mt-8" 
                onClick={proceedToPayment}
                isLoading={isProcessing}
              >
                Proceed to Payment Step
              </Button>
            </div>
          )}

          {/* STEP 3: PAYMENT SUBMIT */}
          {step === 3 && razorpayOrderData && (
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-chocolate/5 fade-in flex flex-col gap-6">
              <div className="flex items-center gap-4 mb-4">
                <button onClick={() => setStep(2)} className="p-2 hover:bg-cream-dark rounded-full transition-colors text-chocolate/60 hover:text-chocolate">
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <h2 className="font-display text-3xl font-bold text-chocolate flex items-center gap-2">
                  <CreditCard className="w-8 h-8 text-rose" /> Complete Payment
                </h2>
              </div>

              <div className="bg-cream-dark/30 p-5 rounded-2xl border border-chocolate/5">
                <h4 className="font-bold text-chocolate mb-2 uppercase tracking-wide text-xs">Payment Information</h4>
                <div className="flex flex-col gap-2 text-sm text-chocolate/80">
                  <div className="flex justify-between">
                    <span>Fulfillment Method:</span>
                    <span className="font-medium capitalize">{fulfillmentMethod}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Fulfillment Date:</span>
                    <span className="font-medium">{fulfillmentDate}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chosen Payment Method:</span>
                    <span className="font-medium font-bold text-rose">{paymentMethod === 'COD' ? 'Cash on Delivery (COD)' : 'Online Payment (Razorpay)'}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col gap-4">
                {paymentMethod === 'COD' ? (
                  <div className="p-5 border-2 border-rose/30 bg-rose/5 rounded-2xl flex flex-col gap-2">
                    <h4 className="font-bold text-chocolate uppercase tracking-wider text-sm">Cash on Delivery Confirmation</h4>
                    <p className="text-xs text-chocolate/70 leading-relaxed">
                      You have chosen to pay upon delivery or collection. Our pâtisserie chefs will handcraft your items fresh, and you can pay securely with Cash or UPI upon receiving your desserts!
                    </p>
                  </div>
                ) : (
                  <div className="p-5 border-2 border-rose/30 bg-rose/5 rounded-2xl flex flex-col gap-2">
                    <h4 className="font-bold text-chocolate uppercase tracking-wider text-sm">Online Gateway Confirmation</h4>
                    <p className="text-xs text-chocolate/70 leading-relaxed">
                      Pay instantly with UPI (Google Pay, PhonePe, Paytm), Cards (RuPay, Visa, Mastercard) or Netbanking via the secure Razorpay payment modal.
                    </p>
                  </div>
                )}
              </div>

              {/* Action Buttons based on Choice */}
              <div className="border-t border-chocolate/5 pt-6 mt-4 flex gap-4">
                <Button variant="outline" type="button" onClick={() => setStep(2)} disabled={isProcessing} className="w-1/3">
                  Back
                </Button>
                
                {paymentMethod === 'COD' ? (
                  <Button 
                    onClick={handleCODPayment}
                    isLoading={isProcessing}
                    className="w-2/3 shadow-hover"
                  >
                    Confirm & Place Order (COD)
                  </Button>
                ) : razorpayOrderData?.isMock ? (
                  <Button 
                    onClick={handleMockRazorpayPayment}
                    isLoading={isProcessing}
                    className="w-2/3 bg-rose text-white shadow-hover hover:bg-rose/95 border-none"
                  >
                    Authorize Sandbox Payment (₹{total})
                  </Button>
                ) : (
                  <Button 
                    onClick={handleRealRazorpayPayment}
                    isLoading={isProcessing}
                    className="w-2/3 shadow-hover"
                  >
                    Pay with Razorpay (₹{total})
                  </Button>
                )}
              </div>

              {paymentMethod === 'razorpay' && razorpayOrderData?.isMock && (
                <div className="bg-[#FAF6F1] border border-rose/10 p-4 rounded-xl text-xs text-rose/85 font-medium mt-2 leading-relaxed">
                  📢 <strong>Developer Notice:</strong> Razorpay API credentials are currently unconfigured or running in local development mode. Dynamic checkout sandbox is active. Click "Authorize Sandbox Payment" to immediately mock order completion!
                </div>
              )}
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
                    <img 
                      src={item.image} 
                      alt={item.productName} 
                      className="w-full h-full object-cover" 
                      onError={(e) => { e.target.src = getFallbackImage(item.productId, 'light'); }}
                    />
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
