import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Filter, ChevronDown, Search as SearchIcon } from 'lucide-react';
import { ROUTES } from '../../constants/routes';
import { productService } from '../../services/product.service';
import { formatCurrency } from '../../utils/formatCurrency';
import Badge from '../../components/ui/Badge';
import { handleImageError } from '../../utils/imageFallback';

const CATEGORIES = ['All', 'Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'];
const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest Arrivals' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'popularity', label: 'Most Popular' },
];

const ProductListing = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const currentCategory = searchParams.get('category') || 'All';
  const currentSort = searchParams.get('sort') || 'newest';
  const searchQuery = searchParams.get('search') || '';

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const params = {
          category: currentCategory !== 'All' ? currentCategory : undefined,
          sort: currentSort,
          search: searchQuery || undefined,
        };
        const response = await productService.getProducts(params);
        setProducts(response.data.products);
      } catch (error) {
        console.error('Failed to load products', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, [currentCategory, currentSort, searchQuery]);

  const updateParams = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value === 'All' || !value) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  return (
    <div className="w-full bg-cream min-h-screen pb-24">
      {/* Header Area */}
      <div className="bg-chocolate text-cream py-16 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            {currentCategory === 'All' ? 'Our Entire Collection' : `Artisan ${currentCategory}`}
          </h1>
          <p className="font-serif text-lg text-cream/80 max-w-2xl mx-auto">
            Handcrafted with the finest ingredients, our desserts are designed to make every moment memorable.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 flex flex-col md:flex-row gap-8">
        
        {/* Mobile Filter Toggle */}
        <div className="md:hidden flex justify-between items-center bg-white p-4 rounded-lg shadow-sm">
          <span className="font-medium text-chocolate">{products.length} Products</span>
          <button 
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 text-rose font-medium"
          >
            <Filter className="w-5 h-5" /> Filters
          </button>
        </div>

        {/* Sidebar Filters */}
        <aside className={`md:w-64 flex-shrink-0 flex-col gap-8 ${isFilterOpen ? 'flex' : 'hidden md:flex'}`}>
          {/* Categories */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate/5">
            <h3 className="font-serif text-xl font-bold text-chocolate mb-4 border-b border-chocolate/10 pb-2">Categories</h3>
            <ul className="flex flex-col gap-3">
              {CATEGORIES.map(category => (
                <li key={category}>
                  <button
                    onClick={() => {
                      updateParams('category', category);
                      setIsFilterOpen(false);
                    }}
                    className={`text-left w-full transition-colors ${
                      currentCategory === category 
                        ? 'text-rose font-bold' 
                        : 'text-chocolate/70 hover:text-chocolate'
                    }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Sort */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-chocolate/5">
            <h3 className="font-serif text-xl font-bold text-chocolate mb-4 border-b border-chocolate/10 pb-2">Sort By</h3>
            <ul className="flex flex-col gap-3">
              {SORT_OPTIONS.map(option => (
                <li key={option.value}>
                  <button
                    onClick={() => {
                      updateParams('sort', option.value);
                      setIsFilterOpen(false);
                    }}
                    className={`text-left w-full flex items-center justify-between transition-colors ${
                      currentSort === option.value 
                        ? 'text-rose font-bold' 
                        : 'text-chocolate/70 hover:text-chocolate'
                    }`}
                  >
                    {option.label}
                    {currentSort === option.value && <div className="w-2 h-2 rounded-full bg-rose" />}
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Product Grid */}
        <main className="flex-1">
          {/* Search bar inside grid area for larger screens */}
          <div className="mb-8 hidden md:flex justify-between items-center">
            <span className="font-medium text-chocolate/70">Showing {products.length} products</span>
            <div className="relative w-64">
              <input
                type="text"
                placeholder="Search desserts..."
                value={searchQuery}
                onChange={(e) => updateParams('search', e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-white border border-chocolate/20 rounded-full text-sm focus:outline-none focus:border-rose transition-colors"
              />
              <SearchIcon className="w-4 h-4 text-chocolate/40 absolute left-4 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="animate-pulse bg-white p-4 rounded-xl shadow-sm">
                  <div className="bg-cream-dark w-full aspect-[4/5] rounded-lg mb-4" />
                  <div className="bg-cream-dark h-5 w-3/4 rounded mb-2" />
                  <div className="bg-cream-dark h-4 w-1/4 rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="bg-white py-16 px-4 text-center rounded-xl shadow-sm border border-chocolate/5 flex flex-col items-center">
              <div className="w-16 h-16 bg-cream-dark rounded-full flex items-center justify-center mb-4 text-chocolate/40">
                <SearchIcon className="w-8 h-8" />
              </div>
              <h3 className="font-display text-2xl font-bold text-chocolate mb-2">No products found</h3>
              <p className="text-chocolate/70 max-w-md mb-6">
                We couldn't find any desserts matching your current filters. Try selecting a different category or clearing your search.
              </p>
              <button 
                onClick={() => { updateParams('category', 'All'); updateParams('search', ''); }}
                className="text-rose font-medium hover:underline"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 gap-y-10">
              {products.map((product) => (
                <Link key={product._id} to={ROUTES.PRODUCT_DETAIL(product.slug)} className="group flex flex-col bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-hover transition-all duration-300 border border-chocolate/5 hover:-translate-y-1">
                  <div className="relative w-full aspect-[4/5] overflow-hidden bg-cream-dark">
                    <img 
                      src={product.images.find(img => img.isPrimary)?.url || product.images[0]?.url} 
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      loading="lazy"
                      onError={handleImageError}
                    />
                    <div className="absolute top-3 left-3 flex flex-col gap-2">
                      {product.isFeatured && (
                        <Badge variant="primary" className="shadow-sm">Bestseller</Badge>
                      )}
                      {product.dietaryOptions.some(d => d.label.toLowerCase().includes('eggless')) && (
                        <Badge variant="secondary" className="shadow-sm bg-white/90 backdrop-blur-md">Eggless Option</Badge>
                      )}
                    </div>
                  </div>
                  
                  <div className="p-5 flex flex-col flex-1">
                    <span className="uppercase tracking-widest text-[10px] font-bold text-rose mb-1">{product.category}</span>
                    <h3 className="font-serif text-xl font-bold text-chocolate group-hover:text-rose transition-colors line-clamp-1 mb-2">
                      {product.name}
                    </h3>
                    <p className="text-chocolate/60 text-sm line-clamp-2 mb-4 flex-1">
                      {product.description}
                    </p>
                    <div className="flex items-center justify-between mt-auto">
                      <p className="text-chocolate font-bold text-lg">
                        {formatCurrency(product.basePrice)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;
