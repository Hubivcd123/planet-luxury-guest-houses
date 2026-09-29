import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room } from '../types';
import { Users, Maximize2, Bed, Check, ArrowRight, Eye } from 'lucide-react';

export const RoomsSection: React.FC = () => {
  const { rooms, t, getLoc, openBookingModal, openRoomDetails } = useHotel();
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: t.rooms.allFilter },
    { id: 'standard', label: 'Standard Room' },
    { id: 'deluxe', label: 'Deluxe Room' },
    { id: 'executive', label: 'Executive Room' },
    { id: 'family', label: 'Family Room' },
    { id: 'suite', label: 'Luxury Suite' },
  ];

  const filteredRooms = filterCategory === 'all'
    ? rooms
    : rooms.filter(r => r.category === filterCategory);

  return (
    <section id="rooms" className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 font-sans">
            Accommodations in Assosa
          </div>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.rooms.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.rooms.sectionSubtitle}
          </p>

          {/* Interactive Filter Controls */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 mt-8 p-1.5 bg-stone-100 rounded-xl max-w-2xl mx-auto border border-stone-200">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setFilterCategory(cat.id)}
                className={`px-3.5 py-2 text-xs font-medium rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                  filterCategory === cat.id
                    ? 'bg-[#0F2D24] text-amber-300 shadow-sm font-semibold'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-200/60'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Room Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRooms.map(room => (
            <div
              key={room.id}
              className="group bg-white rounded-2xl overflow-hidden border border-stone-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Frame */}
              <div className="relative h-64 w-full overflow-hidden bg-stone-100">
                <img
                  src={room.imageUrl}
                  alt={getLoc(room.name)}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-75 transition-opacity" />

                {/* Price Tag Floating over Image */}
                <div className="absolute bottom-3 left-3 bg-[#0F2D24]/90 backdrop-blur-md px-3 py-1.5 rounded-lg border border-emerald-700/40 text-white shadow-lg">
                  <span className="text-[10px] text-stone-300 uppercase tracking-wider block">
                    Starting from
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif-luxury font-bold text-lg text-amber-300">
                      {room.pricePerNightETB.toLocaleString()}
                    </span>
                    <span className="text-xs text-stone-200 font-sans">
                      ETB / {t.hero.night}
                    </span>
                  </div>
                </div>

                {/* Status indicator */}
                <div className="absolute top-3 right-3">
                  <span className="px-2.5 py-1 text-[11px] font-medium tracking-wide rounded-md bg-white/90 backdrop-blur-md text-emerald-800 shadow-sm border border-stone-200">
                    {room.availableRoomsCount} Available
                  </span>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 group-hover:text-[#0F2D24] transition-colors mb-2">
                    {getLoc(room.name)}
                  </h3>

                  <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 leading-relaxed mb-4 font-sans">
                    {getLoc(room.description)}
                  </p>

                  {/* Clean unboxed metadata discipline */}
                  <div className="flex items-center gap-2 text-xs text-stone-500 mb-5 font-sans">
                    <span className="flex items-center gap-1">
                      <Users className="w-3.5 h-3.5 text-[#0F2D24]" />
                      <span>{room.capacityAdults} {t.hero.adults}</span>
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="flex items-center gap-1">
                      <Maximize2 className="w-3.5 h-3.5 text-[#0F2D24]" />
                      <span>{room.roomSizeM2} m²</span>
                    </span>
                    <span aria-hidden="true" className="text-stone-300">·</span>
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-[#0F2D24]" />
                      <span className="truncate max-w-[120px]">{getLoc(room.bedType)}</span>
                    </span>
                  </div>

                  {/* Featured Amenities preview */}
                  <div className="space-y-1.5 pb-4 border-b border-stone-100 mb-5">
                    {room.amenities.slice(0, 3).map(amenity => (
                      <div key={amenity} className="flex items-center gap-2 text-xs text-stone-600">
                        <Check className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
                        <span className="truncate">{amenity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Action Buttons */}
                <div className="grid grid-cols-2 gap-2.5 pt-1">
                  <button
                    type="button"
                    onClick={() => openRoomDetails(room)}
                    className="w-full px-3 py-2.5 text-xs font-semibold text-stone-700 hover:text-stone-900 bg-stone-100 hover:bg-stone-200/80 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>{t.rooms.viewDetails}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => openBookingModal(room)}
                    className="w-full px-3 py-2.5 text-xs font-semibold uppercase tracking-wider text-amber-300 bg-[#0F2D24] hover:bg-[#163E32] rounded-lg shadow-sm hover:shadow transition-all flex items-center justify-center gap-1.5 active:scale-[0.98]"
                  >
                    <span>{t.rooms.bookNow}</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
