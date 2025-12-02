# Support Offline PWA - AgriAide

## Overview

AgriAide offre un support offline complet grâce à la technologie Service Worker et aux stratégies de cache Workbox. Voici ce qui fonctionne et ce qui nécessite une connexion Internet.

## ✅ Fonctionnalités Offline

### Accès au Contenu en Cache
- **Historique des analyses** : Les analyses précédentes (images + résultats) restent accessibles hors ligne
- **Images sauvegardées** : Les images Cloudinary mises en cache peuvent être visualisées
- **Pages visitées** : Tous les contenus HTML/CSS/JS sont en cache (cache-first strategy)

### Stockage Local
- Les données de votre compte utilisateur sont stockées localement via Firestore offline persistence
- Votre historique d'analyses reste visible même sans Internet

## ❌ Fonctionnalités Nécessitant une Connexion

- **Nouvelles analyses** : L'analyse IA nécessite l'API Google Gemini (en ligne requise)
- **Upload de nouvelles images** : Cloudinary nécessite une connexion
- **Synchronisation Firebase** : Les nouvelles données ne sont synchronisées qu'en ligne
- **Authentification Google** : La connexion OAuth nécessite Internet

## 🔄 Stratégies de Cache Implémentées

### 1. **Images (Cache-First - 30 jours)**
```
URLs: Cloudinary, Unsplash, placehold.co, etc.
Stratégie: Charge d'abord depuis le cache, puis du réseau en arrière-plan
Expiration: 30 jours ou max 100 images
```

### 2. **Ressources Statiques (Cache-First - 30 jours)**
```
Types: JS, CSS, Fonts, SVG
Stratégie: Charge depuis le cache en priorité
Expiration: 30 jours ou max 60 ressources
```

### 3. **Firebase/Firestore (Network-First - 1 jour)**
```
URLs: firestore.googleapis.com
Stratégie: Essaie le réseau d'abord, fallback sur cache (timeout 5s)
Expiration: 1 jour ou max 50 requêtes
```

### 4. **APIs Google (Network-First - 1 heure)**
```
URLs: google.com, accounts.google.com
Stratégie: Réseau en priorité, fallback cache (timeout 3s)
Expiration: 1 heure ou max 30 requêtes
```

## 📊 Gestion du Cache

### Voir l'État du Cache
1. Ouvrir **DevTools** (F12)
2. Aller à **Application > Cache Storage**
3. Vérifier les caches actifs :
   - `images-cache`
   - `static-resources`
   - `firebase-cache`
   - `google-apis`

### Nettoyer le Cache Manuellement
```bash
# Dans la console DevTools:
caches.keys().then(names => names.forEach(name => caches.delete(name)))
```

## 🔔 Notifications d'État

### Bannière Offline
Une bannière rouge apparaît quand vous perdez la connexion :
```
"Pas de connexion Internet - Vous êtes actuellement hors ligne..."
```

### Notification de Reconnexion
Un message vert s'affiche quand la connexion est rétablie (3 secondes) :
```
"Reconnecté ! - Vous êtes de nouveau en ligne."
```

## 💡 Bonnes Pratiques

1. **Télécharger régulièrement** : Accédez à votre historique régulièrement pour que les images soient en cache
2. **Analyser en ligne** : Effectuez vos analyses quand vous avez Internet
3. **Vérifier le cache** : Sur mobile, utilisez DevTools ou inspectez via `navigator.storage`
4. **Synchronisation** : Les nouveaux résultats se synchronisent automatiquement quand la connexion revient

## 🛠️ Configuration Technique

### Installation du Service Worker
Le service worker est automatiquement enregistré via `next-pwa` en production.

### Localisation de la Configuration
- **Stratégies**: `/next.config.ts` (section `runtimeCaching`)
- **Détection offline**: `/src/hooks/use-online-status.tsx`
- **Indicateurs UI**: `/src/components/offline-indicator.tsx`

### Désactiver en Développement
```typescript
disable: process.env.NODE_ENV === 'development'
```

Le cache PWA est désactivé en développement pour éviter les problèmes.

## 📱 Test sur Mobile

1. Installer l'app (bouton "Installer" sur petit écran)
2. Analyser quelques plantes (pour remplir le cache)
3. Activer le mode avion
4. L'historique et les images en cache restent accessibles

## ⚠️ Limitations Connues

- Les analyses offline ne sont pas possibles (nécessite Gemini API)
- Pas de synchronisation en temps réel sans Internet
- Les images très récemment uploadées peuvent ne pas être en cache immédiatement

## 🚀 Améliorations Futures

- [ ] Synchronisation intelligente (sync les changements quand en ligne)
- [ ] Préchargement des images critiques
- [ ] Estimation de l'utilisation du cache
- [ ] Options de nettoyage du cache dans les paramètres
