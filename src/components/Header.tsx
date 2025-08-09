import React from 'react';
import { Eye } from 'lucide-react';

export const Header: React.FC = () => {
  return (
    <header className="text-center py-12">
      <div className="flex items-center justify-center space-x-3 mb-4">
        <div className="p-3 bg-gradient-to-r from-blue-600 to-blue-500 rounded-2xl shadow-lg">
          <Eye className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 to-blue-500 bg-clip-text text-transparent">
          <span className="font-gaoren font-black tracking-wide">iCo256</span>
        </h1>
      </div>
      
      <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto leading-relaxed">
        Générez vos icônes ICO professionnelles en haute résolution.  
        jusqu'à 256px pour Windows, applications et favicons de qualité supérieure.
      </p>
      
      <div className="mt-6 inline-flex items-center space-x-3 px-6 py-3 bg-blue-50 dark:bg-blue-900/20 rounded-full border border-blue-200 dark:border-blue-800">
        <span className="text-sm text-blue-700 dark:text-blue-400 font-medium">
          ✨ Qualité 256px → ICO multi-résolutions parfait
        </span>
      </div>
    </header>
  );
};