import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';

// Layouts
const PageWrapper = React.lazy(() => import('./components/layout/PageWrapper'));
const AdminLayout = React.lazy(() => import('./components/layout/AdminLayout'));

// Storefront Pages
const Home = React.lazy(() => import('./pages/storefront/Home'));
const ProductListing = React.lazy(() => import('./pages/storefront/ProductListing'));
const ProductDetail = React.lazy(() => import('./pages/storefront/ProductDetail'));
const Search = React.lazy(() => import('./pages/storefront/Search'));
const About = React.lazy(() => import('./pages/storefront/About'));
const CustomOrders = React.lazy(() => import('./pages/storefront/CustomOrders'));

// Checkout Pages
const Checkout = React.lazy(() => import('./pages/checkout/Checkout'));
const OrderConfirmation = React.lazy(() => import('./pages/checkout/OrderConfirmation'));

// Account Pages
const Login = React.lazy(() => import('./pages/account/Login'));
const Register = React.lazy(() => import('./pages/account/Register'));
const Dashboard = React.lazy(() => import('./pages/account/Dashboard'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));

// Temporary Loading Fallback
const Fallback = () => <div className="flex items-center justify-center min-h-screen">Loading...</div>;

function App() {
  return (
    <Router>
      <Suspense fallback={<Fallback />}>
        <Routes>
          {/* Public Storefront Routes */}
          <Route element={<PageWrapper />}>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<ProductListing />} />
            <Route path="/shop/:slug" element={<ProductDetail />} />
            <Route path="/search" element={<Search />} />
            <Route path="/about" element={<About />} />
            <Route path="/custom-orders" element={<CustomOrders />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Dashboard />} />
          </Route>

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
    </Router>
  );
}

export default App;
