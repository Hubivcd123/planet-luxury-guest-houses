import React from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Wifi,
  Zap,
  ShieldCheck,
  Utensils,
  Car,
  PlaneTakeoff,
  Users,
  Sparkles,
  PhoneCall,
  Clock,
} from 'lucide-react';

const iconMap: Record<string, React.ElementType> = {
  Wifi,
  Zap,
  ShieldCheck,
  Utensils,
  Car,
  PlaneTakeoff,
  Users,
  Sparkles,
  PhoneCall,
  Clock,
};

export const FacilitiesSection: React.FC = () => {
  const { facilities, t, getLoc } = useHotel();

  return (
    <section id="facilities" className="py-20 sm:py-28 bg-[#F4F2EB] border-t border-stone-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Property Amenities
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.facilities.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.facilities.sectionSubtitle}
          </p>
        </div>

        {/* Facilities Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {facilities.map(facility => {
            const IconComponent = iconMap[facility.iconName] || Sparkles;
            return (
              <div
                key={facility.id}
                className="bg-white p-6 rounded-2xl border border-stone-200/90 shadow-sm hover:shadow-md transition-all group flex flex-col justify-start"
              >
                <div className="w-12 h-12 rounded-xl bg-[#0F2D24]/5 group-hover:bg-[#0F2D24] text-[#0F2D24] group-hover:text-amber-300 transition-colors flex items-center justify-center mb-4">
                  <IconComponent className="w-6 h-6" />
                </div>
                <h3 className="font-serif-luxury text-lg font-bold text-stone-900 mb-2 group-hover:text-[#0F2D24] transition-colors">
                  {getLoc(facility.name)}
                </h3>
                <p className="text-xs text-stone-600 leading-relaxed font-sans">
                  {getLoc(facility.description)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
