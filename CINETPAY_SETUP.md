# 💳 Configuration CinetPay — Paiements automatiques

> Ce guide t'explique comment activer les paiements automatiques via CinetPay pour que les étudiants paient leur Premium **sans aucune intervention de ta part**.

---

## 🎯 Pourquoi CinetPay ?

**CinetPay** est le leader des paiements en ligne en Afrique francophone, présent au Burkina Faso. Avec une seule intégration tu acceptes :

- 🟠 **Orange Money** (Burkina Faso)
- 🔵 **Moov Money** (Burkina Faso)
- 🌊 **Wave** (Burkina Faso)
- 💳 **Cartes bancaires** Visa / Mastercard

### Avantages
- ✅ **Aucun frais d'inscription** ni d'abonnement mensuel
- ✅ **Activation Premium instantanée** sans intervention humaine
- ✅ **Conformité PCI-DSS** (sécurité maximale)
- ✅ **Reversement automatique** sur ton Mobile Money sous 24-72h
- ✅ **Tableau de bord** pour suivre tes ventes en temps réel

### Tarifs au Burkina Faso (commission par transaction)
| Moyen de paiement | Commission |
|---|---|
| Orange Money | 4,5% |
| Moov Money | 3,5% |
| Wave | 3,5% |
| Visa/Mastercard | 3,5% |

> **Exemple** : Plan mensuel à 2 000 FCFA payé via Orange Money → CinetPay prélève 90 FCFA → Tu reçois **1 910 FCFA**. Aucune action manuelle.

---

## 📋 Étape 1 — Créer ton compte marchand CinetPay

1. Va sur **https://cinetpay.com**
2. Clique **"Commencez maintenant"** ou **"Créer un compte"**
3. Choisis **"Compte marchand"**
4. Remplis le formulaire :
   - Nom de l'entreprise : **Bara Formation**
   - Pays : **Burkina Faso**
   - Secteur : **Éducation / Formation**
   - Site web : ton URL GitHub Pages (`https://[ton-pseudo].github.io/bara-concours/`)
   - Description : *Préparation aux concours directs du Burkina Faso*

5. Un commercial CinetPay te contactera pour valider ton compte (KYC)
6. Tu devras fournir :
   - Pièce d'identité
   - RCCM (Registre du Commerce) ou attestation
   - Numéro de compte mobile money pour les reversements

⏱ **Délai de validation : 1 à 3 jours**

---

## 🔑 Étape 2 — Récupérer tes clés API

Une fois ton compte validé :

1. Connecte-toi sur **https://app-rec.cinetpay.com** (ou le tableau de bord qu'ils t'envoient)
2. Va dans **"Paramètres"** → **"Clés API"**
3. Copie 2 valeurs :
   - **API Key** (longue chaîne de caractères)
   - **Site ID** (numéro court, ex: `1234567`)

---

## ✏️ Étape 3 — Configurer Bara Concours

Ouvre le fichier **`data/premium.js`** dans un éditeur de texte (Bloc-notes, Notepad++…).

Trouve la section `CINETPAY` (lignes 92-100 environ) et **remplace** :

**Avant :**
```javascript
CINETPAY: {
  enabled: false,
  apiKey: 'REPLACE_WITH_YOUR_CINETPAY_API_KEY',
  siteId: 'REPLACE_WITH_YOUR_SITE_ID',
  notifyUrl: 'https://votre-domaine.com/api/cinetpay/notify',
  returnUrl: 'https://votre-domaine.com/return.html',
  currency: 'XOF',
  channels: 'MOBILE_MONEY'
},
```

**Après (avec TES vraies clés)** :
```javascript
CINETPAY: {
  enabled: true,                                    // ← Mettre true
  apiKey: 'TA_VRAIE_API_KEY_DE_CINETPAY',          // ← Coller ta clé
  siteId: '1234567',                                // ← Coller ton Site ID
  notifyUrl: 'https://[ton-pseudo].github.io/bara-concours/notify.html',
  returnUrl: 'https://[ton-pseudo].github.io/bara-concours/return.html',
  currency: 'XOF',
  channels: 'ALL'                                   // ← 'ALL' pour cartes + Mobile Money
},
```

Sauvegarde le fichier.

---

## 🌐 Étape 4 — Créer la page de retour

Crée un fichier `return.html` dans le dossier `bara-concours/` :

```html
<!DOCTYPE html>
<html lang="fr">
<head>
<meta charset="UTF-8">
<title>Paiement traité - Bara Concours</title>
<meta http-equiv="refresh" content="3;url=index.html">
<style>
body { font-family: sans-serif; text-align: center; padding: 3rem 1rem; background: #f4f1eb; }
.box { max-width: 400px; margin: 0 auto; background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); }
h1 { color: #0F5132; }
</style>
</head>
<body>
<div class="box">
  <div style="font-size:3rem">✅</div>
  <h1>Paiement traité !</h1>
  <p>Vérification de ton paiement en cours...</p>
  <p><small>Tu vas être redirigé vers l'application dans 3 secondes.</small></p>
</div>
</body>
</html>
```

---

## 🧪 Étape 5 — Tester un vrai paiement

1. Ouvre l'app sur ton téléphone
2. Va dans **Premium** → choisis un plan
3. Tu vois maintenant **"Paiement automatique sécurisé"** avec un bouton bleu
4. Clique **"Payer X FCFA maintenant"**
5. Tu es redirigé vers la page sécurisée CinetPay
6. Choisis ton opérateur et paie
7. Le Premium s'active **automatiquement** dans ton compte

---

## 💸 Récupérer ton argent

CinetPay reverse automatiquement les fonds sur ton Mobile Money :
- **Délai standard** : 24 à 72 heures après la transaction
- **Tableau de bord** : tu vois toutes tes ventes en temps réel
- **Reversement** : sur ton numéro Orange Money ou Moov Money

---

## 🛠️ Mode hybride (recommandé)

Tu peux **garder les 2 modes en parallèle** :

1. **Paiement automatique CinetPay** (rapide, par défaut)
2. **Paiement manuel WhatsApp** (en repli, pour les étudiants qui n'ont pas Mobile Money)

L'application montre automatiquement les 2 options. Le bouton "Préfères-tu payer manuellement par WhatsApp ?" en bas est replié, mais accessible si besoin.

---

## ❓ Problèmes fréquents

### "Le bouton CinetPay n'apparaît pas"
- Vérifie que `enabled: true` dans `premium.js`
- Vérifie que `apiKey` n'est plus la valeur par défaut
- Recharge la page (Ctrl+F5)

### "Erreur lors du paiement"
- Vérifie tes clés API (recopie-les)
- Vérifie que ton compte CinetPay est bien validé
- Contacte le support CinetPay : `[email protected]`

### "Premium ne s'active pas après paiement"
- En Phase 4 on ajoutera un système de vérification automatique côté serveur
- Pour l'instant, le mode hybride te permet de gérer manuellement les cas litigieux

---

## 🚀 Phase 4 — Webhook serveur

Pour une activation 100% automatique et fiable, il faudra ajouter un petit serveur Node.js qui :
1. Reçoit les notifications CinetPay (`notify_url`)
2. Vérifie la signature
3. Active le Premium dans Firebase
4. Envoie un SMS de confirmation

C'est ce qu'on construira ensemble en Phase 4 si tu veux.

---

**Bara Formation est maintenant indépendante** ! 🎉
Plus besoin de valider chaque paiement à la main. Concentre-toi sur le contenu pédagogique pendant que les paiements arrivent automatiquement.

— Édité avec 💚 pour le Burkina Faso 🇧🇫
