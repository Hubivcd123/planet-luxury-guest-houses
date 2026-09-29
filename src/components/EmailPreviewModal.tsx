import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { X, Mail, Copy, Check, Send, Printer } from 'lucide-react';

export const EmailPreviewModal: React.FC = () => {
  const { emailPreview, closeEmailPreview, hotelInfo, t, language } = useHotel();
  const [copied, setCopied] = useState(false);
  const [sendSuccess, setSendSuccess] = useState(false);

  if (!emailPreview.isOpen) return null;

  const booking = emailPreview.booking;
  const guestName = emailPreview.recipientName || 'Valued Guest';
  const recipientEmail = emailPreview.recipientEmail || 'guest@example.com';

  const bookingRef = booking?.bookingReference || 'PLG-2026-DEMO';
  const roomName = booking?.roomName || 'Executive Deluxe Room';
  const checkIn = booking?.checkInDate || '2026-10-05';
  const checkOut = booking?.checkOutDate || '2026-10-08';
  const totalAmount = booking?.totalAmountETB ? booking.totalAmountETB.toLocaleString() : '12,600';

  const emailText = `FROM: ${t.email.from}
TO: ${recipientEmail}
SUBJECT: ${t.email.subjectConfirm} - Ref: ${bookingRef}

${t.email.intro} ${guestName},

${t.email.thankYou}

${t.email.confirmationNotice}

--------------------------------------------------
RESERVATION DETAILS:
Booking Reference: ${bookingRef}
Guest Name: ${guestName}
Accommodation: ${roomName}
Check-in Date: ${checkIn} (From 2:00 PM)
Check-out Date: ${checkOut} (Until 12:00 PM)
Total Amount: ${totalAmount} ETB
Payment Method: Payable on Arrival (Cash ETB / Telebirr / CBE Birr)
--------------------------------------------------

HOTEL CONTACT & RECEPTION:
Address: ${hotelInfo.address.en}
Telephone: ${hotelInfo.phone}
WhatsApp: ${hotelInfo.whatsappNumber}
Email: ${hotelInfo.email}

${t.email.needHelp}

${t.email.warmRegards}
${t.email.team}
`;

  const handleCopy = () => {
    navigator.clipboard.writeText(emailText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleSimulateSend = () => {
    setSendSuccess(true);
    setTimeout(() => setSendSuccess(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between border-b border-[#1E4B3D]">
          <div className="flex items-center gap-2">
            <Mail className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif-luxury text-lg font-bold">
                {t.email.previewTitle}
              </h3>
              <span className="text-[11px] text-emerald-300 font-sans">
                Automated Transactional Mail Preview
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={closeEmailPreview}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Email Metadata Header Bar */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 text-xs font-mono text-stone-700 space-y-1">
          <div><strong className="text-stone-900">From:</strong> {t.email.from}</div>
          <div><strong className="text-stone-900">To:</strong> {recipientEmail}</div>
          <div><strong className="text-stone-900">Subject:</strong> {t.email.subjectConfirm} [{bookingRef}]</div>
        </div>

        {/* Rendered Luxury Branded Email Body */}
        <div className="p-6 overflow-y-auto flex-1 font-sans text-stone-800 bg-[#FBFBFA]">
          <div className="max-w-lg mx-auto bg-white border border-stone-200 rounded-xl shadow-sm p-6 sm:p-8 space-y-5">
            {/* Email Brand Header */}
            <div className="text-center pb-5 border-b border-stone-100">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#0F2D24] text-amber-300 font-serif-luxury font-bold text-2xl flex items-center justify-center mb-2">
                P
              </div>
              <h2 className="font-serif-luxury text-xl font-bold tracking-wider text-stone-900 uppercase">
                Planet Luxury Guest Houses
              </h2>
              <span className="text-[10px] tracking-widest uppercase text-stone-500 font-sans">
                Assosa · Benishangul-Gumuz · Ethiopia
              </span>
            </div>

            {/* Email Greeting */}
            <div>
              <p className="text-sm font-semibold text-stone-800">
                {t.email.intro} {guestName},
              </p>
              <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                {t.email.thankYou} {t.email.confirmationNotice}
              </p>
            </div>

            {/* Summary Box */}
            <div className="p-4 bg-[#F8F7F4] rounded-lg border border-stone-200 text-xs space-y-2">
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Booking Reference:</span>
                <span className="font-mono font-bold text-[#0F2D24]">{bookingRef}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Room:</span>
                <span className="font-semibold">{roomName}</span>
              </div>
              <div className="flex justify-between border-b border-stone-200/60 pb-1.5">
                <span className="text-stone-500">Dates:</span>
                <span className="font-semibold">{checkIn} to {checkOut}</span>
              </div>
              <div className="flex justify-between pt-1">
                <span className="text-stone-800 font-bold">Total Amount:</span>
                <span className="font-serif-luxury font-bold text-sm text-[#0F2D24]">{totalAmount} ETB</span>
              </div>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              {t.email.needHelp}
            </p>

            <div className="pt-4 border-t border-stone-100 text-xs text-stone-500">
              <p className="font-semibold text-stone-700">{t.email.warmRegards}</p>
              <p className="whitespace-pre-line mt-1">{t.email.team}</p>
              <p className="text-[11px] text-stone-400 mt-3">
                Kebele 02, Assosa, Ethiopia · Phone: {hotelInfo.phone}
              </p>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-3.5 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="px-3.5 py-2 text-xs font-medium text-stone-700 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors flex items-center gap-1.5"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t.email.copied : t.email.copyNotice}</span>
            </button>

            <button
              type="button"
              onClick={handleSimulateSend}
              className="px-3.5 py-2 text-xs font-medium text-[#0F2D24] hover:bg-emerald-50 border border-[#0F2D24]/30 rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{sendSuccess ? 'Test Email Dispatched!' : 'Send Test Copy'}</span>
            </button>
          </div>

          <button
            type="button"
            onClick={closeEmailPreview}
            className="px-4 py-2 bg-[#0F2D24] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg"
          >
            Close Preview
          </button>
        </div>
      </div>
    </div>
  );
};
