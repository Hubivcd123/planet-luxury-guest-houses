import React from 'react';
import { useHotel } from '../context/HotelContext';
import { BookingBar } from './BookingBar';
import { Sparkles, ArrowRight, ShieldCheck, Award } from 'lucide-react';

export const Hero: React.FC = () => {
  const { t, openBookingModal, hotelInfo, gallery } = useHotel();

  // Dynamic website hero image: pulls from hotelInfo or active exterior gallery photo
  const heroBgImage = hotelInfo.heroImageUrl
    || gallery.find(g => g.featured && (g.category === 'exterior' || g.category === 'outdoor'))?.imageUrl
    || gallery.find(g => g.category === 'exterior')?.imageUrl
    || gallery[0]?.imageUrl
    || '/src/assets/images/hero_planet_luxury_1790712166933.jpg';

  const handleExploreRooms = () => {
    const el = document.querySelector('#rooms');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-between pt-24 pb-12 sm:pb-16 overflow-hidden">
      {/* Background Photography with Measured Luxury Scrim */}
      <div className="absolute inset-0 z-0">
        <img
          key={heroBgImage}
          src={heroBgImage}
          alt="Planet Luxury Guest Houses Assosa Ethiopia"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center scale-[1.02] transform transition-transform duration-1000"
        />
        {/* Rich cinematic multi-layer gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B1E18] via-[#0D241D]/75 to-[#081813]/60 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/25" />
      </div>

      {/* Main Content Area */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col justify-center items-center text-center pt-8 sm:pt-14 pb-8">
        {/* Subtle Regional Trust Tag */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-amber-300 text-xs font-medium tracking-widest uppercase mb-5 animate-fadeIn">
          <Award className="w-3.5 h-3.5 text-amber-300" />
          <span>{t.hero.tagline}</span>
        </div>

        {/* Cinematic Headline */}
        <h1 className="font-serif-luxury text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white tracking-tight max-w-4xl leading-[1.1] mb-5 drop-shadow-md text-balance">
          {t.hero.title}
        </h1>

        {/* Subtitle */}
        <p className="text-base sm:text-lg md:text-xl text-stone-200/90 max-w-2xl font-light leading-relaxed mb-8 sm:mb-10 text-balance font-sans">
          {t.hero.subtitle}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-10">
          <button
            type="button"
            onClick={() => openBookingModal()}
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#C29D62] via-[#D4AF37] to-[#B38F5F] hover:from-[#B59157] hover:to-[#A38050] text-[#0A2019] text-sm font-semibold tracking-wider uppercase rounded-md shadow-xl hover:shadow-2xl transition-all flex items-center justify-center gap-2 group active:scale-[0.98]"
          >
            <span>{t.hero.bookStay}</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            type="button"
            onClick={handleExploreRooms}
            className="w-full sm:w-auto px-7 py-3.5 bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/30 text-white text-sm font-medium tracking-wide uppercase rounded-md transition-all flex items-center justify-center gap-2 hover:border-white/60 active:scale-[0.98]"
          >
            <span>{t.hero.exploreRooms}</span>
          </button>
        </div>

        {/* Key trust bullets */}
        <div className="hidden md:flex items-center gap-6 text-xs text-stone-300/80 mb-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-amber-300" />
            <span>24/7 Security & Standby Generator</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>High-Speed Fiber Wi-Fi in Every Room</span>
          </div>
          <span>·</span>
          <div className="flex items-center gap-2">
            <span className="text-amber-300 font-serif">☕</span>
            <span>Complimentary Assosa Coffee Ceremony</span>
          </div>
        </div>
      </div>

      {/* Prominent Booking & Search Bar pinned at base */}
      <div className="relative z-20 px-4 sm:px-6 lg:px-8 w-full -mb-4 sm:-mb-6">
        <BookingBar />
      </div>
    </section>
  );
};
