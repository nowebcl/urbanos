import React, { useState, useMemo } from 'react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CityExplorer from './components/CityExplorer';
import StatsBar from './components/StatsBar';
import PropertiesGrid from './components/PropertiesGrid';
import CtaBanner from './components/CtaBanner';
import Footer from './components/Footer';
import PropertyModal from './components/PropertyModal';
import ContactModal from './components/ContactModal';
import { PROPERTIES } from './data/mockData';

export default function App() {
  const [selectedOperation, setSelectedOperation] = useState('Venta');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [activeCity, setActiveCity] = useState('');
  const [currencyMode, setCurrencyMode] = useState('UF');
  
  const [selectedPropertyModal, setSelectedPropertyModal] = useState(null);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const toggleCurrency = () => {
    setCurrencyMode(prev => (prev === 'UF' ? 'CLP' : 'UF'));
  };

  // Filter properties in real time
  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter(item => {
      // Operation filter
      if (item.operation !== selectedOperation) return false;

      // Property type filter
      if (selectedType !== 'All' && item.type !== selectedType) return false;

      // City card filter
      if (activeCity && !item.commune.toLowerCase().includes(activeCity.toLowerCase())) {
        return false;
      }

      // Text search query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesTitle = item.title.toLowerCase().includes(query);
        const matchesLoc = item.location.toLowerCase().includes(query);
        const matchesCommune = item.commune.toLowerCase().includes(query);
        const matchesType = item.type.toLowerCase().includes(query);
        if (!matchesTitle && !matchesLoc && !matchesCommune && !matchesType) {
          return false;
        }
      }

      return true;
    });
  }, [selectedOperation, selectedType, activeCity, searchQuery]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedType('All');
    setActiveCity('');
  };

  const activeFilterCount = (searchQuery ? 1 : 0) + (selectedType !== 'All' ? 1 : 0) + (activeCity ? 1 : 0);

  return (
    <div className="min-h-screen bg-[#090d16] text-slate-100 flex flex-col font-sans selection:bg-orange-500 selection:text-white">
      
      {/* Navigation Bar */}
      <Navbar
        onOpenContact={() => setIsContactModalOpen(true)}
        currencyMode={currencyMode}
        toggleCurrency={toggleCurrency}
      />

      <main className="flex-1">
        
        {/* Hero Section */}
        <HeroSection
          selectedOperation={selectedOperation}
          setSelectedOperation={setSelectedOperation}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          onExecuteSearch={() => {
            const el = document.getElementById('propiedades');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Featured Cities Explorer */}
        <CityExplorer
          activeCity={activeCity}
          onSelectCity={(city) => {
            setActiveCity(city);
            const el = document.getElementById('propiedades');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }}
        />

        {/* Trust & Stats Bar */}
        <StatsBar />

        {/* Featured Properties Grid */}
        <PropertiesGrid
          properties={filteredProperties}
          currencyMode={currencyMode}
          onSelectProperty={(prop) => setSelectedPropertyModal(prop)}
          onViewAll={handleResetFilters}
          activeFilterCount={activeFilterCount}
        />

        {/* Call to Action Banner */}
        <CtaBanner
          onOpenContact={() => setIsContactModalOpen(true)}
        />

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <PropertyModal
        property={selectedPropertyModal}
        onClose={() => setSelectedPropertyModal(null)}
        currencyMode={currencyMode}
      />

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
      />

    </div>
  );
}
