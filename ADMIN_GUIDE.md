# 🛠️ Guide du tableau d'administration

> Ce tableau d'admin te permet de gérer Bara Concours **sans toucher au code** : activer les Premium, modérer le forum, ajouter des questions, voir les statistiques.

---

## 🚀 Comment y accéder

### En local (sur ton ordinateur)
1. Extrait le ZIP `bara-concours` sur ton Bureau
2. Ouvre le dossier
3. Double-clique sur **`admin.html`** (pas `index.html`)
4. Saisis le mot de passe par défaut : **`bara_admin_2026`**

### Sur GitHub Pages (en ligne)
Une fois ton site publié, l'URL sera :
```
https://[ton-pseudo].github.io/bara-concours/admin.html
```

⚠️ **Important** : Garde cette URL secrète ! Ne la partage qu'avec toi-même.

---

## 🔐 Changer le mot de passe (FAIS-LE EN PREMIER !)

Le mot de passe par défaut est `bara_admin_2026`. **Tu dois absolument le changer**.

1. Ouvre le fichier `admin.html` dans un éditeur de texte (Bloc-notes, Notepad++)
2. Cherche cette ligne (vers le début du `<script>`) :
   ```javascript
   const ADMIN_PASSWORD_HASH = 'bara_admin_2026';
   ```
3. Remplace par un mot de passe long et difficile :
   ```javascript
   const ADMIN_PASSWORD_HASH = 'TonNouveauMotDePasseTresFort2026!';
   ```
4. Sauvegarde le fichier

> 💡 **Conseil** : utilise au moins 16 caractères avec des chiffres et symboles.

---

## 📊 Les 6 sections du tableau

### 1. Tableau de bord
**Vue d'ensemble** de ton activité :
- Nombre de paiements en attente
- Revenus du mois (somme des paiements activés)
- Nombre d'utilisateurs total
- Nombre de membres Premium
- Nombre de QCM réalisés
- Taux de conversion (% Premium / Total)

**4 actions rapides** : raccourcis vers les opérations courantes.

---

### 2. 💰 Paiements
**Le cœur de ton travail quotidien.**

3 onglets :
- **⏳ En attente** : paiements signalés par WhatsApp, à activer
- **✓ Activés** : historique des Premium accordés
- **✗ Rejetés** : paiements refusés (ex: pas reçu d'argent)

**Actions disponibles** :
- 🟢 **"✓ Activer Premium"** : valide le paiement et active le Premium en 1 clic
- 🔴 **"✗ Rejeter"** : refuse le paiement (avec raison optionnelle)

**Workflow type** :
1. Tu reçois un message WhatsApp avec une référence (ex: `BC-MOIP5BYY-AT0A`)
2. Tu vérifies sur ton téléphone Mobile Money que tu as reçu l'argent
3. Tu vas sur le tableau d'admin → onglet Paiements
4. Tu cherches la référence
5. Tu cliques "✓ Activer Premium"
6. ✅ L'étudiant reçoit son accès dans les secondes qui suivent

---

### 3. 👥 Utilisateurs
**Gère tous tes étudiants en un seul écran.**

3 onglets :
- **Tous** : tous les inscrits
- **⭐ Premium** : seulement les abonnés payants
- **Gratuits** : inscrits non-payants

**Tu peux** :
- 🔍 Rechercher par nom, numéro, ville
- ⭐ **Activer Premium manuellement** pour un utilisateur (en cas de problème ou cadeau)
- 🔄 **Prolonger un abonnement** (si l'étudiant a renouvelé)
- ✗ **Révoquer Premium** (si paiement contesté)

**Activer un nouveau Premium directement** :
- Bouton ⭐ "Activer Premium" en haut à droite
- Saisis nom + numéro + plan
- L'utilisateur est créé et son Premium activé immédiatement

---

### 4. 💬 Forum (modération)
**Garde ton forum propre.**

**Stats en haut** :
- Signalements en attente
- Total des sujets
- Total des réponses

**Sujets signalés** (priorité) :
- 🟢 **"✓ Approuver"** : le signalement était abusif, on garde le sujet
- 🔴 **"🗑 Supprimer"** : le sujet est inapproprié, on le supprime

**Tous les sujets** :
- Vue complète du forum
- Tu peux supprimer n'importe quel sujet à tout moment

---

### 5. 📝 Questions QCM
**Enrichis ton contenu pédagogique sans coder.**

Tu vois la **liste des matières** avec :
- Le nombre de questions actuelles
- Les concours qui utilisent cette matière

**Ajouter une question** :
1. Clique "➕ Ajouter une question"
2. Choisis la matière
3. Tape la question
4. Remplis les 4 options
5. Clique sur la lettre (A/B/C/D) pour marquer la bonne réponse
6. Écris l'explication (importante pour l'étudiant !)
7. ✓ Ajouter

> 💡 **Important** : Pour que la nouvelle question soit définitivement intégrée à l'app, copie le JSON généré dans le fichier `data/questions.js`. (En Phase 5 on connectera ça à Firebase pour automatiser.)

---

### 6. ⚙️ Paramètres
- Comment changer le mot de passe admin
- Numéros Bara Formation actuels
- Lien vers le guide Firebase
- Bouton "Effacer toutes les données démo"

---

## 🎯 Flux quotidien recommandé

**Le matin (5 min)** :
1. Ouvre le tableau d'admin
2. Dashboard → vois s'il y a des paiements en attente
3. Va dans Paiements → traite chaque demande
4. Va dans Forum → vérifie les signalements

**En continu** :
- Quand tu reçois un WhatsApp avec une preuve de paiement, traite-le immédiatement (ça crée la confiance des étudiants : activation rapide)

**Le soir (optionnel)** :
- Regarde tes statistiques dashboard pour suivre ta croissance

---

## 🔒 Sécurité

### Ce qui est sécurisé
✅ Le mot de passe protège l'accès au tableau
✅ Le tableau ne fonctionne que côté navigateur (pas de serveur)
✅ Les données sont stockées localement sur l'appareil de chaque étudiant

### Limitations actuelles
⚠️ Le mot de passe est en clair dans le code source. **Ne donne le fichier `admin.html` à personne d'autre que toi.**
⚠️ Sans Firebase, les données du tableau sont locales (limité aux données de l'appareil où tu ouvres `admin.html`).

### En Phase 5 (futur)
Quand tu activeras Firebase, le tableau d'admin se connectera automatiquement à la base de données partagée. Tu verras les vrais utilisateurs depuis n'importe quel ordinateur.

---

## 💡 Astuce : démo vs réel

**Au lancement**, le tableau affiche des **données de démonstration** (3 paiements en attente, 5 utilisateurs fictifs, etc.) pour que tu puisses tester l'interface.

**Pour repartir de zéro** :
1. Va dans **Paramètres**
2. Clique sur **"🗑 Effacer toutes les données démo"**
3. Confirme
4. Le tableau est maintenant vide, prêt pour tes vrais utilisateurs

---

## ❓ Problèmes fréquents

### "Je n'arrive pas à me connecter"
- Vérifie que tu utilises le bon mot de passe (par défaut : `bara_admin_2026`)
- Vide le cache du navigateur (Ctrl+F5)

### "Les données démo réapparaissent"
- Normal si tu ouvres `admin.html` sur un nouvel appareil
- Configure Firebase pour synchroniser entre tous tes appareils

### "Je voudrais que mes assistants aient accès aussi"
- En Phase 5 (avec Firebase) on ajoutera un système de comptes admins multiples
- Pour l'instant, le mot de passe est unique

---

## 🚀 Prochaines évolutions possibles

- **Phase 5** : Connexion Firebase (vrais utilisateurs, multi-appareils)
- **Phase 6** : Notifications push admin (alerte quand un nouveau paiement arrive)
- **Phase 7** : Export Excel des paiements et statistiques
- **Phase 8** : Comptes admins multiples avec permissions

---

**Bon admin ! 🎉**

— Édité avec 💚 pour Bara Formation, le Burkina Faso 🇧🇫
