// =================================================================
// V61 : MODULE EXAMEN HEBDOMADAIRE
// =================================================================
// Examen synchronisé tous les dimanches de 19h30 à 20h30
// - 50 questions selon quotas (15 cg / 10 fr / 10 maths / 5 actu / 5 droit / 5 info)
// - Mêmes 50 questions pour tous, ordre différent par étudiant
// - Fin stricte à 20h30 (même si démarrage à 20h25 → 5 min restants)
// - Gratuit, mais résultats détaillés réservés Premium
// - Sync Firestore pour classement national
// =================================================================
const WeeklyExam = {

  // === CONFIGURATION ===
  CONFIG: {
    EXAM_DAY: 0,           // Dimanche (0=dim, 1=lun, ..., 6=sam)
    START_HOUR: 19,
    START_MINUTE: 30,
    END_HOUR: 20,
    END_MINUTE: 30,
    DURATION_MINUTES: 60,
    TOTAL_QUESTIONS: 50,
    FIRESTORE_COLLECTION: 'weeklyExams',  // Collection pour les résultats
    QUOTA: {
      cg: 15,           // Culture générale
      francais: 10,     // Français
      maths: 10,        // Maths (BEPC + BAC mélangés)
      actualite_bf: 5,  // Actualité Burkina
      droit: 5,         // Droit / citoyenneté
      informatique: 5   // Informatique / divers
    }
  },

  // === ÉTAT DE L'EXAMEN ===

  // Retourne le timestamp du début de l'examen pour le DIMANCHE de la semaine donnée
  // Si on est dimanche, retourne le créneau d'aujourd'hui
  // Si on est lun-sam, retourne le créneau du DIMANCHE PROCHAIN
  getNextExamStart(referenceDate) {
    const ref = referenceDate || new Date();
    const d = new Date(ref);
    d.setHours(this.CONFIG.START_HOUR, this.CONFIG.START_MINUTE, 0, 0);

    const dayOfWeek = d.getDay();
    if (dayOfWeek === this.CONFIG.EXAM_DAY) {
      // C'est dimanche
      // Si l'examen est passé (après 20h30), prendre dimanche prochain
      const examEnd = new Date(d);
      examEnd.setHours(this.CONFIG.END_HOUR, this.CONFIG.END_MINUTE, 0, 0);
      if (ref.getTime() > examEnd.getTime()) {
        d.setDate(d.getDate() + 7);
      }
    } else {
      // Calculer le nombre de jours jusqu'au prochain dimanche
      const daysUntilSunday = (this.CONFIG.EXAM_DAY - dayOfWeek + 7) % 7 || 7;
      d.setDate(d.getDate() + daysUntilSunday);
    }
    return d.getTime();
  },

  // Timestamp de la fin de l'examen pour un examen donné
  getExamEnd(examStart) {
    const d = new Date(examStart);
    d.setHours(this.CONFIG.END_HOUR, this.CONFIG.END_MINUTE, 0, 0);
    return d.getTime();
  },

  // Statut actuel : 'before' (avant), 'active' (pendant), 'after' (passé/clôturé)
  getCurrentStatus() {
    const now = Date.now();
    const nextStart = this.getNextExamStart();
    const startToday = this.getThisSundayStart();

    if (startToday) {
      const endToday = this.getExamEnd(startToday);
      if (now >= startToday && now < endToday) {
        return { status: 'active', examStart: startToday, examEnd: endToday };
      }
      if (now < startToday) {
        return { status: 'before', examStart: startToday, examEnd: endToday };
      }
      // Après l'examen de dimanche → prochain dimanche
      const nextSunday = this.getNextSundayAfterToday();
      return { status: 'after', examStart: nextSunday, examEnd: this.getExamEnd(nextSunday) };
    }
    // Pas dimanche aujourd'hui → on est "before" du prochain dimanche
    return { status: 'before', examStart: nextStart, examEnd: this.getExamEnd(nextStart) };
  },

  // Si aujourd'hui est dimanche, retourne le timestamp de début (peu importe l'heure)
  getThisSundayStart() {
    const now = new Date();
    if (now.getDay() !== this.CONFIG.EXAM_DAY) return null;
    const d = new Date(now);
    d.setHours(this.CONFIG.START_HOUR, this.CONFIG.START_MINUTE, 0, 0);
    return d.getTime();
  },

  // Dimanche suivant (utilisé après l'examen d'aujourd'hui)
  getNextSundayAfterToday() {
    const now = new Date();
    const d = new Date(now);
    d.setDate(d.getDate() + 7);
    d.setHours(this.CONFIG.START_HOUR, this.CONFIG.START_MINUTE, 0, 0);
    return d.getTime();
  },

  // Temps restant avant le prochain examen (en ms)
  timeUntilNext() {
    const next = this.getNextExamStart();
    return Math.max(0, next - Date.now());
  },

  // Formatter le temps restant (J / H / Min)
  formatTimeUntil(ms) {
    if (ms <= 0) return 'Maintenant !';
    const totalSeconds = Math.floor(ms / 1000);
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    if (days > 0) return `${days}j ${hours}h ${minutes}min`;
    if (hours > 0) return `${hours}h ${minutes}min`;
    return `${minutes}min`;
  },

  // Identifiant unique de l'examen (pour groupage Firestore)
  // Format : "exam_2026-06-14" (date du dimanche)
  getExamId(examStart) {
    const d = new Date(examStart);
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `exam_${y}-${m}-${day}`;
  },

  // === GÉNÉRATION DES QUESTIONS ===

  // Mappe nos "catégories d'examen" vers les matières de la banque
  getMaterialsForCategory(category) {
    switch (category) {
      case 'cg': return ['cg'];
      case 'francais': return ['francais'];
      case 'maths': return ['maths_bepc', 'maths_bac'];  // mélange BEPC + BAC
      case 'actualite_bf': return ['actualite_bf'];
      case 'droit': return ['droitconst', 'droitadmin', 'droitshumains', 'legislation'];
      case 'informatique': return ['informatique'];
      default: return [];
    }
  },

  // Tirer aléatoirement N questions d'une matière
  // Utilise un seed pour que tous les utilisateurs aient les MÊMES questions
  drawFromMaterial(materials, count, seed) {
    if (!window.QUESTIONS) return [];
    // Toutes les questions de ces matières
    const pool = [];
    materials.forEach(mat => {
      const qs = window.QUESTIONS[mat] || [];
      qs.forEach((q, idx) => {
        pool.push({ ...q, _material: mat, _origIdx: idx });
      });
    });
    if (pool.length === 0) return [];

    // Mélange déterministe avec le seed (pour que tous aient les mêmes)
    const shuffled = this._seededShuffle([...pool], seed);
    return shuffled.slice(0, Math.min(count, shuffled.length));
  },

  // Algorithme Fisher-Yates avec seed (mêmes résultats pour tous)
  _seededShuffle(array, seed) {
    let rng = this._mulberry32(seed);
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  },

  // Générateur pseudo-aléatoire avec seed (déterministe)
  _mulberry32(seed) {
    let a = seed | 0;
    return function() {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = a;
      t = Math.imul(t ^ t >>> 15, t | 1);
      t ^= t + Math.imul(t ^ t >>> 7, t | 61);
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  },

  // Hash simple d'une chaîne (pour transformer examId en seed numérique)
  _hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    return Math.abs(hash) || 1;
  },

  // Génère les 50 questions de l'examen
  // Utilise un seed basé sur l'examId → MÊMES questions pour tous
  generateExamQuestions(examStart) {
    const examId = this.getExamId(examStart);
    const baseSeed = this._hashString(examId);
    const allQuestions = [];

    Object.entries(this.CONFIG.QUOTA).forEach(([category, count], catIdx) => {
      const materials = this.getMaterialsForCategory(category);
      // Seed différent par catégorie pour varier les tirages
      const catSeed = baseSeed + catIdx * 1000;
      const drawn = this.drawFromMaterial(materials, count, catSeed);
      drawn.forEach(q => {
        allQuestions.push({ ...q, _category: category });
      });
    });

    return allQuestions;
  },

  // Mélange l'ordre PAR ÉTUDIANT (ordre différent pour chacun)
  // Utilise un seed basé sur examId + userId pour stabilité
  shuffleForUser(questions, userId, examStart) {
    const examId = this.getExamId(examStart);
    const userSeed = this._hashString(examId + '_' + (userId || 'anon_' + Date.now()));
    return this._seededShuffle([...questions], userSeed);
  },

  // === GESTION SESSION (état local) ===

  // Clé localStorage pour les examens en cours et résultats locaux
  STORAGE_KEY: 'bara_weekly_exam_state',

  getState() {
    try {
      const saved = localStorage.getItem(this.STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch(e) {}
    return { activeExam: null, results: [] };
  },

  saveState(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch(e) {}
  },

  // L'utilisateur a-t-il un examen en cours pour le dimanche actuel ?
  hasActiveExam() {
    const state = this.getState();
    if (!state.activeExam) return false;
    const status = this.getCurrentStatus();
    if (status.status !== 'active') return false;
    return state.activeExam.examStart === status.examStart;
  },

  // L'utilisateur a-t-il déjà passé l'examen de ce dimanche ?
  hasCompletedThisExam() {
    const status = this.getCurrentStatus();
    const examStartToday = status.status === 'active' ? status.examStart : this.getThisSundayStart();
    if (!examStartToday) return false;
    const state = this.getState();
    return (state.results || []).some(r => r.examStart === examStartToday);
  },

  // Démarrer l'examen
  startExam(userInfo) {
    const status = this.getCurrentStatus();
    if (status.status !== 'active') {
      return { success: false, error: 'L\'examen n\'est pas actif' };
    }
    if (this.hasCompletedThisExam()) {
      return { success: false, error: 'Tu as déjà passé l\'examen de ce dimanche' };
    }

    // Générer les questions
    const allQuestions = this.generateExamQuestions(status.examStart);
    if (allQuestions.length < 30) {  // Garde-fou : on accepte si on a au moins 30 questions
      console.warn('[V61] Pas assez de questions disponibles :', allQuestions.length);
    }

    // Mélanger pour CET utilisateur
    const userId = userInfo?.uid || userInfo?.id || 'anon_' + Date.now();
    const shuffled = this.shuffleForUser(allQuestions, userId, status.examStart);

    // Sauvegarder l'état
    const state = this.getState();
    state.activeExam = {
      examStart: status.examStart,
      examEnd: status.examEnd,
      startedAt: Date.now(),
      questions: shuffled,
      answers: {},
      currentIndex: 0,
      userId: userId
    };
    this.saveState(state);

    return { success: true, examState: state.activeExam };
  },

  // Répondre à une question (pas de retour en arrière)
  answerQuestion(qIdx, answer) {
    const state = this.getState();
    if (!state.activeExam) return { success: false };
    // Verrouiller la réponse (pas de retour arrière)
    if (state.activeExam.answers[qIdx] !== undefined) {
      return { success: false, error: 'Question déjà répondue' };
    }
    state.activeExam.answers[qIdx] = answer;
    state.activeExam.currentIndex = Math.max(state.activeExam.currentIndex, qIdx + 1);
    this.saveState(state);
    return { success: true };
  },

  // Terminer l'examen (calcule le score, sync Firestore)
  async finishExam(userInfo) {
    const state = this.getState();
    if (!state.activeExam) return { success: false, error: 'Aucun examen en cours' };

    const exam = state.activeExam;
    const questions = exam.questions || [];

    // Calcul du score
    let correctCount = 0;
    const byCategory = {};
    const detailedResults = [];

    questions.forEach((q, idx) => {
      const userAnswer = exam.answers[idx];
      const correct = q.r;  // Format Bara : .r = lettre (A/B/C/D)
      const isCorrect = userAnswer === correct;
      if (isCorrect) correctCount++;
      const cat = q._category || 'autre';
      if (!byCategory[cat]) byCategory[cat] = { correct: 0, total: 0 };
      byCategory[cat].total++;
      if (isCorrect) byCategory[cat].correct++;

      detailedResults.push({
        questionIdx: idx,
        question: q.q,
        options: { A: q.a, B: q.b, C: q.c, D: q.d },
        correctAnswer: correct,
        userAnswer: userAnswer || null,
        isCorrect,
        category: cat,
        explanation: q.e || ''
      });
    });

    const score = correctCount;
    const total = questions.length;
    const percent = total > 0 ? Math.round((correctCount / total) * 100) : 0;

    const result = {
      examStart: exam.examStart,
      examId: this.getExamId(exam.examStart),
      finishedAt: Date.now(),
      score,
      total,
      percent,
      byCategory,
      detailedResults,
      userId: exam.userId,
      // Infos pour le classement Firestore (anonymes si pas connecté)
      userInfo: {
        uid: userInfo?.uid || exam.userId,
        displayName: userInfo?.firstName ? (userInfo.firstName + ' ' + (userInfo.lastName || '')).trim() : 'Anonyme',
        city: userInfo?.ville || userInfo?.city || '',
        targetConcours: userInfo?.targetConcours || ''
      }
    };

    // Sauvegarder localement
    state.results = state.results || [];
    state.results.push(result);
    state.activeExam = null;  // L'examen est terminé
    this.saveState(state);

    // Sync Firestore (en async, pas bloquant)
    this._syncResultToFirestore(result).catch(e => {
      console.warn('[V61] Sync Firestore échouée :', e);
    });

    return { success: true, result };
  },

  // Soumettre le résultat à Firestore (collection weeklyExams)
  async _syncResultToFirestore(result) {
    if (!window.FirebaseAuth || !window.FirebaseAuth.isFirebaseReady || !window.FirebaseAuth.user) {
      console.log('[V61] Pas connecté Firebase, résultat seulement local');
      return;
    }
    try {
      const fb = window.FirebaseAuth;
      // Document : weeklyExams/{examId}/results/{userId}
      const docId = result.userInfo.uid || ('anon_' + Date.now());
      const ref = fb._fbFns.doc(fb.db, this.CONFIG.FIRESTORE_COLLECTION, result.examId + '_' + docId);
      const doc = {
        examId: result.examId,
        userId: docId,
        score: result.score,
        total: result.total,
        percent: result.percent,
        byCategory: result.byCategory,
        displayName: result.userInfo.displayName,
        city: result.userInfo.city,
        targetConcours: result.userInfo.targetConcours,
        finishedAt: result.finishedAt
      };
      await fb._fbFns.setDoc(ref, doc);
      console.log('[V61] Résultat sync Firestore OK');
    } catch (e) {
      console.warn('[V61] Erreur sync :', e);
    }
  },

  // === RÉCUPÉRATION DES RÉSULTATS LOCAUX ===

  // Tous les résultats passés de l'utilisateur
  getAllResults() {
    const state = this.getState();
    return (state.results || []).slice().sort((a, b) => b.finishedAt - a.finishedAt);
  },

  // Le dernier résultat
  getLastResult() {
    const all = this.getAllResults();
    return all[0] || null;
  },

  // === FIRESTORE - LECTURE CLASSEMENT (Premium) ===

  // Récupérer le classement pour un examen donné (Top N)
  async getRanking(examId, limit) {
    limit = limit || 100;
    if (!window.FirebaseAuth || !window.FirebaseAuth.isFirebaseReady || !window.FirebaseAuth.user) {
      return { success: false, error: 'Connexion Firebase requise', ranking: [] };
    }
    try {
      const fb = window.FirebaseAuth;
      const colRef = fb._fbFns.collection(fb.db, this.CONFIG.FIRESTORE_COLLECTION);
      const snapshot = await fb._fbFns.getDocs(colRef);
      const allResults = [];
      snapshot.forEach(doc => {
        const data = doc.data();
        if (data.examId === examId) {
          allResults.push(data);
        }
      });
      // Trier par score décroissant, puis par rapidité (finishedAt croissant)
      allResults.sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;
        return a.finishedAt - b.finishedAt;
      });

      // V62 : Calculer la position de l'utilisateur connecté
      const userId = fb.user.uid;
      const userPosition = allResults.findIndex(r => r.userId === userId);

      return {
        success: true,
        ranking: allResults.slice(0, limit),
        total: allResults.length,
        userPosition: userPosition >= 0 ? userPosition + 1 : null,
        userResult: userPosition >= 0 ? allResults[userPosition] : null
      };
    } catch (e) {
      console.error('[V61] Erreur récupération classement :', e);
      return { success: false, error: e.message, ranking: [] };
    }
  },

  // V62 : Récupérer le résultat détaillé d'un examen passé (pour correction)
  // Lit le résultat local (les détails sont stockés en local, pas Firestore)
  getResultByExamId(examId) {
    const all = this.getAllResults();
    return all.find(r => r.examId === examId) || null;
  }
};

window.WeeklyExam = WeeklyExam;
