import React, { useState } from 'react';
import { Download, Package, CheckCircle, Monitor, Smartphone, Apple } from 'lucide-react';
import JSZip from 'jszip';
import { ConversionResult } from '../types';
import { UniversalIconConverter } from '../utils/iconConverter';

interface DownloadSectionProps {
  result: ConversionResult | null;
}

export const DownloadSection: React.FC<DownloadSectionProps> = ({ result }) => {
  const [downloading, setDownloading] = useState<string | null>(null);
  const [downloadComplete, setDownloadComplete] = useState<string | null>(null);

  if (!result) return null;

  const downloadSingle = async (size: number, format: 'ico' | 'png' = 'ico') => {
    const sizeData = result.sizes.find(s => s.size === size);
    if (!sizeData) return;

    const downloadId = `${format}-${size}`;
    setDownloading(downloadId);
    
    try {
      const blob = format === 'ico' ? sizeData.icoBlob : sizeData.pngBlob;
      if (!blob) throw new Error(`No ${format} data for size ${size}`);
      
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `icon-${size}x${size}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadComplete(downloadId);
      setTimeout(() => setDownloadComplete(null), 2000);
    } finally {
      setDownloading(null);
    }
  };

  const downloadAll = async () => {
    setDownloading('all');
    
    try {
      const zip = new JSZip();
      
      // Dossier Windows
      const windowsFolder = zip.folder('Windows');
      windowsFolder?.file('favicon.ico', result.formats.ico);
      for (const sizeData of result.sizes) {
        if (sizeData.icoBlob) {
          windowsFolder?.file(`icon-${sizeData.size}x${sizeData.size}.ico`, sizeData.icoBlob);
        }
      }
      
      // Dossier PNG (universel)
      const pngFolder = zip.folder('PNG-Universal');
      for (const sizeData of result.sizes) {
        if (sizeData.pngBlob) {
          pngFolder?.file(`icon-${sizeData.size}x${sizeData.size}.png`, sizeData.pngBlob);
        }
      }
      
      // Dossier Android
      const androidFolder = zip.folder('Android');
      const androidSizes = [48, 72, 96, 144, 192];
      for (const size of androidSizes) {
        const sizeData = result.sizes.find(s => s.size >= size);
        if (sizeData?.pngBlob) {
          androidFolder?.file(`icon-${size}dp.png`, sizeData.pngBlob);
        }
      }
      
      // Dossier iOS
      const iosFolder = zip.folder('iOS');
      const iosSizes = [57, 72, 76, 114, 120, 144, 152, 180];
      for (const size of iosSizes) {
        const sizeData = result.sizes.find(s => s.size >= size);
        if (sizeData?.pngBlob) {
          iosFolder?.file(`icon-${size}px.png`, sizeData.pngBlob);
        }
      }
      
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'universal-icons.zip';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      setDownloadComplete('all');
      setTimeout(() => setDownloadComplete(null), 2000);
    } finally {
      setDownloading(null);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8" style={{
        boxShadow: '1px -1px 0 1px rgba(34, 211, 238, 0.2), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.2)'
      }}>
        <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-6">
          Télécharger vos icônes universelles
        </h3>
        
        {/* Download All Button */}
        <div className="mb-8">
          <button
            onClick={downloadAll}
            disabled={downloading === 'all'}
            className={`
              w-full flex items-center justify-center space-x-3 px-6 py-4 rounded-xl font-medium text-lg transition-all duration-200
              ${downloading === 'all'
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : downloadComplete === 'all'
                ? 'bg-green-500 text-white'
                : 'bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white shadow-lg hover:shadow-xl'
              }
            `}
          >
            {downloading === 'all' ? (
              <>
                <div className="animate-spin w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                <span>Création du pack universel...</span>
              </>
            ) : downloadComplete === 'all' ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>Téléchargé avec succès !</span>
              </>
            ) : (
              <>
                <Package className="w-5 h-5" />
                <span>Pack Universel (Windows + Mac + Android + iOS)</span>
              </>
            )}
          </button>
        </div>
        
        {/* Platform-specific Downloads */}
        <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-6 uppercase tracking-wide">
            Téléchargements par plateforme
          </h4>
          
          {/* Windows Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Monitor className="w-4 h-4 text-blue-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Windows 11/10</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {result.sizes.map(({ size }) => (
                <button
                  key={`ico-${size}`}
                  onClick={() => downloadSingle(size, 'ico')}
                  disabled={downloading === `ico-${size}`}
                  className={`
                    flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${downloading === `ico-${size}`
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                      : downloadComplete === `ico-${size}`
                      ? 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 hover:border-blue-300 dark:bg-blue-900/20 dark:hover:bg-blue-900/30 dark:text-blue-400 dark:border-blue-800'
                    }
                  `}
                >
                  {downloading === `ico-${size}` ? (
                    <div className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  ) : downloadComplete === `ico-${size}` ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>{size}×{size}.ico</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Universal PNG Section */}
          <div className="mb-6">
            <div className="flex items-center space-x-2 mb-3">
              <Smartphone className="w-4 h-4 text-green-600" />
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Universel (PNG)</span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
              {result.sizes.map(({ size }) => (
                <button
                  key={`png-${size}`}
                  onClick={() => downloadSingle(size, 'png')}
                  disabled={downloading === `png-${size}`}
                  className={`
                    flex items-center justify-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200
                    ${downloading === `png-${size}`
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed dark:bg-gray-700'
                      : downloadComplete === `png-${size}`
                      ? 'bg-green-100 text-green-700 border border-green-300 dark:bg-green-900/20 dark:text-green-400'
                      : 'bg-green-50 hover:bg-green-100 text-green-700 border border-green-200 hover:border-green-300 dark:bg-green-900/20 dark:hover:bg-green-900/30 dark:text-green-400 dark:border-green-800'
                    }
                  `}
                >
                  {downloading === `png-${size}` ? (
                    <div className="animate-spin w-3 h-3 border-2 border-gray-400 border-t-transparent rounded-full"></div>
                  ) : downloadComplete === `png-${size}` ? (
                    <CheckCircle className="w-3 h-3" />
                  ) : (
                    <Download className="w-3 h-3" />
                  )}
                  <span>{size}×{size}.png</span>
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Info Section */}
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="text-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-gray-600 dark:text-gray-400">📁 Pack universel inclut :</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 dark:text-gray-400">
              <div>• Windows: ICO multi-tailles</div>
              <div>• Android: PNG optimisés</div>
              <div>• iOS: PNG toutes tailles</div>
              <div>• Universel: PNG standards</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};