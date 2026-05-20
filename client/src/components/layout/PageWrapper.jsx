import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import CartSidebar from '../storefront/CartSidebar';

const PageWrapper = () => {
  return (
    <div className="flex flex-col min-h-screen bg-cream page-transition">
      <Navbar />
      <CartSidebar />
      <main className="flex-1 flex flex-col pt-[82px] sm:pt-[92px] lg:pt-[108px]">
        {/* We add padding top to account for the fixed navbar */}
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

export default PageWrapper;
