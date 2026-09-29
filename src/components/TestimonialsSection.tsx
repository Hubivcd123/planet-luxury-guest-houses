import React from 'react';
import { useHotel } from '../context/HotelContext';
import { Star, Quote } from 'lucide-react';

export const TestimonialsSection: React.FC = () => {
  const { testimonials, t, getLoc } = useHotel();

  const published = testimonials.filter(t => t.isPublished);

  return (
    <section id="testimonials" className="py-20 sm:py-28 bg-[#F4F2EB] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Client Words
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.testimonials.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.testimonials.sectionSubtitle}
          </p>
        </div>

        {/* Testimonials Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {published.map(item => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-7 border border-stone-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div>
                {/* 5-Star Rating */}
                <div className="flex items-center gap-1 mb-4 text-amber-500">
                  {Array.from({ length: item.rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <Quote className="w-8 h-8 text-[#0F2D24]/15 mb-3" />

                <p className="font-serif-luxury text-base text-stone-700 leading-relaxed italic mb-6">
                  "{getLoc(item.quote)}"
                </p>
              </div>

              <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <h4 className="font-serif-luxury font-bold text-stone-900 text-base">
                    {item.author}
                  </h4>
                  <span className="text-xs text-stone-500 block font-sans">
                    {getLoc(item.role)}
                  </span>
                  <span className="text-[11px] text-stone-400 block font-sans">
                    {getLoc(item.location)}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-full bg-emerald-100 text-emerald-900 font-serif-luxury font-bold text-sm flex items-center justify-center">
                  {item.author.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
