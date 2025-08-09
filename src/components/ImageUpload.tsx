import React, { useCallback, useState } from 'react';
import { Upload, Image, AlertCircle, Info } from 'lucide-react';

interface ImageUploadProps {
  onFileSelect: (file: File) => void;
  isProcessing: boolean;
  error: string | null;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ 
  onFileSelect, 
  isProcessing, 
  error 
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        console.warn('Type de fichier non supporté:', file.type);
      }
    }
  }, [onFileSelect]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/')) {
        onFileSelect(file);
      } else {
        console.warn('Type de fichier non supporté:', file.type);
      }
    }
  }, [onFileSelect]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Info importante Windows */}
      <div className="mb-8 p-2 bg-gradient-to-r from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-2 border-red-700 dark:border-red-700 rounded-lg text-center relative shadow-md" style={{ marginTop: '-15px', borderColor: '#dc2626 !important' }}>
        <div className="flex items-center justify-center space-x-1 mb-1 relative">
          <h4 className="text-xs font-bold bg-gradient-to-r from-blue-700 via-indigo-700 to-purple-700 bg-clip-text text-transparent dark:from-blue-300 dark:via-indigo-300 dark:to-purple-300">
            🪟 UTILISATEURS WINDOWS - LIRE IMPÉRATIVEMENT
          </h4>
          <button
            onMouseEnter={() => setShowTooltip(true)}
            onMouseLeave={() => setShowTooltip(false)}
            className="text-blue-500 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-200 transition-colors relative"
            aria-label="Afficher/masquer les instructions Windows"
          >
            <Info className="w-4 h-4" />
            
            {/* Tooltip */}
            {showTooltip && (
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 w-96 p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-xl z-50 text-left">
                <div className="text-xs text-gray-700 dark:text-gray-300 space-y-2">
                  <h5 className="font-semibold text-red-600 dark:text-red-400 mb-2">
                    ⚠️ Changer la taille max des icônes bureau via le Registre
                  </h5>
                  
                  <div className="p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded text-xs">
                    <strong className="text-red-600 dark:text-red-400">Précaution :</strong> touche aux paramètres racine → fais une sauvegarde du registre avant (Win+R → regedit → Fichier → Exporter).
                  </div>
                  
                  <div>
                    <strong>Étapes :</strong>
                    <ol className="list-decimal list-inside mt-1 space-y-1 ml-2 text-xs">
                      <li><strong>Ouvre l'éditeur de registre :</strong><br/>Win + R → tape <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">regedit</code> → Entrée</li>
                      <li><strong>Navigue jusqu'à :</strong><br/>
                        <code className="bg-gray-100 dark:bg-gray-700 px-1 py-1 rounded text-xs block mt-1">
                          HKEY_CURRENT_USER\Software\Microsoft\Windows\Shell\Bags\1\Desktop
                        </code>
                      </li>
                      <li><strong>Cherche la valeur</strong> <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">IconSize</code></li>
                      <li><strong>Si elle n'existe pas :</strong> clic droit → Nouveau → Valeur DWORD (32 bits) → nomme-la <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">IconSize</code></li>
                      <li><strong>Double-clique sur IconSize et mets :</strong>
                        <ul className="list-disc list-inside ml-2 mt-1 text-xs">
                          <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">32</code> (petites)</li>
                          <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">48</code> (moyennes)</li>
                          <li><code className="bg-gray-100 dark:bg-gray-700 px-1 rounded text-xs">256</code> (très grandes, PNG haute résolution)</li>
                        </ul>
                      </li>
                      <li><strong>Valide, ferme le registre.</strong></li>
                      <li><strong>Redémarre l'explorateur :</strong> Ctrl + Shift + Échap → Gestionnaire des tâches → Explorateur Windows → clic droit → Redémarrer (ou redémarre le PC)</li>
                    </ol>
                  </div>
                </div>
                
                {/* Flèche du tooltip */}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-white dark:border-t-gray-800"></div>
              </div>
            )}
          </button>
        </div>
        <p className="text-xs bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 bg-clip-text text-transparent dark:from-blue-400 dark:via-indigo-400 dark:to-purple-400 leading-tight">
          Pour des icônes parfaites sur le bureau, modifiez la taille via le registre Windows
        </p>
      </div>
      
      <div
        className={`
          relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-300
          ${dragActive 
            ? 'border-blue-400 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400' 
            : 'border-gray-300 hover:border-gray-400 dark:border-gray-600 dark:hover:border-gray-500'
          }
          ${isProcessing ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
          bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl
        `}
        style={{
          boxShadow: dragActive 
            ? '1px -1px 0 1px rgba(34, 211, 238, 0.3), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.3)'
            : '1px -1px 0 1px rgba(34, 211, 238, 0.2), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.2)'
        }}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept=".png,.jpg,.jpeg,.webp,.svg"
          onChange={handleFileInput}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          disabled={isProcessing}
          aria-label="Sélectionner un fichier image"
          title="Cliquez pour sélectionner un fichier image"
        />
        
        <div className="space-y-4">
          {isProcessing ? (
            <div className="animate-spin w-12 h-12 mx-auto">
              <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-500 rounded-full"></div>
            </div>
          ) : (
            <div className={`transition-colors duration-300 ${dragActive ? 'text-blue-500' : 'text-gray-400'}`}>
              {dragActive ? <Upload className="w-12 h-12 mx-auto" /> : <Image className="w-12 h-12 mx-auto" />}
            </div>
          )}
          
          <div>
            <p className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
              {isProcessing ? 'Conversion en cours...' : 'Déposez votre image ici'}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {isProcessing 
                ? 'Cela peut prendre un moment' 
                : 'Supporte PNG, JPEG, JPG, WebP, SVG • Max 15MB'
              }
            </p>
          </div>
          
          {!isProcessing && (
            <button
              type="button"
              onClick={() => document.querySelector('input[type="file"]')?.click()}
              className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
            >
              Choisir un fichier
            </button>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl flex items-start space-x-3">
          <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-red-700 dark:text-red-400">{error}</p>
        </div>
      )}
    </div>
  );
};