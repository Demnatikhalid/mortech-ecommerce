# Mortech E-Commerce

Application e-commerce composée d’un backend Express/Prisma et d’un frontend React/Vite.

## Aperçu

Ce dépôt regroupe toute l’application en trois parties :

- `backend/` : API Express, Prisma, scripts de seed, génération de PDF et envoi d’e-mails
- `frontend/` : interface React avec Vite, pages, composants, styles et helpers
- `waf/` : reverse proxy WAF en Python Flask pour la sécurité (SQLi, XSS, CSRF, Brute Force)
- `docker-compose.yml` : services PostgreSQL et WAF locaux pour le développement
- `extracted-products.json` : données produits extraites pour initialisation ou référence

## Structure principale

```text
.
├── backend/
│   ├── prisma/
│   │   └── schema.prisma
│   ├── scripts/
│   │   ├── seedAdmins.js
│   │   ├── seedAll.js
│   │   └── updateImageUrls.js
│   └── src/
│       ├── db.js
│       ├── deleteUsers.js
│       ├── orderEmails.js
│       ├── quotePdf.js
│       ├── seedData.js
│       └── server.js
├── frontend/
│   ├── public/assets/
│   ├── scripts/copyAssets.js
│   └── src/
│       ├── App.jsx
│       ├── helpers.js
│       ├── main.jsx
│       ├── products.js
│       ├── styles.css
│       ├── assets/
│       ├── components/
│       ├── constants/
│       └── pages/
├── docker-compose.yml
├── extracted-products.json
├── waf/
│   ├── Dockerfile
│   ├── block_page.html
│   └── waf.py
└── README.md
```

## Structure du frontend

```text
frontend/
├── index.html
├── package.json
├── vite.config.js
├── public/
│   └── assets/
│       └── products/
└── src/
   ├── App.jsx
   ├── helpers.js
   ├── main.jsx
   ├── products.js
   ├── styles.css
   ├── assets/
   │   ├── mortech-logo.png
   │   ├── mortech-logo-cropped.png
   │   └── products/
   ├── components/
   │   ├── BrandLogoGallery.jsx
   │   ├── CartDrawer.jsx
   │   ├── CategoryBrowser.jsx
   │   ├── CategoryCatalog.jsx
   │   ├── CategoryShowcase.jsx
   │   ├── Chatbot.jsx
   │   ├── ContactSection.jsx
   │   ├── Footer.jsx
   │   ├── Header.jsx
   │   ├── Hero.jsx
   │   ├── Link.jsx
   │   ├── PageHero.jsx
   │   ├── PolicyPreview.jsx
   │   ├── ProductCard.jsx
   │   ├── ProductsSection.jsx
   │   ├── QuickCategories.jsx
   │   └── Services.jsx
   ├── constants/
   │   └── roles.js
   └── pages/
      ├── AboutPage.jsx
      ├── AdminPage.jsx
      ├── CartPage.jsx
      ├── ContactPage.jsx
      ├── HomePage.jsx
      ├── LoginPage.jsx
      ├── ProductDetailPage.jsx
      ├── ProductsPage.jsx
      ├── ProfilePage.jsx
      ├── RegisterPage.jsx
      └── ServicesPage.jsx
```

## Prérequis

- Node.js 18+ installé
- npm installé
- Docker installé pour la base PostgreSQL locale

## Installation

1. Démarrer les conteneurs PostgreSQL et WAF Proxy :

   ```bash
   docker compose up -d
   ```

2. Installer les dépendances du backend :

   ```bash
   cd backend
   npm install
   ```

3. Installer les dépendances du frontend :

   ```bash
   cd ../frontend
   npm install
   ```

## Configuration du backend

Pour configurer le serveur backend, dupliquez le fichier modèle `.env.example` dans le dossier `backend` et nommez-le `.env` :

```bash
cd backend
cp .env.example .env
```

Puis, ouvrez le fichier `.env` pour définir vos variables d'environnement locales.

> [!WARNING]
> Les fichiers `.env` contiennent des informations hautement sensibles (mots de passe de base de données, clés API Gemini, etc.). Ils sont exclus du suivi Git via le fichier `.gitignore` pour des raisons de sécurité. **Ne validez jamais vos fichiers `.env` dans le dépôt de code.**

Définissez au minimum :

- `DATABASE_URL` : URL de connexion à votre base PostgreSQL.
- `PORT` : Port d'écoute du serveur backend (par défaut `5000`).
- `GEMINI_API_KEY` : Clé d'API Gemini (nécessaire pour le fonctionnement de l'assistant virtuel).
- `MAIL_USER` et `MAIL_PASS` : Identifiants SMTP si l'envoi d'e-mails est activé.

## Commandes utiles

### Backend

Depuis `backend/` :

- `npm run dev` : lance le serveur avec Nodemon
- `npm run db:push` : pousse le schéma Prisma vers la base
- `npm run db:studio` : ouvre Prisma Studio
- `npm run seed:admins` : crée ou met à jour les administrateurs

### Frontend

Depuis `frontend/` :

- `npm run dev` : lance Vite en local
- `npm run build` : génère le build de production
- `npm run preview` : prévisualise le build localement

## Lancement local

1. Démarrer le backend :

   ```bash
   cd backend
   npm run dev
   ```

2. Démarrer le frontend :

   ```bash
   cd ../frontend
   npm run dev
   ```

Le frontend est accessible sur `http://127.0.0.1:5173` ou sur l’adresse indiquée par Vite.

## Fonctionnalités principales

- Inscription et connexion
- Gestion des utilisateurs et des produits
- Envoi d’un e-mail de bienvenue
- Génération de PDF pour certains flux métier
- Scripts de seed et de maintenance des données
- **Assistant Virtuel Intelligent (Chatbot)** : Intégration de l'API Gemini 2.5 Flash pour conseiller les clients et répondre à leurs questions sur les produits Mortech. Inclut un historique de discussion persistant (stocké localement), un panneau latéral coulissant d'historique (style ChatGPT) avec création de nouvelles sessions, édition et renommage à la volée, ainsi que suppression des conversations passées.

## API Principale

Les routes backend les plus importantes sont :

- `GET /api/health` : vérification de l’état du serveur
- `POST /api/auth/register` : inscription utilisateur avec validation reCAPTCHA
- `POST /api/auth/login` : connexion utilisateur avec validation reCAPTCHA
- `POST /api/verify-recaptcha` : validation d’un jeton reCAPTCHA
- `POST /api/contact` : envoi du formulaire de contact
- `GET /api/users` : récupération des utilisateurs
- `POST /api/users` : création d’un utilisateur
- `PATCH /api/users/:id` : mise à jour d’un utilisateur
- `DELETE /api/users/:id` : suppression d’un utilisateur
- `GET /api/products` : récupération des produits
- `POST /api/products` : création d’un produit
- `DELETE /api/products/:id` : suppression d’un produit
- `GET /api/orders` : récupération des commandes et devis
- `POST /api/orders` : création d’une commande ou d’un devis
- `PATCH /api/orders/:id` : mise à jour du statut d’une commande
- `POST /api/chatbot` : chatbot d'assistance client utilisant l'API Gemini

## Interface Frontend

L’application React est organisée autour des pages suivantes :

- Accueil
- Produits
- Détail produit
- Panier
- Profil
- Services
- Contact
- Connexion
- Inscription
- À propos
- Administration

Le frontend charge les produits depuis l’API, gère le panier localement et utilise les routes internes pour naviguer entre les pages sans rechargement complet.

## Notes

- Le backend s’appuie sur Prisma et PostgreSQL.
- Les données produits peuvent être importées ou synchronisées depuis `extracted-products.json`.
