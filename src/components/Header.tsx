import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { Language } from '../types';
import {
  Bell,
  Globe,
  Menu as MenuIcon,
  X,
  Shield,
  Phone,
  ChevronDown,
} from 'lucide-react';

export const Header: React.FC = () => {
  const {
    language,
    setLanguage,
    t,
    unreadNotificationCount,
    setNotificationsDrawerOpen,
    openBookingModal,
    isAdminLoggedIn,
    setAdminModalOpen,
  } = useHotel();

  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langMenuOpen, setLangMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const languages: { code: Language; name: string; nativeName: string; flag: string }[] = [
    { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' },
    { code: 'am', name: 'Amharic', nativeName: 'አማርኛ', flag: '🇪🇹' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦' },
  ];

  const currentLang = languages.find(l => l.code === language) || languages[0];

  const navLinks = [
    { href: '#home', label: t.nav.home },
    { href: '#rooms', label: t.nav.rooms },
    { href: '#experiences', label: t.nav.experiences },
    { href: '#dining', label: t.nav.dining },
    { href: '#facilities', label: t.nav.facilities },
    { href: '#gallery', label: t.nav.gallery },
    { href: '#offers', label: t.nav.offers },
    { href: '#contact', label: t.nav.contact },
  ];

  const handleNavClick = (href: string) => {
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0F2D24]/95 backdrop-blur-md shadow-lg border-b border-[#234A3E] text-white py-3'
          : 'bg-gradient-to-b from-[#0B1F19]/90 via-[#0F2D24]/60 to-transparent text-white py-4.5'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between gap-4">
          {/* Brand Logo & Wordmark */}
          <a
            href="#home"
            className="flex items-center gap-2.5 group focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-400 rounded-sm"
          >
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full border border-amber-300/40 bg-gradient-to-br from-[#1C4E3F] to-[#0A2019] flex items-center justify-center shadow-inner group-hover:border-amber-300 transition-colors">
              <span className="font-serif-luxury font-bold text-amber-300 text-lg sm:text-xl tracking-wider">
                P
              </span>
            </div>
            <div className="flex flex-col">
              <span className="font-serif-luxury font-semibold text-base sm:text-lg tracking-wider uppercase text-white group-hover:text-amber-200 transition-colors">
                Planet Luxury
              </span>
              <span className="text-[10px] tracking-widest uppercase text-amber-200/80 font-sans -mt-0.5">
                Guest Houses · Assosa
              </span>
            </div>
          </a>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-5 xl:gap-7 text-xs font-medium tracking-wide uppercase">
            {navLinks.map(link => (
              <a
                key={link.href}
                href={link.href}
                onClick={e => {
                  e.preventDefault();
                  handleNavClick(link.href);
                }}
                className="text-emerald-100/90 hover:text-amber-300 transition-colors py-1 relative after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-amber-300 hover:after:w-full after:transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Right Controls: Language, Notification, Book Now & Admin */}
          <div className="flex items-center gap-2.5 sm:gap-3.5">
            {/* Language Switcher Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setLangMenuOpen(!langMenuOpen)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-emerald-700/50 bg-[#143B30]/60 hover:bg-[#1A4B3D] text-xs font-medium text-emerald-100 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
                aria-expanded={langMenuOpen}
                aria-label="Select Language"
              >
                <Globe className="w-3.5 h-3.5 text-amber-300" />
                <span className="hidden sm:inline">{currentLang.flag}</span>
                <span className="text-xs font-medium">{currentLang.nativeName}</span>
                <ChevronDown className={`w-3 h-3 text-emerald-300 transition-transform ${langMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {langMenuOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setLangMenuOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-44 rounded-lg bg-[#0E2820] border border-[#235345] shadow-2xl py-1.5 z-50 text-xs">
                    {languages.map(lang => (
                      <button
                        key={lang.code}
                        type="button"
                        onClick={() => {
                          setLanguage(lang.code);
                          setLangMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2 text-start transition-colors ${
                          language === lang.code
                            ? 'bg-[#1C4E3F] text-amber-300 font-semibold'
                            : 'text-emerald-100/90 hover:bg-[#153D31] hover:text-white'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span>{lang.flag}</span>
                          <span>{lang.nativeName}</span>
                        </span>
                        <span className="text-[10px] text-emerald-400/80 uppercase">
                          {lang.name}
                        </span>
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell */}
            <button
              type="button"
              onClick={() => setNotificationsDrawerOpen(true)}
              className="relative p-2 rounded-full border border-emerald-700/40 bg-[#143B30]/60 hover:bg-[#1A4B3D] text-emerald-100 hover:text-white transition-all focus:outline-none focus-visible:ring-1 focus-visible:ring-amber-300"
              aria-label="View notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-500 text-[10px] font-bold text-slate-900 shadow-sm animate-pulse">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            {/* Admin Portal Toggle (Discreet Icon) */}
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className={`p-2 rounded-full border transition-all text-xs focus:outline-none ${
                isAdminLoggedIn
                  ? 'border-amber-400 bg-amber-500/20 text-amber-300 hover:bg-amber-500/30'
                  : 'border-emerald-800/40 bg-[#143B30]/40 text-emerald-300/80 hover:text-white hover:bg-[#1A4B3D]'
              }`}
              title={isAdminLoggedIn ? 'Admin Portal Active' : 'Admin Portal Login'}
            >
              <Shield className="w-4 h-4" />
            </button>

            {/* BOOK NOW Primary CTA */}
            <button
              type="button"
              onClick={() => openBookingModal()}
              className="hidden sm:inline-flex items-center justify-center px-4 py-2 bg-gradient-to-r from-[#C29D62] to-[#D4AF37] hover:from-[#B59157] hover:to-[#C6A230] text-[#0C241D] text-xs font-semibold tracking-wider uppercase rounded shadow-sm hover:shadow transition-all whitespace-nowrap active:scale-[0.98]"
            >
              {t.nav.bookNow}
            </button>

            {/* Mobile Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded border border-emerald-700/50 bg-[#143B30]/70 text-emerald-100 hover:text-white focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[60px] bg-[#0E2820] border-b border-[#235345] shadow-2xl p-5 z-50 max-h-[85vh] overflow-y-auto">
          <div className="flex flex-col gap-3">
            <div className="pb-3 border-b border-[#235345]/60 flex items-center justify-between">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                Menu
              </span>
              <div className="flex items-center gap-2">
                {languages.map(lang => (
                  <button
                    key={lang.code}
                    type="button"
                    onClick={() => setLanguage(lang.code)}
                    className={`px-2 py-1 rounded text-xs transition-colors ${
                      language === lang.code
                        ? 'bg-amber-400 text-slate-900 font-bold'
                        : 'bg-[#153D31] text-emerald-200'
                    }`}
                  >
                    {lang.flag} {lang.nativeName}
                  </button>
                ))}
              </div>
            </div>

            <nav className="flex flex-col gap-1 py-2">
              {navLinks.map(link => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={e => {
                    e.preventDefault();
                    handleNavClick(link.href);
                  }}
                  className="px-3 py-2.5 text-sm font-medium text-emerald-100 hover:text-amber-300 hover:bg-[#163E32] rounded transition-colors"
                >
                  {link.label}
                </a>
              ))}
            </nav>

            <div className="pt-3 border-t border-[#235345]/60 flex flex-col gap-2.5">
              <button
                type="button"
                onClick={() => {
                  setMobileMenuOpen(false);
                  openBookingModal();
                }}
                className="w-full py-3 bg-gradient-to-r from-[#C29D62] to-[#D4AF37] text-[#0C241D] text-sm font-semibold tracking-wider uppercase rounded shadow text-center"
              >
                {t.nav.bookNow}
              </button>

              <div className="flex items-center justify-between text-xs text-emerald-300/80 pt-1">
                <a
                  href="tel:+251911000000"
                  className="flex items-center gap-1.5 hover:text-white"
                >
                  <Phone className="w-3.5 h-3.5 text-amber-300" />
                  <span>+251 91 100 0000</span>
                </a>
                <button
                  type="button"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    setAdminModalOpen(true);
                  }}
                  className="text-amber-300/80 hover:text-amber-200 underline text-xs"
                >
                  {t.admin.badge}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
