import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { User, Package, LogOut, Settings } from 'lucide-react';
import { authService } from '../../services/auth.service';
import api from '../../services/api'; // direct api for orders in this example
import { logout } from '../../stores/authSlice';
import { addToast } from '../../stores/uiSlice';
import { ROUTES } from '../../constants/routes';
import { formatCurrency } from '../../utils/formatCurrency';
import Button from '../../components/ui/Button';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('orders');
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate(ROUTES.LOGIN);
    }
  }, [user, navigate]);

  useEffect(() => {
    const fetchOrders = async () => {
      if (activeTab === 'orders') {
        setIsLoadingOrders(true);
        try {
          const res = await api.get('/orders');
          setOrders(res.data.orders);
        } catch (error) {
          console.error(error);
        } finally {
          setIsLoadingOrders(false);
        }
      }
    };
    fetchOrders();
  }, [activeTab]);

  const handleLogout = async () => {
    try {
      await authService.logout();
      dispatch(logout());
      dispatch(addToast({ message: 'Logged out successfully', type: 'info' }));
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error(error);
    }
  };

  if (!user) return null;

  return (
    <div className="w-full min-h-[80vh] bg-cream py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto flex flex-col md:flex-row gap-8">
        
        {/* Sidebar Nav */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-chocolate/5 overflow-hidden">
            <div className="p-6 border-b border-chocolate/5 bg-cream-dark/30 text-center flex flex-col items-center">
              <div className="w-16 h-16 bg-rose text-white rounded-full flex items-center justify-center font-display text-2xl mb-3 shadow-md">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-chocolate text-lg">{user.name}</h2>
              <p className="text-sm text-chocolate/60">{user.email}</p>
            </div>
            
            <nav className="flex flex-col p-2">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium ${activeTab === 'orders' ? 'bg-rose/10 text-rose' : 'text-chocolate/70 hover:bg-cream-dark'}`}
              >
                <Package className="w-5 h-5" /> Order History
              </button>
              <button 
                onClick={() => setActiveTab('profile')}
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium ${activeTab === 'profile' ? 'bg-rose/10 text-rose' : 'text-chocolate/70 hover:bg-cream-dark'}`}
              >
                <User className="w-5 h-5" /> Profile Settings
              </button>
              {user.role === 'admin' && (
                <button 
                  onClick={() => navigate(ROUTES.ADMIN_DASHBOARD)}
                  className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium text-chocolate/70 hover:bg-cream-dark`}
                >
                  <Settings className="w-5 h-5" /> Admin Dashboard
                </button>
              )}
              <div className="h-px bg-chocolate/5 my-2 mx-4" />
              <button 
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-colors text-sm font-medium text-error hover:bg-error/10"
              >
                <LogOut className="w-5 h-5" /> Sign Out
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          <div className="bg-white rounded-2xl shadow-sm border border-chocolate/5 p-6 md:p-8 min-h-[500px]">
            {activeTab === 'orders' && (
              <div>
                <h2 className="font-display text-3xl font-bold text-chocolate mb-6">Order History</h2>
                
                {isLoadingOrders ? (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="animate-pulse bg-cream-dark h-24 rounded-xl" />)}
                  </div>
                ) : orders.length === 0 ? (
                  <div className="text-center py-12">
                    <Package className="w-16 h-16 text-chocolate/20 mx-auto mb-4" />
                    <h3 className="font-serif text-xl font-bold text-chocolate">No orders yet</h3>
                    <p className="text-chocolate/60 mt-2">When you place an order, it will appear here.</p>
                    <Button className="mt-6" onClick={() => navigate(ROUTES.SHOP)}>Start Shopping</Button>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {orders.map(order => (
                      <div key={order.orderId} className="border border-chocolate/10 rounded-xl p-5 hover:border-chocolate/30 transition-colors">
                        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 mb-4 pb-4 border-b border-chocolate/5">
                          <div>
                            <span className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Order ID</span>
                            <p className="font-mono text-sm font-bold text-chocolate">{order.orderId}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Date</span>
                            <p className="text-sm text-chocolate">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Status</span>
                            <p className="text-sm font-bold text-rose">{order.status}</p>
                          </div>
                          <div>
                            <span className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Total</span>
                            <p className="text-sm font-bold text-chocolate">{formatCurrency(order.pricing.total)}</p>
                          </div>
                        </div>
                        <div className="text-sm text-chocolate/80">
                          {order.items.length} item(s) • Scheduled for {new Date(order.fulfilmentDate).toLocaleDateString()}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'profile' && (
              <div>
                <h2 className="font-display text-3xl font-bold text-chocolate mb-6">Profile Settings</h2>
                <div className="max-w-md">
                  <div className="mb-4">
                    <label className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Name</label>
                    <p className="text-lg text-chocolate font-medium">{user.name}</p>
                  </div>
                  <div className="mb-4">
                    <label className="text-xs font-bold text-chocolate/50 uppercase tracking-wider">Email</label>
                    <p className="text-lg text-chocolate font-medium">{user.email}</p>
                  </div>
                  {/* Additional profile fields can be added here */}
                  <Button variant="secondary" className="mt-4">Edit Profile</Button>
                </div>
              </div>
            )}
          </div>
        </main>

      </div>
    </div>
  );
};

export default Dashboard;
