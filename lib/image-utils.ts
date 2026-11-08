import { supabase, WIZARD_TREE_COMPANY_ID } from '@/lib/supabase/client';

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

/**
 * Crops an HTMLImageElement to 1:1 aspect ratio and compresses it to WebP format.
 * Reduces file sizes from 5MB+ down to ~80KB-150KB.
 */
export async function getCroppedAndCompressedImage(
  image: HTMLImageElement,
  crop: CropArea,
  maxDimension = 1000,
  quality = 0.82
): Promise<Blob> {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    throw new Error('Canvas 2D context not available');
  }

  // Calculate natural scale ratio
  const scaleX = image.naturalWidth / image.width;
  const scaleY = image.naturalHeight / image.height;

  // The actual source rectangle on natural image
  const sourceX = crop.x * scaleX;
  const sourceY = crop.y * scaleY;
  const sourceWidth = crop.width * scaleX;
  const sourceHeight = crop.height * scaleY;

  // Force output to square (1:1) with maxDimension boundary
  const targetSize = Math.min(Math.max(sourceWidth, sourceHeight), maxDimension);
  canvas.width = targetSize;
  canvas.height = targetSize;

  // Render cropped region
  ctx.imageSmoothingQuality = 'high';
  ctx.drawImage(
    image,
    sourceX,
    sourceY,
    sourceWidth,
    sourceHeight,
    0,
    0,
    targetSize,
    targetSize
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Canvas image conversion failed'));
          return;
        }
        resolve(blob);
      },
      'image/webp',
      quality
    );
  });
}

/**
 * Uploads a compressed image blob to the wizard_tree_assets Supabase Storage bucket.
 * Returns the public CDN URL.
 */
export async function uploadProductImage(
  fileBlob: Blob,
  companyId = WIZARD_TREE_COMPANY_ID
): Promise<string> {
  const fileName = `products/${companyId}/${Date.now()}-${Math.random().toString(36).substring(2, 9)}.webp`;

  const { error: uploadError } = await supabase.storage
    .from('wizard_tree_assets')
    .upload(fileName, fileBlob, {
      contentType: 'image/webp',
      cacheControl: '31536000',
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Failed to upload to storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage
    .from('wizard_tree_assets')
    .getPublicUrl(fileName);

  return data.publicUrl;
}

