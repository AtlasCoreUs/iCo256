import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { ConversionSettings } from './components/ConversionSettings';
import { PreviewGrid } from './components/PreviewGrid';
import { DownloadSection } from './components/DownloadSection';
import { ThemeToggle } from './components/ThemeToggle';
import { useImageConverter } from './hooks/useImageConverter';
import { RotateCcw } from 'lucide-react';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [removeBackground, setRemoveBackground] = useState(false);
  const { isProcessing, currentResult, error, convertImage, clearResult } = useImageConverter();

  // Initialize theme from localStorage
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('ico256-theme') as 'light' | 'dark' | null;
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
      
      setTheme(initialTheme);
      if (initialTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Erreur lors de l\'initialisation du thème:', error);
      // Utiliser le thème par défaut en cas d'erreur
      setTheme('light');
    }
  }, []);

  const toggleTheme = () => {
    try {
      const newTheme = theme === 'light' ? 'dark' : 'light';
      setTheme(newTheme);
      localStorage.setItem('ico256-theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    } catch (error) {
      console.warn('Erreur lors du changement de thème:', error);
    }
  };

  const handleFileSelect = async (file: File) => {
    try {
      await convertImage(file, removeBackground);
    } catch (err) {
      console.error('Échec de la conversion:', err);
      // L'erreur sera affichée par le composant ImageUpload via le state error
    }
  };

  const handleStartOver = () => {
    clearResult();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <ThemeToggle theme={theme} onToggle={toggleTheme} />
      
      <div className="container mx-auto px-6 py-8 max-w-6xl">
        <Header />
        
        <div className="space-y-8">
          {!currentResult ? (
            <>
              <ImageUpload 
                onFileSelect={handleFileSelect}
                isProcessing={isProcessing}
                error={error}
              />
              
              <ConversionSettings
                removeBackground={removeBackground}
                onToggleBackground={setRemoveBackground}
                disabled={isProcessing}
              />
            </>
          ) : (
            <>
              <div className="text-center">
                <button
                  onClick={handleStartOver}
                  className="inline-flex items-center space-x-2 px-6 py-3 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 shadow-sm hover:shadow-md"
                  aria-label="Recommencer la conversion"
                  title="Recommencer avec une nouvelle image"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Recommencer</span>
                </button>
              </div>
              
              <PreviewGrid result={currentResult} />
              <DownloadSection result={currentResult} />
            </>
          )}
        </div>
        
        {/* Footer */}
        <footer className="mt-16 text-center">
          <div className="inline-flex items-center space-x-4 px-6 py-3 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700" style={{
            boxShadow: '1px -1px 0 1px rgba(34, 211, 238, 0.2), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.2)'
          }}>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Built with ❤️ for developers and designers
            </span>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              Client-side processing • No uploads • Privacy focused
            </span>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;