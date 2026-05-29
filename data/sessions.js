// Bara Concours - Module Sessions d'Accompagnement Final
// Remplace l'ancien système d'annales par concours/matière
// Structure : sessions datées, toutes matières mélangées, 4 types de questions
// Toutes les sessions sont PREMIUM

(function() {

  // ============================================
  // TYPES DE QUESTIONS SUPPORTÉS
  // ============================================
  // 'open'      : Question ouverte (réponse libre)
  //               { type: 'open', q: '...', r: 'réponse', nb: '...' }
  //
  // 'qcm3'      : QCM à 3 propositions (A/B/C), 1 bonne réponse
  //               { type: 'qcm3', q: '...', choices: ['A...', 'B...', 'C...'], r: 1, nb: '...' }
  //
  // 'qcm4'      : QCM à 4 propositions (A/B/C/D), 1 bonne réponse
  //               { type: 'qcm4', q: '...', choices: ['A...', 'B...', 'C...', 'D...'], r: 2, nb: '...' }
  //
  // 'multi'     : QCM à plusieurs bonnes réponses (3 ou 4 choix)
  //               { type: 'multi', q: '...', choices: [...], r: [0, 2], nb: '...' }

  // ============================================
  // SESSIONS DE DÉMONSTRATION (basées sur les vrais documents Bara Formation)
  // ============================================
  const DEMO_SESSIONS = [
    {
      id: 'session_2025_08_01',
      date: '2025-08-01',
      titre: 'Session du 01 août 2025',
      numero: 1,
      description: 'Accompagnement n°1 — Toutes matières (CG, Sciences, Lettres, Politique)',
      questions: [
        {
          type: 'multi',
          q: 'Lesquels sont des industries chimiques ?',
          choices: ['MABUCIG', 'SA PHOTO', 'FASOPLAST'],
          r: [0, 2],
          nb: 'Ce sont des entreprises de fabrication de produits plastiques et chimiques.'
        },
        {
          type: 'open',
          q: 'En quelle année le Capitaine Ibrahim Traoré a-t-il prêté serment ?',
          r: '21 octobre 2022',
          nb: 'C\'est la date officielle de son investiture comme Président de la Transition du Burkina Faso.'
        },
        {
          type: 'open',
          q: 'Que signifie « Dextérité » ?',
          r: 'Habileté manuelle ou mentale',
          nb: 'Une personne habile ou précise dans ses gestes ou raisonnements est dite "dextre".'
        },
        {
          type: 'open',
          q: 'Quel est le plus haut sommet du monde ?',
          r: 'L\'Everest (8 848 mètres)',
          nb: 'Il se trouve dans l\'Himalaya, à la frontière entre le Népal et la Chine.'
        },
        {
          type: 'open',
          q: 'Qui a créé la faculté de médecine de la Haute-Volta ?',
          r: 'Le Professeur Rambré Moumouni Ouiminga',
          nb: 'C\'est le Professeur Ouiminga qui a initié et mené à bien la création de cette faculté de médecine, jouant un rôle crucial dans la formation des professionnels de santé au Burkina Faso.'
        },
        {
          type: 'open',
          q: 'Date de prise du pouvoir du Capitaine Ibrahim Traoré en tant que Président de la Transition',
          r: '30 septembre 2022',
          nb: 'Il a renversé le lieutenant-colonel Paul-Henri Damiba lors d\'un coup d\'État militaire.'
        },
        {
          type: 'open',
          q: 'La philosophie post-socratique était basée sur :',
          r: 'La recherche du bonheur, la morale, l\'éthique (écoles stoïcienne, cynique, épicurienne)',
          nb: 'Après Socrate, la philosophie s\'est concentrée sur l\'art de bien vivre.'
        },
        {
          type: 'open',
          q: 'Que signifie l\'apathie ?',
          r: 'Absence d\'émotion, d\'énergie ou d\'intérêt',
          nb: 'L\'apathie est souvent un symptôme associé à des troubles psychologiques ou neurologiques.'
        },
        {
          type: 'open',
          q: 'Compléter la suite suivante : 5 - 14 - 30 - ? - 91',
          r: '55',
          nb: '+9, +16, +25… (carrés de 3, 4, 5) donc +36 → 30 + 25 = 55.'
        },
        {
          type: 'qcm3',
          q: 'Quel Burkinabè a remporté le prix Nobel en physique spatiale ?',
          choices: ['Moussa Ouattara', 'Frédéric Ouattara', 'Jean Ilboudo'],
          r: 1,
          nb: 'Il a reçu en 2023 le Prix international en sciences spatiales (ce n\'est pas un Prix Nobel officiel mais un prix de renommée mondiale).'
        },
        {
          type: 'qcm3',
          q: 'Parmi les courants littéraires du XXᵉ siècle, lequel relève de l\'exploration de l\'inconscient et du rêve ?',
          choices: ['Absurde', 'Surréalisme', 'Existentialisme'],
          r: 1,
          nb: 'Ce courant, influencé par Freud, explore les rêves, l\'inconscient et l\'imaginaire.'
        },
        {
          type: 'open',
          q: 'Nombre de députés de l\'ALT (Assemblée Législative de la Transition)',
          r: '71 députés',
          nb: 'Cela est fixé par décret au Burkina Faso pour la Transition actuelle.'
        },
        {
          type: 'qcm4',
          q: 'Combien de temps la Terre met-elle pour tourner autour du Soleil ?',
          choices: ['Une journée', '28 jours', 'Un an', 'Dix ans'],
          r: 2,
          nb: 'Cette révolution autour du Soleil détermine la durée d\'une année civile (365 jours).'
        },
        {
          type: 'open',
          q: 'Donnez les raisons du réchauffement climatique.',
          r: '• Émission de gaz à effet de serre (CO₂, CH₄)\n• Déforestation\n• Activités industrielles polluantes\n• Agriculture intensive\n• Utilisation excessive d\'énergies fossiles',
          nb: 'Le réchauffement climatique est un défi majeur de notre époque, aggravé par l\'activité humaine.'
        },
        {
          type: 'open',
          q: 'Qui est le père fondateur de la littérature africaine moderne ?',
          r: 'Chinua Achebe (1930-2013)',
          nb: 'Cet écrivain nigérian s\'est imposé grâce à son roman emblématique "Things Fall Apart" (Le Monde s\'effondre) publié en 1958, traduit en 50 langues et vendu à plus de 12 millions d\'exemplaires.'
        },
        {
          type: 'multi',
          q: 'Les raisons de l\'effondrement du bloc de l\'Est :',
          choices: ['Chute du mur de Berlin', 'L\'effondrement de l\'URSS', 'La chute des démocraties de l\'Europe de l\'Est'],
          r: [0, 1],
          nb: 'La fin du bloc de l\'Est s\'explique par l\'effondrement économique et politique de l\'URSS en 1991, précédé par la chute du Mur de Berlin en 1989, symbole fort de la fin de l\'influence soviétique en Europe.'
        },
        {
          type: 'open',
          q: 'Quelle est la contribution de l\'artisanat au PIB du Burkina Faso ?',
          r: 'Environ 30 % du PIB',
          nb: 'L\'artisanat représente une part majeure de l\'économie burkinabè, employant près de 30 % de la population active et contribuant à environ 30 % du PIB national.'
        }
      ]
    },
    {
      id: 'session_2025_08_02',
      date: '2025-08-02',
      titre: 'Session du 02 août 2025',
      numero: 2,
      description: 'Accompagnement n°2 — Sciences, ONU, Économie, Burkina',
      questions: [
        {
          type: 'multi',
          q: 'L\'osmose est un phénomène :',
          choices: ['Physique', 'Chimique', 'Biochimique', 'Biologique'],
          r: [0, 3],
          nb: 'L\'osmose est un phénomène physique (passage spontané de molécules d\'eau à travers une membrane semi-perméable) et aussi biologique (présente dans les cellules vivantes).'
        },
        {
          type: 'open',
          q: 'Qui est le secrétaire général actuel de l\'ONU ?',
          r: 'António Guterres',
          nb: 'António Guterres est le neuvième Secrétaire général de l\'ONU. Il avait initialement pris ses fonctions en 2017, puis a été reconduit pour un second mandat en juin 2021.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression "faire flèche de tout bois" ?',
          choices: [
            'Utiliser uniquement des ressources naturelles',
            'Se reposer sur ses lauriers',
            'Utiliser tous les moyens possibles pour atteindre un objectif',
            'Travailler avec du bois'
          ],
          r: 2,
          nb: 'Cette expression signifie exploiter toutes les ressources disponibles, quelles qu\'elles soient, pour réussir.'
        },
        {
          type: 'open',
          q: 'Qui a été le premier secrétaire général de l\'ONU ?',
          r: 'Trygve Lie',
          nb: 'Le Norvégien Trygve Lie a été le premier Secrétaire général de l\'ONU, il a exercé de 1946 à 1952.'
        },
        {
          type: 'qcm4',
          q: 'L\'impôt progressif concerne principalement :',
          choices: [
            'Les taxes sur la consommation',
            'Les revenus proportionnels à la capacité de paiement',
            'Les produits importés',
            'Les salaires des fonctionnaires'
          ],
          r: 1,
          nb: 'Plus une personne gagne, plus elle paie d\'impôt. Ce système favorise une certaine équité fiscale.'
        },
        {
          type: 'qcm4',
          q: 'Combien de ministres d\'État compte le gouvernement burkinabè actuel sous le MPSR II ?',
          choices: ['3', '4', '2', '5'],
          r: 0,
          nb: 'Le gouvernement de Jean Rimtalba Emmanuel Ouedraogo comprend 3 ministres d\'État.'
        },
        {
          type: 'qcm4',
          q: 'L\'adrénaline est une hormone sécrétée principalement par :',
          choices: ['Le foie', 'Les glandes surrénales', 'Le pancréas', 'La rate'],
          r: 1,
          nb: 'L\'adrénaline est produite en réponse au stress pour augmenter la vigilance et l\'énergie physique.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur de l\'œuvre intitulée La Triade du Sang ?',
          choices: ['Dramane Konaté', 'Pierre Claver Ilboudo', 'Kologo Mahamadi', 'Joseph Ki-Zerbo'],
          r: 0,
          nb: 'Cette œuvre, publiée en 2017, traite de l\'extrémisme violent et du terrorisme au Burkina Faso.'
        }
      ]
    }
  ];

  // ============================================
  // GESTIONNAIRE DES SESSIONS
  // ============================================
  const SessionsHelper = {

    // Stockage localStorage
    STORAGE_KEY: 'bara_sessions_accompagnement',
    PROGRESS_KEY: 'bara_sessions_progress',

    // Charger toutes les sessions (DEMO + custom)
    getAllSessions() {
      try {
        const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        // Fusionner : démo + custom, triées par date décroissante
        const all = [...custom, ...DEMO_SESSIONS];
        // Dédupliquer par ID (les custom écrasent les démo)
        const seen = new Set();
        const unique = [];
        all.forEach(s => {
          if (!seen.has(s.id)) {
            seen.add(s.id);
            unique.push(s);
          }
        });
        return unique.sort((a, b) => (b.date || '').localeCompare(a.date || ''));
      } catch (e) {
        return DEMO_SESSIONS;
      }
    },

    // Récupérer une session par ID
    getSession(sessionId) {
      return this.getAllSessions().find(s => s.id === sessionId);
    },

    // Sauvegarder une session custom (depuis l'admin)
    saveCustomSession(session) {
      try {
        const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const idx = custom.findIndex(s => s.id === session.id);
        if (idx >= 0) {
          custom[idx] = session;
        } else {
          custom.push(session);
        }
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(custom));
        return true;
      } catch (e) {
        console.error('Failed to save session:', e);
        return false;
      }
    },

    // Supprimer une session custom
    deleteCustomSession(sessionId) {
      try {
        const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const filtered = custom.filter(s => s.id !== sessionId);
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(filtered));
        return true;
      } catch (e) {
        return false;
      }
    },

    // Compter le total de questions
    countTotalQuestions() {
      return this.getAllSessions().reduce((sum, s) => sum + (s.questions || []).length, 0);
    },

    // === GESTION DE LA PROGRESSION DE L'UTILISATEUR ===

    // Charger la progression d'une session
    getProgress(sessionId) {
      try {
        const all = JSON.parse(localStorage.getItem(this.PROGRESS_KEY) || '{}');
        return all[sessionId] || null;
      } catch (e) {
        return null;
      }
    },

    // Sauvegarder la progression
    saveProgress(sessionId, data) {
      try {
        const all = JSON.parse(localStorage.getItem(this.PROGRESS_KEY) || '{}');
        all[sessionId] = {
          ...data,
          updatedAt: Date.now()
        };
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(all));
      } catch (e) {
        console.error('Failed to save progress:', e);
      }
    },

    // Réinitialiser la progression d'une session
    resetProgress(sessionId) {
      try {
        const all = JSON.parse(localStorage.getItem(this.PROGRESS_KEY) || '{}');
        delete all[sessionId];
        localStorage.setItem(this.PROGRESS_KEY, JSON.stringify(all));
      } catch (e) {}
    },

    // === EXPORT / IMPORT ===

    // Exporter toutes les sessions custom en JSON
    exportSessions() {
      try {
        const custom = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        return {
          version: 'v24',
          exportedAt: new Date().toISOString(),
          type: 'bara_sessions_accompagnement',
          count: custom.length,
          sessions: custom
        };
      } catch (e) {
        return null;
      }
    },

    // Importer des sessions depuis un export
    importSessions(data) {
      if (!data || data.type !== 'bara_sessions_accompagnement') {
        return { success: false, error: 'Format invalide' };
      }
      try {
        const current = JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '[]');
        const newSessions = data.sessions || [];
        const merged = [...current];
        newSessions.forEach(ns => {
          const idx = merged.findIndex(s => s.id === ns.id);
          if (idx >= 0) merged[idx] = ns;
          else merged.push(ns);
        });
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(merged));
        return { success: true, imported: newSessions.length };
      } catch (e) {
        return { success: false, error: e.message };
      }
    }
  };

  // === Export ===
  window.SessionsHelper = SessionsHelper;
  window.DEMO_SESSIONS = DEMO_SESSIONS;

})();
