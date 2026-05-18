import React, { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { LayoutDashboard, ShoppingBag, FolderHeart, CalendarDays, TicketPercent, Home, LogOut } from 'lucide-react';
import { ROUTES } from '../../constants/routes';

const AdminLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    // Basic guard: If not logged in or not admin, redirect
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN);
    } else if (user?.role !== 'admin') {
      navigate(ROUTES.HOME);
    }
  }, [user, isAuthenticated, navigate]);

  if (!isAuthenticated || user?.role !== 'admin') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-cream text-chocolate font-display text-xl">
        Checking authorizations...
      </div>
    );
  }

  const sidebarLinks = [
    { label: 'Overview', icon: LayoutDashboard, path: ROUTES.ADMIN_DASHBOARD },
    { label: 'Storefront Home', icon: Home, path: ROUTES.HOME },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-chocolate text-cream flex flex-col border-r border-chocolate-dark">
        {/* Brand Header */}
        <div className="p-6 border-b border-white/5 bg-chocolate-dark">
          <Link to={ROUTES.ADMIN_DASHBOARD} className="flex flex-col gap-1">
            <h1 className="font-display text-xl font-bold tracking-tight text-white">
              Velour <span className="text-rose italic font-normal">Desserts</span>
            </h1>
            <span className="text-[10px] uppercase tracking-widest text-rose-light font-bold">Admin Console</span>
          </Link>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 p-4 flex flex-col gap-2">
          {sidebarLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-rose text-white shadow-md' 
                    : 'text-cream/80 hover:bg-white/5 hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer Account Details */}
        <div className="p-4 border-t border-white/5 bg-chocolate-dark/50 flex items-center gap-3">
          <div className="w-10 h-10 bg-rose text-white rounded-full flex items-center justify-center font-bold shadow-sm">
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-white truncate">{user.name}</p>
            <p className="text-[10px] text-cream/60 truncate">{user.email}</p>
          </div>
        </div>
      </aside>

      {/* Main Panel Content Area */}
      <main className="flex-1 overflow-y-auto h-screen p-8 lg:p-12">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
