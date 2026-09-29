import React, { useState, useRef } from 'react';
import { UploadCloud, X, ArrowRight, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import { optimizeImageFile, validateImageFile } from '../../utils/imageOptimizer';

interface ImageReplaceModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentImageUrl: string;
  itemTitle?: string;
  onConfirmReplace: (newUrl: string) => void;
}

export const ImageReplaceModal: React.FC<ImageReplaceModalProps> = ({
  isOpen,
  onClose,
  currentImageUrl,
  itemTitle,
  onConfirmReplace,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
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

  const handleConfirm = () => {
    if (!previewUrl) return;
    onConfirmReplace(previewUrl);
    handleClose();
  };

  const handleClose = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setErrorMessage(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#0F2D24] text-white flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <RefreshCw className="w-5 h-5 text-amber-300" />
            <div>
              <h3 className="font-serif-luxury font-bold text-lg">
                Replace Picture
              </h3>
              <p className="text-[11px] text-emerald-300 font-sans">
                {itemTitle || 'Update image without modifying other details'}
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
        <div className="p-6 space-y-5 font-sans text-xs sm:text-sm text-stone-700">
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
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                Current Picture
              </span>
              <div className="relative h-44 rounded-xl overflow-hidden border border-stone-200 bg-stone-100">
                <img
                  src={currentImageUrl}
                  alt="Current"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-black/70 text-white">
                  Active in Display
                </span>
              </div>
            </div>

            {/* New Image Preview */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-stone-500 uppercase tracking-wider block">
                New Replacement
              </span>
              {previewUrl ? (
                <div className="relative h-44 rounded-xl overflow-hidden border-2 border-emerald-600 bg-emerald-50/20">
                  <img
                    src={previewUrl}
                    alt="Replacement Preview"
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-700 text-white flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    Ready to Apply
                  </span>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="h-44 rounded-xl border-2 border-dashed border-stone-300 hover:border-[#0F2D24] bg-stone-50 hover:bg-emerald-50/20 flex flex-col items-center justify-center p-4 text-center cursor-pointer transition-colors"
                >
                  <UploadCloud className="w-8 h-8 text-stone-400 mb-2" />
                  <p className="text-xs font-semibold text-stone-700">
                    Click to select new image
                  </p>
                  <p className="text-[10px] text-stone-400 mt-1">
                    JPG, JPEG, PNG, or WEBP (Max 15MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Hidden File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* Re-select or change file button */}
          {previewUrl && (
            <div className="flex items-center justify-between text-xs pt-1">
              <span className="text-stone-500">
                Selected: <strong className="text-stone-800">{selectedFile?.name}</strong>
              </span>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="text-[#0F2D24] font-semibold hover:underline"
              >
                Choose Different File
              </button>
            </div>
          )}

          {isOptimizing && (
            <div className="flex items-center gap-2 text-xs text-amber-700 p-2.5 bg-amber-50 rounded-lg">
              <RefreshCw className="w-4 h-4 animate-spin text-amber-600" />
              <span>Optimizing image for fast delivery and high resolution...</span>
            </div>
          )}

          <p className="text-xs text-stone-500 leading-relaxed bg-[#F9F8F5] p-3 rounded-lg border border-stone-200">
            ℹ️ <strong>Replacement Guarantee:</strong> This action will replace only the visual image file. Room rates in ETB, availability, categories, descriptions, and amenities remain strictly preserved.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
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
            className="px-5 py-2 text-xs font-semibold text-amber-300 bg-[#0F2D24] hover:bg-[#163E32] rounded-lg shadow-sm hover:shadow transition-colors uppercase tracking-wider disabled:opacity-50 flex items-center gap-1.5"
          >
            <span>Confirm Replacement</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
