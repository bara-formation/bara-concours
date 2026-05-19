// Bara Concours - Module Annales (Accompagnement Final)
// Sujets des concours déjà tombés avec leurs corrections

const ANNALES = {
  // === SESSION 2025 ===
  '2025': {
    annee: 2025,
    label: 'Session 2025',
    description: 'Sujets officiels de la session 2025',
    sujets: [
      // Exemple de sujet — à enrichir progressivement
      {
        id: 'police_2025',
        concoursId: 'police',
        concoursNom: 'Police Nationale',
        sigle: 'POLICE',
        matiereId: 'cg',
        titre: 'Culture Générale — Police Nationale 2025',
        description: 'Épreuve de Culture Générale du concours direct Police Nationale, session 2025',
        nbQuestions: 5,
        difficulte: 'Moyen',
        questions: [
          {
            q: 'Combien de régions administratives compte le Burkina Faso ?',
            o: ['10', '11', '12', '13'],
            r: 3,
            x: 'Le Burkina Faso compte 13 régions administratives depuis la réforme territoriale de 2001. Chaque région est dirigée par un gouverneur. À retenir pour les concours : 13 régions, 45 provinces, 351 communes.'
          },
          {
            q: 'Qui était le président du Conseil National de la Révolution (CNR) au Burkina Faso ?',
            o: ['Maurice Yaméogo', 'Sangoulé Lamizana', 'Thomas Sankara', 'Blaise Compaoré'],
            r: 2,
            x: 'Thomas Sankara a dirigé le CNR de 1983 à 1987. Il est l\'auteur du changement de nom Haute-Volta → Burkina Faso (4 août 1984) et de nombreuses réformes sociales et économiques.'
          },
          {
            q: 'Quelle est la devise du Burkina Faso ?',
            o: ['Liberté, Égalité, Fraternité', 'Unité, Progrès, Justice', 'Travail, Famille, Patrie', 'Paix, Justice, Travail'],
            r: 1,
            x: 'La devise du Burkina Faso est "Unité - Progrès - Justice". Elle figure sur les armoiries du pays. Cette devise reflète les valeurs fondamentales de la nation burkinabè.'
          },
          {
            q: 'Le sigle ECOWAS désigne :',
            o: ['Communauté Économique d\'Afrique de l\'Ouest', 'Conseil Européen', 'Organisation des États Africains', 'Communauté du Sahel'],
            r: 0,
            x: 'ECOWAS = Economic Community of West African States, ou en français CEDEAO (Communauté Économique des États de l\'Afrique de l\'Ouest). Elle regroupe 15 pays. Note : depuis 2024, le BF, le Mali et le Niger ont annoncé leur retrait pour former l\'AES.'
          },
          {
            q: 'En quelle année le Burkina Faso a-t-il accédé à l\'indépendance ?',
            o: ['1958', '1960', '1962', '1965'],
            r: 1,
            x: 'Le pays, alors appelé Haute-Volta, a accédé à l\'indépendance le 5 août 1960. Il a été renommé Burkina Faso ("pays des hommes intègres") le 4 août 1984.'
          }
        ]
      },
      {
        id: 'professeur_ecoles_2025',
        concoursId: 'professeur_ecoles',
        concoursNom: 'Professeur des Écoles',
        sigle: 'PE',
        matiereId: 'francais',
        titre: 'Français — Professeur des Écoles 2025',
        description: 'Épreuve de Français du concours Professeur des Écoles, session 2025',
        nbQuestions: 5,
        difficulte: 'Moyen',
        questions: [
          {
            q: 'Quel est le synonyme de "véloce" ?',
            o: ['Lent', 'Rapide', 'Long', 'Difficile'],
            r: 1,
            x: 'Véloce signifie rapide. Vient du latin "velox". Le contraire est "lent". À retenir : véloce/rapide sont synonymes.'
          },
          {
            q: 'Conjugue le verbe "aller" à la 1ère personne du singulier au futur simple :',
            o: ['J\'allais', 'Je vais', 'J\'irai', 'J\'aille'],
            r: 2,
            x: 'Au futur simple, le verbe "aller" est irrégulier : j\'irai, tu iras, il/elle ira, nous irons, vous irez, ils/elles iront. Ne pas confondre avec le présent (je vais).'
          },
          {
            q: 'Quel est le pluriel du mot "cheval" ?',
            o: ['Chevals', 'Chevaux', 'Chevales', 'Cheval'],
            r: 1,
            x: 'Le pluriel de "cheval" est "chevaux". Règle générale : les noms en -al font leur pluriel en -aux (cheval → chevaux, journal → journaux). Exceptions : bal, carnaval, festival, récital (qui prennent un -s).'
          },
          {
            q: 'Dans la phrase "Les enfants jouent dans le jardin", "dans le jardin" est :',
            o: ['Un complément d\'objet direct', 'Un complément circonstanciel de lieu', 'Un attribut du sujet', 'Un complément du nom'],
            r: 1,
            x: '"Dans le jardin" indique où se déroule l\'action de jouer. C\'est donc un complément circonstanciel de lieu (CCL). Il répond à la question "où ?".'
          },
          {
            q: 'Quel est l\'antonyme de "généreux" ?',
            o: ['Aimable', 'Avare', 'Riche', 'Pauvre'],
            r: 1,
            x: 'L\'antonyme (contraire) de "généreux" est "avare". Une personne avare n\'aime pas dépenser ou donner, contrairement à une personne généreuse.'
          }
        ]
      },
      {
        id: 'ifpb_b_2025',
        concoursId: 'ifpb_cycle_b',
        concoursNom: 'IFPB CYCLE B (Trésor / Impôts / Douanes)',
        sigle: 'IFPB-B',
        matiereId: 'maths_bac',
        titre: 'Mathématiques — IFPB Cycle B 2025',
        description: 'Épreuve de Mathématiques du concours IFPB Cycle B (ex-Trésor), session 2025',
        nbQuestions: 5,
        difficulte: 'Difficile',
        questions: [
          {
            q: 'Combien font 25% de 200 ?',
            o: ['25', '40', '50', '75'],
            r: 2,
            x: '25% de 200 = 200 × 0,25 = 50. Astuce : pour calculer 25% rapidement, divise par 4 (200 ÷ 4 = 50).'
          },
          {
            q: 'Si un objet coûte 8 000 FCFA après une remise de 20%, quel était son prix initial ?',
            o: ['9 600 FCFA', '10 000 FCFA', '12 000 FCFA', '16 000 FCFA'],
            r: 1,
            x: 'Si on a appliqué -20%, le prix payé représente 80% du prix initial. Donc prix initial = 8000 ÷ 0,80 = 10 000 FCFA. Vérification : 10000 - (10000 × 0,20) = 10000 - 2000 = 8000 ✓'
          },
          {
            q: 'Quelle est la racine carrée de 144 ?',
            o: ['10', '11', '12', '14'],
            r: 2,
            x: '√144 = 12 car 12 × 12 = 144. À mémoriser : les carrés parfaits jusqu\'à 15² = 225.'
          },
          {
            q: 'Un capital de 50 000 FCFA placé à 5% pendant 2 ans donne quel intérêt simple ?',
            o: ['2 500 FCFA', '5 000 FCFA', '7 500 FCFA', '10 000 FCFA'],
            r: 1,
            x: 'Intérêt simple = Capital × Taux × Durée = 50000 × 0,05 × 2 = 5 000 FCFA. Formule à connaître absolument pour les concours du Trésor et des Impôts.'
          },
          {
            q: 'Si 3x + 5 = 20, alors x = ?',
            o: ['3', '5', '7', '15'],
            r: 1,
            x: 'Pour résoudre : 3x = 20 - 5 = 15, donc x = 15 ÷ 3 = 5. Vérification : 3(5) + 5 = 15 + 5 = 20 ✓'
          }
        ]
      }
    ]
  },

  // === SESSION 2026 (à venir, mais on prépare la structure) ===
  '2026': {
    annee: 2026,
    label: 'Session 2026',
    description: 'Sujets des concours en cours (mise à jour après les épreuves)',
    sujets: [
      // Cette section sera enrichie après le passage des concours session 2026
    ]
  }
};

// === Helpers ===
const AnnalesHelper = {
  getAllSessions() {
    return Object.values(ANNALES).sort((a, b) => b.annee - a.annee);
  },

  getSession(annee) {
    return ANNALES[annee] || null;
  },

  getSujet(annee, sujetId) {
    const session = this.getSession(annee);
    if (!session) return null;
    return session.sujets.find(s => s.id === sujetId) || null;
  },

  countSujets(annee) {
    const session = this.getSession(annee);
    return session ? session.sujets.length : 0;
  },

  countTotalSujets() {
    return Object.values(ANNALES).reduce((s, sess) => s + sess.sujets.length, 0);
  },

  // Charger les annales personnalisées (ajoutées via le tableau d'admin)
  loadCustomAnnales() {
    try {
      const custom = JSON.parse(localStorage.getItem('bara_custom_annales') || '{}');
      Object.keys(custom).forEach(annee => {
        if (!ANNALES[annee]) {
          ANNALES[annee] = {
            annee: parseInt(annee),
            label: 'Session ' + annee,
            description: 'Sujets de la session ' + annee,
            sujets: []
          };
        }
        // Fusionner les sujets custom avec ceux par défaut
        const customSujets = custom[annee] || [];
        customSujets.forEach(sujet => {
          // Vérifier s'il n'y a pas déjà ce sujet (par id)
          if (!ANNALES[annee].sujets.find(s => s.id === sujet.id)) {
            ANNALES[annee].sujets.push(sujet);
          }
        });
      });
    } catch (e) {
      console.error('[Annales] Erreur load custom :', e);
    }
  },

  saveCustomAnnale(annee, sujet) {
    try {
      const custom = JSON.parse(localStorage.getItem('bara_custom_annales') || '{}');
      if (!custom[annee]) custom[annee] = [];
      // Si l'id existe déjà, on remplace
      const idx = custom[annee].findIndex(s => s.id === sujet.id);
      if (idx >= 0) custom[annee][idx] = sujet;
      else custom[annee].push(sujet);
      localStorage.setItem('bara_custom_annales', JSON.stringify(custom));
      return true;
    } catch (e) {
      console.error('[Annales] Erreur save :', e);
      return false;
    }
  },

  deleteCustomAnnale(annee, sujetId) {
    try {
      const custom = JSON.parse(localStorage.getItem('bara_custom_annales') || '{}');
      if (custom[annee]) {
        custom[annee] = custom[annee].filter(s => s.id !== sujetId);
        localStorage.setItem('bara_custom_annales', JSON.stringify(custom));
      }
      // Aussi supprimer de l'objet en mémoire
      if (ANNALES[annee]) {
        ANNALES[annee].sujets = ANNALES[annee].sujets.filter(s => s.id !== sujetId);
      }
      return true;
    } catch (e) { return false; }
  }
};

window.ANNALES = ANNALES;
window.AnnalesHelper = AnnalesHelper;
