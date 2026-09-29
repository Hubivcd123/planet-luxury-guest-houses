import React from 'react';
import { AlertTriangle, X } from 'lucide-react';

interface DeleteImageConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  imageUrl?: string;
  imageTitle?: string;
  isMainImage?: boolean;
  alternativeImages?: Array<{ id: string; url: string; title?: string }>;
  onSelectAlternativeMain?: (id: string) => void;
  selectedAlternativeMainId?: string;
}

export const DeleteImageConfirmModal: React.FC<DeleteImageConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  imageUrl,
  imageTitle,
  isMainImage,
  alternativeImages = [],
  onSelectAlternativeMain,
  selectedAlternativeMainId,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-stone-200">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-rose-50 border-b border-rose-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 text-rose-700">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <h3 className="font-serif-luxury font-bold text-lg text-rose-900">
              Confirm Image Deletion
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-4 font-sans text-xs sm:text-sm text-stone-700">
          <p className="font-semibold text-stone-900">
            Are you sure you want to delete this picture?
          </p>

          {/* Picture Preview */}
          {imageUrl && (
            <div className="flex items-center gap-3 p-3 bg-stone-50 rounded-xl border border-stone-200">
              <img
                src={imageUrl}
                alt=""
                className="w-16 h-16 rounded-lg object-cover bg-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-900 truncate">
                  {imageTitle || 'Selected Picture'}
                </p>
                {isMainImage && (
                  <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    ⭐ Currently Main Picture
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Warning if Main Image */}
          {isMainImage && (
            <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-800 space-y-2">
              <p className="font-semibold">
                This image is currently the primary picture. Please select which picture should replace it as the new Main Picture:
              </p>
              {alternativeImages.length > 0 ? (
                <div className="grid grid-cols-3 gap-2 pt-1">
                  {alternativeImages.map(alt => (
                    <button
                      key={alt.id}
                      type="button"
                      onClick={() => onSelectAlternativeMain?.(alt.id)}
                      className={`relative rounded-lg overflow-hidden border-2 transition-all p-0.5 ${
                        selectedAlternativeMainId === alt.id
                          ? 'border-amber-500 ring-2 ring-amber-400'
                          : 'border-stone-300 opacity-70 hover:opacity-100'
                      }`}
                    >
                      <img src={alt.url} alt="" className="w-full h-12 object-cover rounded" />
                      {selectedAlternativeMainId === alt.id && (
                        <div className="absolute inset-0 bg-amber-500/20 flex items-center justify-center">
                          <span className="text-[10px] font-bold text-white bg-amber-600 px-1 rounded">New Main</span>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              ) : (
                <p className="text-[11px] text-rose-700">
                  You cannot delete this picture because it is the only picture for this item. Please upload another picture first.
                </p>
              )}
            </div>
          )}

          <p className="text-xs text-stone-500">
            This action will permanently remove the picture from active display.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="px-6 py-4 bg-stone-50 border-t border-stone-200 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 border border-stone-300 rounded-lg hover:bg-stone-100 transition-colors uppercase tracking-wider"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isMainImage && alternativeImages.length === 0}
            onClick={onConfirm}
            className="px-5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-lg shadow-sm hover:shadow transition-colors uppercase tracking-wider disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};
