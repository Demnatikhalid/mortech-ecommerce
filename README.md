# Mortech E-Commerce

Ce dépôt contient une application e-commerce simple avec un backend Express/Prisma et un frontend React/Vite.

## Structure du projet

- `backend/` : serveur Express, base de données Prisma, API d'authentification et produits
- `frontend/` : application React avec Vite
- `docker-compose.yml` : service PostgreSQL local pour le backend

## Prérequis

- Node.js 18+ installé
- npm installé
- Docker (pour la base de données PostgreSQL)

## Installation

1. Démarrer la base de données PostgreSQL :

   ```bash
   docker compose up -d
   ```

2. Installer les dépendances backend :

   ```bash
   cd backend
   npm install
   ```

3. Installer les dépendances frontend :

   ```bash
   cd ../frontend
   npm install
   ```

## Configuration backend

Dans `backend/.env`, configurez :

- `DATABASE_URL` pour PostgreSQL
- `PORT` si besoin
- SMTP : `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_PASS`, `SMTP_FROM`

Exemple :

```env
PORT=5000
DATABASE_URL="postgresql://postgres:mortech_secure_password@localhost:5432/mortech_db?schema=public"
SMTP_HOST=smtp.example.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-username
SMTP_PASS=your-smtp-password
SMTP_FROM=no-reply@mortech-solutions.ma
```

## Lancer le projet

### Backend

```bash
cd backend
npm run dev
```

### Frontend

```bash
cd frontend
npm run dev
```

Le frontend devrait être accessible sur `http://127.0.0.1:5173` ou l'adresse affichée par Vite.

## Fonctionnalités principales

- Inscription et connexion
- Envoi d'un e-mail de bienvenue à la création de compte
- API produits et API utilisateurs

## Notes

Le backend utilise Prisma et la base de données PostgreSQL fournie par `docker-compose.yml`.
