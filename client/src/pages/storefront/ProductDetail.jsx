import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { Calendar, Info, Check, AlertCircle, ShoppingBag } from 'lucide-react';
import { productService } from '../../services/product.service';
import { formatCurrency } from '../../utils/formatCurrency';
import { addToCart } from '../../stores/cartSlice';
import { toggleCart, addToast } from '../../stores/uiSlice';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';

const ProductDetail = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const [selectedFlavour, setSelectedFlavour] = useState('');
  const [selectedDietary, setSelectedDietary] = useState(null);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      setIsLoading(true);
      try {
        const res = await productService.getProductBySlug(slug);
        const prod = res.data.product;
        setProduct(prod);
        if (prod.variants.length > 0) setSelectedVariant(prod.variants[0]);
        if (prod.flavours.length > 0) setSelectedFlavour(prod.flavours[0]);
      } catch (error) {
        console.error(error);
        navigate('/shop');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProduct();
  }, [slug, navigate]);

  if (isLoading) {
    return <div className="min-h-[70vh] flex items-center justify-center text-chocolate font-medium">Loading luxury...</div>;
  }
  if (!product) return null;

  const primaryImage = product.images.find(img => img.isPrimary)?.url || product.images[0]?.url;

  const calculateTotal = () => {
    let total = selectedVariant ? selectedVariant.priceINR : product.basePrice;
    if (selectedDietary && selectedDietary.surchargeINR) {
      total += selectedDietary.surchargeINR;
    }
    return total * quantity;
  };

  const handleAddToCart = () => {
    const item = {
      productId: product._id,
      productName: product.name,
      image: primaryImage,
      variantLabel: selectedVariant?.label || 'Standard',
      flavour: selectedFlavour,
      dietaryOption: selectedDietary?.label || null,
      price: calculateTotal() / quantity,
      quantity,
    };
    
    dispatch(addToCart(item));
    dispatch(addToast({ message: `${product.name} added to your cart.`, type: 'success' }));
    dispatch(toggleCart()); // Open sidebar cart
  };

  return (
    <div className="w-full bg-cream min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
          
          {/* Images Section */}
          <div className="flex flex-col gap-4">
            <div className="w-full aspect-[4/5] bg-cream-dark rounded-2xl overflow-hidden shadow-lg border border-chocolate/5">
              <img 
                src={primaryImage} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {product.images.map((img, idx) => (
                  <div key={idx} className="aspect-square bg-cream-dark rounded-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-rose transition-colors">
                    <img src={img.url} alt={img.altText} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Product Info Section */}
          <div className="flex flex-col py-4">
            <Badge variant="secondary" className="w-fit mb-4">{product.category}</Badge>
            <h1 className="font-display text-4xl lg:text-5xl font-bold text-chocolate mb-2">
              {product.name}
            </h1>
            <p className="font-serif text-2xl text-rose font-medium mb-6">
              {formatCurrency(calculateTotal())}
            </p>
            
            <p className="text-chocolate/80 text-lg leading-relaxed mb-8">
              {product.description}
            </p>

            <div className="h-px w-full bg-chocolate/10 mb-8" />

            {/* Variants / Sizes */}
            {product.variants.length > 0 && (
              <div className="mb-8">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-bold text-chocolate uppercase tracking-wider text-sm">Select Size</h3>
                  {selectedVariant?.servings && (
                    <span className="text-xs text-chocolate/60">Serves approx. {selectedVariant.servings}</span>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.label}
                      disabled={!variant.isAvailable}
                      onClick={() => setSelectedVariant(variant)}
                      className={`
                        py-3 px-4 rounded-xl border text-sm font-medium transition-all
                        ${!variant.isAvailable ? 'opacity-50 cursor-not-allowed bg-cream-dark border-transparent' : 
                          selectedVariant?.label === variant.label 
                            ? 'border-rose bg-rose/5 text-rose shadow-sm' 
                            : 'border-chocolate/20 text-chocolate hover:border-rose/50 bg-white'
                        }
                      `}
                    >
                      {variant.label}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Flavours */}
            {product.flavours.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-chocolate uppercase tracking-wider text-sm mb-3">Select Flavour</h3>
                <div className="flex flex-wrap gap-3">
                  {product.flavours.map((flavour) => (
                    <button
                      key={flavour}
                      onClick={() => setSelectedFlavour(flavour)}
                      className={`
                        py-2 px-5 rounded-full border text-sm font-medium transition-all
                        ${selectedFlavour === flavour 
                          ? 'border-chocolate bg-chocolate text-white shadow-sm' 
                          : 'border-chocolate/20 text-chocolate hover:border-chocolate/50 bg-white'
                        }
                      `}
                    >
                      {flavour}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Dietary Options */}
            {product.dietaryOptions.length > 0 && (
              <div className="mb-8">
                <h3 className="font-bold text-chocolate uppercase tracking-wider text-sm mb-3">Dietary Preferences</h3>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setSelectedDietary(null)}
                    className={`
                      py-2 px-5 rounded-full border text-sm font-medium transition-all
                      ${selectedDietary === null 
                        ? 'border-chocolate bg-chocolate text-white shadow-sm' 
                        : 'border-chocolate/20 text-chocolate hover:border-chocolate/50 bg-white'
                      }
                    `}
                  >
                    Standard Recipe
                  </button>
                  {product.dietaryOptions.filter(d => d.isAvailable).map((option) => (
                    <button
                      key={option.label}
                      onClick={() => setSelectedDietary(option)}
                      className={`
                        py-2 px-5 rounded-full border text-sm font-medium transition-all flex items-center gap-2
                        ${selectedDietary?.label === option.label 
                          ? 'border-chocolate bg-chocolate text-white shadow-sm' 
                          : 'border-chocolate/20 text-chocolate hover:border-chocolate/50 bg-white'
                        }
                      `}
                    >
                      {option.label}
                      {option.surchargeINR > 0 && <span className="text-[10px] opacity-80">(+{formatCurrency(option.surchargeINR)})</span>}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity & Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="flex items-center border border-chocolate/20 rounded-pill bg-white px-2">
                <button 
                  className="w-10 h-11 flex items-center justify-center text-chocolate hover:text-rose transition-colors text-lg"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                >
                  -
                </button>
                <span className="w-10 text-center font-bold text-chocolate">{quantity}</span>
                <button 
                  className="w-10 h-11 flex items-center justify-center text-chocolate hover:text-rose transition-colors text-lg"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
              
              <Button size="lg" className="flex-1 text-lg shadow-hover" onClick={handleAddToCart}>
                <ShoppingBag className="w-5 h-5 mr-2" />
                Add to Cart — {formatCurrency(calculateTotal())}
              </Button>
            </div>

            {/* Lead Time & Info */}
            <div className="bg-cream-dark p-4 rounded-xl border border-chocolate/5 flex flex-col gap-3">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-rose shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-chocolate">Minimum Lead Time: {product.leadTimeDays} Days</p>
                  <p className="text-xs text-chocolate/70">Due to the artisanal nature of this dessert, we require advance notice to prepare it perfectly.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Check className="w-5 h-5 text-success shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-bold text-chocolate">Freshly Made to Order</p>
                  <p className="text-xs text-chocolate/70">Handcrafted in our studio specifically for your delivery date.</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
