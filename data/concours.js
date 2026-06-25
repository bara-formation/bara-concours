// Bara Concours - Base de données des concours
// Mise à jour : 17 mai 2026
// Source : Communiqué officiel N°26-00351/MSP/SG/AGRE/DOC du 13 mai 2026
// 108 concours directs officiels (programmés sur 13 jours) + concours autres canaux

const MATIERES_CATALOG = {
  // === V43 : Matière virtuelle pour les Sessions d'Accompagnement Final ===
  accompagnement_final: { nom: 'Accompagnement Final 2025', icone: '🎓', couleur: '#d97706', desc: 'Sessions Premium toutes matières mélangées' },

  // === Matières générales ===
  francais: { nom: 'Français', icone: '📝', couleur: '#0F5132', desc: 'Grammaire, conjugaison, rédaction, dissertation' },
  maths: { nom: 'Mathématiques (générique)', icone: '🔢', couleur: '#16a34a', desc: 'Mathématiques de base — utilisé en cas de niveau non précisé' },
  maths_bepc: { nom: 'Maths — BEPC', icone: '🔢', couleur: '#16a34a', desc: 'Calcul, fractions, pourcentages, géométrie élémentaire (niveau BEPC)' },
  maths_bac: { nom: 'Maths — BAC', icone: '📐', couleur: '#15803d', desc: 'Algèbre, fonctions, statistiques, probabilités (niveau BAC)' },
  maths_licence: { nom: 'Maths — Licence', icone: '∫', couleur: '#0e7d3a', desc: 'Analyse, algèbre linéaire, statistiques avancées (niveau Licence)' },
  cg: { nom: 'Culture Générale', icone: '🌍', couleur: '#1e40af', desc: 'Actualités BF, histoire, géographie, institutions' },
  actualite: { nom: 'Actualités et Institutions', icone: '📰', couleur: '#dc2626', desc: 'Actualité Burkina, AES, événements récents, institutions de la Transition' },
  histgeo: { nom: 'Histoire-Géographie', icone: '🗺️', couleur: '#dc2626', desc: 'Histoire BF, géographie mondiale' },
  svt: { nom: 'SVT (générique)', icone: '🌱', couleur: '#16a34a', desc: 'SVT — utilisé en cas de niveau non précisé' },
  svt_bepc: { nom: 'SVT — BEPC', icone: '🌱', couleur: '#16a34a', desc: 'Reproduction, alimentation, écosystèmes (niveau BEPC)' },
  svt_bac: { nom: 'SVT — BAC', icone: '🧬', couleur: '#15803d', desc: 'Génétique, immunologie, géologie (niveau BAC)' },
  svt_licence: { nom: 'SVT — Licence', icone: '🔬', couleur: '#0e7d3a', desc: 'Biochimie, biologie cellulaire, écologie avancée (niveau Licence)' },
  pc: { nom: 'Physique-Chimie (générique)', icone: '⚗️', couleur: '#0891b2', desc: 'PC — utilisé en cas de niveau non précisé' },
  pc_bepc: { nom: 'PC — BEPC', icone: '⚗️', couleur: '#0891b2', desc: 'Mécanique simple, optique, chimie élémentaire (niveau BEPC)' },
  pc_bac: { nom: 'PC — BAC', icone: '🔭', couleur: '#0c7a9e', desc: 'Mécanique, électricité, ondes, chimie organique (niveau BAC)' },
  pc_licence: { nom: 'PC — Licence', icone: '⚛️', couleur: '#0a6b8a', desc: 'Thermodynamique, électromagnétisme, chimie avancée (niveau Licence)' },
  psycho: { nom: 'Psychotechnique', icone: '🧠', couleur: '#6b21a8', desc: 'Logique, raisonnement, tests d\'aptitude' },
  legislation: { nom: 'Législation', icone: '⚖️', couleur: '#1e40af', desc: 'Code pénal, procédure, droit administratif' },
  penitentiaire: { nom: 'Sys. Pénitentiaire', icone: '🔐', couleur: '#0F5132', desc: 'Réglementation pénitentiaire' },
  police: { nom: 'Sécurité Publique', icone: '🚓', couleur: '#1e40af', desc: 'Code de la route, sécurité' },
  militaire: { nom: 'Connaissances Militaires', icone: '🎖️', couleur: '#0F5132', desc: 'Histoire militaire, grades, défense' },
  fiscalite: { nom: 'Fiscalité', icone: '💰', couleur: '#ca8a04', desc: 'TVA, impôts, code général des impôts' },
  comptabilite: { nom: 'Comptabilité', icone: '📊', couleur: '#0891b2', desc: 'Plan comptable SYSCOA, bilan' },
  pedagogie: { nom: 'Pédagogie', icone: '🎓', couleur: '#1e40af', desc: 'Didactique, méthodes d\'enseignement' },
  santepub: { nom: 'Santé Publique', icone: '⚕️', couleur: '#dc2626', desc: 'Épidémiologie, prévention, OMS' },
  anatomie: { nom: 'Anatomie-Physiologie', icone: '🫁', couleur: '#dc2626', desc: 'Corps humain, organes, systèmes' },
  environnement: { nom: 'Environnement', icone: '🌳', couleur: '#16a34a', desc: 'Écologie, code forestier, climat' },
  douane: { nom: 'Réglementation Douanière', icone: '🛂', couleur: '#1e40af', desc: 'Code des douanes, transit' },
  redaction: { nom: 'Rédaction Administrative', icone: '✉️', couleur: '#0891b2', desc: 'Lettre, note, procès-verbal' },
  informatique: { nom: 'Informatique', icone: '💻', couleur: '#6b21a8', desc: 'Bureautique, internet, sécurité' },
  agriculture: { nom: 'Agriculture & Agronomie', icone: '🌾', couleur: '#15803d', desc: 'Cultures, sols, élevage, techniques agricoles' },
  pharmacie: { nom: 'Pharmacologie', icone: '💊', couleur: '#dc2626', desc: 'Médicaments, posologie, pharmacopée' },
  laboratoire: { nom: 'Sciences de Laboratoire', icone: '🧪', couleur: '#0891b2', desc: 'Biologie, chimie, analyses, hématologie' },
  imagerie: { nom: 'Imagerie Médicale', icone: '🩻', couleur: '#9333ea', desc: 'Radiologie, échographie, scanner, IRM' },
  biomedical: { nom: 'Maintenance Biomédicale', icone: '🛠️', couleur: '#0891b2', desc: 'Équipements médicaux, électronique, dépannage' },
  nutrition: { nom: 'Nutrition & Diététique', icone: '🥗', couleur: '#16a34a', desc: 'Alimentation, équilibre nutritionnel, régimes' },
  statistique: { nom: 'Statistique', icone: '📈', couleur: '#1e40af', desc: 'Probabilités, sondages, analyse de données' },
  geniecivil: { nom: 'Génie Civil', icone: '🏗️', couleur: '#ca8a04', desc: 'Construction, BTP, matériaux, structures' },
  geometre: { nom: 'Topographie & Géomatique', icone: '📐', couleur: '#9333ea', desc: 'Cartographie, mesures, GPS, cadastre' },
  halieutique: { nom: 'Halieutique & Pêche', icone: '🐟', couleur: '#0891b2', desc: 'Pisciculture, ressources halieutiques, pêche' },
  transport: { nom: 'Transport & Logistique', icone: '🚛', couleur: '#1e40af', desc: 'Logistique, code de la route, transport' },
  secretariat: { nom: 'Secrétariat & Bureautique', icone: '📋', couleur: '#0891b2', desc: 'Classement, courrier, agenda, bureautique' },
  sciencescom: { nom: 'TIC & Communication', icone: '📡', couleur: '#6b21a8', desc: 'Informatique, réseaux, communication numérique' },
  droitadmin: { nom: 'Droit Administratif', icone: '⚖️', couleur: '#1e40af', desc: 'Service public, contentieux administratif, fonction publique' },
  droitconst: { nom: 'Droit Constitutionnel & Public', icone: '📜', couleur: '#1e3a8a', desc: 'Constitution, institutions, libertés publiques' },
  scienceadmin: { nom: 'Sciences Administratives', icone: '🏛️', couleur: '#0c4a6e', desc: 'Organisation administrative, management public' },
  finpub: { nom: 'Finances Publiques', icone: '💰', couleur: '#854d0e', desc: 'Budget, comptabilité publique, marchés publics' },
  economie: { nom: 'Économie & Développement', icone: '📊', couleur: '#15803d', desc: 'Macroéconomie, microéconomie, développement' },
  geopolitique: { nom: 'Géopolitique & Relations Internationales', icone: '🌍', couleur: '#1e40af', desc: 'Relations internationales, diplomatie, organisations' },
  sociologie: { nom: 'Sociologie', icone: '👥', couleur: '#9f1239', desc: 'Société, groupes sociaux, dynamiques sociales' },
  psychologie: { nom: 'Psychologie', icone: '🧠', couleur: '#6b21a8', desc: 'Comportement humain, psychologie clinique et sociale' },
  travailsoc: { nom: 'Travail Social & Affaires Sociales', icone: '🤝', couleur: '#9333ea', desc: 'Action sociale, protection sociale, solidarités' },
  droitshumains: { nom: 'Droits Humains', icone: '🕊️', couleur: '#0891b2', desc: 'Conventions internationales, libertés fondamentales' },
  genre: { nom: 'Genre & Égalité', icone: '⚖️', couleur: '#9333ea', desc: 'Approche genre, équité, égalité hommes-femmes' },
  rh: { nom: 'Gestion des Ressources Humaines', icone: '👔', couleur: '#0891b2', desc: 'Management, recrutement, formation, paie' },
  amenagement: { nom: 'Aménagement du Territoire', icone: '🗺️', couleur: '#15803d', desc: 'Décentralisation, urbanisme, développement local' },
  archivistique: { nom: 'Archivistique & Documentation', icone: '📚', couleur: '#854d0e', desc: 'Gestion des archives, documentation, records management' },
  journalisme: { nom: 'Journalisme & Médias', icone: '📰', couleur: '#1e40af', desc: 'Techniques journalistiques, déontologie, médias' },
  communication: { nom: 'Communication Publique', icone: '📢', couleur: '#9333ea', desc: 'Communication institutionnelle, plans de communication' },
  scieduc: { nom: 'Sciences de l\'Éducation', icone: '🎓', couleur: '#1e40af', desc: 'Pédagogie, didactique, système éducatif, planification' },
  eps: { nom: 'Éducation Physique & Sport', icone: '⚽', couleur: '#16a34a', desc: 'Activités physiques, sport, anatomie sportive' },
  emploifor: { nom: 'Emploi & Formation Professionnelle', icone: '💼', couleur: '#0891b2', desc: 'Marché du travail, formation continue, insertion' },
  diplo: { nom: 'Diplomatie', icone: '🤝', couleur: '#1e3a8a', desc: 'Protocole, négociations, conventions internationales' },
  jeunesse: { nom: 'Jeunesse & Animation', icone: '🌟', couleur: '#dc2626', desc: 'Animation socio-éducative, politiques de jeunesse' },
  orientation: { nom: 'Orientation Scolaire & Pro.', icone: '🧭', couleur: '#0891b2', desc: 'Conseil en orientation, projet personnel, métiers' },
  intendance: { nom: 'Intendance & Gestion Scolaire', icone: '📋', couleur: '#854d0e', desc: 'Gestion d\'établissement scolaire, comptabilité matière' },
  physiqueavanc: { nom: 'Physique Avancée', icone: '⚛️', couleur: '#1e40af', desc: 'Physique nucléaire, radioprotection, dosimétrie' },
  petite_enfance: { nom: 'Petite Enfance', icone: '👶', couleur: '#ec4899', desc: 'Développement de l\'enfant, éveil, pédagogie préscolaire' },
  hygiene: { nom: 'Hygiène Hospitalière', icone: '🧼', couleur: '#0891b2', desc: 'Stérilisation, désinfection, prévention infections' },
  electricite: { nom: 'Électricité & Électronique', icone: '⚡', couleur: '#f59e0b', desc: 'Circuits, électrotechnique, électromécanique' },
  bibliotheque: { nom: 'Bibliothéconomie', icone: '📖', couleur: '#854d0e', desc: 'Gestion de bibliothèque, catalogage, classification' },
  code_route: { nom: 'Code de la Route', icone: '🚗', couleur: '#dc2626', desc: 'Code de la route, mécanique automobile' },
  scoutisme: { nom: 'Action communautaire', icone: '👥', couleur: '#16a34a', desc: 'Travail communautaire, sensibilisation, animation' },
};

// === DATES D'INSCRIPTION OFFICIELLES (session 2026) ===
// Communiqué N°26-00351/MSP/SG/AGRE/DOC du 13 mai 2026
const DATES_INSCRIPTION_2026 = {
  LICENCE: { debut: '11 mai 2026 à 00h00', fin: '20 mai 2026 à 23h59', label: '11 au 20 mai 2026', dateDebutISO: '2026-05-11T00:00:00', dateFinISO: '2026-05-20T23:59:00' },
  BAC: { debut: '22 mai 2026 à 00h00', fin: '31 mai 2026 à 23h59', label: '22 au 31 mai 2026', dateDebutISO: '2026-05-22T00:00:00', dateFinISO: '2026-05-31T23:59:00' },
  BEPC: { debut: '02 juin 2026 à 00h00', fin: '11 juin 2026 à 23h59', label: '02 au 11 juin 2026', dateDebutISO: '2026-06-02T00:00:00', dateFinISO: '2026-06-11T23:59:00' },
  CEPE: { debut: '02 juin 2026 à 00h00', fin: '11 juin 2026 à 23h59', label: '02 au 11 juin 2026', dateDebutISO: '2026-06-02T00:00:00', dateFinISO: '2026-06-11T23:59:00' },
  CAP: { debut: '02 juin 2026 à 00h00', fin: '11 juin 2026 à 23h59', label: '02 au 11 juin 2026', dateDebutISO: '2026-06-02T00:00:00', dateFinISO: '2026-06-11T23:59:00' }
};

function getDatesInscription(concours) {
  if (!concours.session2026) return null;
  return DATES_INSCRIPTION_2026[concours.niveau] || DATES_INSCRIPTION_2026.BAC;
}

// === DATES D'ÉPREUVES OFFICIELLES (session 2026) — V63.27 ===
// Source : Communiqué N°26-00696/MSP/SG/AGRE du 24 juin 2026
// 13 jours de composition du 15 au 22 juillet 2026
const DATES_EPREUVES_2026 = {
  1:   { date: '15 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-15T14:00', label: 'Mer. 15 juillet 2026 (14h-15h30)' },
  2:   { date: '15 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-15T07:30', label: 'Mer. 15 juillet 2026 (7h30-9h)' },
  3:   { date: '19 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-19T07:30', label: 'Dim. 19 juillet 2026 (7h30-9h)' },
  3.5: { date: '19 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-19T14:00', label: 'Dim. 19 juillet 2026 (14h-15h30)' },
  4:   { date: '18 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-18T14:00', label: 'Sam. 18 juillet 2026 (14h-15h30)' },
  5:   { date: '18 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-18T07:30', label: 'Sam. 18 juillet 2026 (7h30-9h)' },
  6:   { date: '21 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-21T07:30', label: 'Mar. 21 juillet 2026 (7h30-9h)' },
  7:   { date: '21 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-21T14:00', label: 'Mar. 21 juillet 2026 (14h-15h30)' },
  8:   { date: '17 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-17T07:30', label: 'Ven. 17 juillet 2026 (7h30-9h)' },
  8.5: { date: '17 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-17T14:00', label: 'Ven. 17 juillet 2026 (14h-15h30)' },
  9:   { date: '20 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-20T14:00', label: 'Lun. 20 juillet 2026 (14h-15h30)' },
  10:  { date: '20 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-20T07:30', label: 'Lun. 20 juillet 2026 (7h30-9h)' },
  11:  { date: '16 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-16T07:30', label: 'Jeu. 16 juillet 2026 (7h30-9h)' },
  12:  { date: '22 juillet 2026', horaire: '14h-15h30', dateISO: '2026-07-22T14:00', label: 'Mer. 22 juillet 2026 (14h-15h30)' },
  13:  { date: '22 juillet 2026', horaire: '7h30-9h',   dateISO: '2026-07-22T07:30', label: 'Mer. 22 juillet 2026 (7h30-9h)' }
};

// V63.27 : Récupère la date d'épreuve pour un concours
function getDateEpreuve(concours) {
  if (!concours || !concours.session2026 || concours.jour === undefined) return null;
  return DATES_EPREUVES_2026[concours.jour] || null;
}

const CONCOURS = [

  // ============================================================
  // 108 CONCOURS DIRECTS OFFICIELS — SESSION 2026
  // Plateforme : www.econcours.gov.bf
  // ============================================================

  // ============== JOUR 1 ==============
  { id: 'professeur_ecoles', nom: 'Professeur des Écoles', sigle: 'PE', categorie: 'enseignement', niveau: 'BAC', postes: 200, ministere: 'Éducation Nationale', description: 'Enseignement primaire — BAC général, technologique ou professionnel', matieres: ['francais', 'maths_bac', 'cg', 'pedagogie', 'scieduc'], session2026: true, jour: 1, numeroConcours: 1 },
  { id: 'prof_ceg_maths_pc', nom: 'Professeur Certifié CEG — Maths/PC', sigle: 'PCC-M/PC', categorie: 'enseignement', niveau: 'BAC', postes: 250, ministere: 'Éducation Nationale', description: 'Professeur Certifié CEG, option Maths/PC — BAC C, D ou E', matieres: ['francais', 'maths_bac', 'pc_bac', 'pedagogie', 'scieduc'], session2026: true, jour: 1, numeroConcours: 2 },
  { id: 'prof_ceg_maths_svt', nom: 'Professeur Certifié CEG — Maths/SVT', sigle: 'PCC-M/SVT', categorie: 'enseignement', niveau: 'BAC', postes: 250, ministere: 'Éducation Nationale', description: 'Professeur Certifié CEG, option Maths/SVT — BAC C, D ou E', matieres: ['francais', 'maths_bac', 'svt_bac', 'pedagogie', 'scieduc'], session2026: true, jour: 1, numeroConcours: 3 },

  // ============== JOUR 2 ==============
  { id: 'prof_ceg_eps', nom: 'Professeur Certifié CEGT — EPS', sigle: 'PCC-EPS', categorie: 'enseignement', niveau: 'BAC', postes: 150, ministere: 'Éducation Nationale', description: 'Professeur Certifié EPS — BAC C, D', matieres: ['francais', 'eps', 'pedagogie', 'svt_bac', 'cg'], session2026: true, jour: 2, numeroConcours: 4 },
  { id: 'cons_education', nom: 'Conseiller d\'Éducation', sigle: 'CE', categorie: 'enseignement', niveau: 'LICENCE', postes: 100, ministere: 'Éducation Nationale', description: 'Suivi pédagogique et vie scolaire', matieres: ['francais', 'scieduc', 'pedagogie', 'cg', 'psychologie'], session2026: true, jour: 2, numeroConcours: 5 },
  { id: 'attache_education', nom: 'Attaché d\'Éducation', sigle: 'AE', categorie: 'enseignement', niveau: 'BAC', postes: 150, ministere: 'Éducation Nationale', description: 'Cadre intermédiaire de l\'éducation', matieres: ['francais', 'scieduc', 'pedagogie', 'cg', 'redaction'], session2026: true, jour: 2, numeroConcours: 6 },
  { id: 'cons_orientation', nom: 'Conseiller d\'Orientation Scolaire', sigle: 'COSUP', categorie: 'enseignement', niveau: 'LICENCE', postes: 20, ministere: 'Éducation Nationale', description: 'Orientation scolaire, universitaire et professionnelle', matieres: ['francais', 'orientation', 'psychologie', 'sociologie', 'scieduc'], session2026: true, jour: 2, numeroConcours: 7 },
  { id: 'tech_laboratoire_atelier', nom: 'Tech. Sup. Laboratoire (option Atelier)', sigle: 'TSLER-A', categorie: 'techniques', niveau: 'BAC', postes: 15, ministere: 'Enseignement Supérieur', description: 'Techniciens Supérieurs Laboratoire, option Atelier — BAC C/D/E/F/H', matieres: ['francais', 'laboratoire', 'pc_bac', 'maths_bac', 'electricite'], session2026: true, jour: 2, numeroConcours: 8 },
  { id: 'tech_laboratoire', nom: 'Tech. Sup. Laboratoire (option Laboratoire)', sigle: 'TSLER', categorie: 'techniques', niveau: 'BAC', postes: 15, ministere: 'Enseignement Supérieur', description: 'Techniciens Supérieurs Laboratoire, option Laboratoire — BAC C/D/E/F/H', matieres: ['francais', 'laboratoire', 'pc_bac', 'svt_bac', 'maths_bac'], session2026: true, jour: 2, numeroConcours: 9 },
  { id: 'tech_formation_pro', nom: 'Tech. Sup. en Formation Technique Pro.', sigle: 'TSFTP', categorie: 'enseignement', niveau: 'BAC', postes: 40, ministere: 'Enseignement Technique', description: 'Formateurs en enseignement technique et professionnel', matieres: ['francais', 'pedagogie', 'cg', 'maths_bac', 'redaction'], session2026: true, jour: 2, numeroConcours: 10 },
  { id: 'ing_laboratoire_atelier', nom: 'Ingénieur de Laboratoire (option Atelier)', sigle: 'ING-LAB-A', categorie: 'techniques', niveau: 'LICENCE', postes: 20, ministere: 'Enseignement Supérieur', description: 'Ingénieur Laboratoire option Atelier', matieres: ['francais', 'laboratoire', 'pc_licence', 'maths_licence', 'electricite'], session2026: true, jour: 2, numeroConcours: 11 },
  { id: 'ing_laboratoire', nom: 'Ingénieur de Laboratoire (option Laboratoire)', sigle: 'ING-LAB', categorie: 'techniques', niveau: 'LICENCE', postes: 20, ministere: 'Enseignement Supérieur', description: 'Ingénieur Laboratoire option Laboratoire', matieres: ['francais', 'laboratoire', 'pc_licence', 'svt_licence', 'maths_licence'], session2026: true, jour: 2, numeroConcours: 12 },
  { id: 'agent_formation_pro', nom: 'Agent Technique en Formation Technique Pro.', sigle: 'AT-FTP', categorie: 'enseignement', niveau: 'CAP', postes: 40, ministere: 'Enseignement Technique', description: 'Agent Technique Formation Pro. — Certificat d\'Aptitude Professionnelle', matieres: ['francais', 'pedagogie', 'maths_bepc', 'cg', 'redaction'], session2026: true, jour: 2, numeroConcours: 13 },
  { id: 'assist_droits_humains', nom: 'Assistant en Droits Humains', sigle: 'A-DH', categorie: 'administration', niveau: 'BAC', postes: 30, ministere: 'Droits Humains', description: 'Assistant aux affaires des droits humains', matieres: ['francais', 'droitshumains', 'cg', 'redaction', 'sociologie'], session2026: true, jour: 2, numeroConcours: 14 },
  { id: 'cons_droits_humains', nom: 'Conseiller en Droits Humains', sigle: 'C-DH', categorie: 'administration', niveau: 'LICENCE', postes: 10, ministere: 'Droits Humains', description: 'Promotion et protection des droits humains', matieres: ['francais', 'droitshumains', 'droitconst', 'cg', 'redaction'], session2026: true, jour: 2, numeroConcours: 15 },

  // ============== JOUR 3 ==============
  { id: 'ifpb_cycle_b', nom: 'IFPB CYCLE B (ex ENAREF Cycle B)', sigle: 'IFPB-B', categorie: 'administration', niveau: 'BAC', postes: 198, ministere: 'Économie et Finances', description: 'Contrôleurs des impôts, du trésor, des douanes (cycle B)', matieres: ['francais', 'finpub', 'economie', 'comptabilite', 'maths_bac'], session2026: true, jour: 3, numeroConcours: 16 },
  { id: 'ifpb_cycle_c', nom: 'IFPB CYCLE C (ex ENAREF Cycle C)', sigle: 'IFPB-C', categorie: 'administration', niveau: 'BEPC', postes: 192, ministere: 'Économie et Finances', description: 'Agents des impôts, du trésor, des douanes (cycle C)', matieres: ['francais', 'maths_bepc', 'cg', 'comptabilite', 'redaction'], session2026: true, jour: 3.5, numeroConcours: 17 },

  // ============== JOUR 4 ==============
  { id: 'ifpb_cycle_a', nom: 'IFPB CYCLE A (ex ENAREF Cycle A)', sigle: 'IFPB-A', categorie: 'administration', niveau: 'LICENCE', postes: 145, ministere: 'Économie et Finances', description: 'Inspecteurs des impôts, du trésor, des douanes (cycle A)', matieres: ['francais', 'finpub', 'economie', 'droitadmin', 'comptabilite'], session2026: true, jour: 4, numeroConcours: 18 },
  { id: 'assist_amenagement', nom: 'Assistant en Aménagement du Territoire', sigle: 'A-AT', categorie: 'administration', niveau: 'BAC', postes: 45, ministere: 'Administration Territoriale', description: 'Aménagement du territoire et développement local', matieres: ['francais', 'amenagement', 'cg', 'redaction', 'economie'], session2026: true, jour: 4, numeroConcours: 19 },
  { id: 'tech_statistique', nom: 'Technicien Supérieur de la Statistique', sigle: 'TSS', categorie: 'techniques', niveau: 'BAC', postes: 6, ministere: 'Économie et Finances', description: 'Collecte, analyse et publication de données — BAC C/D/E/H', matieres: ['francais', 'statistique', 'maths_bac', 'informatique', 'cg'], session2026: true, jour: 4, numeroConcours: 20 },
  { id: 'assist_eco_dev', nom: 'Assistant en Économie et Développement', sigle: 'A-ED', categorie: 'administration', niveau: 'BAC', postes: 65, ministere: 'Économie', description: 'Appui en économie et développement', matieres: ['francais', 'economie', 'cg', 'maths_bac', 'statistique'], session2026: true, jour: 4, numeroConcours: 21 },
  { id: 'cons_eco_dev', nom: 'Conseiller en Économie et Développement', sigle: 'CED', categorie: 'administration', niveau: 'LICENCE', postes: 30, ministere: 'Économie', description: 'Stratégies de développement', matieres: ['francais', 'economie', 'statistique', 'cg', 'maths_licence'], session2026: true, jour: 4, numeroConcours: 22 },
  { id: 'cons_amenagement', nom: 'Conseiller en Aménagement du Territoire', sigle: 'CAT', categorie: 'administration', niveau: 'LICENCE', postes: 48, ministere: 'Administration Territoriale', description: 'Aménagement et développement local', matieres: ['francais', 'amenagement', 'droitadmin', 'cg', 'economie'], session2026: true, jour: 4, numeroConcours: 23 },
  { id: 'cons_statistique', nom: 'Conseiller en Statistique et Analyse du Développement', sigle: 'CSAD', categorie: 'techniques', niveau: 'LICENCE', postes: 18, ministere: 'Économie', description: 'Statistique appliquée', matieres: ['francais', 'statistique', 'maths_licence', 'economie', 'informatique'], session2026: true, jour: 4, numeroConcours: 24 },

  // ============== JOUR 5 ==============
  { id: 'cons_affaires_eco', nom: 'Conseiller des Affaires Économiques', sigle: 'CAE', categorie: 'administration', niveau: 'LICENCE', postes: 55, ministere: 'Économie', description: 'Politique économique', matieres: ['francais', 'economie', 'statistique', 'cg', 'droitadmin'], session2026: true, jour: 5, numeroConcours: 25 },
  { id: 'assist_affaires_eco', nom: 'Assistant des Affaires Économiques', sigle: 'A-AE', categorie: 'administration', niveau: 'BAC', postes: 36, ministere: 'Économie', description: 'Appui aux affaires économiques', matieres: ['francais', 'economie', 'cg', 'maths_bac', 'redaction'], session2026: true, jour: 5, numeroConcours: 26 },
  { id: 'adj_affaires_eco', nom: 'Adjoint des Affaires Économiques', sigle: 'AdAE', categorie: 'administration', niveau: 'BEPC', postes: 37, ministere: 'Économie', description: 'Personnel d\'appui aux affaires économiques', matieres: ['francais', 'maths_bepc', 'cg', 'redaction', 'comptabilite'], session2026: true, jour: 5, numeroConcours: 27 },
  { id: 'cons_affaires_etrangeres', nom: 'Conseiller des Affaires Étrangères', sigle: 'CAE-MAE', categorie: 'administration', niveau: 'LICENCE', postes: 20, ministere: 'Affaires Étrangères', description: 'Diplomatie', matieres: ['francais', 'diplo', 'geopolitique', 'cg', 'droitconst'], session2026: true, jour: 5, numeroConcours: 28 },
  { id: 'secretaire_affaires_etrangeres', nom: 'Secrétaire des Affaires Étrangères', sigle: 'S-AE', categorie: 'administration', niveau: 'BAC', postes: 20, ministere: 'Affaires Étrangères', description: 'Secrétariat de la diplomatie', matieres: ['francais', 'secretariat', 'diplo', 'cg', 'redaction'], session2026: true, jour: 5, numeroConcours: 29 },
  { id: 'adjoint_chancellerie', nom: 'Adjoint de Chancellerie', sigle: 'AdC', categorie: 'administration', niveau: 'BEPC', postes: 30, ministere: 'Affaires Étrangères', description: 'Personnel d\'appui à la chancellerie', matieres: ['francais', 'maths_bepc', 'cg', 'redaction', 'secretariat'], session2026: true, jour: 5, numeroConcours: 30 },
  { id: 'agent_genie_civil', nom: 'Agent Technique en Génie Civil', sigle: 'AT-GC', categorie: 'techniques', niveau: 'BEPC', postes: 10, ministere: 'Travaux Publics', description: 'Personnel technique du BTP', matieres: ['francais', 'maths_bepc', 'geniecivil', 'cg', 'pc_bepc'], session2026: true, jour: 5, numeroConcours: 31 },
  { id: 'tech_genie_civil', nom: 'Technicien Supérieur en Génie Civil', sigle: 'TSGC', categorie: 'techniques', niveau: 'BAC', postes: 10, ministere: 'Travaux Publics', description: 'Construction, BTP — BAC C/D/E/F', matieres: ['francais', 'geniecivil', 'maths_bac', 'pc_bac', 'cg'], session2026: true, jour: 5, numeroConcours: 32 },
  { id: 'ing_genie_civil', nom: 'Ingénieur de Conception en Génie Civil', sigle: 'ING-GC', categorie: 'techniques', niveau: 'LICENCE', postes: 5, ministere: 'Travaux Publics', description: 'Conception BTP', matieres: ['francais', 'geniecivil', 'maths_licence', 'pc_licence', 'informatique'], session2026: true, jour: 5, numeroConcours: 33 },
  { id: 'ing_geometre', nom: 'Ingénieur de Conception Géomètre', sigle: 'ING-GEOM', categorie: 'techniques', niveau: 'LICENCE', postes: 5, ministere: 'Urbanisme', description: 'Conception topographique', matieres: ['francais', 'geometre', 'maths_licence', 'informatique', 'cg'], session2026: true, jour: 5, numeroConcours: 34 },
  { id: 'tech_geometre', nom: 'Technicien Supérieur Géomètre', sigle: 'TSG', categorie: 'techniques', niveau: 'BAC', postes: 10, ministere: 'Urbanisme', description: 'Topographie, cadastre — BAC C/D/E/F', matieres: ['francais', 'geometre', 'maths_bac', 'informatique', 'cg'], session2026: true, jour: 5, numeroConcours: 35 },
  { id: 'tech_transport', nom: 'Technicien Supérieur en Transport', sigle: 'TST', categorie: 'techniques', niveau: 'BAC', postes: 25, ministere: 'Transports', description: 'Gestion des transports — BAC C/D/E/F', matieres: ['francais', 'transport', 'cg', 'maths_bac', 'legislation'], session2026: true, jour: 5, numeroConcours: 36 },
  { id: 'ing_transport', nom: 'Ingénieur en Transport', sigle: 'ING-T', categorie: 'techniques', niveau: 'LICENCE', postes: 7, ministere: 'Transports', description: 'Conception transport', matieres: ['francais', 'transport', 'maths_licence', 'pc_licence', 'economie'], session2026: true, jour: 5, numeroConcours: 37 },
  { id: 'agent_transport', nom: 'Agent Technique en Transport', sigle: 'AT-T', categorie: 'techniques', niveau: 'BEPC', postes: 30, ministere: 'Transports', description: 'Personnel technique des transports', matieres: ['francais', 'maths_bepc', 'transport', 'code_route', 'cg'], session2026: true, jour: 5, numeroConcours: 38 },

  // ============== JOUR 6 ==============
  { id: 'agent_agriculture', nom: 'Agent Technique en Agriculture', sigle: 'AT-AGRI', categorie: 'techniques', niveau: 'BEPC', postes: 58, ministere: 'Agriculture', description: 'Personnel technique agricole', matieres: ['francais', 'agriculture', 'maths_bepc', 'svt_bepc', 'cg'], session2026: true, jour: 6, numeroConcours: 39 },
  { id: 'ing_agriculture', nom: 'Ingénieur en Agriculture', sigle: 'ING-AGRI', categorie: 'techniques', niveau: 'LICENCE', postes: 40, ministere: 'Agriculture', description: 'Ingénierie agricole', matieres: ['francais', 'agriculture', 'svt_licence', 'maths_licence', 'environnement'], session2026: true, jour: 6, numeroConcours: 40 },
  { id: 'tech_agriculture', nom: 'Technicien Supérieur en Agriculture', sigle: 'TSA', categorie: 'techniques', niveau: 'BAC', postes: 39, ministere: 'Agriculture', description: 'Encadrement agricole — BAC C, D ou BAC agricole', matieres: ['francais', 'agriculture', 'svt_bac', 'maths_bac', 'cg'], session2026: true, jour: 6, numeroConcours: 41 },
  { id: 'assist_agriculteurs', nom: 'Assistant en Formation des Agriculteurs', sigle: 'AFA', categorie: 'techniques', niveau: 'BAC', postes: 25, ministere: 'Agriculture', description: 'Vulgarisation agricole', matieres: ['francais', 'agriculture', 'cg', 'pedagogie', 'svt_bac'], session2026: true, jour: 6, numeroConcours: 42 },
  { id: 'agent_elevage', nom: 'Agent Technique d\'Élevage et Santé Animale', sigle: 'AT-ESA', categorie: 'techniques', niveau: 'BEPC', postes: 46, ministere: 'Ressources Animales', description: 'Personnel technique d\'élevage', matieres: ['francais', 'svt_bepc', 'agriculture', 'maths_bepc', 'cg'], session2026: true, jour: 6, numeroConcours: 43 },
  { id: 'tech_elevage', nom: 'Tech. Sup. d\'Élevage et Santé Animale', sigle: 'TSESA', categorie: 'techniques', niveau: 'BAC', postes: 30, ministere: 'Ressources Animales', description: 'Élevage et zootechnie — BAC C, D', matieres: ['francais', 'svt_bac', 'agriculture', 'anatomie', 'cg'], session2026: true, jour: 6, numeroConcours: 44 },
  { id: 'tech_environnement', nom: 'Tech. Sup. de l\'Environnement', sigle: 'TSE', categorie: 'techniques', niveau: 'BAC', postes: 20, ministere: 'Environnement', description: 'Protection environnementale — BAC C, D, E', matieres: ['francais', 'environnement', 'svt_bac', 'cg', 'legislation'], session2026: true, jour: 6, numeroConcours: 45 },
  { id: 'insp_environnement', nom: 'Inspecteur de l\'Environnement', sigle: 'IE', categorie: 'techniques', niveau: 'LICENCE', postes: 20, ministere: 'Environnement', description: 'Inspection environnementale', matieres: ['francais', 'environnement', 'svt_licence', 'droitadmin', 'cg'], session2026: true, jour: 6, numeroConcours: 46 },
  { id: 'agent_halieute', nom: 'Agent Technique Halieute', sigle: 'AT-H', categorie: 'techniques', niveau: 'BEPC', postes: 25, ministere: 'Ressources Halieutiques', description: 'Personnel technique halieutique', matieres: ['francais', 'halieutique', 'maths_bepc', 'svt_bepc', 'cg'], session2026: true, jour: 6, numeroConcours: 47 },
  { id: 'tech_halieutes', nom: 'Technicien Supérieur Halieute', sigle: 'TSH', categorie: 'techniques', niveau: 'BAC', postes: 15, ministere: 'Ressources Halieutiques', description: 'Pisciculture, halieutique — BAC C, D', matieres: ['francais', 'halieutique', 'svt_bac', 'environnement', 'cg'], session2026: true, jour: 6, numeroConcours: 48 },
  { id: 'ing_halieutes', nom: 'Ingénieur Halieute', sigle: 'ING-H', categorie: 'techniques', niveau: 'LICENCE', postes: 10, ministere: 'Ressources Halieutiques', description: 'Ingénierie halieutique', matieres: ['francais', 'halieutique', 'svt_licence', 'environnement', 'maths_licence'], session2026: true, jour: 6, numeroConcours: 49 },

  // ============== JOUR 7 ==============
  { id: 'tech_stic', nom: 'Tech. Sup. Sciences de l\'Info et Communication', sigle: 'TSSTIC', categorie: 'techniques', niveau: 'BAC', postes: 15, ministere: 'Communication', description: 'TIC et communication — BAC C/D/E/F/H', matieres: ['francais', 'sciencescom', 'informatique', 'maths_bac', 'cg'], session2026: true, jour: 7, numeroConcours: 50 },
  { id: 'agent_stic', nom: 'Agent Technique des Sciences de l\'Info et Com.', sigle: 'AT-STIC', categorie: 'techniques', niveau: 'BEPC', postes: 9, ministere: 'Communication', description: 'BEPC, CAP électricité/électrotechnique/électromécanique/informatique', matieres: ['francais', 'sciencescom', 'informatique', 'electricite', 'cg'], session2026: true, jour: 7, numeroConcours: 51 },
  { id: 'tech_genie_sanitaire', nom: 'Tech. Sup. du Génie Sanitaire', sigle: 'TSGS', categorie: 'sante', niveau: 'BAC', postes: 10, ministere: 'Santé', description: 'Hygiène publique, eau, assainissement — BAC C ou D', matieres: ['francais', 'santepub', 'environnement', 'pc_bac', 'cg'], session2026: true, jour: 7, numeroConcours: 52 },
  { id: 'tech_nutrition', nom: 'Tech. Sup. Nutrition et Diététique', sigle: 'TSND', categorie: 'sante', niveau: 'BAC', postes: 10, ministere: 'Santé', description: 'Diététique thérapeutique — BAC C ou D', matieres: ['francais', 'nutrition', 'svt_bac', 'santepub', 'anatomie'], session2026: true, jour: 7, numeroConcours: 53 },
  { id: 'tech_biomedical', nom: 'Tech. Sup. Maintenance Biomédicale Spécialisée', sigle: 'TSMB', categorie: 'sante', niveau: 'BAC', postes: 30, ministere: 'Santé', description: 'Maintenance biomédicale — BAC F1, F2, F3, E, C, D', matieres: ['francais', 'biomedical', 'pc_bac', 'maths_bac', 'electricite'], session2026: true, jour: 7, numeroConcours: 54 },
  { id: 'tech_assistance_orthophonie', nom: 'Tech. Sup. Assistance Médicale (Orthophonie)', sigle: 'TSTAM-O', categorie: 'sante', niveau: 'BAC', postes: 20, ministere: 'Santé', description: 'Technologie d\'assistance médicale option Orthophonie — BAC C, D', matieres: ['francais', 'anatomie', 'svt_bac', 'santepub', 'psychologie'], session2026: true, jour: 7, numeroConcours: 55 },
  { id: 'tech_assistance_reeducation', nom: 'Tech. Sup. Assistance Médicale (Rééducation)', sigle: 'TSTAM-R', categorie: 'sante', niveau: 'BAC', postes: 30, ministere: 'Santé', description: 'Technologie d\'assistance médicale option Rééducation — BAC C, D', matieres: ['francais', 'anatomie', 'svt_bac', 'santepub', 'eps'], session2026: true, jour: 7, numeroConcours: 56 },
  { id: 'psychotechniciens', nom: 'Psychotechnicien', sigle: 'PSY-T', categorie: 'sante', niveau: 'BAC', postes: 30, ministere: 'Santé', description: 'Tests psychotechniques — BAC A, C ou D', matieres: ['francais', 'psycho', 'psychologie', 'cg', 'maths_bac'], session2026: true, jour: 7, numeroConcours: 57 },
  { id: 'gestionnaire_sante', nom: 'Gestionnaire des Services de Santé', sigle: 'GSS', categorie: 'sante', niveau: 'BAC', postes: 60, ministere: 'Santé', description: 'Gestion administrative des services de santé', matieres: ['francais', 'santepub', 'comptabilite', 'cg', 'rh'], session2026: true, jour: 7, numeroConcours: 58 },
  { id: 'admin_services_sante', nom: 'Administrateur des Services de Santé', sigle: 'ASS', categorie: 'sante', niveau: 'LICENCE', postes: 60, ministere: 'Santé', description: 'Administration des services de santé', matieres: ['francais', 'santepub', 'droitadmin', 'cg', 'rh'], session2026: true, jour: 7, numeroConcours: 59 },

  // ============== JOUR 8 ==============
  { id: 'educateur_petite_enfance', nom: 'Éducateur de la Petite Enfance', sigle: 'EPE', categorie: 'enseignement', niveau: 'BAC', postes: 2000, ministere: 'Éducation Nationale', description: 'Éducation des jeunes enfants (le plus gros concours BAC 2026)', matieres: ['francais', 'petite_enfance', 'pedagogie', 'psychologie', 'cg'], session2026: true, jour: 8.5, numeroConcours: 60 },
  { id: 'tech_hygiene_hospitaliere', nom: 'Technicien d\'Hygiène Hospitalière', sigle: 'THH', categorie: 'sante', niveau: 'BEPC', postes: 200, ministere: 'Santé', description: 'Hygiène et stérilisation en milieu hospitalier', matieres: ['francais', 'hygiene', 'svt_bepc', 'santepub', 'cg'], session2026: true, jour: 8, numeroConcours: 61 },
  { id: 'agent_sante_communautaire', nom: 'Agent de Santé Communautaire', sigle: 'ASC', categorie: 'sante', niveau: 'BEPC', postes: 200, ministere: 'Santé', description: 'Santé de proximité, sensibilisation communautaire', matieres: ['francais', 'santepub', 'scoutisme', 'cg', 'svt_bepc'], session2026: true, jour: 8, numeroConcours: 62 },

  // ============== JOUR 9 ==============
  { id: 'infirmier', nom: 'Infirmier', sigle: 'INF', categorie: 'sante', niveau: 'BAC', postes: 150, ministere: 'Santé', description: 'Soins infirmiers', matieres: ['francais', 'svt_bac', 'anatomie', 'santepub', 'pc_bac'], session2026: true, jour: 9, numeroConcours: 63 },
  { id: 'sage_femme', nom: 'Sage-Femme', sigle: 'SF', categorie: 'sante', niveau: 'BAC', postes: 109, ministere: 'Santé', description: 'Accouchements et soins maternels', matieres: ['francais', 'svt_bac', 'anatomie', 'santepub', 'psychologie'], session2026: true, jour: 9, numeroConcours: 64 },
  { id: 'maieuticien', nom: 'Maïeuticien', sigle: 'MAI', categorie: 'sante', niveau: 'BAC', postes: 41, ministere: 'Santé', description: 'Sage-femme homme', matieres: ['francais', 'svt_bac', 'anatomie', 'santepub', 'psychologie'], session2026: true, jour: 9, numeroConcours: 65 },
  { id: 'prep_pharmacie', nom: 'Préparateur d\'État en Pharmacie', sigle: 'PEP', categorie: 'sante', niveau: 'BAC', postes: 50, ministere: 'Santé', description: 'Préparation médicamenteuse — BAC C, D', matieres: ['francais', 'pharmacie', 'pc_bac', 'svt_bac', 'santepub'], session2026: true, jour: 9, numeroConcours: 66 },
  { id: 'tech_imagerie', nom: 'Tech. Sup. en Imagerie Médicale', sigle: 'TSIM', categorie: 'sante', niveau: 'BAC', postes: 200, ministere: 'Santé', description: 'Radiologie, échographie, scanner — BAC C, D', matieres: ['francais', 'imagerie', 'pc_bac', 'anatomie', 'santepub'], session2026: true, jour: 9, numeroConcours: 67 },
  { id: 'technologistes_biomedicaux', nom: 'Technologiste Biomédical', sigle: 'TB', categorie: 'sante', niveau: 'BAC', postes: 50, ministere: 'Santé', description: 'Analyses biomédicales — BAC C, D', matieres: ['francais', 'laboratoire', 'svt_bac', 'pc_bac', 'santepub'], session2026: true, jour: 9, numeroConcours: 68 },

  // ============== JOUR 10 ==============
  { id: 'cons_rh', nom: 'Conseiller en Gestion des Ressources Humaines', sigle: 'C-RH', categorie: 'administration', niveau: 'LICENCE', postes: 30, ministere: 'Fonction Publique', description: 'Management RH public', matieres: ['francais', 'rh', 'droitadmin', 'cg', 'sociologie'], session2026: true, jour: 10, numeroConcours: 69 },
  { id: 'assist_rh', nom: 'Assistant en Gestion des Ressources Humaines', sigle: 'A-RH', categorie: 'administration', niveau: 'BAC', postes: 44, ministere: 'Fonction Publique', description: 'Appui RH', matieres: ['francais', 'rh', 'cg', 'redaction', 'secretariat'], session2026: true, jour: 10, numeroConcours: 70 },
  { id: 'adjoint_rh', nom: 'Adjoint en Gestion des Ressources Humaines', sigle: 'Ad-RH', categorie: 'administration', niveau: 'BEPC', postes: 25, ministere: 'Fonction Publique', description: 'Personnel d\'appui RH', matieres: ['francais', 'maths_bepc', 'cg', 'redaction', 'secretariat'], session2026: true, jour: 10, numeroConcours: 71 },
  { id: 'insp_travail', nom: 'Inspecteur du Travail', sigle: 'IT', categorie: 'administration', niveau: 'LICENCE', postes: 30, ministere: 'Travail', description: 'Contrôle du droit du travail', matieres: ['francais', 'emploifor', 'droitadmin', 'cg', 'sociologie'], session2026: true, jour: 10, numeroConcours: 72 },
  { id: 'controleur_travail', nom: 'Contrôleur du Travail', sigle: 'CT', categorie: 'administration', niveau: 'BAC', postes: 38, ministere: 'Travail', description: 'Contrôle d\'application du droit du travail', matieres: ['francais', 'emploifor', 'droitadmin', 'cg', 'redaction'], session2026: true, jour: 10, numeroConcours: 73 },
  { id: 'admin_civils', nom: 'Administrateur Civil', sigle: 'AC', categorie: 'administration', niveau: 'LICENCE', postes: 50, ministere: 'Fonction Publique', description: 'Hauts cadres de l\'administration civile', matieres: ['francais', 'droitadmin', 'droitconst', 'cg', 'redaction'], session2026: true, jour: 10, numeroConcours: 74 },
  { id: 'attache_administratif', nom: 'Attaché Administratif', sigle: 'AA', categorie: 'administration', niveau: 'BAC', postes: 70, ministere: 'Fonction Publique', description: 'Cadre administratif intermédiaire', matieres: ['francais', 'droitadmin', 'cg', 'redaction', 'scienceadmin'], session2026: true, jour: 10, numeroConcours: 75 },
  { id: 'adjoint_secretariat', nom: 'Adjoint de Secrétariat', sigle: 'AdS', categorie: 'administration', niveau: 'BEPC', postes: 57, ministere: 'Fonction Publique', description: 'Personnel d\'appui — BEPC ou CAP en secrétariat', matieres: ['francais', 'secretariat', 'maths_bepc', 'cg', 'redaction'], session2026: true, jour: 10, numeroConcours: 76 },
  { id: 'assist_secretariat', nom: 'Assistant de Secrétariat', sigle: 'AS', categorie: 'administration', niveau: 'BAC', postes: 51, ministere: 'Fonction Publique', description: 'Secrétariat administratif — BAC G1 ou pro secrétariat', matieres: ['francais', 'secretariat', 'redaction', 'cg', 'informatique'], session2026: true, jour: 10, numeroConcours: 77 },

  // ============== JOUR 11 ==============
  { id: 'prof_aps', nom: 'Maître des Activités Physiques et Sportives', sigle: 'MAPS', categorie: 'enseignement', niveau: 'BAC', postes: 75, ministere: 'Sports', description: 'Enseignement et encadrement sportif', matieres: ['francais', 'eps', 'anatomie', 'pedagogie', 'cg'], session2026: true, jour: 11, numeroConcours: 78 },
  { id: 'cons_emploi', nom: 'Conseiller en Emploi et Formation Professionnelle', sigle: 'CEFP', categorie: 'administration', niveau: 'LICENCE', postes: 40, ministere: 'Travail', description: 'Politique emploi', matieres: ['francais', 'emploifor', 'rh', 'cg', 'sociologie'], session2026: true, jour: 11, numeroConcours: 79 },
  { id: 'instructeur_jeunesse', nom: 'Instructeur de Jeunesse et d\'Éducation Permanente', sigle: 'IJEP', categorie: 'enseignement', niveau: 'BAC', postes: 25, ministere: 'Jeunesse', description: 'Formation socio-éducative', matieres: ['francais', 'jeunesse', 'pedagogie', 'cg', 'sociologie'], session2026: true, jour: 11, numeroConcours: 80 },
  { id: 'cons_jeunesse', nom: 'Conseiller de Jeunesse et d\'Éducation Permanente', sigle: 'CJEP', categorie: 'enseignement', niveau: 'LICENCE', postes: 10, ministere: 'Jeunesse', description: 'Politique jeunesse', matieres: ['francais', 'jeunesse', 'sociologie', 'cg', 'pedagogie'], session2026: true, jour: 11, numeroConcours: 81 },
  { id: 'animateur_jeunesse', nom: 'Animateur de Jeunesse, Emploi et Formation Pro.', sigle: 'AnJEFP', categorie: 'enseignement', niveau: 'BEPC', postes: 100, ministere: 'Jeunesse', description: 'Animation socio-éducative', matieres: ['francais', 'jeunesse', 'scoutisme', 'cg', 'maths_bepc'], session2026: true, jour: 11, numeroConcours: 82 },
  { id: 'assist_jeunesse', nom: 'Assistant de Jeunesse, Emploi et Formation Pro.', sigle: 'AsJEFP', categorie: 'enseignement', niveau: 'BAC', postes: 70, ministere: 'Jeunesse', description: 'Appui aux politiques jeunesse', matieres: ['francais', 'jeunesse', 'emploifor', 'cg', 'redaction'], session2026: true, jour: 11, numeroConcours: 83 },
  { id: 'adjoint_education_specialisee', nom: 'Adjoint en Éducation Spécialisée', sigle: 'AdES', categorie: 'enseignement', niveau: 'BEPC', postes: 15, ministere: 'Action Sociale', description: 'Appui en éducation spécialisée', matieres: ['francais', 'maths_bepc', 'psychologie', 'cg', 'travailsoc'], session2026: true, jour: 11, numeroConcours: 84 },
  { id: 'assist_education_specialisee', nom: 'Assistant en Éducation Spécialisée', sigle: 'AsES', categorie: 'enseignement', niveau: 'BAC', postes: 15, ministere: 'Action Sociale', description: 'Éducation spécialisée', matieres: ['francais', 'scieduc', 'psychologie', 'travailsoc', 'cg'], session2026: true, jour: 11, numeroConcours: 85 },
  { id: 'insp_education_specialisee', nom: 'Inspecteur d\'Éducation Spécialisée', sigle: 'IES', categorie: 'enseignement', niveau: 'LICENCE', postes: 5, ministere: 'Action Sociale', description: 'Inspection des structures spécialisées', matieres: ['francais', 'scieduc', 'psychologie', 'travailsoc', 'cg'], session2026: true, jour: 11, numeroConcours: 86 },
  { id: 'admin_affaires_sociales', nom: 'Administrateur des Affaires Sociales', sigle: 'AAS', categorie: 'administration', niveau: 'LICENCE', postes: 10, ministere: 'Action Sociale', description: 'Hauts cadres de l\'action sociale', matieres: ['francais', 'travailsoc', 'droitadmin', 'cg', 'sociologie'], session2026: true, jour: 11, numeroConcours: 87 },
  { id: 'assist_affaires_sociales', nom: 'Assistant des Affaires Sociales', sigle: 'AsAS', categorie: 'administration', niveau: 'BAC', postes: 40, ministere: 'Action Sociale', description: 'Travail social', matieres: ['francais', 'travailsoc', 'cg', 'sociologie', 'psychologie'], session2026: true, jour: 11, numeroConcours: 88 },
  { id: 'adjoint_affaires_sociales', nom: 'Adjoint des Affaires Sociales', sigle: 'AdAS', categorie: 'administration', niveau: 'BEPC', postes: 50, ministere: 'Action Sociale', description: 'Personnel d\'appui social', matieres: ['francais', 'maths_bepc', 'cg', 'travailsoc', 'redaction'], session2026: true, jour: 11, numeroConcours: 89 },
  { id: 'adjoint_prime_enfance', nom: 'Adjoint d\'encadrement de la Prime Enfance', sigle: 'AdPE', categorie: 'enseignement', niveau: 'BEPC', postes: 10, ministere: 'Action Sociale', description: 'Encadrement petite enfance', matieres: ['francais', 'petite_enfance', 'maths_bepc', 'cg', 'psychologie'], session2026: true, jour: 11, numeroConcours: 90 },
  { id: 'cons_genre', nom: 'Conseiller en Promotion du Genre', sigle: 'C-G', categorie: 'administration', niveau: 'LICENCE', postes: 5, ministere: 'Genre', description: 'Promotion du genre', matieres: ['francais', 'genre', 'sociologie', 'cg', 'droitshumains'], session2026: true, jour: 11, numeroConcours: 91 },
  { id: 'assist_genre', nom: 'Assistant en Promotion du Genre', sigle: 'A-G', categorie: 'administration', niveau: 'BAC', postes: 5, ministere: 'Genre', description: 'Appui en promotion du genre', matieres: ['francais', 'genre', 'sociologie', 'cg', 'droitshumains'], session2026: true, jour: 11, numeroConcours: 92 },
  { id: 'adjoint_archivistique', nom: 'Adjoint en Archivistique', sigle: 'AdArch', categorie: 'administration', niveau: 'BEPC', postes: 10, ministere: 'Culture', description: 'Personnel d\'appui archives', matieres: ['francais', 'archivistique', 'maths_bepc', 'cg', 'redaction'], session2026: true, jour: 11, numeroConcours: 93 },
  { id: 'adjoint_bibliotheconomie', nom: 'Adjoint en Bibliothéconomie', sigle: 'AdBibl', categorie: 'administration', niveau: 'BEPC', postes: 10, ministere: 'Culture', description: 'Personnel d\'appui bibliothèque', matieres: ['francais', 'bibliotheque', 'maths_bepc', 'cg', 'redaction'], session2026: true, jour: 11, numeroConcours: 94 },
  { id: 'adjoint_documentation', nom: 'Adjoint en Documentation', sigle: 'AdDoc', categorie: 'administration', niveau: 'BEPC', postes: 5, ministere: 'Culture', description: 'Personnel d\'appui documentation', matieres: ['francais', 'archivistique', 'maths_bepc', 'cg', 'redaction'], session2026: true, jour: 11, numeroConcours: 95 },

  // ============== JOUR 12 ==============
  { id: 'cons_communication', nom: 'Conseiller en Communication', sigle: 'C-COM', categorie: 'administration', niveau: 'LICENCE', postes: 10, ministere: 'Communication', description: 'Communication institutionnelle', matieres: ['francais', 'communication', 'cg', 'redaction', 'sciencescom'], session2026: true, jour: 12, numeroConcours: 96 },
  { id: 'cons_journalisme', nom: 'Conseiller en Journalisme', sigle: 'CJ', categorie: 'administration', niveau: 'LICENCE', postes: 10, ministere: 'Communication', description: 'Pratique journalistique', matieres: ['francais', 'journalisme', 'communication', 'cg', 'redaction'], session2026: true, jour: 12, numeroConcours: 97 },
  { id: 'assist_journalisme', nom: 'Assistant en Journalisme', sigle: 'A-J', categorie: 'administration', niveau: 'BAC', postes: 8, ministere: 'Communication', description: 'Appui journalistique', matieres: ['francais', 'journalisme', 'communication', 'cg', 'redaction'], session2026: true, jour: 12, numeroConcours: 98 },
  { id: 'assist_communication', nom: 'Assistant en Communication', sigle: 'A-C', categorie: 'administration', niveau: 'BAC', postes: 7, ministere: 'Communication', description: 'Appui communication', matieres: ['francais', 'communication', 'cg', 'redaction', 'sciencescom'], session2026: true, jour: 12, numeroConcours: 99 },
  { id: 'cons_archivistique', nom: 'Conseiller en Archivistique', sigle: 'C-ARCH', categorie: 'administration', niveau: 'LICENCE', postes: 6, ministere: 'Culture', description: 'Gestion documentaire et archivage', matieres: ['francais', 'archivistique', 'droitadmin', 'cg', 'redaction'], session2026: true, jour: 12, numeroConcours: 100 },
  { id: 'assist_archivistique', nom: 'Assistant en Archivistique', sigle: 'A-ARCH', categorie: 'administration', niveau: 'BAC', postes: 10, ministere: 'Culture', description: 'Appui archives', matieres: ['francais', 'archivistique', 'cg', 'redaction', 'informatique'], session2026: true, jour: 12, numeroConcours: 101 },
  { id: 'assist_bibliotheconomie', nom: 'Assistant en Bibliothéconomie', sigle: 'A-BIBL', categorie: 'administration', niveau: 'BAC', postes: 10, ministere: 'Culture', description: 'Appui bibliothèque', matieres: ['francais', 'bibliotheque', 'cg', 'redaction', 'informatique'], session2026: true, jour: 12, numeroConcours: 102 },

  // ============== JOUR 13 ==============
  { id: 'cons_admin_scolaire', nom: 'Conseiller d\'Administration Scolaire et Universitaire', sigle: 'CASU', categorie: 'enseignement', niveau: 'LICENCE', postes: 30, ministere: 'Éducation', description: 'Administration des établissements scolaires/universitaires', matieres: ['francais', 'scieduc', 'droitadmin', 'cg', 'rh'], session2026: true, jour: 13, numeroConcours: 103 },
  { id: 'cons_intendance', nom: 'Conseiller d\'Intendance Scolaire et Universitaire', sigle: 'CISU', categorie: 'enseignement', niveau: 'LICENCE', postes: 25, ministere: 'Éducation', description: 'Gestion matérielle et financière des établissements', matieres: ['francais', 'intendance', 'finpub', 'cg', 'comptabilite'], session2026: true, jour: 13, numeroConcours: 104 },
  { id: 'attache_admin_scolaire', nom: 'Attaché d\'Administration Scolaire et Universitaire', sigle: 'AASU', categorie: 'enseignement', niveau: 'BAC', postes: 50, ministere: 'Éducation', description: 'Cadre intermédiaire administration scolaire', matieres: ['francais', 'scieduc', 'droitadmin', 'cg', 'redaction'], session2026: true, jour: 13, numeroConcours: 105 },
  { id: 'attache_intendance', nom: 'Attaché d\'Intendance Scolaire et Universitaire', sigle: 'AISU', categorie: 'enseignement', niveau: 'BAC', postes: 35, ministere: 'Éducation', description: 'Cadre intendance scolaire', matieres: ['francais', 'intendance', 'comptabilite', 'cg', 'redaction'], session2026: true, jour: 13, numeroConcours: 106 },
  { id: 'agent_liaison', nom: 'Agent de Liaison', sigle: 'AL', categorie: 'administration', niveau: 'CEPE', postes: 180, ministere: 'Fonction Publique', description: 'Personnel de liaison administratif — CEPE', matieres: ['francais', 'cg', 'redaction', 'maths_bepc', 'secretariat'], session2026: true, jour: 13, numeroConcours: 107 },
  { id: 'chauffeur', nom: 'Chauffeur', sigle: 'CHAUFF', categorie: 'administration', niveau: 'CEPE', postes: 171, ministere: 'Fonction Publique', description: 'Chauffeur de l\'administration — CEPE + permis B, C, D, E', matieres: ['francais', 'code_route', 'transport', 'cg', 'maths_bepc'], session2026: true, jour: 13, numeroConcours: 108 },

  // ============================================================
  // CONCOURS PAR AUTRES CANAUX D'INSCRIPTION
  // (Écoles avec inscription directe, hors econcours.gov.bf)
  // ============================================================

  { id: 'police', nom: 'Police Nationale', sigle: 'POL', categorie: 'forces', niveau: 'BAC', ministere: 'Sécurité', description: 'Maintien de l\'ordre, sécurité publique — Concours direct Officiers de Police', matieres: ['francais', 'maths_bac', 'cg', 'police', 'psycho'], epreuvesPhysiques: true, autre_canal: true, canal_info: 'Inscription directe à la Direction Générale de la Police Nationale (academiedepolice.bf)' },
  { id: 'gendarmerie', nom: 'Gendarmerie Nationale', sigle: 'GEND', categorie: 'forces', niveau: 'BAC', ministere: 'Défense', description: 'Sécurité, force militaire à statut civil — Concours direct Officiers', matieres: ['francais', 'maths_bac', 'cg', 'militaire', 'psycho'], epreuvesPhysiques: true, autre_canal: true, canal_info: 'Inscription directe à l\'État-Major de la Gendarmerie' },
  { id: 'sapeurs', nom: 'Sapeurs-Pompiers', sigle: 'SP', categorie: 'forces', niveau: 'BEPC', ministere: 'Sécurité', description: 'Secours, lutte contre les incendies — Concours direct', matieres: ['francais', 'maths_bepc', 'cg', 'pc_bepc', 'psycho'], epreuvesPhysiques: true, autre_canal: true, canal_info: 'Inscription directe à la Brigade Nationale des Sapeurs-Pompiers' }
];

const CATEGORIES_CONCOURS = {
  enseignement: { nom: 'Enseignement', icone: '🎓', couleur: '#1e40af' },
  sante: { nom: 'Santé', icone: '⚕️', couleur: '#dc2626' },
  administration: { nom: 'Administration & Finances', icone: '🏛️', couleur: '#ca8a04' },
  techniques: { nom: 'Techniques & Sciences', icone: '🔬', couleur: '#6b21a8' },
  forces: { nom: 'Forces de Défense & Sécurité', icone: '🛡️', couleur: '#0F5132' }
};


// ============================================================
// === OVERRIDES PAR DÉFAUT DES MATIÈRES PAR CONCOURS
// === Modifications admin appliquées le 23/05/2026
// === Source : Export admin de Issoufou (Bara Formation)
// === Objectif : Griser les matières non encore enrichies
// === pour que les utilisateurs voient "Bientôt disponible"
// ============================================================

const DEFAULT_CONCOURS_OVERRIDES = {
  'adjoint_affaires_sociales': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'adjoint_archivistique': { added: [], removed: [], hidden: [], greyed: ['archivistique'] },
  'adjoint_chancellerie': { added: [], removed: [], hidden: [], greyed: ['secretariat'] },
  'adjoint_documentation': { added: [], removed: [], hidden: [], greyed: ['archivistique'] },
  'adjoint_education_specialisee': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'adjoint_rh': { added: [], removed: [], hidden: [], greyed: ['secretariat'] },
  'adjoint_secretariat': { added: [], removed: [], hidden: [], greyed: ['secretariat'] },
  'admin_affaires_sociales': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'admin_services_sante': { added: [], removed: [], hidden: [], greyed: ['rh'] },
  'agent_genie_civil': { added: [], removed: [], hidden: [], greyed: ['geniecivil', 'pc_bepc'] },
  'agent_halieute': { added: [], removed: [], hidden: [], greyed: [] },
  'agent_liaison': { added: [], removed: [], hidden: [], greyed: ['secretariat'] },
  'agent_sante_communautaire': { added: [], removed: [], hidden: [], greyed: ['scoutisme'] },
  'agent_stic': { added: [], removed: [], hidden: [], greyed: ['electricite', 'sciencescom'] },
  'agent_transport': { added: [], removed: [], hidden: [], greyed: ['code_route', 'transport'] },
  'animateur_jeunesse': { added: [], removed: [], hidden: [], greyed: ['scoutisme', 'jeunesse'] },
  'assist_affaires_sociales': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'assist_amenagement': { added: [], removed: [], hidden: [], greyed: ['amenagement'] },
  'assist_archivistique': { added: [], removed: [], hidden: [], greyed: ['archivistique'] },
  'assist_bibliotheconomie': { added: [], removed: [], hidden: [], greyed: [] },
  'assist_communication': { added: [], removed: [], hidden: [], greyed: ['communication', 'sciencescom'] },
  'assist_droits_humains': { added: [], removed: [], hidden: [], greyed: ['droitshumains'] },
  'assist_education_specialisee': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'assist_genre': { added: [], removed: [], hidden: [], greyed: ['droitshumains', 'genre'] },
  'assist_jeunesse': { added: [], removed: [], hidden: [], greyed: ['emploifor', 'jeunesse'] },
  'assist_journalisme': { added: [], removed: [], hidden: [], greyed: ['communication', 'journalisme'] },
  'assist_rh': { added: [], removed: [], hidden: [], greyed: ['rh', 'secretariat'] },
  'assist_secretariat': { added: [], removed: [], hidden: [], greyed: ['secretariat'] },
  'attache_administratif': { added: [], removed: [], hidden: [], greyed: ['scienceadmin'] },
  'attache_intendance': { added: [], removed: [], hidden: [], greyed: ['intendance'] },
  'chauffeur': { added: [], removed: [], hidden: [], greyed: ['code_route', 'transport'] },
  'cons_admin_scolaire': { added: [], removed: [], hidden: [], greyed: ['rh'] },
  'cons_affaires_etrangeres': { added: [], removed: [], hidden: [], greyed: ['diplo', 'geopolitique'] },
  'cons_amenagement': { added: [], removed: [], hidden: [], greyed: ['amenagement'] },
  'cons_archivistique': { added: [], removed: [], hidden: [], greyed: ['archivistique'] },
  'cons_communication': { added: [], removed: [], hidden: [], greyed: ['communication', 'sciencescom'] },
  'cons_droits_humains': { added: [], removed: [], hidden: [], greyed: ['droitshumains'] },
  'cons_emploi': { added: [], removed: [], hidden: [], greyed: ['emploifor', 'rh'] },
  'cons_genre': { added: [], removed: [], hidden: [], greyed: ['droitshumains', 'genre'] },
  'cons_intendance': { added: [], removed: [], hidden: [], greyed: ['intendance'] },
  'cons_jeunesse': { added: [], removed: [], hidden: [], greyed: ['jeunesse'] },
  'cons_journalisme': { added: [], removed: [], hidden: [], greyed: ['communication', 'journalisme'] },
  'cons_orientation': { added: [], removed: [], hidden: [], greyed: ['orientation'] },
  'cons_rh': { added: [], removed: [], hidden: [], greyed: ['rh'] },
  'cons_statistique': { added: [], removed: [], hidden: [], greyed: [] },
  'controleur_travail': { added: [], removed: [], hidden: [], greyed: ['emploifor'] },
  'gendarmerie': { added: [], removed: [], hidden: [], greyed: ['militaire'] },
  'gestionnaire_sante': { added: [], removed: [], hidden: [], greyed: ['rh'] },
  'ing_genie_civil': { added: [], removed: [], hidden: [], greyed: ['geniecivil', 'pc_licence'] },
  'ing_geometre': { added: [], removed: [], hidden: [], greyed: ['geometre'] },
  'ing_halieutes': { added: [], removed: [], hidden: [], greyed: [] },
  'ing_laboratoire': { added: [], removed: [], hidden: [], greyed: ['pc_licence', 'laboratoire'] },
  'ing_laboratoire_atelier': { added: [], removed: [], hidden: [], greyed: ['electricite', 'pc_licence', 'laboratoire'] },
  'ing_transport': { added: [], removed: [], hidden: [], greyed: ['pc_licence', 'transport'] },
  'insp_education_specialisee': { added: [], removed: [], hidden: [], greyed: ['travailsoc'] },
  'insp_travail': { added: [], removed: [], hidden: [], greyed: ['emploifor'] },
  'instructeur_jeunesse': { added: [], removed: [], hidden: [], greyed: ['jeunesse'] },
  'police': { added: [], removed: [], hidden: [], greyed: ['police'] },
  'prep_pharmacie': { added: [], removed: [], hidden: [], greyed: ['pharmacie'] },
  'prof_aps': { added: [], removed: [], hidden: [], greyed: ['eps'] },
  'prof_ceg_eps': { added: [], removed: [], hidden: [], greyed: ['eps'] },
  'sapeurs': { added: [], removed: [], hidden: [], greyed: ['pc_bepc'] },
  'secretaire_affaires_etrangeres': { added: [], removed: [], hidden: [], greyed: ['diplo', 'secretariat'] },
  'tech_assistance_reeducation': { added: [], removed: [], hidden: [], greyed: ['eps'] },
  'tech_biomedical': { added: [], removed: [], hidden: [], greyed: ['electricite', 'biomedical'] },
  'tech_genie_civil': { added: [], removed: [], hidden: [], greyed: ['geniecivil'] },
  'tech_geometre': { added: [], removed: [], hidden: [], greyed: ['geometre'] },
  'tech_halieutes': { added: [], removed: [], hidden: [], greyed: [] },
  'tech_hygiene_hospitaliere': { added: [], removed: [], hidden: [], greyed: ['hygiene'] },
  'tech_imagerie': { added: [], removed: [], hidden: [], greyed: ['imagerie'] },
  'tech_laboratoire': { added: [], removed: [], hidden: [], greyed: ['laboratoire'] },
  'tech_laboratoire_atelier': { added: [], removed: [], hidden: [], greyed: ['electricite', 'laboratoire'] },
  'tech_statistique': { added: [], removed: [], hidden: [], greyed: [] },
  'tech_stic': { added: [], removed: [], hidden: [], greyed: ['sciencescom'] },
  'tech_transport': { added: [], removed: [], hidden: [], greyed: ['transport'] },
  'technologistes_biomedicaux': { added: [], removed: [], hidden: [], greyed: ['laboratoire'] }
};

window.DEFAULT_CONCOURS_OVERRIDES = DEFAULT_CONCOURS_OVERRIDES;

// Exports pour admin.html
window.CONCOURS = CONCOURS;
window.MATIERES_CATALOG = MATIERES_CATALOG;
window.CATEGORIES_CONCOURS = CATEGORIES_CONCOURS;
window.DATES_INSCRIPTION_2026 = DATES_INSCRIPTION_2026;
window.getDatesInscription = getDatesInscription;
window.DATES_EPREUVES_2026 = DATES_EPREUVES_2026;
window.getDateEpreuve = getDateEpreuve;
window.DEFAULT_CONCOURS_OVERRIDES = DEFAULT_CONCOURS_OVERRIDES;
