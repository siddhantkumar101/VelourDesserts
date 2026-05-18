import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, ShoppingBag, Package, Calendar, TicketPercent, 
  Plus, Edit2, Trash2, CheckCircle, RefreshCw, X, AlertCircle 
} from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, 
  BarChart, Bar, Legend, Cell 
} from 'recharts';
import api from '../../services/api';
import { formatCurrency } from '../../utils/formatCurrency';
import { useDispatch } from 'react-redux';
import { addToast } from '../../stores/uiSlice';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';

// ==========================================
// 1. ANALYTICS & OVERVIEW PANEL
// ==========================================
const OverviewTab = ({ analytics, orders }) => {
  const stats = [
    { label: 'Total Revenue', value: formatCurrency(analytics?.totalRevenue || 0), icon: TrendingUp, color: 'text-success bg-success/10' },
    { label: 'Total Orders', value: analytics?.totalOrders || 0, icon: ShoppingBag, color: 'text-rose bg-rose/10' },
    { label: 'Avg Order Value (AOV)', value: formatCurrency(analytics?.avgOrderValue || 0), icon: Package, color: 'text-gold bg-gold/10' },
  ];

  // Chart data formatting
  const revenueData = analytics?.monthlyRevenue?.map(item => ({
    name: item.month,
    Revenue: item.revenue,
  })) || [
    { name: 'Jan', Revenue: 45000 },
    { name: 'Feb', Revenue: 52000 },
    { name: 'Mar', Revenue: 61000 },
    { name: 'Apr', Revenue: 78000 },
  ];

  const categoryData = analytics?.categorySales?.map(item => ({
    name: item.category,
    Sales: item.salesCount,
  })) || [
    { name: 'Cakes', Sales: 120 },
    { name: 'Tarts', Sales: 80 },
    { name: 'Cookies', Sales: 210 },
  ];

  return (
    <div className="flex flex-col gap-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div key={i} className="bg-white p-6 rounded-2xl border border-chocolate/5 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-sm text-chocolate/50 font-medium">{stat.label}</span>
                <h4 className="text-2xl font-bold text-chocolate mt-1">{stat.value}</h4>
              </div>
              <div className={`p-4 rounded-xl ${stat.color}`}>
                <Icon className="w-6 h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Recharts Plots */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Revenue Area Chart */}
        <div className="bg-white p-6 rounded-2xl border border-chocolate/5 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Revenue Trend</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C9897B" stopOpacity={0.8}/>
                    <stop offset="95%" stopColor="#C9897B" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Area type="monotone" dataKey="Revenue" stroke="#C9897B" fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Bar Chart */}
        <div className="bg-white p-6 rounded-2xl border border-chocolate/5 shadow-sm">
          <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Sales by Category</h3>
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={categoryData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f1f1" />
                <XAxis dataKey="name" stroke="#888888" fontSize={12} />
                <YAxis stroke="#888888" fontSize={12} />
                <Tooltip />
                <Bar dataKey="Sales" fill="#3A2012" radius={[4, 4, 0, 0]}>
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#3A2012' : '#C9897B'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders table snippet */}
      <div className="bg-white p-6 rounded-2xl border border-chocolate/5 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Recent Orders</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-chocolate/10 text-chocolate/50 text-sm font-semibold">
                <th className="pb-3">Order ID</th>
                <th className="pb-3">Customer</th>
                <th className="pb-3">Fulfillment</th>
                <th className="pb-3">Status</th>
                <th className="pb-3">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate/5 text-sm text-chocolate">
              {orders.slice(0, 5).map((order) => (
                <tr key={order._id}>
                  <td className="py-4 font-mono font-bold text-rose">{order.orderId}</td>
                  <td className="py-4">{order.fulfilmentDetails?.customerName || 'Guest'}</td>
                  <td className="py-4 capitalize">{order.fulfilmentDetails?.method}</td>
                  <td className="py-4">
                    <Badge variant={order.status === 'Completed' ? 'success' : 'primary'}>{order.status}</Badge>
                  </td>
                  <td className="py-4 font-bold">{formatCurrency(order.pricing?.total || 0)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 2. ORDER MANAGEMENT PANEL
// ==========================================
const OrdersTab = ({ orders, onUpdateStatus }) => {
  const [filter, setFilter] = useState('All');

  const filteredOrders = filter === 'All' 
    ? orders 
    : orders.filter(o => o.status === filter);

  return (
    <div className="bg-white p-6 md:p-8 rounded-2xl border border-chocolate/5 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <h2 className="font-serif text-xl font-bold text-chocolate">Fulfillment Control</h2>
        <div className="flex flex-wrap gap-2">
          {['All', 'Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'].map(status => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors ${
                filter === status 
                  ? 'bg-chocolate text-white' 
                  : 'bg-cream hover:bg-cream-dark text-chocolate/80'
              }`}
            >
              {status}
            </button>
          ))}
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-chocolate/10 text-chocolate/50 text-sm font-semibold">
              <th className="pb-3">Order ID</th>
              <th className="pb-3">Fulfillment Date</th>
              <th className="pb-3">Contact</th>
              <th className="pb-3">Method</th>
              <th className="pb-3">Total</th>
              <th className="pb-3">Fulfillment Status</th>
              <th className="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-chocolate/5 text-sm text-chocolate">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan="7" className="py-8 text-center text-chocolate/50">No orders found matching this filter.</td>
              </tr>
            ) : (
              filteredOrders.map(order => (
                <tr key={order._id}>
                  <td className="py-4 font-mono font-bold text-rose">{order.orderId}</td>
                  <td className="py-4">{new Date(order.fulfilmentDate).toLocaleDateString()}</td>
                  <td className="py-4">
                    <p className="font-semibold">{order.fulfilmentDetails?.customerName}</p>
                    <p className="text-xs text-chocolate/50">{order.fulfilmentDetails?.phone}</p>
                  </td>
                  <td className="py-4 capitalize">{order.fulfilmentDetails?.method}</td>
                  <td className="py-4 font-bold">{formatCurrency(order.pricing?.total || 0)}</td>
                  <td className="py-4">
                    <Badge variant={order.status === 'Completed' ? 'success' : order.status === 'Cancelled' ? 'danger' : 'primary'}>
                      {order.status}
                    </Badge>
                  </td>
                  <td className="py-4 text-right">
                    <div className="flex justify-end gap-2">
                      {order.status === 'Pending' && (
                        <Button size="sm" onClick={() => onUpdateStatus(order._id, 'Preparing')}>
                          Prepare
                        </Button>
                      )}
                      {order.status === 'Preparing' && (
                        <Button size="sm" onClick={() => onUpdateStatus(order._id, 'Ready')}>
                          Mark Ready
                        </Button>
                      )}
                      {order.status === 'Ready' && (
                        <Button size="sm" onClick={() => onUpdateStatus(order._id, 'Completed')}>
                          Complete
                        </Button>
                      )}
                      {order.status !== 'Completed' && order.status !== 'Cancelled' && (
                        <button 
                          onClick={() => onUpdateStatus(order._id, 'Cancelled')}
                          className="px-3 py-1.5 rounded-lg border border-error/20 text-error hover:bg-error/5 text-xs font-semibold transition-colors"
                        >
                          Cancel
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// ==========================================
// 3. PRODUCT CATALOG MANAGEMENT
// ==========================================
const ProductsTab = ({ products, onAddProduct, onDeleteProduct }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'Cakes',
    basePrice: '',
    leadTimeDays: 2,
    flavours: '',
    imageUrl: '',
  });

  const handleCreate = (e) => {
    e.preventDefault();
    const productData = {
      ...formData,
      basePrice: Number(formData.basePrice),
      flavours: formData.flavours.split(',').map(f => f.trim()).filter(Boolean),
      images: [{ url: formData.imageUrl || 'https://placehold.co/400x500', isPrimary: true, altText: formData.name }],
      variants: [
        { label: 'Standard', servings: '4-6', priceINR: Number(formData.basePrice), isAvailable: true }
      ]
    };
    onAddProduct(productData);
    setIsModalOpen(false);
    setFormData({ name: '', description: '', category: 'Cakes', basePrice: '', leadTimeDays: 2, flavours: '', imageUrl: '' });
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex justify-between items-center bg-white p-6 rounded-2xl border border-chocolate/5 shadow-sm">
        <div>
          <h2 className="font-serif text-xl font-bold text-chocolate">Dessert Catalog</h2>
          <p className="text-sm text-chocolate/60">Configure and customize available products.</p>
        </div>
        <Button onClick={() => setIsModalOpen(true)} className="flex items-center gap-2">
          <Plus className="w-5 h-5" /> Add Dessert
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(product => (
          <div key={product._id} className="bg-white rounded-2xl overflow-hidden border border-chocolate/5 shadow-sm flex flex-col">
            <div className="aspect-[4/5] bg-cream-dark relative">
              <img 
                src={product.images?.[0]?.url || 'https://placehold.co/400x500'} 
                alt={product.name} 
                className="w-full h-full object-cover" 
              />
              <button 
                onClick={() => onDeleteProduct(product._id)}
                className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur-sm text-error rounded-full hover:bg-error hover:text-white transition-colors shadow-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5 flex flex-col flex-1">
              <span className="text-[10px] uppercase font-bold text-rose tracking-wider">{product.category}</span>
              <h4 className="font-serif text-lg font-bold text-chocolate mt-1">{product.name}</h4>
              <p className="text-sm text-chocolate font-bold mt-2">{formatCurrency(product.basePrice)}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Creation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-chocolate/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-lg w-full shadow-2xl relative max-h-[90vh] overflow-y-auto">
            <button onClick={() => setIsModalOpen(false)} className="absolute top-6 right-6 p-2 text-chocolate/50 hover:text-chocolate rounded-full hover:bg-cream-dark">
              <X className="w-5 h-5" />
            </button>
            <h3 className="font-display text-2xl font-bold text-chocolate mb-6">Create New Dessert</h3>
            <form onSubmit={handleCreate} className="flex flex-col gap-4">
              <Input label="Name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              <Input label="Description" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-chocolate">Category</label>
                  <select 
                    value={formData.category} 
                    onChange={e => setFormData({ ...formData, category: e.target.value })}
                    className="w-full p-3 border border-chocolate/20 rounded-lg text-chocolate text-sm bg-white mt-1.5 focus:outline-none focus:ring-2 focus:ring-rose/25 focus:border-rose"
                  >
                    {['Cakes', 'Tarts', 'Cookies', 'Gifting', 'Seasonal'].map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <Input label="Base Price (INR)" type="number" value={formData.basePrice} onChange={e => setFormData({ ...formData, basePrice: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Lead Time (Days)" type="number" value={formData.leadTimeDays} onChange={e => setFormData({ ...formData, leadTimeDays: Number(e.target.value) })} required />
                <Input label="Image URL" type="url" value={formData.imageUrl} onChange={e => setFormData({ ...formData, imageUrl: e.target.value })} placeholder="https://..." />
              </div>
              <Input label="Flavours (comma-separated)" value={formData.flavours} onChange={e => setFormData({ ...formData, flavours: e.target.value })} placeholder="Chocolate, Vanilla, Salted Caramel" />
              <Button type="submit" className="w-full mt-2">Create Product</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

// ==========================================
// 4. BLOCKOUT DATES PANEL
// ==========================================
const BlockoutsTab = ({ blockouts, onAddBlockout, onDeleteBlockout }) => {
  const [newDate, setNewDate] = useState('');
  const [reason, setReason] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!newDate) return;
    onAddBlockout({ date: newDate, reason: reason || 'Fully booked capacity' });
    setNewDate('');
    setReason('');
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Creator Panel */}
      <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-2xl border border-chocolate/5 shadow-sm h-fit">
        <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Block Delivery Date</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Date" 
            type="date" 
            value={newDate} 
            onChange={e => setNewDate(e.target.value)} 
            required 
          />
          <Input 
            label="Reason / Notes" 
            value={reason} 
            onChange={e => setReason(e.target.value)} 
            placeholder="Holiday or full capacity" 
          />
          <Button type="submit" className="w-full mt-2">Block Date</Button>
        </form>
      </div>

      {/* Blocked Dates List */}
      <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-chocolate/5 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Blocked Dates</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-chocolate/10 text-chocolate/50 text-sm font-semibold">
                <th className="pb-3">Blocked Date</th>
                <th className="pb-3">Reason</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate/5 text-sm text-chocolate">
              {blockouts.length === 0 ? (
                <tr>
                  <td colSpan="3" className="py-8 text-center text-chocolate/50">No dates blocked currently. All dates open.</td>
                </tr>
              ) : (
                blockouts.map(b => (
                  <tr key={b._id}>
                    <td className="py-4 font-mono font-bold text-rose">{new Date(b.date).toLocaleDateString()}</td>
                    <td className="py-4 text-chocolate/80">{b.reason}</td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => onDeleteBlockout(b._id)}
                        className="text-error hover:bg-error/5 p-2 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// 5. COUPON MANAGER PANEL
// ==========================================
const CouponsTab = ({ coupons, onCreateCoupon, onDeleteCoupon }) => {
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: '',
    minOrderAmount: '',
    expiryDate: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onCreateCoupon({
      ...formData,
      discountValue: Number(formData.discountValue),
      minOrderAmount: Number(formData.minOrderAmount || 0),
    });
    setFormData({ code: '', discountType: 'percentage', discountValue: '', minOrderAmount: '', expiryDate: '' });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Creator Form */}
      <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-2xl border border-chocolate/5 shadow-sm h-fit">
        <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Create Coupon</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <Input 
            label="Promo Code" 
            value={formData.code} 
            onChange={e => setFormData({ ...formData, code: e.target.value.toUpperCase() })} 
            placeholder="VELOUR10" 
            required 
          />
          <div>
            <label className="text-sm font-medium text-chocolate">Discount Type</label>
            <select 
              value={formData.discountType} 
              onChange={e => setFormData({ ...formData, discountType: e.target.value })}
              className="w-full p-3 border border-chocolate/20 rounded-lg text-chocolate text-sm bg-white mt-1.5 focus:outline-none focus:ring-2 focus:ring-rose/25 focus:border-rose"
            >
              <option value="percentage">Percentage (%)</option>
              <option value="fixed">Fixed Amount (INR)</option>
            </select>
          </div>
          <Input 
            label="Discount Value" 
            type="number" 
            value={formData.discountValue} 
            onChange={e => setFormData({ ...formData, discountValue: e.target.value })} 
            required 
          />
          <Input 
            label="Minimum Order Amount (INR)" 
            type="number" 
            value={formData.minOrderAmount} 
            onChange={e => setFormData({ ...formData, minOrderAmount: e.target.value })} 
          />
          <Input 
            label="Expiry Date" 
            type="date" 
            value={formData.expiryDate} 
            onChange={e => setFormData({ ...formData, expiryDate: e.target.value })} 
          />
          <Button type="submit" className="w-full mt-2">Generate Coupon</Button>
        </form>
      </div>

      {/* Coupons List */}
      <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-2xl border border-chocolate/5 shadow-sm">
        <h3 className="font-serif text-lg font-bold text-chocolate mb-4">Promotional Coupons</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-chocolate/10 text-chocolate/50 text-sm font-semibold">
                <th className="pb-3">Code</th>
                <th className="pb-3">Benefit</th>
                <th className="pb-3">Min Order</th>
                <th className="pb-3">Expiry</th>
                <th className="pb-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-chocolate/5 text-sm text-chocolate">
              {coupons.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-8 text-center text-chocolate/50">No promotional coupons created yet.</td>
                </tr>
              ) : (
                coupons.map(c => (
                  <tr key={c._id}>
                    <td className="py-4 font-mono font-bold text-rose">{c.code}</td>
                    <td className="py-4">
                      {c.discountType === 'percentage' ? `${c.discountValue}% Off` : formatCurrency(c.discountValue)}
                    </td>
                    <td className="py-4">{c.minOrderAmount ? formatCurrency(c.minOrderAmount) : 'No Minimum'}</td>
                    <td className="py-4 text-chocolate/70">
                      {c.expiryDate ? new Date(c.expiryDate).toLocaleDateString() : 'Never'}
                    </td>
                    <td className="py-4 text-right">
                      <button 
                        onClick={() => onDeleteCoupon(c._id)}
                        className="text-error hover:bg-error/5 p-2 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

// ==========================================
// MAIN ADMIN DASHBOARD EXPORT
// ==========================================
const AdminDashboard = () => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState('overview');
  
  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [blockouts, setBlockouts] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchDashboardData = async () => {
    setIsLoading(true);
    try {
      const [resAnal, resOrd, resProd, resBlock, resCoup] = await Promise.all([
        api.get('/admin/analytics').catch(() => ({ data: { analytics: null } })),
        api.get('/admin/orders'),
        api.get('/products'),
        api.get('/admin/blockout-dates').catch(() => ({ data: { dates: [] } })),
        api.get('/admin/coupons').catch(() => ({ data: { coupons: [] } })),
      ]);

      setAnalytics(resAnal.data.analytics);
      setOrders(resOrd.data.orders);
      setProducts(resProd.data.products);
      setBlockouts(resBlock.data.dates || []);
      setCoupons(resCoup.data.coupons || []);
    } catch (error) {
      console.error(error);
      dispatch(addToast({ message: 'Failed to load panel details.', type: 'error' }));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.patch(`/admin/orders/${id}/status`, { status });
      dispatch(addToast({ message: `Order status advanced to ${status}!`, type: 'success' }));
      fetchDashboardData(); // Refresh metrics and lists
    } catch (error) {
      dispatch(addToast({ message: 'Failed to transition order status.', type: 'error' }));
    }
  };

  const handleAddProduct = async (productData) => {
    try {
      await api.post('/products', productData);
      dispatch(addToast({ message: 'Dessert successfully created!', type: 'success' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to add product to catalog.', type: 'error' }));
    }
  };

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product from catalog?')) return;
    try {
      await api.delete(`/products/${id}`);
      dispatch(addToast({ message: 'Product deleted successfully', type: 'info' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to delete product', type: 'error' }));
    }
  };

  const handleAddBlockout = async (blockoutData) => {
    try {
      await api.post('/admin/blockout-dates', blockoutData);
      dispatch(addToast({ message: 'Fulfillment date blocked!', type: 'success' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to block date.', type: 'error' }));
    }
  };

  const handleDeleteBlockout = async (id) => {
    try {
      await api.delete(`/admin/blockout-dates/${id}`);
      dispatch(addToast({ message: 'Date reopened for order booking', type: 'info' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to reopen date.', type: 'error' }));
    }
  };

  const handleCreateCoupon = async (couponData) => {
    try {
      await api.post('/admin/coupons', couponData);
      dispatch(addToast({ message: 'Promo code generated successfully', type: 'success' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to generate coupon code.', type: 'error' }));
    }
  };

  const handleDeleteCoupon = async (id) => {
    try {
      await api.delete(`/admin/coupons/${id}`);
      dispatch(addToast({ message: 'Promo code deactivated', type: 'info' }));
      fetchDashboardData();
    } catch (error) {
      dispatch(addToast({ message: 'Failed to remove coupon code.', type: 'error' }));
    }
  };

  const tabs = [
    { id: 'overview', label: 'Metrics', icon: TrendingUp },
    { id: 'orders', label: 'Orders', icon: ShoppingBag },
    { id: 'products', label: 'Products', icon: Package },
    { id: 'blockouts', label: 'Blockouts', icon: Calendar },
    { id: 'coupons', label: 'Coupons', icon: TicketPercent },
  ];

  if (isLoading) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center text-chocolate font-medium gap-3">
        <RefreshCw className="w-5 h-5 animate-spin" /> Gathering administrator context...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header and Sync Control */}
      <div className="flex justify-between items-center border-b border-chocolate/5 pb-6">
        <div>
          <span className="text-[10px] uppercase font-bold text-rose tracking-wider">Operations Suite</span>
          <h1 className="font-display text-4xl font-bold text-chocolate mt-1">Founder Dashboard</h1>
        </div>
        <button 
          onClick={fetchDashboardData}
          className="p-3 bg-white hover:bg-cream-dark border border-chocolate/10 rounded-xl transition-all shadow-sm hover:shadow text-chocolate"
        >
          <RefreshCw className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs list */}
      <div className="flex border-b border-chocolate/10 gap-2 overflow-x-auto pb-1">
        {tabs.map(tab => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-5 py-3 rounded-t-xl text-sm font-semibold transition-all border-b-2 whitespace-nowrap ${
                isActive 
                  ? 'border-rose text-rose bg-rose/5 font-bold' 
                  : 'border-transparent text-chocolate/60 hover:text-chocolate hover:bg-cream/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* Panels Render */}
      <div className="page-transition">
        {activeTab === 'overview' && <OverviewTab analytics={analytics} orders={orders} />}
        {activeTab === 'orders' && <OrdersTab orders={orders} onUpdateStatus={handleUpdateOrderStatus} />}
        {activeTab === 'products' && (
          <ProductsTab 
            products={products} 
            onAddProduct={handleAddProduct} 
            onDeleteProduct={handleDeleteProduct} 
          />
        )}
        {activeTab === 'blockouts' && (
          <BlockoutsTab 
            blockouts={blockouts} 
            onAddBlockout={handleAddBlockout} 
            onDeleteBlockout={handleDeleteBlockout} 
          />
        )}
        {activeTab === 'coupons' && (
          <CouponsTab 
            coupons={coupons} 
            onCreateCoupon={handleCreateCoupon} 
            onDeleteCoupon={handleDeleteCoupon} 
          />
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
