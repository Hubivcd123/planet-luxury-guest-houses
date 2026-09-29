import React, { useState } from 'react';
import { useHotel } from '../context/HotelContext';
import { GalleryItem } from '../types';
import { X, ChevronLeft, ChevronRight, Eye } from 'lucide-react';

export const GallerySection: React.FC = () => {
  const { gallery, t, getLoc } = useHotel();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const categories = [
    { id: 'all', label: t.gallery.all },
    { id: 'exterior', label: t.gallery.exterior },
    { id: 'rooms', label: t.gallery.rooms },
    { id: 'suites', label: 'Suites' },
    { id: 'reception', label: 'Reception' },
    { id: 'restaurant', label: t.gallery.restaurant },
    { id: 'dining', label: 'Dining & Lounge' },
    { id: 'facilities', label: t.gallery.facilities },
    { id: 'outdoor', label: 'Outdoor Courtyard' },
  ];

  const filteredItems = activeCategory === 'all'
    ? gallery
    : gallery.filter(item => item.category === activeCategory);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
  };

  const showNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex + 1) % filteredItems.length);
    }
  };

  const showPrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (lightboxIndex !== null) {
      setLightboxIndex((lightboxIndex - 1 + filteredItems.length) % filteredItems.length);
    }
  };

  return (
    <section id="gallery" className="py-20 sm:py-28 bg-[#FBFBFA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs uppercase tracking-widest text-[#0F2D24] font-semibold mb-2 block font-sans">
            Visual Tour
          </span>
          <h2 className="font-serif-luxury text-3xl sm:text-4xl md:text-5xl font-bold text-stone-900 tracking-tight mb-4 text-balance">
            {t.gallery.sectionTitle}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 font-light leading-relaxed font-sans text-balance">
            {t.gallery.sectionSubtitle}
          </p>

          {/* Filter Bar */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 text-xs font-medium rounded-lg transition-all cursor-pointer ${
                  activeCategory === cat.id
                    ? 'bg-[#0F2D24] text-amber-300 shadow font-semibold'
                    : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item, idx) => (
            <div
              key={item.id}
              onClick={() => openLightbox(idx)}
              className="group relative h-72 rounded-2xl overflow-hidden cursor-pointer shadow-sm hover:shadow-xl transition-all duration-300 bg-stone-900"
            >
              <img
                src={item.imageUrl}
                alt={getLoc(item.title)}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center group-hover:scale-108 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-70 group-hover:opacity-90 transition-opacity" />

              <div className="absolute inset-0 p-5 flex flex-col justify-end text-white">
                <span className="text-[10px] uppercase tracking-widest text-amber-300 font-medium">
                  {item.category}
                </span>
                <h4 className="font-serif-luxury text-lg font-bold mt-1 text-white">
                  {getLoc(item.title)}
                </h4>
              </div>

              <div className="absolute top-4 right-4 p-2 rounded-full bg-white/20 backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity text-white">
                <Eye className="w-4 h-4" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox Modal */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div
          className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex items-center justify-center p-4"
          onClick={closeLightbox}
        >
          <button
            type="button"
            onClick={closeLightbox}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Close Lightbox"
          >
            <X className="w-6 h-6" />
          </button>

          {/* Prev */}
          <button
            type="button"
            onClick={showPrev}
            className="absolute left-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>

          {/* Current Image */}
          <div
            className="max-w-4xl max-h-[85vh] flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <img
              src={filteredItems[lightboxIndex].imageUrl}
              alt={getLoc(filteredItems[lightboxIndex].title)}
              referrerPolicy="no-referrer"
              className="max-w-full max-h-[75vh] object-contain rounded-lg shadow-2xl"
            />
            <div className="text-center mt-4 text-white max-w-2xl px-4">
              <h3 className="font-serif-luxury text-xl font-bold text-amber-200">
                {getLoc(filteredItems[lightboxIndex].title)}
              </h3>
              {filteredItems[lightboxIndex].description && (
                <p className="text-xs text-stone-300 mt-1 font-sans">
                  {getLoc(filteredItems[lightboxIndex].description)}
                </p>
              )}
              <p className="text-[11px] text-stone-400 mt-1.5 uppercase tracking-wider font-sans">
                Photo {lightboxIndex + 1} of {filteredItems.length} · {filteredItems[lightboxIndex].category}
              </p>
            </div>
          </div>

          {/* Next */}
          <button
            type="button"
            onClick={showNext}
            className="absolute right-4 p-3 rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-50"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      )}
    </section>
  );
};
