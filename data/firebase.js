// Bara Concours - Module Firebase (Phase 2)
// Authentification téléphone + Firestore pour synchronisation cloud
//
// Pour activer Firebase :
// 1. Mets `enabled: true` ci-dessous
// 2. Remplace les clés par tes vraies clés Firebase
// 3. Voir FIREBASE_SETUP.md pour les instructions complètes

const FirebaseAuth = {
  enabled: false,

  config: {
    apiKey: "REPLACE_WITH_YOUR_API_KEY",
    authDomain: "bara-concours.firebaseapp.com",
    projectId: "bara-concours",
    storageBucket: "bara-concours.appspot.com",
    messagingSenderId: "REPLACE_WITH_SENDER_ID",
    appId: "REPLACE_WITH_APP_ID"
  },

  app: null,
  auth: null,
  db: null,
  user: null,
  recaptchaVerifier: null,
  confirmationResult: null,
  isFirebaseReady: false,
  _fbFns: null,

  async init() {
    if (!this.enabled || this.config.apiKey === "REPLACE_WITH_YOUR_API_KEY") {
      console.log('[Firebase] Mode démo — Firebase non configuré');
      this.isFirebaseReady = false;
      return false;
    }

    try {
      const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js');
      const {
        getAuth, RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged
      } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js');
      const {
        getFirestore, doc, setDoc, getDoc, updateDoc, serverTimestamp,
        collection, addDoc, query, orderBy, limit, getDocs
      } = await import('https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js');

      this.app = initializeApp(this.config);
      this.auth = getAuth(this.app);
      this.db = getFirestore(this.app);

      this._fbFns = {
        RecaptchaVerifier, signInWithPhoneNumber, signOut, onAuthStateChanged,
        doc, setDoc, getDoc, updateDoc, serverTimestamp,
        collection, addDoc, query, orderBy, limit, getDocs
      };

      onAuthStateChanged(this.auth, (user) => {
        this.user = user;
        if (user) {
          console.log('[Firebase] Connecté :', user.phoneNumber);
          this._loadUserData();
        }
        if (window.App && window.App.onAuthChange) window.App.onAuthChange(user);
      });

      this.isFirebaseReady = true;
      console.log('[Firebase] Initialisé avec succès');
      return true;
    } catch (e) {
      console.error('[Firebase] Erreur init :', e);
      this.isFirebaseReady = false;
      return false;
    }
  },

  initRecaptcha(containerId) {
    if (!this.isFirebaseReady) return;
    try {
      if (this.recaptchaVerifier) this.recaptchaVerifier.clear();
      this.recaptchaVerifier = new this._fbFns.RecaptchaVerifier(this.auth, containerId, {
        size: 'invisible',
        callback: () => console.log('[reCAPTCHA] Validé')
      });
    } catch (e) {
      console.error('[reCAPTCHA] Erreur :', e);
    }
  },

  async sendOTP(phoneNumber) {
    if (!this.isFirebaseReady) throw new Error('Firebase non configuré');

    let cleaned = phoneNumber.replace(/\s+/g, '');
    if (!cleaned.startsWith('+')) {
      if (cleaned.length === 8) cleaned = '+226' + cleaned;
      else throw new Error('Numéro invalide');
    }

    try {
      this.confirmationResult = await this._fbFns.signInWithPhoneNumber(
        this.auth, cleaned, this.recaptchaVerifier
      );
      return { success: true, phoneNumber: cleaned };
    } catch (e) {
      console.error('[OTP] Erreur :', e);
      let msg = 'Erreur lors de l\'envoi du code';
      if (e.code === 'auth/invalid-phone-number') msg = 'Numéro invalide';
      else if (e.code === 'auth/too-many-requests') msg = 'Trop de tentatives. Réessayez plus tard.';
      else if (e.code === 'auth/quota-exceeded') msg = 'Quota SMS dépassé';
      throw new Error(msg);
    }
  },

  async verifyOTP(code) {
    if (!this.confirmationResult) throw new Error('Aucun code en attente');
    try {
      const result = await this.confirmationResult.confirm(code);
      const isNewUser = await this._isNewUser(result.user.uid);
      if (isNewUser) await this._createUserProfile(result.user);
      else await this._updateLastLogin(result.user.uid);
      return { success: true, user: result.user, isNewUser };
    } catch (e) {
      console.error('[OTP] Vérif :', e);
      let msg = 'Code incorrect';
      if (e.code === 'auth/invalid-verification-code') msg = 'Code OTP invalide';
      else if (e.code === 'auth/code-expired') msg = 'Code expiré';
      throw new Error(msg);
    }
  },

  async _isNewUser(uid) {
    const d = await this._fbFns.getDoc(this._fbFns.doc(this.db, 'users', uid));
    return !d.exists();
  },

  async _createUserProfile(user) {
    const ref = this._fbFns.doc(this.db, 'users', user.uid);
    await this._fbFns.setDoc(ref, {
      uid: user.uid, phoneNumber: user.phoneNumber,
      displayName: '', city: '', targetConcours: '', educationLevel: '',
      isPremium: false, premiumExpiresAt: null,
      notificationsEnabled: true, notificationTime: '08:00',
      createdAt: this._fbFns.serverTimestamp(),
      lastLoginAt: this._fbFns.serverTimestamp(),
      totalQCM: 0, totalScore: 0
    });
  },

  async _updateLastLogin(uid) {
    const ref = this._fbFns.doc(this.db, 'users', uid);
    await this._fbFns.updateDoc(ref, { lastLoginAt: this._fbFns.serverTimestamp() });
  },

  async _loadUserData() {
    if (!this.user) return null;
    try {
      const d = await this._fbFns.getDoc(this._fbFns.doc(this.db, 'users', this.user.uid));
      if (d.exists()) {
        const data = d.data();
        if (window.App) {
          window.App.state.user = { ...window.App.state.user, ...data, isLoggedIn: true };
          window.App.save();
        }
        return data;
      }
    } catch (e) { console.error('[Firebase] Load :', e); }
    return null;
  },

  async updateProfile(updates) {
    if (!this.user) throw new Error('Non connecté');
    const ref = this._fbFns.doc(this.db, 'users', this.user.uid);
    await this._fbFns.updateDoc(ref, updates);
    return true;
  },

  async saveQCMResult(result) {
    if (!this.user) return null;
    try {
      const ref = await this._fbFns.addDoc(
        this._fbFns.collection(this.db, 'users', this.user.uid, 'history'),
        { ...result, syncedAt: this._fbFns.serverTimestamp() }
      );
      return ref.id;
    } catch (e) { console.error('[Firebase] Save :', e); }
  },

  async syncHistory() {
    if (!this.user) return [];
    try {
      const q = this._fbFns.query(
        this._fbFns.collection(this.db, 'users', this.user.uid, 'history'),
        this._fbFns.orderBy('date', 'desc'),
        this._fbFns.limit(100)
      );
      const snap = await this._fbFns.getDocs(q);
      const list = [];
      snap.forEach(doc => list.push({ id: doc.id, ...doc.data() }));
      return list;
    } catch (e) {
      console.error('[Firebase] Sync :', e);
      return [];
    }
  },

  async logout() {
    if (!this.isFirebaseReady) return;
    try {
      await this._fbFns.signOut(this.auth);
      this.user = null;
    } catch (e) { console.error('[Firebase] Logout :', e); }
  },

  isLoggedIn() { return !!this.user; },
  getCurrentUser() { return this.user; },

  formatPhone(p) {
    if (!p) return '';
    if (p.startsWith('+226')) {
      const n = p.substring(4);
      return `+226 ${n.substring(0,2)} ${n.substring(2,4)} ${n.substring(4,6)} ${n.substring(6,8)}`;
    }
    return p;
  }
};

window.FirebaseAuth = FirebaseAuth;
