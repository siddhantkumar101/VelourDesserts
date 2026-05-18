import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import React, { Suspense } from 'react';
import ScrollToTop from './components/common/ScrollToTop';
import ToastContainer from './components/ui/ToastContainer';

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
const FAQ = React.lazy(() => import('./pages/storefront/FAQ'));
const Shipping = React.lazy(() => import('./pages/storefront/Shipping'));
const Returns = React.lazy(() => import('./pages/storefront/Returns'));
const Contact = React.lazy(() => import('./pages/storefront/Contact'));
const PrivacyPolicy = React.lazy(() => import('./pages/storefront/PrivacyPolicy'));

// Checkout Pages
const Checkout = React.lazy(() => import('./pages/checkout/Checkout'));
const OrderConfirmation = React.lazy(() => import('./pages/checkout/OrderConfirmation'));

// Account Pages
const Login = React.lazy(() => import('./pages/account/Login'));
const Register = React.lazy(() => import('./pages/account/Register'));
const Dashboard = React.lazy(() => import('./pages/account/Dashboard'));

// Admin Pages
const AdminDashboard = React.lazy(() => import('./pages/admin/AdminDashboard'));
const AdminLogin = React.lazy(() => import('./pages/admin/AdminLogin'));

// Temporary Loading Fallback
const Fallback = () => <div className="flex items-center justify-center min-h-screen">Loading...</div>;

function App() {
  return (
    <Router>
      <ScrollToTop />
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
            <Route path="/faq" element={<FAQ />} />
            <Route path="/shipping" element={<Shipping />} />
            <Route path="/returns" element={<Returns />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<PrivacyPolicy />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-confirmation/:orderId" element={<OrderConfirmation />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/account" element={<Dashboard />} />
          </Route>

          {/* Dedicated Admin Login Route */}
          <Route path="/admin/login" element={<AdminLogin />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
          </Route>
        </Routes>
      </Suspense>
      <ToastContainer />
    </Router>
  );
}

export default App;
