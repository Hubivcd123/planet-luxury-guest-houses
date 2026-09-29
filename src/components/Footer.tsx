import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  MapPin,
  Phone,
  Mail,
  Send,
  Check,
  Shield,
  ArrowUp,
} from 'lucide-react';

export const Footer: React.FC = () => {
  const { t, hotelInfo, openTermsModal, setAdminModalOpen } = useHotel();
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubscribed(true);
    setNewsletterEmail('');
    setTimeout(() => setSubscribed(false), 4000);
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#0B1E18] text-white pt-16 pb-12 border-t border-[#1C4334]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-8 pb-12 border-b border-[#1C4334]">
          {/* Col 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full border border-amber-300/40 bg-[#163E32] flex items-center justify-center">
                <span className="font-serif-luxury font-bold text-amber-300 text-xl">
                  P
                </span>
              </div>
              <div className="flex flex-col">
                <span className="font-serif-luxury font-semibold text-lg uppercase tracking-wider text-white">
                  Planet Luxury
                </span>
                <span className="text-[10px] tracking-widest uppercase text-amber-200/80 font-sans -mt-0.5">
                  Guest Houses · Assosa
                </span>
              </div>
            </div>

            <p className="text-xs text-stone-300/80 leading-relaxed font-sans max-w-sm">
              {t.footer.description}
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-1">
              <p>{t.footer.checkInNotice}</p>
              <p>Benishangul-Gumuz Regional State, Ethiopia</p>
            </div>
          </div>

          {/* Col 2: Quick Links (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-serif-luxury text-sm font-bold text-amber-300 uppercase tracking-wider">
              {t.footer.quickLinks}
            </h4>
            <ul className="space-y-2 font-sans text-stone-300/90">
              <li>
                <a href="#home" className="hover:text-amber-300 transition-colors">
                  {t.nav.home}
                </a>
              </li>
              <li>
                <a href="#rooms" className="hover:text-amber-300 transition-colors">
                  {t.nav.rooms}
                </a>
              </li>
              <li>
                <a href="#experiences" className="hover:text-amber-300 transition-colors">
                  {t.nav.experiences}
                </a>
              </li>
              <li>
                <a href="#dining" className="hover:text-amber-300 transition-colors">
                  {t.nav.dining}
                </a>
              </li>
              <li>
                <a href="#facilities" className="hover:text-amber-300 transition-colors">
                  {t.nav.facilities}
                </a>
              </li>
              <li>
                <a href="#gallery" className="hover:text-amber-300 transition-colors">
                  {t.nav.gallery}
                </a>
              </li>
              <li>
                <a href="#offers" className="hover:text-amber-300 transition-colors">
                  {t.nav.offers}
                </a>
              </li>
            </ul>
          </div>

          {/* Col 3: Accommodations (2 cols) */}
          <div className="lg:col-span-2 space-y-3 text-xs">
            <h4 className="font-serif-luxury text-sm font-bold text-amber-300 uppercase tracking-wider">
              {t.footer.accommodations}
            </h4>
            <ul className="space-y-2 font-sans text-stone-300/90">
              <li>Standard King Room</li>
              <li>Deluxe Garden Room</li>
              <li>Executive Business Room</li>
              <li>Family Comfort Suite</li>
              <li>Presidential Luxury Suite</li>
              <li>Airport Shuttle (ASO)</li>
            </ul>
          </div>

          {/* Col 4: Newsletter & Contact (4 cols) */}
          <div className="lg:col-span-4 space-y-4">
            <h4 className="font-serif-luxury text-sm font-bold text-amber-300 uppercase tracking-wider">
              {t.footer.newsletterTitle}
            </h4>
            <p className="text-xs text-stone-300/80 font-sans leading-relaxed">
              {t.footer.newsletterSubtitle}
            </p>

            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={e => setNewsletterEmail(e.target.value)}
                placeholder={t.footer.emailPlaceholder}
                required
                className="flex-1 px-3 py-2 bg-[#122D24] border border-[#235345] rounded text-xs text-white placeholder-stone-400 focus:outline-none focus:ring-1 focus:ring-amber-300"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-gradient-to-r from-[#C29D62] to-[#D4AF37] text-stone-950 font-semibold text-xs rounded hover:opacity-90 transition-opacity"
              >
                {t.footer.subscribe}
              </button>
            </form>

            {subscribed && (
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 font-sans">
                <Check className="w-3.5 h-3.5" />
                <span>{t.footer.subSuccess}</span>
              </p>
            )}

            <div className="pt-2 text-xs text-stone-400 font-sans space-y-1">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{hotelInfo.phone} · {hotelInfo.secondaryPhone}</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>{hotelInfo.email}</span>
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-400 font-sans">
          <p>{t.footer.copyright}</p>

          <div className="flex items-center gap-4">
            <button
              type="button"
              onClick={() => openTermsModal('privacy')}
              className="hover:text-amber-300 transition-colors"
            >
              {t.footer.privacy}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => openTermsModal('terms')}
              className="hover:text-amber-300 transition-colors"
            >
              {t.footer.terms}
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={() => setAdminModalOpen(true)}
              className="hover:text-amber-300 transition-colors flex items-center gap-1 text-emerald-400"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin</span>
            </button>
            <span>·</span>
            <button
              type="button"
              onClick={scrollToTop}
              className="p-1.5 rounded-full bg-[#163E32] text-amber-300 hover:bg-[#1E5242] transition-colors"
              title="Scroll to Top"
            >
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};
