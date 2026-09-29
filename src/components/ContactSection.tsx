import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Send,
  MessageSquare,
  Navigation,
  CheckCircle,
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { hotelInfo, t, getLoc, addNotification, openEmailPreview } = useHotel();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isSending, setIsSending] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);

    setTimeout(() => {
      // Add admin notification
      addNotification({
        title: {
          en: `New Inquiry from ${name}`,
          am: `አዲስ ጥያቄ ከ ${name}`,
          ar: `استفسار جديد من النزيل: ${name}`,
        },
        message: {
          en: `Subject: "${subject || 'General Inquiry'}" - Phone: ${phone}, Email: ${email}. Message: "${message.substring(0, 100)}..."`,
          am: `ጉዳይ፡ "${subject || 'አጠቃላይ'}" - ስልክ፡ ${phone}። መልዕክት፡ "${message.substring(0, 100)}..."`,
          ar: `الموضوع: "${subject || 'استفسار عام'}" - هاتف: ${phone}. نص الرسالة: "${message.substring(0, 100)}..."`,
        },
        date: 'Just now',
        targetAudience: 'admin',
        type: 'inquiry',
      });

      setIsSending(false);
      setSubmitted(true);
      setName('');
      setEmail('');
      setPhone('');
      setSubject('');
      setMessage('');
    }, 600);
  };

  const getWhatsAppContactUrl = () => {
    const text = encodeURIComponent(
      `Hello Planet Luxury Guest Houses (Assosa),\nI would like to inquire about booking availability and services.`
    );
    return `https://wa.me/${hotelInfo.whatsappNumber.replace(/[^0-9]/g, '')}?text=${text}`;
  };

  return (
    <section id="contact" className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Connect With Our Team
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.contact.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.contact.sectionSubtitle}
          </p>
        </div>

        {/* Quick Action Buttons Row */}
        <div className="flex flex-wrap items-center justify-center gap-3.5 mb-12">
          <a
            href={`tel:${hotelInfo.phone.replace(/[^0-9+]/g, '')}`}
            className="px-6 py-3 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <Phone className="w-4 h-4" />
            <span>{t.contact.callNow}</span>
          </a>

          <a
            href={getWhatsAppContactUrl()}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-[#25D366] hover:bg-[#20ba5a] text-white text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm transition-all flex items-center gap-2 active:scale-[0.98]"
          >
            <MessageSquare className="w-4 h-4" />
            <span>{t.contact.whatsapp}</span>
          </a>

          <a
            href={hotelInfo.googleMapsDirectionsUrl}
            target="_blank"
            rel="noreferrer"
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold uppercase tracking-wider border border-stone-300 rounded-lg transition-colors flex items-center gap-2"
          >
            <Navigation className="w-4 h-4 text-[#0F2D24]" />
            <span>{t.contact.getDirections}</span>
          </a>
        </div>

        {/* 2-Column Layout: Cards & Map on Left, Interactive Form on Right */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Contact Cards & Map */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
              <div className="flex items-start gap-3.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F2D24] flex items-center justify-center shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    {t.contact.addressTitle}
                  </span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {getLoc(hotelInfo.address)}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F2D24] flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    {t.contact.phoneTitle}
                  </span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {hotelInfo.phone} · {hotelInfo.secondaryPhone}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F2D24] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    {t.contact.emailTitle}
                  </span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {hotelInfo.email}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3.5 pt-3 border-t border-stone-100">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-[#0F2D24] flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider block">
                    {t.contact.hoursTitle}
                  </span>
                  <p className="text-sm font-semibold text-stone-800 mt-0.5">
                    {getLoc(hotelInfo.receptionHours)}
                  </p>
                  <p className="text-xs text-stone-500">
                    Check-in: {hotelInfo.checkInTime} | Check-out: {hotelInfo.checkOutTime}
                  </p>
                </div>
              </div>
            </div>

            {/* Google Map Box */}
            <div className="rounded-2xl overflow-hidden border border-stone-200 shadow-sm h-64 bg-stone-100">
              <iframe
                title="Planet Luxury Guest Houses Location Assosa"
                src={hotelInfo.googleMapsEmbedUrl}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Right Column: Contact Inquiry Form */}
          <div className="lg:col-span-7 bg-white p-7 sm:p-9 rounded-2xl border border-stone-200 shadow-sm flex flex-col justify-between">
            <div>
              <h3 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-1">
                {t.contact.formTitle}
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 font-sans mb-6">
                {t.contact.formSubtitle}
              </p>

              {submitted && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-3 text-xs text-emerald-900 animate-fadeIn">
                  <CheckCircle className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block text-sm">Message Transmitted Successfully</span>
                    <span>{t.contact.messageSent}</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4 font-sans text-stone-800">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.contact.senderName} *
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Your full name"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.contact.senderEmail} *
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      required
                      placeholder="name@example.com"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.contact.senderPhone}
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={e => setPhone(e.target.value)}
                      placeholder="+251 91 000 0000"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      {t.contact.subject}
                    </label>
                    <input
                      type="text"
                      value={subject}
                      onChange={e => setSubject(e.target.value)}
                      placeholder="E.g. Group reservation, long stay contract"
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    {t.contact.message} *
                  </label>
                  <textarea
                    rows={4}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    required
                    placeholder="Provide details about dates, number of guests, or inquiries..."
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-lg text-sm text-stone-900 focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSending}
                  className="w-full py-3 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all flex items-center justify-center gap-2 active:scale-[0.98] disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  <span>{isSending ? t.contact.sending : t.contact.sendMessage}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
