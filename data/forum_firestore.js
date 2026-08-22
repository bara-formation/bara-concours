// Bara Concours - Service Forum Firestore (V63.19)
// Forum communautaire partagé en temps réel via Firestore
// Structure : forum_topics (collection) + forum_replies/<topicId>/replies (subcollection)

const ForumFirestore = {
  // === CONFIGURATION ===
  COLLECTION_TOPICS: 'forum_topics',
  COLLECTION_REPLIES: 'forum_replies',
  // V63.80 : les signalements remontent enfin jusqu'a l'administrateur.
  //   Avant, App.reportTopic ne les ecrivait que dans le localStorage du
  //   telephone qui signalait : personne ne les voyait jamais.
  COLLECTION_REPORTS: 'forum_reports',
  MAX_TOPICS_LOADED: 50,         // Limite pour économiser les reads Firestore
  MAX_REPLIES_PER_TOPIC: 100,

  // Cache local pour éviter les multiples lectures
  _topicsCache: null,
  _topicsCacheTime: 0,
  CACHE_TTL_MS: 30 * 1000,        // 30 secondes

  // Listeners actifs (pour pouvoir les détacher)
  _activeListeners: [],

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

  _getCurrentUserInfo() {
    const user = window.FirebaseAuth.user;
    const profile = window.FirebaseAuth.userProfile;
    if (!user) return null;
    return {
      uid: user.uid,
      authorName: (profile && profile.displayName) || user.displayName || (user.email && user.email.split('@')[0]) || 'Anonyme',
      authorEmail: user.email || null,
      isPremium: (profile && profile.isPremium) || false
    };
  },

  // === LECTURE DES TOPICS ===
  /**
   * Récupère tous les topics du forum (les plus récents en premier)
   * @returns {Promise<{success, topics, error}>}
   */
  // ==================================================================
  // V63.89 : PERSISTANCE LOCALE — le forum survit à la coupure réseau
  // ==================================================================
  //   Le service ne gardait ses données qu'en mémoire vive. Dès que la
  //   connexion tombait — ou simplement à la réouverture de l'application
  //   hors réseau — le cache était vide et le forum apparaissait désert :
  //   impossible de relire ne serait-ce qu'un ancien message.
  //
  //   Les sujets et les réponses sont désormais recopiés dans le stockage
  //   du téléphone à chaque chargement. Le forum reste consultable hors
  //   connexion, en lecture seule.

  LOCAL_TOPICS_KEY: 'bara_forum_topics_cache',
  LOCAL_REPLIES_KEY: 'bara_forum_replies_cache',

  _persistTopics(topics) {
    try {
      localStorage.setItem(this.LOCAL_TOPICS_KEY, JSON.stringify({ topics, savedAt: Date.now() }));
    } catch (e) { /* quota dépassé : non bloquant */ }
  },

  loadPersistedTopics() {
    try {
      const raw = localStorage.getItem(this.LOCAL_TOPICS_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      return Array.isArray(parsed.topics) ? parsed.topics : null;
    } catch (e) { return null; }
  },

  _persistReplies(topicId, replies) {
    try {
      const raw = localStorage.getItem(this.LOCAL_REPLIES_KEY);
      const all = raw ? (JSON.parse(raw) || {}) : {};
      all[topicId] = { replies, savedAt: Date.now() };
      // On ne garde que les 20 discussions les plus récemment consultées
      const cles = Object.keys(all).sort((a, b) => (all[b].savedAt || 0) - (all[a].savedAt || 0));
      const garde = {};
      cles.slice(0, 20).forEach(k => garde[k] = all[k]);
      localStorage.setItem(this.LOCAL_REPLIES_KEY, JSON.stringify(garde));
    } catch (e) { /* non bloquant */ }
  },

  loadPersistedReplies(topicId) {
    try {
      const raw = localStorage.getItem(this.LOCAL_REPLIES_KEY);
      if (!raw) return null;
      const all = JSON.parse(raw) || {};
      const e = all[topicId];
      return e && Array.isArray(e.replies) ? e.replies : null;
    } catch (e) { return null; }
  },

  /**
   * Restaure le cache mémoire depuis le stockage local.
   * Appelé au chargement du module, pour que le forum s'affiche
   * immédiatement même sans réseau.
   */
  _initFromLocalStorage() {
    if (this._topicsCache) return;
    const p = this.loadPersistedTopics();
    if (p && p.length > 0) {
      this._topicsCache = p;
      console.log('[ForumFirestore] ✓ ' + p.length + ' sujet(s) restauré(s) hors connexion');
    }
  },

  async getAllTopics() {
    this._initFromLocalStorage();
    if (!this._isReady()) {
      // V63.89 : hors connexion → servir la dernière copie enregistrée
      const p = this.loadPersistedTopics();
      if (p && p.length > 0) {
        this._topicsCache = p;
        return { success: true, topics: p, fromCache: true, offline: true };
      }
      return { success: false, topics: [], error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_TOPICS);
      const q = fns.query(
        colRef,
        fns.orderBy('createdAt', 'desc'),
        fns.limit(this.MAX_TOPICS_LOADED)
      );
      const snap = await fns.getDocs(q);
      const topics = [];
      snap.forEach(d => {
        const data = d.data();
        topics.push({
          id: d.id,
          title: data.title || '',
          body: data.body || '',
          authorUid: data.authorUid,
          authorName: data.authorName || 'Anonyme',
          authorIsPremium: data.authorIsPremium || false,
          createdAt: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt) : Date.now(),
          repliesCount: data.repliesCount || 0,
          likesCount: data.likesCount || 0,  // V63.25 : Lire le compteur de likes
          isPinned: data.isPinned || false,
          isHidden: data.isHidden || false,
          isDeleted: data.isDeleted === true,
          deletedAt: data.deletedAt || null,
          editedAt: data.editedAt || null
        });
      });
      // Pinned en premier, puis par date
      topics.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
      // Mettre en cache
      this._topicsCache = topics;
      this._topicsCacheTime = Date.now();
      this._persistTopics(topics);   // V63.89
      return { success: true, topics };
    } catch (e) {
      console.error('[ForumFirestore] getAllTopics:', e);
      // V63.89 : réseau tombé en cours de route → dernière copie connue
      const secours = this._topicsCache || this.loadPersistedTopics() || [];
      if (secours.length > 0) {
        this._topicsCache = secours;
        return { success: true, topics: secours, fromCache: true, error: e.message };
      }
      return { success: false, topics: [], error: e.message };
    }
  },

  /**
   * Récupère les topics depuis le cache si < 30s, sinon refetch
   */
  async getTopicsCached() {
    if (this._topicsCache && (Date.now() - this._topicsCacheTime < this.CACHE_TTL_MS)) {
      return { success: true, topics: this._topicsCache, fromCache: true };
    }
    return this.getAllTopics();
  },

  /**
   * Écoute en temps réel les changements de topics
   * @param {Function} callback - appelée avec la liste des topics à chaque changement
   * @returns {Function} unsubscribe
   */
  listenToTopics(callback) {
    if (!this._isReady()) {
      console.warn('[ForumFirestore] listenToTopics : Firebase non prêt');
      return () => {};
    }
    const fns = this._fns();
    const colRef = fns.collection(this._db(), this.COLLECTION_TOPICS);
    const q = fns.query(
      colRef,
      fns.orderBy('createdAt', 'desc'),
      fns.limit(this.MAX_TOPICS_LOADED)
    );
    const unsub = fns.onSnapshot(q, (snap) => {
      const topics = [];
      snap.forEach(d => {
        const data = d.data();
        topics.push({
          id: d.id,
          title: data.title || '',
          body: data.body || '',
          authorUid: data.authorUid,
          authorName: data.authorName || 'Anonyme',
          authorIsPremium: data.authorIsPremium || false,
          createdAt: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt) : Date.now(),
          repliesCount: data.repliesCount || 0,
          likesCount: data.likesCount || 0,  // V63.25 : Lire le compteur de likes
          isPinned: data.isPinned || false,
          isHidden: data.isHidden || false,
          isDeleted: data.isDeleted === true,
          deletedAt: data.deletedAt || null,
          editedAt: data.editedAt || null
        });
      });
      topics.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
      this._topicsCache = topics;
      this._topicsCacheTime = Date.now();
      this._persistTopics(topics);   // V63.89
      try { callback(topics); } catch(e) { console.error('[ForumFirestore] callback err:', e); }
    }, (error) => {
      console.error('[ForumFirestore] listenToTopics error:', error);
    });
    this._activeListeners.push(unsub);
    return unsub;
  },

  // === CRÉATION D'UN TOPIC ===
  /**
   * Crée un nouveau topic dans le forum
   * @param {string} title
   * @param {string} body
   * @returns {Promise<{success, topicId, error}>}
   */
  async createTopic(title, body) {
    if (!this._isReady()) {
      return { success: false, error: 'Firebase non prêt — connecte-toi pour publier' };
    }
    const userInfo = this._getCurrentUserInfo();
    if (!userInfo) {
      return { success: false, error: 'Tu dois être connecté pour publier' };
    }
    // Validation côté serveur (en plus de ForumService.validatePost)
    if (window.ForumService) {
      const validation = window.ForumService.validatePost(title, body);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(' ') };
      }
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_TOPICS);
      const topicData = {
        title: title.trim(),
        body: body.trim(),
        authorUid: userInfo.uid,
        authorName: userInfo.authorName,
        authorIsPremium: userInfo.isPremium,
        createdAt: fns.serverTimestamp(),
        repliesCount: 0,
        isPinned: false,
        isHidden: false
      };
      const docRef = await fns.addDoc(colRef, topicData);
      // Invalider le cache
      this._topicsCache = null;
      return { success: true, topicId: docRef.id };
    } catch (e) {
      console.error('[ForumFirestore] createTopic:', e);
      return { success: false, error: e.message || 'Erreur lors de la publication' };
    }
  },

  // === RÉPONSES À UN TOPIC ===
  /**
   * Récupère les réponses d'un topic
   * @param {string} topicId
   * @returns {Promise<{success, replies, error}>}
   */
  async getReplies(topicId) {
    if (!this._isReady() || !topicId) {
      // V63.89 : hors connexion → dernière copie enregistrée
      const p = this.loadPersistedReplies(topicId);
      if (p) return { success: true, replies: p, fromCache: true, offline: true };
      return { success: false, replies: [], error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_REPLIES, topicId, 'replies');
      const q = fns.query(
        colRef,
        fns.orderBy('createdAt', 'asc'),
        fns.limit(this.MAX_REPLIES_PER_TOPIC)
      );
      const snap = await fns.getDocs(q);
      const replies = [];
      snap.forEach(d => {
        const data = d.data();
        replies.push({
          id: d.id,
          body: data.body || '',
          authorUid: data.authorUid,
          authorName: data.authorName || 'Anonyme',
          authorIsPremium: data.authorIsPremium || false,
          createdAt: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt) : Date.now(),
          isHidden: data.isHidden || false,
          isDeleted: data.isDeleted === true,
          deletedAt: data.deletedAt || null,
          editedAt: data.editedAt || null
        });
      });
      this._persistReplies(topicId, replies);   // V63.89
      return { success: true, replies };
    } catch (e) {
      console.error('[ForumFirestore] getReplies:', e);
      const p = this.loadPersistedReplies(topicId);
      if (p) return { success: true, replies: p, fromCache: true, error: e.message };
      return { success: false, replies: [], error: e.message };
    }
  },

  /**
   * Écoute en temps réel les réponses d'un topic
   */
  listenToReplies(topicId, callback) {
    if (!this._isReady() || !topicId) return () => {};
    const fns = this._fns();
    const colRef = fns.collection(this._db(), this.COLLECTION_REPLIES, topicId, 'replies');
    const q = fns.query(
      colRef,
      fns.orderBy('createdAt', 'asc'),
      fns.limit(this.MAX_REPLIES_PER_TOPIC)
    );
    const unsub = fns.onSnapshot(q, (snap) => {
      const replies = [];
      snap.forEach(d => {
        const data = d.data();
        replies.push({
          id: d.id,
          body: data.body || '',
          authorUid: data.authorUid,
          authorName: data.authorName || 'Anonyme',
          authorIsPremium: data.authorIsPremium || false,
          createdAt: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt) : Date.now(),
          isHidden: data.isHidden || false,
          isDeleted: data.isDeleted === true,
          deletedAt: data.deletedAt || null,
          editedAt: data.editedAt || null
        });
      });
      this._persistReplies(topicId, replies);   // V63.89
      try { callback(replies); } catch(e) { console.error('[ForumFirestore] callback err:', e); }
    }, (error) => {
      console.error('[ForumFirestore] listenToReplies error:', error);
    });
    this._activeListeners.push(unsub);
    return unsub;
  },

  /**
   * Ajoute une réponse à un topic
   * @param {string} topicId
   * @param {string} body
   * @returns {Promise<{success, replyId, error}>}
   */
  async addReply(topicId, body) {
    if (!this._isReady()) {
      return { success: false, error: 'Firebase non prêt' };
    }
    const userInfo = this._getCurrentUserInfo();
    if (!userInfo) {
      return { success: false, error: 'Tu dois être connecté pour répondre' };
    }
    // Validation
    if (window.ForumService) {
      const validation = window.ForumService.validateReply(body);
      if (!validation.valid) {
        return { success: false, error: validation.errors.join(' ') };
      }
    }
    try {
      const fns = this._fns();
      // Ajouter la réponse
      const repliesCol = fns.collection(this._db(), this.COLLECTION_REPLIES, topicId, 'replies');
      const replyData = {
        body: body.trim(),
        authorUid: userInfo.uid,
        authorName: userInfo.authorName,
        authorIsPremium: userInfo.isPremium,
        createdAt: fns.serverTimestamp(),
        isHidden: false
      };
      const docRef = await fns.addDoc(repliesCol, replyData);

      // Incrémenter le compteur du topic (best-effort)
      try {
        const topicRef = fns.doc(this._db(), this.COLLECTION_TOPICS, topicId);
        const topicSnap = await fns.getDoc(topicRef);
        if (topicSnap.exists()) {
          const current = topicSnap.data().repliesCount || 0;
          await fns.updateDoc(topicRef, {
            repliesCount: current + 1,
            lastReplyAt: fns.serverTimestamp()
          });
        }
      } catch(e) {
        console.warn('[ForumFirestore] update repliesCount:', e);
      }
      return { success: true, replyId: docRef.id };
    } catch (e) {
      console.error('[ForumFirestore] addReply:', e);
      return { success: false, error: e.message || 'Erreur lors de l\'envoi' };
    }
  },

  // === MODÉRATION (admin only — règles Firestore feront le check) ===
  /**
   * Supprime un topic (admin uniquement)
   */
  /**
   * V63.91 : modification par l'auteur.
   *   Sans possibilité de corriger, un candidat qui repère une faute ou une
   *   erreur n'a d'autre choix que de supprimer et republier — ce qui perd
   *   les réponses déjà reçues.
   */
  async editMyTopic(topicId, title, body) {
    if (!this._isReady() || !topicId) return { success: false, error: 'Firebase non prêt' };
    const user = window.FirebaseAuth.user;
    if (!user) return { success: false, error: 'Authentification requise' };
    const t = (this._topicsCache || []).find(x => x.id === topicId);
    if (t && t.authorUid && t.authorUid !== user.uid) {
      return { success: false, error: 'Vous ne pouvez modifier que vos propres messages' };
    }
    const ti = (title || '').trim(), bo = (body || '').trim();
    if (ti.length < 10 || ti.length > 150) return { success: false, error: 'Le titre doit faire entre 10 et 150 caractères' };
    if (bo.length < 20 || bo.length > 2500) return { success: false, error: 'Le message doit faire entre 20 et 2500 caractères' };
    try {
      const fns = this._fns();
      await fns.updateDoc(fns.doc(this._db(), this.COLLECTION_TOPICS, topicId), {
        title: ti, body: bo, editedAt: Date.now()
      });
      if (this._topicsCache) {
        this._topicsCache = this._topicsCache.map(x =>
          x.id === topicId ? { ...x, title: ti, body: bo, editedAt: Date.now() } : x);
        this._persistTopics(this._topicsCache);
      }
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] editMyTopic:', e);
      return { success: false, error: e.message };
    }
  },

  async editMyReply(topicId, replyId, body, authorUid) {
    if (!this._isReady() || !topicId || !replyId) return { success: false, error: 'Firebase non prêt' };
    const user = window.FirebaseAuth.user;
    if (!user) return { success: false, error: 'Authentification requise' };
    if (authorUid && authorUid !== user.uid) {
      return { success: false, error: 'Vous ne pouvez modifier que vos propres messages' };
    }
    const bo = (body || '').trim();
    if (bo.length < 1 || bo.length > 1500) return { success: false, error: 'La réponse doit faire entre 1 et 1500 caractères' };
    try {
      const fns = this._fns();
      await fns.updateDoc(
        fns.doc(this._db(), this.COLLECTION_REPLIES, topicId, 'replies', replyId),
        { body: bo, editedAt: Date.now() }
      );
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] editMyReply:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * V63.89 : suppression par l'auteur lui-même.
   *   Un candidat qui publiait un message n'avait plus aucun moyen de le
   *   retirer — même en cas d'erreur ou de doublon. Il devait écrire à
   *   l'administrateur. La suppression reste en cascade sur les réponses.
   *
   *   Le contrôle réel est fait par les règles Firestore ; la vérification
   *   ci-dessous ne sert qu'à afficher un message clair côté application.
   */
  async deleteMyTopic(topicId) {
    if (!this._isReady() || !topicId) return { success: false, error: 'Firebase non prêt' };
    const user = window.FirebaseAuth.user;
    if (!user) return { success: false, error: 'Authentification requise' };
    const t = (this._topicsCache || []).find(x => x.id === topicId);
    if (t && t.authorUid && t.authorUid !== user.uid) {
      return { success: false, error: 'Vous ne pouvez supprimer que vos propres messages' };
    }
    // V63.90 : on ne détruit pas le document, on le marque supprimé.
    //   Effacer un sujet emportait toutes les réponses reçues : une
    //   discussion utile à dix personnes disparaissait parce que son auteur
    //   se ravisait. Le fil survit, le contenu s'efface.
    try {
      const fns = this._fns();
      await fns.updateDoc(fns.doc(this._db(), this.COLLECTION_TOPICS, topicId), {
        isDeleted: true,
        deletedAt: Date.now(),
        title: '',
        body: ''
      });
      if (this._topicsCache) {
        this._topicsCache = this._topicsCache.map(x =>
          x.id === topicId ? { ...x, isDeleted: true, title: '', body: '' } : x);
        this._persistTopics(this._topicsCache);
      }
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] deleteMyTopic:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * V63.89 : suppression d'une de ses propres réponses.
   */
  async deleteMyReply(topicId, replyId, authorUid) {
    if (!this._isReady() || !topicId || !replyId) return { success: false, error: 'Firebase non prêt' };
    const user = window.FirebaseAuth.user;
    if (!user) return { success: false, error: 'Authentification requise' };
    if (authorUid && authorUid !== user.uid) {
      return { success: false, error: 'Vous ne pouvez supprimer que vos propres messages' };
    }
    // V63.90 : trace conservée, comme pour les sujets. Le compteur de
    //   réponses n'est pas décrémenté : la réponse existe toujours dans le fil.
    try {
      const fns = this._fns();
      await fns.updateDoc(
        fns.doc(this._db(), this.COLLECTION_REPLIES, topicId, 'replies', replyId),
        { isDeleted: true, deletedAt: Date.now(), body: '' }
      );
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] deleteMyReply:', e);
      return { success: false, error: e.message };
    }
  },

  async deleteTopic(topicId) {
    if (!this._isReady() || !topicId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();

      // V63.82 : suppression en cascade des réponses.
      //   Avant, seul le document du sujet était supprimé : ses réponses
      //   restaient indéfiniment dans Firestore. Un message injurieux
      //   survivait donc à la suppression du fil qui le contenait — invisible
      //   dans l'app, mais toujours stocké, et toujours comptabilisé.
      const suppr = await this.deleteAllReplies(topicId);
      if (!suppr.success) {
        // On n'abandonne pas la suppression du sujet pour autant : mieux vaut
        // un sujet retiré avec quelques réponses résiduelles que rien du tout.
        console.warn('[ForumFirestore] Réponses non supprimées :', suppr.error);
      }

      await fns.deleteDoc(fns.doc(this._db(), this.COLLECTION_TOPICS, topicId));
      this._topicsCache = null;
      return { success: true, repliesDeleted: suppr.count || 0 };
    } catch (e) {
      console.error('[ForumFirestore] deleteTopic:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * V63.82 : supprime toutes les réponses d'un sujet.
   *   Firestore ne supprime pas les sous-collections avec le document parent :
   *   il faut les parcourir et les effacer une à une.
   */
  async deleteAllReplies(topicId) {
    if (!this._isReady() || !topicId) {
      return { success: false, error: 'Firebase non prêt', count: 0 };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_REPLIES, topicId, 'replies');
      const snap = await fns.getDocs(colRef);
      let n = 0;
      for (const d of snap.docs) {
        try {
          await fns.deleteDoc(d.ref);
          n++;
        } catch (e) {
          console.warn('[ForumFirestore] réponse non supprimée :', d.id, e.message);
        }
      }
      return { success: true, count: n };
    } catch (e) {
      console.error('[ForumFirestore] deleteAllReplies:', e);
      return { success: false, error: e.message, count: 0 };
    }
  },

  /**
   * Épingle/dépingle un topic (admin uniquement)
   */
  async togglePinTopic(topicId, isPinned) {
    if (!this._isReady() || !topicId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      await fns.updateDoc(
        fns.doc(this._db(), this.COLLECTION_TOPICS, topicId),
        { isPinned: !!isPinned }
      );
      this._topicsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] togglePinTopic:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Supprime une réponse
   */
  async deleteReply(topicId, replyId) {
    if (!this._isReady() || !topicId || !replyId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      await fns.deleteDoc(
        fns.doc(this._db(), this.COLLECTION_REPLIES, topicId, 'replies', replyId)
      );

      // V63.82 : décrémenter le compteur du sujet.
      //   Sans ça, le nombre de réponses affiché ne baissait jamais : après
      //   quelques modérations, un fil annonçait « 5 réponses » et n'en
      //   montrait que 2. Non bloquant si l'écriture échoue.
      try {
        const inc = fns.increment;
        if (typeof inc === 'function') {
          await fns.updateDoc(
            fns.doc(this._db(), this.COLLECTION_TOPICS, topicId),
            { repliesCount: inc(-1) }
          );
        }
      } catch (e) {
        console.warn('[ForumFirestore] compteur de réponses non mis à jour :', e.message);
      }

      this._topicsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] deleteReply:', e);
      return { success: false, error: e.message };
    }
  },

  // === V63.21 : SYSTÈME DE LIKES ===
  /**
   * Toggle like sur un topic (1 user = 1 like)
   * Architecture : subcollection forum_topics/{id}/likes/{userUid}
   */
  async toggleTopicLike(topicId) {
    if (!this._isReady() || !topicId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    const userInfo = this._getCurrentUserInfo();
    if (!userInfo) {
      return { success: false, error: 'Connecte-toi pour voter' };
    }
    try {
      const fns = this._fns();
      const likeRef = fns.doc(this._db(), this.COLLECTION_TOPICS, topicId, 'likes', userInfo.uid);
      const likeSnap = await fns.getDoc(likeRef);
      const topicRef = fns.doc(this._db(), this.COLLECTION_TOPICS, topicId);

      // V63.92 : compteur mis à jour de façon atomique.
      //   L'ancienne version lisait le compteur puis réécrivait la valeur.
      //   Deux candidats aimant la même publication au même moment lisaient
      //   la même valeur de départ : un des deux likes était perdu.
      //   increment() est appliqué côté serveur, sans lecture préalable.
      const inc = fns.increment;

      if (likeSnap.exists()) {
        // L'utilisateur a déjà liké → enlever le like
        await fns.deleteDoc(likeRef);
        try {
          if (typeof inc === 'function') {
            await fns.updateDoc(topicRef, { likesCount: inc(-1) });
          } else {
            const topicSnap = await fns.getDoc(topicRef);
            if (topicSnap.exists()) {
              const current = topicSnap.data().likesCount || 0;
              await fns.updateDoc(topicRef, { likesCount: Math.max(0, current - 1) });
            }
          }
        } catch(e) { console.warn('[likes] decrement:', e); }
        return { success: true, liked: false };
      } else {
        // Nouveau like
        await fns.setDoc(likeRef, {
          authorUid: userInfo.uid,
          authorName: userInfo.authorName,
          createdAt: fns.serverTimestamp()
        });
        try {
          if (typeof inc === 'function') {
            await fns.updateDoc(topicRef, { likesCount: inc(1) });
          } else {
            const topicSnap = await fns.getDoc(topicRef);
            if (topicSnap.exists()) {
              const current = topicSnap.data().likesCount || 0;
              await fns.updateDoc(topicRef, { likesCount: current + 1 });
            }
          }
        } catch(e) { console.warn('[likes] increment:', e); }
        return { success: true, liked: true };
      }
    } catch (e) {
      console.error('[ForumFirestore] toggleTopicLike:', e);
      return { success: false, error: e.message };
    }
  },

  /**
   * Vérifie si le user courant a liké un topic
   */
  async hasUserLikedTopic(topicId) {
    if (!this._isReady() || !topicId) return false;
    const userInfo = this._getCurrentUserInfo();
    if (!userInfo) return false;
    try {
      const fns = this._fns();
      const likeRef = fns.doc(this._db(), this.COLLECTION_TOPICS, topicId, 'likes', userInfo.uid);
      const snap = await fns.getDoc(likeRef);
      return snap.exists();
    } catch (e) {
      console.warn('[ForumFirestore] hasUserLikedTopic:', e);
      return false;
    }
  },

  // === V63.21 : MODÉRATION ADMIN ===
  /**
   * Liste TOUS les topics (incluant cachés) — Admin uniquement
   */
  async getAllTopicsAdmin() {
    if (!this._isReady()) {
      return { success: false, topics: [], error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      const colRef = fns.collection(this._db(), this.COLLECTION_TOPICS);
      const q = fns.query(colRef, fns.orderBy('createdAt', 'desc'), fns.limit(100));
      const snap = await fns.getDocs(q);
      const topics = [];
      snap.forEach(d => {
        const data = d.data();
        topics.push({
          id: d.id,
          title: data.title || '',
          body: data.body || '',
          authorUid: data.authorUid,
          authorName: data.authorName || 'Anonyme',
          authorEmail: data.authorEmail || '',
          createdAt: data.createdAt ? (data.createdAt.toMillis ? data.createdAt.toMillis() : data.createdAt) : Date.now(),
          repliesCount: data.repliesCount || 0,
          likesCount: data.likesCount || 0,
          isPinned: data.isPinned || false,
          isHidden: data.isHidden || false,
          isDeleted: data.isDeleted === true,
          deletedAt: data.deletedAt || null,
          editedAt: data.editedAt || null
        });
      });
      return { success: true, topics };
    } catch (e) {
      console.error('[ForumFirestore] getAllTopicsAdmin:', e);
      return { success: false, topics: [], error: e.message };
    }
  },

  // === CLEANUP ===
  /**
   * Détache tous les listeners actifs (à appeler lors de la navigation hors forum)
   */
  /**
   * V63.80 : Signaler un sujet du forum.
   *   Ecrit dans une collection dediee, lisible depuis le panneau admin.
   *   Un meme utilisateur ne peut signaler qu'une fois le meme sujet :
   *   l'identifiant du document combine les deux.
   */
  async reportTopic(topicId, topicTitle, reason) {
    if (!this._isReady()) return { success: false, error: 'Hors ligne' };
    try {
      const fns = this._fns();
      const auteur = this._getCurrentUserInfo();
      const signaleurId = (auteur && auteur.userId) || 'anonyme';
      const docId = topicId + '__' + signaleurId;

      await fns.setDoc(fns.doc(this._db(), this.COLLECTION_REPORTS, docId), {
        topicId: topicId,
        topicTitle: topicTitle || '',
        reason: reason || '',
        reportedBy: {
          userId: signaleurId,
          name: (auteur && auteur.userName) || 'Anonyme'
        },
        reportedAt: Date.now(),
        status: 'nouveau'
      }, { merge: true });

      return { success: true };
    } catch (e) {
      console.error('[V63.80] Signalement impossible :', e);
      return { success: false, error: e.message };
    }
  },

  /** V63.80 : Lire tous les signalements (panneau admin). */
  async getAllReports() {
    if (!this._isReady()) return [];
    try {
      const fns = this._fns();
      const snap = await fns.getDocs(fns.collection(this._db(), this.COLLECTION_REPORTS));
      const out = [];
      snap.forEach(d => out.push({ id: d.id, ...d.data() }));
      out.sort((a, b) => (b.reportedAt || 0) - (a.reportedAt || 0));
      return out;
    } catch (e) {
      console.error('[V63.80] Lecture des signalements impossible :', e);
      return [];
    }
  },

  /** V63.80 : Marquer un signalement comme traite. */
  async resolveReport(reportId) {
    if (!this._isReady()) return { success: false };
    try {
      const fns = this._fns();
      await fns.setDoc(fns.doc(this._db(), this.COLLECTION_REPORTS, reportId),
        { status: 'traite', resolvedAt: Date.now() }, { merge: true });
      return { success: true };
    } catch (e) {
      console.error('[V63.80] resolveReport :', e);
      return { success: false };
    }
  },

  unsubscribeAll() {
    this._activeListeners.forEach(unsub => {
      try { if (typeof unsub === 'function') unsub(); } catch(e) {}
    });
    this._activeListeners = [];
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.ForumFirestore = ForumFirestore;
  // V63.89 : restaurer immédiatement la dernière copie connue, pour que le
  //   forum s'affiche même si l'application démarre sans réseau.
  try { ForumFirestore._initFromLocalStorage(); } catch(e) {
    console.warn('[ForumFirestore] restauration hors connexion :', e);
  }
}
