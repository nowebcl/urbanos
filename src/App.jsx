import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ContentProvider } from './context/ContentContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';
import AdminBar from './components/AdminBar';
import WhatsAppButton from './components/WhatsAppButton';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';
import AdminPage from './pages/AdminPage';

function AppContent() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const location = useLocation();
  const isAdminRoute = location.pathname === '/admin';

  return (
    <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Top Admin Control Bar */}
      <AdminBar />

      {/* Persistent Navbar (hidden on /admin) */}
      {!isAdminRoute && <Navbar onOpenContact={() => setIsContactModalOpen(true)} />}

      {/* Dynamic Route View */}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<HomePage onOpenContact={() => setIsContactModalOpen(true)} />} />
          <Route path="/propiedades" element={<CatalogPage />} />
          <Route path="/propiedades/:slug" element={<PropertyDetailPage />} />
          <Route path="/nosotros" element={<AboutPage onOpenContact={() => setIsContactModalOpen(true)} />} />
          <Route path="/servicios" element={<ServicesPage />} />
          <Route path="/vender-arrendar" element={<ServicesPage />} />
          <Route path="/contacto" element={<ContactPage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Persistent Footer (hidden on /admin) */}
      {!isAdminRoute && <Footer />}

      {/* Global Quick Contact Modal */}
      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

      {/* Floating WhatsApp Button (Bottom-Left) */}
      <WhatsAppButton />

    </div>
  );
}

export default function App() {
  return (
    <ContentProvider>
      <Router>
        <ScrollToTop />
        <AppContent />
      </Router>
    </ContentProvider>
  );
}
