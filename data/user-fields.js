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
    uid:            ['uid']
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

// Export global
if (typeof window !== 'undefined') {
  window.UserFields = UserFields;
}
