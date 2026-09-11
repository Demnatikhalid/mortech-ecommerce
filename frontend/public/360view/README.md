# 🔄 Guide pour créer des vues 360° de produits

Ce dossier contient les images 360° pour le viewer interactif sur les pages produits.

## 📁 Structure des dossiers

Deux options sont supportées :

### Option 1 : Par nom de produit (recommandé)
```
360view/
└── {Nom exact du produit}/
    ├── angle-1.png
    ├── angle-2.png
    ├── angle-3.png
    └── ... jusqu'à 24 angles max
```

### Option 2 : Par ID de produit
```
360view/
└── {productId}/
    ├── angle-1.png
    ├── angle-2.png
    └── ...
```

## 🎯 Exemple pour l'alarme

```
360view/
└── Alarme autonome avec sirene integree et detecteur/
    ├── angle-1.png   ← Vue de face (0°)
    ├── angle-2.png   ← Vue arrière (180°)
    ├── angle-3.png   ← Vue gauche (90°)
    ├── angle-4.png   ← Vue droite (270°)
    ├── angle-5.png   ← Vue dessus (90° vertical)
    ├── angle-6.png   ← Vue dessous (270° vertical)
    ├── angle-7.png   ← Vue avant gauche (45°)
    ├── angle-8.png   ← Vue avant droite (315°)
    ├── angle-9.png   ← Vue arrière gauche (135°)
    ├── angle-10.png  ← Vue arrière droite (225°)
    ├── angle-11.png  ← Vue de haut gauche (135° isométrique)
    └── angle-12.png  ← Vue de haut droite (225° isométrique)
```

## 🛠️ Outil de découpage

Un outil HTML est fourni pour découper automatiquement les images composites en angles individuels :

**Fichier :** `split-image-tool.html`

### Mode d'emploi :

1. **Ouvrir** le fichier `split-image-tool.html` dans votre navigateur
2. **Glisser** votre image composite (grille 3x4 ou autre)
3. **Configurer** le nombre de lignes et colonnes
4. **Cliquer** sur "Découper l'image"
5. **Télécharger** le ZIP contenant toutes les images
6. **Extraire** et placer les fichiers dans le dossier du produit

## 📸 Formats supportés

- PNG (recommandé pour la qualité)
- JPG/JPEG (bon pour la taille)
- WEBP (meilleur compromis qualité/taille)

## 🔍 Convention de nommage

Les fichiers **doivent** être nommés :
- `angle-1.png`, `angle-2.png`, etc. (avec tiret)
- ❌ PAS : `1.png`, `angle_1.png`, `view1.png`

## 📊 Nombre d'angles recommandés

| Type de produit | Angles min | Angles recommandés |
|----------------|------------|-------------------|
| Simple (face/arrière) | 2 | 4-6 |
| Standard (rotation 360°) | 8 | 12 |
| Complexe (haut/bas inclus) | 12 | 16-24 |

## ⚡ Optimisation des images

Pour de meilleures performances :
- **Résolution recommandée :** 800x800 à 1200x1200 pixels
- **Taille fichier :** < 500 KB par image
- **Format :** WEBP ou PNG optimisé

## 🎬 Comment ça marche

1. Le viewer charge automatiquement les images depuis ce dossier
2. L'utilisateur peut faire glisser pour voir tous les angles
3. Rotation automatique disponible
4. Vignettes pour navigation rapide
5. Mode plein écran

## 🐛 Dépannage

**Le viewer 360° ne s'affiche pas ?**
- Vérifiez que les fichiers sont nommés `angle-1.png`, `angle-2.png`, etc.
- Vérifiez que le dossier a exactement le même nom que le produit
- Vérifiez qu'il y a au moins 2 images
- Ouvrez la console du navigateur pour voir les erreurs

**Les images ne se chargent pas ?**
- Vérifiez les permissions du dossier
- Vérifiez que les images ne sont pas corrompues
- Testez en ouvrant l'URL directe de l'image dans le navigateur

## 📝 Exemple d'URL

Pour le produit "Alarme autonome avec sirene integree et detecteur" :
```
/assets/products/360view/Alarme autonome avec sirene integree et detecteur/angle-1.png
```

## 💡 Astuces

- Utilisez un plateau tournant pour photographier vos produits
- Gardez la même lumière et le même cadrage pour tous les angles
- Utilisez un fond blanc ou transparent
- Prenez au minimum 8 photos à intervalles de 45°
- Plus vous avez d'angles, plus la rotation sera fluide

---

**Besoin d'aide ?** Consultez la documentation du composant `Product360Viewer.jsx`
