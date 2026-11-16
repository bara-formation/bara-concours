/**
 * BARA CONCOURS — Couche d'accès unifiée aux champs utilisateur (V63.63)
 * =======================================================================
 *
 * POURQUOI CE FICHIER ?
 * ---------------------
 * Au fil des versions, une même donnée a été stockée sous plusieurs noms selon
 * l'endroit du code. Exemples réels rencontrés en production :
 *
 *   Ville      → `city` (écran profil) / `ville` (inscription) / `region` (Firestore)
 *   Nom        → `name` (profil, admin) / `nom` / `displayName` (Firebase)
 *   Téléphone  → `phoneNumber` (inscription) / `phone` (biométrie, forum)
 *
 * Résultat : des bugs où la donnée EXISTE mais n'est pas affichée, parce que le
 * code de lecture cherche une variante différente de celle utilisée à l'écriture.
 * (bugs V63.60 nom manquant, V63.61 ville manquante)
 *
 * COMMENT L'UTILISER
 * ------------------
 *   LECTURE  : UserFields.getCity(user)          → cherche dans TOUTES les variantes
 *   ÉCRITURE : UserFields.setCity(user, 'Manga') → écrit dans TOUTES les variantes
 *
 * En écrivant partout, on garantit qu'aucun code existant (même non migré) ne
 * verra un champ vide. En lisant partout, on récupère les données des anciens
 * comptes créés avant l'harmonisation.
 *
 * RÈGLE POUR LES FUTURS DÉVELOPPEMENTS
 * ------------------------------------
 * Ne plus jamais accéder directement à user.city / user.name / user.phone.
 * Toujours passer par UserFields. Voir DONNEES.md pour le dictionnaire complet.
 */

const UserFields = {

  // ==================================================================
  // DÉFINITION DES CHAMPS
  // Pour chaque donnée : le nom canonique en premier, puis les variantes
  // historiques tolérées, par ordre de priorité de lecture.
  // ==================================================================
  SCHEMA: {
    name:           ['name', 'nom', 'displayName'],
    city:           ['city', 'ville', 'region'],
    phone:          ['phoneNumber', 'phone'],
    targetConcours: ['targetConcours'],
    educationLevel: ['educationLevel', 'niveauScolaire'],
    email:          ['email'],
    uid:            ['uid'],
    // V64.16 : appareils depuis lesquels le compte a été ouvert.
    //   Champ neuf, donc une seule variante : aucun historique à réconcilier.
    //   Forme : { <identifiantAppareil> : { p, f, l } }
    //     p = plateforme lisible (« Android · Chrome »)
    //     f = première connexion depuis cet appareil (millisecondes)
    //     l = dernière connexion depuis cet appareil (millisecondes)
    //   « Connexion » et non « ouverture » : l'entrée est écrite quand le
    //   compte est ouvert sur cet appareil, pas à chaque lancement de l'app.
    devices:        ['devices']
  },

  // Valeurs considérées comme "vides" (placeholders par défaut de l'app)
  PLACEHOLDERS: ['Apprenant', 'Invité', 'Visiteur', '', '-', '—'],

  // ==================================================================
  // LECTURE GÉNÉRIQUE
  // ==================================================================

  /**
   * Lit une donnée en cherchant dans toutes ses variantes connues.
   * @param {Object} obj - l'objet utilisateur (state.user, profil Firestore, ...)
   * @param {String} cle - clé du SCHEMA ('name', 'city', 'phone', ...)
   * @param {*} defaut - valeur retournée si rien n'est trouvé
   */
  get(obj, cle, defaut = '') {
    if (!obj || typeof obj !== 'object') return defaut;
    const variantes = this.SCHEMA[cle];
    if (!variantes) {
      console.warn('[UserFields] Clé inconnue :', cle);
      return defaut;
    }
    for (const v of variantes) {
      const val = obj[v];
      if (val !== undefined && val !== null && String(val).trim() !== '') {
        // Ignorer les placeholders pour le nom
        if (cle === 'name' && this.PLACEHOLDERS.includes(String(val).trim())) continue;
        return val;
      }
    }
    return defaut;
  },

  /**
   * Écrit une donnée dans TOUTES ses variantes, pour que n'importe quel code
   * (migré ou non) la trouve. Modifie l'objet passé en paramètre.
   */
  set(obj, cle, valeur) {
    if (!obj || typeof obj !== 'object') return obj;
    const variantes = this.SCHEMA[cle];
    if (!variantes) {
      console.warn('[UserFields] Clé inconnue :', cle);
      return obj;
    }
    variantes.forEach(v => { obj[v] = valeur; });
    return obj;
  },

  /**
   * Écrit plusieurs champs d'un coup.
   * Exemple : UserFields.setAll(user, { name: 'Ali', city: 'Manga' })
   */
  setAll(obj, donnees) {
    Object.entries(donnees || {}).forEach(([cle, val]) => this.set(obj, cle, val));
    return obj;
  },

  // ==================================================================
  // RACCOURCIS DE LECTURE (les plus utilisés)
  // ==================================================================

  /** Nom complet à afficher. Recompose depuis firstName/lastName si besoin. */
  getName(user, defaut = '') {
    const direct = this.get(user, 'name', '');
    if (direct) return direct;
    // Recomposer depuis firstName + lastName
    if (user) {
      const compose = [user.firstName, user.lastName].filter(Boolean).join(' ').trim();
      if (compose) return compose;
    }
    return defaut;
  },

  /** Prénom seul (premier mot du nom complet). */
  getFirstName(user, defaut = '') {
    if (user && user.firstName) return user.firstName;
    const n = this.getName(user, '');
    return n ? n.split(' ')[0] : defaut;
  },

  getCity(user, defaut = '')           { return this.get(user, 'city', defaut); },
  getPhone(user, defaut = '')          { return this.get(user, 'phone', defaut); },
  getTargetConcours(user, defaut = '') { return this.get(user, 'targetConcours', defaut); },
  getEducationLevel(user, defaut = '') { return this.get(user, 'educationLevel', defaut); },
  getEmail(user, defaut = '')          { return this.get(user, 'email', defaut); },

  // ==================================================================
  // V64.16 : APPAREILS DU COMPTE
  // ==================================================================
  //
  // À quoi ça sert : rendre visible le partage de compte. Un abonnement
  // utilisé depuis six appareils différents sert probablement six candidats
  // pour un seul paiement.
  //
  // CE QUE LE CHIFFRE VAUT, ET CE QU'IL NE VAUT PAS
  //   L'identifiant est posé dans le navigateur de l'appareil. Donc :
  //     - deux candidats qui se partagent un seul téléphone comptent pour 1 ;
  //     - un candidat qui vide les données du site, réinstalle l'application
  //       ou ouvre le compte dans un autre navigateur compte pour 2.
  //   À lire comme « ce compte a été ouvert depuis AU MOINS n installations
  //   distinctes », c'est-à-dire un indice, jamais une preuve.
  // ==================================================================

  /** La table brute des appareils : { <id> : { p, f, l } }. */
  getDevices(user) {
    const d = this.get(user, 'devices', null);
    return (d && typeof d === 'object') ? d : {};
  },

  /** Combien d'appareils distincts connus pour ce compte. */
  countDevices(user) {
    return Object.keys(this.getDevices(user)).length;
  },

  /**
   * Les appareils en liste, de la connexion la plus récente à la plus ancienne.
   * @returns {Array} [{ id, plateforme, premierVu, dernierVu }]
   */
  listDevices(user) {
    const table = this.getDevices(user);
    return Object.keys(table).map(id => {
      const e = table[id] || {};
      return {
        id: id,
        plateforme: e.p || 'Appareil inconnu',
        premierVu: e.f || 0,
        dernierVu: e.l || e.f || 0
      };
    }).sort((a, b) => b.dernierVu - a.dernierVu);
  },

  setDevices(user, table) { return this.set(user, 'devices', table); },

  // ==================================================================
  // RACCOURCIS D'ÉCRITURE
  // ==================================================================

  /** Écrit le nom + décompose en firstName / lastName */
  setName(user, valeur) {
    this.set(user, 'name', valeur);
    if (user && valeur) {
      const parts = String(valeur).trim().split(/\s+/);
      user.firstName = parts[0] || '';
      user.lastName = parts.slice(1).join(' ') || '';
    }
    return user;
  },

  setCity(user, valeur)           { return this.set(user, 'city', valeur); },
  setPhone(user, valeur)          { return this.set(user, 'phone', valeur); },
  setTargetConcours(user, valeur) { return this.set(user, 'targetConcours', valeur); },
  setEducationLevel(user, valeur) { return this.set(user, 'educationLevel', valeur); },

  // ==================================================================
  // OUTILS
  // ==================================================================

  /**
   * Répare un objet utilisateur : pour chaque donnée trouvée dans une variante,
   * la recopie dans toutes les autres. Utile pour les comptes créés avant
   * l'harmonisation, ou après une synchronisation Firestore partielle.
   *
   * @param {Object} user - l'objet à réparer (modifié sur place)
   * @param {Object} source - source complémentaire optionnelle (ex : profil Firestore)
   * @returns {Boolean} true si au moins un champ a été réparé
   */
  repair(user, source = null) {
    if (!user || typeof user !== 'object') return false;
    let modifie = false;

    Object.keys(this.SCHEMA).forEach(cle => {
      // Chercher la valeur d'abord dans user, sinon dans la source complémentaire
      let val = this.get(user, cle, '');
      if (!val && source) val = this.get(source, cle, '');
      if (!val && cle === 'name' && source && source.displayName) val = source.displayName;

      if (val) {
        // Vérifier si toutes les variantes ont déjà cette valeur
        const variantes = this.SCHEMA[cle];
        const incomplet = variantes.some(v => user[v] !== val);
        if (incomplet) {
          if (cle === 'name') this.setName(user, val);
          else this.set(user, cle, val);
          modifie = true;
        }
      }
    });

    return modifie;
  },

  /**
   * Construit l'objet à envoyer à Firestore avec tous les alias renseignés,
   * pour que le tableau de bord admin et l'app trouvent la donnée quel que
   * soit le champ qu'ils lisent.
   */
  toFirestorePayload(user) {
    const nom = this.getName(user, '');
    const ville = this.getCity(user, '');
    const tel = this.getPhone(user, '');
    return {
      // Nom sous toutes ses formes
      name: nom,
      nom: nom,
      displayName: nom,
      // Ville sous toutes ses formes
      city: ville,
      ville: ville,
      region: ville,
      // Téléphone
      phoneNumber: tel,
      phone: tel,
      // Le reste
      targetConcours: this.getTargetConcours(user, ''),
      educationLevel: this.getEducationLevel(user, '')
    };
  },

  /** Diagnostic : liste les incohérences d'un objet utilisateur (debug). */
  diagnostic(user) {
    const rapport = [];
    Object.entries(this.SCHEMA).forEach(([cle, variantes]) => {
      const valeurs = {};
      variantes.forEach(v => {
        if (user && user[v] !== undefined && user[v] !== null && String(user[v]).trim() !== '') {
          valeurs[v] = user[v];
        }
      });
      const distinctes = [...new Set(Object.values(valeurs))];
      if (distinctes.length > 1) {
        rapport.push({ champ: cle, probleme: 'valeurs divergentes', valeurs });
      } else if (Object.keys(valeurs).length > 0 && Object.keys(valeurs).length < variantes.length) {
        rapport.push({ champ: cle, probleme: 'variantes incomplètes', valeurs, manquantes: variantes.filter(v => !valeurs[v]) });
      }
    });
    return rapport;
  }
};

/**
 * BARA CONCOURS — Identité de l'appareil courant (V64.16)
 * ========================================================
 *
 * Un identifiant stable par installation, posé dans le navigateur, pour
 * compter les appareils d'un compte dans le tableau de bord admin.
 *
 * Volontairement anonyme : ni numéro de série, ni identifiant publicitaire,
 * ni chaîne userAgent complète. Un tirage aléatoire et un libellé court du
 * type « Android · Chrome ». Rien qui permette de retrouver un appareil
 * ailleurs que dans ce compte.
 */
const UserDevice = {

  STORAGE_KEY: 'bara_device_id',

  // a-z et 0-9 seulement : l'identifiant sert de nom de champ Firestore,
  // où le point, la barre oblique, les crochets, l'étoile et l'accent grave
  // sont interdits, et où un nom ne peut pas commencer par deux soulignés.
  ALPHABET: 'abcdefghijklmnopqrstuvwxyz0123456789',
  LONGUEUR: 12,

  // Au-delà, on ne garde que les plus récemment vus. Un compte très partagé
  // accumulerait sinon des dizaines d'entrées dans son document Firestore.
  MAX_APPAREILS: 12,

  _tirer() {
    let s = '';
    for (let i = 0; i < this.LONGUEUR; i++) {
      s += this.ALPHABET.charAt(Math.floor(Math.random() * this.ALPHABET.length));
    }
    return s;
  },

  /**
   * L'identifiant de cet appareil, créé au premier appel puis réutilisé.
   * Renvoie une chaîne vide si le navigateur refuse le stockage local
   * (navigation privée verrouillée) : l'appelant n'enregistre alors rien,
   * plutôt que de créer un appareil neuf à chaque ouverture.
   */
  getId() {
    try {
      let id = localStorage.getItem(this.STORAGE_KEY);
      if (id && /^[a-z0-9]{6,32}$/.test(id)) return id;
      id = this._tirer();
      localStorage.setItem(this.STORAGE_KEY, id);
      return id;
    } catch (e) {
      return '';
    }
  },

  /** Libellé court et lisible : « Android · Chrome », « iPhone · Safari ». */
  label() {
    let ua = '';
    try { ua = navigator.userAgent || ''; } catch (e) { return 'Appareil inconnu'; }

    let systeme = 'Autre';
    if (/Android/i.test(ua)) systeme = 'Android';
    else if (/iPhone/i.test(ua)) systeme = 'iPhone';
    else if (/iPad/i.test(ua)) systeme = 'iPad';
    else if (/Windows/i.test(ua)) systeme = 'Windows';
    else if (/Mac OS X/i.test(ua)) systeme = 'Mac';
    else if (/Linux/i.test(ua)) systeme = 'Linux';

    // L'ordre compte : Edge et Opera annoncent aussi « Chrome », et Chrome
    // annonce aussi « Safari ». On teste donc du plus spécifique au plus large.
    let navig = 'Navigateur';
    if (/EdgA?\//i.test(ua)) navig = 'Edge';
    else if (/OPR\/|Opera/i.test(ua)) navig = 'Opera';
    else if (/SamsungBrowser/i.test(ua)) navig = 'Samsung';
    else if (/Firefox\//i.test(ua)) navig = 'Firefox';
    else if (/Chrome\//i.test(ua)) navig = 'Chrome';
    else if (/Safari\//i.test(ua)) navig = 'Safari';

    // L'application installée (PWA ou APK) s'ouvre hors onglet : utile à
    // distinguer d'un simple passage par le navigateur.
    let installee = false;
    try {
      installee = (window.matchMedia && window.matchMedia('(display-mode: standalone)').matches)
                  || window.navigator.standalone === true;
    } catch (e) {}

    return systeme + ' · ' + navig + (installee ? ' · app installée' : '');
  },

  /**
   * La table des appareils mise à jour pour cet appareil-ci.
   *
   * @param {Object} tableActuelle - la table lue sur le document utilisateur
   * @returns {Object|null} { table, estNouveau, elague, id }, ou null si le
   *   navigateur refuse le stockage local et qu'il n'y a donc rien à écrire
   */
  majTable(tableActuelle) {
    const id = this.getId();
    if (!id) return null;

    const table = {};
    Object.keys(tableActuelle || {}).forEach(k => {
      const e = (tableActuelle || {})[k];
      if (e && typeof e === 'object') table[k] = { p: e.p || '', f: e.f || 0, l: e.l || e.f || 0 };
    });

    const maintenant = Date.now();
    const estNouveau = !table[id];

    if (estNouveau) {
      table[id] = { p: this.label(), f: maintenant, l: maintenant };
    } else {
      table[id].l = maintenant;
      // Le libellé peut changer sans que l'appareil change : mise à jour du
      // navigateur, passage du navigateur à l'application installée.
      table[id].p = this.label();
    }

    // Élagage : on garde les plus récemment vus, en conservant toujours
    // l'appareil courant.
    let elague = false;
    const ids = Object.keys(table);
    if (ids.length > this.MAX_APPAREILS) {
      ids.sort((a, b) => (table[b].l || 0) - (table[a].l || 0));
      const aGarder = new Set(ids.slice(0, this.MAX_APPAREILS));
      aGarder.add(id);
      Object.keys(table).forEach(k => {
        if (!aGarder.has(k)) { delete table[k]; elague = true; }
      });
    }

    return { table: table, estNouveau: estNouveau, elague: elague, id: id };
  }
};

// Export global
if (typeof window !== 'undefined') {
  window.UserFields = UserFields;
  window.UserDevice = UserDevice;
}
