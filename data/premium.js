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
      tag: 'Le plus populaire',
      tagColor: '#854d0e',
      tagBg: '#fef9c3',
      popular: true
    },
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
      savings: 14000
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
    moov: '04 04 34 04',
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
    const currentExpiry = user.premiumExpiresAt ? new Date(user.premiumExpiresAt).getTime() : 0;
    const startFrom = currentExpiry > now ? currentExpiry : now;
    const newExpiry = new Date(startFrom + plan.duration * 24 * 60 * 60 * 1000);

    return {
      isPremium: true,
      premiumPlan: planId,
      premiumExpiresAt: newExpiry.toISOString(),
      premiumActivatedAt: new Date().toISOString()
    };
  }
};

window.PremiumService = PremiumService;
