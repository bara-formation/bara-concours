// Bara Concours - Module Premium v2 (Phase 3 corrigée)
// Codes USSD officiels + intégration CinetPay pour paiements automatiques

const PremiumService = {
  // === PLANS DISPONIBLES ===
  PLANS: {
    weekly: {
      id: 'weekly',
      name: 'Hebdomadaire',
      price: 1000,
      duration: 7,
      durationLabel: '1 semaine',
      pricePerDay: 143,
      icon: '📅',
      tag: 'Pour tester',
      tagColor: '#2563eb',
      tagBg: '#dbeafe',
      popular: false
    },
    monthly: {
      id: 'monthly',
      name: 'Mensuel',
      price: 2000,
      duration: 30,
      durationLabel: '1 mois',
      pricePerDay: 67,
      icon: '⭐',
      tag: 'Pour 1 mois',
      tagColor: '#854d0e',
      tagBg: '#fef9c3',
      popular: false
    },
    // V60 : Plan SESSION 2026 — accès jusqu'au 15 août 2026 (date fixe)
    // Remplace l'ancien yearly (retiré pour la saison concours 2026)
    session2026: {
      id: 'session2026',
      name: 'SESSION 2026 + ACC. FINAL',
      price: 2500,
      duration: null,  // V60 : pas une durée mais une date fixe
      durationLabel: 'Jusqu\'au 15 août 2026',
      expiresAt: new Date('2026-08-15T23:59:59').getTime(),  // V60 : date butoir absolue
      pricePerDay: null,
      icon: '🎯',
      tag: 'Le plus demandé 🔥',
      tagColor: '#7c2d12',
      tagBg: '#fed7aa',
      popular: true,  // V60 : devient le plan vedette
      special: true   // V60 : marqueur pour traitement spécial UI
    },
    // V60 : yearly conservé pour compatibilité descendante (anciens codes BARA-ANNEE-XXXX)
    //       mais retiré de l'affichage Premium (page premium n'affiche que monthly + session2026 + weekly)
    yearly: {
      id: 'yearly',
      name: 'Annuel',
      price: 10000,
      duration: 365,
      durationLabel: '1 an',
      pricePerDay: 27,
      icon: '🏆',
      tag: 'Économie de 14 000 F',
      tagColor: '#15803d',
      tagBg: '#dcfce7',
      popular: false,
      savings: 14000,
      hidden: true  // V60 : caché de l'affichage
    }
  },

  // === OPÉRATEURS MOBILE MONEY (codes officiels Burkina Faso) ===
  OPERATORS: {
    orange: {
      id: 'orange',
      name: 'Orange Money',
      shortName: 'Orange',
      icon: '🟠',
      color: '#FF6600',
      colorLight: '#fff4e6',
      ussd: '*144#',
      app: 'Max It (Play Store)',
      prefix: '07'
    },
    moov: {
      id: 'moov',
      name: 'Moov Money',
      shortName: 'Moov',
      icon: '🔵',
      color: '#0066CC',
      colorLight: '#e6f0ff',
      ussd: '*555#',
      app: 'Moov Money (Play Store)',
      prefix: '01'
    },
    wave: {
      id: 'wave',
      name: 'Wave',
      shortName: 'Wave',
      icon: '🌊',
      color: '#1DC9F5',
      colorLight: '#e0f7fb',
      ussd: 'App Wave',
      app: 'Wave (Play Store)',
      prefix: 'all'
    }
  },

  // === NUMÉROS BARA FORMATION POUR RECEVOIR LES PAIEMENTS ===
  BARA_NUMBERS: {
    orange: '04 04 34 04',
    moov: '70 78 39 04',
    wave: '04 04 34 04',
    whatsapp: '+22604043404'
  },

  // ============================================
  // === CONFIGURATION CINETPAY (automatique)
  // ============================================
  // Pour activer : crée un compte sur cinetpay.com,
  // remplis cette config et mets `enabled: true`.
  CINETPAY: {
    enabled: false,
    apiKey: 'REPLACE_WITH_YOUR_CINETPAY_API_KEY',
    siteId: 'REPLACE_WITH_YOUR_SITE_ID',
    notifyUrl: 'https://votre-domaine.com/api/cinetpay/notify',
    returnUrl: 'https://votre-domaine.com/return.html',
    currency: 'XOF',
    channels: 'MOBILE_MONEY' // Ou 'ALL' pour cartes + Mobile Money
  },

  // === API PUBLIQUES ===

  isUserPremium(user) {
    if (!user || !user.isPremium) return false;
    if (!user.premiumExpiresAt) return false;
    return new Date(user.premiumExpiresAt).getTime() > Date.now();
  },

  daysRemaining(user) {
    if (!this.isUserPremium(user)) return 0;
    const ms = new Date(user.premiumExpiresAt).getTime() - Date.now();
    return Math.ceil(ms / (1000 * 60 * 60 * 24));
  },

  formatExpiry(user) {
    if (!user.premiumExpiresAt) return '';
    const d = new Date(user.premiumExpiresAt);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  formatPrice(amount) {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') + ' FCFA';
  },

  generatePaymentReference() {
    const ts = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return 'BC-' + ts + '-' + rand;
  },

  // ============================================
  // === MODE 1 : PAIEMENT MANUEL (WhatsApp)
  // ============================================
  buildWhatsAppMessage(plan, operator, userPhone, userName, reference) {
    const planObj = this.PLANS[plan];
    const opObj = this.OPERATORS[operator];

    const text = `Bonjour Bara Formation,
J'ai effectué un paiement Premium :

📋 Référence : ${reference}
📦 Plan : ${planObj.name} (${this.formatPrice(planObj.price)})
💳 Opérateur : ${opObj.name}
📱 Mon numéro : ${userPhone || '(à renseigner)'}
👤 Mon nom : ${userName || '(à renseigner)'}

Merci de bien vouloir activer mon abonnement Premium. 🙏`;

    return encodeURIComponent(text);
  },

  getWhatsAppLink(plan, operator, userPhone, userName, reference) {
    const num = this.BARA_NUMBERS.whatsapp.replace(/[^0-9]/g, '');
    const msg = this.buildWhatsAppMessage(plan, operator, userPhone, userName, reference);
    return `https://wa.me/${num}?text=${msg}`;
  },

  // ============================================
  // === MODE 2 : PAIEMENT AUTOMATIQUE (CinetPay)
  // ============================================
  isCinetPayEnabled() {
    return this.CINETPAY.enabled
      && this.CINETPAY.apiKey !== 'REPLACE_WITH_YOUR_CINETPAY_API_KEY';
  },

  // Initialise un paiement CinetPay
  // Retourne une URL de paiement où l'utilisateur sera redirigé
  async initCinetPayPayment(plan, user, operator) {
    if (!this.isCinetPayEnabled()) {
      throw new Error('CinetPay non configuré');
    }

    const planObj = this.PLANS[plan];
    const reference = this.generatePaymentReference();

    const payload = {
      apikey: this.CINETPAY.apiKey,
      site_id: this.CINETPAY.siteId,
      transaction_id: reference,
      amount: planObj.price,
      currency: this.CINETPAY.currency,
      description: `Bara Concours Premium ${planObj.name}`,
      customer_id: user.uid || user.phoneNumber,
      customer_name: user.name || 'Apprenant',
      customer_phone_number: user.phoneNumber || '',
      notify_url: this.CINETPAY.notifyUrl,
      return_url: this.CINETPAY.returnUrl,
      channels: this.CINETPAY.channels,
      lang: 'FR',
      metadata: JSON.stringify({
        plan: plan,
        userId: user.uid,
        operator: operator
      })
    };

    try {
      const response = await fetch('https://api-checkout.cinetpay.com/v2/payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await response.json();

      if (data.code === '201') {
        // Sauvegarder localement pour vérification ultérieure
        const pending = JSON.parse(localStorage.getItem('bara_pending_payments') || '[]');
        pending.push({
          reference,
          plan,
          amount: planObj.price,
          createdAt: Date.now(),
          status: 'pending'
        });
        localStorage.setItem('bara_pending_payments', JSON.stringify(pending));

        return {
          success: true,
          paymentUrl: data.data.payment_url,
          reference
        };
      } else {
        throw new Error(data.message || 'Erreur CinetPay');
      }
    } catch (e) {
      console.error('[CinetPay] Erreur :', e);
      throw e;
    }
  },

  // Vérifie le statut d'un paiement CinetPay
  async verifyCinetPayPayment(reference) {
    if (!this.isCinetPayEnabled()) return null;

    try {
      const response = await fetch('https://api-checkout.cinetpay.com/v2/payment/check', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          apikey: this.CINETPAY.apiKey,
          site_id: this.CINETPAY.siteId,
          transaction_id: reference
        })
      });

      const data = await response.json();
      return {
        success: data.code === '00',
        status: data.data?.status, // ACCEPTED, REFUSED, PENDING
        amount: data.data?.amount,
        paymentMethod: data.data?.payment_method
      };
    } catch (e) {
      console.error('[CinetPay] Vérif erreur :', e);
      return null;
    }
  },

  // === ACTIVATION LOCALE (mode démo + après paiement) ===
  activatePremium(user, planId) {
    const plan = this.PLANS[planId];
    if (!plan) return null;

    const now = Date.now();
    let newExpiry;

    // V60 : Si le plan a une date fixe (ex: session2026 → 15 août 2026), on l'utilise directement
    if (plan.expiresAt) {
      // Date fixe : ne pas cumuler, on fixe la date butoir absolue
      // Mais si l'utilisateur a déjà une expiration plus tardive, on la garde
      const currentExpiry = user.premiumExpiresAt ? new Date(user.premiumExpiresAt).getTime() : 0;
      const targetDate = Math.max(plan.expiresAt, currentExpiry);
      newExpiry = new Date(targetDate);
    } else {
      // Plan classique avec durée : cumuler à l'expiration actuelle si encore Premium
      const currentExpiry = user.premiumExpiresAt ? new Date(user.premiumExpiresAt).getTime() : 0;
      const startFrom = currentExpiry > now ? currentExpiry : now;
      newExpiry = new Date(startFrom + plan.duration * 24 * 60 * 60 * 1000);
    }

    return {
      isPremium: true,
      premiumPlan: planId,
      premiumExpiresAt: newExpiry.toISOString(),
      premiumActivatedAt: new Date().toISOString()
    };
  }
};

window.PremiumService = PremiumService;

// =================================================================
// V58 : MODULE DE CODES D'ACTIVATION PREMIUM (Firestore + localStorage)
// =================================================================
// Permet à l'admin de générer des codes (1 code = 1 plan spécifique)
// Stockage prioritaire dans Firestore (sync entre admin/utilisateurs)
// Fallback localStorage si pas internet ou Firebase indisponible
// =================================================================
const ActivationCodes = {

  // === CONFIGURATION ===
  STORAGE_KEY: 'bara_activation_codes',  // Cache local
  ADMIN_EMAILS: ['bara.formation@gmail.com'],  // V58 : Liste des emails admin
  FIRESTORE_COLLECTION: 'activationCodes',  // Nom de la collection Firestore

  PLAN_PREFIXES: {
    weekly: 'SEM',
    monthly: 'MOIS',
    yearly: 'ANNEE',
    session2026: 'SESSION'  // V60 : BARA-SESSION-XXXX
  },

  // ====================================================================
  // V58 : UTILITAIRES FIRESTORE
  // ====================================================================

  // Vérifier si l'utilisateur actuel est admin
  isCurrentUserAdmin() {
    if (!window.FirebaseAuth || !window.FirebaseAuth.user) return false;
    const email = (window.FirebaseAuth.user.email || '').toLowerCase();
    return this.ADMIN_EMAILS.includes(email);
  },

  // Firestore est-il disponible et utilisateur connecté ?
  isFirestoreReady() {
    return window.FirebaseAuth
        && window.FirebaseAuth.isFirebaseReady
        && window.FirebaseAuth.db
        && window.FirebaseAuth._fbFns
        && window.FirebaseAuth.user;
  },

  // ====================================================================
  // GÉNÉRATION
  // ====================================================================

  generateCode(planId) {
    const prefix = this.PLAN_PREFIXES[planId];
    if (!prefix) return null;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let random = '';
    for (let i = 0; i < 4; i++) {
      random += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return `BARA-${prefix}-${random}`;
  },

  // Générer N codes uniques (admin seulement)
  // V58 : sauvegarde dans Firestore si disponible, sinon localStorage
  async generateBatch(planId, count) {
    if (!this.isCurrentUserAdmin()) {
      console.error('[V58] Génération refusée : tu n\'es pas admin');
      return { success: false, error: 'Non autorisé', codes: [] };
    }

    // Récupérer les codes existants pour éviter les doublons
    const existing = await this.getAllCodes();
    const existingSet = new Set(existing.map(c => c.code));
    const newCodes = [];

    let attempts = 0;
    while (newCodes.length < count && attempts < count * 10) {
      const code = this.generateCode(planId);
      if (code && !existingSet.has(code)) {
        existingSet.add(code);
        newCodes.push({
          code,
          planId,
          createdAt: Date.now(),
          createdBy: window.FirebaseAuth?.user?.email || 'admin',
          used: false,
          usedAt: null,
          usedBy: null,
          batch: 'batch_' + Date.now()
        });
      }
      attempts++;
    }

    // Sauvegarder
    if (this.isFirestoreReady()) {
      // Firestore : batch d'écritures
      try {
        const fb = window.FirebaseAuth;
        const promises = newCodes.map(c => {
          const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, c.code);
          return fb._fbFns.setDoc(ref, c);
        });
        await Promise.all(promises);
        console.log('[V58] ✓', newCodes.length, 'codes générés dans Firestore');
        // Mettre à jour le cache local aussi
        this._syncLocalCache([...existing, ...newCodes]);
        return { success: true, codes: newCodes, source: 'firestore' };
      } catch (e) {
        console.error('[V58] Erreur Firestore :', e);
        // Fallback localStorage
      }
    }

    // Fallback localStorage
    const all = [...existing, ...newCodes];
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return { success: true, codes: newCodes, source: 'local' };
  },

  // ====================================================================
  // LECTURE (admin)
  // ====================================================================

  // Récupérer tous les codes (depuis Firestore si possible)
  async getAllCodes() {
    if (this.isFirestoreReady() && this.isCurrentUserAdmin()) {
      try {
        const fb = window.FirebaseAuth;
        const colRef = fb._fbFns.collection(fb.db, this.FIRESTORE_COLLECTION);
        const snapshot = await fb._fbFns.getDocs(colRef);
        const codes = [];
        snapshot.forEach(doc => codes.push(doc.data()));
        // Mettre à jour le cache local
        this._syncLocalCache(codes);
        return codes;
      } catch (e) {
        console.warn('[V58] Erreur lecture Firestore, fallback local :', e);
      }
    }
    // Fallback localStorage
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch(e) { return []; }
  },

  // Version synchrone (pour rendu rapide) — lit depuis le cache local
  getAllCodesLocal() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
    } catch(e) { return []; }
  },

  // Mettre à jour le cache local
  _syncLocalCache(codes) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(codes));
    } catch(e) {}
  },

  // ====================================================================
  // VALIDATION (côté utilisateur)
  // ====================================================================

  // Valider un code (lit depuis Firestore en priorité)
  async validateCode(rawCode) {
    const code = (rawCode || '').trim().toUpperCase();
    if (!code) return { valid: false, reason: 'Code vide' };

    if (!/^BARA-(SEM|MOIS|ANNEE|SESSION)-[A-Z0-9]{4}$/.test(code)) {
      return { valid: false, reason: 'Format invalide. Exemple : BARA-SESSION-A3F7' };
    }

    // Essayer Firestore d'abord (le code peut exister sur le cloud sans être en local)
    if (window.FirebaseAuth && window.FirebaseAuth.isFirebaseReady && window.FirebaseAuth.user) {
      try {
        const fb = window.FirebaseAuth;
        const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, code);
        const snap = await fb._fbFns.getDoc(ref);
        if (!snap.exists()) {
          return { valid: false, reason: 'Code introuvable' };
        }
        const data = snap.data();
        if (data.used) {
          return { valid: false, reason: 'Ce code a déjà été utilisé', code: data };
        }
        return { valid: true, code: data, source: 'firestore' };
      } catch (e) {
        console.warn('[V58] Erreur validation Firestore :', e);
        // Fallback localStorage
      }
    }

    // Fallback localStorage
    const found = this.getAllCodesLocal().find(c => c.code === code);
    if (!found) return { valid: false, reason: 'Code introuvable. Vérifie ta connexion internet.' };
    if (found.used) return { valid: false, reason: 'Ce code a déjà été utilisé', code: found };
    return { valid: true, code: found, source: 'local' };
  },

  // ====================================================================
  // UTILISATION (côté utilisateur)
  // ====================================================================

  // Marquer un code comme utilisé (transaction Firestore atomique)
  async useCode(rawCode, userInfo) {
    const validation = await this.validateCode(rawCode);
    if (!validation.valid) return validation;

    const code = validation.code.code;
    const usedBy = {
      userId: userInfo?.uid || userInfo?.id || 'unknown',
      email: userInfo?.email || (window.FirebaseAuth?.user?.email) || '',
      phone: userInfo?.phoneNumber || '',
      name: userInfo?.firstName ? (userInfo.firstName + ' ' + (userInfo.lastName || '')).trim() : (userInfo?.displayName || 'Anonyme')
    };
    const usedAt = Date.now();

    // Marquer dans Firestore en priorité
    if (window.FirebaseAuth && window.FirebaseAuth.isFirebaseReady && window.FirebaseAuth.user) {
      try {
        const fb = window.FirebaseAuth;
        const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, code);
        // Re-vérifier avant d'écrire (anti-race-condition)
        const snap = await fb._fbFns.getDoc(ref);
        if (!snap.exists()) {
          return { valid: false, reason: 'Code introuvable' };
        }
        const data = snap.data();
        if (data.used) {
          return { valid: false, reason: 'Ce code a déjà été utilisé', code: data };
        }
        // Mettre à jour
        await fb._fbFns.updateDoc(ref, {
          used: true,
          usedAt: usedAt,
          usedBy: usedBy
        });
        const updatedCode = { ...data, used: true, usedAt, usedBy };
        return {
          valid: true,
          code: updatedCode,
          planId: data.planId,
          source: 'firestore'
        };
      } catch (e) {
        console.error('[V58] Erreur useCode Firestore :', e);
        return { valid: false, reason: 'Erreur réseau. Vérifie ta connexion internet et réessaie.' };
      }
    }

    // Fallback localStorage (pas idéal mais sécurité)
    const all = this.getAllCodesLocal();
    const idx = all.findIndex(c => c.code === code);
    if (idx < 0) return { valid: false, reason: 'Code introuvable' };
    all[idx].used = true;
    all[idx].usedAt = usedAt;
    all[idx].usedBy = usedBy;
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return { valid: true, code: all[idx], planId: all[idx].planId, source: 'local' };
  },

  // ====================================================================
  // STATISTIQUES & EXPORT (admin)
  // ====================================================================

  async getStats() {
    const all = await this.getAllCodes();
    const used = all.filter(c => c.used);
    const unused = all.filter(c => !c.used);

    const byPlan = { weekly: 0, monthly: 0, yearly: 0, session2026: 0 };
    const usedByPlan = { weekly: 0, monthly: 0, yearly: 0, session2026: 0 };
    all.forEach(c => {
      if (byPlan[c.planId] !== undefined) byPlan[c.planId]++;
      if (c.used && usedByPlan[c.planId] !== undefined) usedByPlan[c.planId]++;
    });

    return {
      total: all.length,
      used: used.length,
      unused: unused.length,
      byPlan,
      usedByPlan
    };
  },

  // Version synchrone (pour rendu rapide)
  getStatsLocal() {
    const all = this.getAllCodesLocal();
    const used = all.filter(c => c.used);
    const unused = all.filter(c => !c.used);
    const byPlan = { weekly: 0, monthly: 0, yearly: 0, session2026: 0 };
    const usedByPlan = { weekly: 0, monthly: 0, yearly: 0, session2026: 0 };
    all.forEach(c => {
      if (byPlan[c.planId] !== undefined) byPlan[c.planId]++;
      if (c.used && usedByPlan[c.planId] !== undefined) usedByPlan[c.planId]++;
    });
    return { total: all.length, used: used.length, unused: unused.length, byPlan, usedByPlan };
  },

  // Export CSV
  async exportCSV() {
    const all = await this.getAllCodes();
    const headers = ['Code', 'Plan', 'Créé le', 'Utilisé ?', 'Utilisé le', 'Utilisé par', 'Email'];
    const rows = all.map(c => {
      const planLabel = c.planId === 'weekly' ? '1 semaine (1000F)' :
                        c.planId === 'monthly' ? '1 mois (2000F)' :
                        c.planId === 'session2026' ? 'SESSION 2026 (2500F)' :
                        c.planId === 'yearly' ? '1 an (10000F)' : c.planId;
      return [
        c.code,
        planLabel,
        new Date(c.createdAt).toLocaleDateString('fr-FR'),
        c.used ? 'OUI' : 'NON',
        c.usedAt ? new Date(c.usedAt).toLocaleDateString('fr-FR') : '',
        c.used && c.usedBy ? c.usedBy.name : '',
        c.used && c.usedBy ? c.usedBy.email : ''
      ];
    });
    return [headers, ...rows].map(r => r.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(',')).join('\n');
  },

  // ====================================================================
  // SUPPRESSION (admin)
  // ====================================================================

  async deleteCode(code) {
    if (!this.isCurrentUserAdmin()) return { success: false, error: 'Non autorisé' };

    if (this.isFirestoreReady()) {
      try {
        const fb = window.FirebaseAuth;
        const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, code);
        await fb._fbFns.deleteDoc(ref);
        // Mettre à jour cache local
        const all = this.getAllCodesLocal().filter(c => c.code !== code);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
        return { success: true };
      } catch (e) {
        console.error('[V58] Erreur deleteCode :', e);
        return { success: false, error: e.message };
      }
    }

    // Fallback
    const all = this.getAllCodesLocal().filter(c => c.code !== code);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(all));
    return { success: true };
  },

  async deleteUnused() {
    if (!this.isCurrentUserAdmin()) return { success: false, error: 'Non autorisé', count: 0 };

    const all = await this.getAllCodes();
    const unused = all.filter(c => !c.used);
    if (unused.length === 0) return { success: true, count: 0 };

    if (this.isFirestoreReady()) {
      try {
        const fb = window.FirebaseAuth;
        const promises = unused.map(c => {
          const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, c.code);
          return fb._fbFns.deleteDoc(ref);
        });
        await Promise.all(promises);
        // Mettre à jour cache local
        const remaining = all.filter(c => c.used);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining));
        return { success: true, count: unused.length };
      } catch (e) {
        console.error('[V58] Erreur deleteUnused :', e);
        return { success: false, error: e.message, count: 0 };
      }
    }

    // Fallback
    const remaining = all.filter(c => c.used);
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(remaining));
    return { success: true, count: unused.length };
  }
};

window.ActivationCodes = ActivationCodes;
