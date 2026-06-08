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
        // Firestore
        doc: dbMod.doc,
        setDoc: dbMod.setDoc,
        getDoc: dbMod.getDoc,
        updateDoc: dbMod.updateDoc,
        serverTimestamp: dbMod.serverTimestamp,
        collection: dbMod.collection,
        query: dbMod.query,
        where: dbMod.where,
        getDocs: dbMod.getDocs,
        deleteDoc: dbMod.deleteDoc
      };

      this.isFirebaseReady = true;
      console.log('[Firebase] ✓ Initialisé avec succès');

      // Surveillance des changements d'état d'authentification
      this._fbFns.onAuthStateChanged(this.auth, async (user) => {
        if (user) {
          this.user = user;
          // Charger le profil étendu depuis Firestore
          await this._loadUserProfile(user.uid);
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
        // Pas grave, c'est juste qu'il n'y avait pas de redirect en attente
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

    try {
      const provider = new this._fbFns.GoogleAuthProvider();
      provider.setCustomParameters({ prompt: 'select_account' });  // Force choix du compte

      // Sur APK Android (TWA), popup peut être bloqué → utiliser redirect
      const isAPK = window.matchMedia('(display-mode: standalone)').matches;
      let result;

      if (isAPK) {
        // Mode APK : redirect (le résultat sera traité au prochain init via getRedirectResult)
        await this._fbFns.signInWithRedirect(this.auth, provider);
        return { success: true, pending: true };  // L'app va recharger
      } else {
        // Mode navigateur : popup
        result = await this._fbFns.signInWithPopup(this.auth, provider);
      }

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
      let msg = 'Erreur de connexion Google';
      if (error.code === 'auth/popup-closed-by-user') {
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
      const cred = await this._fbFns.createUserWithEmailAndPassword(this.auth, email, password);
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

    // Nouveau profil
    const newProfile = {
      uid: user.uid,
      email: user.email || '',
      displayName: user.displayName || (additionalInfo && additionalInfo.displayName) || '',
      photoURL: user.photoURL || '',
      phoneNumber: (additionalInfo && additionalInfo.phoneNumber) || '',
      region: (additionalInfo && additionalInfo.region) || '',
      concoursVises: (additionalInfo && additionalInfo.concoursVises) || [],
      authProvider: authProvider,  // 'google' ou 'email'
      isPremium: false,
      premiumPlan: null,
      premiumExpiresAt: null,
      premiumActivatedAt: null,
      createdAt: this._fbFns.serverTimestamp(),
      lastLoginAt: this._fbFns.serverTimestamp()
    };

    await this._fbFns.setDoc(userRef, newProfile);
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
      await this._fbFns.updateDoc(userRef, cleanUpdates);
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
