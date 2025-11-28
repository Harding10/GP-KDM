# AgriAide - Assistant IA pour la Santé des Plantes

AgriAide est une application web progressive (PWA) intelligente conçue pour aider les jardiniers amateurs et les agriculteurs à prendre soin de leurs plantes. Grâce à l'intelligence artificielle, l'application peut identifier des plantes, diagnostiquer des maladies à partir d'une simple photo et proposer des traitements adaptés.

## ✨ Fonctionnalités Clés

-   **Identification de Plantes** : Prenez une photo d'une plante et laissez l'IA vous dire de quelle espèce il s'agit.
-   **Diagnostic de Maladies** : Téléversez une photo d'une feuille malade et obtenez un diagnostic instantané sur la maladie, sa cause probable et son niveau de gravité.
-   **Suggestions de Traitements** : Recevez des recommandations de traitements biologiques et chimiques pour soigner vos plantes.
-   **Conseils de Prévention** : Apprenez comment éviter les maladies futures grâce à des conseils préventifs personnalisés.
-   **Historique des Analyses** : Conservez un historique de toutes vos analyses pour suivre la santé de vos plantes au fil du temps.
-   **Gestion de Compte Utilisateur** : Créez un compte pour sauvegarder votre historique et gérer vos informations.
-   **Progressive Web App (PWA)** : Installez l'application sur votre téléphone ou ordinateur pour un accès rapide, comme une application native.
-   **Mode Clair & Sombre** : Thème adaptable pour un confort visuel optimal.

## 🚀 Pile Technique

-   **Framework** : [Next.js](https://nextjs.org/) (avec App Router)
-   **Langage** : [TypeScript](https://www.typescriptlang.org/)
-   **Styling** : [Tailwind CSS](https://tailwindcss.com/)
-   **Composants UI** : [ShadCN/UI](https://ui.shadcn.com/)
-   **Backend & Base de Données** : [Firebase](https://firebase.google.com/) (Authentication, Firestore)
-   **Fonctionnalités IA** : [Google AI - Gemini via Genkit](https://firebase.google.com/docs/genkit)
-   **Stockage d'Images** : [Cloudinary](https://cloudinary.com/)

## 🏁 Démarrage Rapide

Suivez ces étapes pour lancer l'application en local.

### Prérequis

-   [Node.js](https://nodejs.org/) (version 18 ou supérieure)
-   [npm](https://www.npmjs.com/) ou [yarn](https://yarnpkg.com/)

### 1. Installation des dépendances

Clonez le dépôt et installez les paquets nécessaires :

```bash
git clone <URL_DU_DEPOT>
cd <NOM_DU_DOSSIER>
npm install
```

### 2. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet et ajoutez-y vos clés Firebase et Cloudinary. Vous pouvez vous baser sur le fichier `.env.production` comme modèle.

```bash
# .env.local

# Configuration Firebase (obtenue depuis votre console Firebase)
NEXT_PUBLIC_FIREBASE_API_KEY=AIz...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
# ... et les autres variables Firebase

# Configuration Cloudinary (obtenue depuis votre dashboard Cloudinary)
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=your_upload_preset

# Clé API pour Google AI Studio (Gemini)
GEMINI_API_KEY=AIz...
```

### 3. Lancer l'application

Démarrez le serveur de développement :

```bash
npm run dev
```

Ouvrez [http://localhost:9002](http://localhost:9002) dans votre navigateur pour voir l'application.
