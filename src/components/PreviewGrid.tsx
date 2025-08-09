import React from 'react';
import { ConversionResult, ICO_SIZES } from '../types';

interface PreviewGridProps {
  result: ConversionResult | null;
}

export const PreviewGrid: React.FC<PreviewGridProps> = ({ result }) => {
  if (!result) return null;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8" style={{
        boxShadow: '1px -1px 0 1px rgba(34, 211, 238, 0.2), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.2)'
      }}>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 text-center">
          Icônes générées
        </h2>
        
        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {ICO_SIZES.map((size) => {
            const sizeData = result.sizes.find(s => s.size === size);
            return (
              <div
                key={size}
                className="bg-gray-50 dark:bg-gray-700 rounded-xl p-4 text-center border-2 border-gray-200 dark:border-gray-600"
              >
                <div 
                  className="mx-auto mb-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-300 dark:border-gray-600 flex items-center justify-center"
                  style={{
                    width: Math.max(size, 48),
                    height: Math.max(size, 48)
                  }}
                >
                  {sizeData?.dataUrl ? (
                    <img
                      src={sizeData.dataUrl}
                      alt={`Icône ${size}x${size}`}
                      width={size}
                      height={size}
                      className="rounded icon-preview"
                      style={{ imageRendering: size <= 64 ? 'pixelated' : 'auto' }}
                      onError={(e) => {
                        console.warn(`Erreur lors du chargement de l'image ${size}x${size}:`, e);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="text-xs text-gray-400 dark:text-gray-500">
                      Aucune image
                    </div>
                  )}
                </div>
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {size}×{size}
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {sizeData?.pngBlob ? `${(sizeData.pngBlob.size / 1024).toFixed(1)}KB` : ''}
                </p>
              </div>
            );
          })}
        </div>
        
        <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600 dark:text-gray-400">Fichier original :</span>
            <span className="font-medium text-gray-900 dark:text-gray-100">
              {result.originalFile.name}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm mt-1">
            <span className="text-gray-600 dark:text-gray-400">Suppression arrière-plan :</span>
            <span className={`font-medium ${result.removeBackground ? 'text-green-600' : 'text-gray-500'}`}>
              {result.removeBackground ? 'Activée' : 'Désactivée'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};