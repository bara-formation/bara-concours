// Bara Concours - Service Forum Firestore (V63.19)
// Forum communautaire partagé en temps réel via Firestore
// Structure : forum_topics (collection) + forum_replies/<topicId>/replies (subcollection)

const ForumFirestore = {
  // === CONFIGURATION ===
  COLLECTION_TOPICS: 'forum_topics',
  COLLECTION_REPLIES: 'forum_replies',
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
  async getAllTopics() {
    if (!this._isReady()) {
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
          isHidden: data.isHidden || false
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
      return { success: true, topics };
    } catch (e) {
      console.error('[ForumFirestore] getAllTopics:', e);
      return { success: false, topics: this._topicsCache || [], error: e.message };
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
          isHidden: data.isHidden || false
        });
      });
      topics.sort((a, b) => {
        if (a.isPinned !== b.isPinned) return a.isPinned ? -1 : 1;
        return b.createdAt - a.createdAt;
      });
      this._topicsCache = topics;
      this._topicsCacheTime = Date.now();
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
          isHidden: data.isHidden || false
        });
      });
      return { success: true, replies };
    } catch (e) {
      console.error('[ForumFirestore] getReplies:', e);
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
          isHidden: data.isHidden || false
        });
      });
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
  async deleteTopic(topicId) {
    if (!this._isReady() || !topicId) {
      return { success: false, error: 'Firebase non prêt' };
    }
    try {
      const fns = this._fns();
      await fns.deleteDoc(fns.doc(this._db(), this.COLLECTION_TOPICS, topicId));
      // Note : les réponses ne sont pas supprimées en cascade — c'est OK pour un MVP
      this._topicsCache = null;
      return { success: true };
    } catch (e) {
      console.error('[ForumFirestore] deleteTopic:', e);
      return { success: false, error: e.message };
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

      if (likeSnap.exists()) {
        // L'utilisateur a déjà liké → enlever le like
        await fns.deleteDoc(likeRef);
        // Décrémenter le compteur
        try {
          const topicSnap = await fns.getDoc(topicRef);
          if (topicSnap.exists()) {
            const current = topicSnap.data().likesCount || 0;
            await fns.updateDoc(topicRef, { likesCount: Math.max(0, current - 1) });
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
        // Incrémenter le compteur
        try {
          const topicSnap = await fns.getDoc(topicRef);
          if (topicSnap.exists()) {
            const current = topicSnap.data().likesCount || 0;
            await fns.updateDoc(topicRef, { likesCount: current + 1 });
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
          isHidden: data.isHidden || false
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
}
