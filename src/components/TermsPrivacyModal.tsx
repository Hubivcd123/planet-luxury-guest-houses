import React from 'react';
import { useHotel } from '../context/HotelContext';
import { X, ShieldCheck, FileText } from 'lucide-react';

export const TermsPrivacyModal: React.FC = () => {
  const { termsModalOpen, termsModalType, closeTermsModal, t, hotelInfo } = useHotel();

  if (!termsModalOpen) return null;

  const isTerms = termsModalType === 'terms';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[85vh] flex flex-col border border-stone-200">
        <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between border-b border-[#1E4B3D]">
          <div className="flex items-center gap-2.5">
            {isTerms ? <FileText className="w-5 h-5 text-amber-300" /> : <ShieldCheck className="w-5 h-5 text-amber-300" />}
            <h3 className="font-serif-luxury text-xl font-bold">
              {isTerms ? t.footer.terms : t.footer.privacy}
            </h3>
          </div>
          <button
            type="button"
            onClick={closeTermsModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1 font-sans text-stone-700 text-xs sm:text-sm space-y-4 leading-relaxed">
          {isTerms ? (
            <>
              <h4 className="font-bold text-stone-900 text-base">
                1. Reservation & Check-in Policies
              </h4>
              <p>
                Planet Luxury Guest Houses welcomes guests to Assosa, Benishangul-Gumuz, Ethiopia. Check-in commences at 2:00 PM (14:00) and check-out is required by 12:00 PM (12:00). Valid government identification (Passport, Ethiopian National Kebele ID, or Diplomatic Card) is mandatory upon arrival.
              </p>

              <h4 className="font-bold text-stone-900 text-base">
                2. Pricing & Currency
              </h4>
              <p>
                All room rates are quoted and charged in Ethiopian Birr (ETB). Payment may be completed upon arrival through cash (ETB) or verified digital banking services (Telebirr, Commercial Bank of Ethiopia CBE Birr, or Awash Bank).
              </p>

              <h4 className="font-bold text-stone-900 text-base">
                3. Cancellation & No-Show
              </h4>
              <p>
                Individual reservations can be cancelled without penalty up to 24 hours prior to standard check-in time. For delegations, group reservations, or conference hall bookings, a 48-hour advance notice is requested.
              </p>

              <h4 className="font-bold text-stone-900 text-base">
                4. Property Conduct & Safety
              </h4>
              <p>
                Guests are requested to preserve the quiet sanctuary of our guest house. Smoking is strictly restricted to designated outdoor garden verandas. Round-the-clock security and gated surveillance ensure peaceful and secure stays.
              </p>
            </>
          ) : (
            <>
              <h4 className="font-bold text-stone-900 text-base">
                1. Information We Collect
              </h4>
              <p>
                When reserving accommodations or contacting Planet Luxury Guest Houses, we collect basic contact information including your full name, email address, phone/WhatsApp number, and flight arrival details for airport transfers.
              </p>

              <h4 className="font-bold text-stone-900 text-base">
                2. Use of Your Information
              </h4>
              <p>
                Your details are utilized solely for confirming room availability, managing airport shuttles, coordinating housekeeping preferences, and providing essential hospitality notifications during your stay in Assosa.
              </p>

              <h4 className="font-bold text-stone-900 text-base">
                3. Data Protection & Confidentiality
              </h4>
              <p>
                We do not sell, rent, or distribute guest data to third-party commercial marketing platforms. Data is stored securely and accessed exclusively by authorized hotel administration.
              </p>
            </>
          )}
        </div>

        <div className="p-4 bg-stone-50 border-t border-stone-200 flex justify-end">
          <button
            type="button"
            onClick={closeTermsModal}
            className="px-5 py-2 bg-[#0F2D24] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg"
          >
            I Understand
          </button>
        </div>
      </div>
    </div>
  );
};
