import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Calendar, Users, Home, Search, AlertCircle } from 'lucide-react';

export const BookingBar: React.FC = () => {
  const { t, rooms, openBookingModal, isRoomAvailable } = useHotel();

  // Helper dates (tomorrow and 2 days after)
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const defaultCheckIn = tomorrow.toISOString().split('T')[0];

  const dayAfter = new Date();
  dayAfter.setDate(dayAfter.getDate() + 3);
  const defaultCheckOut = dayAfter.toISOString().split('T')[0];

  const [checkIn, setCheckIn] = useState(defaultCheckIn);
  const [checkOut, setCheckOut] = useState(defaultCheckOut);
  const [adults, setAdults] = useState(2);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [availabilityMessage, setAvailabilityMessage] = useState<string | null>(null);

  const handleCheckAvailability = (e: React.FormEvent) => {
    e.preventDefault();

    if (!checkIn || !checkOut) {
      setAvailabilityMessage(t.booking.errorDates);
      return;
    }

    if (new Date(checkOut) <= new Date(checkIn)) {
      setAvailabilityMessage(t.booking.errorDates);
      return;
    }

    // Find available room
    let targetRoom = null;
    if (selectedCategory !== 'all') {
      targetRoom = rooms.find(r => r.category === selectedCategory);
    } else {
      targetRoom = rooms.find(r => r.isAvailable);
    }

    if (targetRoom) {
      const available = isRoomAvailable(targetRoom.id, checkIn, checkOut);
      if (!available) {
        setAvailabilityMessage(t.rooms.soldOut);
        return;
      }
    }

    setAvailabilityMessage(null);
    openBookingModal(targetRoom || undefined, checkIn, checkOut, adults);
  };

  return (
    <div className="w-full max-w-5xl mx-auto bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-stone-200/80 p-4 sm:p-5 lg:p-6 text-stone-800">
      <form onSubmit={handleCheckAvailability} className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Check-In Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F2D24]" />
              <span>{t.hero.checkIn}</span>
            </label>
            <input
              type="date"
              value={checkIn}
              min={new Date().toISOString().split('T')[0]}
              onChange={e => {
                setCheckIn(e.target.value);
                setAvailabilityMessage(null);
              }}
              required
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24] transition-all font-sans"
            />
          </div>

          {/* Check-Out Date */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#0F2D24]" />
              <span>{t.hero.checkOut}</span>
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || new Date().toISOString().split('T')[0]}
              onChange={e => {
                setCheckOut(e.target.value);
                setAvailabilityMessage(null);
              }}
              required
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24] transition-all font-sans"
            />
          </div>

          {/* Guests */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-[#0F2D24]" />
              <span>{t.hero.guests}</span>
            </label>
            <select
              value={adults}
              onChange={e => setAdults(Number(e.target.value))}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24] transition-all"
            >
              <option value={1}>1 {t.hero.adults}</option>
              <option value={2}>2 {t.hero.adults}</option>
              <option value={3}>3 {t.hero.adults}</option>
              <option value={4}>4 {t.hero.adults}</option>
              <option value={5}>5+ {t.hero.adults} / Group</option>
            </select>
          </div>

          {/* Room Category */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-stone-500 uppercase tracking-wider flex items-center gap-1.5">
              <Home className="w-3.5 h-3.5 text-[#0F2D24]" />
              <span>{t.hero.roomType}</span>
            </label>
            <select
              value={selectedCategory}
              onChange={e => {
                setSelectedCategory(e.target.value);
                setAvailabilityMessage(null);
              }}
              className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24] transition-all"
            >
              <option value="all">{t.hero.allRooms}</option>
              <option value="standard">Standard Room (2,800 ETB)</option>
              <option value="deluxe">Deluxe Room (4,200 ETB)</option>
              <option value="executive">Executive Room (6,000 ETB)</option>
              <option value="family">Family Room (7,500 ETB)</option>
              <option value="suite">Luxury Suite (10,500 ETB)</option>
            </select>
          </div>
        </div>

        {/* Error / Alert Message if any */}
        {availabilityMessage && (
          <div className="flex items-center gap-2 p-2.5 bg-amber-50 border border-amber-200 rounded text-xs text-amber-800 animate-fadeIn">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>{availabilityMessage}</span>
          </div>
        )}

        {/* Submit button bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-stone-100">
          <div className="text-xs text-stone-500 flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>Assosa Best Rate Guarantee · Free Cancellation 24h Before Arrival</span>
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-7 py-3 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow hover:shadow-md transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
          >
            <Search className="w-4 h-4" />
            <span>{t.hero.checkAvailability}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
