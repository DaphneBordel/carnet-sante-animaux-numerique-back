# carnet-sante-animaux-numerique-back
Cette API est construite avec NestJS, utilise Prisma ORM pour l’accès aux données, et une base MySQL administrée via phpMyAdmin.

# Description

Cette API est construite avec NestJS, utilise Prisma ORM pour l’accès aux données, et une base MySQL administrée via phpMyAdmin.

# Stack technique
- NestJS
- Prisma
- MySQL
- phpMyAdmin

# Installation
git clone carnet-sante-animaux-numerique-back
cd carnet-sante-animaux-numerique-back
npm install

# Configuration

1. Créer un fichier .env à la racine :
   /n DATABASE_URL="mysql://USER:PASSWORD@localhost:3306/nom_de_la_database"
   /n SECRET_JWT=ma-cle-secrete-pour-jwt
   /n OCR_API_KEY=*rajouter ici la clé de l'OCR*

3. Créer la base de données
- Créer une base de données dans phpMyAdmin
- Mettre à jour le .env

4. Obtenir une clé d'API pour l'OCR (ocr space) ici:
   https://ocr.space/ocrapi/freekey
-> Mettre à jour le .env avec la clé d'API reçue

6. Lancer Prisma :
npx prisma generate
npx prisma migrate dev --name init

7. Lancer le projet
npm run start:dev

API disponible sur :

http://localhost:3001

# Licence

MIT

# Auteur

Daphné Bordel
