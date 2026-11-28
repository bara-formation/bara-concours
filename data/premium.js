// Bara Concours - Module Premium v2 (Phase 3 corrigée)
// Codes USSD officiels + intégration CinetPay pour paiements automatiques

const PremiumService = {
  // === PLANS DISPONIBLES ===
  //
  // V64.18 : GRILLE 2027 — quatre formules, un niveau par formule.
  //   Chaque plan porte désormais un `tier` (niveau) : c'est lui, et non plus
  //   un simple oui/non « Premium », qui décide des droits du compte.
  //   Le niveau se déduit de `premiumPlan`, champ que les règles Firestore
  //   interdisent déjà au candidat de modifier : aucune règle à changer pour
  //   empêcher quelqu'un de se donner lui-même une formule supérieure.
  //
  //   `finSaison: true` : l'accès court jusqu'à la date de fin de saison
  //   (PremiumService.SAISON.fin), la même pour tous, quelle que soit la date
  //   d'achat. Modifier cette date déplace d'un coup tous ces abonnements.
  PLANS: {
    essentiel: {
      id: 'essentiel',
      name: 'Essentiel',
      price: 4900,  // V64.30 : 5000 → 4900
      tier: 'essentiel',
      finSaison: true,
      duration: null,
      durationLabel: 'jusqu\'aux compositions 2027',
      pricePerDay: null,
      icon: '📘',
      tagColor: '#1e40af',
      tagBg: '#dbeafe',
      popular: false,
      hidden: false
    },
    complet: {
      id: 'complet',
      name: 'Complet',
      price: 9900,  // V64.30 : 10000 → 9900
      tier: 'complet',
      finSaison: true,
      duration: null,
      durationLabel: 'jusqu\'aux compositions 2027',
      pricePerDay: null,
      icon: '🎯',
      tag: 'RECOMMANDÉ',
      tagColor: '#ffffff',
      tagBg: '#15803d',
      popular: true,          // badge « RECOMMANDÉ » + présélection
      hidden: false
    },
    premium: {
      id: 'premium',
      name: 'Premium',
      price: 14900,  // V64.30 : 15000 → 14900
      tier: 'premium',
      finSaison: true,
      duration: null,
      durationLabel: 'jusqu\'aux compositions 2027',
      pricePerDay: null,
      icon: '👑',
      tagColor: '#854d0e',
      tagBg: '#fef3c7',
      popular: false,
      placesLimitees: true,   // V64.18 : nombre de places plafonné (SAISON.placesPremium)
      hidden: false
    },
    // V64.18 : formule de fin de saison, codée mais MASQUÉE.
    //   Elle n'apparaît sur l'écran des tarifs que si SAISON.sprintVisible
    //   vaut true — réglage modifiable depuis l'admin, sans mise à jour de
    //   l'application. Mêmes droits que Complet, prix réduit, pour les
    //   candidats qui arrivent dans les dernières semaines.
    sprint: {
      id: 'sprint',
      name: 'Sprint',
      price: 5900,  // V64.30 : 6000 → 5900
      tier: 'complet',
      finSaison: true,
      sprint: true,
      duration: null,
      durationLabel: 'jusqu\'aux compositions 2027',
      pricePerDay: null,
      icon: '⚡',
      tag: 'Dernière ligne droite',
      tagColor: '#7c2d12',
      tagBg: '#fed7aa',
      popular: false,
      hidden: true            // l'affichage est piloté par SAISON.sprintVisible
    },

    // V64.18 : MONTÉES DE FORMULE.
    //   Le candidat paie uniquement la différence, la date de fin ne change
    //   pas. Ce sont des plans à part entière pour deux raisons :
    //     - le code d'activation est la source de vérité du statut payant
    //       (les règles Firestore empêchent le candidat d'écrire son statut),
    //       une montée doit donc exister sous forme de code ;
    //     - les statistiques de codes comptent 5 000 F pour une montée, et
    //       non le prix plein de la formule visée.
    //   `depuis` : plans à partir desquels la montée est autorisée. Un code de
    //   montée saisi depuis un autre plan est refusé AVANT d'être consommé.
    //   Le Sprint n'y figure pas : c'est une offre de fin de saison, sa montée
    //   vers Premium coûterait moins cher que Premium acheté directement.
    up_ess_comp: {
      id: 'up_ess_comp',
      name: 'Montée Essentiel → Complet',
      price: 5000,
      tier: 'complet',
      finSaison: true,
      upgrade: true,
      depuis: ['essentiel'],
      duration: null,
      durationLabel: 'même date de fin',
      icon: '⬆️',
      hidden: true
    },
    up_comp_prem: {
      id: 'up_comp_prem',
      name: 'Montée Complet → Premium',
      price: 5000,
      tier: 'premium',
      finSaison: true,
      upgrade: true,
      depuis: ['complet', 'up_ess_comp'],
      placesLimitees: true,
      duration: null,
      durationLabel: 'même date de fin',
      icon: '⬆️',
      hidden: true
    },
    up_ess_prem: {
      id: 'up_ess_prem',
      name: 'Montée Essentiel → Premium',
      price: 10000,
      tier: 'premium',
      finSaison: true,
      upgrade: true,
      depuis: ['essentiel'],
      placesLimitees: true,
      duration: null,
      durationLabel: 'même date de fin',
      icon: '⬆️',
      hidden: true
    },

    // ------------------------------------------------------------------
    // ANCIENNES FORMULES — retirées de la vente, toujours reconnues.
    // V64.18 : `tier: 'premium'` — elles donnaient accès à tout ; les abonnés
    //   « conservent leur accès jusqu'à leur date d'expiration actuelle »
    //   (cahier des charges, section 4), donc tous les droits, avec LEUR date
    //   d'expiration à eux et non la date de fin de saison.
    // ------------------------------------------------------------------
    // V64.16 : Hebdomadaire et Mensuel retires de la vente.
    //   La grille 2027 ne comporte que des formules annuelles, qui courent
    //   toutes jusqu'a la fin des compositions. Tant que ces deux plans
    //   restaient affiches, un candidat pouvait encore en acheter un, et son
    //   compte repassait en Gratuit avant l'echeance : exactement le cas que
    //   la nouvelle grille supprime.
    //   Conserves dans PLANS, et non effaces : un compte ou un code encore
    //   actif sur ces plans doit continuer a etre reconnu (le nom du plan
    //   s'affiche dans l'admin, la date d'expiration reste calculee).
    weekly: {
      id: 'weekly',
      tier: 'premium',
      legacy: true,
      name: 'Hebdomadaire',
      price: 1000,
      duration: 7,
      durationLabel: '1 semaine',
      pricePerDay: 143,
      icon: '📅',
      tag: 'Pour tester',
      tagColor: '#2563eb',
      tagBg: '#dbeafe',
      popular: false,
      hidden: true
    },
    monthly: {
      id: 'monthly',
      tier: 'premium',
      legacy: true,
      name: 'Mensuel',
      price: 2000,
      duration: 30,
      durationLabel: '1 mois',
      pricePerDay: 67,
      icon: '⭐',
      tag: 'Pour 1 mois',
      tagColor: '#854d0e',
      tagBg: '#fef9c3',
      popular: false,
      hidden: true
    },
    // V60 : Plan SESSION 2026 — accès jusqu'au 15 août 2026 (date fixe)
    // Remplace l'ancien yearly (retiré pour la saison concours 2026)
    session2026: {
      id: 'session2026',
      tier: 'premium',
      legacy: true,
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
      popular: false, // V63.76 : n'est plus le plan vedette
      special: true,  // V60 : marqueur pour traitement spécial UI
      // V63.76 : masqué de l'affichage. Sa date butoir (15 août 2026) est
      //   passée ou imminente : le vendre reviendrait à vendre un accès qui
      //   expire dans quelques jours. Conservé dans PLANS pour que les
      //   abonnés actuels et les anciens codes restent valides.
      hidden: true
    },
    // V63.97 : Plan vedette de la saison 2027.
    //   Il remplace l'Annuel à 10 000 F. Le positionnement change autant que
    //   le prix : le candidat n'achète pas douze mois d'abonnement, il achète
    //   sa préparation jusqu'à son concours, Accompagnement Final compris.
    //   À 15 000 F, l'offre reste très en dessous des centres de renom
    //   (22 500 F sans accompagnement final) tout en cessant de se présenter
    //   comme un produit d'appoint. Les promotions ponctuelles ramèneront
    //   ponctuellement le prix à 10 000 F.
    //
    //   Pas de date butoir pour l'instant : le calendrier des concours 2027
    //   n'est pas publié. On applique donc une durée d'un an. Dès que les
    //   dates seront connues, remplacer `duration` par `expiresAt` — le
    //   moteur d'activation gère déjà les deux cas.
    // V64.18 : retiré de la vente — c'est « l'ancien forfait annuel unique
    //   (15 000 F) » que la grille 2027 supprime (cahier des charges, section 4).
    //   Les candidats qui l'ont acheté passent au niveau Premium, sur leur
    //   propre date d'expiration.
    session2027: {
      id: 'session2027',
      tier: 'premium',
      legacy: true,
      name: 'SESSION 2027 + ACC. FINAL',
      price: 15000,
      duration: 365,
      durationLabel: 'jusqu\'aux concours 2027',
      pricePerDay: 41,
      icon: '🎯',
      tag: 'Le plus complet 🔥',
      tagColor: '#7c2d12',
      tagBg: '#fed7aa',
      popular: false,
      savings: 9000,
      hidden: true
    },

    // V60 : yearly conservé pour compatibilité descendante (anciens codes BARA-ANNEE-XXXX)
    // V63.97 : retiré de l'affichage — remplacé par session2027. Les abonnés
    //   en cours et les codes déjà distribués restent valides.
    yearly: {
      id: 'yearly',
      tier: 'premium',
      legacy: true,
      name: 'Annuel',
      price: 10000,
      duration: 365,
      durationLabel: '1 an',
      pricePerDay: 27,
      icon: '🏆',
      tagColor: '#15803d',
      tagBg: '#dcfce7',
      popular: false,
      hidden: true
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

  // ==================================================================
  // V64.18 : SAISON 2027 — réglages communs à toutes les formules
  // ==================================================================
  //
  // Valeurs PAR DÉFAUT. Elles sont remplacées par le document
  // `app_texts/config_saison` que l'admin modifie depuis le tableau de bord
  // (rubrique « Saison 2027 ») : changer la date de fin, afficher le Sprint ou
  // ajuster les places Premium ne demande donc aucune mise à jour de l'app.
  // Ce document est lu avec les textes éditables, déjà chargés au démarrage :
  // aucune lecture Firestore supplémentaire.
  //
  // DATE DE FIN PROVISOIRE, VOLONTAIREMENT TARDIVE.
  //   Une date trop tôt couperait l'accès de candidats qui ont payé ; une date
  //   trop tard leur offre quelques semaines de plus. Tant que `finConfirmee`
  //   vaut false, l'application n'affiche jamais cette date aux candidats :
  //   elle écrit « jusqu'aux compositions 2027 ».
  SAISON: {
    annee: 2027,
    fin: '2027-10-31T23:59:59Z',
    finConfirmee: false,
    sprintVisible: false,
    placesPremium: 100,
    premiumComplet: false   // posé par l'admin quand le plafond est atteint
  },
  CONFIG_KEY: 'config_saison',

  /** Les réglages de saison en vigueur : défauts + surcharge distante. */
  getSaison() {
    const s = Object.assign({}, this.SAISON);
    try {
      let distant = window.TextsFirestore && window.TextsFirestore._textsCache
        ? window.TextsFirestore._textsCache[this.CONFIG_KEY] : null;
      if (typeof distant === 'string') distant = JSON.parse(distant);
      if (distant && typeof distant === 'object') {
        if (distant.fin && !isNaN(new Date(distant.fin).getTime())) s.fin = distant.fin;
        if (typeof distant.finConfirmee === 'boolean') s.finConfirmee = distant.finConfirmee;
        if (typeof distant.sprintVisible === 'boolean') s.sprintVisible = distant.sprintVisible;
        if (Number.isFinite(distant.placesPremium) && distant.placesPremium >= 0) s.placesPremium = distant.placesPremium;
        if (typeof distant.premiumComplet === 'boolean') s.premiumComplet = distant.premiumComplet;
      }
    } catch (e) { /* réglage illisible : on garde les défauts */ }
    return s;
  },

  finSaisonMs() {
    return new Date(this.getSaison().fin).getTime();
  },

  /** « jusqu'aux compositions 2027 » tant que la date n'est pas confirmée. */
  libelleFinSaison() {
    const s = this.getSaison();
    if (!s.finConfirmee) return 'jusqu\'aux compositions ' + s.annee;
    return 'jusqu\'au ' + new Date(s.fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  // ==================================================================
  // V64.18 : NIVEAUX ET DROITS
  // ==================================================================
  //
  // quota       : QCM par jour (première réponse à une question)
  // quotaBonus  : quota des 24 premières heures après la création du compte
  // quotaAffiche: ce que voit le candidat, quand il diffère du vrai plafond.
  //   Premium affiche « Illimité » mais garde un plafond technique de 300 :
  //   personne ne l'atteint honnêtement, et il protège le quota Firestore
  //   partagé contre un compte prêté à tout un groupe, ou un bug.
  TIERS: {
    visiteur:  { rang: -1, nom: 'Visiteur',  quota: 5 },
    gratuit:   { rang: 0,  nom: 'Gratuit',   quota: 10, quotaBonus: 30 },
    essentiel: { rang: 1,  nom: 'Essentiel', quota: 30 },
    complet:   { rang: 2,  nom: 'Complet',   quota: 75 },
    premium:   { rang: 3,  nom: 'Premium',   quota: 300, quotaAffiche: 'Illimité' }
  },

  // Droit → niveau minimum. Une seule table : modifier une ligne ici change
  // le droit partout dans l'application.
  //   Les trois premières lignes ne figurent pas dans la grille du cahier des
  //   charges ; elles reprennent ce que le Premium binaire donnait jusqu'ici,
  //   au niveau payant le plus bas.
  DROITS: {
    modeExamen:      'essentiel',  // sujets chronométrés par matière
    correctionHebdo: 'essentiel',  // correction détaillée de l'examen du dimanche
    classement:      'essentiel',  // classement national de l'examen du dimanche
    archivesAF:      'essentiel',  // Accompagnement Final 2025 et 2026 (sessions + annales)
    // V64.19 : dès Essentiel (décision du 16 novembre 2026). La grille du
    //   cahier des charges les plaçait en Complet ; Complet se distingue
    //   désormais d'Essentiel par le quota (75 au lieu de 30) et par
    //   l'Accompagnement Final 2027.
    statsAvancees:   'essentiel',  // analyse par matière + historique des examens du dimanche
    af2027:          'complet',    // Accompagnement Final 2027
    suiviPerso:      'premium'     // bilan mensuel personnalisé
  },

  // Libellés présentés aux candidats, dans l'ordre d'affichage.
  LIBELLES_DROITS: {
    modeExamen:      'Mode examen chronométré, dans les conditions du concours',
    correctionHebdo: 'Correction détaillée de l\'examen du dimanche',
    classement:      'Classement national de l\'examen du dimanche',
    archivesAF:      'Accompagnement Final 2025 et 2026 : les questions tombées',
    statsAvancees:   'Analyse par matière et historique de tes examens du dimanche',
    af2027:          'Accompagnement Final 2027, en direct pendant les épreuves',
    suiviPerso:      'Suivi personnalisé : un bilan et des conseils chaque mois'
  },

  /** Ligne de quota présentée aux candidats. */
  libelleQuota(tier) {
    const t = this.TIERS[tier];
    if (!t) return '';
    return t.quotaAffiche === 'Illimité' ? 'Questions illimitées' : t.quota + ' questions par jour';
  },

  /**
   * Avantages d'un niveau.
   * @param {string} tier
   * @param {boolean} seulementNouveaux - true : seulement ce qui s'ajoute au
   *   niveau payant inférieur (pour « Tout Essentiel, plus : … »)
   * @returns {{base: string|null, lignes: string[]}}
   */
  avantages(tier, seulementNouveaux) {
    const r = this.rang(tier);
    const inferieur = Object.keys(this.TIERS).find(k => this.TIERS[k].rang === r - 1 && r - 1 >= 1);
    const delta = seulementNouveaux && inferieur;
    const lignes = [this.libelleQuota(tier)];
    Object.keys(this.LIBELLES_DROITS).forEach(d => {
      const min = this.rang(this.DROITS[d]);
      if (min > r) return;
      if (delta && min <= r - 1) return;
      lignes.push(this.LIBELLES_DROITS[d]);
    });
    return { base: delta ? this.TIERS[inferieur].nom : null, lignes };
  },

  rang(tier) {
    return (this.TIERS[tier] || this.TIERS.gratuit).rang;
  },

  /**
   * Date d'expiration EFFECTIVE d'un statut payant (en ms), ou 0.
   *   Formules de saison : la date de fin de saison en vigueur, quelle que
   *   soit la date enregistrée — c'est ce qui permet de déplacer tous les
   *   abonnements d'un coup si le calendrier des compositions change.
   *   Anciennes formules : leur propre date d'expiration.
   */
  expirationEffective(user) {
    if (!user || !user.isPremium) return 0;
    const plan = this.PLANS[user.premiumPlan];
    if (plan && plan.finSaison) return this.finSaisonMs();
    if (!user.premiumExpiresAt) return 0;
    const t = new Date(user.premiumExpiresAt).getTime();
    return isNaN(t) ? 0 : t;
  },

  /** Le compte a-t-il une formule payante en cours ? (toutes formules) */
  isUserPremium(user) {
    return this.expirationEffective(user) > Date.now();
  },

  /**
   * Le niveau du compte : 'gratuit', 'essentiel', 'complet' ou 'premium'.
   *   (Le niveau 'visiteur' — pas de compte — est décidé par le compteur de
   *   quota, qui sait si le candidat s'est inscrit.)
   *   Plan inconnu mais statut payant valide : niveau Premium. Prudence
   *   volontaire — on ne retire pas un accès payé à cause d'un plan que
   *   cette version du fichier ne connaîtrait pas.
   */
  getTier(user) {
    if (!this.isUserPremium(user)) return 'gratuit';
    const plan = this.PLANS[user.premiumPlan];
    return (plan && plan.tier) || 'premium';
  },

  getTierName(user) {
    return this.TIERS[this.getTier(user)].nom;
  },

  /** Le compte a-t-il ce droit ? (voir la table DROITS) */
  hasRight(user, droit) {
    const minimum = this.DROITS[droit];
    if (!minimum) return false;
    return this.rang(this.getTier(user)) >= this.rang(minimum);
  },

  /** Le niveau minimum qui ouvre un droit, avec son nom (pour les cadenas). */
  tierPour(droit) {
    const t = this.DROITS[droit] || 'premium';
    return { id: t, nom: this.TIERS[t].nom };
  },

  daysRemaining(user) {
    const fin = this.expirationEffective(user);
    if (fin <= Date.now()) return 0;
    return Math.ceil((fin - Date.now()) / (1000 * 60 * 60 * 24));
  },

  formatExpiry(user) {
    // V64.18 : formules de saison — la date n'est montrée que si l'admin l'a
    //   confirmée ; sinon « la fin des compositions 2027 ».
    const plan = user && this.PLANS[user.premiumPlan];
    if (plan && plan.finSaison) {
      const s = this.getSaison();
      if (!s.finConfirmee) return 'la fin des compositions ' + s.annee;
      return new Date(s.fin).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
    }
    if (!user || !user.premiumExpiresAt) return '';
    const d = new Date(user.premiumExpiresAt);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  },

  /** Les formules proposées à l'achat, dans l'ordre d'affichage. */
  plansEnVente() {
    const saison = this.getSaison();
    return Object.values(this.PLANS).filter(p => {
      if (p.upgrade || p.legacy || p.adminOnly) return false;
      if (p.sprint) return saison.sprintVisible === true;
      return !p.hidden;
    });
  },

  /** Les places Premium sont-elles épuisées ? (réglé par l'admin) */
  premiumEpuise() {
    return this.getSaison().premiumComplet === true;
  },

  /**
   * Les montées de formule accessibles à ce compte, de la moins chère à la
   * plus chère. Vide si le compte n'a pas de formule de saison en cours.
   */
  monteesDisponibles(user) {
    if (!this.isUserPremium(user)) return [];
    const actuel = user.premiumPlan;
    return Object.values(this.PLANS)
      .filter(p => p.upgrade && (p.depuis || []).includes(actuel))
      .filter(p => !(p.placesLimitees && this.premiumEpuise()))
      .sort((a, b) => a.price - b.price);
  },

  /**
   * Ce plan peut-il être activé sur ce compte ? À appeler AVANT de consommer
   * un code : un code refusé ici reste utilisable.
   * @returns {{ok: boolean, raison?: string}}
   */
  peutActiver(user, planId) {
    const plan = this.PLANS[planId];
    if (!plan) return { ok: false, raison: 'Ce code correspond à une formule inconnue. Mets l\'application à jour, puis réessaie.' };

    const tierActuel = this.getTier(user);
    if (plan.upgrade) {
      if (!this.isUserPremium(user) || !(plan.depuis || []).includes(user.premiumPlan)) {
        const depuis = (plan.depuis || []).map(id => (this.PLANS[id] || {}).name || id).join(' ou ');
        return { ok: false, raison: 'Ce code est une montée de formule depuis ' + depuis + '. Ta formule actuelle est ' + this.TIERS[tierActuel].nom + '. Ton code n\'a pas été utilisé.' };
      }
      return { ok: true };
    }
    // Pas de passage à une formule inférieure ou égale (cahier des charges,
    // section 3) : le code serait consommé pour rien.
    if (this.isUserPremium(user) && this.rang(plan.tier || 'premium') <= this.rang(tierActuel)) {
      return { ok: false, raison: 'Tu as déjà la formule ' + this.TIERS[tierActuel].nom + ', ce code ne t\'apporterait rien. Il n\'a pas été utilisé : garde-le ou contacte Bara Formation.' };
    }
    return { ok: true };
  },

  /**
   * Le meilleur de deux statuts payants : formule valide d'abord, puis niveau
   * le plus élevé, puis expiration la plus tardive.
   *   Sert à combiner le statut écrit par l'admin et celui reconstitué depuis
   *   les codes, sans que l'un efface l'autre.
   */
  fusionnerStatut(a, b) {
    const valide = x => this.expirationEffective(x) > Date.now();
    if (!a || !a.isPremium) return b || a;
    if (!b || !b.isPremium) return a;
    if (valide(a) !== valide(b)) return valide(a) ? a : b;
    const ra = this.rang(this.getTierBrut(a)), rb = this.rang(this.getTierBrut(b));
    if (ra !== rb) return ra > rb ? a : b;
    return this.expirationEffective(a) >= this.expirationEffective(b) ? a : b;
  },

  /** Le niveau d'un statut, qu'il soit expiré ou non (pour comparer). */
  getTierBrut(user) {
    const plan = user && this.PLANS[user.premiumPlan];
    return (plan && plan.tier) || 'premium';
  },

  /**
   * Reconstitue un statut payant à partir des codes utilisés par un compte.
   * Partagé par l'application et le tableau de bord admin.
   *
   *   Anciennes formules à durée : elles se cumulent, comme avant (un mois
   *   activé avec dix jours restants donne quarante jours), à partir de la
   *   date RÉELLE d'utilisation de chaque code.
   *   Formules de saison : elles courent jusqu'à la fin de saison ; on garde
   *   la plus élevée (une montée de formule élève le niveau).
   *   Au final : parmi ces deux candidats, celui qui est valide et de plus
   *   haut niveau.
   *
   * @returns {Object|null} { isPremium, premiumPlan, premiumExpiresAt,
   *   premiumActivatedAt, expiration } ou null si aucun code exploitable
   */
  rejouerCodes(codes) {
    const tries = (codes || []).slice().sort((a, b) => (a.usedAt || 0) - (b.usedAt || 0));
    let chaineExp = 0, chainePlan = null;
    let saisonPlan = null;
    let premiere = null;

    for (const c of tries) {
      const plan = this.PLANS[c.planId];
      const utiliseLe = c.usedAt || 0;
      if (!plan || !utiliseLe) continue;
      if (premiere === null) premiere = utiliseLe;

      if (plan.finSaison) {
        if (!saisonPlan || this.rang(plan.tier) >= this.rang(this.PLANS[saisonPlan].tier)) saisonPlan = plan.id;
      } else if (plan.expiresAt) {
        chaineExp = Math.max(chaineExp, plan.expiresAt);
        chainePlan = plan.id;
      } else if (plan.duration) {
        const depart = chaineExp > utiliseLe ? chaineExp : utiliseLe;
        chaineExp = depart + plan.duration * 24 * 60 * 60 * 1000;
        chainePlan = plan.id;
      }
    }

    const candidats = [];
    if (chainePlan) candidats.push({ plan: chainePlan, exp: chaineExp });
    if (saisonPlan) candidats.push({ plan: saisonPlan, exp: this.finSaisonMs() });
    if (candidats.length === 0) return null;

    const maintenant = Date.now();
    candidats.sort((x, y) => {
      const vx = x.exp > maintenant, vy = y.exp > maintenant;
      if (vx !== vy) return vx ? -1 : 1;
      const rx = this.rang(this.PLANS[x.plan].tier || 'premium'), ry = this.rang(this.PLANS[y.plan].tier || 'premium');
      if (rx !== ry) return ry - rx;
      return y.exp - x.exp;
    });
    const g = candidats[0];
    return {
      isPremium: true,
      premiumPlan: g.plan,
      premiumExpiresAt: new Date(g.exp).toISOString(),
      premiumActivatedAt: new Date(premiere || maintenant).toISOString(),
      expiration: g.exp
    };
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

    // V64.18 : « formule » au lieu de « Premium », qui désigne désormais une
    //   formule précise. Pour une montée, le nom du plan dit d'où à où.
    const text = `Bonjour Bara Formation,
J'ai effectué un paiement :

📋 Référence : ${reference}
📦 Formule : ${planObj.name} (${this.formatPrice(planObj.price)})
💳 Opérateur : ${opObj.name}
${userPhone ? '📱 Numéro qui a payé : ' + userPhone + '\n' : ''}${userName ? '👤 Mon nom : ' + userName + '\n' : ''}
Je joins la capture du SMS de confirmation.
Merci de bien vouloir m'envoyer mon code d'activation. 🙏`;

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

    // V64.18 : formules de saison (et montées) : la fin de saison, sans cumul.
    //   L'expiration enregistrée n'est qu'indicative — c'est la date de fin de
    //   saison en vigueur qui fait foi (voir expirationEffective).
    if (plan.finSaison) {
      return {
        isPremium: true,
        premiumPlan: planId,
        premiumExpiresAt: new Date(this.finSaisonMs()).toISOString(),
        premiumActivatedAt: (plan.upgrade && user && user.premiumActivatedAt) ? user.premiumActivatedAt : new Date().toISOString()
      };
    }

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
    session2026: 'SESSION',   // V60 : BARA-SESSION-XXXX
    session2027: 'S2027',     // V63.97 : BARA-S2027-XXXX
    // V64.18 : grille 2027
    essentiel: 'ESS',         // BARA-ESS-XXXXXX
    complet: 'COMP',          // BARA-COMP-XXXXXX
    premium: 'PREM',          // BARA-PREM-XXXXXX
    sprint: 'SPRINT',         // BARA-SPRINT-XXXXXX
    up_ess_comp: 'UPEC',      // montée Essentiel → Complet
    up_comp_prem: 'UPCP',     // montée Complet → Premium
    up_ess_prem: 'UPEP'       // montée Essentiel → Premium
  },

  // V64.18 : le format accepté est construit à partir des préfixes ci-dessus.
  //   Il était écrit en dur dans validateCode : chaque nouveau plan obligeait
  //   à penser à le modifier, sinon ses codes étaient refusés comme
  //   « Format invalide » alors qu'ils existaient bel et bien.
  formatCodeValide(code) {
    const prefixes = Object.values(this.PLAN_PREFIXES).join('|');
    return new RegExp('^BARA-(' + prefixes + ')-[A-Z0-9]{4,8}$').test(code);
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

  // V64.00 : partie aléatoire portée de 4 à 6 caractères.
  //   Les règles Firestore interdisent désormais de parcourir la collection :
  //   pour utiliser un code, il faut le connaître exactement. La seule
  //   attaque restante est de deviner. Avec 4 caractères, un million de
  //   combinaisons — atteignable. Avec 6, plus d'un milliard, et chaque essai
  //   consomme une lecture, donc l'attaque devient visible et coûteuse.
  //   Les codes déjà distribués (4 caractères) restent valides.
  LONGUEUR_CODE: 6,

  generateCode(planId) {
    const prefix = this.PLAN_PREFIXES[planId];
    if (!prefix) return null;
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let random = '';
    for (let i = 0; i < this.LONGUEUR_CODE; i++) {
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

    // V64.00 : accepte les anciens codes (4 caractères), les nouveaux (6) et
    //   le préfixe S2027 introduit avec le plan Session 2027.
    if (!this.formatCodeValide(code)) {
      return { valid: false, reason: 'Format invalide. Exemple : BARA-COMP-A3F7K9' };
    }

    // V63.62 : Détecter l'état réseau pour donner un message d'erreur exact
    const isOnline = (typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean')
      ? navigator.onLine : true;

    // Essayer Firestore d'abord (le code peut exister sur le cloud sans être en local)
    if (window.FirebaseAuth && window.FirebaseAuth.isFirebaseReady && window.FirebaseAuth.user) {
      try {
        const fb = window.FirebaseAuth;
        const ref = fb._fbFns.doc(fb.db, this.FIRESTORE_COLLECTION, code);
        const snap = await fb._fbFns.getDoc(ref);
        if (!snap.exists()) {
          // Firestore a répondu : le code n'existe VRAIMENT pas (ce n'est pas le réseau)
          return { valid: false, reason: 'Ce code n\'existe pas. Vérifie que tu l\'as bien tapé, avec les tirets (ex : BARA-SESSION-XXXX).' };
        }
        const data = snap.data();
        if (data.used) {
          return { valid: false, reason: 'Ce code a déjà été utilisé.', code: data };
        }
        return { valid: true, code: data, source: 'firestore' };
      } catch (e) {
        console.warn('[V63.62] Erreur validation Firestore :', e);
        if (!isOnline) {
          return { valid: false, reason: 'Tu es hors connexion. Connecte-toi à internet (Wi-Fi ou données mobiles) pour activer ton code.' };
        }
        return { valid: false, reason: 'Connexion trop lente. Attends 10 secondes et réessaie.' };
      }
    }

    // V63.62 : Firebase pas prêt — distinguer offline vs app pas encore initialisée
    if (!isOnline) {
      return { valid: false, reason: 'Tu es hors connexion. Connecte-toi à internet pour activer ton code.' };
    }
    if (!window.FirebaseAuth || !window.FirebaseAuth.isFirebaseReady) {
      return { valid: false, reason: 'L\'application n\'a pas fini de se connecter au serveur. Attends 5 secondes puis réessaie.' };
    }

    // Fallback localStorage (cas rare)
    const found = this.getAllCodesLocal().find(c => c.code === code);
    if (!found) return { valid: false, reason: 'Ce code n\'existe pas ou n\'est pas encore synchronisé. Attends 30 secondes et réessaie.' };
    if (found.used) return { valid: false, reason: 'Ce code a déjà été utilisé.', code: found };
    return { valid: true, code: found, source: 'local' };
  },

  // ====================================================================
  // UTILISATION (côté utilisateur)
  // ====================================================================

  // Marquer un code comme utilisé (transaction Firestore atomique)
  /**
   * V63.78 : Retrouver le Premium d'un utilisateur a partir des codes qu'il a
   *   deja utilises.
   *
   *   Probleme corrige : si l'ecriture du statut Premium dans le document
   *   utilisateur echoue (regles Firestore, coupure reseau, session pas encore
   *   prete au moment de l'activation), le Premium n'existe plus qu'en local.
   *   A la deconnexion, le local est remis a zero — et l'utilisateur se
   *   retrouve en gratuit alors qu'il a bel et bien paye.
   *
   *   Le code d'activation, lui, reste marque "utilise par <uid>" dans
   *   Firestore. C'est donc la source de verite la plus fiable : on s'en sert
   *   pour reconstituer l'abonnement a la connexion.
   *
   *   Retourne les champs Premium a appliquer, ou null si rien a restaurer.
   */
  async recoverPremiumFromCodes(uid) {
    if (!uid) return null;
    const fb = window.FirebaseAuth;
    if (!fb || !fb.isFirebaseReady || !fb.db) return null;

    try {
      const q = fb._fbFns.query(
        fb._fbFns.collection(fb.db, this.FIRESTORE_COLLECTION),
        fb._fbFns.where('usedBy.userId', '==', uid)
      );
      const snap = await fb._fbFns.getDocs(q);
      if (snap.empty) return null;

      const codes = [];
      snap.forEach(d => codes.push(d.data()));

      // V64.18 : rejeu confié au moteur partagé avec l'admin
      //   (PremiumService.rejouerCodes), qui connaît les formules de saison et
      //   les montées de formule. Les deux copies du calcul — ici et dans
      //   admin.html — pouvaient sinon diverger à la prochaine évolution.
      const r = window.PremiumService.rejouerCodes(codes);
      if (!r) return null;
      if (r.expiration <= Date.now()) return null;   // deja perime : rien a restaurer
      return {
        isPremium: true,
        premiumPlan: r.premiumPlan,
        premiumExpiresAt: r.premiumExpiresAt,
        premiumActivatedAt: r.premiumActivatedAt
      };
    } catch (e) {
      console.error('[V63.79] Recuperation Premium impossible :', e);
      return null;
    }
  },

  async useCode(rawCode, userInfo) {
    const validation = await this.validateCode(rawCode);
    if (!validation.valid) return validation;

    const code = validation.code.code;

    // V64.00 : l'identifiant inscrit dans le code DOIT être celui du compte
    //   authentifié. Les règles Firestore l'exigent désormais — un candidat
    //   ne peut plus attribuer un code à quelqu'un d'autre — et c'est aussi
    //   ce qui permet de lui restituer son abonnement plus tard.
    const uidAuth = (window.FirebaseAuth && window.FirebaseAuth.user)
      ? window.FirebaseAuth.user.uid : null;
    if (!uidAuth) {
      return { valid: false, reason: 'Connexion requise pour activer un code. Réessaie dans quelques secondes.' };
    }

    const usedBy = {
      userId: uidAuth,
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

    // V64.18 : un compteur par plan connu, au lieu d'une liste écrite en dur
    //   qui ignorait silencieusement les codes des nouvelles formules.
    const byPlan = {}, usedByPlan = {};
    Object.keys(window.PremiumService.PLANS).forEach(id => { byPlan[id] = 0; usedByPlan[id] = 0; });
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
    // V64.18 : un compteur par plan connu, au lieu d'une liste écrite en dur
    //   qui ignorait silencieusement les codes des nouvelles formules.
    const byPlan = {}, usedByPlan = {};
    Object.keys(window.PremiumService.PLANS).forEach(id => { byPlan[id] = 0; usedByPlan[id] = 0; });
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
                        c.planId === 'yearly' ? '1 an (10000F)' :
                        c.planId === 'session2027' ? 'Session 2027 (15000F)' : c.planId;
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
