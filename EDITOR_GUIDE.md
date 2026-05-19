# ✏️ Guide d'édition autonome — Matières et QCM

> Tu peux maintenant **modifier toutes les matières et toutes les questions QCM toi-même**, sans avoir à demander à un développeur. Voici comment.

---

## 🎯 Ce que tu peux faire seul

Dans le **tableau d'admin** (`admin.html`), section **📝 Questions QCM** :

✅ **Modifier le nom, l'icône ou la description** d'une matière existante
✅ **Voir toutes les questions** de chaque matière
✅ **Modifier une question existante** (le texte, les options, la bonne réponse, l'explication)
✅ **Supprimer une question** qui ne te convient pas
✅ **Ajouter une nouvelle question** dans n'importe quelle matière
✅ **Exporter toutes tes modifications** en fichier JSON pour les sauvegarder
✅ **Importer un fichier JSON** pour récupérer tes modifications sur un autre ordinateur

---

## 📚 Comment éditer une matière

1. Ouvre `admin.html` et connecte-toi
2. Va dans **📝 Questions QCM** dans le menu
3. Touche le nom d'une matière (ex: "📝 Français")
4. Tu vois toutes les questions de cette matière
5. En haut, clique sur **"✏️ Modifier la matière"**
6. Tu peux changer :
   - Le **nom** (ex: "Français" → "Français & Expression")
   - L'**icône** emoji (copie-colle depuis ton téléphone)
   - La **description** courte affichée sous le nom
7. Clique **💾 Enregistrer**
8. ✅ Le changement est immédiat dans toute l'app

---

## 📝 Comment modifier une question

1. Dans le détail d'une matière, à côté de chaque question tu vois 2 boutons :
   - **✏️ Modifier**
   - **🗑** (supprimer)
2. Clique sur **✏️ Modifier**
3. Tu peux modifier :
   - Le **texte de la question**
   - Les **4 options** (A, B, C, D)
   - La **bonne réponse** (clique sur la lettre A/B/C/D pour la marquer)
   - L'**explication** (très important pour aider les étudiants)
4. Clique **💾 Enregistrer**

> 💡 **Astuce** : la question modifiée est marquée d'un badge "✏️ Modifiée" dans la liste, pour que tu te souviennes de ce que tu as changé.

---

## ➕ Comment ajouter une nouvelle question

### Méthode 1 — Depuis une matière (rapide)
1. Touche une matière
2. En haut, clique **"➕ Ajouter une question"**
3. La matière est déjà pré-sélectionnée
4. Remplis les champs et clique **➕ Ajouter**

### Méthode 2 — Depuis la vue d'ensemble
1. Sur la liste des matières, clique **"➕ Nouvelle question"** en haut à droite
2. Choisis la matière dans la liste déroulante
3. Remplis et **➕ Ajouter**

### Conseils pour de bonnes questions
- ✅ Question **claire et précise** (max 1 phrase de 15-20 mots)
- ✅ Les 4 options doivent être **toutes plausibles** (pas une option absurde)
- ✅ Une seule bonne réponse
- ✅ L'**explication doit enseigner**, pas juste justifier (ex: "B est correct car..." → développe pourquoi, donne du contexte)

**Exemple de bonne question** :
- Q : *"Quelle est la capitale du Burkina Faso ?"*
- A) Bobo-Dioulasso
- B) **Ouagadougou** ← bonne réponse
- C) Koudougou
- D) Banfora
- Explication : *"Ouagadougou est la capitale politique et économique du Burkina Faso depuis 1960. Bobo-Dioulasso est la 2e ville. Le BF compte 13 régions."*

---

## 🗑️ Comment supprimer une question

1. Clique sur l'icône **🗑** rouge à côté de la question
2. Confirme la suppression
3. ✅ La question ne sera plus jamais proposée aux étudiants

> ⚠️ **Bon à savoir** : si tu supprimes une question par défaut, elle reste en réalité dans le code de base, mais elle est marquée comme "à ignorer". Tu peux la restaurer en effaçant les données démo (Paramètres → Effacer données démo).

---

## 💾 Sauvegarder ton travail (export JSON)

**Très important !** Si tu changes d'ordinateur ou de navigateur, tes modifications restent sur l'ancien appareil. Pour les transférer :

1. Sur l'ordinateur où tu as fait les modifications
2. Va dans **Questions QCM** → **"📤 Exporter tout"**
3. Un fichier `.json` est téléchargé (ex: `bara-concours-questions-2026-04-29.json`)
4. **Conserve ce fichier précieusement** (envoie-le toi par WhatsApp/Email pour ne pas le perdre)

---

## 📥 Importer tes modifications

Sur le nouvel ordinateur (ou le même après avoir effacé les données) :

1. Va dans **Questions QCM** → **"📥 Importer"**
2. Choisis le fichier JSON exporté
3. Clique **📥 Importer**
4. ✅ Toutes tes modifications sont restaurées

---

## 🌐 Rendre tes modifications définitives (pour tous les utilisateurs)

⚠️ **Attention** : tes modifications sont stockées **localement** dans ton navigateur. Les autres étudiants ne les voient pas (ils ont les questions de base de l'app).

Pour rendre tes modifications visibles par tous :

### Option A — Avec un développeur
1. Exporte ton fichier JSON
2. Envoie-le au développeur
3. Il l'intègre dans `data/questions.js` et redéploie l'app

### Option B — Avec Firebase (recommandé en Phase 5)
Quand tu activeras Firebase, je peux te configurer une **synchronisation automatique** : tes modifications iront directement dans la base de données partagée et tous les utilisateurs les verront immédiatement, sans redéploiement.

---

## ⚡ Workflow recommandé

**Pour préparer une grosse session d'ajout (ex: 50 questions de Pharmacie)** :

1. Prépare tes questions sur **un fichier Word** ou **dans ta tête** (peu importe)
2. Ouvre `admin.html` un dimanche soir tranquille
3. Ajoute les 50 questions une par une (compte ~30s par question = 25 min total)
4. Une fois fini, clique **📤 Exporter tout**
5. Sauvegarde le JSON sur ton WhatsApp à toi-même
6. Envoie le fichier au développeur ou attends Phase 5 Firebase

---

## ❓ Questions fréquentes

### "Si je supprime puis je remets l'app, mes modifs restent ?"
Oui, tant que tu n'effaces pas les données du navigateur. Mais pour plus de sécurité, **exporte régulièrement** le JSON.

### "Puis-je changer la couleur d'une matière ?"
Pas encore directement dans l'interface. Mais tu peux modifier l'emoji (icône) qui change l'aspect visuel.

### "Si je modifie une question, l'ancienne version est perdue ?"
Oui, mais tu peux toujours faire "Effacer données démo" (dans Paramètres) pour repartir des questions originales.

### "Combien de questions puis-je ajouter ?"
Aucune limite. Tu peux en ajouter 1000 si tu veux.

### "Comment je teste mes nouvelles questions ?"
Ouvre `index.html` (l'app étudiante) sur le **même navigateur**. Choisis un concours qui utilise la matière que tu as modifiée. Lance un QCM. Tes modifications sont visibles immédiatement.

---

## 🎓 Astuce pédagogique

Pour le succès de Bara Concours, **la qualité des explications est plus importante que le nombre de questions**. Mieux vaut avoir 20 questions excellentes avec des explications détaillées que 100 questions superficielles.

**Une bonne explication contient** :
- Pourquoi la bonne réponse est correcte
- Pourquoi les autres options sont fausses (au moins les pièges courants)
- Une **astuce mnémotechnique** pour mémoriser
- Un **lien avec le concours visé** (ex: "Cette notion tombe souvent au concours GSP")

---

**Tu es maintenant autonome ! 🎉**

— Bara Formation, le Burkina Faso 🇧🇫
