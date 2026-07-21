// Bara Concours - Service Firestore Accompagnement Final 2026 (V63.56)
// V63.56 : Fix cache offline (auto-init depuis localStorage + suppression callback synchrone qui ralentissait l'app)
// V63.55 : Cache persistant localStorage — sessions disponibles offline pour toujours
// Architecture cloud pour publication instantanée des sessions
// Format IDENTIQUE à sessions.js (qcm3, qcm4, open, multi)

const SessionsFirestore = {
  // === CONFIGURATION ===
  COLLECTION_SESSIONS: 'accompagnement_final_2026',
  MAX_SESSIONS_LOADED: 50,         // Limite pour économiser les reads Firestore
  CACHE_TTL_MS: 60 * 1000,         // 60 secondes (sessions changent rarement)

  // V63.55 : Cache persistant localStorage pour disponibilité offline permanente
  //   → Une fois une session chargée en ligne, elle reste dispo offline pour toujours.
  //   → Résout le bug où les étudiants perdaient les sujets en coupant le réseau.
  LOCAL_STORAGE_KEY: 'bara_accompagnement_sessions_cache',

  // Cache local en mémoire (rapide, mais perdu à chaque rechargement)
  _sessionsCache: null,
  _sessionsCacheTime: 0,

  // Listener actif (pour pouvoir le détacher)
  _activeListener: null,

  // === HELPERS ===
  _isReady() {
    return window.FirebaseAuth
      && window.FirebaseAuth.isFirebaseReady
      && window.FirebaseAuth._fbFns
      && window.FirebaseAuth.db;
  },

  _fns() {
    return window.FirebaseAuth._fbFns;
  },

  _db() {
    return window.FirebaseAuth.db;
  },

  // V63.55 : Sauvegarder le cache dans localStorage (persiste entre sessions)
  _persistCache(sessions) {
    try {
      localStorage.setItem(this.LOCAL_STORAGE_KEY, JSON.stringify({
        sessions,
        savedAt: Date.now()
      }));
    } catch(e) {
      // Quota localStorage dépassé (peu probable — les sessions font <1MB au total)
      console.warn('[SessionsFirestore] Persistance cache impossible :', e.message);
    }
  },

  // V63.55 : Charger le cache depuis localStorage au démarrage
  _loadPersistedCache() {
    try {
      const raw = localStorage.getItem(this.LOCAL_STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.sessions) ? parsed.sessions : null;
    } catch(e) {
      return null;
    }
  },

  // V63.55 : Initialiser le cache mémoire depuis localStorage (appelé une fois au chargement)
  _initFromLocalStorage() {
    if (this._sessionsCache !== null) return; // déjà init
    const persisted = this._loadPersistedCache();
    if (persisted && persisted.length > 0) {
      this._sessionsCache = persisted;
      // On ne met PAS _sessionsCacheTime = Date.now() pour forcer un refresh au premier appel en ligne
      // (le TTL 60s décidera si on refetch)
      console.log('[SessionsFirestore] ✓ ' + persisted.length + ' session(s) restaurée(s) depuis le cache offline');
    }
  },

  // === LECTURE DES SESSIONS ===
  /**
   * Récupère TOUTES les sessions publiées (statut = 'publie')
   * Triées par date de publication (plus récentes en premier)
   */
  async getAllPublishedSessions() {
    // V63.55 : Init cache mémoire depuis localStorage si pas déjà fait
    this._initFromLocalStorage();

    if (!this._isReady()) {
      // V63.55 : Firebase pas prêt (offline au démarrage) → servir depuis le cache persistant
      const persisted = this._loadPersistedCache();
      if (persisted && persisted.length > 0) {
        return { success: true, sessions: persisted, fromPersistedCache: true };
      }
      return { success: false, sessions: [], error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_SESSIONS);
      const q = fns.query(
        colRef,
        fns.where('statut', '==', 'publie'),
        fns.orderBy('datePublication', 'desc'),
        fns.limit(this.MAX_SESSIONS_LOADED)
      );
      const snap = await fns.getDocs(q);
      const sessions = [];
      snap.forEach(d => {
        const data = d.data();
        sessions.push({
          id: d.id,
          titre: data.titre || '',
          numero: data.numero || 0,
          date: data.date || '',
          datePublication: data.datePublication ? (data.datePublication.toMillis ? data.datePublication.toMillis() : data.datePublication) : Date.now(),
          description: data.description || '',
          questions: data.questions || [],
          isPremium: data.isPremium !== false, // true par défaut
          source: 'firestore'  // Pour différencier des sessions code
        });
      });
      // Mettre en cache mémoire
      this._sessionsCache = sessions;
      this._sessionsCacheTime = Date.now();
      // V63.55 : Persister aussi dans localStorage pour disponibilité offline permanente
      this._persistCache(sessions);
      return { success: true, sessions };
    } catch (e) {
      console.error('[SessionsFirestore] getAllPublishedSessions:', e);
      // V63.55 : Firestore a échoué (offline, timeout...) → servir depuis le cache persistant
      const persisted = this._sessionsCache || this._loadPersistedCache();
      if (persisted && persisted.length > 0) {
        return { success: true, sessions: persisted, fromPersistedCache: true, error: e.message };
      }
      return { success: false, sessions: [], error: e.message };
    }
  },

  /**
   * Récupère les sessions depuis le cache si < 60s, sinon refetch
   */
  async getSessionsCached() {
    // V63.55 : Init cache mémoire depuis localStorage au premier appel
    this._initFromLocalStorage();
    if (this._sessionsCache && (Date.now() - this._sessionsCacheTime < this.CACHE_TTL_MS)) {
      return { success: true, sessions: this._sessionsCache, fromCache: true };
    }
    return this.getAllPublishedSessions();
  },

  /**
   * Écoute en temps réel les changements de sessions (publication, modification)
   * @param {Function} callback - appelée avec la liste des sessions à chaque changement
   * @returns {Function} unsubscribe
   */
  listenToSessions(callback) {
    // V63.55 : Init cache mémoire depuis localStorage si pas déjà fait
    this._initFromLocalStorage();
    // V63.56 : Ne PAS rappeler callback synchronement ici — ça provoquait une chaîne
    //   de renders (listener → callback → render → startSessionsLiveSync → listener → ...)
    //   qui rendait l'app très lente. Le rendu utilise déjà _sessionsCache directement
    //   dans getMergedAccompagnementSessions() dès qu'il est peuplé (V63.56).

    if (!this._isReady()) {
      console.warn('[SessionsFirestore] listenToSessions : Firebase non prêt — mode offline');
      return () => {};
    }
    const fns = this._fns();
    const colRef = fns.collection(this._db(), this.COLLECTION_SESSIONS);
    const q = fns.query(
      colRef,
      fns.where('statut', '==', 'publie'),
      fns.orderBy('datePublication', 'desc'),
      fns.limit(this.MAX_SESSIONS_LOADED)
    );
    const unsub = fns.onSnapshot(q, (snap) => {
      const sessions = [];
      snap.forEach(d => {
        const data = d.data();
        sessions.push({
          id: d.id,
          titre: data.titre || '',
          numero: data.numero || 0,
          date: data.date || '',
          datePublication: data.datePublication ? (data.datePublication.toMillis ? data.datePublication.toMillis() : data.datePublication) : Date.now(),
          description: data.description || '',
          questions: data.questions || [],
          isPremium: data.isPremium !== false,
          source: 'firestore'
        });
      });
      this._sessionsCache = sessions;
      this._sessionsCacheTime = Date.now();
      // V63.55 : Persister dans localStorage à chaque snapshot
      //   → Les futures ouvertures offline auront toujours les données à jour
      this._persistCache(sessions);
      try { callback(sessions); } catch(e) { console.error('[SessionsFirestore] callback err:', e); }
    }, (error) => {
      console.error('[SessionsFirestore] listenToSessions error:', error);
    });
    this._activeListener = unsub;
    return unsub;
  },

  /**
   * Récupère TOUTES les sessions (incluant brouillons) — Admin uniquement
   */
  async getAllSessionsAdmin() {
    if (!this._isReady()) {
      return { success: false, sessions: [], error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_SESSIONS);
      const q = fns.query(colRef, fns.orderBy('datePublication', 'desc'), fns.limit(100));
      const snap = await fns.getDocs(q);
      const sessions = [];
      snap.forEach(d => {
        const data = d.data();
        sessions.push({
          id: d.id,
          titre: data.titre || '',
          numero: data.numero || 0,
          date: data.date || '',
          datePublication: data.datePublication ? (data.datePublication.toMillis ? data.datePublication.toMillis() : data.datePublication) : Date.now(),
          description: data.description || '',
          questions: data.questions || [],
          isPremium: data.isPremium !== false,
          statut: data.statut || 'brouillon',
          authorEmail: data.authorEmail || ''
        });
      });
      return { success: true, sessions };
    } catch (e) {
      console.error('[SessionsFirestore] getAllSessionsAdmin:', e);
      return { success: false, sessions: [], error: e.message };
    }
  },

  /**
   * Récupère une session précise par son ID
   */
  async getSessionById(sessionId) {
    if (!this._isReady() || !sessionId) {
      return { success: false, session: null, error: 'Firebase non prêt' };
    }
    // Essayer cache d'abord
    if (this._sessionsCache) {
      const cached = this._sessionsCache.find(s => s.id === sessionId);
      if (cached) return { success: true, session: cached, fromCache: true };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_SESSIONS, sessionId);
      const snap = await fns.getDoc(docRef);
      if (!snap.exists()) {
        return { success: false, session: null, error: 'Session introuvable' };
      }
      const data = snap.data();
      return {
        success: true,
        session: {
          id: snap.id,
          titre: data.titre || '',
          numero: data.numero || 0,
          date: data.date || '',
          datePublication: data.datePublication ? (data.datePublication.toMillis ? data.datePublication.toMillis() : data.datePublication) : Date.now(),
          description: data.description || '',
          questions: data.questions || [],
          isPremium: data.isPremium !== false,
          statut: data.statut || 'publie',
          source: 'firestore'
        }
      };
    } catch (e) {
      console.error('[SessionsFirestore] getSessionById:', e);
      return { success: false, session: null, error: e.message };
    }
  },

  // === CRÉATION / MODIFICATION (Admin uniquement) ===
  /**
   * Crée une nouvelle session
   * @param {Object} sessionData - { titre, numero, date, description, questions, isPremium, statut }
   * @returns {Promise<{success, sessionId, error}>}
   */
  async createSession(sessionData) {
    if (!this._isReady()) {
      return { success: false, error: 'Firebase non prêt' };
    }
    const user = window.FirebaseAuth.user;
    if (!user) {
      return { success: false, error: 'Authentification requise' };
    }
    // Validation
    if (!sessionData.titre || sessionData.titre.trim().length < 5) {
      return { success: false, error: 'Le titre doit faire au moins 5 caractères' };
    }
    if (!Array.isArray(sessionData.questions) || sessionData.questions.length === 0) {
      return { success: false, error: 'Au moins une question est requise' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_SESSIONS);
      const docData = {
        titre: sessionData.titre.trim(),
        numero: sessionData.numero || 0,
        date: sessionData.date || new Date().toISOString().slice(0, 10),
        description: (sessionData.description || '').trim(),
        questions: sessionData.questions,
        isPremium: sessionData.isPremium !== false,
        statut: sessionData.statut || 'brouillon',
        authorUid: user.uid,
        authorEmail: user.email || '',
        datePublication: fns.serverTimestamp(),
        dateCreation: fns.serverTimestamp()
      };
      const docRef = await fns.addDoc(colRef, docData);
      // Invalider le cache
      this._sessionsCache = null;
      return { success: true, sessionId: docRef.id };
    } catch (e) {
      console.error('[SessionsFirestore] createSession:', e);
      return { success: false, error: e.message || 'Erreur lors de la création' };
    }
  },

  /**
   * Met à jour une session existante
   */
  async updateSession(sessionId, updates) {
    if (!this._isReady() || !sessionId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_SESSIONS, sessionId);
      // Construire les updates autorisés
      const allowed = ['titre', 'numero', 'date', 'description', 'questions', 'isPremium', 'statut'];
      const cleanUpdates = {};
      allowed.forEach(k => {
        if (updates[k] !== undefined) cleanUpdates[k] = updates[k];
      });
      if (Object.keys(cleanUpdates).length === 0) {
        return { success: false, error: 'Aucune modification' };
      }
      cleanUpdates.dateModification = fns.serverTimestamp();
      await fns.updateDoc(docRef, cleanUpdates);
      // Invalider le cache
      this._sessionsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[SessionsFirestore] updateSession:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Publie un brouillon (statut: 'brouillon' → 'publie')
   */
  async publishSession(sessionId) {
    if (!this._isReady() || !sessionId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_SESSIONS, sessionId);
      await fns.updateDoc(docRef, {
        statut: 'publie',
        datePublication: fns.serverTimestamp()
      });
      this._sessionsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[SessionsFirestore] publishSession:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Dépublie une session (statut: 'publie' → 'brouillon')
   */
  async unpublishSession(sessionId) {
    if (!this._isReady() || !sessionId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const docRef = fns.doc(this._db(), this.COLLECTION_SESSIONS, sessionId);
      await fns.updateDoc(docRef, { statut: 'brouillon' });
      this._sessionsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[SessionsFirestore] unpublishSession:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Supprime une session définitivement
   */
  async deleteSession(sessionId) {
    if (!this._isReady() || !sessionId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      await fns.deleteDoc(fns.doc(this._db(), this.COLLECTION_SESSIONS, sessionId));
      // V63.31 : Retirer immédiatement du cache local (au lieu d'attendre le listener)
      if (this._sessionsCache) {
        this._sessionsCache = this._sessionsCache.filter(s => s.id !== sessionId);
      }
      this._sessionsCacheTime = 0; // Forcer un refetch au prochain getSessionsCached
      return { success: true };
    } catch (e) {
      console.error('[SessionsFirestore] deleteSession:', e);
      return { success: false, error: e.message };
    }
  },

  // === COHABITATION : Fusion sessions code + Firestore ===
  /**
   * Fusionne les sessions du code (sessions.js, 2025) + sessions Firestore (2026)
   * Tri : par date de publication décroissante (les plus récentes en premier)
   * Note : les sessions code n'ont pas de datePublication, on utilise leur date
   */
  getAllMergedSessions() {
    // Sessions du code (2025)
    const codeSessions = window.SessionsHelper
      ? window.SessionsHelper.getAllSessions().map(s => ({
          ...s,
          source: 'code',
          datePublication: new Date(s.date || '2025-08-01').getTime()
        }))
      : [];
    // Sessions Firestore (2026) — depuis cache
    const firestoreSessions = this._sessionsCache || [];
    // Fusion + tri décroissant
    const all = [...firestoreSessions, ...codeSessions];
    all.sort((a, b) => (b.datePublication || 0) - (a.datePublication || 0));
    return all;
  },

  // === CLEANUP ===
  unsubscribe() {
    if (this._activeListener) {
      try { this._activeListener(); } catch(e) {}
      this._activeListener = null;
    }
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.SessionsFirestore = SessionsFirestore;
  // V63.56 : Auto-init le cache depuis localStorage dès le chargement du module.
  //   → Assure que _sessionsCache est peuplé au premier render de renderSessionsList(),
  //     même quand Firebase n'est pas prêt (offline / mode avion / réseau instable).
  //   → C'est ce qui permet à getMergedAccompagnementSessions() de voir les sessions
  //     Firestore 2026 offline (fix du bug où le placeholder "À VENIR" apparaissait).
  try {
    SessionsFirestore._initFromLocalStorage();
  } catch(e) {
    console.warn('[SessionsFirestore] Auto-init depuis localStorage échoué :', e);
  }
}
