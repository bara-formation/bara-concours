// Bara Concours - Service Firestore Textes éditables (V63.34)
// Permet à l'admin de modifier les textes courants de l'app sans MAJ
// Architecture : collection `app_texts` avec un document unique par clé

const TextsFirestore = {
  // === CONFIGURATION ===
  COLLECTION_TEXTS: 'app_texts',
  CACHE_TTL_MS: 60 * 1000, // 60s

  // Cache local (clé -> valeur)
  _textsCache: null,
  _textsCacheTime: 0,

  // Listener actif
  _activeListener: null,

  // === TEXTES PAR DÉFAUT (fallback si pas de version Firestore) ===
  DEFAULT_TEXTS: {
    // ACCUEIL
    'home_greeting': 'futur cadre 🇧🇫',
    'home_subtitle': 'Choisis ton concours et démarre l\'entraînement',
    'accomp_desc': 'Corrigés bien détaillés des concours avec explications complètes',

    // AUTH
    'auth_subtitle': 'Préparation aux concours de la fonction publique du Burkina Faso',
    'auth_motivation': 'Rejoins des milliers de candidats qui révisent malin',

    // À PROPOS
    'about_mission': 'Bara Concours est l\'application officielle de Bara Formation, dédiée à la préparation des étudiants burkinabè aux concours de la fonction publique.',
    'about_objectif': 'Notre objectif : démocratiser l\'accès à une préparation de qualité pour tous, partout au Burkina Faso.',
    'about_baseline': 'Le pays des hommes intègres',

    // PREMIUM
    'premium_pitch': 'Pour réussir ton concours, tu as besoin de Bara Premium',
    'premium_benefit_1': 'Accès à toutes les questions corrigées',
    'premium_benefit_2': 'Sessions Accompagnement Final en direct',
    'premium_benefit_3': 'Examens hebdomadaires + classement',

    // FORUM
    'forum_rules': 'Sois respectueux. Pas de spam, pas d\'insultes, pas de liens externes. Les messages inappropriés sont automatiquement bloqués.',
    'forum_welcome': 'Échange avec les autres candidats du Burkina',

    // BANNIÈRE OFFICIELLE
    'banner_title': 'Session 2026 — Concours directs',
    'banner_desc': 'Inscriptions ouvertes sur econcours.gov.bf'
  },

  // === MÉTADONNÉES (pour l'affichage dans l'admin) ===
  TEXTS_METADATA: {
    // ACCUEIL
    'home_greeting': { category: 'Accueil', label: 'Suffixe salutation', help: 'Affiché après "Bonjour/Bon après-midi/Bon soir,". Ex: "futur cadre 🇧🇫"' },
    'home_subtitle': { category: 'Accueil', label: 'Sous-titre accueil', help: 'Phrase d\'accroche sous le titre Bara Concours.' },
    'accomp_desc': { category: 'Accueil', label: 'Description Accompagnement', help: 'Description courte sur la carte Accompagnement Final.' },

    // AUTH
    'auth_subtitle': { category: 'Inscription', label: 'Sous-titre inscription', help: 'Affiché sur la page d\'inscription/connexion.' },
    'auth_motivation': { category: 'Inscription', label: 'Texte motivation', help: 'Phrase d\'accroche bonus.' },

    // À PROPOS
    'about_mission': { category: 'À propos', label: 'Mission', help: 'Description de la mission de Bara Concours.' },
    'about_objectif': { category: 'À propos', label: 'Objectif', help: 'Notre engagement envers les utilisateurs.' },
    'about_baseline': { category: 'À propos', label: 'Slogan Burkina Faso', help: 'Affiché sous le drapeau dans la page À propos.' },

    // PREMIUM
    'premium_pitch': { category: 'Premium', label: 'Accroche Premium', help: 'Phrase de vente principale Premium.' },
    'premium_benefit_1': { category: 'Premium', label: 'Bénéfice 1', help: 'Premier avantage Premium.' },
    'premium_benefit_2': { category: 'Premium', label: 'Bénéfice 2', help: 'Deuxième avantage Premium.' },
    'premium_benefit_3': { category: 'Premium', label: 'Bénéfice 3', help: 'Troisième avantage Premium.' },

    // FORUM
    'forum_rules': { category: 'Forum', label: 'Règles du forum', help: 'Affichées en haut du forum.' },
    'forum_welcome': { category: 'Forum', label: 'Message bienvenue', help: 'Sous-titre dans l\'entête du forum.' },

    // BANNIÈRE
    'banner_title': { category: 'Bannière', label: 'Titre bannière officielle', help: 'Titre de l\'annonce session 2026 sur l\'accueil.' },
    'banner_desc': { category: 'Bannière', label: 'Description bannière', help: 'Description sous le titre bannière.' }
  },

  // === HELPERS ===
  _isReady() {
    return window.FirebaseAuth
      && window.FirebaseAuth.isFirebaseReady
      && window.FirebaseAuth._fbFns
      && window.FirebaseAuth.db;
  },

  _fns() { return window.FirebaseAuth._fbFns; },
  _db() { return window.FirebaseAuth.db; },

  // === LECTURE DES TEXTES ===
  /**
   * Récupère TOUS les textes depuis Firestore
   * @returns {Promise<{success, texts, error}>}
   */
  async getAllTexts() {
    if (!this._isReady()) {
      return { success: false, texts: this.DEFAULT_TEXTS, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_TEXTS);
      const snap = await fns.getDocs(colRef);
      const texts = { ...this.DEFAULT_TEXTS };
      snap.forEach(d => {
        const data = d.data();
        if (data.value !== undefined) {
          texts[d.id] = data.value;
        }
      });
      this._textsCache = texts;
      this._textsCacheTime = Date.now();
      return { success: true, texts };
    } catch (e) {
      console.error('[TextsFirestore] getAllTexts:', e);
      return { success: false, texts: this._textsCache || this.DEFAULT_TEXTS, error: e.message };
    }
  },

  /**
   * Récupère un texte par sa clé (avec fallback au défaut)
   * @param {string} key
   * @returns {string}
   */
  get(key) {
    if (this._textsCache && this._textsCacheTime > 0) {
      if (this._textsCache[key] !== undefined) return this._textsCache[key];
    }
    return this.DEFAULT_TEXTS[key] || '';
  },

  /**
   * Listener temps réel sur les textes
   */
  listenToTexts(callback) {
    if (!this._isReady()) return () => {};
    const fns = this._fns();
    const colRef = fns.collection(this._db(), this.COLLECTION_TEXTS);
    const unsub = fns.onSnapshot(colRef, (snap) => {
      const texts = { ...this.DEFAULT_TEXTS };
      snap.forEach(d => {
        const data = d.data();
        if (data.value !== undefined) {
          texts[d.id] = data.value;
        }
      });
      this._textsCache = texts;
      this._textsCacheTime = Date.now();
      try { callback(texts); } catch(e) { console.error('[TextsFirestore] callback err:', e); }
    }, (error) => {
      console.error('[TextsFirestore] listenToTexts error:', error);
    });
    this._activeListener = unsub;
    return unsub;
  },

  // === ÉCRITURE (admin uniquement) ===
  /**
   * Met à jour un texte
   * @param {string} key
   * @param {string} value
   */
  async setText(key, value) {
    if (!this._isReady()) {
      return { success: false, error: 'Firebase non prêt' };
    }
    const user = window.FirebaseAuth.user;
    if (!user) {
      return { success: false, error: 'Authentification requise' };
    }
    if (!key || !this.DEFAULT_TEXTS.hasOwnProperty(key)) {
      return { success: false, error: 'Clé inconnue : ' + key };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_TEXTS, key);
      await fns.setDoc(docRef, {
        value: value,
        updatedAt: fns.serverTimestamp(),
        updatedBy: user.email || user.uid
      });
      // Mettre à jour le cache local immédiatement
      if (this._textsCache) {
        this._textsCache[key] = value;
      }
      return { success: true };
    } catch (e) {
      console.error('[TextsFirestore] setText:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Restaure un texte à sa valeur par défaut (supprime le document Firestore)
   */
  async resetText(key) {
    if (!this._isReady()) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_TEXTS, key);
      await fns.deleteDoc(docRef);
      // Restaurer la valeur par défaut dans le cache local
      if (this._textsCache && this.DEFAULT_TEXTS[key] !== undefined) {
        this._textsCache[key] = this.DEFAULT_TEXTS[key];
      }
      return { success: true };
    } catch (e) {
      console.error('[TextsFirestore] resetText:', e);
      return { success: false, error: e.message };
    }
  },

  // === CLEANUP ===
  unsubscribe() {
    if (this._activeListener) {
      try { this._activeListener(); } catch(e) {}
      this._activeListener = null;
    }
  }
};

// === Helper GLOBAL : getText() utilisable partout dans l'app ===
if (typeof window !== 'undefined') {
  window.TextsFirestore = TextsFirestore;
  // Raccourci global
  window.getText = function(key, fallback) {
    if (window.TextsFirestore) {
      const v = window.TextsFirestore.get(key);
      if (v) return v;
    }
    return fallback || TextsFirestore.DEFAULT_TEXTS[key] || '';
  };
}
