import React from 'react';
import { Outlet } from 'react-router-dom';

const PageWrapper = () => {
  return (
    <div className="flex flex-col min-h-screen page-transition">
      <header className="p-4 bg-white shadow-sm">Velour Desserts Header</header>
      <main className="flex-1">
        <Outlet />
      </main>
      <footer className="p-4 bg-chocolate text-cream text-center">Velour Desserts Footer</footer>
    </div>
  );
};

export default PageWrapper;
