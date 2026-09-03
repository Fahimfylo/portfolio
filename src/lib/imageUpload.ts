export interface CompressedImage {
  data: string;
  contentType: string;
  filename: string;
}

const MAX_DIM = 1600;
const JPEG_QUALITY = 0.85;

export function compressImage(file: File): Promise<CompressedImage> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith('image/')) {
      reject(new Error('Please choose an image file'));
      return;
    }

    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Could not read file'));
    reader.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error('Could not decode image'));
      img.onload = () => {
        const { width, height } = img;
        const scale = Math.min(1, MAX_DIM / Math.max(width, height));
        const w = Math.round(width * scale);
        const h = Math.round(height * scale);

        const canvas = document.createElement('canvas');
        canvas.width = w;
        canvas.height = h;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas not supported'));
          return;
        }
        ctx.drawImage(img, 0, 0, w, h);

        const isPng = file.type === 'image/png';
        const isGif = file.type === 'image/gif';
        const rawContentType = isPng || isGif ? file.type : 'image/jpeg';
        const dataUrl = rawContentType === 'image/jpeg'
          ? canvas.toDataURL('image/jpeg', JPEG_QUALITY)
          : canvas.toDataURL(rawContentType);

        resolve({
          data: dataUrl.split(',')[1],
          contentType: rawContentType,
          filename: file.name.replace(/\.[^.]+$/, '') + (rawContentType === 'image/jpeg' ? '.jpg' : ''),
        });
      };
      img.src = reader.result as string;
    };
    reader.readAsDataURL(file);
  });
}