import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Language,
  MultilingualText,
  Room,
  Booking,
  SpecialOffer,
  DiningItem,
  Facility,
  GalleryItem,
  Testimonial,
  AppNotification,
  HotelInfo,
} from '../types';
import {
  INITIAL_ROOMS,
  INITIAL_OFFERS,
  INITIAL_DINING_ITEMS,
  INITIAL_FACILITIES,
  INITIAL_GALLERY,
  INITIAL_TESTIMONIALS,
  INITIAL_NOTIFICATIONS,
  INITIAL_HOTEL_INFO,
  INITIAL_BOOKINGS,
} from '../data/initialData';
import { translations, getLocalizedText } from '../data/translations';

interface EmailPreviewData {
  isOpen: boolean;
  type: 'guest_confirmation' | 'guest_cancellation' | 'admin_alert' | 'contact_inquiry';
  recipientName: string;
  recipientEmail: string;
  booking?: Booking;
  inquiry?: { name: string; email: string; phone: string; message: string; subject: string };
}

interface HotelContextType {
  // Language & Direction
  language: Language;
  direction: 'ltr' | 'rtl';
  setLanguage: (lang: Language) => void;
  t: typeof translations.en;
  getLoc: (item: { en: string; am: string; ar: string } | undefined) => string;

  // Rooms
  rooms: Room[];
  addRoom: (room: Room) => void;
  updateRoom: (room: Room) => void;
  deleteRoom: (id: string) => void;
  addRoomImages: (roomId: string, newImages: Array<{ url: string; title?: MultilingualText; caption?: MultilingualText }>) => void;
  updateRoomImage: (roomId: string, imageId: string, updates: { title?: MultilingualText; caption?: MultilingualText; isMain?: boolean }) => void;
  replaceRoomImage: (roomId: string, imageId: string, newUrl: string) => void;
  deleteRoomImage: (roomId: string, imageId: string) => { success: boolean; error?: string };
  setRoomMainImage: (roomId: string, imageId: string) => void;
  reorderRoomImages: (roomId: string, fromIndex: number, toIndex: number) => void;

  // Bookings
  bookings: Booking[];
  createBooking: (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status'>) => { success: boolean; booking?: Booking; error?: string };
  updateBookingStatus: (id: string, status: Booking['status']) => void;
  deleteBooking: (id: string) => void;
  isRoomAvailable: (roomId: string, checkIn: string, checkOut: string, ignoreBookingId?: string) => boolean;

  // Offers
  offers: SpecialOffer[];
  addOffer: (offer: SpecialOffer) => void;
  updateOffer: (offer: SpecialOffer) => void;
  deleteOffer: (id: string) => void;

  // Dining
  diningItems: DiningItem[];
  addDiningItem: (item: DiningItem) => void;
  updateDiningItem: (item: DiningItem) => void;
  deleteDiningItem: (id: string) => void;

  // Facilities
  facilities: Facility[];
  addFacility: (facility: Facility) => void;
  updateFacility: (facility: Facility) => void;
  deleteFacility: (id: string) => void;

  // Gallery
  gallery: GalleryItem[];
  addGalleryItem: (item: GalleryItem) => void;
  addMultipleGalleryItems: (items: GalleryItem[]) => void;
  updateGalleryItem: (item: GalleryItem) => void;
  replaceGalleryItem: (id: string, newUrl: string) => void;
  deleteGalleryItem: (id: string) => void;
  reorderGalleryItems: (fromIndex: number, toIndex: number) => void;

  // Testimonials
  testimonials: Testimonial[];
  addTestimonial: (item: Testimonial) => void;
  updateTestimonial: (item: Testimonial) => void;
  deleteTestimonial: (id: string) => void;

  // Notifications
  notifications: AppNotification[];
  unreadNotificationCount: number;
  addNotification: (notification: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  deleteNotification: (id: string) => void;
  notificationsDrawerOpen: boolean;
  setNotificationsDrawerOpen: (open: boolean) => void;

  // Hotel Info
  hotelInfo: HotelInfo;
  updateHotelInfo: (info: HotelInfo) => void;

  // Booking Modal State
  bookingModalOpen: boolean;
  selectedRoomForBooking: Room | null;
  initialCheckIn: string;
  initialCheckOut: string;
  initialGuests: number;
  openBookingModal: (room?: Room, checkIn?: string, checkOut?: string, guests?: number) => void;
  closeBookingModal: () => void;

  // Room Details Modal
  detailsModalRoom: Room | null;
  openRoomDetails: (room: Room) => void;
  closeRoomDetails: () => void;

  // Email Preview Modal
  emailPreview: EmailPreviewData;
  openEmailPreview: (data: Omit<EmailPreviewData, 'isOpen'>) => void;
  closeEmailPreview: () => void;

  // Terms & Privacy Modal
  termsModalOpen: boolean;
  termsModalType: 'terms' | 'privacy';
  openTermsModal: (type: 'terms' | 'privacy') => void;
  closeTermsModal: () => void;

  // Admin Authentication
  isAdminLoggedIn: boolean;
  loginAdmin: (passcode: string) => boolean;
  logoutAdmin: () => void;
  adminModalOpen: boolean;
  setAdminModalOpen: (open: boolean) => void;
}

const HotelContext = createContext<HotelContextType | undefined>(undefined);

export const HotelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Multilingual state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('plg_language') as Language;
    return saved && ['en', 'am', 'ar'].includes(saved) ? saved : 'en';
  });

  const direction: 'ltr' | 'rtl' = language === 'ar' ? 'rtl' : 'ltr';

  useEffect(() => {
    localStorage.setItem('plg_language', language);
    document.documentElement.lang = language;
    document.documentElement.dir = direction;
    if (language === 'ar') {
      document.body.classList.add('font-arabic');
      document.body.classList.remove('font-amharic');
    } else if (language === 'am') {
      document.body.classList.add('font-amharic');
      document.body.classList.remove('font-arabic');
    } else {
      document.body.classList.remove('font-arabic', 'font-amharic');
    }
  }, [language, direction]);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
  };

  const t = translations[language] || translations.en;
  const getLoc = (item: { en: string; am: string; ar: string } | undefined) => getLocalizedText(item, language);

  // Storage helper
  const loadState = <T,>(key: string, fallback: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : fallback;
    } catch {
      return fallback;
    }
  };

  // Entities
  const [rooms, setRooms] = useState<Room[]>(() => {
    const loaded = loadState<Room[]>('plg_rooms', INITIAL_ROOMS);
    return loaded.map(r => {
      if (r.images && r.images.length > 0) return r;
      return {
        ...r,
        images: [
          {
            id: `img-${r.id}-1`,
            url: r.imageUrl,
            title: r.name,
            caption: { en: 'Primary room photograph', am: 'ዋና የክፍል ፎቶ', ar: 'الصورة الرئيسية للغرفة' },
            isMain: true,
            order: 0,
            uploadDate: '2026-09-25',
          },
        ],
      };
    });
  });
  const [bookings, setBookings] = useState<Booking[]>(() => loadState('plg_bookings', INITIAL_BOOKINGS));
  const [offers, setOffers] = useState<SpecialOffer[]>(() => loadState('plg_offers', INITIAL_OFFERS));
  const [diningItems, setDiningItems] = useState<DiningItem[]>(() => loadState('plg_dining', INITIAL_DINING_ITEMS));
  const [facilities, setFacilities] = useState<Facility[]>(() => loadState('plg_facilities', INITIAL_FACILITIES));
  const [gallery, setGallery] = useState<GalleryItem[]>(() => loadState('plg_gallery', INITIAL_GALLERY));
  const [testimonials, setTestimonials] = useState<Testimonial[]>(() => loadState('plg_testimonials', INITIAL_TESTIMONIALS));
  const [notifications, setNotifications] = useState<AppNotification[]>(() => loadState('plg_notifications', INITIAL_NOTIFICATIONS));
  const [hotelInfo, setHotelInfo] = useState<HotelInfo>(() => loadState('plg_hotel_info', INITIAL_HOTEL_INFO));

  // Sync to local storage
  useEffect(() => { localStorage.setItem('plg_rooms', JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem('plg_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('plg_offers', JSON.stringify(offers)); }, [offers]);
  useEffect(() => { localStorage.setItem('plg_dining', JSON.stringify(diningItems)); }, [diningItems]);
  useEffect(() => { localStorage.setItem('plg_facilities', JSON.stringify(facilities)); }, [facilities]);
  useEffect(() => { localStorage.setItem('plg_gallery', JSON.stringify(gallery)); }, [gallery]);
  useEffect(() => { localStorage.setItem('plg_testimonials', JSON.stringify(testimonials)); }, [testimonials]);
  useEffect(() => { localStorage.setItem('plg_notifications', JSON.stringify(notifications)); }, [notifications]);
  useEffect(() => { localStorage.setItem('plg_hotel_info', JSON.stringify(hotelInfo)); }, [hotelInfo]);

  // Modals & Panels state
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const [selectedRoomForBooking, setSelectedRoomForBooking] = useState<Room | null>(null);
  const [initialCheckIn, setInitialCheckIn] = useState('');
  const [initialCheckOut, setInitialCheckOut] = useState('');
  const [initialGuests, setInitialGuests] = useState(2);

  const [detailsModalRoom, setDetailsModalRoom] = useState<Room | null>(null);
  const [notificationsDrawerOpen, setNotificationsDrawerOpen] = useState(false);

  const [emailPreview, setEmailPreview] = useState<EmailPreviewData>({
    isOpen: false,
    type: 'guest_confirmation',
    recipientName: '',
    recipientEmail: '',
  });

  const [termsModalOpen, setTermsModalOpen] = useState(false);
  const [termsModalType, setTermsModalType] = useState<'terms' | 'privacy'>('terms');

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    return localStorage.getItem('plg_admin_auth') === 'true';
  });
  const [adminModalOpen, setAdminModalOpen] = useState(false);

  // Room helpers
  const addRoom = (room: Room) => setRooms(prev => [room, ...prev]);
  const updateRoom = (updated: Room) => setRooms(prev => prev.map(r => r.id === updated.id ? updated : r));
  const deleteRoom = (id: string) => setRooms(prev => prev.filter(r => r.id !== id));

  const addRoomImages = (roomId: string, newImages: Array<{ url: string; title?: MultilingualText; caption?: MultilingualText }>) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const existing = r.images || [];
      const hasMain = existing.some(img => img.isMain);
      const createdImages = newImages.map((img, idx) => ({
        id: `img-${roomId}-${Date.now()}-${idx}`,
        url: img.url,
        title: img.title || r.name,
        caption: img.caption || { en: 'Room picture', am: 'የክፍል ፎቶ', ar: 'صورة الغرفة' },
        isMain: !hasMain && idx === 0,
        order: existing.length + idx,
        uploadDate: new Date().toISOString().split('T')[0],
      }));
      const updatedImages = [...existing, ...createdImages];
      const mainImage = updatedImages.find(img => img.isMain) || updatedImages[0];
      return {
        ...r,
        images: updatedImages,
        imageUrl: mainImage ? mainImage.url : r.imageUrl,
      };
    }));
  };

  const updateRoomImage = (roomId: string, imageId: string, updates: { title?: MultilingualText; caption?: MultilingualText; isMain?: boolean }) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const newImages = (r.images || []).map(img => {
        if (img.id === imageId) {
          return {
            ...img,
            ...(updates.title ? { title: updates.title } : {}),
            ...(updates.caption ? { caption: updates.caption } : {}),
            ...(updates.isMain !== undefined ? { isMain: updates.isMain } : {}),
          };
        }
        if (updates.isMain) {
          return { ...img, isMain: false };
        }
        return img;
      });
      const mainImg = newImages.find(img => img.isMain) || newImages[0];
      return {
        ...r,
        images: newImages,
        imageUrl: mainImg ? mainImg.url : r.imageUrl,
      };
    }));
  };

  const replaceRoomImage = (roomId: string, imageId: string, newUrl: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      let isTargetMain = false;
      const updatedImages = (r.images || []).map(img => {
        if (img.id === imageId) {
          if (img.isMain) isTargetMain = true;
          return { ...img, url: newUrl };
        }
        return img;
      });
      return {
        ...r,
        images: updatedImages,
        imageUrl: isTargetMain ? newUrl : r.imageUrl,
      };
    }));
  };

  const setRoomMainImage = (roomId: string, imageId: string) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      let newMainUrl = r.imageUrl;
      const updatedImages = (r.images || []).map(img => {
        const isMain = img.id === imageId;
        if (isMain) newMainUrl = img.url;
        return { ...img, isMain };
      });
      return {
        ...r,
        images: updatedImages,
        imageUrl: newMainUrl,
      };
    }));
  };

  const deleteRoomImage = (roomId: string, imageId: string): { success: boolean; error?: string } => {
    const targetRoom = rooms.find(r => r.id === roomId);
    if (!targetRoom) return { success: false, error: 'Room not found.' };
    const images = targetRoom.images || [];
    const targetImage = images.find(img => img.id === imageId);
    if (!targetImage) return { success: false, error: 'Image not found.' };

    if (images.length <= 1) {
      return { success: false, error: 'Cannot delete the only picture of the room. Please upload another picture before deleting this one.' };
    }

    if (targetImage.isMain) {
      return {
        success: false,
        error: 'This picture is currently designated as the Main Picture. Please select another picture as the Main Picture before deleting this one.',
      };
    }

    const filtered = images.filter(img => img.id !== imageId);
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const mainImg = filtered.find(i => i.isMain) || filtered[0];
      return {
        ...r,
        images: filtered,
        imageUrl: mainImg ? mainImg.url : r.imageUrl,
      };
    }));

    return { success: true };
  };

  const reorderRoomImages = (roomId: string, fromIndex: number, toIndex: number) => {
    setRooms(prev => prev.map(r => {
      if (r.id !== roomId) return r;
      const list = [...(r.images || [])];
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return r;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      const reindexed = list.map((img, i) => ({ ...img, order: i }));
      return {
        ...r,
        images: reindexed,
      };
    }));
  };

  // Date overlapping validation to prevent double booking
  const isRoomAvailable = (roomId: string, checkIn: string, checkOut: string, ignoreBookingId?: string): boolean => {
    if (!checkIn || !checkOut) return true;
    const reqIn = new Date(checkIn).getTime();
    const reqOut = new Date(checkOut).getTime();
    if (isNaN(reqIn) || isNaN(reqOut) || reqOut <= reqIn) return false;

    const room = rooms.find(r => r.id === roomId);
    if (!room || !room.isAvailable) return false;

    // Overlapping bookings for this room that are confirmed or pending
    const overlapping = bookings.filter(b => {
      if (b.id === ignoreBookingId) return false;
      if (b.roomId !== roomId) return false;
      if (b.status === 'cancelled') return false;

      const bIn = new Date(b.checkInDate).getTime();
      const bOut = new Date(b.checkOutDate).getTime();

      // [reqIn, reqOut] overlaps [bIn, bOut] if reqIn < bOut and reqOut > bIn
      return reqIn < bOut && reqOut > bIn;
    });

    // Check against total available rooms of this category
    return overlapping.length < (room.availableRoomsCount || 1);
  };

  // Booking CRUD
  const createBooking = (bookingData: Omit<Booking, 'id' | 'bookingReference' | 'createdAt' | 'status'>) => {
    if (!isRoomAvailable(bookingData.roomId, bookingData.checkInDate, bookingData.checkOutDate)) {
      return {
        success: false,
        error: t.booking.alreadyBooked,
      };
    }

    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const bookingReference = `PLG-${new Date().getFullYear()}-${randomNum}`;
    const newBooking: Booking = {
      ...bookingData,
      id: `bk-${Date.now()}`,
      bookingReference,
      status: 'confirmed',
      createdAt: new Date().toISOString(),
    };

    setBookings(prev => [newBooking, ...prev]);

    // Dispatch guest notification
    const guestNotif: AppNotification = {
      id: `notif-bk-${Date.now()}`,
      title: {
        en: `Booking Confirmed: ${bookingReference}`,
        am: `ቦታ ማስያዝ ተረጋግጧል፡ ${bookingReference}`,
        ar: `تم تأكيد الحجز: ${bookingReference}`,
      },
      message: {
        en: `Your reservation for ${bookingData.roomName} from ${bookingData.checkInDate} to ${bookingData.checkOutDate} is confirmed. Total: ${bookingData.totalAmountETB.toLocaleString()} ETB.`,
        am: `የ${bookingData.roomName} ክፍል ከ${bookingData.checkInDate} እስከ ${bookingData.checkOutDate} ማስያዝዎ ተረጋግጧል። ጠቅላላ፡ ${bookingData.totalAmountETB.toLocaleString()} ብር።`,
        ar: `تم تأكيد حجزك لـ ${bookingData.roomName} من ${bookingData.checkInDate} إلى ${bookingData.checkOutDate}. الإجمالي: ${bookingData.totalAmountETB.toLocaleString()} بر إثيوبي.`,
      },
      date: 'Just now',
      read: false,
      targetAudience: 'guest',
      targetGuestEmail: bookingData.guestEmail,
      bookingReference,
      type: 'booking',
      createdAt: new Date().toISOString(),
    };

    // Dispatch admin notification
    const adminNotif: AppNotification = {
      id: `notif-admin-${Date.now()}`,
      title: {
        en: `New Reservation: ${bookingData.guestName}`,
        am: `አዲስ ቦታ ማስያዝ፡ ${bookingData.guestName}`,
        ar: `حجز جديد من النزيل: ${bookingData.guestName}`,
      },
      message: {
        en: `${bookingData.guestName} reserved ${bookingData.roomName} (${bookingData.checkInDate} to ${bookingData.checkOutDate}) for ${bookingData.totalAmountETB.toLocaleString()} ETB. Ref: ${bookingReference}`,
        am: `${bookingData.guestName} ${bookingData.roomName} ክፍል ከ${bookingData.checkInDate} እስከ ${bookingData.checkOutDate} አስይዘዋል (${bookingData.totalAmountETB.toLocaleString()} ብር)። ኮድ፡ ${bookingReference}`,
        ar: `حجز النزيل ${bookingData.guestName} غرفة ${bookingData.roomName} (${bookingData.checkInDate} إلى ${bookingData.checkOutDate}) بقيمة ${bookingData.totalAmountETB.toLocaleString()} بر إثيوبي. المرجع: ${bookingReference}`,
      },
      date: 'Just now',
      read: false,
      targetAudience: 'admin',
      bookingReference,
      type: 'booking',
      createdAt: new Date().toISOString(),
    };

    setNotifications(prev => [guestNotif, adminNotif, ...prev]);

    return {
      success: true,
      booking: newBooking,
    };
  };

  const updateBookingStatus = (id: string, status: Booking['status']) => {
    setBookings(prev => prev.map(b => {
      if (b.id === id) {
        // Trigger status change notification
        const statusNotif: AppNotification = {
          id: `notif-stat-${Date.now()}`,
          title: {
            en: `Booking Status Updated: ${b.bookingReference}`,
            am: `የቦታ ማስያዣ ሁኔታ ተቀይሯል፡ ${b.bookingReference}`,
            ar: `تحديث حالة الحجز: ${b.bookingReference}`,
          },
          message: {
            en: `Your booking for ${b.roomName} is now marked as "${status.toUpperCase()}".`,
            am: `የ${b.roomName} ክፍል ማስያዝዎ ወደ "${status}" ተቀይሯል።`,
            ar: `تم تحديث حالة حجزك للغرفة ${b.roomName} إلى "${status}".`,
          },
          date: 'Just now',
          read: false,
          targetAudience: 'all',
          bookingReference: b.bookingReference,
          type: 'booking',
          createdAt: new Date().toISOString(),
        };
        setNotifications(n => [statusNotif, ...n]);
        return { ...b, status };
      }
      return b;
    }));
  };

  const deleteBooking = (id: string) => {
    setBookings(prev => prev.filter(b => b.id !== id));
  };

  // Offers
  const addOffer = (offer: SpecialOffer) => setOffers(prev => [offer, ...prev]);
  const updateOffer = (offer: SpecialOffer) => setOffers(prev => prev.map(o => o.id === offer.id ? offer : o));
  const deleteOffer = (id: string) => setOffers(prev => prev.filter(o => o.id !== id));

  // Dining
  const addDiningItem = (item: DiningItem) => setDiningItems(prev => [item, ...prev]);
  const updateDiningItem = (item: DiningItem) => setDiningItems(prev => prev.map(d => d.id === item.id ? item : d));
  const deleteDiningItem = (id: string) => setDiningItems(prev => prev.filter(d => d.id !== id));

  // Facilities
  const addFacility = (facility: Facility) => setFacilities(prev => [...prev, facility]);
  const updateFacility = (facility: Facility) => setFacilities(prev => prev.map(f => f.id === facility.id ? facility : f));
  const deleteFacility = (id: string) => setFacilities(prev => prev.filter(f => f.id !== id));

  // Gallery
  const addGalleryItem = (item: GalleryItem) => setGallery(prev => [item, ...prev]);
  const addMultipleGalleryItems = (items: GalleryItem[]) => setGallery(prev => [...items, ...prev]);
  const updateGalleryItem = (updated: GalleryItem) => setGallery(prev => prev.map(g => g.id === updated.id ? updated : g));
  const replaceGalleryItem = (id: string, newUrl: string) => {
    setGallery(prev => prev.map(g => g.id === id ? { ...g, imageUrl: newUrl } : g));
  };
  const deleteGalleryItem = (id: string) => setGallery(prev => prev.filter(g => g.id !== id));
  const reorderGalleryItems = (fromIndex: number, toIndex: number) => {
    setGallery(prev => {
      const list = [...prev];
      if (fromIndex < 0 || fromIndex >= list.length || toIndex < 0 || toIndex >= list.length) return prev;
      const [moved] = list.splice(fromIndex, 1);
      list.splice(toIndex, 0, moved);
      return list.map((item, i) => ({ ...item, order: i }));
    });
  };

  // Testimonials
  const addTestimonial = (item: Testimonial) => setTestimonials(prev => [item, ...prev]);
  const updateTestimonial = (item: Testimonial) => setTestimonials(prev => prev.map(t => t.id === item.id ? item : t));
  const deleteTestimonial = (id: string) => setTestimonials(prev => prev.filter(t => t.id !== id));

  // Notifications
  const addNotification = (notif: Omit<AppNotification, 'id' | 'createdAt' | 'read'>) => {
    const fullNotif: AppNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      read: false,
      createdAt: new Date().toISOString(),
    };
    setNotifications(prev => [fullNotif, ...prev]);
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
  };

  const deleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const unreadNotificationCount = notifications.filter(n => !n.read).length;

  // Hotel Info
  const updateHotelInfo = (info: HotelInfo) => setHotelInfo(info);

  // Booking Modal handlers
  const openBookingModal = (room?: Room, checkIn?: string, checkOut?: string, guests?: number) => {
    if (room) setSelectedRoomForBooking(room);
    if (checkIn) setInitialCheckIn(checkIn);
    if (checkOut) setInitialCheckOut(checkOut);
    if (guests) setInitialGuests(guests);
    setBookingModalOpen(true);
  };

  const closeBookingModal = () => {
    setBookingModalOpen(false);
  };

  // Details Modal
  const openRoomDetails = (room: Room) => setDetailsModalRoom(room);
  const closeRoomDetails = () => setDetailsModalRoom(null);

  // Email Preview
  const openEmailPreview = (data: Omit<EmailPreviewData, 'isOpen'>) => {
    setEmailPreview({
      ...data,
      isOpen: true,
    });
  };

  const closeEmailPreview = () => {
    setEmailPreview(prev => ({ ...prev, isOpen: false }));
  };

  // Terms & Privacy
  const openTermsModal = (type: 'terms' | 'privacy') => {
    setTermsModalType(type);
    setTermsModalOpen(true);
  };

  const closeTermsModal = () => setTermsModalOpen(false);

  // Admin Auth
  const loginAdmin = (passcode: string): boolean => {
    // Default passcode is planet2026 or admin
    if (passcode.trim() === 'planet2026' || passcode.trim() === 'admin') {
      setIsAdminLoggedIn(true);
      localStorage.setItem('plg_admin_auth', 'true');
      return true;
    }
    return false;
  };

  const logoutAdmin = () => {
    setIsAdminLoggedIn(false);
    localStorage.removeItem('plg_admin_auth');
  };

  return (
    <HotelContext.Provider
      value={{
        language,
        direction,
        setLanguage,
        t,
        getLoc,
        rooms,
        addRoom,
        updateRoom,
        deleteRoom,
        addRoomImages,
        updateRoomImage,
        replaceRoomImage,
        deleteRoomImage,
        setRoomMainImage,
        reorderRoomImages,
        bookings,
        createBooking,
        updateBookingStatus,
        deleteBooking,
        isRoomAvailable,
        offers,
        addOffer,
        updateOffer,
        deleteOffer,
        diningItems,
        addDiningItem,
        updateDiningItem,
        deleteDiningItem,
        facilities,
        addFacility,
        updateFacility,
        deleteFacility,
        gallery,
        addGalleryItem,
        addMultipleGalleryItems,
        updateGalleryItem,
        replaceGalleryItem,
        deleteGalleryItem,
        reorderGalleryItems,
        testimonials,
        addTestimonial,
        updateTestimonial,
        deleteTestimonial,
        notifications,
        unreadNotificationCount,
        addNotification,
        markNotificationRead,
        markAllNotificationsRead,
        deleteNotification,
        notificationsDrawerOpen,
        setNotificationsDrawerOpen,
        hotelInfo,
        updateHotelInfo,
        bookingModalOpen,
        selectedRoomForBooking,
        initialCheckIn,
        initialCheckOut,
        initialGuests,
        openBookingModal,
        closeBookingModal,
        detailsModalRoom,
        openRoomDetails,
        closeRoomDetails,
        emailPreview,
        openEmailPreview,
        closeEmailPreview,
        termsModalOpen,
        termsModalType,
        openTermsModal,
        closeTermsModal,
        isAdminLoggedIn,
        loginAdmin,
        logoutAdmin,
        adminModalOpen,
        setAdminModalOpen,
      }}
    >
      {children}
    </HotelContext.Provider>
  );
};

export const useHotel = () => {
  const context = useContext(HotelContext);
  if (!context) {
    throw new Error('useHotel must be used within a HotelProvider');
  }
  return context;
};
