import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import ContactModal from './components/ContactModal';

import HomePage from './pages/HomePage';
import CatalogPage from './pages/CatalogPage';
import PropertyDetailPage from './pages/PropertyDetailPage';
import AboutPage from './pages/AboutPage';
import ServicesPage from './pages/ServicesPage';
import ContactPage from './pages/ContactPage';

import AdminPage from './pages/AdminPage';

export default function App() {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-[#080c14] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
        
        {/* Persistent Navbar */}
        <Navbar onOpenContact={() => setIsContactModalOpen(true)} />

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

        {/* Persistent Footer */}
        <Footer />

        {/* Global Quick Contact Modal */}
        <ContactModal
          isOpen={isContactModalOpen}
          onClose={() => setIsContactModalOpen(false)}
        />

      </div>
    </Router>
  );
}
