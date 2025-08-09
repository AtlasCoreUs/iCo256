export interface ConversionSize {
  size: number;
  canvas?: HTMLCanvasElement;
  dataUrl?: string;
  blob?: Blob;
  pngBlob?: Blob;
  icoBlob?: Blob;
}

export interface ConversionResult {
  id: string;
  originalFile: File;
  timestamp: number;
  sizes: ConversionSize[];
  removeBackground: boolean;
  formats: {
    ico: Blob;
    png: Blob[];
    svg?: Blob;
  };
}

export interface AppSettings {
  theme: 'light' | 'dark';
  removeBackground: boolean;
}

export const ICO_SIZES = [16, 32, 48, 64, 128, 256] as const;
export type IcoSize = typeof ICO_SIZES[number];

export const PLATFORM_FORMATS = {
  windows: ['ico', 'png'],
  mac: ['icns', 'png'],
  android: ['png'],
  ios: ['png'],
  web: ['ico', 'png', 'svg']
} as const;