import React, { useState, useRef } from 'react';
import { UploadCloud, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw, Sparkles, Link as LinkIcon } from 'lucide-react';
import { optimizeImageFile, validateImageFile } from '../../utils/imageOptimizer';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  itemTitle?: string;
  onConfirmReplace: (newUrl: string) => void;
}

const SAMPLE_LUXURY_PRESETS = [
  {
    name: 'Sunset Villa Exterior',
    category: 'Exterior',
    url: '/src/assets/images/hero_planet_luxury_1790712166933.jpg',
  },
  {
    name: 'Presidential Suite',
    category: 'Suites',
    url: '/src/assets/images/room_luxury_suite_1790712180281.jpg',
  },
  {
    name: 'Deluxe Garden Room',
    category: 'Rooms',
    url: '/src/assets/images/room_deluxe_room_1790712190636.jpg',
  },
  {
    name: 'Fine Dining & Coffee',
    category: 'Dining',
    url: '/src/assets/images/dining_restaurant_1790712202379.jpg',
  },
  {
    name: 'Executive Lounge',
    category: 'Reception',
    url: '/src/assets/images/facilities_lounge_1790712213187.jpg',
  },
];

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  itemTitle,
  onConfirmReplace,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [urlInput, setUrlInput] = useState('');
  const [activeTab, setActiveTab] = useState<'upload' | 'preset' | 'url'>('upload');
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setErrorMessage(null);
    const validation = validateImageFile(file);
    if (!validation.valid) {
      setErrorMessage(validation.error || 'Invalid image file.');
      return;
    }

    setSelectedFile(file);
    setIsOptimizing(true);
    try {
      const result = await optimizeImageFile(file);
      setPreviewUrl(result.dataUrl);
    } catch (err: any) {
      setErrorMessage(err.message || 'Error processing image.');
    } finally {
      setIsOptimizing(false);
    }
  };

  const handleApplyUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    setPreviewUrl(urlInput.trim());
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleSelectPreset = (url: string) => {
    setPreviewUrl(url);
    setSelectedFile(null);
    setErrorMessage(null);
  };

  const handleConfirm = () => {
    if (!previewUrl) return;
    onConfirmReplace(previewUrl);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setUrlInput('');
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200 flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-400/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
              <RefreshCw className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-serif-luxury font-bold text-lg leading-tight">
                Replace Picture Across Website
              </h3>
              <p className="text-[11px] text-emerald-300 font-sans">
                {itemTitle || 'Update this picture and automatically refresh everywhere on the live site'}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-1 rounded-full text-stone-300 hover:text-white hover:bg-white/10"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-5 font-sans text-xs sm:text-sm text-stone-700">
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl flex items-center gap-2 text-rose-800 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Current vs New Image Comparison Preview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Current Image */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider">
                  Current Live Picture
                </span>
                <span className="text-[10px] text-stone-400 font-mono">Original</span>
              </div>
              <div className="relative h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-100 shadow-inner">
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/75 text-amber-300 backdrop-blur-xs">
                  Active in Display
                </span>
              </div>
            </div>

            {/* New Image Preview */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-emerald-800 uppercase tracking-wider">
                  New Replacement Preview
                </span>
                {previewUrl && (
                  <span className="text-[10px] text-emerald-600 font-semibold font-mono flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Selected
                  </span>
                )}
              </div>
              {previewUrl ? (
                <div className="relative h-44 rounded-xl overflow-hidden border-2 border-emerald-600 bg-emerald-50/20 shadow-md">
                  <img
                    src={previewUrl}
                    alt="Replacement Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2.5 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white flex items-center gap-1 shadow">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready to Apply Everywhere
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-44 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#0F2D24] bg-stone-50 hover:bg-emerald-50/20 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                  <p className="text-xs font-semibold text-stone-700">
                    Choose replacement image
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    Upload file, select luxury preset, or paste URL
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Selection Method Tabs */}
          <div className="bg-stone-100 p-1 rounded-xl flex items-center gap-1 text-xs">
            <button
              type="button"
              onClick={() => setActiveTab('upload')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'upload'
                  ? 'bg-white text-stone-900 shadow font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upload From Device
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('preset')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'preset'
                  ? 'bg-white text-stone-900 shadow font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Luxury Photo Presets</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('url')}
              className={`flex-1 py-1.5 rounded-lg font-medium transition-all flex items-center justify-center gap-1.5 ${
                activeTab === 'url'
                  ? 'bg-white text-stone-900 shadow font-semibold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <LinkIcon className="w-3 h-3" />
              <span>Paste Image URL</span>
            </button>
          </div>

          {/* Tab 1: Upload */}
          {activeTab === 'upload' && (
            <div className="space-y-3">
              <input
                ref={fileInputRef}
                type="file"
                accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="hidden"
              />
              <div
                onClick={() => fileInputRef.current?.click()}
                className="p-4 border border-stone-200 hover:border-emerald-600 rounded-xl bg-stone-50/70 hover:bg-emerald-50/30 flex items-center justify-between cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="font-semibold text-xs text-stone-900 block">
                      {selectedFile ? selectedFile.name : 'Select JPG, PNG, or WEBP file'}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      {selectedFile
                        ? `${(selectedFile.size / 1024).toFixed(0)} KB ready to replace`
                        : 'Max size 15MB. Automatically compressed for high clarity.'}
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  className="px-3 py-1.5 bg-[#0F2D24] text-amber-300 font-semibold text-xs rounded-lg shadow-xs hover:bg-[#163E32]"
                >
                  Browse Files
                </button>
              </div>

              {isOptimizing && (
                <div className="flex items-center gap-2 text-xs text-amber-700 p-2.5 bg-amber-50 rounded-lg">
                  <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
                  <span>Optimizing image for fast delivery and high resolution...</span>
                </div>
              )}
            </div>
          )}

          {/* Tab 2: Curated Presets */}
          {activeTab === 'preset' && (
            <div className="space-y-2">
              <span className="text-xs text-stone-500 block">
                Quickly select one of Planet Luxury's high-definition hospitality photography presets:
              </span>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                {SAMPLE_LUXURY_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset.url)}
                    className={`text-left rounded-xl overflow-hidden border p-1 transition-all group cursor-pointer ${
                      previewUrl === preset.url
                        ? 'border-emerald-600 ring-2 ring-emerald-500/30 bg-emerald-50/40 shadow-xs'
                        : 'border-stone-200 hover:border-stone-400 bg-white'
                    }`}
                  >
                    <div className="h-16 w-full rounded-lg overflow-hidden bg-stone-100 mb-1.5 relative">
                      <img src={preset.url} alt={preset.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      {previewUrl === preset.url && (
                        <div className="absolute inset-0 bg-emerald-900/40 flex items-center justify-center">
                          <CheckCircle2 className="w-5 h-5 text-white" />
                        </div>
                      )}
                    </div>
                    <div className="px-1">
                      <span className="text-[11px] font-semibold text-stone-800 truncate block">
                        {preset.name}
                      </span>
                      <span className="text-[9px] uppercase font-mono text-stone-400">
                        {preset.category}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: URL */}
          {activeTab === 'url' && (
            <form onSubmit={handleApplyUrl} className="space-y-2">
              <label className="text-xs font-semibold text-stone-700 block">
                Image Web Address (Direct HTTPS link)
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={urlInput}
                  onChange={e => setUrlInput(e.target.value)}
                  placeholder="https://example.com/images/hotel-exterior.jpg"
                  className="flex-1 px-3 py-2 bg-stone-50 border border-stone-300 rounded-lg text-xs"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F2D24] text-amber-300 font-semibold text-xs rounded-lg hover:bg-[#163E32]"
                >
                  Preview URL
                </button>
              </div>
            </form>
          )}

          {/* Sync Guarantee Notice */}
          <div className="p-3 bg-emerald-50/70 border border-emerald-200 rounded-xl text-xs text-emerald-900 space-y-1">
            <div className="flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Full Website Live Update Guarantee</span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-relaxed font-sans">
              Confirming replacement replaces this image file across the entire public website — including the <strong>Homepage Gallery Visual Tour, Hero Banner, About Section, Dining showcase, and Room displays</strong> — while retaining all room rates, titles, categories, and availability untouched.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between gap-3">
          <div className="text-[11px] text-stone-500">
            {previewUrl ? '✅ Replacement image ready to apply' : 'Select an image to preview replacement'}
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleClose}
              className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors uppercase tracking-wider"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={!previewUrl || isOptimizing}
              onClick={handleConfirm}
              className="px-5 py-2 text-xs font-semibold text-amber-300 bg-[#0F2D24] hover:bg-[#163E32] rounded-lg shadow-sm hover:shadow transition-colors uppercase tracking-wider disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5 cursor-pointer"
            >
              <span>Confirm & Replace on Website</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
