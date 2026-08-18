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
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-black">
      {/* Top Sticky Header */}
      <Header />

      {/* Main View Switching Logic */}
      <main className="flex-1 w-full max-w-7xl mx-auto pb-24">
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
          /* Rider View Dashboard */
          <div className="animate-fadeIn space-y-2">
            <SearchDestinationBar
              onOpenBooking={() => setIsBookingOpen(true)}
              selectedDestination={selectedDestination?.name}
            />

            <QuickLocationCards onSelectLocation={handleSelectLocation} />

            <div className="px-4 my-4">
              <LiveDriverMap />
            </div>

            <ServiceCategoriesGrid
              onSelectService={handleSelectService}
              selectedServiceId={selectedService.id}
            />

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
