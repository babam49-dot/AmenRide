import React, { createContext, useContext, useState } from 'react';
import { Language } from '../types';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  toggleLanguage: () => void;
  t: (key: string) => string;
}

const translations: Record<Language, Record<string, string>> = {
  EN: {
    // Header
    amenLogoText: 'AMEN',
    tagline: 'Ride Hailing Bahir Dar',
    searchPlaceholder: 'Search destinations, landmarks...',
    roleRider: 'Rider',
    roleDriver: 'Driver',
    roleAdmin: 'Admin',
    
    // Search Bar & Destination
    whereTo: 'Where to?',
    searchDestination: 'Search destination in Bahir Dar...',
    pickupNow: 'Pickup now',
    scheduleLater: 'Schedule for later',
    customTime: 'Reserve custom time',

    // Section Titles
    quickDestinations: 'Quick Locations in Bahir Dar',
    servicesTitle: 'AMEN Service Categories',
    promoTitle: 'Go anywhere with AMEN',
    promoDesc: 'Safe, affordable Bajaj & car ride-hailing across Lake Tana shores and Bahir Dar city.',
    bookRide: 'Book a ride now',

    // Services
    instantRideTitle: 'Instant Ride',
    instantRideSub: 'Nearest available Bajaj',
    scheduledRideTitle: 'Scheduled Bajaj',
    scheduledRideSub: 'Reserve for later today',
    expressDeliveryTitle: 'Express Delivery',
    expressDeliverySub: 'Fast package dispatch',
    executiveCarTitle: 'Executive Comfort',
    executiveCarSub: 'AC Car ride across town',

    // Badges
    popular: 'Popular',
    fastest: 'Fastest',
    eco: 'Best Fare',
    premium: 'VIP Comfort',

    // Driver Dashboard
    driverPortal: 'Driver Partner Dashboard',
    onlineStatus: 'ONLINE',
    offlineStatus: 'OFFLINE',
    goOnline: 'Go Online',
    goOffline: 'Go Offline',
    todayEarnings: "Today's Earnings",
    completedTrips: 'Completed Trips',
    driverRating: 'Rating',
    incomingRequest: 'INCOMING TRIP REQUEST',
    acceptRide: 'ACCEPT TRIP (15s)',
    declineRide: 'Decline',

    // Admin Dashboard
    adminPortal: 'Fleet Dispatch & Control Console',
    totalTrips: 'Total Trips Today',
    activeFleet: 'Active Fleet Drivers',
    totalRevenue: 'Total Revenue (ETB)',
    systemStatus: 'System Uptime',

    // Navigation
    navHome: 'Home',
    navServices: 'Services',
    navActivity: 'Activity',
    navAccount: 'Account',

    // Modal & Payments
    selectDestination: 'Select Pickup & Destination',
    estimatedFare: 'Estimated Fare',
    confirmBooking: 'Confirm Ride Booking',
    findingDriver: 'Finding nearest driver near you...',
    tripConfirmed: 'Ride Confirmed!',
    paymentMethod: 'Payment Method',
  },
  AM: {
    // Header
    amenLogoText: 'አሜን',
    tagline: 'ባህር ዳር የትራንስፖርት አገልግሎት',
    searchPlaceholder: 'ቦታዎችን እና ምልክቶችን ይፈልጉ...',
    roleRider: 'ተጓዥ',
    roleDriver: 'አሽከርካሪ',
    roleAdmin: 'አስተዳዳሪ',

    // Search Bar & Destination
    whereTo: 'ወዴት መሄድ ይፈልጋሉ?',
    searchDestination: 'በባህር ዳር መድረሻ ቦታ ይፈልጉ...',
    pickupNow: 'አሁኑኑ ይነሱ',
    scheduleLater: 'ለበኋላ ቀጥሮ ይያዙ',
    customTime: 'የተለየ ሰዓት ይምረጡ',

    // Section Titles
    quickDestinations: 'በባህር ዳር ፈጣን መድረሻዎች',
    servicesTitle: 'የአሜን የአገልግሎት ዓይነቶች',
    promoTitle: 'በአሜን በየትኛውም ቦታ ይጓዙ',
    promoDesc: 'በባህር ዳር እና ጣና ሐይቅ ዙሪያ አስተማማኝ እና ፈጣን የባጃጅና መኪና ትራንስፖርት።',
    bookRide: 'አሁኑኑ ጉዞ ያስይዙ',

    // Services
    instantRideTitle: 'ፈጣን ባጃጅ',
    instantRideSub: 'በቅርብ ያለ ባጃጅ',
    scheduledRideTitle: 'ቀጠሮ ባጃጅ',
    scheduledRideSub: 'ለኋላ ሰዓት ለማስያዝ',
    expressDeliveryTitle: 'ፈጣን መልእክት',
    expressDeliverySub: 'ዕቃዎችን በፈጣን ለማድረስ',
    executiveCarTitle: 'ቪአይፒ መኪና',
    executiveCarSub: 'በምቾት መኪና ለመጓዝ',

    // Badges
    popular: 'ተወዳጅ',
    fastest: 'በጣም ፈጣን',
    eco: 'ተመጣጣኝ ዋጋ',
    premium: 'ምቹ መኪና',

    // Driver Dashboard
    driverPortal: 'የአሽከርካሪ ዳሽቦርድ',
    onlineStatus: 'ሥራ ላይ',
    offlineStatus: 'ከሥራ ውጪ',
    goOnline: 'ሥራ ጀምር',
    goOffline: 'ሥራ ጨርስ',
    todayEarnings: 'የዛሬ ገቢ',
    completedTrips: 'የተጠናቀቁ ጉዞዎች',
    driverRating: 'ደረጃ',
    incomingRequest: 'አዲስ የጉዞ ጥያቄ መጥቷል',
    acceptRide: 'ጥያቄውን ተቀበል (15 ሰከንድ)',
    declineRide: 'አልቀበልም',

    // Admin Dashboard
    adminPortal: 'የፍሊት እና መቆጣጠሪያ ማዕከል',
    totalTrips: 'የዛሬ ጠቅላላ ጉዞዎች',
    activeFleet: 'በሥራ ላይ ያሉ አሽከርካሪዎች',
    totalRevenue: 'ጠቅላላ ገቢ (ብር)',
    systemStatus: 'የሲስተም ዝግጁነት',

    // Navigation
    navHome: 'መነሻ',
    navServices: 'አገልግሎቶች',
    navActivity: 'ታሪክ',
    navAccount: 'መገለጫ',

    // Modal & Payments
    selectDestination: 'መነሻ እና መድረሻ ይምረጡ',
    estimatedFare: 'የተገመተ ዋጋ',
    confirmBooking: 'ጉዞውን አረጋግጥ',
    findingDriver: 'በቅርብ ያለ አሽከርካሪ በመፈለግ ላይ...',
    tripConfirmed: 'ጉዞዎ ተረጋግጧል!',
    paymentMethod: 'የክፍያ መንገድ',
  }
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguage] = useState<Language>('EN');

  const toggleLanguage = () => {
    setLanguage(prev => (prev === 'EN' ? 'AM' : 'EN'));
  };

  const t = (key: string): string => {
    return translations[language][key] || translations['EN'][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};
