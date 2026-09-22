// =========================================================================
// Bara Concours - Module Firebase V54 (Google + Email/Mot de passe)
// =========================================================================
// Authentification : Google sign-in (popup) + Email/Mot de passe
// Stockage : Firestore (profils utilisateurs + codes Premium plus tard)
//
// Configuration projet bara-concours (region europe-west1)
// =========================================================================

const FirebaseAuth = {
  enabled: true,  // V56 : Activé pour tests sur écrans isolés (pas branché au flux principal)

  // V57 : Flag de bascule pour activer/désactiver le nouveau flux Firebase
  //       true  = nouveau flux (Google + Email/Password)
  //       false = ancien flux SMS mode démo (fallback de secours)
  USE_FIREBASE_AUTH: true,

  config: {
    apiKey: "AIzaSyBuFyCjf98SQWWJCXhak4HH1CBmQq1U610",
    authDomain: "bara-concours.firebaseapp.com",
    projectId: "bara-concours",
    storageBucket: "bara-concours.firebasestorage.app",
    messagingSenderId: "849114301950",
    appId: "1:849114301950:web:ce62278f6cadee6e0cacaf"
  },

  // État interne
  app: null,
  auth: null,
  db: null,
  user: null,                    // Utilisateur Firebase actuel (objet User)
  userProfile: null,             // Profil étendu depuis Firestore
  isFirebaseReady: false,
  _fbFns: null,                  // Cache des fonctions Firebase importées
  _authStateListeners: [],       // Callbacks pour les changements d'état

  // ====================================================================
  // INITIALISATION
  // ====================================================================

  async init() {
    if (!this.enabled) {
      console.log('[Firebase] Désactivé volontairement');
      return false;
    }

    if (this.isFirebaseReady) {
      console.log('[Firebase] Déjà initialisé');
      return true;
    }

    try {
      // Imports dynamiques du SDK Firebase (CDN)
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const authMod = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const dbMod = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

      this.app = initializeApp(this.config);
      this.auth = authMod.getAuth(this.app);
      this.db = dbMod.getFirestore(this.app);

      // Mémoriser les fonctions utiles
      this._fbFns = {
        // Auth
        GoogleAuthProvider: authMod.GoogleAuthProvider,
        signInWithPopup: authMod.signInWithPopup,
        signInWithRedirect: authMod.signInWithRedirect,
        getRedirectResult: authMod.getRedirectResult,
        createUserWithEmailAndPassword: authMod.createUserWithEmailAndPassword,
        signInWithEmailAndPassword: authMod.signInWithEmailAndPassword,
        signOut: authMod.signOut,
        onAuthStateChanged: authMod.onAuthStateChanged,
        sendPasswordResetEmail: authMod.sendPasswordResetEmail,
        updateProfile: authMod.updateProfile,
        // V63.59 : Auth anonyme + liaison de comptes
        signInAnonymously: authMod.signInAnonymously,
        linkWithPopup: authMod.linkWithPopup,
        linkWithCredential: authMod.linkWithCredential,
        EmailAuthProvider: authMod.EmailAuthProvider,
        // Firestore
        doc: dbMod.doc,
        setDoc: dbMod.setDoc,
        getDoc: dbMod.getDoc,
        updateDoc: dbMod.updateDoc,
        serverTimestamp: dbMod.serverTimestamp,
        // V63.65 : increment atomique pour les compteurs d'activité
        increment: dbMod.increment,
        collection: dbMod.collection,
        query: dbMod.query,
        where: dbMod.where,
        getDocs: dbMod.getDocs,
        deleteDoc: dbMod.deleteDoc,
        // V63.19 : Pour le forum Firestore
        orderBy: dbMod.orderBy,
        limit: dbMod.limit,
        addDoc: dbMod.addDoc,
        onSnapshot: dbMod.onSnapshot
      };

      this.isFirebaseReady = true;
      console.log('[Firebase] ✓ Initialisé avec succès');

      // Surveillance des changements d'état d'authentification
      this._fbFns.onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.user = user;
          // Charger le profil étendu depuis Firestore
          await this._loadUserProfile(user.uid);
          // V63.59 : Auto-réparation des Premium historiques désynchronisés
          //   → si le localStorage dit "Premium valide" mais Firestore dit "Gratuit",
          //     on répare pour que le tableau de bord admin voie le vrai statut.
          try {
            const localState = JSON.parse(localStorage.getItem('bara_concours_state') || '{}');
            const localUser = localState.user;
            if (localUser && localUser.isPremium && localUser.premiumExpiresAt) {
              const stillValid = new Date(localUser.premiumExpiresAt).getTime() > Date.now();
              const firestoreIsPremium = this.userProfile && this.userProfile.isPremium;
              if (stillValid && !firestoreIsPremium) {
                console.log('[V63.59] 🔧 Réparation Premium (local → Firestore)');
                await this.updateProfile({
                  isPremium: true,
                  premiumPlan: localUser.premiumPlan || null,
                  premiumExpiresAt: localUser.premiumExpiresAt,
                  premiumActivatedAt: localUser.premiumActivatedAt || new Date().toISOString()
                });
              }
            }
          } catch(e) { /* non bloquant */ }

          // V63.65 : Récupération unique de l'historique déjà accumulé en local.
          //   Les compteurs d'activité démarrent à zéro, or beaucoup d'étudiants
          //   ont déjà des dizaines de QCM dans leur localStorage. On les envoie
          //   une seule fois (marqueur historyBackfilled côté Firestore).
          try {
            const st = JSON.parse(localStorage.getItem('bara_concours_state') || '{}');
            if (Array.isArray(st.history) && st.history.length > 0) {
              this.backfillActivityFromLocal(st.history);
              // V64.04 : meme principe pour le detail par matiere
              this.backfillMatiereStatsFromLocal(st.history);
            }
          } catch(e) { /* non bloquant */ }
        } else {
          this.user = null;
          this.userProfile = null;
        }
        // Notifier les listeners
        this._authStateListeners.forEach(cb => {
          try { cb(this.user, this.userProfile); } catch(e) { console.error(e); }
        });
      });

      // Si on revient d'une redirection Google (cas APK), traiter le résultat
      try {
        const result = await this._fbFns.getRedirectResult(this.auth);
        if (result && result.user) {
          console.log('[Firebase] Connexion Google par redirect réussie');
          await this._ensureUserDoc(result.user, 'google');
        }
      } catch(e) {
        // V64.05 : on trace au lieu d'avaler. Un retour de redirection qui
        //   échoue silencieusement était impossible à diagnostiquer.
        console.warn('[Firebase] getRedirectResult :', e.code || e.message);
      }

      // === V63.59 : Auth anonyme automatique ===
      //   → chaque visiteur reçoit un user.uid dès le démarrage, même sans compte.
      //   → permet : activation de code Premium sans inscription, accès Firestore,
      //     ET surtout comptage/suivi des visiteurs "sans compte" dans l'admin.
      //   → si l'utilisateur crée un compte plus tard (Google ou email), le compte
      //     anonyme est LIÉ (linkWithPopup / linkWithCredential) : aucune perte de données.
      //   ⚠️ Nécessite "Anonymous" activé dans Firebase Console > Authentication > Sign-in method
      // V64.05 : ATTENDRE la restauration de la session enregistrée.
      //   Firebase restaure l'utilisateur persisté de façon asynchrone.
      //   Sans cette attente, `currentUser` pouvait encore valoir null alors
      //   qu'une session existait : on créait alors un SECOND compte anonyme.
      //   Conséquence observée dans l'admin : un « nouvel inscrit » daté de
      //   l'instant, qui récupérait aussitôt tout l'historique local via le
      //   backfill — d'où des visiteurs à 290 questions inscrits « à l'instant ».
      try {
        if (typeof this.auth.authStateReady === 'function') {
          await this.auth.authStateReady();
        }
      } catch(e) { /* non bloquant */ }

      if (!this.auth.currentUser) {
        try {
          const anonResult = await this._fbFns.signInAnonymously(this.auth);
          console.log('[Firebase] ✓ Connexion anonyme automatique');
          if (anonResult && anonResult.user) {
            await this._ensureUserDoc(anonResult.user, 'anonymous');
          }
        } catch(e) {
          console.warn('[Firebase] Auth anonyme impossible (activer "Anonymous" dans Firebase Console) :', e.code || e.message);
        }
      }

      return true;

    } catch(error) {
      console.error('[Firebase] Erreur init :', error);
      this.isFirebaseReady = false;
      return false;
    }
  },

  // ====================================================================
  // CONNEXION GOOGLE
  // ====================================================================

  async signInWithGoogle() {
    if (!this.isFirebaseReady) {
      await this.init();
      if (!this.isFirebaseReady) {
        return { success: false, error: 'Firebase non initialisé. Vérifie ta connexion internet.' };
      }
    }

    // V64.05 : le provider est créé AVANT le try pour rester accessible
    //   dans le bloc d'erreur (secours redirect).
    const provider = new this._fbFns.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: 'select_account' });  // Force choix du compte

    try {
      // V64.05 : POPUP SUR TOUTES LES PLATEFORMES.
      //
      //   L'ancien code basculait sur signInWithRedirect dès que l'app
      //   tournait en mode installé (APK ou PWA). Or notre authDomain
      //   (bara-concours.firebaseapp.com) diffère du domaine de l'app
      //   (bara-formation.github.io). Les navigateurs cloisonnent le
      //   stockage entre origines : dans ce cas, getRedirectResult renvoie
      //   null SANS erreur, la connexion n'aboutit jamais, et l'auth
      //   anonyme automatique reprend la main — l'utilisateur « revenait
      //   sans compte ». C'est le contournement recommandé par Firebase
      //   pour les apps hébergées hors Firebase Hosting.
      //
      //   Dans une TWA le contenu s'exécute dans Chrome : le popup marche.
      //   Le redirect reste en dernier recours, uniquement si le popup est
      //   explicitement bloqué (voir le bloc catch).
      const result = await this._connexionGoogle(provider);

      const user = result.user;
      const profile = await this._ensureUserDoc(user, 'google');

      return {
        success: true,
        user: user,
        profile: profile,
        isNewUser: profile._isNewUser || false
      };

    } catch(error) {
      console.error('[Firebase] Erreur Google sign-in :', error);

      // V64.05 : secours. Si et seulement si le popup a été bloqué par
      //   l'environnement, on tente le redirect. Le résultat sera traité
      //   au prochain init par getRedirectResult.
      if (error.code === 'auth/popup-blocked' ||
          error.code === 'auth/operation-not-supported-in-this-environment') {
        try {
          console.warn('[V64.05] Popup bloqué → bascule sur redirect');
          await this._fbFns.signInWithRedirect(this.auth, provider);
          return { success: true, pending: true };  // L'app va recharger
        } catch(redirErr) {
          console.error('[V64.05] Redirect impossible aussi :', redirErr);
        }
      }

      let msg = 'Erreur de connexion Google';
      if (error.code === 'auth/popup-closed-by-user' ||
          error.code === 'auth/cancelled-popup-request') {
        msg = 'Tu as fermé la fenêtre de connexion';
      } else if (error.code === 'auth/popup-blocked') {
        msg = 'Le popup a été bloqué. Autorise les popups pour ce site.';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Pas de connexion internet';
      } else if (error.code === 'auth/account-exists-with-different-credential') {
        msg = 'Cet email est déjà utilisé avec une autre méthode (Email/Mot de passe). Essaye de te connecter avec ton mot de passe.';
      }
      return { success: false, error: msg, errorCode: error.code };
    }
  },

  /**
   * V64.05 : ouvre la fenêtre Google et renvoie le UserCredential.
   *
   *   Si l'utilisateur est actuellement ANONYME, on LIE le compte Google au
   *   compte anonyme plutôt que d'en créer un nouveau : l'historique, le
   *   Premium et les statistiques du visiteur sont conservés.
   *
   *   Cette liaison s'applique maintenant à TOUTES les plateformes. Elle
   *   était auparavant sautée en mode installé, où le compte anonyme était
   *   purement et simplement abandonné.
   */
  async _connexionGoogle(provider) {
    const current = this.auth.currentUser;

    if (current && current.isAnonymous) {
      try {
        const lie = await this._fbFns.linkWithPopup(current, provider);
        console.log('[V64.05] ✓ Compte anonyme lié à Google (données conservées)');
        return lie;
      } catch(linkErr) {
        // Ce compte Google existe déjà ailleurs → connexion normale
        // (on abandonne l'anonyme, il n'y a pas d'autre issue).
        if (linkErr.code === 'auth/credential-already-in-use' ||
            linkErr.code === 'auth/email-already-in-use') {
          console.log('[V64.05] Compte Google déjà existant → connexion classique');
          return await this._fbFns.signInWithPopup(this.auth, provider);
        }
        throw linkErr;
      }
    }

    return await this._fbFns.signInWithPopup(this.auth, provider);
  },

  // ====================================================================
  // INSCRIPTION EMAIL
  // ====================================================================

  async signUpWithEmail(email, password, additionalInfo) {
    if (!this.isFirebaseReady) {
      await this.init();
      if (!this.isFirebaseReady) {
        return { success: false, error: 'Firebase non initialisé' };
      }
    }

    // Validations basiques
    if (!email || !email.includes('@')) {
      return { success: false, error: 'Email invalide' };
    }
    if (!password || password.length < 6) {
      return { success: false, error: 'Mot de passe trop court (minimum 6 caractères)' };
    }

    try {
      let cred;
      // V63.59 : Si l'utilisateur est ANONYME, on lie l'email/mot de passe au compte
      //   anonyme existant → conserve son historique, ses stats et son Premium.
      const current = this.auth.currentUser;
      if (current && current.isAnonymous) {
        try {
          const emailCred = this._fbFns.EmailAuthProvider.credential(email, password);
          cred = await this._fbFns.linkWithCredential(current, emailCred);
          console.log('[V63.59] ✓ Compte anonyme lié à l\'email (données conservées)');
        } catch(linkErr) {
          if (linkErr.code === 'auth/credential-already-in-use' ||
              linkErr.code === 'auth/email-already-in-use') {
            // Email déjà pris → laisser remonter l'erreur avec un message clair
            throw linkErr;
          }
          // Autre souci de liaison → création classique en dernier recours
          console.warn('[V63.59] Liaison anonyme échouée, création classique :', linkErr.code);
          cred = await this._fbFns.createUserWithEmailAndPassword(this.auth, email, password);
        }
      } else {
        cred = await this._fbFns.createUserWithEmailAndPassword(this.auth, email, password);
      }
      const user = cred.user;

      // Mettre à jour le displayName si fourni
      if (additionalInfo && additionalInfo.displayName) {
        try {
          await this._fbFns.updateProfile(user, { displayName: additionalInfo.displayName });
        } catch(e) { console.warn('[Firebase] updateProfile échoué :', e); }
      }

      // Créer le document Firestore avec les infos supplémentaires
      const profile = await this._ensureUserDoc(user, 'email', additionalInfo);

      return {
        success: true,
        user: user,
        profile: profile,
        isNewUser: true
      };

    } catch(error) {
      console.error('[Firebase] Erreur signUpWithEmail :', error);
      let msg = 'Erreur d\'inscription';
      if (error.code === 'auth/email-already-in-use') {
        msg = 'Cet email est déjà utilisé. Connecte-toi avec ton mot de passe.';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Format d\'email invalide';
      } else if (error.code === 'auth/weak-password') {
        msg = 'Mot de passe trop faible (minimum 6 caractères)';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Pas de connexion internet';
      }
      return { success: false, error: msg, errorCode: error.code };
    }
  },

  // ====================================================================
  // CONNEXION EMAIL
  // ====================================================================

  async signInWithEmail(email, password) {
    if (!this.isFirebaseReady) {
      await this.init();
      if (!this.isFirebaseReady) {
        return { success: false, error: 'Firebase non initialisé' };
      }
    }

    try {
      const cred = await this._fbFns.signInWithEmailAndPassword(this.auth, email, password);
      const user = cred.user;
      const profile = await this._loadUserProfile(user.uid);

      return {
        success: true,
        user: user,
        profile: profile,
        isNewUser: false
      };

    } catch(error) {
      console.error('[Firebase] Erreur signInWithEmail :', error);
      let msg = 'Erreur de connexion';
      if (error.code === 'auth/user-not-found' || error.code === 'auth/invalid-credential') {
        msg = 'Email ou mot de passe incorrect';
      } else if (error.code === 'auth/wrong-password') {
        msg = 'Mot de passe incorrect';
      } else if (error.code === 'auth/too-many-requests') {
        msg = 'Trop de tentatives. Réessaye dans quelques minutes.';
      } else if (error.code === 'auth/network-request-failed') {
        msg = 'Pas de connexion internet';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Format d\'email invalide';
      }
      return { success: false, error: msg, errorCode: error.code };
    }
  },

  // ====================================================================
  // DÉCONNEXION
  // ====================================================================

  async signOut() {
    if (!this.isFirebaseReady) return { success: true };
    try {
      await this._fbFns.signOut(this.auth);
      this.user = null;
      this.userProfile = null;
      return { success: true };
    } catch(error) {
      console.error('[Firebase] Erreur signOut :', error);
      return { success: false, error: error.message };
    }
  },

  // ====================================================================
  // MOT DE PASSE OUBLIÉ
  // ====================================================================

  async sendPasswordReset(email) {
    if (!this.isFirebaseReady) {
      await this.init();
      if (!this.isFirebaseReady) return { success: false, error: 'Firebase non initialisé' };
    }
    try {
      await this._fbFns.sendPasswordResetEmail(this.auth, email);
      return { success: true };
    } catch(error) {
      let msg = 'Erreur d\'envoi';
      if (error.code === 'auth/user-not-found') {
        msg = 'Aucun compte trouvé avec cet email';
      } else if (error.code === 'auth/invalid-email') {
        msg = 'Email invalide';
      }
      return { success: false, error: msg };
    }
  },

  // ====================================================================
  // GESTION DU PROFIL FIRESTORE
  // ====================================================================

  // Créer le document utilisateur s'il n'existe pas, ou récupérer l'existant
  async _ensureUserDoc(user, authProvider, additionalInfo) {
    const userRef = this._fbFns.doc(this.db, 'users', user.uid);
    const snap = await this._fbFns.getDoc(userRef);

    if (snap.exists()) {
      // Profil existant : mettre à jour lastLoginAt
      await this._fbFns.updateDoc(userRef, {
        lastLoginAt: this._fbFns.serverTimestamp()
      });
      this.userProfile = { ...snap.data(), _isNewUser: false };
      return this.userProfile;
    }

    // V63.59 : Numéro de visiteur lisible pour les comptes anonymes
    //   → permet de les identifier et suivre dans le tableau de bord admin
    //   → format court dérivé de l'uid (stable, unique) : ex. "VISITEUR-K3F9"
    const isAnon = authProvider === 'anonymous' || user.isAnonymous;
    const visitorNumber = isAnon
      ? 'VISITEUR-' + user.uid.replace(/[^a-zA-Z0-9]/g, '').slice(-4).toUpperCase()
      : '';

    // Nouveau profil
    const newProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (additionalInfo && additionalInfo.displayName) || (isAnon ? visitorNumber : ''),
      photoURL: user.photoURL || '',
      phoneNumber: (additionalInfo && additionalInfo.phoneNumber) || '',
      region: (additionalInfo && additionalInfo.region) || '',
      concoursVises: (additionalInfo && additionalInfo.concoursVises) || [],
      authProvider: authProvider,  // 'google', 'email' ou 'anonymous'
      // V63.59 : Champs de suivi des visiteurs anonymes
      isAnonymous: isAnon,
      visitorNumber: visitorNumber,
      isPremium: false,
      premiumPlan: null,
      premiumExpiresAt: null,
      premiumActivatedAt: null,
      createdAt: this._fbFns.serverTimestamp(),
      lastLoginAt: this._fbFns.serverTimestamp()
    };

    await this._fbFns.setDoc(userRef, newProfile, { merge: true });
    this.userProfile = { ...newProfile, _isNewUser: true };
    return this.userProfile;
  },

  // Charger le profil utilisateur depuis Firestore
  async _loadUserProfile(uid) {
    if (!this.db || !uid) return null;
    try {
      const userRef = this._fbFns.doc(this.db, 'users', uid);
      const snap = await this._fbFns.getDoc(userRef);
      if (snap.exists()) {
        this.userProfile = snap.data();
        return this.userProfile;
      }
      return null;
    } catch(e) {
      console.error('[Firebase] Erreur _loadUserProfile :', e);
      return null;
    }
  },

  // Mettre à jour le profil dans Firestore
  async updateProfile(updates) {
    if (!this.isFirebaseReady || !this.user) {
      return { success: false, error: 'Pas connecté' };
    }
    try {
      const userRef = this._fbFns.doc(this.db, 'users', this.user.uid);
      // Nettoyer les valeurs undefined
      const cleanUpdates = {};
      Object.keys(updates).forEach(k => {
        if (updates[k] !== undefined) cleanUpdates[k] = updates[k];
      });
      // V63.59 : setDoc(merge) au lieu de updateDoc — crée le doc s'il n'existe pas.
      //   Sans ça, updateDoc échouait silencieusement quand le doc user n'existait pas,
      //   et le Premium restait invisible dans le tableau de bord admin.
      cleanUpdates.uid = this.user.uid;
      cleanUpdates.lastLoginAt = this._fbFns.serverTimestamp();
      await this._fbFns.setDoc(userRef, cleanUpdates, { merge: true });
      // Mettre à jour le cache local
      this.userProfile = { ...this.userProfile, ...cleanUpdates };
      return { success: true };
    } catch(error) {
      console.error('[Firebase] Erreur updateProfile :', error);
      return { success: false, error: error.message };
    }
  },

  // ====================================================================
  // UTILITAIRES
  // ====================================================================

  // L'utilisateur est-il connecté à Firebase ?
  isLoggedIn() {
    return this.isFirebaseReady && this.user !== null;
  },

  // Récupérer l'utilisateur actuel
  getCurrentUser() {
    return this.user;
  },

  // Récupérer le profil actuel
  getCurrentProfile() {
    return this.userProfile;
  },

  // S'abonner aux changements d'état d'authentification
  onAuthChange(callback) {
    this._authStateListeners.push(callback);
    // Appeler immédiatement avec l'état actuel
    try { callback(this.user, this.userProfile); } catch(e) {}
    // Retourner une fonction de désinscription
    return () => {
      this._authStateListeners = this._authStateListeners.filter(cb => cb !== callback);
    };
  },

  // ====================================================================
  // V59 : ADMIN - LISTE DES UTILISATEURS
  // ====================================================================

  // Récupérer tous les utilisateurs Firestore (admin seulement)
  // Filtré côté règles de sécurité — n'importe qui qui tente sera bloqué par Firestore Rules
  async getAllUsers() {
    if (!this.isFirebaseReady || !this.user) {
      return { success: false, error: 'Pas connecté', users: [] };
    }
    try {
      const colRef = this._fbFns.collection(this.db, 'users');
      const snapshot = await this._fbFns.getDocs(colRef);
      const users = [];
      snapshot.forEach(doc => {
        users.push({ ...doc.data(), uid: doc.id });
      });
      return { success: true, users };
    } catch (e) {
      console.error('[Firebase] Erreur getAllUsers :', e);
      return { success: false, error: e.message, users: [] };
    }
  },

  /**
   * V64.07 : masquage d'un profil depuis le tableau de bord admin.
   *   Écrit uniquement le champ `adminHidden`. Les règles Firestore
   *   autorisent l'admin (bara.formation@gmail.com) à modifier n'importe
   *   quel document utilisateur ; un autre compte serait refusé.
   *   updateDoc et non setDoc : on ne crée jamais un document fantôme
   *   pour un identifiant qui n'existerait pas.
   */
  async adminSetUserHidden(uid, masquer) {
    if (!this.isFirebaseReady || !this.db) {
      throw new Error('Firebase non initialisé');
    }
    if (!uid) throw new Error('Identifiant utilisateur manquant');
    const ref = this._fbFns.doc(this.db, 'users', uid);
    await this._fbFns.updateDoc(ref, { adminHidden: !!masquer });
    return true;
  },

  // ====================================================================
  // V56.1 : STUBS DE COMPATIBILITÉ ASCENDANTE
  // ====================================================================
  // L'ancien onboarding SMS (avant Firebase Email/Google) appelle ces
  // fonctions. On les remplace par des stubs qui retournent une erreur
  // gracieuse pour basculer en "mode démo" (code 123456) sans planter.
  //
  // À supprimer quand l'ancien onboarding SMS sera désactivé (V57).
  // ====================================================================

  initRecaptcha(containerId) {
    // Stub : ne fait rien. Retourne null pour signaler à l'ancien code qu'il n'y a pas de reCAPTCHA.
    console.log('[V56.1] initRecaptcha appelé (stub) — bascule en mode démo SMS');
    return null;
  },

  async sendOTP(phoneNumber) {
    // Stub : lève une erreur pour que le code appelant bascule en mode démo.
    console.log('[V56.1] sendOTP appelé (stub) pour', phoneNumber, '— SMS désactivé');
    throw new Error('SMS_DISABLED_USE_EMAIL_OR_GOOGLE');
  },

  async verifyOTP(code) {
    console.log('[V56.1] verifyOTP appelé (stub)');
    throw new Error('SMS_DISABLED_USE_EMAIL_OR_GOOGLE');
  },

  async syncHistory() {
    // Stub : retourne un tableau vide pour ne pas casser la synchronisation
    return [];
  },

  // ==================================================================
  // V63.65 : SUIVI D'ACTIVITÉ — compteurs agrégés sur le profil
  // ==================================================================
  //
  // Remplace le stub V63.17 qui ne faisait rien (d'où la colonne QCM
  // toujours à 0 dans le tableau de bord admin).
  //
  // Principe : on n'enregistre PAS chaque QCM comme un document séparé
  // (coûteux et redondant — l'app calcule déjà les stats détaillées en local).
  // On incrémente quelques compteurs sur le document utilisateur :
  //   totalQCM, totalQuestions, totalCorrect, lastActivityAt
  //
  // Coût : 1 écriture Firestore par QCM terminé. Avec ~60 utilisateurs actifs,
  // on reste très loin du quota gratuit (20 000 écritures/jour).
  //
  // increment() est atomique côté serveur : deux appareils du même compte
  // peuvent écrire en même temps sans perte de comptage.

  async saveQCMResult(qcmResult) {
    if (!this.isFirebaseReady || !this.user || !qcmResult) {
      return Promise.resolve();
    }
    try {
      const inc = this._fbFns.increment;
      if (typeof inc !== 'function') {
        // increment non disponible (ancien SDK) → fallback non bloquant
        console.warn('[V63.65] increment() indisponible, comptage ignoré');
        return Promise.resolve();
      }

      const nbQuestions = Number(qcmResult.total) || 0;
      const nbCorrect = Number(qcmResult.score) || 0;
      const duree = Number(qcmResult.duration) || 0;

      const userRef = this._fbFns.doc(this.db, 'users', this.user.uid);

      const donnees = {
        uid: this.user.uid,
        totalQCM: inc(1),
        totalQuestions: inc(nbQuestions),
        totalCorrect: inc(nbCorrect),
        totalDuration: inc(duree),
        lastActivityAt: this._fbFns.serverTimestamp()
      };

      // V64.04 : DETAIL PAR MATIERE (suivi individuel des candidats)
      //   Jusqu'ici `matiereId` etait transmis par endQCM puis ignore ici :
      //   le tableau de bord ne pouvait afficher qu'un total, jamais le detail.
      //
      //   On stocke une table compacte dans le document utilisateur :
      //     matiereStats: { <matiereId>: { n, q, c, t } }
      //       n = nombre de sessions terminees
      //       q = nombre de questions traitees
      //       c = nombre de bonnes reponses
      //       t = date du dernier passage (ms)
      //
      //   Choix volontaire : PAS un document par QCM. La table entiere pese
      //   quelques centaines d'octets et se lit avec le profil, donc ouvrir
      //   la fiche d'un candidat ne coute aucune lecture supplementaire.
      //
      //   increment() fonctionne a l'interieur d'une carte imbriquee, et
      //   setDoc({merge:true}) ne touche que la matiere concernee : les
      //   autres matieres du candidat sont preservees.
      const matId = this._cleMatiere(qcmResult.matiereId);
      if (matId) {
        donnees.matiereStats = {};
        donnees.matiereStats[matId] = {
          n: inc(1),
          q: inc(nbQuestions),
          c: inc(nbCorrect),
          t: Date.now()
        };
      }

      await this._fbFns.setDoc(userRef, donnees, { merge: true });

      return Promise.resolve();
    } catch (e) {
      // Ne jamais bloquer la navigation de l'étudiant pour un souci de statistiques
      console.warn('[V63.65] saveQCMResult :', e.message);
      return Promise.resolve();
    }
  },

  /**
   * V64.04 : Valide un identifiant de matière avant de s'en servir comme clé
   *   de carte Firestore. Les clés ne peuvent pas contenir de point ni de
   *   barre oblique — un identifiant mal formé ferait échouer toute
   *   l'écriture, y compris les compteurs globaux.
   */
  _cleMatiere(id) {
    if (!id) return null;
    const propre = String(id).trim();
    if (!propre) return null;
    if (/[.\/\[\]*~`]/.test(propre)) {
      console.warn('[V64.04] Identifiant de matière écarté (caractère interdit) :', propre);
      return null;
    }
    return propre;
  },

  /**
   * V64.04 : Reconstitution unique de la table par matière depuis le local.
   *
   *   Sans ça, les candidats déjà inscrits repartiraient d'une fiche vide :
   *   tout leur historique est dans le localStorage de leur téléphone. On le
   *   rejoue une fois, au premier lancement après la mise à jour.
   *
   *   L'historique local contient la date de chaque session, donc la date de
   *   dernier passage par matière est reconstituée elle aussi, pas seulement
   *   les totaux.
   *
   *   Marqueur dédié `matiereStatsBackfilled` : le marqueur V63.65
   *   `historyBackfilled` est déjà à true pour les comptes existants, s'en
   *   servir ici empêcherait toute reprise.
   */
  async backfillMatiereStatsFromLocal(history) {
    if (!this.isFirebaseReady || !this.user) return;
    if (!Array.isArray(history) || history.length === 0) return;
    if (this.userProfile && this.userProfile.matiereStatsBackfilled) return;

    try {
      const table = {};
      history.forEach(h => {
        const matId = this._cleMatiere(h && h.matiereId);
        if (!matId) return;
        if (!table[matId]) table[matId] = { n: 0, q: 0, c: 0, t: 0 };
        table[matId].n += 1;
        table[matId].q += Number(h.total) || 0;
        table[matId].c += Number(h.score) || 0;
        const quand = Number(h.date) || 0;
        if (quand > table[matId].t) table[matId].t = quand;
      });

      if (Object.keys(table).length === 0) return;

      // Si des sessions ont déjà été remontées depuis un autre appareil, on
      // garde la valeur la plus élevée plutôt que d'écraser le nuage.
      const dejaLa = (this.userProfile && this.userProfile.matiereStats) || {};
      Object.keys(dejaLa).forEach(matId => {
        const cloud = dejaLa[matId] || {};
        if (!table[matId]) { table[matId] = { n: 0, q: 0, c: 0, t: 0 }; }
        table[matId].n = Math.max(table[matId].n, Number(cloud.n) || 0);
        table[matId].q = Math.max(table[matId].q, Number(cloud.q) || 0);
        table[matId].c = Math.max(table[matId].c, Number(cloud.c) || 0);
        table[matId].t = Math.max(table[matId].t, Number(cloud.t) || 0);
      });

      const userRef = this._fbFns.doc(this.db, 'users', this.user.uid);
      await this._fbFns.setDoc(userRef, {
        uid: this.user.uid,
        matiereStats: table,
        matiereStatsBackfilled: true,
        matiereStatsBackfilledAt: this._fbFns.serverTimestamp()
      }, { merge: true });

      if (this.userProfile) {
        this.userProfile.matiereStatsBackfilled = true;
        this.userProfile.matiereStats = table;
      }
      console.log('[V64.04] \u2713 Detail par matiere reconstitue : ' + Object.keys(table).length + ' matieres');
    } catch (e) {
      console.warn('[V64.04] backfill matieres :', e.message);
    }
  },

  /**
   * V63.65 : Récupération de l'historique déjà accumulé en local.
   *
   * Les compteurs démarrent à zéro alors que beaucoup d'étudiants ont déjà
   * fait des dizaines de QCM (stockés dans localStorage). Cette fonction envoie
   * ce total une seule fois, au premier lancement après la mise à jour.
   *
   * Le marqueur `historyBackfilled` évite tout double comptage.
   */
  async backfillActivityFromLocal(history) {
    if (!this.isFirebaseReady || !this.user) return;
    if (!Array.isArray(history) || history.length === 0) return;
    // Déjà fait pour ce compte ?
    if (this.userProfile && this.userProfile.historyBackfilled) return;

    try {
      const totalQCM = history.length;
      const totalQuestions = history.reduce((s, h) => s + (Number(h.total) || 0), 0);
      const totalCorrect = history.reduce((s, h) => s + (Number(h.score) || 0), 0);
      const totalDuration = history.reduce((s, h) => s + (Number(h.duration) || 0), 0);

      const userRef = this._fbFns.doc(this.db, 'users', this.user.uid);
      // set (pas increment) : on pose la valeur de référence issue du local
      await this._fbFns.setDoc(userRef, {
        uid: this.user.uid,
        totalQCM: totalQCM,
        totalQuestions: totalQuestions,
        totalCorrect: totalCorrect,
        totalDuration: totalDuration,
        historyBackfilled: true,
        historyBackfilledAt: this._fbFns.serverTimestamp()
      }, { merge: true });

      if (this.userProfile) this.userProfile.historyBackfilled = true;
      console.log('[V63.65] ✓ Historique local récupéré : ' + totalQCM + ' QCM');
    } catch (e) {
      console.warn('[V63.65] backfill :', e.message);
    }
  },

  formatPhone(phone) {
    // Stub : reformate juste basique
    if (!phone) return '';
    const cleaned = String(phone).replace(/[^\d+]/g, '');
    if (cleaned.startsWith('+226')) {
      const rest = cleaned.substring(4);
      return '+226 ' + (rest.match(/.{1,2}/g) || []).join(' ');
    }
    return cleaned;
  }
};

window.FirebaseAuth = FirebaseAuth;
