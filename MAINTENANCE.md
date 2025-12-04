# Guide de Maintenance - AgriAide

Ce document décrit les tâches régulières pour maintenir votre application en bonne santé, sécurisée et performante.

## 1. Mises à jour (Mensuel)
Gardez vos dépendances à jour pour bénéficier des correctifs de sécurité et des nouvelles fonctionnalités.

- **Vérifier les mises à jour** :
  ```bash
  npm outdated
  ```
- **Mettre à jour les paquets** :
  ```bash
  npm update
  ```
- **Audit de sécurité** :
  ```bash
  npm audit
  ```
  Si des vulnérabilités sont trouvées, utilisez `npm audit fix` ou mettez à jour manuellement les paquets concernés.

## 2. Sécurité (Trimestriel)
- **Rotation des clés API** : Par mesure de précaution, générez de nouvelles clés API (Google Gemini, Firebase) tous les 3-6 mois et mettez à jour vos variables d'environnement (`.env.local` et sur Vercel).
- **Vérification des accès** : Vérifiez dans la console Firebase et Google Cloud qui a accès à votre projet.
- **Surveillance** : Consultez régulièrement les alertes de sécurité de GitHub (Dependabot) ou Vercel.

## 3. Surveillance et Logs (Hebdomadaire)
- **Vercel** : Allez dans l'onglet "Logs" de votre projet sur Vercel pour voir s'il y a des erreurs récurrentes (ex: 500 Server Error).
- **Firebase** : Vérifiez l'onglet "Usage" dans la console Firebase pour surveiller votre consommation (lectures/écritures Firestore) et éviter de dépasser les quotas gratuits.
- **Google AI Studio** : Surveillez l'utilisation de l'API Gemini pour rester dans les limites du plan gratuit.

## 4. Sauvegardes (À la demande)
Bien que Firebase soit hébergé dans le cloud, il est prudent d'exporter vos données importantes si votre base grandit.
- Vous pouvez configurer des exports automatiques de Firestore vers Google Cloud Storage via la console Google Cloud.

## 5. Performance
- **Lighthouse** : Lancez un audit Lighthouse (dans les outils de développement Chrome) sur vos pages principales pour vérifier que les scores de performance, d'accessibilité et de SEO restent bons.
- **PWA** : Vérifiez que l'application est toujours installable et fonctionne hors ligne (pour les parties statiques).

## En cas de problème
1. **Redémarrer** : Si le site plante, essayez de redéployer sur Vercel.
2. **Logs** : Regardez les logs Vercel pour identifier l'erreur exacte.
3. **Support** : Consultez la documentation de Next.js, Firebase ou Genkit selon la source du problème.
