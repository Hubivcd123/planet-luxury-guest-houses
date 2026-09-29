import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Tag, Calendar, ArrowRight, Sparkles } from 'lucide-react';

export const SpecialOffersSection: React.FC = () => {
  const { offers, t, getLoc, openBookingModal } = useHotel();

  const activeOffers = offers.filter(o => o.active);

  return (
    <section id="offers" className="py-20 sm:py-28 bg-[#F4F2EB] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Limited Time Privileges
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.offers.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.offers.sectionSubtitle}
          </p>
        </div>

        {/* Offers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {activeOffers.map(offer => (
            <div
              key={offer.id}
              className="bg-white rounded-2xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 w-full overflow-hidden bg-stone-900">
                  <img
                    src={offer.imageUrl}
                    alt={getLoc(offer.title)}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                  {/* Discount Badge */}
                  <div className="absolute top-3 left-3 bg-[#0F2D24] text-amber-300 px-3 py-1 rounded-md text-xs font-bold shadow-md flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{offer.discountPercentage}% {t.offers.discount}</span>
                  </div>

                  {/* Promo Code Chip */}
                  <div className="absolute bottom-3 left-3 bg-white/90 backdrop-blur-md px-2.5 py-1 rounded text-[11px] font-mono font-bold text-stone-800 shadow">
                    {offer.code}
                  </div>
                </div>

                <div className="p-6">
                  <span className="text-xs font-medium text-emerald-800 uppercase tracking-wider block mb-1">
                    {getLoc(offer.subtitle)}
                  </span>
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2 group-hover:text-[#0F2D24] transition-colors">
                    {getLoc(offer.title)}
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed font-sans mb-4">
                    {getLoc(offer.description)}
                  </p>

                  <div className="flex items-center gap-1.5 text-xs text-stone-400 font-sans">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{t.offers.validThru} {offer.validUntil}</span>
                  </div>
                </div>
              </div>

              <div className="px-6 pb-6 pt-2">
                <button
                  type="button"
                  onClick={() => openBookingModal()}
                  className="w-full py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
                >
                  <span>{t.offers.bookThisOffer}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <span className="text-[10px] text-stone-400 text-center block mt-2 font-sans">
                  {getLoc(offer.terms)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
