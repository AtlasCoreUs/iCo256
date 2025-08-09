import { ConversionSize, ICO_SIZES } from '../types';

export class UniversalIconConverter {
  static async processImage(
    file: File, 
    removeBackground: boolean = false
  ): Promise<ConversionSize[]> {
    console.log('🚀 Starting HIGH QUALITY processing for:', file.name);
    
    const originalImg = await this.loadImage(file);
    const results: ConversionSize[] = [];

    // Créer une version haute résolution de base
    const baseCanvas = await this.createHighQualityBase(originalImg, removeBackground);
    
    // Pour chaque taille, utiliser l'algorithme optimal
    for (const size of ICO_SIZES) {
      console.log(`📐 Processing HIGH QUALITY size: ${size}x${size}`);
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) continue;

      canvas.width = size;
      canvas.height = size;

      // Configuration ULTRA haute qualité
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      
      // Utiliser différents algorithmes selon la taille
      if (size <= 32) {
        // Pour les petites tailles : algorithme spécialisé
        await this.renderSmallIcon(ctx, baseCanvas, size);
      } else if (size <= 128) {
        // Pour les tailles moyennes : algorithme équilibré
        await this.renderMediumIcon(ctx, baseCanvas, size);
      } else {
        // Pour les grandes tailles : algorithme haute fidélité
        await this.renderLargeIcon(ctx, baseCanvas, size);
      }

      // Post-traitement pour améliorer la netteté
      this.enhanceSharpness(ctx, size);

      // Générer tous les formats
      const dataUrl = canvas.toDataURL('image/png', 1.0);
      const pngBlob = await this.canvasToBlob(canvas, 'image/png', 1.0);
      const icoBlob = await this.createPerfectICO(canvas);

      results.push({
        size,
        canvas,
        dataUrl,
        blob: pngBlob,
        pngBlob,
        icoBlob
      });
    }

    console.log('✅ HIGH QUALITY processing completed:', results.length, 'sizes');
    return results;
  }

  // Créer une base haute résolution pour un meilleur redimensionnement
  private static async createHighQualityBase(
    originalImg: HTMLImageElement, 
    removeBackground: boolean
  ): Promise<HTMLCanvasElement> {
    const maxSize = Math.max(originalImg.width, originalImg.height);
    const targetSize = Math.max(512, maxSize); // Au moins 512px pour la base
    
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d')!;
    
    canvas.width = targetSize;
    canvas.height = targetSize;
    
    // Configuration optimale
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    
    // Fond selon l'option
    if (!removeBackground) {
      ctx.fillStyle = '#FFFFFF';
      ctx.fillRect(0, 0, targetSize, targetSize);
    }
    
    // Centrer et redimensionner l'image
    const scale = Math.min(targetSize / originalImg.width, targetSize / originalImg.height);
    const scaledWidth = originalImg.width * scale;
    const scaledHeight = originalImg.height * scale;
    const offsetX = (targetSize - scaledWidth) / 2;
    const offsetY = (targetSize - scaledHeight) / 2;
    
    ctx.drawImage(originalImg, offsetX, offsetY, scaledWidth, scaledHeight);
    
    return canvas;
  }

  // Algorithme spécialisé pour petites icônes (16x16, 32x32)
  private static async renderSmallIcon(
    ctx: CanvasRenderingContext2D, 
    sourceCanvas: HTMLCanvasElement, 
    size: number
  ): Promise<void> {
    console.log(`🔍 DESKTOP OPTIMIZATION for ${size}x${size}`);
    
    // ÉTAPE 1: Créer une version intermédiaire haute résolution
    const intermediateSize = size * 4; // 4x la taille finale pour plus de détails
    const tempCanvas = document.createElement('canvas');
    const tempCtx = tempCanvas.getContext('2d')!;
    
    tempCanvas.width = intermediateSize;
    tempCanvas.height = intermediateSize;
    
    // Configuration ultra-haute qualité
    tempCtx.imageSmoothingEnabled = true;
    tempCtx.imageSmoothingQuality = 'high';
    
    // Dessiner à 4x la résolution
    tempCtx.drawImage(sourceCanvas, 0, 0, intermediateSize, intermediateSize);
    
    // ÉTAPE 2: Appliquer un filtre de netteté AVANT le redimensionnement
    this.applySuperSharpening(tempCtx, intermediateSize);
    
    // ÉTAPE 3: Redimensionner avec algorithme spécialisé bureau
    ctx.imageSmoothingEnabled = false; // Désactiver le lissage pour plus de netteté
    ctx.drawImage(tempCanvas, 0, 0, size, size);
    
    // ÉTAPE 4: Post-traitement spécial bureau Windows
    this.enhanceDesktopIcon(ctx, size);
  }

  // Algorithme pour tailles moyennes (48x48, 64x64)
  private static async renderMediumIcon(
    ctx: CanvasRenderingContext2D, 
    sourceCanvas: HTMLCanvasElement, 
    size: number
  ): Promise<void> {
    // Redimensionnement direct avec configuration optimale
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, size, size);
  }

  // Algorithme pour grandes tailles (128x128, 256x256)
  private static async renderLargeIcon(
    ctx: CanvasRenderingContext2D, 
    sourceCanvas: HTMLCanvasElement, 
    size: number
  ): Promise<void> {
    // Pour les grandes tailles, préserver le maximum de détails
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, size, size);
    
    // Appliquer un léger sharpening
    this.applyUnsharpMask(ctx, size);
  }

  // Améliorer la netteté avec un filtre de convolution
  private static enhanceSharpness(ctx: CanvasRenderingContext2D, size: number): void {
    if (size > 64) return; // Seulement pour les petites tailles
    
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    const width = size;
    const height = size;
    
    // Filtre de netteté simple
    const sharpenKernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];
    
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB seulement
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * sharpenKernel[kernelIdx];
            }
          }
          const outputIdx = (y * width + x) * 4 + c;
          output[outputIdx] = Math.max(0, Math.min(255, sum));
        }
        // Copier le canal alpha
        const alphaIdx = (y * width + x) * 4 + 3;
        output[alphaIdx] = data[alphaIdx];
      }
    }
    
    // Appliquer le filtre avec une intensité réduite
    for (let i = 0; i < data.length; i += 4) {
      if (i >= width * 4 && i < (height - 1) * width * 4) {
        const x = (i / 4) % width;
        if (x > 0 && x < width - 1) {
          data[i] = Math.round(data[i] * 0.7 + output[i] * 0.3);     // R
          data[i + 1] = Math.round(data[i + 1] * 0.7 + output[i + 1] * 0.3); // G
          data[i + 2] = Math.round(data[i + 2] * 0.7 + output[i + 2] * 0.3); // B
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // NOUVEAU: Super-sharpening pour les icônes de bureau
  private static applySuperSharpening(ctx: CanvasRenderingContext2D, size: number): void {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // Filtre de netteté ULTRA pour bureau Windows
    const ultraSharpenKernel = [
      -1, -1, -1,
      -1,  9, -1,
      -1, -1, -1
    ];
    
    const output = new Uint8ClampedArray(data.length);
    
    for (let y = 1; y < size - 1; y++) {
      for (let x = 1; x < size - 1; x++) {
        for (let c = 0; c < 3; c++) {
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * size + (x + kx)) * 4 + c;
              const kernelIdx = (ky + 1) * 3 + (kx + 1);
              sum += data[idx] * ultraSharpenKernel[kernelIdx];
            }
          }
          const outputIdx = (y * size + x) * 4 + c;
          output[outputIdx] = Math.max(0, Math.min(255, sum));
        }
        const alphaIdx = (y * size + x) * 4 + 3;
        output[alphaIdx] = data[alphaIdx];
      }
    }
    
    // Mélanger avec l'original (50% netteté, 50% original)
    for (let i = 0; i < data.length; i += 4) {
      if (i >= size * 4 && i < (size - 1) * size * 4) {
        const x = (i / 4) % size;
        if (x > 0 && x < size - 1) {
          data[i] = Math.round(data[i] * 0.5 + output[i] * 0.5);
          data[i + 1] = Math.round(data[i + 1] * 0.5 + output[i + 1] * 0.5);
          data[i + 2] = Math.round(data[i + 2] * 0.5 + output[i + 2] * 0.5);
        }
      }
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // NOUVEAU: Optimisation spéciale pour icônes de bureau Windows
  private static enhanceDesktopIcon(ctx: CanvasRenderingContext2D, size: number): void {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // Augmenter le contraste pour le bureau
    const contrast = 1.3;
    const factor = (259 * (contrast + 1)) / (259 - contrast);
    
    for (let i = 0; i < data.length; i += 4) {
      // Augmenter le contraste RGB
      data[i] = Math.max(0, Math.min(255, factor * (data[i] - 128) + 128));     // R
      data[i + 1] = Math.max(0, Math.min(255, factor * (data[i + 1] - 128) + 128)); // G
      data[i + 2] = Math.max(0, Math.min(255, factor * (data[i + 2] - 128) + 128)); // B
      
      // Préserver l'alpha
      // data[i + 3] reste inchangé
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // Appliquer un masque de netteté (unsharp mask)
  private static applyUnsharpMask(ctx: CanvasRenderingContext2D, size: number): void {
    const imageData = ctx.getImageData(0, 0, size, size);
    const data = imageData.data;
    
    // Créer une version floutée
    const blurred = new Uint8ClampedArray(data.length);
    const radius = 1;
    
    for (let y = 0; y < size; y++) {
      for (let x = 0; x < size; x++) {
        let r = 0, g = 0, b = 0, count = 0;
        
        for (let dy = -radius; dy <= radius; dy++) {
          for (let dx = -radius; dx <= radius; dx++) {
            const ny = Math.max(0, Math.min(size - 1, y + dy));
            const nx = Math.max(0, Math.min(size - 1, x + dx));
            const idx = (ny * size + nx) * 4;
            
            r += data[idx];
            g += data[idx + 1];
            b += data[idx + 2];
            count++;
          }
        }
        
        const idx = (y * size + x) * 4;
        blurred[idx] = r / count;
        blurred[idx + 1] = g / count;
        blurred[idx + 2] = b / count;
        blurred[idx + 3] = data[idx + 3];
      }
    }
    
    // Appliquer l'unsharp mask
    const amount = 0.5;
    for (let i = 0; i < data.length; i += 4) {
      data[i] = Math.max(0, Math.min(255, data[i] + amount * (data[i] - blurred[i])));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + amount * (data[i + 1] - blurred[i + 1])));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + amount * (data[i + 2] - blurred[i + 2])));
    }
    
    ctx.putImageData(imageData, 0, 0);
  }

  // Créer un ICO parfaitement compatible
  private static async createPerfectICO(canvas: HTMLCanvasElement): Promise<Blob> {
    const size = canvas.width;
    const ctx = canvas.getContext('2d')!;
    
    // Obtenir les données RGBA
    const imageData = ctx.getImageData(0, 0, size, size);
    const pixels = imageData.data;
    
    // Calculer les tailles
    const headerSize = 6;
    const directorySize = 16;
    const bmpHeaderSize = 40;
    const pixelDataSize = size * size * 4;
    const maskDataSize = Math.ceil(size / 8) * size;
    const totalImageSize = bmpHeaderSize + pixelDataSize + maskDataSize;
    const totalFileSize = headerSize + directorySize + totalImageSize;
    
    const buffer = new ArrayBuffer(totalFileSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    let offset = 0;
    
    // En-tête ICONDIR
    view.setUint16(offset, 0, true);      // Reserved
    offset += 2;
    view.setUint16(offset, 1, true);      // Type (ICO)
    offset += 2;
    view.setUint16(offset, 1, true);      // Count
    offset += 2;
    
    // ICONDIRENTRY
    view.setUint8(offset, size === 256 ? 0 : size); // Width
    offset += 1;
    view.setUint8(offset, size === 256 ? 0 : size); // Height
    offset += 1;
    view.setUint8(offset, 0);             // ColorCount
    offset += 1;
    view.setUint8(offset, 0);             // Reserved
    offset += 1;
    view.setUint16(offset, 1, true);      // Planes
    offset += 2;
    view.setUint16(offset, 32, true);     // BitCount
    offset += 2;
    view.setUint32(offset, totalImageSize, true); // BytesInRes
    offset += 4;
    view.setUint32(offset, headerSize + directorySize, true); // ImageOffset
    offset += 4;
    
    // BITMAPINFOHEADER
    view.setUint32(offset, 40, true);           // biSize
    offset += 4;
    view.setInt32(offset, size, true);          // biWidth
    offset += 4;
    view.setInt32(offset, size * 2, true);      // biHeight (double pour ICO)
    offset += 4;
    view.setUint16(offset, 1, true);            // biPlanes
    offset += 2;
    view.setUint16(offset, 32, true);           // biBitCount
    offset += 2;
    view.setUint32(offset, 0, true);            // biCompression
    offset += 4;
    view.setUint32(offset, pixelDataSize, true); // biSizeImage
    offset += 4;
    view.setInt32(offset, 0, true);             // biXPelsPerMeter
    offset += 4;
    view.setInt32(offset, 0, true);             // biYPelsPerMeter
    offset += 4;
    view.setUint32(offset, 0, true);            // biClrUsed
    offset += 4;
    view.setUint32(offset, 0, true);            // biClrImportant
    offset += 4;
    
    // Données pixel (BGRA, de bas en haut)
    for (let y = size - 1; y >= 0; y--) {
      for (let x = 0; x < size; x++) {
        const pixelIndex = (y * size + x) * 4;
        const r = pixels[pixelIndex];
        const g = pixels[pixelIndex + 1];
        const b = pixels[pixelIndex + 2];
        const a = pixels[pixelIndex + 3];
        
        bytes[offset++] = b; // Blue
        bytes[offset++] = g; // Green
        bytes[offset++] = r; // Red
        bytes[offset++] = a; // Alpha
      }
    }
    
    // Masque AND
    const maskBytesPerRow = Math.ceil(size / 8);
    for (let y = 0; y < size; y++) {
      for (let byteIndex = 0; byteIndex < maskBytesPerRow; byteIndex++) {
        bytes[offset++] = 0; // Tous les pixels visibles
      }
    }
    
    return new Blob([buffer], { type: 'image/x-icon' });
  }

  // Créer un fichier multi-ICO
  static async createMultiSizeICO(sizes: ConversionSize[]): Promise<Blob> {
    console.log('🔧 Creating PERFECT multi-size ICO');
    
    const sortedSizes = [...sizes].sort((a, b) => a.size - b.size);
    
    const headerSize = 6;
    const directorySize = sortedSizes.length * 16;
    let totalSize = headerSize + directorySize;
    
    const iconData = await Promise.all(
      sortedSizes.map(async ({ canvas, size }) => {
        if (!canvas) throw new Error(`No canvas for size ${size}`);
        const icoBlob = await this.createPerfectICO(canvas);
        const arrayBuffer = await icoBlob.arrayBuffer();
        const imageData = new Uint8Array(arrayBuffer.slice(22));
        return { size, data: imageData };
      })
    );
    
    let dataOffset = headerSize + directorySize;
    const entries = iconData.map(({ size, data }) => {
      const entry = { size, data, offset: dataOffset, length: data.length };
      dataOffset += data.length;
      return entry;
    });
    
    totalSize = dataOffset;
    
    const buffer = new ArrayBuffer(totalSize);
    const view = new DataView(buffer);
    const bytes = new Uint8Array(buffer);
    let offset = 0;
    
    // En-tête ICONDIR
    view.setUint16(offset, 0, true);
    offset += 2;
    view.setUint16(offset, 1, true);
    offset += 2;
    view.setUint16(offset, entries.length, true);
    offset += 2;
    
    // Entrées
    for (const entry of entries) {
      view.setUint8(offset, entry.size === 256 ? 0 : entry.size);
      offset += 1;
      view.setUint8(offset, entry.size === 256 ? 0 : entry.size);
      offset += 1;
      view.setUint8(offset, 0);
      offset += 1;
      view.setUint8(offset, 0);
      offset += 1;
      view.setUint16(offset, 1, true);
      offset += 2;
      view.setUint16(offset, 32, true);
      offset += 2;
      view.setUint32(offset, entry.length, true);
      offset += 4;
      view.setUint32(offset, entry.offset, true);
      offset += 4;
    }
    
    // Données
    for (const entry of entries) {
      bytes.set(entry.data, offset);
      offset += entry.data.length;
    }
    
    console.log('✅ PERFECT multi-size ICO created');
    return new Blob([buffer], { type: 'image/x-icon' });
  }

  private static loadImage(file: File): Promise<HTMLImageElement> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => {
        URL.revokeObjectURL(img.src);
        resolve(img);
      };
      img.onerror = () => {
        URL.revokeObjectURL(img.src);
        reject(new Error('Failed to load image'));
      };
      img.src = URL.createObjectURL(file);
    });
  }

  private static canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number = 1.0): Promise<Blob> {
    return new Promise((resolve) => {
      canvas.toBlob((blob) => {
        resolve(blob || new Blob());
      }, type, quality);
    });
  }

  static validateFile(file: File): boolean {
    const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'image/svg+xml'];
    const maxSize = 15 * 1024 * 1024;
    return validTypes.includes(file.type) && file.size <= maxSize;
  }
}