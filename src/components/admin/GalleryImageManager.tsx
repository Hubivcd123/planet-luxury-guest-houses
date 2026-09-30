import React, { useState, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import { GalleryItem, GalleryCategory, MultilingualText } from '../../types';
import {
  UploadCloud,
  Plus,
  Star,
  RefreshCw,
  Trash2,
  Edit2,
  MoveLeft,
  MoveRight,
  CheckCircle,
  X,
  Eye,
  AlertCircle,
  Tag,
} from 'lucide-react';
import { optimizeImageFile, validateImageFile } from '../../utils/imageOptimizer';
import { ImageReplaceModal } from './ImageReplaceModal';
import { DeleteImageConfirmModal } from './DeleteImageConfirmModal';

export const GALLERY_CATEGORIES: Array<{ id: GalleryCategory; label: string }> = [
  { id: 'exterior', label: 'Exterior & Grounds' },
  { id: 'rooms', label: 'Rooms' },
  { id: 'suites', label: 'Suites' },
  { id: 'reception', label: 'Reception & Lobby' },
  { id: 'restaurant', label: 'Restaurant' },
  { id: 'dining', label: 'Dining & Coffee' },
  { id: 'facilities', label: 'Facilities' },
  { id: 'events', label: 'Events & Conferences' },
  { id: 'outdoor', label: 'Outdoor Courtyard' },
  { id: 'other', label: 'Other' },
];

export const GalleryImageManager: React.FC = () => {
  const {
    gallery,
    addGalleryItem,
    addMultipleGalleryItems,
    updateGalleryItem,
    replaceGalleryItem,
    deleteGalleryItem,
    reorderGalleryItems,
    getLoc,
    language,
    hotelInfo,
    setWebsiteHeroImage,
    setWebsiteAboutImage,
    setWebsiteDiningImage,
  } = useHotel();

  // Multi-upload staging
  const [stagedFiles, setStagedFiles] = useState<Array<{ dataUrl: string; name: string; title: string }>>([]);
  const [stagedCategory, setStagedCategory] = useState<GalleryCategory>('exterior');
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit image modal
  const [editingItem, setEditingItem] = useState<GalleryItem | null>(null);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleAm, setEditTitleAm] = useState('');
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editDescEn, setEditDescEn] = useState('');
  const [editDescAm, setEditDescAm] = useState('');
  const [editDescAr, setEditDescAr] = useState('');
  const [editCategory, setEditCategory] = useState<GalleryCategory>('exterior');
  const [editFeatured, setEditFeatured] = useState(false);

  // Replace modal
  const [replacingItem, setReplacingItem] = useState<GalleryItem | null>(null);

  // Delete modal
  const [deletingItem, setDeletingItem] = useState<GalleryItem | null>(null);

  // Filter category in admin view
  const [filterCat, setFilterCat] = useState<string>('all');

  const filteredGallery = filterCat === 'all'
    ? gallery
    : gallery.filter(item => item.category === filterCat);

  // Handle files selected (supports multiple files at once!)
  const handleFilesSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setUploadError(null);
    setUploadSuccess(null);
    setIsProcessing(true);

    try {
      const optimizedResults: Array<{ dataUrl: string; name: string; title: string }> = [];

      for (const file of files) {
        const validation = validateImageFile(file);
        if (!validation.valid) {
          throw new Error(validation.error);
        }
        const optimized = await optimizeImageFile(file);
        optimizedResults.push({
          dataUrl: optimized.dataUrl,
          name: file.name,
          title: file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '),
        });
      }

      setStagedFiles(prev => [...prev, ...optimizedResults]);
    } catch (err: any) {
      setUploadError(err.message || 'Error processing gallery photos.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCommitStagedUploads = () => {
    if (stagedFiles.length === 0) return;

    const newItems: GalleryItem[] = stagedFiles.map((f, i) => ({
      id: `gal-${Date.now()}-${i}`,
      title: {
        en: f.title,
        am: `${f.title} ፎቶ`,
        ar: `صورة ${f.title}`,
      },
      description: {
        en: `Photograph of Planet Luxury Guest Houses ${stagedCategory} in Assosa.`,
        am: `የፕላኔት የቅንጦት ሆቴል ፎቶ።`,
        ar: `صورة لنزل كوكب الفخامة في أسوسا.`,
      },
      category: stagedCategory,
      imageUrl: f.dataUrl,
      featured: i === 0,
      order: gallery.length + i,
      uploadDate: new Date().toISOString().split('T')[0],
    }));

    addMultipleGalleryItems(newItems);
    setStagedFiles([]);
    setUploadSuccess(`Successfully added ${newItems.length} picture${newItems.length > 1 ? 's' : ''} to the Gallery!`);
    setTimeout(() => setUploadSuccess(null), 3500);
  };

  const removeStagedItem = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Open edit modal
  const handleOpenEdit = (item: GalleryItem) => {
    setEditingItem(item);
    setEditTitleEn(item.title.en || '');
    setEditTitleAm(item.title.am || '');
    setEditTitleAr(item.title.ar || '');
    setEditDescEn(item.description?.en || '');
    setEditDescAm(item.description?.am || '');
    setEditDescAr(item.description?.ar || '');
    setEditCategory(item.category);
    setEditFeatured(item.featured || false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    updateGalleryItem({
      ...editingItem,
      title: {
        en: editTitleEn,
        am: editTitleAm || editTitleEn,
        ar: editTitleAr || editTitleEn,
      },
      description: {
        en: editDescEn,
        am: editDescAm || editDescEn,
        ar: editDescAr || editDescEn,
      },
      category: editCategory,
      featured: editFeatured,
    });

    setEditingItem(null);
    setUploadSuccess('Gallery picture details updated successfully.');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // Replace confirm
  const handleConfirmReplace = (newUrl: string) => {
    if (!replacingItem) return;
    replaceGalleryItem(replacingItem.id, newUrl);
    setReplacingItem(null);
    setUploadSuccess('Gallery picture replaced successfully! Live updates are now active across the website (Gallery visual tour, Hero banner, and matching sections).');
    setTimeout(() => setUploadSuccess(null), 4000);
  };

  // Delete confirm
  const handleConfirmDelete = () => {
    if (!deletingItem) return;
    deleteGalleryItem(deletingItem.id);
    setDeletingItem(null);
    setUploadSuccess('Gallery picture deleted.');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Header & Add Picture button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
            Gallery Management
          </h3>
          <p className="text-xs text-stone-500 mt-0.5">
            Upload single or batch pictures, assign categories, set featured shots, and reorder public displays.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFilesSelected}
            className="hidden"
          />
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-[#0F2D24] hover:bg-[#163E32] text-amber-300 text-xs font-semibold uppercase tracking-wider rounded-lg shadow-sm hover:shadow flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Add Pictures</span>
          </button>
        </div>
      </div>

      {/* Notifications */}
      {uploadError && (
        <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2.5 text-xs text-rose-800">
          <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{uploadError}</span>
        </div>
      )}

      {uploadSuccess && (
        <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
          <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{uploadSuccess}</span>
        </div>
      )}

      {/* STAGED MULTIPLE UPLOADS PREVIEW */}
      {stagedFiles.length > 0 && (
        <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
                <UploadCloud className="w-4 h-4 text-emerald-700" />
                <span>{stagedFiles.length} Gallery Picture{stagedFiles.length > 1 ? 's' : ''} Staged for Upload</span>
              </span>
              <p className="text-[11px] text-emerald-700 mt-0.5">
                Assign a category to this batch before saving to the public gallery:
              </p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={stagedCategory}
                onChange={e => setStagedCategory(e.target.value as GalleryCategory)}
                className="px-3 py-1.5 bg-white border border-emerald-300 rounded-lg text-xs font-semibold text-stone-800"
              >
                {GALLERY_CATEGORIES.map(cat => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setStagedFiles([])}
                className="text-xs text-stone-500 hover:text-stone-700 px-2 py-1.5"
              >
                Clear
              </button>

              <button
                type="button"
                onClick={handleCommitStagedUploads}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm whitespace-nowrap"
              >
                Save All to Gallery
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3">
            {stagedFiles.map((staged, i) => (
              <div key={i} className="relative rounded-lg overflow-hidden border border-emerald-200 bg-white group">
                <img src={staged.dataUrl} alt="" className="w-full h-20 object-cover" />
                <button
                  type="button"
                  onClick={() => removeStagedItem(i)}
                  className="absolute top-1 right-1 p-1 bg-black/60 hover:bg-rose-600 rounded-full text-white"
                  title="Remove"
                >
                  <X className="w-3 h-3" />
                </button>
                <div className="p-1 text-[10px] text-stone-600 truncate">{staged.name}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* DRAG & DROP UPLOAD HELPER ZONE */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="p-6 border-2 border-dashed border-stone-300 hover:border-[#0F2D24] bg-stone-50 hover:bg-emerald-50/20 rounded-2xl flex flex-col items-center justify-center text-center cursor-pointer transition-all"
      >
        <UploadCloud className="w-8 h-8 text-[#0F2D24] mb-2" />
        <p className="text-xs sm:text-sm font-semibold text-stone-800">
          Upload Multiple Gallery Pictures at Once
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          Supports JPG, JPEG, PNG, and WEBP. High quality images are automatically optimized.
        </p>
      </div>

      {/* Category filter pills in Admin View */}
      <div className="flex flex-wrap items-center gap-1.5 pb-2">
        <button
          type="button"
          onClick={() => setFilterCat('all')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            filterCat === 'all'
              ? 'bg-[#0F2D24] text-amber-300 font-semibold'
              : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
          }`}
        >
          All ({gallery.length})
        </button>
        {GALLERY_CATEGORIES.map(cat => {
          const count = gallery.filter(g => g.category === cat.id).length;
          return (
            <button
              key={cat.id}
              type="button"
              onClick={() => setFilterCat(cat.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filterCat === cat.id
                  ? 'bg-[#0F2D24] text-amber-300 font-semibold'
                  : 'bg-stone-100 text-stone-600 hover:text-stone-900 hover:bg-stone-200'
              }`}
            >
              {cat.label} ({count})
            </button>
          );
        })}
      </div>

      {/* GALLERY PICTURES GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredGallery.map((item, index) => {
          const title = getLoc(item.title);
          const isFeatured = item.featured;
          const isHero = hotelInfo.heroImageUrl === item.imageUrl || (item.category === 'exterior' && isFeatured);
          const isAbout = hotelInfo.aboutImageUrl === item.imageUrl;
          const isDining = hotelInfo.diningImageUrl === item.imageUrl;

          return (
            <div
              key={item.id}
              className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                isFeatured
                  ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                  : 'border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300'
              }`}
            >
              {/* Image Frame */}
              <div className="relative h-48 w-full bg-stone-900 overflow-hidden group">
                <img
                  src={item.imageUrl}
                  alt={title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                {/* Featured Badge */}
                {isFeatured ? (
                  <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    <span>⭐ Featured Picture</span>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => updateGalleryItem({ ...item, featured: true })}
                    className="absolute top-3 left-3 bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white px-2.5 py-1 rounded-md text-[11px] font-medium shadow transition-colors flex items-center gap-1"
                    title="Feature this image on the homepage"
                  >
                    <Star className="w-3 h-3" />
                    <span>Set Featured</span>
                  </button>
                )}

                {/* Reorder Arrows on Top Right */}
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-md">
                  <button
                    type="button"
                    disabled={index === 0}
                    onClick={() => reorderGalleryItems(index, index - 1)}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Earlier"
                  >
                    <MoveLeft className="w-3.5 h-3.5" />
                  </button>
                  <span className="text-[10px] text-stone-300 font-mono">#{index + 1}</span>
                  <button
                    type="button"
                    disabled={index === filteredGallery.length - 1}
                    onClick={() => reorderGalleryItems(index, index + 1)}
                    className="p-1 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white"
                    title="Move Later"
                  >
                    <MoveRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                {/* Category chip on bottom left */}
                <span className="absolute bottom-2 left-2 text-[10px] uppercase font-bold text-amber-300 bg-[#0F2D24]/90 px-2 py-0.5 rounded font-mono">
                  {item.category}
                </span>

                {/* Upload Date Tag */}
                <span className="absolute bottom-2 right-2 text-[10px] text-stone-300 bg-black/50 px-2 py-0.5 rounded font-mono">
                  {item.uploadDate || '2026-09-29'}
                </span>
              </div>

              {/* Card Info */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="font-serif-luxury font-bold text-stone-900 text-base mb-1 truncate flex-1">
                      {title}
                    </h5>
                  </div>

                  {/* Active Website Presence Tags */}
                  {(isHero || isAbout || isDining) && (
                    <div className="flex flex-wrap gap-1 mb-2">
                      {isHero && (
                        <span className="px-2 py-0.5 bg-amber-100 text-[#0F2D24] text-[10px] font-bold rounded flex items-center gap-1 border border-amber-300">
                          🏠 Live Hero Banner
                        </span>
                      )}
                      {isAbout && (
                        <span className="px-2 py-0.5 bg-emerald-100 text-emerald-900 text-[10px] font-bold rounded flex items-center gap-1 border border-emerald-300">
                          ℹ️ Live About Section
                        </span>
                      )}
                      {isDining && (
                        <span className="px-2 py-0.5 bg-amber-50 text-amber-900 text-[10px] font-bold rounded flex items-center gap-1 border border-amber-300">
                          🍽️ Live Dining Section
                        </span>
                      )}
                    </div>
                  )}

                  {item.description && (
                    <p className="text-xs text-stone-500 line-clamp-1">
                      {getLoc(item.description)}
                    </p>
                  )}
                </div>

                {/* Direct Website Placement Quick Controls */}
                <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                  <span className="font-medium text-stone-400">Set Live Banner:</span>
                  <div className="flex items-center gap-1">
                    {!isHero && (
                      <button
                        type="button"
                        onClick={() => {
                          setWebsiteHeroImage(item.imageUrl);
                          setUploadSuccess(`"${title}" is now the Live Homepage Hero Banner!`);
                          setTimeout(() => setUploadSuccess(null), 3000);
                        }}
                        className="px-2 py-0.5 rounded bg-stone-100 hover:bg-[#0F2D24] hover:text-amber-300 text-stone-700 transition-colors text-[10px] font-semibold cursor-pointer"
                        title="Display this photo as the main Hero banner on the website"
                      >
                        + Hero
                      </button>
                    )}
                    {!isAbout && (
                      <button
                        type="button"
                        onClick={() => {
                          setWebsiteAboutImage(item.imageUrl);
                          setUploadSuccess(`"${title}" is now the Live About Section photo!`);
                          setTimeout(() => setUploadSuccess(null), 3000);
                        }}
                        className="px-2 py-0.5 rounded bg-stone-100 hover:bg-[#0F2D24] hover:text-emerald-300 text-stone-700 transition-colors text-[10px] font-semibold cursor-pointer"
                        title="Display this photo in the About story section"
                      >
                        + About
                      </button>
                    )}
                    {!isDining && (
                      <button
                        type="button"
                        onClick={() => {
                          setWebsiteDiningImage(item.imageUrl);
                          setUploadSuccess(`"${title}" is now the Live Dining showcase photo!`);
                          setTimeout(() => setUploadSuccess(null), 3000);
                        }}
                        className="px-2 py-0.5 rounded bg-stone-100 hover:bg-[#0F2D24] hover:text-amber-200 text-stone-700 transition-colors text-[10px] font-semibold cursor-pointer"
                        title="Display this photo in the Dining section spotlight"
                      >
                        + Dining
                      </button>
                    )}
                  </div>
                </div>

                {/* Action Buttons: [EDIT] [REPLACE] [DELETE] */}
                <div className="pt-2 border-t border-stone-100 grid grid-cols-3 gap-1.5 text-xs">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(item)}
                    className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
                    title="Edit Title & Category"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReplacingItem(item)}
                    className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
                    title="Replace picture file"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Replace</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeletingItem(item)}
                    className="py-1.5 px-2 hover:bg-rose-50 text-stone-500 hover:text-rose-700 font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
                    title="Delete Picture"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* EDIT GALLERY PICTURE INFO MODAL */}
      {editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between">
              <h4 className="font-serif-luxury font-bold text-lg">
                Edit Gallery Picture Details
              </h4>
              <button
                type="button"
                onClick={() => setEditingItem(null)}
                className="p-1 rounded-full text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs font-sans">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <img src={editingItem.imageUrl} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <span className="font-semibold text-stone-800 block">{getLoc(editingItem.title)}</span>
                  <span className="text-[10px] text-stone-500 uppercase">{editingItem.category}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Category</label>
                <select
                  value={editCategory}
                  onChange={e => setEditCategory(e.target.value as GalleryCategory)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded font-semibold text-stone-800"
                >
                  {GALLERY_CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editTitleEn}
                  onChange={e => setEditTitleEn(e.target.value)}
                  placeholder="e.g. Garden Courtyard Twilight"
                  required
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Title (Amharic አማርኛ)</label>
                  <input
                    type="text"
                    value={editTitleAm}
                    onChange={e => setEditTitleAm(e.target.value)}
                    placeholder="ምሳሌ፦ የጊቢ እይታ"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Title (Arabic العربية)</label>
                  <input
                    type="text"
                    value={editTitleAr}
                    onChange={e => setEditTitleAr(e.target.value)}
                    placeholder="مثال: فناء الحديقة"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={editDescEn}
                  onChange={e => setEditDescEn(e.target.value)}
                  placeholder="Description of this scene or space..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="featuredToggle"
                  checked={editFeatured}
                  onChange={e => setEditFeatured(e.target.checked)}
                  className="w-4 h-4 text-[#0F2D24] rounded"
                />
                <label htmlFor="featuredToggle" className="font-semibold text-stone-800">
                  Mark as ⭐ Featured Picture (Prominently highlighted in galleries)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingItem(null)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2D24] text-amber-300 font-semibold rounded shadow"
                >
                  Save Picture Details
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLACE IMAGE MODAL */}
      {replacingItem && (
        <ImageReplaceModal
          isOpen={true}
          onClose={() => setReplacingItem(null)}
          currentImageUrl={replacingItem.imageUrl}
          itemTitle={`Gallery: ${getLoc(replacingItem.title)}`}
          onConfirmReplace={handleConfirmReplace}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingItem && (
        <DeleteImageConfirmModal
          isOpen={true}
          onClose={() => setDeletingItem(null)}
          onConfirm={handleConfirmDelete}
          imageUrl={deletingItem.imageUrl}
          imageTitle={getLoc(deletingItem.title)}
          isMainImage={false}
        />
      )}
    </div>
  );
};
