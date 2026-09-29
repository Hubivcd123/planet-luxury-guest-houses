import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Sparkles, Utensils, Coffee, CheckCircle } from 'lucide-react';

export const DiningSection: React.FC = () => {
  const { diningItems, t, getLoc, openBookingModal } = useHotel();
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.dining.allMenu },
    { id: 'ethiopian', label: t.dining.ethiopian },
    { id: 'international', label: t.dining.international },
    { id: 'breakfast', label: t.dining.breakfast },
    { id: 'beverages', label: t.dining.beverages },
  ];

  const filteredItems = activeCategory === 'all'
    ? diningItems
    : diningItems.filter(item => item.category === activeCategory);

  return (
    <section id="dining" className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Gastronomy & Lounge
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.dining.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.dining.sectionSubtitle}
          </p>
        </div>

        {/* Feature Spotlight: Traditional Ethiopian Coffee Ceremony Banner */}
        <div className="mb-16 bg-[#0F2D24] rounded-2xl overflow-hidden shadow-xl border border-emerald-800/40 text-white">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            <div className="relative min-h-[300px] lg:min-h-full overflow-hidden bg-stone-900">
              <img
                src="/src/assets/images/dining_restaurant_1790712202379.jpg"
                alt="Ethiopian Coffee Ceremony & Dining"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0F2D24] via-transparent to-transparent lg:hidden" />
            </div>

            <div className="p-8 sm:p-12 flex flex-col justify-center">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-amber-300 text-xs font-semibold uppercase tracking-wider mb-4 w-fit">
                <Coffee className="w-3.5 h-3.5 text-amber-300" />
                <span>Daily Cultural Tradition</span>
              </div>

              <h3 className="font-serif-luxury text-2xl sm:text-3xl font-bold mb-3 text-white">
                {t.dining.coffeeCeremonyTitle}
              </h3>

              <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans mb-6">
                {t.dining.coffeeCeremonyDesc}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pb-6 border-b border-emerald-800/80 mb-6 text-xs text-stone-200">
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-amber-300 font-bold text-base">Abol (አቦል)</span>
                  <span className="text-[11px] text-stone-300">First bold round</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-amber-300 font-bold text-base">Tona (ቶና)</span>
                  <span className="text-[11px] text-stone-300">Second smooth round</span>
                </div>
                <div className="flex flex-col">
                  <span className="font-serif-luxury text-amber-300 font-bold text-base">Baraka (በረካ)</span>
                  <span className="text-[11px] text-stone-300">The blessed closing cup</span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs text-amber-300 font-sans">
                  Complimentary for all resident guests at 4:30 PM
                </span>
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="px-4 py-2 bg-gradient-to-r from-[#C29D62] to-[#D4AF37] text-stone-900 text-xs font-semibold uppercase tracking-wider rounded shadow transition-all active:scale-[0.98]"
                >
                  Join Us
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Menu Highlights Filter Controls */}
        <div className="flex flex-wrap items-center justify-center gap-2 mb-10">
          {categories.map(cat => (
            <button
              key={cat.id}
              type="button"
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#0F2D24] text-amber-300 shadow font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Items Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-xl p-5 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h4 className="font-serif-luxury text-lg font-bold text-stone-900">
                    {getLoc(item.name)}
                  </h4>
                  <div className="text-end shrink-0">
                    <span className="font-serif-luxury font-bold text-base text-[#0F2D24]">
                      {item.priceETB.toLocaleString()}
                    </span>
                    <span className="text-[11px] font-sans text-stone-500 ml-1">
                      ETB
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 font-sans leading-relaxed mb-4">
                  {getLoc(item.description)}
                </p>
              </div>

              {item.dietary && (
                <div className="flex flex-wrap gap-1.5 pt-3 border-t border-stone-100">
                  {item.dietary.map(diet => (
                    <span
                      key={diet}
                      className="text-[10px] text-stone-500 font-sans"
                    >
                      {diet} ·
                    </span>
                  ))}
                  <span className="text-[10px] text-emerald-700 font-medium">Fresh Daily</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
