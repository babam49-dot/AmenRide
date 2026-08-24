import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { RoleProvider, useRole } from './context/RoleContext';
import { Header } from './components/Header';
import { SearchDestinationBar } from './components/SearchDestinationBar';
import { QuickLocationCards } from './components/QuickLocationCards';
import { ServiceCategoriesGrid } from './components/ServiceCategoriesGrid';
import { HeroPromoCard } from './components/HeroPromoCard';
import { BottomNav } from './components/BottomNav';
import { BookingModal } from './components/BookingModal';
import { SearchModal } from './components/SearchModal';
import { DriverView } from './components/DriverView';
import { AdminView } from './components/AdminView';
import { ActivityView } from './components/ActivityView';
import { AccountView } from './components/AccountView';
import { LiveDriverMap } from './components/LiveDriverMap';
import { LocationItem, ServiceCategory } from './types';
import { serviceCategories } from './components/ServiceCategoriesGrid';

const MainContent: React.FC = () => {
  const { role, activeTab, isSearchOpen, setIsSearchOpen } = useRole();
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState<LocationItem | null>(null);
  const [selectedService, setSelectedService] = useState<ServiceCategory>(serviceCategories[0]);

  const handleSelectLocation = (loc: LocationItem) => {
    setSelectedDestination(loc);
    setIsBookingOpen(true);
  };

  const handleSelectService = (service: ServiceCategory) => {
    setSelectedService(service);
    setIsBookingOpen(true);
  };

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col selection:bg-[#FF2E2E] selection:text-white">
      {/* Top Sticky Header */}
      <Header />

      {/* Main View Switching Logic */}
      <main className="flex-1 w-full max-w-md mx-auto sm:max-w-5xl pb-28 overflow-y-auto">
        {activeTab === 'Services' ? (
          <ServiceCategoriesGrid
            onSelectService={handleSelectService}
            selectedServiceId={selectedService.id}
          />
        ) : activeTab === 'Activity' ? (
          <ActivityView />
        ) : activeTab === 'Account' ? (
          <AccountView />
        ) : role === 'driver' ? (
          <DriverView />
        ) : role === 'admin' ? (
          <AdminView />
        ) : (
          /* Rider View Dashboard — Yango layout order */
          <div className="animate-fadeIn">
            {/* 1. 2×2 Service Category Grid */}
            <ServiceCategoriesGrid
              onSelectService={handleSelectService}
              selectedServiceId={selectedService.id}
            />

            {/* 2. "Where to?" pill search bar */}
            <SearchDestinationBar
              onOpenBooking={() => setIsBookingOpen(true)}
              selectedDestination={selectedDestination?.name}
            />

            {/* 3. Live Driver GPS Map Canvas */}
            <LiveDriverMap />

            {/* 4. Suggested / Recent Destinations list */}
            <QuickLocationCards onSelectLocation={handleSelectLocation} />

            {/* 5. Promo Banner */}
            <HeroPromoCard onBookRide={() => setIsBookingOpen(true)} />
          </div>
        )}
      </main>

      {/* Bottom Navigation Glass Bar */}
      <BottomNav />

      {/* Interactive Modals */}
      <BookingModal
        isOpen={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        initialDestination={selectedDestination}
        selectedService={selectedService}
      />

      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectLocation={(locName) => {
          setIsBookingOpen(true);
        }}
      />
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <LanguageProvider>
      <RoleProvider>
        <MainContent />
      </RoleProvider>
    </LanguageProvider>
  );
};

export default App;
