import React from 'react';

interface ConversionSettingsProps {
  removeBackground: boolean;
  onToggleBackground: (enabled: boolean) => void;
  disabled?: boolean;
}

export const ConversionSettings: React.FC<ConversionSettingsProps> = ({
  removeBackground,
  onToggleBackground,
  disabled = false
}) => {
  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6" style={{
        boxShadow: '1px -1px 0 1px rgba(34, 211, 238, 0.2), -0.5px 0.5px 0 0.5px rgba(16, 185, 129, 0.2)'
      }}>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">
          Conversion Settings
        </h3>
        
        <div className="flex items-center justify-between">
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
              Remove Background
            </label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Make background transparent instead of white
            </p>
          </div>
          
          <button
            onClick={() => onToggleBackground(!removeBackground)}
            disabled={disabled}
            className={`
              relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
              ${disabled 
                ? 'opacity-50 cursor-not-allowed bg-gray-200 dark:bg-gray-600' 
                : removeBackground 
                ? 'bg-blue-600' 
                : 'bg-gray-200 dark:bg-gray-600'
              }
            `}
            role="switch"
            aria-checked={removeBackground}
            aria-label="Toggle background removal"
          >
            <span
              className={`
                inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                ${removeBackground ? 'translate-x-6' : 'translate-x-1'}
              `}
            />
          </button>
        </div>
      </div>
    </div>
  );
};