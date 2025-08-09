# 🎯 ICO256 Converter

Un convertisseur d'icônes professionnel et moderne qui génère des fichiers ICO haute résolution jusqu'à 256px pour Windows, applications et favicons.

## ✨ Fonctionnalités

- **Conversion haute qualité** : Génère des icônes ICO jusqu'à 256px de résolution
- **Multi-formats** : Support PNG, JPEG, JPG, WebP et SVG
- **Multi-tailles** : 16x16, 32x32, 48x48, 64x64, 128x128, 256x256
- **Suppression d'arrière-plan** : Option pour créer des icônes transparentes
- **Pack universel** : Téléchargement groupé pour Windows, Android, iOS et universel
- **Interface moderne** : Design responsive avec thème sombre/clair
- **Traitement local** : Aucune upload, respect de la vie privée
- **PWA** : Installation comme application native

## 🚀 Installation et démarrage

### Prérequis
- Node.js 18+ 
- npm ou yarn

### Installation
```bash
# Cloner le projet
git clone <repository-url>
cd ico256-converter

# Installer les dépendances
npm install

# Démarrer en mode développement
npm run dev

# Build pour production
npm run build

# Prévisualiser le build
npm run preview
```

## 🛠️ Technologies utilisées

- **Frontend** : React 18 + TypeScript
- **Build** : Vite 5
- **Styling** : Tailwind CSS
- **Icônes** : Lucide React
- **Compression** : browser-image-compression
- **ZIP** : JSZip
- **Linting** : ESLint + TypeScript ESLint

## 📁 Structure du projet

```
src/
├── components/          # Composants React
│   ├── Header.tsx      # En-tête de l'application
│   ├── ImageUpload.tsx # Zone de téléchargement d'images
│   ├── ConversionSettings.tsx # Paramètres de conversion
│   ├── PreviewGrid.tsx # Grille de prévisualisation
│   ├── DownloadSection.tsx # Section de téléchargement
│   └── ThemeToggle.tsx # Bascule de thème
├── hooks/              # Hooks React personnalisés
│   └── useImageConverter.ts # Logique de conversion
├── types/              # Types TypeScript
│   └── index.ts        # Interfaces et types
├── utils/              # Utilitaires
│   └── iconConverter.ts # Convertisseur d'icônes
├── App.tsx             # Composant principal
├── main.tsx            # Point d'entrée
└── index.css           # Styles globaux
```

## 🎨 Fonctionnalités détaillées

### Conversion d'images
- Support des formats : PNG, JPEG, JPG, WebP, SVG
- Taille maximale : 15MB
- Algorithmes optimisés selon la taille d'icône
- Amélioration automatique de la netteté

### Génération ICO
- Format ICO multi-résolutions
- Optimisation pour Windows
- Qualité maximale préservée
- Support des tailles standard

### Export universel
- **Windows** : Fichiers ICO individuels + favicon.ico
- **Android** : PNG optimisés pour différentes densités
- **iOS** : PNG pour toutes les tailles d'app
- **Universel** : PNG standards pour tous usages

## 🔧 Configuration

### Variables d'environnement
Aucune variable d'environnement requise - tout est traité côté client.

### Personnalisation
- Modifiez `tailwind.config.js` pour personnaliser le design
- Ajustez `src/types/index.ts` pour modifier les tailles d'icônes
- Personnalisez `src/utils/iconConverter.ts` pour les algorithmes

## 📱 PWA

L'application est configurée comme PWA avec :
- Manifeste web
- Service Worker
- Installation native
- Thème adaptatif

## 🌐 Compatibilité

- **Navigateurs** : Chrome, Firefox, Safari, Edge (moderne)
- **Systèmes** : Windows, macOS, Linux
- **Mobiles** : iOS, Android

## 🚨 Notes importantes pour Windows

Pour des icônes parfaites sur le bureau Windows, modifiez la taille via le registre :

1. Ouvrir l'éditeur de registre (Win+R → `regedit`)
2. Naviguer vers : `HKEY_CURRENT_USER\Software\Microsoft\Windows\Shell\Bags\1\Desktop`
3. Créer/modifier la valeur `IconSize` (DWORD 32 bits)
4. Valeurs recommandées : 32, 48, ou 256
5. Redémarrer l'explorateur Windows

## 🤝 Contribution

1. Fork le projet
2. Créer une branche feature (`git checkout -b feature/AmazingFeature`)
3. Commit les changements (`git commit -m 'Add AmazingFeature'`)
4. Push vers la branche (`git push origin feature/AmazingFeature`)
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- [React](https://reactjs.org/) - Framework UI
- [Vite](https://vitejs.dev/) - Build tool
- [Tailwind CSS](https://tailwindcss.com/) - Framework CSS
- [Lucide](https://lucide.dev/) - Icônes
- [JSZip](https://stuk.github.io/jszip/) - Gestion ZIP

---

**Développé avec ❤️ pour les développeurs et designers**