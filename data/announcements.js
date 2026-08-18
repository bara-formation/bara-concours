// Bara Concours - Service Annonces (V63.85)
// =========================================================================
// Permet à Bara Formation de diffuser un message dans un bandeau en haut de
// l'accueil de l'application : information, avertissement ou message urgent.
//
// Le ciblage évite d'envoyer à tout le monde un message qui ne concerne
// qu'une partie des candidats :
//   all       → tous
//   premium   → abonnés dont l'accès est actif
//   free      → comptes créés mais sans abonnement actif
//   anonymous → visiteurs qui n'ont pas créé de compte
//   expired   → anciens abonnés dont l'accès est arrivé à terme (relance)
//   custom    → liste de comptes choisis un par un
//
// Chaque annonce a une fenêtre d'affichage (début, fin) et un interrupteur.
// Une annonce n'apparaît que si elle est active ET dans sa fenêtre.
// =========================================================================

const Announcements = {
  COLLECTION: 'app_announcements',
  CACHE_KEY: 'bara_announcements_cache',
  DISMISS_KEY: 'bara_announcements_dismissed',

  _cache: null,
  _cacheTime: 0,
  CACHE_TTL_MS: 60 * 1000,
  _listener: null,

  // === HELPERS ===
  _isReady() {
    return window.FirebaseAuth
      && window.FirebaseAuth.isFirebaseReady
      && window.FirebaseAuth._fbFns
      && window.FirebaseAuth.db;
  },
  _fns() { return window.FirebaseAuth._fbFns; },
  _db() { return window.FirebaseAuth.db; },

  _persist(list) {
    try {
      localStorage.setItem(this.CACHE_KEY, JSON.stringify({ list, savedAt: Date.now() }));
    } catch (e) { /* quota : non bloquant */ }
  },

  _loadPersisted() {
    try {
      const raw = localStorage.getItem(this.CACHE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.list) ? parsed.list : null;
    } catch (e) { return null; }
  },

  _normalize(id, d) {
    return {
      id: id,
      title: d.title || '',
      body: d.body || '',
      level: d.level || 'info',              // info | warning | urgent
      audience: d.audience || 'all',
      targetUids: Array.isArray(d.targetUids) ? d.targetUids : [],
      startAt: d.startAt || 0,
      endAt: d.endAt || null,
      active: d.active !== false,
      createdAt: d.createdAt || 0,
      updatedAt: d.updatedAt || 0
    };
  },

  // === LECTURE ===
  async getAll() {
    if (!this._isReady()) {
      const p = this._loadPersisted();
      return { success: !!p, announcements: p || [], fromCache: true };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION);
      const q = fns.query(colRef, fns.orderBy('createdAt', 'desc'), fns.limit(50));
      const snap = await fns.getDocs(q);
      const list = [];
      snap.forEach(d => list.push(this._normalize(d.id, d.data())));
      this._cache = list;
      this._cacheTime = Date.now();
      this._persist(list);
      return { success: true, announcements: list };
    } catch (e) {
      console.error('[Announcements] getAll:', e);
      const p = this._loadPersisted();
      return { success: !!p, announcements: p || [], error: e.message };
    }
  },

  getAllLocal() {
    if (this._cache) return this._cache;
    const p = this._loadPersisted();
    if (p) this._cache = p;
    return this._cache || [];
  },

  /**
   * Écoute en temps réel : une annonce urgente publiée depuis l'admin
   * apparaît sans que le candidat ait à relancer l'application.
   */
  listen(callback) {
    if (!this._isReady()) return () => {};
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION);
      const q = fns.query(colRef, fns.orderBy('createdAt', 'desc'), fns.limit(50));
      const unsub = fns.onSnapshot(q, (snap) => {
        const list = [];
        snap.forEach(d => list.push(this._normalize(d.id, d.data())));
        this._cache = list;
        this._cacheTime = Date.now();
        this._persist(list);
        try { callback(list); } catch (e) { console.error('[Announcements] callback:', e); }
      }, (err) => console.error('[Announcements] listen:', err));
      this._listener = unsub;
      return unsub;
    } catch (e) {
      console.error('[Announcements] listen:', e);
      return () => {};
    }
  },

  unsubscribe() {
    if (this._listener) {
      try { this._listener(); } catch (e) {}
      this._listener = null;
    }
  },

  // === CIBLAGE ===
  /**
   * Le statut de l'utilisateur, tel qu'il sert au ciblage.
   *   anonymous : visiteur sans compte
   *   premium   : abonnement en cours
   *   expired   : a déjà été abonné, ne l'est plus
   *   free      : inscrit sans abonnement
   */
  statutUtilisateur(user) {
    if (!user || !user.isLoggedIn) return 'anonymous';
    const actif = window.PremiumService && window.PremiumService.isUserPremium(user);
    if (actif) return 'premium';
    if (user.premiumExpiresAt) return 'expired';
    return 'free';
  },

  concerne(annonce, user) {
    const statut = this.statutUtilisateur(user);
    switch (annonce.audience) {
      case 'all':       return true;
      case 'premium':   return statut === 'premium';
      case 'free':      return statut === 'free';
      case 'anonymous': return statut === 'anonymous';
      case 'expired':   return statut === 'expired';
      case 'custom':    return !!(user && user.uid && annonce.targetUids.includes(user.uid));
      default:          return false;
    }
  },

  dansLaFenetre(annonce, maintenant) {
    const t = maintenant || Date.now();
    if (annonce.startAt && t < annonce.startAt) return false;
    if (annonce.endAt && t > annonce.endAt) return false;
    return true;
  },

  /**
   * Les annonces qu'un utilisateur donné doit voir, à cet instant.
   */
  pourUtilisateur(user) {
    const t = Date.now();
    return this.getAllLocal()
      .filter(a => a.active && this.dansLaFenetre(a, t) && this.concerne(a, user))
      .sort((a, b) => {
        const poids = { urgent: 0, warning: 1, info: 2 };
        const pa = poids[a.level] !== undefined ? poids[a.level] : 2;
        const pb = poids[b.level] !== undefined ? poids[b.level] : 2;
        if (pa !== pb) return pa - pb;
        return (b.createdAt || 0) - (a.createdAt || 0);
      });
  },

  // === MASQUAGE PAR L'UTILISATEUR ===
  //   Le candidat peut refermer un bandeau qui le gêne. Le message reste
  //   accessible : tant qu'il est diffusé, une pastille permet de le rouvrir.
  _lireMasques() {
    try {
      const raw = localStorage.getItem(this.DISMISS_KEY);
      return raw ? (JSON.parse(raw) || {}) : {};
    } catch (e) { return {}; }
  },

  estMasquee(id) {
    return !!this._lireMasques()[id];
  },

  masquer(id) {
    try {
      const m = this._lireMasques();
      m[id] = Date.now();
      localStorage.setItem(this.DISMISS_KEY, JSON.stringify(m));
    } catch (e) {}
  },

  reafficher(id) {
    try {
      const m = this._lireMasques();
      delete m[id];
      localStorage.setItem(this.DISMISS_KEY, JSON.stringify(m));
    } catch (e) {}
  },

  reafficherTout() {
    try { localStorage.removeItem(this.DISMISS_KEY); } catch (e) {}
  },

  // === ÉCRITURE (admin uniquement) ===
  async create(data) {
    if (!this._isReady()) return { success: false, error: 'Firebase non prêt' };
    const user = window.FirebaseAuth.user;
    if (!user) return { success: false, error: 'Authentification requise' };
    if (!data.title || data.title.trim().length < 3) {
      return { success: false, error: 'Le titre doit faire au moins 3 caractères' };
    }
    if (!data.body || data.body.trim().length < 5) {
      return { success: false, error: 'Le message doit faire au moins 5 caractères' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION);
      const doc = {
        title: data.title.trim(),
        body: data.body.trim(),
        level: data.level || 'info',
        audience: data.audience || 'all',
        targetUids: Array.isArray(data.targetUids) ? data.targetUids : [],
        startAt: data.startAt || Date.now(),
        endAt: data.endAt || null,
        active: data.active === true,
        authorUid: user.uid,
        createdAt: Date.now(),
        updatedAt: Date.now()
      };
      const ref = await fns.addDoc(colRef, doc);
      this._cache = null;
      return { success: true, id: ref.id };
    } catch (e) {
      console.error('[Announcements] create:', e);
      return { success: false, error: e.message };
    }
  },

  async update(id, updates) {
    if (!this._isReady() || !id) return { success: false, error: 'Firebase non prêt' };
    try {
      const fns = this._fns();
      const autorises = ['title', 'body', 'level', 'audience', 'targetUids', 'startAt', 'endAt', 'active'];
      const clean = {};
      autorises.forEach(k => { if (updates[k] !== undefined) clean[k] = updates[k]; });
      if (Object.keys(clean).length === 0) return { success: false, error: 'Aucune modification' };
      clean.updatedAt = Date.now();
      await fns.updateDoc(fns.doc(this._db(), this.COLLECTION, id), clean);
      this._cache = null;
      return { success: true };
    } catch (e) {
      console.error('[Announcements] update:', e);
      return { success: false, error: e.message };
    }
  },

  async remove(id) {
    if (!this._isReady() || !id) return { success: false, error: 'Firebase non prêt' };
    try {
      const fns = this._fns();
      await fns.deleteDoc(fns.doc(this._db(), this.COLLECTION, id));
      if (this._cache) this._cache = this._cache.filter(a => a.id !== id);
      return { success: true };
    } catch (e) {
      console.error('[Announcements] remove:', e);
      return { success: false, error: e.message };
    }
  }
};

if (typeof window !== 'undefined') {
  window.Announcements = Announcements;
}
