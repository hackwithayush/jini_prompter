/**
 * Validates, resizes, and compresses an image on the client-side.
 * Resolves to a File object optimized for API transfer.
 */
export async function optimizeImage(file: File): Promise<File> {
  const MAX_SIZE_MB = 10;
  const MAX_DIMENSION = 2048;
  const QUALITY = 0.85;

  // 1. Pre-validation checks
  if (file.size > MAX_SIZE_MB * 1024 * 1024) {
    // We will still try to compress it, but warn if it's absurdly large
    if (file.size > 25 * 1024 * 1024) {
      throw new Error(`File is too large (${(file.size / 1024 / 1024).toFixed(1)}MB). Maximum allowed is ${MAX_SIZE_MB}MB.`);
    }
  }

  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
    throw new Error('Unsupported file format. Please upload a JPEG, PNG, or WebP image.');
  }

  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to parse image data'));
      img.onload = () => {
        let { width, height } = img;

        // Calculate new dimensions if larger than MAX_DIMENSION
        if (width > MAX_DIMENSION || height > MAX_DIMENSION) {
          if (width > height) {
            height = Math.round((height * MAX_DIMENSION) / width);
            width = MAX_DIMENSION;
          } else {
            width = Math.round((width * MAX_DIMENSION) / height);
            height = MAX_DIMENSION;
          }
        }

        // Create canvas and draw image
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          reject(new Error('Failed to get canvas context for optimization'));
          return;
        }

        // White background for transparent PNGs converted to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        // Convert to Blob
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Canvas to Blob conversion failed'));
              return;
            }
            
            // Create a new File from the blob
            const ext = 'jpg';
            const optimizedFile = new File([blob], `optimized_${Date.now()}.${ext}`, {
              type: 'image/jpeg',
              lastModified: Date.now(),
            });
            
            resolve(optimizedFile);
          },
          'image/jpeg',
          QUALITY
        );
      };
      
      img.src = e.target?.result as string;
    };
    
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an optimized file to the staging API and returns the URL.
 */
export async function stageImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append('image', file);

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: 'Unknown upload error' }));
    throw new Error(err.error || 'Failed to stage image');
  }

  const data = await response.json();
  return data.url;
}
