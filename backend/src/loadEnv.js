/**
 * Ce script vérifie que backend/.env existe.
 * Si non, il le crée automatiquement depuis .env.example.
 * Les variables sont chargées nativement par Node via --env-file=.env
 * dans le script npm "dev".
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const envPath = path.resolve(__dirname, '..', '.env');
const envExamplePath = path.resolve(__dirname, '..', '.env.example');

if (!fs.existsSync(envPath)) {
  if (fs.existsSync(envExamplePath)) {
    fs.copyFileSync(envExamplePath, envPath);
    console.warn('[loadEnv] Fichier .env manquant — copié depuis .env.example. Vérifiez vos variables avant de continuer.');
  } else {
    console.error('[loadEnv] ERREUR : Ni .env ni .env.example trouvés dans backend/. Le serveur risque de mal fonctionner.');
  }
}
