'use client';

import React, { useState, useRef } from 'react';
import ReactCrop, { Crop, PixelCrop, centerCrop, makeAspectCrop } from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import { getCroppedAndCompressedImage } from '@/lib/image-utils';
import { X, Crop as CropIcon, Sparkles } from 'lucide-react';

interface ImageCropperModalProps {
  imageSrc: string;
  onConfirm: (compressedBlob: Blob) => Promise<void> | void;
  onCancel: () => void;
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 80,
      },
      aspect,
      mediaWidth,
      mediaHeight
    ),
    mediaWidth,
    mediaHeight
  );
}

export function ImageCropperModal({ imageSrc, onConfirm, onCancel }: ImageCropperModalProps) {
  const [crop, setCrop] = useState<Crop>();
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>();
  const [isProcessing, setIsProcessing] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget;
    setCrop(centerAspectCrop(width, height, 1 / 1));
  }

  const handleSave = async () => {
    if (!imageRef.current || !completedCrop) return;

    try {
      setIsProcessing(true);
      const compressedBlob = await getCroppedAndCompressedImage(
        imageRef.current,
        completedCrop,
        1000,
        0.82
      );
      await onConfirm(compressedBlob);
    } catch (err) {
      console.error('Error cropping image:', err);
      alert('Failed to crop and compress image. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <div className="relative w-full max-w-xl bg-[#0c0b14] border border-white/10 rounded-2xl p-6 shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-white/10">
          <div className="flex items-center gap-2">
            <CropIcon className="w-5 h-5 text-wizard-purple-glow" />
            <h3 className="text-white font-bold text-base uppercase font-sans">
              1:1 Aspect Ratio Cropper
            </h3>
          </div>
          <button
            onClick={onCancel}
            className="text-white/60 hover:text-white p-1 rounded-full transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cropper Work Area */}
        <div className="flex-1 overflow-auto my-4 flex items-center justify-center bg-black/50 rounded-xl p-2 min-h-[300px]">
          <ReactCrop
            crop={crop}
            onChange={(_, percentCrop) => setCrop(percentCrop)}
            onComplete={(c) => setCompletedCrop(c)}
            aspect={1}
            circularCrop={false}
            className="max-h-[55vh]"
          >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              ref={imageRef}
              src={imageSrc}
              alt="Crop target"
              onLoad={onImageLoad}
              className="max-h-[55vh] object-contain"
            />
          </ReactCrop>
        </div>

        {/* Info hint */}
        <p className="text-xs text-white/50 text-center font-mono">
          Drag to frame the product. The image will be auto-compressed to WebP (&lt;150KB) to save storage.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10 mt-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isProcessing}
            className="px-4 py-2 rounded-lg border border-white/15 text-white/70 hover:text-white font-mono text-xs uppercase"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            disabled={isProcessing}
            className="px-6 py-2 rounded-lg bg-white text-black font-mono text-xs font-bold uppercase tracking-wider hover:bg-wizard-purple-glow hover:text-white transition flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>{isProcessing ? 'Compressing...' : 'Crop & Save'}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

