import React, { useState, useRef } from 'react';
import { useHotel } from '../../context/HotelContext';
import { Room, RoomImage, MultilingualText } from '../../types';
import {
  UploadCloud,
  Plus,
  Star,
  RefreshCw,
  Trash2,
  Edit2,
  ArrowLeft,
  ArrowRight,
  MoveLeft,
  MoveRight,
  CheckCircle,
  X,
  Eye,
  AlertCircle,
} from 'lucide-react';
import { optimizeImageFile, validateImageFile } from '../../utils/imageOptimizer';
import { ImageReplaceModal } from './ImageReplaceModal';
import { DeleteImageConfirmModal } from './DeleteImageConfirmModal';

interface RoomImageManagerProps {
  room: Room;
  onBack: () => void;
}

export const RoomImageManager: React.FC<RoomImageManagerProps> = ({ room, onBack }) => {
  const {
    getLoc,
    addRoomImages,
    updateRoomImage,
    replaceRoomImage,
    deleteRoomImage,
    setRoomMainImage,
    reorderRoomImages,
    language,
  } = useHotel();

  // Multi-upload staging state
  const [stagedFiles, setStagedFiles] = useState<Array<{ dataUrl: string; name: string; title: string }>>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Edit info modal state
  const [editingImage, setEditingImage] = useState<RoomImage | null>(null);
  const [editTitleEn, setEditTitleEn] = useState('');
  const [editTitleAm, setEditTitleAm] = useState('');
  const [editTitleAr, setEditTitleAr] = useState('');
  const [editCaptionEn, setEditCaptionEn] = useState('');
  const [editCaptionAm, setEditCaptionAm] = useState('');
  const [editCaptionAr, setEditCaptionAr] = useState('');

  // Replace modal state
  const [replacingImage, setReplacingImage] = useState<RoomImage | null>(null);

  // Delete confirm modal state
  const [deletingImage, setDeletingImage] = useState<RoomImage | null>(null);
  const [selectedAltMainId, setSelectedAltMainId] = useState<string>('');
  const [deleteErrorMessage, setDeleteErrorMessage] = useState<string | null>(null);

  const images = room.images || [
    {
      id: `img-${room.id}-default`,
      url: room.imageUrl,
      title: room.name,
      caption: { en: 'Primary room view', am: 'ዋና እይታ', ar: 'إطلالة الغرفة' },
      isMain: true,
      order: 0,
      uploadDate: '2026-09-25',
    },
  ];

  // Handle file selection (supports multiple files at once!)
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
      setUploadError(err.message || 'Error processing uploaded images.');
    } finally {
      setIsProcessing(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCommitStagedUploads = () => {
    if (stagedFiles.length === 0) return;

    const newImages = stagedFiles.map(f => ({
      url: f.dataUrl,
      title: {
        en: f.title,
        am: `${room.name.am || 'ክፍል'} ፎቶ`,
        ar: `صورة ${room.name.ar || 'الغرفة'}`,
      },
      caption: {
        en: 'High quality room photograph',
        am: 'ጥራት ያለው የክፍል ፎቶ',
        ar: 'صورة فندقية عالية الجودة للغرفة',
      },
    }));

    addRoomImages(room.id, newImages);
    setStagedFiles([]);
    setUploadSuccess(`Successfully added ${newImages.length} picture${newImages.length > 1 ? 's' : ''} to ${getLoc(room.name)}!`);
    setTimeout(() => setUploadSuccess(null), 3500);
  };

  const removeStagedItem = (index: number) => {
    setStagedFiles(prev => prev.filter((_, i) => i !== index));
  };

  // Open edit info modal
  const handleOpenEdit = (img: RoomImage) => {
    setEditingImage(img);
    setEditTitleEn(img.title?.en || '');
    setEditTitleAm(img.title?.am || '');
    setEditTitleAr(img.title?.ar || '');
    setEditCaptionEn(img.caption?.en || '');
    setEditCaptionAm(img.caption?.am || '');
    setEditCaptionAr(img.caption?.ar || '');
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingImage) return;

    updateRoomImage(room.id, editingImage.id, {
      title: {
        en: editTitleEn,
        am: editTitleAm || editTitleEn,
        ar: editTitleAr || editTitleEn,
      },
      caption: {
        en: editCaptionEn,
        am: editCaptionAm || editCaptionEn,
        ar: editCaptionAr || editCaptionEn,
      },
    });

    setEditingImage(null);
  };

  // Replace confirm
  const handleConfirmReplace = (newUrl: string) => {
    if (!replacingImage) return;
    replaceRoomImage(room.id, replacingImage.id, newUrl);
    setReplacingImage(null);
    setUploadSuccess('Room picture replaced successfully and updated across the website!');
    setTimeout(() => setUploadSuccess(null), 3000);
  };

  // Delete workflow
  const handleOpenDelete = (img: RoomImage) => {
    setDeleteErrorMessage(null);
    setDeletingImage(img);
    const alts = images.filter(i => i.id !== img.id);
    if (alts.length > 0) {
      setSelectedAltMainId(alts[0].id);
    }
  };

  const handleConfirmDelete = () => {
    if (!deletingImage) return;

    // If main image, first set the selected alternative as main
    if (deletingImage.isMain) {
      if (!selectedAltMainId) {
        setDeleteErrorMessage('Please select another picture to serve as the new Main Picture before deleting.');
        return;
      }
      setRoomMainImage(room.id, selectedAltMainId);
    }

    const res = deleteRoomImage(room.id, deletingImage.id);
    if (res.success) {
      setDeletingImage(null);
      setUploadSuccess('Picture successfully removed.');
      setTimeout(() => setUploadSuccess(null), 3000);
    } else {
      setDeleteErrorMessage(res.error || 'Failed to delete picture.');
    }
  };

  return (
    <div className="space-y-6 font-sans">
      {/* Top Breadcrumb & Room Title Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200">
        <div>
          <button
            type="button"
            onClick={onBack}
            className="text-xs font-semibold text-[#0F2D24] hover:underline flex items-center gap-1.5 mb-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to All Rooms</span>
          </button>
          <div className="flex items-center gap-2">
            <h3 className="font-serif-luxury text-2xl font-bold text-stone-900">
              {getLoc(room.name)}
            </h3>
            <span className="px-2.5 py-0.5 rounded text-[11px] font-bold bg-[#0F2D24] text-amber-300 uppercase">
              {room.category}
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-0.5">
            Manage, reorder, replace, or add multiple high-resolution pictures for this accommodation.
          </p>
        </div>

        {/* Action Button: Add Picture */}
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

      {/* Notifications / Alerts */}
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

      {/* STAGED UPLOADS PREVIEW AREA (When user selects new pictures) */}
      {stagedFiles.length > 0 && (
        <div className="p-4 bg-emerald-50/60 border border-emerald-300 rounded-xl space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-bold text-xs text-emerald-900 flex items-center gap-1.5">
              <UploadCloud className="w-4 h-4 text-emerald-700" />
              <span>{stagedFiles.length} New Picture{stagedFiles.length > 1 ? 's' : ''} Ready to Upload</span>
            </span>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStagedFiles([])}
                className="text-xs text-stone-500 hover:text-stone-700"
              >
                Clear
              </button>
              <button
                type="button"
                onClick={handleCommitStagedUploads}
                className="px-4 py-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-semibold text-xs rounded-lg shadow-sm"
              >
                Save All to Room
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
          Upload Multiple Pictures for {getLoc(room.name)}
        </p>
        <p className="text-[11px] text-stone-400 mt-1">
          Select or drag JPG, JPEG, PNG, or WEBP photos. Images are automatically optimized.
        </p>
      </div>

      {/* EXISTING ROOM PICTURES GRID */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h4 className="font-serif-luxury text-lg font-bold text-stone-900">
            Active Room Gallery ({images.length} {images.length === 1 ? 'picture' : 'pictures'})
          </h4>
          <span className="text-xs text-stone-400">
            ⭐ Indicates the Main Picture displayed on cards & bookings
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {images.map((img, index) => {
            const titleText = getLoc(img.title) || getLoc(room.name);
            const isMain = img.isMain;

            return (
              <div
                key={img.id}
                className={`bg-white rounded-2xl overflow-hidden border transition-all duration-200 flex flex-col justify-between ${
                  isMain
                    ? 'border-amber-400 ring-2 ring-amber-400/30 shadow-md'
                    : 'border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300'
                }`}
              >
                {/* Image Frame */}
                <div className="relative h-48 w-full bg-stone-900 overflow-hidden group">
                  <img
                    src={img.url}
                    alt={titleText}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity" />

                  {/* Main Picture Star Badge */}
                  {isMain ? (
                    <div className="absolute top-3 left-3 bg-amber-500 text-stone-950 px-2.5 py-1 rounded-md text-[11px] font-bold shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>⭐ Main Picture</span>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setRoomMainImage(room.id, img.id)}
                      className="absolute top-3 left-3 bg-black/60 hover:bg-amber-500 hover:text-stone-950 text-white px-2.5 py-1 rounded-md text-[11px] font-medium shadow transition-colors flex items-center gap-1"
                      title="Set as the main room picture"
                    >
                      <Star className="w-3 h-3" />
                      <span>Set as Main</span>
                    </button>
                  )}

                  {/* Reorder Arrows on Top Right */}
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-black/60 backdrop-blur-sm p-1 rounded-md">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => reorderRoomImages(room.id, index, index - 1)}
                      className="p-1 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white"
                      title="Move Left / Earlier"
                    >
                      <MoveLeft className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-[10px] text-stone-300 font-mono">#{index + 1}</span>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => reorderRoomImages(room.id, index, index + 1)}
                      className="p-1 text-white hover:text-amber-300 disabled:opacity-30 disabled:hover:text-white"
                      title="Move Right / Later"
                    >
                      <MoveRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Upload Date Tag */}
                  <span className="absolute bottom-2 right-2 text-[10px] text-stone-300 bg-black/50 px-2 py-0.5 rounded font-mono">
                    {img.uploadDate || '2026-09-29'}
                  </span>
                </div>

                {/* Card Info */}
                <div className="p-4 flex-1 flex flex-col justify-between">
                  <div>
                    <h5 className="font-serif-luxury font-bold text-stone-900 text-base mb-1 truncate">
                      {titleText}
                    </h5>
                    {img.caption && (
                      <p className="text-xs text-stone-500 line-clamp-1 mb-3">
                        {getLoc(img.caption)}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons: [EDIT] [REPLACE] [DELETE] */}
                  <div className="pt-3 border-t border-stone-100 grid grid-cols-3 gap-1.5 text-xs">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(img)}
                      className="py-1.5 px-2 bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
                      title="Edit Picture Information"
                    >
                      <Edit2 className="w-3 h-3" />
                      <span>Edit</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setReplacingImage(img)}
                      className="py-1.5 px-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-semibold rounded-md flex items-center justify-center gap-1 transition-colors"
                      title="Replace with another file"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>Replace</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleOpenDelete(img)}
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
      </div>

      {/* EDIT PICTURE INFO MODAL */}
      {editingImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
          <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
            <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between">
              <h4 className="font-serif-luxury font-bold text-lg">
                Edit Picture Information
              </h4>
              <button
                type="button"
                onClick={() => setEditingImage(null)}
                className="p-1 rounded-full text-stone-300 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 space-y-4 text-xs font-sans">
              <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
                <img src={editingImage.url} alt="" className="w-16 h-16 rounded-lg object-cover" />
                <div>
                  <span className="font-semibold text-stone-800 block">{getLoc(room.name)}</span>
                  <span className="text-[10px] text-stone-500">ID: {editingImage.id}</span>
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Title (English)</label>
                <input
                  type="text"
                  value={editTitleEn}
                  onChange={e => setEditTitleEn(e.target.value)}
                  placeholder="e.g. Master Bedroom & Garden Patio"
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
                    placeholder="ምሳሌ፦ የመኝታ ክፍል እይታ"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 font-semibold mb-1">Title (Arabic العربية)</label>
                  <input
                    type="text"
                    value={editTitleAr}
                    onChange={e => setEditTitleAr(e.target.value)}
                    placeholder="مثال: إطلالة غرفة النوم"
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 font-semibold mb-1">Caption / Description</label>
                <textarea
                  rows={2}
                  value={editCaptionEn}
                  onChange={e => setEditCaptionEn(e.target.value)}
                  placeholder="Detailed description of this room angle..."
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingImage(null)}
                  className="px-4 py-2 border border-stone-300 rounded text-stone-700 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#0F2D24] text-amber-300 font-semibold rounded shadow"
                >
                  Save Picture Info
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* REPLACE IMAGE MODAL */}
      {replacingImage && (
        <ImageReplaceModal
          isOpen={true}
          onClose={() => setReplacingImage(null)}
          currentImageUrl={replacingImage.url}
          itemTitle={`${getLoc(room.name)} - ${getLoc(replacingImage.title) || 'Room Picture'}`}
          onConfirmReplace={handleConfirmReplace}
        />
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deletingImage && (
        <DeleteImageConfirmModal
          isOpen={true}
          onClose={() => setDeletingImage(null)}
          onConfirm={handleConfirmDelete}
          imageUrl={deletingImage.url}
          imageTitle={getLoc(deletingImage.title)}
          isMainImage={deletingImage.isMain}
          alternativeImages={images.filter(i => i.id !== deletingImage.id).map(i => ({
            id: i.id,
            url: i.url,
            title: getLoc(i.title),
          }))}
          selectedAlternativeMainId={selectedAltMainId}
          onSelectAlternativeMain={id => setSelectedAltMainId(id)}
        />
      )}
    </div>
  );
};
