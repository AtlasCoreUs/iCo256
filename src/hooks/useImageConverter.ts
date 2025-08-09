import { useState, useCallback } from 'react';
import { ConversionResult } from '../types';
import { UniversalIconConverter } from '../utils/iconConverter';

export const useImageConverter = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentResult, setCurrentResult] = useState<ConversionResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const convertImage = useCallback(async (file: File, removeBackground: boolean = false) => {
    setIsProcessing(true);
    setError(null);
    setCurrentResult(null);

    try {
      if (!UniversalIconConverter.validateFile(file)) {
        throw new Error('Type de fichier invalide ou taille trop importante. Utilisez PNG/JPEG/JPG/WebP/SVG sous 15MB.');
      }

      console.log('Starting conversion for:', file.name);
      const sizes = await UniversalIconConverter.processImage(file, removeBackground);
      console.log('Conversion completed, sizes generated:', sizes.length);
      
      if (sizes.length === 0) {
        throw new Error('Aucune icône générée. Veuillez réessayer avec une autre image.');
      }

      // Créer le fichier ICO multi-tailles
      const multiIco = await UniversalIconConverter.createMultiSizeICO(sizes);
      const pngFiles = sizes.map(s => s.pngBlob!);

      const result: ConversionResult = {
        id: `conversion_${Date.now()}`,
        originalFile: file,
        timestamp: Date.now(),
        sizes,
        removeBackground,
        formats: {
          ico: multiIco,
          png: pngFiles
        }
      };

      setCurrentResult(result);
      
      // Sauvegarder dans localStorage pour l'historique
      try {
        const history = JSON.parse(localStorage.getItem('ico256-history') || '[]');
        const newHistory = [result, ...history.slice(0, 4)]; // Garder les 5 derniers
        localStorage.setItem('ico256-history', JSON.stringify(newHistory));
      } catch (e) {
        console.warn('Could not save to localStorage:', e);
      }

      return result;
    } catch (err) {
      console.error('Conversion error:', err);
      const errorMessage = err instanceof Error ? err.message : 'Échec de la conversion';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsProcessing(false);
    }
  }, []);

  const clearResult = useCallback(() => {
    // Nettoyer les URLs d'objets pour éviter les fuites mémoire
    if (currentResult) {
      currentResult.sizes.forEach(size => {
        if (size.dataUrl && size.dataUrl.startsWith('blob:')) {
          URL.revokeObjectURL(size.dataUrl);
        }
      });
    }
    setCurrentResult(null);
    setError(null);
  }, [currentResult]);

  return {
    isProcessing,
    currentResult,
    error,
    convertImage,
    clearResult
  };
};