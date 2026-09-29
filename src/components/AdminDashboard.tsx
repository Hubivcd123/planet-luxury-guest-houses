import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { Room, Booking, SpecialOffer, DiningItem, AppNotification, MultilingualText } from '../types';
import { RoomImageManager } from './admin/RoomImageManager';
import { GalleryImageManager } from './admin/GalleryImageManager';
import {
  X,
  Shield,
  LayoutDashboard,
  Bed,
  Calendar,
  Tag,
  Utensils,
  Image as ImageIcon,
  Bell,
  Settings,
  Check,
  Trash2,
  Edit,
  Plus,
  Lock,
  LogOut,
  Send,
  MessageSquare,
  Phone,
  Eye,
  Sparkles,
} from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  const {
    adminModalOpen,
    setAdminModalOpen,
    isAdminLoggedIn,
    loginAdmin,
    logoutAdmin,
    t,
    rooms,
    addRoom,
    updateRoom,
    deleteRoom,
    bookings,
    updateBookingStatus,
    deleteBooking,
    offers,
    addOffer,
    deleteOffer,
    diningItems,
    addDiningItem,
    deleteDiningItem,
    gallery,
    addGalleryItem,
    deleteGalleryItem,
    notifications,
    addNotification,
    deleteNotification,
    hotelInfo,
    updateHotelInfo,
    getLoc,
    language,
    openEmailPreview,
  } = useHotel();

  // Login form state
  const [passcode, setPasscode] = useState('');
  const [loginError, setLoginError] = useState(false);

  // Active Tab
  type AdminTab = 'overview' | 'bookings' | 'rooms' | 'offers' | 'dining' | 'gallery' | 'announcements' | 'settings';
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  // Room Image Management sub-view
  const [selectedRoomForImages, setSelectedRoomForImages] = useState<Room | null>(null);

  // Announcement Form State
  const [announcementTitleEn, setAnnouncementTitleEn] = useState('');
  const [announcementTitleAm, setAnnouncementTitleAm] = useState('');
  const [announcementTitleAr, setAnnouncementTitleAr] = useState('');
  const [announcementMsgEn, setAnnouncementMsgEn] = useState('');
  const [announcementMsgAm, setAnnouncementMsgAm] = useState('');
  const [announcementMsgAr, setAnnouncementMsgAr] = useState('');
  const [announcementAudience, setAnnouncementAudience] = useState<'all' | 'guest'>('all');
  const [announcementType, setAnnouncementType] = useState<'offer' | 'system'>('offer');
  const [announcementSuccess, setAnnouncementSuccess] = useState(false);

  // Room Creation / Edit state
  const [isAddingRoom, setIsAddingRoom] = useState(false);
  const [newRoomNameEn, setNewRoomNameEn] = useState('');
  const [newRoomNameAm, setNewRoomNameAm] = useState('');
  const [newRoomNameAr, setNewRoomNameAr] = useState('');
  const [newRoomCategory, setNewRoomCategory] = useState<'standard' | 'deluxe' | 'executive' | 'family' | 'suite'>('deluxe');
  const [newRoomPrice, setNewRoomPrice] = useState(4500);
  const [newRoomCapacity, setNewRoomCapacity] = useState(2);
  const [newRoomSize, setNewRoomSize] = useState(35);
  const [newRoomDescEn, setNewRoomDescEn] = useState('');
  const [newRoomDescAm, setNewRoomDescAm] = useState('');
  const [newRoomDescAr, setNewRoomDescAr] = useState('');

  // Offer Creation State
  const [isAddingOffer, setIsAddingOffer] = useState(false);
  const [newOfferTitleEn, setNewOfferTitleEn] = useState('');
  const [newOfferTitleAm, setNewOfferTitleAm] = useState('');
  const [newOfferTitleAr, setNewOfferTitleAr] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState(15);
  const [newOfferCode, setNewOfferCode] = useState('SPECIAL-ASO');

  // Hotel Info settings state
  const [phoneState, setPhoneState] = useState(hotelInfo.phone);
  const [emailState, setEmailState] = useState(hotelInfo.email);
  const [whatsappState, setWhatsappState] = useState(hotelInfo.whatsappNumber);
  const [settingsSaved, setSettingsSaved] = useState(false);

  if (!adminModalOpen) return null;

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const success = loginAdmin(passcode);
    if (success) {
      setLoginError(false);
      setPasscode('');
    } else {
      setLoginError(true);
    }
  };

  const handleBroadcastAnnouncement = (e: React.FormEvent) => {
    e.preventDefault();
    if (!announcementTitleEn && !announcementTitleAm && !announcementTitleAr) return;

    addNotification({
      title: {
        en: announcementTitleEn || announcementTitleAm || announcementTitleAr,
        am: announcementTitleAm || announcementTitleEn,
        ar: announcementTitleAr || announcementTitleEn,
      },
      message: {
        en: announcementMsgEn || announcementMsgAm || announcementMsgAr,
        am: announcementMsgAm || announcementMsgEn,
        ar: announcementMsgAr || announcementMsgEn,
      },
      date: 'Just now',
      targetAudience: announcementAudience,
      type: announcementType,
    });

    setAnnouncementSuccess(true);
    setAnnouncementTitleEn('');
    setAnnouncementTitleAm('');
    setAnnouncementTitleAr('');
    setAnnouncementMsgEn('');
    setAnnouncementMsgAm('');
    setAnnouncementMsgAr('');
    setTimeout(() => setAnnouncementSuccess(false), 3000);
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    const newRoom: Room = {
      id: `room-custom-${Date.now()}`,
      category: newRoomCategory,
      name: {
        en: newRoomNameEn || 'New Luxury Room',
        am: newRoomNameAm || 'አዲስ የቅንጦት ክፍል',
        ar: newRoomNameAr || 'غرفة فاخرة جديدة',
      },
      description: {
        en: newRoomDescEn || 'Spacious modern accommodation with peaceful garden outlook in Assosa.',
        am: newRoomDescAm || 'በአሶሳ ምቹና ሰላማዊ ማረፊያ።',
        ar: newRoomDescAr || 'إقامة مريحة وعصرية في مدينة أسوسا.',
      },
      pricePerNightETB: Number(newRoomPrice),
      capacityAdults: Number(newRoomCapacity),
      capacityChildren: 1,
      bedType: {
        en: '1 King Bed',
        am: '1 ትልቅ አልጋ',
        ar: 'سرير كينغ',
      },
      roomSizeM2: Number(newRoomSize),
      amenities: ['High-Speed Wi-Fi', 'Hot Shower', 'Standby Generator Power', 'Room Service'],
      imageUrl: '/src/assets/images/room_deluxe_room_1790712190636.jpg',
      availableRoomsCount: 4,
      isAvailable: true,
    };

    addRoom(newRoom);
    setIsAddingRoom(false);
  };

  const handleCreateOffer = (e: React.FormEvent) => {
    e.preventDefault();
    const offer: SpecialOffer = {
      id: `offer-${Date.now()}`,
      title: {
        en: newOfferTitleEn || 'Special Assosa Seasonal Rate',
        am: newOfferTitleAm || 'ልዩ ወቅታዊ ቅናሽ',
        ar: newOfferTitleAr || 'عرض موسمي خاص',
      },
      subtitle: {
        en: `${newOfferDiscount}% Off Special Stay`,
        am: `${newOfferDiscount}% ቅናሽ`,
        ar: `خصم ${newOfferDiscount}%`,
      },
      description: {
        en: 'Special promotional rate available for direct bookings at Planet Luxury Guest Houses.',
        am: 'በቀጥታ ለሚያስይዙ እንግዶች የተዘጋጀ ልዩ ቅናሽ።',
        ar: 'سعر ترويجي حصري عند الحجز المباشر في نزل كوكب الفخامة.',
      },
      discountPercentage: Number(newOfferDiscount),
      validUntil: '2026-12-31',
      code: newOfferCode.toUpperCase(),
      imageUrl: '/src/assets/images/hero_planet_luxury_1790712166933.jpg',
      terms: {
        en: 'Subject to room availability.',
        am: 'ክፍሎች ባሉበት መጠን።',
        ar: 'حسب توفر الغرف.',
      },
      active: true,
    };
    addOffer(offer);
    setIsAddingOffer(false);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateHotelInfo({
      ...hotelInfo,
      phone: phoneState,
      email: emailState,
      whatsappNumber: whatsappState,
    });
    setSettingsSaved(true);
    setTimeout(() => setSettingsSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden max-h-[94vh] flex flex-col border border-stone-300">
        {/* Admin Header */}
        <div className="px-6 py-4 bg-[#0A2019] text-white flex items-center justify-between border-b border-[#1C4E3F]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-amber-400/20 border border-amber-400/40 flex items-center justify-center text-amber-300">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-serif-luxury text-lg font-bold text-white">
                  {t.admin.portalTitle}
                </h3>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono uppercase bg-amber-400 text-stone-950 font-bold">
                  {t.admin.badge}
                </span>
              </div>
              <span className="text-[11px] text-emerald-300/80 font-sans">
                Assosa, Benishangul-Gumuz, Ethiopia
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAdminLoggedIn && (
              <button
                type="button"
                onClick={logoutAdmin}
                className="px-3 py-1.5 text-xs text-rose-300 hover:text-white hover:bg-rose-900/40 rounded transition-colors flex items-center gap-1"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{t.admin.logoutBtn}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setAdminModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Not Logged In: Passcode Prompt */}
        {!isAdminLoggedIn ? (
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center font-sans max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-emerald-50 text-[#0F2D24] flex items-center justify-center mb-4">
              <Lock className="w-7 h-7" />
            </div>

            <h4 className="font-serif-luxury text-2xl font-bold text-stone-900 mb-1">
              {t.admin.loginPrompt}
            </h4>
            <p className="text-xs text-stone-500 mb-6">
              Enter the manager passcode to access reservations, room management, and broadcast announcements.
            </p>

            <form onSubmit={handleLogin} className="w-full space-y-4">
              <div>
                <input
                  type="password"
                  value={passcode}
                  onChange={e => {
                    setPasscode(e.target.value);
                    setLoginError(false);
                  }}
                  placeholder={t.admin.enterPass}
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-300 rounded-lg text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-[#0F2D24]"
                />
                {loginError && (
                  <p className="text-xs text-rose-600 mt-1.5">{t.admin.authError}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow transition-all active:scale-[0.98]"
              >
                {t.admin.loginBtn}
              </button>

              <div className="pt-2 text-[11px] text-stone-400">
                <span>{t.admin.demoHint}</span>
              </div>
            </form>
          </div>
        ) : (
          /* Logged In: Full Admin Workspace */
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden font-sans">
            {/* Sidebar Tabs */}
            <div className="w-full md:w-56 bg-stone-50 border-e border-stone-200 p-3 flex md:flex-col gap-1 overflow-x-auto md:overflow-x-visible shrink-0 text-xs">
              {[
                { id: 'overview', label: t.admin.tabDashboard, icon: LayoutDashboard },
                { id: 'bookings', label: t.admin.tabBookings, icon: Calendar, badge: bookings.length },
                { id: 'rooms', label: t.admin.tabRooms, icon: Bed, badge: rooms.length },
                { id: 'offers', label: t.admin.tabOffers, icon: Tag },
                { id: 'dining', label: t.admin.tabDining, icon: Utensils },
                { id: 'gallery', label: t.admin.tabGallery, icon: ImageIcon },
                { id: 'announcements', label: t.admin.tabAnnouncements, icon: Bell },
                { id: 'settings', label: t.admin.tabSettings, icon: Settings },
              ].map(tabItem => {
                const Icon = tabItem.icon;
                return (
                  <button
                    key={tabItem.id}
                    type="button"
                    onClick={() => {
                      if (tabItem.id !== 'rooms') setSelectedRoomForImages(null);
                      setActiveTab(tabItem.id as AdminTab);
                    }}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-start transition-colors whitespace-nowrap cursor-pointer ${
                      activeTab === tabItem.id
                        ? 'bg-[#0F2D24] text-amber-300 font-semibold shadow-sm'
                        : 'text-stone-700 hover:bg-stone-200/70 hover:text-stone-900'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span>{tabItem.label}</span>
                    </span>
                    {tabItem.badge !== undefined && (
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono ${activeTab === tabItem.id ? 'bg-amber-400 text-stone-950 font-bold' : 'bg-stone-200 text-stone-700'}`}>
                        {tabItem.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Tab Content Panel */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 bg-white text-stone-800">
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      Planet Luxury Management Console
                    </h4>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Live status of guest reservations, room capacities, and hotel communication.
                    </p>
                  </div>

                  {/* Top Stats Cards */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="p-4 rounded-xl bg-[#F9F8F5] border border-stone-200">
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                        {t.admin.totalBookings}
                      </span>
                      <span className="font-serif-luxury text-3xl font-bold text-[#0F2D24] block mt-1">
                        {bookings.length}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200">
                      <span className="text-[11px] text-emerald-800 uppercase tracking-wider block">
                        {t.admin.confirmedBookings}
                      </span>
                      <span className="font-serif-luxury text-3xl font-bold text-emerald-700 block mt-1">
                        {bookings.filter(b => b.status === 'confirmed').length}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-50 border border-amber-200">
                      <span className="text-[11px] text-amber-800 uppercase tracking-wider block">
                        {t.admin.pendingBookings}
                      </span>
                      <span className="font-serif-luxury text-3xl font-bold text-amber-700 block mt-1">
                        {bookings.filter(b => b.status === 'pending').length}
                      </span>
                    </div>

                    <div className="p-4 rounded-xl bg-stone-100 border border-stone-200">
                      <span className="text-[11px] text-stone-500 uppercase tracking-wider block">
                        Active Rooms
                      </span>
                      <span className="font-serif-luxury text-3xl font-bold text-stone-800 block mt-1">
                        {rooms.filter(r => r.isAvailable).length}
                      </span>
                    </div>
                  </div>

                  {/* Recent Bookings preview */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h5 className="font-serif-luxury text-lg font-bold text-stone-900">
                        Recent Reservations
                      </h5>
                      <button
                        type="button"
                        onClick={() => setActiveTab('bookings')}
                        className="text-xs text-[#0F2D24] font-semibold hover:underline"
                      >
                        View All Bookings →
                      </button>
                    </div>

                    <div className="border border-stone-200 rounded-xl overflow-hidden text-xs">
                      <table className="w-full text-start">
                        <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                          <tr>
                            <th className="p-3 text-start">Ref</th>
                            <th className="p-3 text-start">Guest</th>
                            <th className="p-3 text-start">Room</th>
                            <th className="p-3 text-start">Dates</th>
                            <th className="p-3 text-start">Amount</th>
                            <th className="p-3 text-start">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-100">
                          {bookings.slice(0, 4).map(b => (
                            <tr key={b.id} className="hover:bg-stone-50/50">
                              <td className="p-3 font-mono font-bold text-[#0F2D24]">{b.bookingReference}</td>
                              <td className="p-3 font-medium">{b.guestName}</td>
                              <td className="p-3 text-stone-600">{b.roomName}</td>
                              <td className="p-3 text-stone-500">{b.checkInDate} → {b.checkOutDate}</td>
                              <td className="p-3 font-semibold">{b.totalAmountETB.toLocaleString()} ETB</td>
                              <td className="p-3">
                                <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                  b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                  b.status === 'pending' ? 'bg-amber-100 text-amber-800' : 'bg-stone-100 text-stone-700'
                                }`}>
                                  {b.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: BOOKINGS MANAGEMENT */}
              {activeTab === 'bookings' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                        Guest Reservations
                      </h4>
                      <p className="text-xs text-stone-500">
                        Confirm, reject, cancel, or contact guests directly.
                      </p>
                    </div>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-x-auto text-xs">
                    <table className="w-full text-start">
                      <thead className="bg-stone-50 border-b border-stone-200 text-stone-500 uppercase text-[10px]">
                        <tr>
                          <th className="p-3 text-start">Reference</th>
                          <th className="p-3 text-start">Guest Details</th>
                          <th className="p-3 text-start">Room & Dates</th>
                          <th className="p-3 text-start">Total (ETB)</th>
                          <th className="p-3 text-start">Status</th>
                          <th className="p-3 text-start">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {bookings.map(b => (
                          <tr key={b.id} className="hover:bg-stone-50/50">
                            <td className="p-3">
                              <span className="font-mono font-bold text-[#0F2D24] block">{b.bookingReference}</span>
                              <span className="text-[10px] text-stone-400">{new Date(b.createdAt).toLocaleDateString()}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-semibold text-stone-900 block">{b.guestName}</span>
                              <span className="text-stone-500 block">{b.guestEmail}</span>
                              <span className="text-stone-500 block">{b.guestPhone}</span>
                            </td>
                            <td className="p-3">
                              <span className="font-medium text-stone-800 block">{b.roomName}</span>
                              <span className="text-stone-500">{b.checkInDate} to {b.checkOutDate} ({b.totalNights} nights)</span>
                              {b.specialRequests && (
                                <span className="block text-[11px] text-stone-500 italic mt-0.5">Req: {b.specialRequests}</span>
                              )}
                            </td>
                            <td className="p-3 font-semibold text-[#0F2D24]">
                              {b.totalAmountETB.toLocaleString()} ETB
                            </td>
                            <td className="p-3">
                              <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                                b.status === 'confirmed' ? 'bg-emerald-100 text-emerald-800' :
                                b.status === 'pending' ? 'bg-amber-100 text-amber-800' :
                                b.status === 'cancelled' ? 'bg-rose-100 text-rose-800' : 'bg-stone-100 text-stone-700'
                              }`}>
                                {b.status}
                              </span>
                            </td>
                            <td className="p-3">
                              <div className="flex items-center gap-1.5">
                                {b.status !== 'confirmed' && (
                                  <button
                                    type="button"
                                    onClick={() => updateBookingStatus(b.id, 'confirmed')}
                                    className="p-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded transition-colors"
                                    title="Confirm Booking"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                {b.status !== 'cancelled' && (
                                  <button
                                    type="button"
                                    onClick={() => updateBookingStatus(b.id, 'cancelled')}
                                    className="p-1.5 bg-rose-50 hover:bg-rose-100 text-rose-800 rounded transition-colors"
                                    title="Cancel Booking"
                                  >
                                    <X className="w-3.5 h-3.5" />
                                  </button>
                                )}
                                <button
                                  type="button"
                                  onClick={() => {
                                    openEmailPreview({
                                      type: 'guest_confirmation',
                                      recipientName: b.guestName,
                                      recipientEmail: b.guestEmail,
                                      booking: b,
                                    });
                                  }}
                                  className="p-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded transition-colors"
                                  title="View Generated Email"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => deleteBooking(b.id)}
                                  className="p-1.5 hover:bg-rose-50 text-stone-400 hover:text-rose-600 rounded transition-colors"
                                  title="Delete Record"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: ROOMS MANAGEMENT */}
              {activeTab === 'rooms' && selectedRoomForImages ? (
                <RoomImageManager
                  room={rooms.find(r => r.id === selectedRoomForImages.id) || selectedRoomForImages}
                  onBack={() => setSelectedRoomForImages(null)}
                />
              ) : activeTab === 'rooms' ? (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                        Rooms & Suites Inventory
                      </h4>
                      <p className="text-xs text-stone-500">
                        Adjust pricing in ETB, manage multiple room pictures, toggle availability, or add categories.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingRoom(!isAddingRoom)}
                      className="px-3.5 py-2 bg-[#0F2D24] text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5 shadow"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingRoom ? 'Cancel' : t.admin.addRoom}</span>
                    </button>
                  </div>

                  {/* Add Room Form */}
                  {isAddingRoom && (
                    <form onSubmit={handleCreateRoom} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                      <span className="font-bold text-stone-900 text-sm block">Add New Room Category</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Name (English)</label>
                          <input
                            type="text"
                            value={newRoomNameEn}
                            onChange={e => setNewRoomNameEn(e.target.value)}
                            placeholder="e.g. Garden Premier Suite"
                            required
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Name (Amharic አማርኛ)</label>
                          <input
                            type="text"
                            value={newRoomNameAm}
                            onChange={e => setNewRoomNameAm(e.target.value)}
                            placeholder="ምሳሌ፦ ፕሪሚየር ስዊት"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Name (Arabic العربية)</label>
                          <input
                            type="text"
                            value={newRoomNameAr}
                            onChange={e => setNewRoomNameAr(e.target.value)}
                            placeholder="مثال: جناح بريميير"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Rate per Night (ETB)</label>
                          <input
                            type="number"
                            value={newRoomPrice}
                            onChange={e => setNewRoomPrice(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Category</label>
                          <select
                            value={newRoomCategory}
                            onChange={e => setNewRoomCategory(e.target.value as any)}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          >
                            <option value="standard">Standard</option>
                            <option value="deluxe">Deluxe</option>
                            <option value="executive">Executive</option>
                            <option value="family">Family</option>
                            <option value="suite">Suite</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Capacity (Adults)</label>
                          <input
                            type="number"
                            value={newRoomCapacity}
                            onChange={e => setNewRoomCapacity(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Size (m²)</label>
                          <input
                            type="number"
                            value={newRoomSize}
                            onChange={e => setNewRoomSize(Number(e.target.value))}
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0F2D24] text-amber-300 font-semibold rounded shadow"
                        >
                          Save Room
                        </button>
                      </div>
                    </form>
                  )}

                  {/* Rooms list */}
                  <div className="space-y-3">
                    {rooms.map(room => (
                      <div
                        key={room.id}
                        className="p-4 rounded-xl border border-stone-200 bg-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-xs"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={room.imageUrl}
                            alt=""
                            className="w-16 h-16 rounded-lg object-cover bg-stone-100 shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-serif-luxury font-bold text-base text-stone-900 block">
                                {getLoc(room.name)}
                              </span>
                              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600 uppercase">
                                {room.category}
                              </span>
                            </div>
                            <span className="text-stone-500 block mt-0.5">
                              {room.capacityAdults} Adults · {room.roomSizeM2} m² · {room.availableRoomsCount} units available
                            </span>
                            <span className="text-[11px] text-emerald-800 font-medium">
                              📷 {room.images?.length || 1} photo{room.images?.length !== 1 ? 's' : ''} uploaded
                            </span>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                          <div className="text-end">
                            <span className="font-serif-luxury font-bold text-base text-[#0F2D24] block">
                              {room.pricePerNightETB.toLocaleString()} ETB
                            </span>
                            <span className="text-[10px] text-stone-400">per night</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => setSelectedRoomForImages(room)}
                              className="px-3 py-1.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                              title="Manage pictures for this room"
                            >
                              <ImageIcon className="w-3.5 h-3.5" />
                              <span>Manage Pictures ({room.images?.length || 1})</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                updateRoom({ ...room, isAvailable: !room.isAvailable });
                              }}
                              className={`px-2.5 py-1.5 rounded-lg text-[11px] font-medium ${
                                room.isAvailable ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                              }`}
                            >
                              {room.isAvailable ? 'Available' : 'Paused'}
                            </button>

                            <button
                              type="button"
                              onClick={() => deleteRoom(room.id)}
                              className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50"
                              title="Delete Room"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : null}

              {/* TAB 4: SPECIAL OFFERS */}
              {activeTab === 'offers' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                        Special Promotions & Offers
                      </h4>
                      <p className="text-xs text-stone-500">
                        Create seasonal discounts, corporate long-stay packages, and weekend specials.
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddingOffer(!isAddingOffer)}
                      className="px-3.5 py-2 bg-[#0F2D24] text-amber-300 text-xs font-semibold rounded-lg flex items-center gap-1.5"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{isAddingOffer ? 'Cancel' : t.admin.addOffer}</span>
                    </button>
                  </div>

                  {isAddingOffer && (
                    <form onSubmit={handleCreateOffer} className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 text-xs">
                      <span className="font-bold text-stone-900 text-sm block">Create New Offer</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Title (English)</label>
                          <input
                            type="text"
                            value={newOfferTitleEn}
                            onChange={e => setNewOfferTitleEn(e.target.value)}
                            required
                            placeholder="e.g. GERD Explorer Special"
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Discount %</label>
                          <input
                            type="number"
                            value={newOfferDiscount}
                            onChange={e => setNewOfferDiscount(Number(e.target.value))}
                            required
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                          />
                        </div>
                        <div>
                          <label className="block text-stone-600 mb-1 font-semibold">Promo Code</label>
                          <input
                            type="text"
                            value={newOfferCode}
                            onChange={e => setNewOfferCode(e.target.value)}
                            required
                            className="w-full px-3 py-2 bg-white border border-stone-300 rounded uppercase font-mono"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-2">
                        <button
                          type="submit"
                          className="px-5 py-2 bg-[#0F2D24] text-amber-300 font-semibold rounded shadow"
                        >
                          Publish Offer
                        </button>
                      </div>
                    </form>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {offers.map(offer => (
                      <div key={offer.id} className="p-4 rounded-xl border border-stone-200 bg-white flex justify-between items-start text-xs">
                        <div>
                          <span className="font-mono font-bold text-amber-600 block text-[11px]">{offer.code}</span>
                          <span className="font-serif-luxury font-bold text-base text-stone-900 block">{getLoc(offer.title)}</span>
                          <span className="text-stone-500 block">{offer.discountPercentage}% Discount · Valid until {offer.validUntil}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => deleteOffer(offer.id)}
                          className="text-stone-400 hover:text-rose-600 p-1"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: DINING & MENU */}
              {activeTab === 'dining' && (
                <div className="space-y-4">
                  <div>
                    <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      Restaurant Menu Items
                    </h4>
                    <p className="text-xs text-stone-500">
                      Manage Ethiopian heritage specialties, international dishes, and coffee ceremony settings.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    {diningItems.map(item => (
                      <div key={item.id} className="p-3.5 rounded-xl border border-stone-200 bg-white flex items-center justify-between">
                        <div>
                          <span className="font-serif-luxury font-bold text-stone-900 text-sm block">
                            {getLoc(item.name)}
                          </span>
                          <span className="text-[11px] text-stone-400 uppercase">{item.category}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-semibold text-[#0F2D24]">{item.priceETB} ETB</span>
                          <button
                            type="button"
                            onClick={() => deleteDiningItem(item.id)}
                            className="text-stone-400 hover:text-rose-600 p-1"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: GALLERY */}
              {activeTab === 'gallery' && (
                <GalleryImageManager />
              )}

              {/* TAB 7: ANNOUNCEMENTS & MULTILINGUAL NOTIFICATIONS */}
              {activeTab === 'announcements' && (
                <div className="space-y-6">
                  <div>
                    <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      Broadcast Multilingual Announcements
                    </h4>
                    <p className="text-xs text-stone-500">
                      Instantly send live updates to all guests in English, Amharic, and Arabic without page reload.
                    </p>
                  </div>

                  {announcementSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Announcement successfully broadcasted to guest notifications!</span>
                    </div>
                  )}

                  <form onSubmit={handleBroadcastAnnouncement} className="p-5 bg-stone-50 rounded-xl border border-stone-200 space-y-4 text-xs font-sans">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Target Audience</label>
                        <select
                          value={announcementAudience}
                          onChange={e => setAnnouncementAudience(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        >
                          <option value="all">All Guests & Visitors</option>
                          <option value="guest">Current Resident Guests</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-stone-700 font-semibold mb-1">Notification Category</label>
                        <select
                          value={announcementType}
                          onChange={e => setAnnouncementType(e.target.value as any)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        >
                          <option value="offer">Special Offer / Promotion</option>
                          <option value="system">Important Hotel Notice / Event</option>
                        </select>
                      </div>
                    </div>

                    {/* Multilingual Title Inputs */}
                    <div className="space-y-2">
                      <span className="font-bold text-stone-900 block">Notification Title in 3 Languages:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <input
                          type="text"
                          placeholder="Title (English)"
                          value={announcementTitleEn}
                          onChange={e => setAnnouncementTitleEn(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="ርዕስ (አማርኛ)"
                          value={announcementTitleAm}
                          onChange={e => setAnnouncementTitleAm(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                        <input
                          type="text"
                          placeholder="العنوان (العربية)"
                          value={announcementTitleAr}
                          onChange={e => setAnnouncementTitleAr(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    {/* Multilingual Message Inputs */}
                    <div className="space-y-2">
                      <span className="font-bold text-stone-900 block">Notification Message in 3 Languages:</span>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <textarea
                          rows={3}
                          placeholder="Message content (English)..."
                          value={announcementMsgEn}
                          onChange={e => setAnnouncementMsgEn(e.target.value)}
                          required
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                        <textarea
                          rows={3}
                          placeholder="የመልዕክት ዝርዝር (አማርኛ)..."
                          value={announcementMsgAm}
                          onChange={e => setAnnouncementMsgAm(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                        <textarea
                          rows={3}
                          placeholder="نص الإشعار (العربية)..."
                          value={announcementMsgAr}
                          onChange={e => setAnnouncementMsgAr(e.target.value)}
                          className="w-full px-3 py-2 bg-white border border-stone-300 rounded"
                        />
                      </div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow flex items-center gap-2 active:scale-[0.98]"
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Broadcast Now</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* TAB 8: HOTEL INFO SETTINGS */}
              {activeTab === 'settings' && (
                <div className="space-y-5 max-w-xl">
                  <div>
                    <h4 className="font-serif-luxury text-2xl font-bold text-stone-900">
                      Hotel Contact Settings
                    </h4>
                    <p className="text-xs text-stone-500">
                      Update official telephone numbers, WhatsApp channel, and email contact info.
                    </p>
                  </div>

                  {settingsSaved && (
                    <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-800 flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600" />
                      <span>Hotel information saved successfully!</span>
                    </div>
                  )}

                  <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Primary Phone</label>
                      <input
                        type="text"
                        value={phoneState}
                        onChange={e => setPhoneState(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">WhatsApp Number (with country code)</label>
                      <input
                        type="text"
                        value={whatsappState}
                        onChange={e => setWhatsappState(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                      />
                    </div>

                    <div>
                      <label className="block text-stone-700 font-semibold mb-1">Official Reservations Email</label>
                      <input
                        type="email"
                        value={emailState}
                        onChange={e => setEmailState(e.target.value)}
                        className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                      />
                    </div>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#0F2D24] text-amber-300 font-semibold rounded shadow"
                    >
                      Save Settings
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
