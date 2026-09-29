import React, { useState, useEffect } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking } from '../types';
import {
  X,
  Calendar,
  Users,
  CheckCircle,
  AlertCircle,
  Phone,
  MessageSquare,
  Mail,
  ArrowRight,
  ArrowLeft,
  Printer,
  ShieldCheck,
} from 'lucide-react';

export const BookingModal: React.FC = () => {
  const {
    bookingModalOpen,
    closeBookingModal,
    selectedRoomForBooking,
    initialCheckIn,
    initialCheckOut,
    initialGuests,
    rooms,
    t,
    getLoc,
    createBooking,
    isRoomAvailable,
    openEmailPreview,
    hotelInfo,
    language,
  } = useHotel();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);

  // Form State
  const [selectedRoomId, setSelectedRoomId] = useState<string>('');
  const [checkIn, setCheckIn] = useState<string>('');
  const [checkOut, setCheckOut] = useState<string>('');
  const [adults, setAdults] = useState<number>(2);
  const [children, setChildren] = useState<number>(0);

  const [guestName, setGuestName] = useState<string>('');
  const [guestEmail, setGuestEmail] = useState<string>('');
  const [guestPhone, setGuestPhone] = useState<string>('');
  const [specialRequests, setSpecialRequests] = useState<string>('');

  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>(null);

  // Sync initial props when modal opens
  useEffect(() => {
    if (bookingModalOpen) {
      setStep(1);
      setErrorMsg(null);
      setConfirmedBooking(null);

      if (selectedRoomForBooking) {
        setSelectedRoomId(selectedRoomForBooking.id);
      } else if (rooms.length > 0) {
        setSelectedRoomId(rooms[0].id);
      }

      const tomorrow = new Date();
      tomorrow.setDate(tomorrow.getDate() + 1);
      const defaultIn = initialCheckIn || tomorrow.toISOString().split('T')[0];

      const dayAfter = new Date();
      dayAfter.setDate(dayAfter.getDate() + 3);
      const defaultOut = initialCheckOut || dayAfter.toISOString().split('T')[0];

      setCheckIn(defaultIn);
      setCheckOut(defaultOut);
      setAdults(initialGuests || 2);
    }
  }, [bookingModalOpen, selectedRoomForBooking, initialCheckIn, initialCheckOut, initialGuests, rooms]);

  if (!bookingModalOpen) return null;

  const currentRoom = rooms.find(r => r.id === selectedRoomId) || rooms[0];

  // Calculate nights
  const calcNights = (): number => {
    if (!checkIn || !checkOut) return 1;
    const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
    const nights = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return nights > 0 ? nights : 1;
  };

  const nights = calcNights();
  const subtotalETB = (currentRoom ? currentRoom.pricePerNightETB : 0) * nights;
  const totalAmountETB = subtotalETB;

  // Step 1 validation
  const handleProceedToGuestInfo = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!selectedRoomId) {
      setErrorMsg(t.booking.errorRoomRequired);
      return;
    }

    if (!checkIn || !checkOut || new Date(checkOut) <= new Date(checkIn)) {
      setErrorMsg(t.booking.errorDates);
      return;
    }

    // Check availability
    const available = isRoomAvailable(selectedRoomId, checkIn, checkOut);
    if (!available) {
      setErrorMsg(t.booking.alreadyBooked);
      return;
    }

    setStep(2);
  };

  // Step 2 validation
  const handleProceedToReview = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!guestName.trim()) {
      setErrorMsg(t.booking.errorName);
      return;
    }
    if (!guestEmail.trim() || !guestEmail.includes('@')) {
      setErrorMsg(t.booking.errorEmail);
      return;
    }
    if (!guestPhone.trim()) {
      setErrorMsg(t.booking.errorPhone);
      return;
    }

    setStep(3);
  };

  // Step 3 Confirmation
  const handleFinalConfirm = () => {
    setErrorMsg(null);

    if (!isRoomAvailable(selectedRoomId, checkIn, checkOut)) {
      setErrorMsg(t.booking.alreadyBooked);
      setStep(1);
      return;
    }

    const result = createBooking({
      roomId: selectedRoomId,
      roomName: getLoc(currentRoom.name),
      guestName,
      guestEmail,
      guestPhone,
      checkInDate: checkIn,
      checkOutDate: checkOut,
      adults,
      children,
      totalNights: nights,
      pricePerNightETB: currentRoom.pricePerNightETB,
      totalAmountETB,
      specialRequests,
      language,
    });

    if (result.success && result.booking) {
      setConfirmedBooking(result.booking);
      setStep(4);
    } else {
      setErrorMsg(result.error || 'Failed to complete reservation. Please try again.');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // WhatsApp click handler
  const getWhatsAppUrl = () => {
    const text = encodeURIComponent(
      `Hello Planet Luxury Guest Houses,\n\nI have confirmed a reservation:\nRef: ${confirmedBooking?.bookingReference}\nGuest: ${guestName}\nRoom: ${confirmedBooking?.roomName}\nDates: ${checkIn} to ${checkOut}\nTotal: ${totalAmountETB.toLocaleString()} ETB\n\nPlease let me know about airport transfer and arrival details.`
    );
    return `https://wa.me/${hotelInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#0F2D24] text-white flex items-center justify-between border-b border-[#1E4B3D]">
          <div>
            <span className="text-[11px] uppercase tracking-widest text-amber-300 font-medium">
              Planet Luxury Guest Houses · Assosa
            </span>
            <h2 className="font-serif-luxury text-xl sm:text-2xl font-bold mt-0.5">
              {t.booking.modalTitle}
            </h2>
          </div>
          <button
            type="button"
            onClick={closeBookingModal}
            className="p-1.5 rounded-full hover:bg-white/15 text-stone-300 hover:text-white transition-colors focus:outline-none"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Step Progress Bar */}
        <div className="bg-[#143B30] px-6 py-2.5 border-b border-[#205344] flex items-center justify-between text-xs">
          {[
            { num: 1, label: t.booking.step1 },
            { num: 2, label: t.booking.step2 },
            { num: 3, label: t.booking.step3 },
            { num: 4, label: t.booking.step4 },
          ].map(s => (
            <div
              key={s.num}
              className={`flex items-center gap-1.5 ${
                step === s.num
                  ? 'text-amber-300 font-semibold'
                  : step > s.num
                  ? 'text-emerald-300/80'
                  : 'text-stone-400'
              }`}
            >
              <div
                className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                  step === s.num
                    ? 'bg-amber-400 text-stone-900'
                    : step > s.num
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-700 text-stone-300'
                }`}
              >
                {step > s.num ? '✓' : s.num}
              </div>
              <span className="hidden sm:inline text-xs">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-stone-800">
          {errorMsg && (
            <div className="mb-5 p-3.5 bg-rose-50 border border-rose-200 rounded-lg flex items-start gap-2.5 text-xs text-rose-800">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* STEP 1: Room & Dates */}
          {step === 1 && (
            <form onSubmit={handleProceedToGuestInfo} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-2">
                  {t.booking.selectRoom}
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {rooms.map(room => (
                    <button
                      key={room.id}
                      type="button"
                      onClick={() => {
                        setSelectedRoomId(room.id);
                        setErrorMsg(null);
                      }}
                      className={`p-3 rounded-xl border text-start transition-all cursor-pointer flex flex-col justify-between ${
                        selectedRoomId === room.id
                          ? 'border-[#0F2D24] bg-emerald-50/50 ring-2 ring-[#0F2D24]/20'
                          : 'border-stone-200 hover:border-stone-400 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-serif-luxury font-bold text-stone-900 text-base">
                          {getLoc(room.name)}
                        </span>
                        {selectedRoomId === room.id && (
                          <span className="text-emerald-700 text-xs font-bold">✓</span>
                        )}
                      </div>
                      <div className="flex items-baseline justify-between mt-2 pt-2 border-t border-stone-100">
                        <span className="text-[11px] text-stone-500 font-sans">
                          {room.capacityAdults} {t.hero.adults} · {room.roomSizeM2} m²
                        </span>
                        <span className="font-semibold text-xs text-[#0F2D24]">
                          {room.pricePerNightETB.toLocaleString()} ETB
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dates Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.checkInDate}
                  </label>
                  <input
                    type="date"
                    value={checkIn}
                    min={new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      setCheckIn(e.target.value);
                      setErrorMsg(null);
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.checkOutDate}
                  </label>
                  <input
                    type="date"
                    value={checkOut}
                    min={checkIn || new Date().toISOString().split('T')[0]}
                    onChange={e => {
                      setCheckOut(e.target.value);
                      setErrorMsg(null);
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  />
                </div>
              </div>

              {/* Guests Count */}
              <div className="grid grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.adultCount}
                  </label>
                  <select
                    value={adults}
                    onChange={e => setAdults(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  >
                    {[1, 2, 3, 4, 5, 6].map(num => (
                      <option key={num} value={num}>
                        {num} {t.hero.adults}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.childCount}
                  </label>
                  <select
                    value={children}
                    onChange={e => setChildren(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  >
                    {[0, 1, 2, 3, 4].map(num => (
                      <option key={num} value={num}>
                        {num} {t.hero.children}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Price summary ribbon */}
              <div className="p-3.5 bg-[#F9F8F5] rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <span className="text-stone-600">
                  {nights} {t.booking.nights} × {currentRoom.pricePerNightETB.toLocaleString()} ETB
                </span>
                <span className="font-serif-luxury font-bold text-base text-[#0F2D24]">
                  {subtotalETB.toLocaleString()} ETB
                </span>
              </div>

              {/* Actions */}
              <div className="pt-2 flex justify-end">
                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 active:scale-[0.98]"
                >
                  <span>{t.booking.next}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Guest Details */}
          {step === 2 && (
            <form onSubmit={handleProceedToReview} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.booking.fullName} *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Dr. Abebe Tadesse"
                  value={guestName}
                  onChange={e => {
                    setGuestName(e.target.value);
                    setErrorMsg(null);
                  }}
                  required
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.email} *
                  </label>
                  <input
                    type="email"
                    placeholder="name@organization.com"
                    value={guestEmail}
                    onChange={e => {
                      setGuestEmail(e.target.value);
                      setErrorMsg(null);
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.booking.phone} *
                  </label>
                  <input
                    type="tel"
                    placeholder="+251 91 234 5678"
                    value={guestPhone}
                    onChange={e => {
                      setGuestPhone(e.target.value);
                      setErrorMsg(null);
                    }}
                    required
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                  {t.booking.specialRequests}
                </label>
                <textarea
                  rows={3}
                  placeholder={t.booking.specialRequestsPlaceholder}
                  value={specialRequests}
                  onChange={e => setSpecialRequests(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-lg text-xs text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                />
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-lg text-[11px] text-amber-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <span>
                  {t.booking.paymentNote}
                </span>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.booking.back}</span>
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all flex items-center gap-2 active:scale-[0.98]"
                >
                  <span>{t.booking.proceedReview}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: Review & Confirm */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="p-4 bg-[#F8F7F4] rounded-xl border border-stone-200/80 space-y-3 text-xs">
                <div className="flex justify-between items-start pb-2 border-b border-stone-200">
                  <div>
                    <span className="text-stone-400 uppercase tracking-wider block text-[10px]">
                      {t.booking.roomBooked}
                    </span>
                    <span className="font-serif-luxury text-lg font-bold text-stone-900">
                      {getLoc(currentRoom.name)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="text-emerald-700 hover:underline text-[11px]"
                  >
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">
                      {t.booking.dates}
                    </span>
                    <span className="font-semibold">{checkIn} → {checkOut} ({nights} nights)</span>
                  </div>
                  <div>
                    <span className="text-stone-400 block text-[10px] uppercase">
                      {t.hero.guests}
                    </span>
                    <span className="font-semibold">{adults} Adults {children > 0 ? `, ${children} Children` : ''}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-stone-700">
                  <span className="text-stone-400 block text-[10px] uppercase">
                    {t.booking.guestInfo}
                  </span>
                  <span className="font-semibold block">{guestName}</span>
                  <span className="text-stone-500 block">{guestEmail} · {guestPhone}</span>
                  {specialRequests && (
                    <span className="text-stone-500 block italic mt-1">Note: {specialRequests}</span>
                  )}
                </div>
              </div>

              {/* ETB Pricing breakdown */}
              <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-2 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>{currentRoom.pricePerNightETB.toLocaleString()} ETB × {nights} {t.booking.nights}</span>
                  <span>{subtotalETB.toLocaleString()} ETB</span>
                </div>
                <div className="flex justify-between text-stone-500 text-[11px]">
                  <span>{t.booking.serviceAndTax}</span>
                  <span className="text-emerald-700 font-medium">Included</span>
                </div>
                <div className="pt-2 border-t border-stone-200 flex justify-between items-baseline">
                  <span className="font-semibold text-stone-900 text-sm">
                    {t.booking.totalAmount}
                  </span>
                  <div className="flex items-baseline gap-1">
                    <span className="font-serif-luxury font-bold text-2xl text-[#0F2D24]">
                      {totalAmountETB.toLocaleString()}
                    </span>
                    <span className="text-xs font-semibold text-stone-600">
                      ETB
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setStep(2)}
                  className="px-4 py-2.5 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{t.booking.back}</span>
                </button>

                <button
                  type="button"
                  onClick={handleFinalConfirm}
                  className="px-7 py-3 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-md hover:shadow-lg transition-all flex items-center gap-2 active:scale-[0.98]"
                >
                  <CheckCircle className="w-4 h-4 text-amber-300" />
                  <span>{t.booking.confirmBooking}</span>
                </button>
              </div>
            </div>
          )}

          {/* STEP 4: Success & Confirmation Slip */}
          {step === 4 && confirmedBooking && (
            <div className="space-y-5 text-center">
              <div className="w-14 h-14 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-800">
                <CheckCircle className="w-8 h-8 text-emerald-700" />
              </div>

              <div>
                <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
                  {t.booking.bookingSuccess}
                </h3>
                <p className="text-xs text-stone-500 mt-1">
                  A confirmation notification and email have been prepared for your reservation.
                </p>
              </div>

              {/* Official Booking Confirmation Card */}
              <div id="booking-confirmation-slip" className="text-start p-5 bg-[#F9F8F5] rounded-xl border border-stone-200/90 space-y-3 text-xs">
                <div className="flex justify-between items-center pb-2.5 border-b border-stone-200">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase tracking-widest block">
                      {t.booking.referenceNumber}
                    </span>
                    <span className="font-mono font-bold text-base text-[#0F2D24]">
                      {confirmedBooking.bookingReference}
                    </span>
                  </div>
                  <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 rounded font-semibold text-[11px] uppercase tracking-wide">
                    Confirmed
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-stone-700">
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {t.booking.roomBooked}
                    </span>
                    <span className="font-semibold">{confirmedBooking.roomName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {t.booking.guestInfo}
                    </span>
                    <span className="font-semibold">{confirmedBooking.guestName}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {t.booking.dates}
                    </span>
                    <span className="font-semibold">
                      {confirmedBooking.checkInDate} to {confirmedBooking.checkOutDate} ({confirmedBooking.totalNights} nights)
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block uppercase">
                      {t.booking.totalAmount}
                    </span>
                    <span className="font-serif-luxury font-bold text-base text-[#0F2D24]">
                      {confirmedBooking.totalAmountETB.toLocaleString()} ETB
                    </span>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-500">
                  <span>Hotel Address: {hotelInfo.address[language] || hotelInfo.address.en}</span>
                </div>
              </div>

              {/* Direct Actions: WhatsApp & Call */}
              <div className="space-y-2 pt-1">
                <span className="text-xs font-semibold text-stone-600 uppercase tracking-wider block">
                  {t.booking.contactDirectly}
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <a
                    href={getWhatsAppUrl()}
                    target="_blank"
                    rel="noreferrer"
                    className="px-4 py-2.5 bg-[#25D366] hover:bg-[#20ba5a] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>{t.booking.chatWhatsApp}</span>
                  </a>

                  <a
                    href={`tel:${hotelInfo.phone.replace(/[^0-9+]/g, '')}`}
                    className="px-4 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all"
                  >
                    <Phone className="w-4 h-4 text-amber-300" />
                    <span>{t.booking.callHotel}</span>
                  </a>
                </div>
              </div>

              {/* Utility actions: Print receipt & View Email Preview */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="px-3.5 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
                >
                  <Printer className="w-3.5 h-3.5" />
                  <span>{t.booking.downloadReceipt}</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    openEmailPreview({
                      type: 'guest_confirmation',
                      recipientName: confirmedBooking.guestName,
                      recipientEmail: confirmedBooking.guestEmail,
                      booking: confirmedBooking,
                    });
                  }}
                  className="px-3.5 py-2 text-xs font-medium text-[#0F2D24] hover:bg-emerald-50 border border-[#0F2D24]/30 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5 text-[#0F2D24]" />
                  <span>{t.booking.viewEmailPreview}</span>
                </button>
              </div>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={closeBookingModal}
                  className="w-full py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider rounded-lg transition-colors"
                >
                  {t.booking.close}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
