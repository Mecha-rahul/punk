import React from 'react';
import { StoreProvider, useStore } from './context/StoreContext';
import { AnnouncementBar } from './components/AnnouncementBar';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { HorizontalLookbook } from './components/HorizontalLookbook';
import { ProductGrid } from './components/ProductGrid';
import { DropCountdown } from './components/DropCountdown';
import { BrandStory } from './components/BrandStory';
import { ProductDetailModal } from './components/ProductDetailModal';
import { CartDrawer } from './components/CartDrawer';
import { SizeGuideModal } from './components/SizeGuideModal';
import { SearchModal } from './components/SearchModal';
import { Footer } from './components/Footer';

function MainLayout() {
  const { toastMessage } = useStore();

  return (
    <div className="min-h-screen flex flex-col bg-brand-black text-brand-light">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-brand-surface border border-brand-border text-brand-light px-4 py-3 rounded shadow-2xl font-mono text-xs flex items-center gap-3 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-brand-accent"></span>
          <span>{toastMessage}</span>
        </div>
      )}

      <AnnouncementBar />
      <Header />
      
      <main className="flex-1">
        <Hero />
        <HorizontalLookbook />
        <ProductGrid />
        <DropCountdown />
        <BrandStory />
      </main>

      <Footer />

      {/* Modals & Overlays */}
      <ProductDetailModal />
      <CartDrawer />
      <SizeGuideModal />
      <SearchModal />
    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainLayout />
    </StoreProvider>
  );
}
