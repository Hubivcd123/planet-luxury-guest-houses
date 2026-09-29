export type Language = 'en' | 'am' | 'ar';

export interface MultilingualText {
  en: string;
  am: string;
  ar: string;
}

export interface RoomImage {
  id: string;
  url: string;
  title?: MultilingualText;
  caption?: MultilingualText;
  isMain: boolean;
  order: number;
  uploadDate: string;
}

export interface Room {
  id: string;
  name: MultilingualText;
  category: 'standard' | 'deluxe' | 'executive' | 'family' | 'suite';
  description: MultilingualText;
  pricePerNightETB: number;
  capacityAdults: number;
  capacityChildren: number;
  bedType: MultilingualText;
  roomSizeM2: number;
  amenities: string[];
  imageUrl: string; // The primary / main image URL
  images?: RoomImage[]; // Multiple pictures per room
  availableRoomsCount: number;
  isAvailable: boolean;
  featured?: boolean;
}

export interface Booking {
  id: string;
  bookingReference: string;
  roomId: string;
  roomName: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkInDate: string; // YYYY-MM-DD
  checkOutDate: string; // YYYY-MM-DD
  adults: number;
  children: number;
  totalNights: number;
  pricePerNightETB: number;
  totalAmountETB: number;
  specialRequests?: string;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed';
  createdAt: string;
  language: Language;
}

export interface SpecialOffer {
  id: string;
  title: MultilingualText;
  subtitle: MultilingualText;
  description: MultilingualText;
  discountPercentage: number;
  validUntil: string;
  code: string;
  imageUrl: string;
  terms: MultilingualText;
  active: boolean;
}

export interface DiningItem {
  id: string;
  name: MultilingualText;
  category: 'ethiopian' | 'international' | 'breakfast' | 'dinner' | 'beverages';
  description: MultilingualText;
  priceETB: number;
  dietary?: string[];
  imageUrl: string;
}

export interface Facility {
  id: string;
  name: MultilingualText;
  description: MultilingualText;
  iconName: string;
}

export type GalleryCategory =
  | 'all'
  | 'exterior'
  | 'rooms'
  | 'suites'
  | 'reception'
  | 'restaurant'
  | 'dining'
  | 'facilities'
  | 'events'
  | 'outdoor'
  | 'other';

export interface GalleryItem {
  id: string;
  title: MultilingualText;
  description?: MultilingualText;
  category: GalleryCategory;
  imageUrl: string;
  featured?: boolean;
  order?: number;
  uploadDate?: string;
}

export interface Testimonial {
  id: string;
  author: string;
  role: MultilingualText;
  location: MultilingualText;
  quote: MultilingualText;
  rating: number;
  avatarUrl?: string;
  isPublished: boolean;
  date: string;
}

export interface AppNotification {
  id: string;
  title: MultilingualText;
  message: MultilingualText;
  date: string;
  read: boolean;
  targetAudience: 'all' | 'guest' | 'admin';
  targetGuestEmail?: string;
  bookingReference?: string;
  type: 'booking' | 'system' | 'offer' | 'inquiry';
  createdAt: string;
}

export interface HotelInfo {
  name: MultilingualText;
  tagline: MultilingualText;
  address: MultilingualText;
  phone: string;
  secondaryPhone: string;
  whatsappNumber: string;
  email: string;
  receptionHours: MultilingualText;
  checkInTime: string;
  checkOutTime: string;
  googleMapsEmbedUrl: string;
  googleMapsDirectionsUrl: string;
}
