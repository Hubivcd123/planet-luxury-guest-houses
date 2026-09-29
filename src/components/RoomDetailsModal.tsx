import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  X,
  Users,
  Maximize2,
  Bed,
  Check,
  Calendar,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
} from 'lucide-react';

export const RoomDetailsModal: React.FC = () => {
  const { detailsModalRoom, closeRoomDetails, getLoc, t, openBookingModal } = useHotel();
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [detailsModalRoom]);

  if (!detailsModalRoom) return null;

  const room = detailsModalRoom;
  const roomImages = room.images && room.images.length > 0
    ? room.images
    : [
        {
          id: 'default',
          url: room.imageUrl,
          title: room.name,
          caption: { en: 'Room View', am: 'የክፍል እይታ', ar: 'إطلالة الغرفة' },
          isMain: true,
          order: 0,
          uploadDate: '2026-09-29',
        },
      ];

  const currentImage = roomImages[activeImageIndex] || roomImages[0];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev - 1 + roomImages.length) % roomImages.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setActiveImageIndex(prev => (prev + 1) % roomImages.length);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200">
        {/* Main Photo Display Frame */}
        <div className="relative h-64 sm:h-80 w-full overflow-hidden bg-stone-950 group">
          <img
            src={currentImage.url}
            alt={getLoc(currentImage.title) || getLoc(room.name)}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover object-center transition-all duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={closeRoomDetails}
            className="absolute top-4 right-4 p-2 rounded-full bg-black/60 hover:bg-black/85 text-white transition-colors focus:outline-none z-10"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Carousel Arrows (if multiple pictures exist) */}
          {roomImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={handlePrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10 opacity-80 hover:opacity-100"
                aria-label="Previous picture"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                type="button"
                onClick={handleNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/50 hover:bg-black/80 text-white transition-colors z-10 opacity-80 hover:opacity-100"
                aria-label="Next picture"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Picture Index & Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[11px] uppercase tracking-widest text-amber-300 font-semibold font-sans">
                Assosa Luxury Accommodations
              </span>
              {roomImages.length > 1 && (
                <span className="text-[11px] bg-black/60 px-2 py-0.5 rounded text-stone-300 font-mono">
                  {activeImageIndex + 1} / {roomImages.length} Photos
                </span>
              )}
            </div>

            <h2 className="font-serif-luxury text-2xl sm:text-3xl font-bold mt-1">
              {getLoc(room.name)}
            </h2>

            <div className="flex items-center gap-3 text-xs text-stone-300 mt-1 font-sans">
              <span>{room.roomSizeM2} {t.rooms.sqm}</span>
              <span>·</span>
              <span>{getLoc(room.bedType)}</span>
              <span>·</span>
              <span>Max {room.capacityAdults} {t.hero.adults}</span>
              {currentImage.caption && (
                <>
                  <span>·</span>
                  <span className="italic text-amber-200/90">{getLoc(currentImage.caption)}</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Thumbnail Selector Strip (if room has multiple pictures) */}
        {roomImages.length > 1 && (
          <div className="bg-[#0F2D24] px-4 py-2 flex items-center gap-2 overflow-x-auto border-b border-[#1E4B3D]">
            <span className="text-[10px] text-amber-300 font-bold uppercase tracking-wider shrink-0 flex items-center gap-1">
              <ImageIcon className="w-3 h-3" />
              <span>Room Photos:</span>
            </span>
            <div className="flex items-center gap-2">
              {roomImages.map((img, idx) => (
                <button
                  key={img.id || idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative h-12 w-16 rounded-md overflow-hidden shrink-0 border-2 transition-all ${
                    activeImageIndex === idx
                      ? 'border-amber-400 scale-105 shadow'
                      : 'border-white/20 opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img.url} alt="" className="w-full h-full object-cover" />
                  {img.isMain && (
                    <span className="absolute bottom-0 inset-x-0 bg-amber-500 text-[8px] font-bold text-stone-950 text-center uppercase py-0.2">
                      Main
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6 text-stone-800">
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-2">
              Overview
            </h3>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed font-sans">
              {getLoc(room.description)}
            </p>
          </div>

          {/* Room Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/60 text-xs font-sans">
            <div className="flex flex-col gap-1">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Users className="w-3.5 h-3.5 text-[#0F2D24]" />
                {t.rooms.capacity}
              </span>
              <span className="font-semibold text-stone-800">
                {room.capacityAdults} Adults + {room.capacityChildren} Child
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Maximize2 className="w-3.5 h-3.5 text-[#0F2D24]" />
                {t.rooms.size}
              </span>
              <span className="font-semibold text-stone-800">
                {room.roomSizeM2} m²
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Bed className="w-3.5 h-3.5 text-[#0F2D24]" />
                {t.rooms.bed}
              </span>
              <span className="font-semibold text-stone-800">
                {getLoc(room.bedType)}
              </span>
            </div>

            <div className="flex flex-col gap-1">
              <span className="text-stone-400 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#0F2D24]" />
                Availability
              </span>
              <span className="font-semibold text-emerald-700">
                {room.availableRoomsCount} Rooms
              </span>
            </div>
          </div>

          {/* Amenities List */}
          <div>
            <h3 className="text-xs uppercase tracking-wider font-semibold text-stone-400 mb-3">
              {t.rooms.amenities}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {room.amenities.map(amenity => (
                <div key={amenity} className="flex items-center gap-2 text-xs text-stone-700 font-sans">
                  <div className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                    <Check className="w-2.5 h-2.5 text-emerald-800" />
                  </div>
                  <span>{amenity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer actions */}
        <div className="p-4 sm:p-5 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-4 font-sans">
          <div className="flex flex-col">
            <span className="text-xs text-stone-500 uppercase tracking-wide">
              Rate per Night
            </span>
            <div className="flex items-baseline gap-1">
              <span className="font-serif-luxury text-2xl font-bold text-[#0F2D24]">
                {room.pricePerNightETB.toLocaleString()}
              </span>
              <span className="text-xs font-semibold text-stone-600">
                ETB
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={closeRoomDetails}
              className="px-4 py-2.5 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={() => {
                closeRoomDetails();
                openBookingModal(room);
              }}
              className="px-6 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 active:scale-[0.98]"
            >
              <span>{t.rooms.bookNow}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
