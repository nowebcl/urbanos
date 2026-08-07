import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import StatsBar from '../components/StatsBar';
import PropertiesGrid from '../components/PropertiesGrid';
import CtaBanner from '../components/CtaBanner';
import { PROPERTIES } from '../data/mockData';

export default function HomePage({ onOpenContact }) {
  const navigate = useNavigate();
  const [selectedOperation, setSelectedOperation] = useState('Venta');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [activeCity, setActiveCity] = useState('');

  const featuredProperties = PROPERTIES.filter(p => p.isFeatured);

  const handleExecuteSearch = () => {
    const params = new URLSearchParams();
    if (selectedOperation) params.set('operation', selectedOperation);
    if (searchQuery) params.set('query', searchQuery);
    if (selectedType && selectedType !== 'All') params.set('type', selectedType);
    if (activeCity) params.set('city', activeCity);
    
    navigate(`/propiedades?${params.toString()}`);
  };

  const handleSelectCity = (cityName) => {
    setActiveCity(cityName);
    if (cityName) {
      navigate(`/propiedades?city=${encodeURIComponent(cityName)}`);
    }
  };

  return (
    <div>
      <HeroSection
        selectedOperation={selectedOperation}
        setSelectedOperation={setSelectedOperation}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        onExecuteSearch={handleExecuteSearch}
      />

      <StatsBar />

      <PropertiesGrid
        properties={featuredProperties}
        onSelectProperty={(prop) => navigate(`/propiedades/${prop.slug}`)}
        onViewAll={() => navigate('/propiedades')}
      />

      <CtaBanner onOpenContact={onOpenContact} />
    </div>
  );
}
