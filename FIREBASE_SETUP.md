# 🔥 Configuration Firebase — Phase 2

> Ce guide t'explique comment activer **les SMS d'inscription** et **la sauvegarde cloud** dans Bara Concours. C'est gratuit jusqu'à plusieurs milliers d'utilisateurs.

---

## 🎯 Mode démo vs Mode réel

### ✅ Mode démo (sans Firebase)
L'application fonctionne immédiatement après extraction du ZIP, **sans rien configurer**. Pour tester l'authentification :
- Saisis n'importe quel numéro à 8 chiffres
- Utilise le **code OTP `123456`** pour te connecter
- Tu peux faire toute la navigation, l'onboarding, etc.

C'est parfait pour tester l'app et la montrer à des proches.

### 🚀 Mode réel (avec Firebase)
Pour que les vrais SMS soient envoyés et que les comptes soient sauvegardés dans le cloud, il faut configurer Firebase. Suis les étapes ci-dessous.

---

## 📋 Étape 1 — Créer un projet Firebase (10 min)

1. Va sur **https://console.firebase.google.com**
2. Connecte-toi avec un compte Google
3. Clique sur **"Ajouter un projet"** (ou "Add project")
4. Nom du projet : **`bara-concours`**
5. Coche/décoche Google Analytics selon ton souhait (peu importe)
6. Clique sur **"Créer le projet"** — attends 30 secondes

---

## 📱 Étape 2 — Activer l'authentification téléphone (5 min)

1. Dans la console Firebase, clique sur **"Authentication"** (menu de gauche)
2. Clique **"Get started"** (Commencer)
3. Onglet **"Sign-in method"** (Mode de connexion)
4. Cherche **"Phone"** (Téléphone) dans la liste → clique dessus
5. Active le toggle **"Activer"** → clique **"Enregistrer"**

✅ Authentification téléphone activée

### 💰 Quotas SMS (important)
Firebase offre un quota gratuit. Au-delà, c'est environ **0,01 USD par SMS**. Pour tes 100 premiers étudiants, c'est gratuit ou presque rien.

---

## 🗄️ Étape 3 — Activer Firestore (la base de données cloud, 3 min)

1. Dans le menu de gauche, clique sur **"Firestore Database"**
2. Clique **"Create database"** (Créer la base de données)
3. Choisis le mode : **"Start in production mode"** (Mode production)
4. Région : **`europe-west1`** (Belgique — la plus proche de l'Afrique de l'Ouest)
5. Clique **"Enable"** (Activer)

### 🛡️ Configurer les règles de sécurité

1. Une fois la base créée, va dans l'onglet **"Rules"** (Règles)
2. **Remplace tout le contenu** par :

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {

    // Profil utilisateur : seul le propriétaire peut lire/écrire
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;

      // Historique QCM
      match /history/{historyId} {
        allow read, write: if request.auth != null && request.auth.uid == userId;
      }
    }
  }
}
```

3. Clique **"Publish"** (Publier)

✅ La base est sécurisée — chaque utilisateur ne peut accéder qu'à ses propres données.

---

## 🔑 Étape 4 — Récupérer les clés de configuration (3 min)

1. Dans la console Firebase, clique sur l'icône **⚙️ (engrenage)** en haut à gauche
2. Clique **"Project settings"** (Paramètres du projet)
3. Descends jusqu'à la section **"Your apps"** (Tes applications)
4. Clique sur l'icône **`</>`** (Web)
5. Surnom de l'app : **`Bara Concours Web`**
6. ❌ NE coche PAS "Firebase Hosting" (on utilise GitHub Pages)
7. Clique **"Register app"** (Enregistrer)
8. **COPIE le bloc `firebaseConfig`** qui apparaît :

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "bara-concours.firebaseapp.com",
  projectId: "bara-concours",
  storageBucket: "bara-concours.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
};
```

9. Clique **"Continue to console"** (Aller à la console)

---

## ✏️ Étape 5 — Coller les clés dans ton app (2 min)

1. Ouvre le fichier **`data/firebase.js`** dans un éditeur de texte (Bloc-notes, Notepad++…)
2. Trouve les lignes `config: { ... }` au début (lignes 6-13)
3. **Remplace les valeurs** par celles que tu as copiées de Firebase :

**Avant :**
```javascript
config: {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "bara-concours.firebaseapp.com",
  projectId: "bara-concours",
  storageBucket: "bara-concours.appspot.com",
  messagingSenderId: "REPLACE_WITH_SENDER_ID",
  appId: "REPLACE_WITH_APP_ID"
},
```

**Après (avec TES clés) :**
```javascript
config: {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "bara-concours.firebaseapp.com",
  projectId: "bara-concours",
  storageBucket: "bara-concours.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef123456"
},
```

4. **Sauvegarde** le fichier

---

## 🌐 Étape 6 — Autoriser ton domaine GitHub Pages (2 min)

Pour que reCAPTCHA fonctionne, il faut autoriser ton domaine :

1. Retourne dans **Firebase Console → Authentication → Settings → Authorized domains**
2. Clique **"Add domain"** (Ajouter un domaine)
3. Ajoute : **`[ton-pseudo].github.io`** (remplace par ton vrai pseudo GitHub)
4. Clique **"Add"**

Si tu testes en local d'abord, `localhost` est déjà autorisé.

---

## 🚀 Étape 7 — Tester !

### Test en local
1. Ouvre `index.html` dans Chrome
2. Clique "Créer un compte"
3. Saisis ton vrai numéro Burkina (8 chiffres)
4. Tu devrais recevoir un **vrai SMS** avec le code !

### Test en ligne (après publication GitHub Pages)
1. Ouvre l'URL `https://[ton-pseudo].github.io/bara-concours/`
2. Clique "Créer un compte"
3. Le flux complet doit fonctionner avec de vrais SMS

---

## 🔔 À propos des notifications

Les notifications quotidiennes à **8h00** sont **automatiquement activées** dans le navigateur dès que l'utilisateur autorise.

⚠️ **Limite importante** : les notifications PWA fonctionnent uniquement si le navigateur ou l'app est ouvert au moins une fois par jour. Pour des notifications **push réelles 24/7** (même app fermée), il faudra ajouter Firebase Cloud Messaging (FCM) en Phase 3 si tu le souhaites.

---

## 💰 Coûts Firebase — Récap

| Service | Quota gratuit | Au-delà |
|---|---|---|
| **Authentication (téléphone)** | 10 SMS/jour gratuits | ~0,01 USD/SMS |
| **Firestore** | 50 000 lectures/jour, 20 000 écritures | ~0,06 USD / 100k ops |
| **Hosting** | Non utilisé (on a GitHub Pages) | — |

Pour tes premiers **1 000 utilisateurs**, tu devrais payer **0 USD ou quelques USD maximum** par mois.

---

## ❓ Problèmes fréquents

### "Le SMS n'arrive pas"
- Vérifie que le numéro Phone Auth est bien activé dans Firebase
- Vérifie que tu as bien ajouté ton domaine dans "Authorized domains"
- Le quota gratuit Firebase est de 10 SMS/jour — au-delà, paye

### "reCAPTCHA error"
- Ajoute ton domaine dans Firebase → Authentication → Settings → Authorized domains
- Vérifie que tu utilises HTTPS (pas http)

### "Mode démo affiché malgré la config"
- Vérifie que tu as bien remplacé **TOUTES** les valeurs dans `data/firebase.js`
- Recharge la page avec Ctrl+F5

---

## 🎓 Ressources

- Documentation officielle Firebase : https://firebase.google.com/docs
- Console Firebase : https://console.firebase.google.com
- Tableau des prix : https://firebase.google.com/pricing

---

**Tu peux laisser le mode démo activé pour le moment et configurer Firebase plus tard, juste avant la publication officielle sur le Play Store. L'app fonctionne très bien en mode démo pour les premiers tests avec tes proches !** 🎉
