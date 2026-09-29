import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import {
  X,
  Bell,
  CheckCheck,
  Trash2,
  Calendar,
  Sparkles,
  MessageSquare,
  Mail,
  ChevronRight,
} from 'lucide-react';

export const NotificationsDrawer: React.FC = () => {
  const {
    notificationsDrawerOpen,
    setNotificationsDrawerOpen,
    notifications,
    markNotificationRead,
    markAllNotificationsRead,
    deleteNotification,
    t,
    getLoc,
    direction,
    openEmailPreview,
    bookings,
  } = useHotel();

  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  if (!notificationsDrawerOpen) return null;

  const displayList = filter === 'unread'
    ? notifications.filter(n => !n.read)
    : notifications;

  const getIcon = (type: string) => {
    switch (type) {
      case 'booking':
        return <Calendar className="w-4 h-4 text-emerald-600" />;
      case 'offer':
        return <Sparkles className="w-4 h-4 text-amber-600" />;
      case 'inquiry':
        return <MessageSquare className="w-4 h-4 text-sky-600" />;
      default:
        return <Bell className="w-4 h-4 text-[#0F2D24]" />;
    }
  };

  const handleOpenEmailForBooking = (bookingRef?: string) => {
    if (!bookingRef) return;
    const bk = bookings.find(b => b.bookingReference === bookingRef);
    if (bk) {
      openEmailPreview({
        type: 'guest_confirmation',
        recipientName: bk.guestName,
        recipientEmail: bk.guestEmail,
        booking: bk,
      });
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="absolute inset-0" onClick={() => setNotificationsDrawerOpen(false)} />

      <div
        className={`absolute inset-y-0 ${
          direction === 'rtl' ? 'left-0' : 'right-0'
        } max-w-full flex`}
      >
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-s border-stone-200">
          {/* Drawer Header */}
          <div className="p-5 bg-[#0F2D24] text-white flex items-center justify-between border-b border-[#1C4E3F]">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                <Bell className="w-4 h-4 text-amber-300" />
              </div>
              <div>
                <h3 className="font-serif-luxury text-lg font-bold">
                  {t.notifications.title}
                </h3>
                <span className="text-[11px] text-emerald-300/80 font-sans">
                  {notifications.filter(n => !n.read).length} unread updates
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setNotificationsDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/10 text-stone-300 hover:text-white transition-colors"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Filter Bar & Mark All Read */}
          <div className="px-5 py-3 bg-[#F9F8F5] border-b border-stone-200 flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filter === 'all'
                    ? 'bg-[#0F2D24] text-amber-300 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.notifications.all} ({notifications.length})
              </button>
              <button
                type="button"
                onClick={() => setFilter('unread')}
                className={`px-3 py-1.5 rounded-md font-medium transition-colors ${
                  filter === 'unread'
                    ? 'bg-[#0F2D24] text-amber-300 font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {t.notifications.unreadOnly} ({notifications.filter(n => !n.read).length})
              </button>
            </div>

            <button
              type="button"
              onClick={markAllNotificationsRead}
              className="text-[#0F2D24] hover:text-[#163E32] font-semibold flex items-center gap-1 text-[11px] hover:underline"
            >
              <CheckCheck className="w-3.5 h-3.5" />
              <span>{t.notifications.markAllRead}</span>
            </button>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3 font-sans">
            {displayList.length === 0 ? (
              <div className="py-16 text-center text-stone-400">
                <Bell className="w-10 h-10 mx-auto mb-2 opacity-30" />
                <p className="text-xs">{t.notifications.empty}</p>
              </div>
            ) : (
              displayList.map(notif => (
                <div
                  key={notif.id}
                  onClick={() => markNotificationRead(notif.id)}
                  className={`p-4 rounded-xl border transition-all cursor-pointer relative ${
                    notif.read
                      ? 'bg-white border-stone-200/80 text-stone-600 opacity-90'
                      : 'bg-emerald-50/40 border-[#0F2D24]/30 text-stone-900 shadow-sm'
                  }`}
                >
                  {!notif.read && (
                    <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-amber-500" />
                  )}

                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg bg-stone-100 flex items-center justify-center shrink-0 mt-0.5">
                      {getIcon(notif.type)}
                    </div>

                    <div className="flex-1 pr-3">
                      <div className="flex items-center justify-between">
                        <h4 className="font-serif-luxury font-bold text-sm text-stone-900">
                          {getLoc(notif.title)}
                        </h4>
                      </div>

                      <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                        {getLoc(notif.message)}
                      </p>

                      <div className="flex items-center justify-between mt-3 pt-2 border-t border-stone-100 text-[11px] text-stone-400">
                        <span>{notif.date}</span>

                        <div className="flex items-center gap-2">
                          {notif.bookingReference && (
                            <button
                              type="button"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleOpenEmailForBooking(notif.bookingReference);
                              }}
                              className="text-emerald-700 hover:text-emerald-900 font-medium flex items-center gap-1 hover:underline"
                            >
                              <Mail className="w-3 h-3" />
                              <span>View Email</span>
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteNotification(notif.id);
                            }}
                            className="text-stone-400 hover:text-rose-600 p-1"
                            title="Delete notification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
