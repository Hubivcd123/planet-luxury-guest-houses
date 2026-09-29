import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Check, ShieldCheck, MapPin, Sparkles } from 'lucide-react';

export const AboutSection: React.FC = () => {
  const { t, openBookingModal } = useHotel();

  return (
    <section id="about" className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Visual Showcase Stack */}
          <div className="relative">
            <div className="relative z-10 rounded-2xl overflow-hidden shadow-2xl border-4 border-white bg-stone-900">
              <img
                src="/src/assets/images/facilities_lounge_1790712213187.jpg"
                alt="Planet Luxury Lounge & Hospitality"
                referrerPolicy="no-referrer"
                className="w-full h-[400px] sm:h-[480px] object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
            </div>

            {/* Overlapping Badge Card */}
            <div className="absolute -bottom-6 -right-4 sm:-bottom-8 sm:-right-6 z-20 bg-[#0F2D24] text-white p-5 sm:p-6 rounded-2xl shadow-xl border border-emerald-700/50 max-w-[240px]">
              <span className="font-serif-luxury text-3xl font-bold text-amber-300 block">
                98%
              </span>
              <span className="text-xs font-medium text-emerald-100 uppercase tracking-wider block mt-1">
                {t.about.guestSatisfied}
              </span>
              <p className="text-[10px] text-emerald-300/80 mt-1 font-sans">
                Corporate delegates, researchers & leisure travelers in Assosa.
              </p>
            </div>
          </div>

          {/* Text Content */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
                Our Story & Vision
              </span>
              <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight leading-tight text-balance">
                {t.about.sectionTitle}
              </h2>
              <span className="text-base font-serif-luxury text-[#0F2D24] italic block mt-1">
                {t.about.tagline}
              </span>
            </div>

            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {t.about.p1}
            </p>

            <p className="text-sm text-stone-600 leading-relaxed font-sans">
              {t.about.p2}
            </p>

            {/* Focus points */}
            <div className="space-y-3 pt-2">
              {[
                t.about.bullet1,
                t.about.bullet2,
                t.about.bullet3,
                t.about.bullet4,
              ].map((bullet, idx) => (
                <div key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-stone-700">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-800" />
                  </div>
                  <span>{bullet}</span>
                </div>
              ))}
            </div>

            <div className="pt-4 flex items-center gap-4">
              <button
                type="button"
                onClick={() => openBookingModal()}
                className="px-7 py-3 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all active:scale-[0.98]"
              >
                Plan Your Stay
              </button>

              <a
                href="#contact"
                className="px-6 py-3 text-xs font-semibold uppercase tracking-wider text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
              >
                Find Us on Map
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
