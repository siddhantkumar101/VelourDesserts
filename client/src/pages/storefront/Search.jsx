import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search as SearchIcon, ShoppingBag, Eye, Heart } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { productService } from '../../services/product.service';
import { addToCart } from '../../stores/cartSlice';
import { toggleCart, addToast } from '../../stores/uiSlice';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { handleImageError } from '../../utils/imageFallback';

const Search = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('relevance');

  useEffect(() => {
    const fetchAllProducts = async () => {
      try {
        const res = await productService.getProducts({ limit: 100 });
        setProducts(res.data.products || []);
      } catch (err) {
        console.error('Failed to fetch search products:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllProducts();
  }, []);

  const handleQuickAdd = (product) => {
    const primaryVariant = product.variants[0];
    if (!primaryVariant) return;

    const payload = {
      productId: product._id,
      productName: product.name,
      variantLabel: primaryVariant.label,
      quantity: 1,
      price: primaryVariant.priceINR,
      image: product.images[0]?.url || 'https://placehold.co/150',
      flavour: product.flavours[0] || '',
      dietaryOption: product.dietaryOptions[0]?.label || '',
      hasGiftWrapping: false,
      customMessage: '',
      specialInstructions: ''
    };

    dispatch(addToCart(payload));
    dispatch(addToast({ message: `${product.name} added to cart!`, type: 'success' }));
  };

  // Filter and Sort Logic
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          product.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
    if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
    return 0; // relevance / index order
  });

  const categories = ['All', 'Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'];

  return (
    <div className="w-full bg-cream min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col gap-10">
        
        {/* Title & Search Input */}
        <div className="text-center flex flex-col gap-4 max-w-2xl mx-auto w-full">
          <h1 className="font-display text-4xl font-bold text-chocolate">Search Our Collection</h1>
          <div className="relative">
            <input
              type="text"
              placeholder="Search chocolate cakes, tarts, cookies..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 rounded-2xl border border-chocolate/10 shadow-sm focus:outline-none focus:border-rose text-chocolate font-serif text-lg bg-white"
            />
            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-chocolate/40" />
          </div>
        </div>

        {/* Category Pills & Sorting Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-chocolate/5 pb-6">
          {/* Pills */}
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold uppercase tracking-wider transition-all ${
                  selectedCategory === cat
                    ? 'bg-rose text-white shadow-md'
                    : 'bg-white text-chocolate border border-chocolate/5 hover:border-chocolate/20'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium text-chocolate/60">Sort By</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="p-2 border border-chocolate/10 rounded-lg text-sm text-chocolate bg-white focus:outline-none focus:border-rose"
            >
              <option value="relevance">Relevance</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-pulse text-chocolate/50 font-serif text-lg">Uncovering sweet treasures...</div>
          </div>
        ) : sortedProducts.length === 0 ? (
          <div className="text-center py-20 flex flex-col items-center gap-4">
            <p className="font-serif text-2xl text-chocolate/60">No sweet matching your search was found...</p>
            <p className="text-sm text-chocolate/40">Try searching "chocolate", "tart", or "rose" instead!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {sortedProducts.map((product) => {
              const primaryImage = product.images.find(img => img.isPrimary) || product.images[0];
              return (
                <div 
                  key={product._id} 
                  className="bg-white rounded-3xl overflow-hidden border border-chocolate/5 hover:shadow-xl transition-all duration-300 group flex flex-col"
                >
                  {/* Photo Container */}
                  <div className="relative aspect-[4/5] overflow-hidden bg-cream-dark">
                    <img 
                      src={primaryImage?.url || 'https://placehold.co/400x500'} 
                      alt={primaryImage?.altText || product.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      onError={handleImageError}
                    />
                    
                    <Badge className="absolute top-4 left-4 bg-cream/90 backdrop-blur-md text-chocolate border-none shadow-sm">
                      {product.category}
                    </Badge>

                    {/* Quick Hover Actions Overlay */}
                    <div className="absolute inset-0 bg-chocolate/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                      <Link to={ROUTES.PRODUCT_DETAIL(product.slug)}>
                        <button className="p-3 bg-white text-chocolate rounded-full shadow-lg hover:bg-rose hover:text-white transition-colors">
                          <Eye className="w-5 h-5" />
                        </button>
                      </Link>
                    </div>
                  </div>

                  {/* Product Details */}
                  <div className="p-5 flex-1 flex flex-col justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <Link to={ROUTES.PRODUCT_DETAIL(product.slug)} className="hover:text-rose transition-colors">
                        <h3 className="font-serif text-lg font-bold text-chocolate leading-tight">{product.name}</h3>
                      </Link>
                      <p className="text-xs text-chocolate/50 font-medium">{product.flavours.join(' | ')}</p>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                      <span className="font-display text-xl font-bold text-rose">
                        {formatCurrency(product.basePrice)}
                      </span>
                      <Button
                        onClick={() => handleQuickAdd(product)}
                        className="py-2 px-3 text-xs flex items-center gap-1 shrink-0"
                      >
                        <ShoppingBag className="w-4 h-4" /> Add
                      </Button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>
    </div>
  );
};

export default Search;
