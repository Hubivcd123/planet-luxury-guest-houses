import React from 'react';
import { HotelProvider } from './context/HotelContext';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { RoomsSection } from './components/RoomsSection';
import { ExperiencesSection } from './components/ExperiencesSection';
import { DiningSection } from './components/DiningSection';
import { FacilitiesSection } from './components/FacilitiesSection';
import { AboutSection } from './components/AboutSection';
import { SpecialOffersSection } from './components/SpecialOffersSection';
import { GallerySection } from './components/GallerySection';
import { TestimonialsSection } from './components/TestimonialsSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { BookingModal } from './components/BookingModal';
import { RoomDetailsModal } from './components/RoomDetailsModal';
import { NotificationsDrawer } from './components/NotificationsDrawer';
import { EmailPreviewModal } from './components/EmailPreviewModal';
import { TermsPrivacyModal } from './components/TermsPrivacyModal';
import { AdminDashboard } from './components/AdminDashboard';

export default function App() {
  return (
    <HotelProvider>
      <div className="min-h-screen bg-[#FBFBFA] text-[#1E2922] flex flex-col selection:bg-[#163E32] selection:text-white">
        {/* Sticky Luxury Header */}
        <Header />

        {/* Main Content Sections */}
        <main className="flex-1">
          <Hero />
          <RoomsSection />
          <ExperiencesSection />
          <DiningSection />
          <FacilitiesSection />
          <AboutSection />
          <SpecialOffersSection />
          <GallerySection />
          <TestimonialsSection />
          <ContactSection />
        </main>

        {/* Professional Footer */}
        <Footer />

        {/* Interactive Modals & Slide-overs */}
        <BookingModal />
        <RoomDetailsModal />
        <NotificationsDrawer />
        <EmailPreviewModal />
        <TermsPrivacyModal />
        <AdminDashboard />
      </div>
    </HotelProvider>
  );
}
