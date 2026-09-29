import React from 'react';
import { useHotel } from '../context/HotelContext';
import {
  Bed,
  UtensilsCrossed,
  Users,
  PlaneTakeoff,
  Sparkles,
  Wifi,
  Clock,
  PartyPopper,
  Shield,
  ArrowRight,
} from 'lucide-react';

export const ExperiencesSection: React.FC = () => {
  const { t, openBookingModal } = useHotel();

  const services = [
    {
      icon: Bed,
      title: 'Comfortable Accommodation',
      titleAm: 'ምቹ እና ጸጥ ያለ ማረፊያ',
      titleAr: 'إقامة مريحة وهادئة',
      desc: 'Thoughtfully designed rooms with premium bedding, climate control, and tranquil ambiance.',
    },
    {
      icon: UtensilsCrossed,
      title: 'Restaurant & Dining',
      titleAm: 'ምግብ ቤት እና የቡና ዝግጅት',
      titleAr: 'مطعم فاخر ومأكولات طازجة',
      desc: 'Traditional Ethiopian heritage recipes and savory international dishes prepared with fresh ingredients.',
    },
    {
      icon: Users,
      title: 'Conference & Meeting',
      titleAm: 'የስብሰባ እና የውይይት አዳራሽ',
      titleAr: 'قاعة مؤتمرات واجتماعات',
      desc: 'Quiet boardroom with audio-visual equipment, high-speed Wi-Fi, and executive coffee breaks.',
    },
    {
      icon: PlaneTakeoff,
      title: 'Assosa Airport Shuttle',
      titleAm: 'የአሶሳ አውሮፕላን ማረፊያ ትራንስፖርት',
      titleAr: 'خدمة التوصيل من مطار أسوسا',
      desc: 'Reliable private airport transfers connecting Assosa Airport (ASO) directly to our gates.',
    },
    {
      icon: Sparkles,
      title: 'Express Laundry Service',
      titleAm: 'የልብስ እጥበት እና የተኩስ አገልግሎት',
      titleAr: 'خدمة غسيل وكي الملابس السريعة',
      desc: 'Same-day laundry and pressing ensuring corporate delegates maintain pristine attire.',
    },
    {
      icon: Wifi,
      title: 'High-Speed Fiber Wi-Fi',
      titleAm: 'ፈጣን የፋይበር ኢንተርኔት',
      titleAr: 'واي فاي فايبر فائق السرعة',
      desc: 'Uninterrupted fiber connectivity across guest rooms, private terraces, and common areas.',
    },
    {
      icon: Clock,
      title: '24/7 Room Service',
      titleAm: 'የ24 ሰዓት የክፍል ውስጥ አገልግሎት',
      titleAr: 'خدمة الغرف على مدار 24 ساعة',
      desc: 'Hot meals, late-night tea, fresh juices, and refreshments brought promptly to your room.',
    },
    {
      icon: PartyPopper,
      title: 'Events & Celebrations',
      titleAm: 'የተለያዩ ዝግጅቶች እና በዓላት',
      titleAr: 'استضافة الفعاليات والمناسبات',
      desc: 'Courtyard garden space and catering setup for intimate wedding receptions and milestones.',
    },
    {
      icon: Shield,
      title: 'Secure Gated Parking',
      titleAm: 'አስተማማኝ የመኪና ማቆሚያ',
      titleAr: 'مواقف سيارات آمنة ومحروسة',
      desc: '24/7 guarded private lot with full CCTV surveillance for private and organizational vehicles.',
    },
  ];

  return (
    <section id="experiences" className="py-20 sm:py-28 bg-[#F4F2EB] border-y border-stone-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block">
            Hospitality Services
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.experiences.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.experiences.sectionSubtitle}
          </p>
        </div>

        {/* 3x3 Bento Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white p-7 rounded-2xl border border-stone-200/80 shadow-sm hover:shadow-md transition-all hover:border-[#0F2D24]/40 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 text-[#0F2D24] flex items-center justify-center mb-5 group-hover:bg-[#0F2D24] group-hover:text-amber-300 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif-luxury text-xl font-bold text-stone-900 mb-2 group-hover:text-[#0F2D24] transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 font-sans leading-relaxed">
                    {item.desc}
                  </p>
                </div>

                <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-sans">
                    Available for all guests
                  </span>
                  <button
                    type="button"
                    onClick={() => openBookingModal()}
                    className="text-[#0F2D24] font-semibold group-hover:translate-x-1 transition-transform flex items-center gap-1"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
