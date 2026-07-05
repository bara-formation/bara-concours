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
      id: 'session_2026_06_02_1780399699124',
      date: '2025-08-01',
      titre: 'Session N°6 de août 2025',
      numero: 6,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Quelle partie du cerveau est principalement responsable de la coordination des mouvements et de l\'équilibre ?',
          choices: ['L\'hypothalamus', 'Le cervelet', 'La moelle épinière', 'Le tronc cérébral'],
          r: 1,
          nb: 'Le cervelet est la structure cérébrale dédiée à la coordination motrice, à l\'équilibre et à la posture. Il intègre les informations sensorielles (proprioception, vision, vestibule) pour affiner et coordonner les mouvements volontaires. Une lésion du cervelet provoque une ataxie (manque de coordination), des tremblements intentionnels et des troubles de l\'équilibre.'
        },
        {
          type: 'qcm4',
          q: 'Comment définit-on une « pathologie sociale » en sciences sociales ?',
          choices: ['Une maladie infectieuse transmise exclusivement par les insectes', 'Une affection cardiaque d\'origine génétique', 'Une maladie liée à une carence alimentaire', 'Un dysfonctionnement social nuisant au bien-être collectif'],
          r: 3,
          nb: 'En sciences sociales, une pathologie sociale est un dysfonctionnement social qui compromet le bien-être collectif et l\'équilibre de la société. Exemples : délinquance, corruption, violence ou exclusion sociale.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut la première femme élue à l\'Académie française, en 1980 ?',
          choices: ['Nathalie Sarraute', 'Marguerite Duras', 'Marguerite Yourcenar', 'Marguerite de Crayencour'],
          r: 2,
          nb: 'Marguerite Yourcenar (de son vrai nom Marguerite de Crayencour, 1903-1987) a été la première femme élue à l\'Académie française le 6 mars 1980, au fauteuil 3. Auteure de l\'immortel roman « Les Mémoires d\'Hadrien » (1951), cette élection historique mettait fin à trois siècles d\'exclusion des femmes de l\'Académie.'
        },
        {
          type: 'qcm4',
          q: 'Sous quel nom littéraire et historique est connue Germaine Necker, fille du banquier Jacques Necker ?',
          choices: ['Mme de Staël', 'Mme Cottin', 'Mme de Charrière', 'Mme de Sévigné'],
          r: 0,
          nb: 'Germaine Necker (1766-1817), baronne de Staël-Holstein, est connue sous le nom de Mme de Staël. Figure majeure du romantisme français, elle est l\'auteure de « De l\'Allemagne » (1813) et de « Corinne ou l\'Italie » (1807). Adversaire de Napoléon, elle a exercé une influence intellectuelle et politique considérable sur son époque.'
        },
        {
          type: 'qcm4',
          q: 'L\'anhédonie, c\'est-à-dire l\'incapacité à ressentir du plaisir, est un symptôme central de quel trouble psychiatrique ?',
          choices: ['La dépression majeure', 'La schizophrénie', 'Le trouble de la personnalité borderline', 'Le trouble du spectre autistique'],
          r: 0,
          nb: 'L\'anhédonie est l\'un des deux symptômes cardinaux de la dépression majeure (avec l\'humeur dépressive). Elle se manifeste par une incapacité à éprouver du plaisir dans des activités autrefois appréciées. Elle peut aussi apparaître dans la schizophrénie, mais reste la plus caractéristique et diagnostiquement centrale dans la dépression majeure.'
        },
        {
          type: 'qcm4',
          q: 'De quelle région d\'Europe étaient originaires les Vikings ?',
          choices: ['Les Balkans', 'La péninsule Ibérique', 'La Scandinavie', 'L\'Europe centrale'],
          r: 2,
          nb: 'Les Vikings étaient des peuples marins originaires de Scandinavie, principalement des territoires correspondant aujourd\'hui au Danemark, à la Norvège et à la Suède.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la durée du long métrage burkinabè « Katanga, la danse des scorpions » de Dani Kouyaté, Étalon d\'or au FESPACO 2025 ?',
          choices: ['113 minutes', '114 minutes', '115 minutes', '116 minutes'],
          r: 2,
          nb: '« Katanga, la danse des scorpions » du réalisateur burkinabè Dani Kouyaté dure 115 minutes. Ce film, distingué par l\'Étalon d\'or de Yennenga au FESPACO 2025, explore des thèmes politiques et culturels africains à travers une œuvre d\'une grande richesse esthétique.'
        },
        {
          type: 'qcm4',
          q: 'En orthophonie clinique, l\'anomie désigne :',
          choices: ['L\'incapacité totale à produire des sons', 'La difficulté à trouver ses mots', 'Une compréhension altérée des consignes orales', 'Un débit de parole excessivement rapide'],
          r: 1,
          nb: 'En clinique orthophonique, l\'anomie (ou anomia) est un trouble du langage caractérisé par la difficulté à retrouver les mots voulus, notamment les noms propres et communs. Elle constitue une forme d\'aphasie. À distinguer de l\'aphasie de Wernicke (compréhension altérée) et de la dysarthrie (trouble moteur).'
        },
        {
          type: 'qcm4',
          q: 'La dysarthrie est un trouble moteur de la parole causé principalement par :',
          choices: ['Un déficit cognitif global', 'Une atteinte neuromusculaire', 'Un traumatisme psychologique', 'Un trouble auditif'],
          r: 1,
          nb: 'La dysarthrie est un trouble de la parole résultant d\'une atteinte neurologique ou neuromusculaire qui affecte les muscles impliqués dans la production de la parole (articulation, phonation, respiration). Elle se distingue de l\'aphasie (trouble du langage) et du bégaiement (trouble de la fluidité).'
        },
        {
          type: 'qcm4',
          q: 'Quelles puissances européennes se disputaient la domination du bassin du Congo lors de la colonisation africaine ?',
          choices: ['Angleterre, Espagne et Allemagne', 'France, Belgique et Portugal', 'Italie, Pays-Bas et Suède', 'Russie, Autriche-Hongrie et Turquie'],
          r: 1,
          nb: 'La France (Congo français, actuelle République du Congo), la Belgique (via Léopold II puis l\'État belge pour le Congo belge, actuelle RDC) et le Portugal (Angola, au sud du bassin) étaient les principales puissances coloniales dans le bassin du Congo. La Conférence de Berlin (1884-1885) avait réglementé leur partage.'
        },
        {
          type: 'qcm4',
          q: 'Combien d\'Africains ont exercé les fonctions de Secrétaire général de l\'ONU depuis la création de l\'organisation en 1945 ?',
          choices: ['1 Africain', '2 Africains', '3 Africains', 'Aucun Africain'],
          r: 1,
          nb: 'Deux Africains ont été Secrétaires généraux de l\'ONU : Boutros Boutros-Ghali (Égypte), 6e Secrétaire général de 1992 à 1996, et Kofi Annan (Ghana), 7e Secrétaire général de 1997 à 2006, Prix Nobel de la Paix 2001. António Guterres (actuel) est Portugais, pas Africain.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année le Libéria a-t-il été fondé, devenant ainsi la première république africaine indépendante ?',
          choices: ['1820', '1830', '1847', '1865'],
          r: 2,
          nb: 'Le Libéria a été fondé le 26 juillet 1847, devenant la première république indépendante d\'Afrique. Le pays a été établi par des esclaves affranchis américains rapatriés sous l\'égide de l\'American Colonization Society. Sa capitale, Monrovia, porte le nom du président américain James Monroe.'
        },
        {
          type: 'qcm4',
          q: 'Quel organe de l\'œil est responsable de l\'accommodation, c\'est-à-dire de la mise au point selon la distance des objets ?',
          choices: ['La rétine', 'Le cristallin', 'L\'iris', 'La cornée'],
          r: 1,
          nb: 'Le cristallin est une lentille biconvexe transparente et souple, capable de modifier sa courbure grâce aux muscles ciliaires. Cette modification de forme permet de faire varier la distance focale et d\'assurer la mise au point (accommodation) selon que l\'objet est proche ou lointain. Avec l\'âge, le cristallin perd sa souplesse (presbytie).'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la plus grande île du monde ?',
          choices: ['La Nouvelle-Guinée', 'Bornéo', 'Madagascar', 'Le Groenland'],
          r: 3,
          nb: 'Le Groenland est la plus grande île du monde avec une superficie d\'environ 2,17 millions de km² (dont 80 % recouvert de glace). Bien que géographiquement proche de l\'Amérique, il est politiquement rattaché au Danemark. À ne pas confondre avec l\'Australie, qui est considérée comme un continent et non une île.'
        },
        {
          type: 'qcm4',
          q: 'En quelle date le président iranien Ebrahim Raïssi est-il décédé dans un crash d\'hélicoptère ?',
          choices: ['12 mars 2024', '19 mai 2024', '7 juillet 2024', '3 septembre 2024'],
          r: 1,
          nb: 'Ebrahim Raïssi, président de la République islamique d\'Iran, est décédé le 19 mai 2024 dans un accident d\'hélicoptère survenu dans la région montagneuse de l\'Azerbaïdjan iranien, dans des conditions de brouillard dense. Le ministre des Affaires étrangères Hossein Amir-Abdollahian est également décédé dans cet accident.'
        },
        {
          type: 'qcm4',
          q: 'Quels sont les cinq membres permanents du Conseil de sécurité de l\'ONU disposant du droit de veto ?',
          choices: ['États-Unis, France, Allemagne, Royaume-Uni et Japon', 'États-Unis, Russie, Chine, France et Royaume-Uni', 'États-Unis, Russie, Inde, Chine et Brésil', 'États-Unis, Russie, Allemagne, France et Chine'],
          r: 1,
          nb: 'Les cinq membres permanents (P5) du Conseil de sécurité de l\'ONU sont : les États-Unis, la Russie (ex-URSS), la Chine, la France et le Royaume-Uni. Ils disposent d\'un droit de veto qui leur permet de bloquer toute résolution, même approuvée par les autres membres. Ce privilège est hérité des vainqueurs de la Seconde Guerre mondiale.'
        },
        {
          type: 'qcm4',
          q: 'À quel âge Victor Hugo a-t-il reçu sa première récompense de l\'Académie française ?',
          choices: ['12 ans', '15 ans', '18 ans', '21 ans'],
          r: 1,
          nb: 'Victor Hugo (1802-1885) a reçu sa première mention de l\'Académie française à l\'âge de 15 ans, en 1817, pour un poème. L\'Académie le qualifiait de « jeune prodige ». Cet événement précoce annonçait une carrière littéraire exceptionnelle qui le mènera à l\'Académie française en 1841.'
        },
        {
          type: 'qcm4',
          q: 'Quand et où a eu lieu la première Coupe d\'Afrique des Nations (CAN) de football ?',
          choices: ['En 1954 en Égypte', 'En 1957 au Soudan', 'En 1960 en Éthiopie', 'En 1963 au Ghana'],
          r: 1,
          nb: 'La première CAN a été organisée en 1957 au Soudan (Khartoum). Seuls trois pays y ont participé : l\'Égypte, l\'Éthiopie et le Soudan. L\'Afrique du Sud était qualifiée mais exclue en raison de l\'apartheid. C\'est l\'Égypte qui a remporté ce premier tournoi. La CAN est depuis lors devenue le tournoi continental le plus suivi d\'Afrique.'
        },
        {
          type: 'qcm4',
          q: 'Qui a forgé le terme « tiers-monde » pour désigner les pays pauvres non alignés lors de la Guerre froide ?',
          choices: ['Léopold Sédar Senghor (1945)', 'Frantz Fanon (1961)', 'Alfred Sauvy (1952)', 'Jean-Paul Sartre (1964)'],
          r: 2,
          nb: 'Le terme « tiers-monde » a été créé par le démographe et économiste français Alfred Sauvy dans un article publié le 14 août 1952 dans le magazine L\'Observateur. Par analogie avec le Tiers état de la Révolution française, il désignait les pays pauvres, ni capitalistes ni communistes, qui constituaient un « troisième monde » ignoré des deux superpuissances.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année Jean-Paul Sartre a-t-il refusé le Prix Nobel de littérature ?',
          choices: ['1958', '1961', '1964', '1968'],
          r: 2,
          nb: 'Jean-Paul Sartre a refusé le Prix Nobel de littérature en 1964, invoquant son refus de toute institutionnalisation et son souhait de préserver son indépendance intellectuelle. Il expliqua que l\'écrivain doit refuser de se laisser transformer en institution, même honorifique. Ce geste reste l\'un des refus les plus célèbres dans l\'histoire du prix Nobel.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la différence principale entre un procès-verbal (PV) et un compte rendu (CR) ?',
          choices: ['Le PV résume librement une réunion ; le CR a une valeur juridique', 'Le PV est un document officiel et détaillé à valeur juridique ; le CR est une synthèse des points essentiels', 'Le PV est rédigé après une réunion informelle ; le CR après une réunion officielle', 'Il n\'y a aucune différence, les deux termes sont synonymes'],
          r: 1,
          nb: 'Le procès-verbal (PV) est un document officiel qui retranscrit fidèlement et de manière détaillée les débats, décisions et votes d\'une réunion. Il a une valeur juridique. Le compte rendu (CR) est une synthèse plus libre des points essentiels abordés, sans obligation de retranscrire tous les échanges. Le PV engage davantage que le CR.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date la Haute-Volta (Burkina Faso) a-t-elle intégré la Communauté française par référendum ?',
          choices: ['11 décembre 1958', '5 août 1960', '4 août 1984', '28 septembre 1958'],
          r: 3,
          nb: 'Le 28 septembre 1958, les populations de la Haute-Volta participèrent au référendum organisé par la France sur la Constitution de la Ve République. Le vote favorable entraîna l\'intégration de la Haute-Volta à la Communauté française. La République de Haute-Volta fut ensuite proclamée le 11 décembre 1958 avant l\'accession à l\'indépendance le 5 août 1960.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date a été créé le Fonds de Soutien Patriotique (FSP) au Burkina Faso ?',
          choices: ['4 août 2022', '11 janvier 2023', '30 septembre 2023', '1er janvier 2024'],
          r: 1,
          nb: 'Le Fonds de Soutien Patriotique (FSP) a été créé le 11 janvier 2023 au Burkina Faso sous le gouvernement de la Transition. Ce fonds a pour vocation de mobiliser des ressources financières auprès des citoyens et des entreprises pour soutenir l\'effort national de défense contre le terrorisme.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut le premier député africain élu à l\'Assemblée nationale française, en 1914 ?',
          choices: ['Félix Houphouët-Boigny', 'Léopold Sédar Senghor', 'Lamine Guèye', 'Blaise Diagne'],
          r: 3,
          nb: 'Blaise Diagne (1872-1931), originaire de Gorée (Sénégal), fut le premier Africain élu député à l\'Assemblée nationale française en 1914. Il représentait les Quatre Communes du Sénégal (Saint-Louis, Gorée, Rufisque, Dakar). Sa victoire fut un moment historique dans la représentation politique africaine au sein de la France coloniale.'
        },
        {
          type: 'qcm4',
          q: 'Quel organe de l\'œil contient les photorécepteurs (cônes et bâtonnets) chargés de percevoir la lumière et le mouvement ?',
          choices: ['La cornée', 'Le cristallin', 'L\'iris', 'La rétine'],
          r: 3,
          nb: 'La rétine est la tunique interne de l\'œil qui tapisse le fond de la cavité oculaire. Elle contient les photorécepteurs : les cônes (vision des couleurs et acuité visuelle) et les bâtonnets (vision en faible lumière et détection du mouvement). Les signaux lumineux captés sont transmis au cerveau via le nerf optique.'
        },
        {
          type: 'qcm4',
          q: 'La prévention des atteintes à l\'ordre public, avant que celles-ci se produisent, relève de quelle branche du droit administratif ?',
          choices: ['La police judiciaire', 'La police administrative', 'La police fiscale', 'La police militaire'],
          r: 1,
          nb: 'La police administrative est une activité préventive qui vise à maintenir l\'ordre public (sécurité, tranquillité, salubrité) avant que des troubles n\'interviennent. Elle s\'oppose à la police judiciaire, qui est répressive et intervient après la commission d\'une infraction pour en rechercher les auteurs.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on un animal capable de vivre à la fois en milieu terrestre et en milieu aquatique ?',
          choices: ['Un reptile', 'Un amphibien', 'Un mammifère marin', 'Un arthropode'],
          r: 1,
          nb: 'Les amphibiens (du grec amphi = des deux côtés et bios = vie) sont des vertébrés à sang froid capables de vivre dans les deux milieux : aquatique (pour la reproduction et les larves) et terrestre (pour les adultes). La grenouille, le crapaud, la salamandre et le triton en sont des exemples caractéristiques.'
        },
        {
          type: 'qcm4',
          q: 'Dans la classification française traditionnelle des arts, lequel est désigné comme le « 1er art » ?',
          choices: ['La sculpture', 'La peinture', 'La musique', 'L\'architecture'],
          r: 3,
          nb: 'Dans la classification académique française des arts, l\'architecture est désignée comme le 1er art, suivie de la sculpture (2e), la peinture (3e), la musique (4e), la littérature (5e), le théâtre (6e) et la danse (7e). Le cinéma est souvent qualifié de 7e ou 8e art selon les classifications. Cette hiérarchie reflète l\'importance culturelle historique de chaque discipline.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la limite de [2sin(x) – 1] / (6x – π) quand x tend vers π/6 ?',
          choices: ['1', '√3/3', '√3/6', '0'],
          r: 2,
          nb: 'En x = π/6 : numérateur = 2sin(π/6) – 1 = 2(1/2) – 1 = 0 et dénominateur = 6(π/6) – π = 0 (forme 0/0). Par la règle de L\'Hôpital : lim = [d/dx(2sin x – 1)] / [d/dx(6x – π)] = 2cos(x) / 6. En x = π/6 : 2cos(π/6) / 6 = 2(√3/2) / 6 = √3/6.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la limite de [ln(x² + 1) – ln(x² – 1)] quand x tend vers +∞ ?',
          choices: ['1', 'ln 2', '+∞', '0'],
          r: 3,
          nb: 'On simplifie : ln(x²+1) – ln(x²–1) = ln[(x²+1)/(x²–1)]. Quand x → +∞ : (x²+1)/(x²–1) = (1 + 1/x²)/(1 – 1/x²) → 1/1 = 1. Donc la limite est ln(1) = 0.'
        }
      ]
    },
    {
      id: 'session_2026_06_02_1780399615618',
      date: '2025-08-01',
      titre: 'Session N°5 de août 2025',
      numero: 5,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'À quel genre littéraire appartient précisément la pièce « Antigone » de Jean Anouilh, écrite en 1942 ?',
          choices: ['Le roman psychologique', 'La comédie de mœurs', 'La tragédie', 'La nouvelle historique'],
          r: 2,
          nb: '« Antigone » de Jean Anouilh (1942, représentée en 1944 sous l\'Occupation) est une tragédie moderne. Anouilh reprend le mythe antique de Sophocle et le réactualise pour questionner l\'engagement, la liberté et le pouvoir. La pièce fut interprétée à la fois comme une résistance symbolique et comme une œuvre apolitique, faisant de son ambiguïté sa force.'
        },
        {
          type: 'qcm4',
          q: 'Un condensateur de capacité C = 2 F est alimenté par une tension U = 12 V. Quelle est l\'énergie électrostatique stockée dans ce condensateur ?',
          choices: ['24 J', '72 J', '120 J', '144 J'],
          r: 3,
          nb: 'L\'énergie stockée dans un condensateur est donnée par la formule : E = ½ × C × U². Application numérique : E = ½ × 2 × 12² = ½ × 2 × 144 = 144 joules. C\'est l\'énergie accumulée dans le champ électrique entre les armatures du condensateur.'
        },
        {
          type: 'qcm4',
          q: 'Chez les eucaryotes, où s\'effectue la traduction de l\'ARN messager (ARNm) en protéine ?',
          choices: ['Dans le noyau cellulaire', 'Dans les mitochondries', 'Dans l\'appareil de Golgi', 'Dans le cytoplasme'],
          r: 3,
          nb: 'Chez les eucaryotes, la transcription (ADN → ARNm) a lieu dans le noyau. L\'ARNm est ensuite exporté vers le cytoplasme où la traduction (ARNm → protéine) s\'effectue sur les ribosomes, qu\'ils soient libres dans le cytoplasme ou associés au réticulum endoplasmique rugueux.'
        },
        {
          type: 'qcm4',
          q: 'Quel sport pratique le champion burkinabè Iron Biby, connu pour ses exploits de force athlétique ?',
          choices: ['Haltérophilie olympique', 'Log lift', 'Powerlifting', 'Lancer du poids'],
          r: 1,
          nb: 'Iron Biby (de son vrai nom Cheick Ahmed Al Hassan Sanou) est un athlète burkinabè spécialisé dans le strongman, notamment le log lift (levée de tronc chargé). Il détient des records du monde dans cette discipline et est l\'un des sportifs burkinabè les plus titrés à l\'international.'
        },
        {
          type: 'qcm4',
          q: 'Quelle fut la durée du Comité de Salut du Peuple (CSP) dirigé par Jean-Baptiste Ouédraogo au Burkina Faso ?',
          choices: ['De janvier 1980 à novembre 1982', 'De novembre 1982 à août 1983', 'De janvier 1983 à décembre 1983', 'De août 1983 à octobre 1987'],
          r: 1,
          nb: 'Le Comité de Salut du Peuple (CSP) présidé par Jean-Baptiste Ouédraogo a exercé le pouvoir de novembre 1982 à août 1983, soit environ neuf mois. Il fut renversé le 4 août 1983 par le Conseil National de la Révolution (CNR) conduit par le capitaine Thomas Sankara.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur burkinabè de l\'ouvrage juridique intitulé « Le métier du procureur » ?',
          choices: ['Hermann Yaméogo', 'Luc Marius Ibriga', 'Antoine Kaboré', 'Adama Nana'],
          r: 2,
          nb: '« Le métier du procureur » est un ouvrage rédigé par Antoine Kaboré, magistrat et procureur burkinabè. Cet ouvrage offre un éclairage précieux sur les fonctions et responsabilités du ministère public dans le système judiciaire burkinabè.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année ont eu lieu les attentats terroristes du World Trade Center aux États-Unis ?',
          choices: ['1998', '2000', '2001', '2003'],
          r: 2,
          nb: 'Les attentats du 11 septembre 2001 ont visé le World Trade Center à New York, le Pentagone à Washington et un quatrième avion s\'est écrasé en Pennsylvanie. Organisés par Al-Qaïda, ils ont causé la mort de près de 3 000 personnes et ont profondément reconfiguré la géopolitique mondiale.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la première cause de mortalité au Burkina Faso ?',
          choices: ['Le VIH/SIDA', 'Le paludisme', 'La tuberculose', 'Les maladies cardiovasculaires'],
          r: 1,
          nb: 'Le paludisme (malaria) est la principale cause de maladie et de mortalité au Burkina Faso. Endémique dans tout le pays, cette maladie parasitaire transmise par le moustique anophèle touche particulièrement les enfants de moins de cinq ans et les femmes enceintes. Elle représente une part majeure des consultations médicales.'
        },
        {
          type: 'qcm4',
          q: 'Quelle hormone, produite par le pancréas, permet de diminuer le taux de glucose dans le sang (effet hypoglycémiant) ?',
          choices: ['Le glucagon', 'L\'adrénaline', 'L\'insuline', 'Le cortisol'],
          r: 2,
          nb: 'L\'insuline est une hormone hypoglycémiante produite par les cellules bêta des îlots de Langerhans du pancréas. Elle favorise l\'absorption du glucose par les cellules (muscles, foie, tissu adipeux) et stimule sa mise en réserve sous forme de glycogène hépatique, réduisant ainsi la glycémie.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman « Les Misérables », chef-d\'œuvre de la littérature française du XIXe siècle ?',
          choices: ['Honoré de Balzac', 'Gustave Flaubert', 'Alexandre Dumas', 'Victor Hugo'],
          r: 3,
          nb: '« Les Misérables » est un roman de Victor Hugo publié en 1862. À travers le personnage de Jean Valjean, Hugo dépeint la misère sociale, l\'injustice et la rédemption dans la France du XIXe siècle. C\'est l\'une des œuvres romanesques les plus lues et adaptées au monde.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le domaine de définition de la fonction f(x) = (ln x)² / (1 – x) ?',
          choices: ['ℝ \ {0}', ']0 ; 1[ uniquement', ']0 ; 1[ ∪ ]1 ; +∞[', 'ℝ entier'],
          r: 2,
          nb: 'Deux conditions s\'imposent : (1) ln x est défini pour x > 0 ; (2) le dénominateur (1 – x) ≠ 0, donc x ≠ 1. En combinant : x > 0 et x ≠ 1. Le domaine de définition est donc Df = ]0 ; 1[ ∪ ]1 ; +∞[.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la solution du système d\'équations logarithmiques : {ln x + 3 ln y = 1 et 3 ln x – ln y = 20/3} ?',
          choices: ['x = e² et y = e', 'x = e^(21/10) et y = e^(–11/30)', 'x = e^(1/3) et y = e^(2/3)', 'x = e et y = e^(1/3)'],
          r: 1,
          nb: 'En posant a = ln x et b = ln y : {a + 3b = 1 et 3a – b = 20/3}. De la première équation : a = 1 – 3b. Substitution : 3(1 – 3b) – b = 20/3 → 3 – 10b = 20/3 → b = –11/30. Puis a = 1 + 33/30 = 21/10. Donc x = e^(21/10) et y = e^(–11/30).'
        },
        {
          type: 'qcm4',
          q: 'La fonction f(x) = 2x³ – 5x + 1 admet au moins une solution réelle dans l\'intervalle :',
          choices: ['[–2 ; 2]', '[2 ; 4]', '[–5 ; –2]', '[4 ; 8]'],
          r: 0,
          nb: 'Par le théorème des valeurs intermédiaires : f(–2) = 2(–8) – 5(–2) + 1 = –16 + 10 + 1 = –5 < 0 et f(2) = 2(8) – 5(2) + 1 = 16 – 10 + 1 = 7 > 0. Comme f est continue et change de signe, elle admet au moins une racine dans [–2 ; 2].'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteure burkinabè de l\'œuvre « Une victime innocente », dédicacée en mai 2024 à Ouagadougou ?',
          choices: ['Monique Ilboudo', 'Hadiza Sanoussi', 'Cathy Manly', 'Sophie Heidi Kam'],
          r: 2,
          nb: '« Une victime innocente » est une œuvre de Cathy Manly, auteure burkinabè, dédicacée le 16 mai 2024 à Ouagadougou. L\'œuvre interpelle les parents sur leurs responsabilités vis-à-vis de leurs enfants et dénonce certaines formes de violence à l\'encontre des mineurs.'
        },
        {
          type: 'qcm4',
          q: 'Quels pays africains ont été colonisés par le Portugal et ont accédé à l\'indépendance en 1974-1975 ?',
          choices: ['Sénégal, Mauritanie, Côte d\'Ivoire, Bénin et Cameroun', 'Angola, Mozambique, Guinée-Bissau, Cap-Vert et Sao Tomé-et-Principe', 'Nigeria, Ghana, Sierra Leone, Gambie et Libéria', 'Maroc, Tunisie, Libye, Algérie et Égypte'],
          r: 1,
          nb: 'Le Portugal a colonisé cinq pays africains qui ont accédé à l\'indépendance en 1974-1975, après la Révolution des Œillets qui a renversé le régime salazariste au Portugal : l\'Angola, le Mozambique, la Guinée-Bissau, le Cap-Vert et Sao Tomé-et-Principe.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les œuvres suivantes, laquelle N\'est PAS une œuvre de Bernadette Sanou Dao ?',
          choices: ['Quote-part et Symphonie', 'Dernière épouse', 'Les Deux Maris', 'Le Charme rompu'],
          r: 2,
          nb: '« Les Deux Maris » est une œuvre de l\'auteure burkinabè Hadiza Sanoussi, et non de Bernadette Sanou Dao. Les œuvres reconnues de Bernadette Sanou Dao incluent « Quote-part », « Symphonie », « Parturition », « Dernière épouse » et « Le Charme rompu ».'
        },
        {
          type: 'qcm4',
          q: 'Sigmund Freud est le fondateur de quelle discipline scientifique et médicale ?',
          choices: ['La métaphysique', 'La psychanalyse', 'La neurologie clinique', 'La psychiatrie institutionnelle'],
          r: 1,
          nb: 'Sigmund Freud (1856-1939) est le fondateur de la psychanalyse, méthode d\'investigation et de traitement des troubles psychiques fondée sur l\'exploration de l\'inconscient. Il a développé des concepts fondateurs comme le ça, le moi, le surmoi, le complexe d\'Œdipe et la libido.'
        },
        {
          type: 'qcm4',
          q: 'Quand s\'est tenue la 29e édition du FESPACO 2025 à Ouagadougou ?',
          choices: ['Du 22 janvier au 1er février 2025', 'Du 22 février au 1er mars 2025', 'Du 10 au 20 mars 2025', 'Du 5 au 15 avril 2025'],
          r: 1,
          nb: 'La 29e édition du FESPACO s\'est tenue du 22 février au 1er mars 2025 à Ouagadougou. Le Tchad était le pays invité d\'honneur. Ce festival biennal demeure le plus grand rendez-vous du cinéma africain et de la diaspora, avec des centaines de films en compétition.'
        },
        {
          type: 'qcm4',
          q: 'Combien de pays indépendants sont nés de la dissolution de l\'URSS en 1991 ?',
          choices: ['10 pays', '12 pays', '15 pays', '18 pays'],
          r: 2,
          nb: 'La dissolution de l\'URSS le 25 décembre 1991 a donné naissance à 15 États indépendants : Russie, Ukraine, Biélorussie, Moldavie, Géorgie, Arménie, Azerbaïdjan, Kazakhstan, Kirghizstan, Ouzbékistan, Tadjikistan, Turkménistan, Lituanie, Lettonie et Estonie.'
        },
        {
          type: 'qcm4',
          q: 'Sur combien de pays le fleuve Niger s\'écoule-t-il directement (en traversant leur territoire) ?',
          choices: ['3 pays', '4 pays', '5 pays', '7 pays'],
          r: 2,
          nb: 'Le fleuve Niger traverse directement 5 pays : la Guinée (où il prend sa source dans le Fouta Djalon), le Mali (Bamako, Tombouctou), le Niger (Niamey), le Bénin (brièvement à sa frontière) et le Nigeria (où il se jette dans le golfe de Guinée). Son bassin versant total s\'étend sur 10 pays.'
        },
        {
          type: 'qcm4',
          q: 'Combien de membres compte le BRICS après son élargissement de 2025 ?',
          choices: ['5 membres', '7 membres', '9 membres', '11 membres'],
          r: 3,
          nb: 'Le BRICS comptait initialement 5 membres fondateurs (Brésil, Russie, Inde, Chine, Afrique du Sud). En 2024 et 2025, six nouveaux membres ont rejoint le groupe : l\'Égypte, l\'Éthiopie, l\'Indonésie, l\'Iran, l\'Arabie saoudite et les Émirats arabes unis. Le BRICS compte désormais 11 membres.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le nom du personnage principal du roman « Germinal » d\'Émile Zola ?',
          choices: ['Jacques Lantier', 'Étienne Lantier', 'Gervaise Macquart', 'Claude Lantier'],
          r: 1,
          nb: 'Étienne Lantier est le héros de « Germinal » (1885), roman d\'Émile Zola appartenant au cycle des Rougon-Macquart. Ce jeune ouvrier mineur symbolise la lutte du prolétariat contre la bourgeoisie capitaliste dans les mines du nord de la France au XIXe siècle.'
        },
        {
          type: 'qcm4',
          q: 'Quel mouvement littéraire du XIXe siècle valorise avant tout les émotions, les sentiments subjectifs et la communion avec la nature ?',
          choices: ['Le surréalisme', 'Le réalisme', 'L\'absurde', 'Le romantisme'],
          r: 3,
          nb: 'Le romantisme est le mouvement littéraire et artistique dominant du XIXe siècle (1820-1860). Il valorise les émotions intenses, la sensibilité subjective, la nature comme reflet de l\'âme, l\'exotisme et le passé historique. Ses représentants majeurs incluent Victor Hugo, Lamartine, Chateaubriand (France) et Goethe (Allemagne).'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville allemande se sont tenus les procès des criminels de guerre nazis après la Seconde Guerre mondiale ?',
          choices: ['Berlin', 'Munich', 'Potsdam', 'Nuremberg'],
          r: 3,
          nb: 'Les procès de Nuremberg (novembre 1945 – octobre 1946) ont jugé 24 hauts dirigeants nazis devant le Tribunal militaire international. Nuremberg a été choisie symboliquement car c\'était la ville des congrès du parti nazi. Ces procès ont jeté les bases du droit international pénal et du concept de crime contre l\'humanité.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les objets suivants, lequel est l\'intrus : voiture – lampe – chaise – table ?',
          choices: ['La lampe', 'La chaise', 'La voiture', 'La table'],
          r: 2,
          nb: 'La voiture est l\'intrus car c\'est un moyen de transport. La lampe, la chaise et la table sont des objets d\'intérieur ou du mobilier, appartenant à la même catégorie fonctionnelle. Ce type de question d\'intrus par catégorie est fréquent dans les épreuves de raisonnement logique des concours.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est l\'unité de mesure de la vergence d\'une lentille optique ?',
          choices: ['Le mètre (m)', 'La dioptrie (δ)', 'Le newton (N)', 'Le lumen (lm)'],
          r: 1,
          nb: 'La vergence d\'une lentille (notée V) mesure sa capacité à faire converger ou diverger les rayons lumineux. Elle s\'exprime en dioptries (δ) et est l\'inverse de la distance focale en mètres : V = 1/f. Une lentille convergente a une vergence positive, une divergente a une vergence négative.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le 10e élément du tableau périodique des éléments ?',
          choices: ['Sodium (Na)', 'Néon (Ne)', 'Azote (N)', 'Magnésium (Mg)'],
          r: 1,
          nb: 'Le néon (Ne) est l\'élément de numéro atomique Z = 10. C\'est un gaz noble (groupe 18), incolore, inerte chimiquement et peu abondant dans l\'atmosphère terrestre. Il est utilisé dans les enseignes lumineuses, les lasers et la cryogénie. Les 10 premiers éléments sont H, He, Li, Be, B, C, N, O, F, Ne.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on la variation de la vitesse d\'un corps par rapport au temps ?',
          choices: ['L\'inertie', 'L\'accélération', 'La vitesse moyenne', 'La masse'],
          r: 1,
          nb: 'L\'accélération est la grandeur physique qui mesure la variation de la vitesse d\'un corps par unité de temps. Elle s\'exprime en m/s² (mètres par seconde carrée). Une accélération positive indique une augmentation de la vitesse, une accélération négative (décélération) une diminution. Elle est liée à la force par la 2e loi de Newton : F = ma.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le 25e élément du tableau périodique des éléments ?',
          choices: ['Fer (Fe)', 'Chrome (Cr)', 'Manganèse (Mn)', 'Cobalt (Co)'],
          r: 2,
          nb: 'Le manganèse (Mn) est l\'élément chimique de numéro atomique Z = 25. C\'est un métal de transition gris-blanc, dur et cassant, principalement utilisé dans la fabrication de l\'acier (comme agent désoxydant et pour améliorer la résistance). Il entre aussi dans la composition des batteries.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est l\'énergie physique associée à la position d\'un corps dans un champ gravitationnel ?',
          choices: ['L\'énergie cinétique', 'L\'énergie thermique', 'L\'énergie potentielle de pesanteur', 'L\'énergie nucléaire'],
          r: 2,
          nb: 'L\'énergie potentielle de pesanteur (ou gravitationnelle) est l\'énergie liée à la position d\'un corps dans un champ de gravité. Elle est donnée par la formule : Ep = m × g × h, où m est la masse, g l\'accélération gravitationnelle (≈ 9,8 m/s²) et h la hauteur par rapport à une référence. Elle se convertit en énergie cinétique lors de la chute.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le symbole chimique du tungstène dans le tableau périodique ?',
          choices: ['Tu', 'Tg', 'W', 'Ts'],
          r: 2,
          nb: 'Le symbole du tungstène est W, qui vient de « Wolfram », son ancien nom allemand. Le tungstène (numéro atomique 74) possède le point de fusion le plus élevé de tous les éléments (3 422°C), ce qui le rend indispensable pour les filaments d\'ampoules et les outils de coupe à haute température.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la limite de la fonction f(x) = (1/2)x⁵ – x² – 2 quand x tend vers –∞ ?',
          choices: ['+∞', '0', '–2', '–∞'],
          r: 3,
          nb: 'Pour une fonction polynomiale, la limite en ±∞ est déterminée par le terme de plus haut degré. Ici, le terme dominant est (1/2)x⁵. Lorsque x → –∞, x⁵ → –∞ (exposant impair), et (1/2)(–∞) = –∞. La limite de f(x) est donc –∞.'
        },
        {
          type: 'qcm4',
          q: 'Quelle invention est associée au chimiste et industriel suédois Alfred Nobel ?',
          choices: ['Le téléphone', 'La dynamite', 'La pénicilline', 'La locomotive à vapeur'],
          r: 1,
          nb: 'Alfred Nobel (1833-1896) a inventé la dynamite en 1867, en stabilisant la nitroglycérine avec de la diatomite (kieselguhr). Cette invention lui valut fortune et controverses. Tourmenté par les usages militaires de ses découvertes, il légua sa fortune pour créer les Prix Nobel décernés annuellement depuis 1901.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la définition correcte de la bioéthique ?',
          choices: ['L\'étude des comportements des animaux en milieu naturel', 'Une branche de la biologie spécialisée dans les organismes marins', 'La recherche des normes éthiques applicables aux sciences de la vie et de la santé', 'L\'ensemble des techniques de conservation des espèces en voie de disparition'],
          r: 2,
          nb: 'La bioéthique est une discipline interdisciplinaire qui s\'intéresse aux questions morales et éthiques soulevées par les progrès en biologie, médecine et biotechnologie. Elle vise à encadrer les pratiques médicales et scientifiques pour protéger la dignité humaine, les droits des patients et le respect du vivant.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les sites suivants, lequel abrite un mausolée classé au patrimoine mondial de l\'UNESCO ?',
          choices: ['La Tour Eiffel (France)', 'Le Taj Mahal (Inde)', 'La Grande Muraille (Chine)', 'Le Colisée (Italie)'],
          r: 1,
          nb: 'Le Taj Mahal, situé à Agra en Inde, est un mausolée construit entre 1632 et 1653 par l\'empereur moghol Shah Jahan en mémoire de son épouse Mumtaz Mahal. Inscrit au patrimoine mondial de l\'UNESCO en 1983, il est considéré comme l\'un des plus beaux exemples de l\'architecture moghole et de l\'art islamique.'
        },
        {
          type: 'qcm4',
          q: 'Lorsqu\'une espèce chimique est fabriquée en laboratoire pour être identique à son équivalent naturel, on dit qu\'elle est :',
          choices: ['Naturelle', 'Artificielle', 'Synthétique', 'Transgénique'],
          r: 2,
          nb: 'Une molécule est dite synthétique lorsqu\'elle est produite par synthèse chimique en laboratoire mais possède la même structure, les mêmes propriétés et la même formule qu\'une molécule naturelle. C\'est différent d\'une molécule artificielle (qui n\'existe pas dans la nature) ou transgénique (issue de la transgenèse).'
        },
        {
          type: 'qcm4',
          q: 'Que désigne le terme biologique « panmixie » ?',
          choices: ['La reproduction par clonage dans une population', 'Un accouplement aléatoire dans une population', 'La sélection sexuelle basée sur des critères précis', 'La reproduction asexuée par mitose'],
          r: 1,
          nb: 'La panmixie désigne un mode de reproduction dans lequel les individus d\'une population s\'accouplent au hasard, sans sélection préférentielle. C\'est une condition théorique de la génétique des populations (loi de Hardy-Weinberg). En réalité, des facteurs comme la sélection sexuelle, la proximité géographique et les préférences individuelles s\'y opposent.'
        },
        {
          type: 'qcm4',
          q: 'Combien de vecteurs de base définissent un repère de l\'espace vectoriel ℝ³ ?',
          choices: ['2 vecteurs', '3 vecteurs', '4 vecteurs', 'Une infinité de vecteurs'],
          r: 1,
          nb: 'Un repère de ℝ³ est défini par 3 vecteurs linéairement indépendants (une base) et un point origine. Ces 3 vecteurs permettent d\'exprimer tout vecteur de l\'espace comme combinaison linéaire. La base canonique de ℝ³ est (i, j, k), correspondant aux directions des axes x, y et z.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la fraction du patrimoine génétique partagé entre deux cousins germains (issus de frères et sœurs) ?',
          choices: ['1/16', '1/8', '1/4', '1/2'],
          r: 1,
          nb: 'Deux cousins germains (enfants de frères et sœurs) partagent en moyenne 1/8 de leur patrimoine génétique, soit 12,5 %. Ce coefficient de parenté est utilisé en génétique pour évaluer le risque de maladies récessives dans les unions consanguines. Pour comparaison, des frères et sœurs partagent 1/2 de leurs gènes.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'adjectif « huppé » dans la langue française ?',
          choices: ['Qui est timide et réservé dans ses relations sociales', 'Qui est riche, aisé et appartient à un milieu social élevé', 'Qui est agressif et facilement irritable', 'Qui est instruit et cultivé intellectuellement'],
          r: 1,
          nb: 'L\'adjectif « huppé » désigne une personne ou un lieu appartenant à la classe sociale aisée ou aristocratique. Il évoque le luxe, le raffinement et le prestige. L\'image vient du terme désignant la huppe (touffe de plumes sur la tête de certains oiseaux), symbole de distinction. Ex. : « un restaurant huppé », « une clientèle huppée ».'
        },
        {
          type: 'qcm4',
          q: 'Pour que la solution de l\'équation différentielle y\' + qy = 0 tende vers zéro quand x → +∞, quelle doit être la valeur de q ?',
          choices: ['q = 0', 'q < 0', 'q > 0', 'q peut être quelconque'],
          r: 2,
          nb: 'L\'équation différentielle y\' + qy = 0 a pour solution générale y = C × e^(–qx). Pour que cette solution tende vers 0 quand x → +∞, il faut que l\'exposant (–qx) tende vers –∞, ce qui impose q > 0. Si q = 0, la solution est constante ; si q < 0, la solution diverge vers +∞.'
        },
        {
          type: 'qcm4',
          q: 'La fonction f : ℤ → ℤ définie par f(n) = n + 1 est :',
          choices: ['Injective uniquement (non surjective)', 'Surjective uniquement (non injective)', 'Bijective (injective et surjective)', 'Ni injective ni surjective'],
          r: 2,
          nb: 'f(n) = n + 1 est injective car f(n₁) = f(n₂) implique n₁ + 1 = n₂ + 1 donc n₁ = n₂. Elle est surjective car pour tout entier m ∈ ℤ, l\'entier n = m – 1 vérifie f(n) = m. Étant à la fois injective et surjective, f est bijective sur ℤ.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la nature du noyau (kernel) de l\'application linéaire f : ℝ² → ℝ² définie par f(x, y) = (x + y, 2x + 2y) ?',
          choices: ['Le noyau est réduit au vecteur nul {(0, 0)} uniquement', 'Le noyau est la droite {(t, –t) : t ∈ ℝ}', 'Le noyau est l\'ensemble ℝ² tout entier', 'Le noyau est le demi-plan {(x, y) : x > 0}'],
          r: 1,
          nb: 'On résout f(x, y) = (0, 0) : x + y = 0 et 2x + 2y = 0 (ces deux équations sont identiques). La solution est y = –x pour tout x ∈ ℝ. Le noyau est donc la droite {(t, –t) : t ∈ ℝ}, un sous-espace de dimension 1. L\'application n\'est pas injective car les deux composantes de f sont proportionnelles.'
        },
        {
          type: 'qcm4',
          q: 'Quelles sont les principales fonctions assurées par le sang dans l\'organisme humain ?',
          choices: ['Uniquement le transport de l\'oxygène et des nutriments', 'Uniquement la défense immunitaire et la coagulation', 'Transport, régulation, protection immunitaire et coagulation', 'Uniquement la production d\'hormones et d\'enzymes'],
          r: 2,
          nb: 'Le sang assure quatre grandes fonctions : (1) Transport (O₂, CO₂, nutriments, hormones, déchets) ; (2) Régulation (température corporelle, pH, équilibre hydrique) ; (3) Protection (immunité par les leucocytes, coagulation par les plaquettes) ; (4) Communication hormonale. Il est composé de plasma, globules rouges, globules blancs et plaquettes.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les mots suivants, lequel est l\'intrus du point de vue grammatical : aboiement – appartement – doucement ?',
          choices: ['Aboiement', 'Appartement', 'Doucement', 'Aucun intrus, ils appartiennent à la même classe'],
          r: 2,
          nb: '« Doucement » est l\'intrus car c\'est un adverbe (de manière). « Aboiement » et « appartement » sont tous deux des noms communs. Cette question teste la capacité à identifier les classes grammaticales des mots, une compétence fondamentale en français.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date le journaliste burkinabè Norbert Zongo a-t-il été assassiné ?',
          choices: ['13 décembre 1997', '13 décembre 1998', '15 octobre 1987', '15 janvier 1999'],
          r: 1,
          nb: 'Norbert Zongo (1949-1998), fondateur du journal L\'Indépendant et directeur de publication, a été assassiné le 13 décembre 1998 à Sapouy (province du Ziro) avec trois de ses compagnons. Journaliste d\'investigation emblématique, il enquêtait sur la mort du chauffeur David Ouédraogo. Son assassinat reste un symbole de la lutte pour la liberté de la presse au Burkina Faso.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on la peur irrationnelle et persistante des animaux ?',
          choices: ['L\'arachnophobie', 'La claustrophobie', 'La zoophobie', 'L\'agoraphobie'],
          r: 2,
          nb: 'La zoophobie (du grec zôon = animal et phobos = peur) désigne la peur irrationnelle et excessive des animaux en général. Elle est distincte des phobies ciblant un animal spécifique (arachnophobie = araignées, cynophobie = chiens, ophiophobie = serpents). C\'est un trouble anxieux traitable par thérapie comportementale.'
        },
        {
          type: 'qcm4',
          q: 'À quelle discipline linguistique fait référence le terme « sémantique » ?',
          choices: ['L\'étude des sons et phonèmes d\'une langue', 'L\'étude de la structure grammaticale des phrases', 'L\'étude du sens et de la signification', 'L\'étude de l\'origine et de l\'histoire des mots'],
          r: 2,
          nb: 'La sémantique est la branche de la linguistique qui étudie le sens des unités linguistiques (mots, phrases, textes). Elle s\'interroge sur la manière dont le langage véhicule des significations et comment celles-ci évoluent. À distinguer de la phonétique (sons), de la morphologie (formes des mots) et de l\'étymologie (origines des mots).'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle province du Burkina Faso se trouvent les ruines de Loropéni, inscrites au patrimoine mondial de l\'UNESCO ?',
          choices: ['Province du Houet', 'Province du Kadiogo', 'Province du Poni', 'Province du Boulgou'],
          r: 2,
          nb: 'Les ruines de Loropéni sont situées dans la province du Poni, dans la région du Sud-Ouest du Burkina Faso. Ces vestiges de fortifications en pierre sèche, datant d\'environ 1 000 ans, ont été inscrits au patrimoine mondial de l\'UNESCO en 2009. Ils témoignent du commerce de l\'or qui animait la région.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'antonyme (contraire) du mot « handicap » ?',
          choices: ['Déficit', 'Incapacité', 'Atout', 'Contrainte'],
          r: 2,
          nb: 'L\'antonyme de « handicap » (désavantage, obstacle, limitation) est « atout » ou encore « avantage » ou « bénéfice ». Ces termes expriment une position favorable, un avantage compétitif. Un atout est ce qui favorise la réussite, tandis qu\'un handicap est ce qui l\'entrave.'
        },
        {
          type: 'qcm4',
          q: 'Combien de compagnons au total sont décédés avec Thomas Sankara le 15 octobre 1987 ?',
          choices: ['6 compagnons', '8 compagnons', '10 compagnons', '12 compagnons'],
          r: 3,
          nb: 'Thomas Sankara a été assassiné le 15 octobre 1987 à Ouagadougou, au Conseil de l\'Entente, en compagnie de 12 compagnons. Ce coup d\'État a été orchestré par Blaise Compaoré, qui lui a succédé à la tête du Burkina Faso. Le procès des assassins de Sankara a abouti à des condamnations en 2022.'
        }
      ]
    },
    {
      id: 'session_2026_06_02_1780398208771',
      date: '2025-08-01',
      titre: 'Session N°4 de août 2025',
      numero: 4,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Parmi les animaux suivants, lequel est l\'intrus (n\'appartient pas à la même catégorie que les autres) : chèvre – cheval – aigle – tigre ?',
          choices: ['La chèvre', 'Le cheval', 'L\'aigle', 'Le tigre'],
          r: 2,
          nb: 'L\'aigle est l\'intrus : c\'est un oiseau (classe des Oiseaux, ordre des Accipitriformes). La chèvre, le cheval et le tigre sont tous des mammifères. Ce type de question d\'intrus est fréquent dans les tests d\'aptitude des concours directs.'
        },
        {
          type: 'qcm4',
          q: 'Le lac Victoria, plus grand lac d\'Afrique par sa superficie, est partagé entre quels pays ?',
          choices: ['Éthiopie, Ouganda et Rwanda', 'Tanzanie, Ouganda et Kenya', 'Burundi, Rwanda et Tanzanie', 'Kenya, Éthiopie et Soudan du Sud'],
          r: 1,
          nb: 'Le lac Victoria, d\'une superficie d\'environ 68 800 km², est partagé entre la Tanzanie (au sud), l\'Ouganda (au nord) et le Kenya (à l\'est). C\'est aussi l\'un des plus grands lacs d\'eau douce au monde et la source du Nil Blanc.'
        },
        {
          type: 'qcm4',
          q: 'Dans quels pays se tiendra la Coupe du Monde de football 2026 ?',
          choices: ['Qatar, Arabie Saoudite et Émirats Arabes Unis', 'Espagne, Portugal et Maroc', 'États-Unis, Canada et Mexique', 'Brésil, Argentine et Chili'],
          r: 2,
          nb: 'La Coupe du Monde FIFA 2026 sera organisée conjointement par les États-Unis, le Canada et le Mexique, une première dans l\'histoire du tournoi organisé par trois pays simultanément. Cette édition sera également la première à accueillir 48 équipes nationales au lieu des 32 habituelles.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville se trouve le siège central du Programme Alimentaire Mondial (PAM), agence des Nations Unies ?',
          choices: ['Genève (Suisse)', 'New York (États-Unis)', 'Paris (France)', 'Rome (Italie)'],
          r: 3,
          nb: 'Le Programme Alimentaire Mondial (PAM) a son siège à Rome (Italie), aux côtés de deux autres agences onusiennes spécialisées en alimentation : la FAO (Organisation pour l\'Alimentation et l\'Agriculture) et le FIDA (Fonds International de Développement Agricole).'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur de l\'œuvre littéraire intitulée « Le dernier jour d\'un condamné » (1829) ?',
          choices: ['Honoré de Balzac', 'Gustave Flaubert', 'Alexandre Dumas', 'Victor Hugo'],
          r: 3,
          nb: '« Le dernier jour d\'un condamné » est un court roman de Victor Hugo, publié en 1829. Écrit sous forme de journal intime d\'un condamné à mort, c\'est un puissant plaidoyer contre la peine capitale. Cette œuvre illustre l\'engagement humaniste de Hugo et son combat pour l\'abolition de la peine de mort.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année a été publié « Le Parachutage », le premier roman de Norbert Zongo ?',
          choices: ['1982', '1985', '1988', '1991'],
          r: 2,
          nb: '« Le Parachutage » est le premier roman de Norbert Zongo (1949-1998), journaliste et écrivain burkinabè, publié en 1988 aux Éditions L\'Harmattan. Norbert Zongo est également fondateur du journal L\'Indépendant et a été assassiné le 13 décembre 1998 dans des circonstances jamais pleinement élucidées.'
        },
        {
          type: 'qcm4',
          q: 'Qui est reconnu comme le premier avocat titulaire du Burkina Faso ?',
          choices: ['Joseph Ki-Zerbo', 'Gérard Kango Ouédraogo', 'Frédéric Titinga Pacéré', 'Hermann Yaméogo'],
          r: 2,
          nb: 'Titinga Frédéric Pacéré (1943-2024) est reconnu comme le premier avocat du Burkina Faso, ayant obtenu sa qualification d\'avocat titulaire le 26 décembre 1975. Poète, écrivain et homme de droit, il fut également lauréat du Grand Prix littéraire d\'Afrique noire en 1982. Il est décédé le 8 novembre 2024 à l\'âge de 81 ans.'
        },
        {
          type: 'qcm4',
          q: 'Quelle approche scientifique consiste à observer les phénomènes, à expérimenter et à en tirer des lois générales ?',
          choices: ['La méthode déductive', 'La méthode rationnelle a priori', 'La méthode empirique (expérimentale)', 'La méthode formelle ou axiomatique'],
          r: 2,
          nb: 'La méthode empirique (ou expérimentale) est le fondement de la science moderne. Elle repose sur l\'observation des faits, la formulation d\'hypothèses, leur vérification par l\'expérience et la généralisation sous forme de lois. Elle est à la base des sciences naturelles (physique, chimie, biologie).'
        },
        {
          type: 'qcm4',
          q: 'À quelle date la Haute-Volta (Burkina Faso) a-t-elle été admise comme membre à part entière de l\'Organisation des Nations Unies ?',
          choices: ['5 août 1960', '20 septembre 1960', '15 novembre 1960', '4 août 1984'],
          r: 1,
          nb: 'La Haute-Volta (renommée Burkina Faso en 1984) a été admise à l\'ONU le 20 septembre 1960, soit quelques semaines après son indépendance le 5 août 1960. Son admission a été formalisée par la Résolution 149 du Conseil de sécurité du 23 août 1960.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le dernier site burkinabè à avoir été inscrit au patrimoine mondial de l\'UNESCO ?',
          choices: ['Les ruines de Loropéni', 'Le complexe naturel W-Arly-Pendjari', 'Les sites de métallurgie ancienne du fer', 'La Cour royale de Tiébélé'],
          r: 3,
          nb: 'La Cour royale de Tiébélé a été inscrite au patrimoine mondial de l\'UNESCO en 2024, portant à quatre le nombre total de sites burkinabè inscrits. Ce palais royal, construit selon l\'architecture traditionnelle kassena, est orné de décorations murales aux motifs géométriques exceptionnels.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année la Radiodiffusion Télévision du Burkina (RTB), alors appelée Volta Vision, a-t-elle lancé ses premières émissions ?',
          choices: ['1958', '1960', '1963', '1966'],
          r: 2,
          nb: 'Volta Vision a lancé ses premières émissions télévisées le 5 août 1963, bien que l\'institution ait été fondée en 1962. Renommée par la suite RTB (Radiodiffusion Télévision du Burkina), elle est l\'une des premières chaînes de télévision publique d\'Afrique de l\'Ouest francophone.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression idiomatique « avoir la main leste » ?',
          choices: ['Être particulièrement habile dans les travaux de précision', 'Être généreux et prompt à offrir de l\'aide', 'Être prompt à frapper, user facilement de la violence physique', 'Agir avec rapidité et efficacité dans son travail'],
          r: 2,
          nb: '« Avoir la main leste » est une expression idiomatique qui désigne une personne encline à frapper facilement ou à user de la violence physique à la moindre provocation. « Leste » signifie ici rapide et agile, mais dans un sens négatif de promptitude à la brutalité.'
        },
        {
          type: 'qcm4',
          q: 'Quel traité international, signé en 1919, a officiellement mis fin à la Première Guerre mondiale ?',
          choices: ['Le traité de Paris (1918)', 'Le traité de Versailles (1919)', 'Le traité de Berlin (1920)', 'Le traité de Lausanne (1923)'],
          r: 1,
          nb: 'Le traité de Versailles a été signé le 28 juin 1919, entre l\'Allemagne et les puissances alliées (France, Royaume-Uni, États-Unis, Italie…). Il imposa à l\'Allemagne des clauses sévères (cession de territoires, réparations de guerre, limitation de son armée) qui contribuèrent aux tensions précédant la Seconde Guerre mondiale.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'antonyme (contraire) du mot « intelligent » ?',
          choices: ['Indolent', 'Ignorant', 'Inintelligent', 'Insolent'],
          r: 2,
          nb: 'L\'antonyme direct d\' « intelligent » est « inintelligent », « stupide » ou « sot ». À ne pas confondre avec « ignorant » (qui manque de connaissances mais peut être intelligent), « indolent » (paresseux) ou « insolent » (irrespectueux). Les antonymes désignent des mots de sens contraire, non de sens différent.'
        },
        {
          type: 'qcm4',
          q: 'Qui occupe le poste de gouverneur de la Banque Centrale des États de l\'Afrique de l\'Ouest (BCEAO) depuis 2022 ?',
          choices: ['Tiémoko Meyliet Koné', 'Jean-Claude Kassi Brou', 'Lionel Zinsou', 'Charles Koffi Diby'],
          r: 1,
          nb: 'Jean-Claude Kassi Brou a pris la tête de la BCEAO en 2022, succédant à Tiémoko Meyliet Koné qui a quitté le poste pour devenir Vice-Président de la République de Côte d\'Ivoire. La BCEAO est la banque centrale commune aux huit pays de l\'UEMOA (Union Économique et Monétaire Ouest-Africaine).'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'organe principal délibératif de l\'Organisation des Nations Unies (ONU), dans lequel tous les États membres disposent d\'une voix égale ?',
          choices: ['Le Conseil de sécurité', 'L\'Assemblée générale', 'Le Secrétariat', 'La Cour internationale de Justice'],
          r: 1,
          nb: 'L\'Assemblée générale est l\'organe plénier de l\'ONU où chacun des 193 États membres dispose d\'une voix égale. Elle vote des résolutions sur les grandes questions mondiales (paix, développement, droits humains). Ses résolutions ne sont toutefois pas juridiquement contraignantes, contrairement à celles du Conseil de sécurité.'
        },
        {
          type: 'qcm4',
          q: 'Combien d\'articles compte la langue française selon la classification définis et indéfinis ?',
          choices: ['5', '6', '7', '8'],
          r: 1,
          nb: 'Le français compte traditionnellement 6 articles selon la classification simplifiée : 4 articles définis (le, la, l\', les) et 2 articles indéfinis de base (un, une). Certaines grammaires plus complètes ajoutent « des » (indéfini pluriel) et les articles partitifs (du, de la, de l\'), ce qui porte le total à 7 ou plus. Dans le cadre des concours, la réponse communément admise est 6.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville se trouve le siège de la Banque mondiale ?',
          choices: ['New York (États-Unis)', 'Genève (Suisse)', 'Washington (États-Unis)', 'Paris (France)'],
          r: 2,
          nb: 'Le siège de la Banque mondiale (World Bank) est situé à Washington D.C., aux États-Unis, au 1818 H Street NW, depuis sa fondation lors des accords de Bretton Woods en 1944. La Banque mondiale est une institution internationale dont la mission est de réduire la pauvreté et de financer le développement économique des pays membres.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le rôle principal du Grand Chancelier au Burkina Faso ?',
          choices: ['Superviser les forces armées et la défense nationale', 'Présider les sessions de l\'Assemblée Législative de la Transition', 'Gérer les distinctions honorifiques nationales et veiller au respect des ordres nationaux', 'Assurer la coordination des ministres au sein du gouvernement'],
          r: 2,
          nb: 'Le Grand Chancelier est l\'autorité protocolaire suprême chargée de gérer les ordres nationaux du Burkina Faso. Il veille à l\'attribution, au respect et à la préservation des distinctions honorifiques (Ordre National, Ordre du Mérite) décernées par le Président du Faso.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pourcentage de femmes au sein de l\'Assemblée Législative de la Transition (ALT) du Burkina Faso ?',
          choices: ['10,5 %', '16,9 %', '22,4 %', '30,1 %'],
          r: 1,
          nb: 'L\'ALT du Burkina Faso compte 12 femmes sur un total de 71 membres, ce qui représente un taux de féminisation de 16,9 % (12 ÷ 71 ≈ 0,169). Ce chiffre reste en deçà de l\'objectif africain de 30 % de représentation féminine dans les institutions politiques.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le terme suivant de la suite numérique : 100 – 50 – 25 – ?',
          choices: ['10,5', '12', '12,5', '15'],
          r: 2,
          nb: 'Cette suite est une progression géométrique de raison 1/2 : chaque terme est obtenu en divisant le précédent par 2. Ainsi : 100 ÷ 2 = 50 ; 50 ÷ 2 = 25 ; 25 ÷ 2 = 12,5. Le terme suivant est donc 12,5.'
        },
        {
          type: 'qcm4',
          q: 'Selon Thomas Hobbes dans « Le Léviathan », quelle est la finalité première de l\'État ?',
          choices: ['Garantir la liberté individuelle absolue', 'Assurer la justice entre les citoyens', 'Assurer la sécurité des individus face à l\'état de nature', 'Promouvoir l\'égalité économique entre les classes sociales'],
          r: 2,
          nb: 'Dans « Le Léviathan » (1651), Thomas Hobbes soutient que dans l\'état de nature, la vie est « solitaire, misérable, dangereuse, animale et brève ». Les individus cèdent leurs droits naturels au souverain (l\'État, symbolisé par le Léviathan) en échange de la sécurité et de la paix sociale.'
        },
        {
          type: 'qcm4',
          q: 'En sciences, que désigne le terme « homogène » lorsqu\'il est appliqué à une population ?',
          choices: ['Un être présentant une grande diversité de caractéristiques internes', 'Un groupe aux caractéristiques uniformes et sans variation notable', 'Un individu capable de s\'adapter à de nombreux environnements différents', 'Un organisme capable de se reproduire de manière autonome'],
          r: 1,
          nb: 'En sciences (physique, chimie, biologie), le terme « homogène » qualifie une substance, un matériau ou une population dont les propriétés ou caractéristiques sont uniformes et identiques en tout point. À l\'inverse, un système hétérogène présente des variations ou des composantes de natures différentes.'
        },
        {
          type: 'qcm4',
          q: 'Sachant que P(A) = 0,25 et P(B) = 0,8, dans quel intervalle se situe nécessairement P(A∪B) ?',
          choices: ['P(A∪B) est nécessairement égal à 1,05', 'P(A∪B) est compris entre 0,25 et 0,5', 'P(A∪B) est compris entre 0,8 et 1', 'P(A∪B) est toujours supérieur à 1'],
          r: 2,
          nb: 'Par la formule d\'inclusion-exclusion : P(A∪B) = P(A) + P(B) - P(A∩B). Puisque P(A∩B) ≥ 0, on a P(A∪B) ≤ 0,25 + 0,8 = 1,05, mais P(A∪B) ≤ 1 (axiome des probabilités). De plus, P(A∪B) ≥ max(P(A), P(B)) = 0,8. Donc P(A∪B) ∈ [0,8 ; 1].'
        },
        {
          type: 'qcm4',
          q: 'Quel lien établit-on généralement entre la désertification et les conflits armés à l\'échelle mondiale ?',
          choices: ['La désertification augmente les terres cultivables disponibles, réduisant les tensions', 'La désertification dégrade les ressources naturelles et accentue les rivalités pour l\'eau et les terres, favorisant les conflits', 'La désertification n\'a aucun impact démontré sur la stabilité géopolitique', 'La désertification entraîne uniquement des migrations pacifiques sans violences associées'],
          r: 1,
          nb: 'La désertification provoque la dégradation des terres, la réduction des ressources en eau et l\'appauvrissement agricole. Ces phénomènes exacerbent la compétition entre populations pour des ressources de plus en plus rares, ce qui constitue un facteur aggravant des tensions et des conflits, notamment au Sahel.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'ordre correct des étapes du processus de phagocytose dans le système immunitaire ?',
          choices: ['Ingestion → Reconnaissance → Adhésion → Digestion → Exocytose', 'Reconnaissance → Adhésion → Ingestion → Digestion → Exocytose', 'Adhésion → Digestion → Reconnaissance → Ingestion → Exocytose', 'Reconnaissance → Ingestion → Adhésion → Digestion → Exocytose'],
          r: 1,
          nb: 'La phagocytose est un mécanisme de défense immunitaire qui suit l\'ordre : (1) Reconnaissance du pathogène par les récepteurs de surface ; (2) Adhésion du phagocyte au pathogène ; (3) Ingestion (formation du phagosome) ; (4) Digestion par les enzymes lysosomiales (phagolysosome) ; (5) Exocytose des débris non digérés. Les cellules concernées sont les macrophages et les neutrophiles.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date l\'Assemblée Législative de la Transition (ALT) du Burkina Faso a-t-elle officiellement adopté la nouvelle devise nationale « La Patrie ou la mort, nous vaincrons » ?',
          choices: ['4 août 2024', '29 octobre 2024', '29 novembre 2024', '11 décembre 2024'],
          r: 1,
          nb: 'La nouvelle devise nationale du Burkina Faso a été adoptée lors de la séance plénière de l\'ALT du 29 octobre 2024, par un vote unanime de 71 voix sur 71 à bulletin secret. Cette devise, supprimée en 1997 sous Blaise Compaoré et remplacée par « Unité-Progrès-Justice », a ainsi été restaurée par la Transition.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date la Russie a-t-elle lancé son invasion militaire à grande échelle de l\'Ukraine, déclenchant le conflit russo-ukrainien actuel ?',
          choices: ['14 mars 2014', '21 février 2022', '24 février 2022', '1er mars 2022'],
          r: 2,
          nb: 'Le 24 février 2022, la Russie a lancé une offensive militaire à grande échelle contre l\'Ukraine, qualifiée par Moscou d\' « opération militaire spéciale ». Cette date marque le début de la phase intensive du conflit. La Russie avait déjà annexé la Crimée en mars 2014 et soutenu des séparatistes dans le Donbas depuis 2014.'
        },
        {
          type: 'qcm4',
          q: 'Selon Sigmund Freud, par quel moyen principal a-t-il mis en évidence l\'existence de l\'inconscient ?',
          choices: ['Par l\'observation neurologique directe du cerveau humain', 'Par des expériences scientifiques contrôlées en laboratoire', 'Par l\'analyse et l\'interprétation des rêves', 'Par la méditation et l\'introspection personnelle'],
          r: 2,
          nb: 'Sigmund Freud a mis en évidence l\'existence de l\'inconscient principalement par l\'interprétation des rêves, qu\'il expose dans son ouvrage fondateur « L\'interprétation des rêves » (Die Traumdeutung, 1900). Pour Freud, les rêves sont la voie royale vers l\'inconscient, révélant des désirs refoulés et des conflits psychiques cachés.'
        },
        {
          type: 'qcm4',
          q: 'Quelles sont les deux lettres manquantes dans la suite : B – F – J – N – R – ? – ?',
          choices: ['X – D', 'V – Z', 'U – D', 'U – Z'],
          r: 1,
          nb: 'Cette suite suit une progression arithmétique dans l\'alphabet avec un écart constant de +4 positions : B(2) → F(6) → J(10) → N(14) → R(18) → V(22) → Z(26). Après R, on obtient V (R + 4), puis Z (V + 4). Les deux lettres manquantes sont donc V et Z.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le nombre x tel que : trois fois un nombre augmenté de 8 donne 29 ?',
          choices: ['8', '6', '5', '7'],
          r: 3,
          nb: 'On traduit l\'énoncé en équation du premier degré : 3x + 8 = 29. En isolant x : 3x = 29 - 8 = 21, donc x = 21 ÷ 3 = 7. La solution est x = 7, soit l\'option D.'
        },
        {
          type: 'qcm4',
          q: 'Si a appartient à l\'intervalle ouvert ]π ; 3π/2[, alors :',
          choices: ['cos(a) > 0 et sin(a) < 0', 'cos(a) < 0 et sin(a) < 0', 'cos(a) < 0 et sin(a) > 0', 'cos(a) > 0 et sin(a) > 0'],
          r: 1,
          nb: 'L\'intervalle ]π ; 3π/2[ correspond au 3e quadrant du cercle trigonométrique. Dans ce quadrant, l\'abscisse et l\'ordonnée du point sur le cercle unité sont toutes deux strictement négatives : cos(a) < 0 et sin(a) < 0. À titre de repère : cos(π) = -1, sin(π) = 0 ; cos(3π/2) = 0, sin(3π/2) = -1.'
        },
        {
          type: 'qcm4',
          q: 'Dans quel pays se trouve le barrage des Trois-Gorges, le plus grand barrage hydroélectrique du monde ?',
          choices: ['Brésil', 'Inde', 'Chine', 'Russie'],
          r: 2,
          nb: 'Le barrage des Trois-Gorges est situé sur le fleuve Yangtsé, en Chine. Avec une capacité installée d\'environ 22 500 MW, c\'est le plus puissant barrage hydroélectrique au monde. Il a été mis en service progressivement entre 2003 et 2012.'
        },
        {
          type: 'qcm4',
          q: 'Dans quels pays s\'étendent les montagnes Rocheuses ?',
          choices: ['États-Unis uniquement', 'Canada uniquement', 'États-Unis et Mexique', 'États-Unis et Canada'],
          r: 3,
          nb: 'Les montagnes Rocheuses (Rocky Mountains) s\'étendent sur plus de 4 800 km depuis le Nouveau-Mexique (États-Unis) au sud jusqu\'en Colombie-Britannique (Canada) au nord. Elles constituent l\'épine dorsale de l\'Amérique du Nord et représentent la principale ligne de partage des eaux du continent.'
        },
        {
          type: 'qcm4',
          q: 'Quelles sont les œuvres connues de la poétesse burkinabè Bernadette Sanou Dao ?',
          choices: ['Les Deux Maris, Symphonie et Dernière épouse', 'Quote-part, Symphonie et Parturition', 'Le Carrefour des Veuves et Quote-part', 'Écoute mon cœur, Devoir de cuissage et Symphonie'],
          r: 1,
          nb: 'Bernadette Sanou Dao est une poétesse burkinabè reconnue dont les principales œuvres sont « Quote-part », « Symphonie » et « Parturition ». Son écriture aborde les thèmes de la condition féminine et de l\'identité africaine. À distinguer de Monique Ilboudo (« Le Carrefour des Veuves ») et Hadiza Sanoussi (« Les Deux Maris »).'
        },
        {
          type: 'qcm4',
          q: 'Quand aura lieu la 18e édition du Salon International de l\'Artisanat de Ouagadougou (SIAO) ?',
          choices: ['Du 30 octobre au 8 novembre 2024', 'Du 15 au 25 octobre 2025', 'Du 30 octobre au 8 novembre 2026', 'Du 5 au 15 novembre 2026'],
          r: 2,
          nb: 'La 18e édition du SIAO se tiendra du 30 octobre au 8 novembre 2026 à Ouagadougou. Son thème est : « Artisanat africain et industrialisation : quelle synergie pour une meilleure organisation et la valorisation des produits locaux et du patrimoine culturel ? »'
        },
        {
          type: 'qcm4',
          q: 'À quel courant philosophique et littéraire appartient la pièce « Les Mains sales » de Jean-Paul Sartre ?',
          choices: ['Le naturalisme', 'L\'existentialisme', 'Le surréalisme', 'Le symbolisme'],
          r: 1,
          nb: '« Les Mains sales » (1948) est une pièce de théâtre de Jean-Paul Sartre qui illustre les thèmes centraux de l\'existentialisme : la liberté, la responsabilité, l\'engagement politique et la mauvaise foi. À travers le personnage de Hugo, Sartre interroge la tension entre idéaux et action concrète dans un contexte révolutionnaire.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelles conditions la mitose est-elle déclenchée dans le cycle cellulaire ?',
          choices: ['Lorsque la cellule manque de nutriments', 'Lorsque la cellule a atteint une taille critique et que l\'ADN est correctement répliqué', 'Immédiatement après la fécondation uniquement', 'Lorsque la température corporelle dépasse un seuil'],
          r: 1,
          nb: 'La mitose est déclenchée lorsque la cellule a atteint une taille suffisante et que la réplication de l\'ADN (phase S de l\'interphase) est correctement achevée. Des points de contrôle (checkpoints) vérifient l\'intégrité de l\'ADN avant d\'autoriser la division. Elle produit deux cellules filles génétiquement identiques à la cellule mère.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la date d\'adoption de la Déclaration universelle des droits de l\'homme (DUDH) ?',
          choices: ['26 juin 1945', '24 octobre 1945', '10 décembre 1948', '4 novembre 1950'],
          r: 2,
          nb: 'La Déclaration universelle des droits de l\'homme a été adoptée et proclamée par l\'Assemblée générale de l\'ONU le 10 décembre 1948 à Paris. Ce texte fondateur, non contraignant juridiquement mais de portée universelle, reconnaît les droits inaliénables de tout être humain. Le 10 décembre est depuis lors célébré comme la Journée internationale des droits de l\'homme.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pays le plus vaste du continent africain ?',
          choices: ['République Démocratique du Congo', 'Soudan', 'Niger', 'Algérie'],
          r: 3,
          nb: 'L\'Algérie est le plus grand pays d\'Afrique avec une superficie d\'environ 2,38 millions de km², dépassant largement la RDC (2,34 millions de km²). Elle est aussi le 10e plus grand pays au monde. Sa grande partie méridionale est occupée par le Sahara algérien.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut le premier chef de gouvernement de la Haute-Volta (Burkina Faso actuel) avant l\'indépendance ?',
          choices: ['Gérard Kango Ouédraogo', 'Sangoulé Lamizana', 'Joseph Ki-Zerbo', 'Maurice Yaméogo'],
          r: 3,
          nb: 'Maurice Yaméogo fut le premier Président du Conseil de gouvernement de la Haute-Volta (équivalent de Premier ministre) à partir de 1958, dans le cadre de la Loi-cadre Defferre qui accordait l\'autonomie aux territoires français. À l\'indépendance le 5 août 1960, il devint le premier Président de la République.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle ASECNA ?',
          choices: ['Agence Spatiale et des Communications de la Nation Africaine', 'Association des États Côtiers du Nord de l\'Afrique', 'Agence pour la Sécurité de la Navigation Aérienne en Afrique et à Madagascar', 'Autorité de Surveillance et de Contrôle de la Navigation Aéronautique'],
          r: 2,
          nb: 'L\'ASECNA (Agence pour la Sécurité de la Navigation Aérienne en Afrique et à Madagascar) est un organisme international qui gère la navigation aérienne dans l\'espace aérien de 18 États africains membres. Son siège est à Dakar (Sénégal). Elle assure la sécurité de millions de vols chaque année.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'acronyme BRICS dans sa composition originelle de cinq membres fondateurs ?',
          choices: ['Birmanie, Rwanda, Iran, Chine, Soudan', 'Bolivie, Roumanie, Inde, Congo, Suède', 'Brésil, Russie, Inde, Chine, Afrique du Sud', 'Burkina, République centrafricaine, Indonésie, Colombie, Sénégal'],
          r: 2,
          nb: 'Le BRICS regroupe à l\'origine cinq grandes économies émergentes : Brésil, Russie, Inde, Chine et Afrique du Sud (South Africa). Ces pays coopèrent sur les plans économique, politique et diplomatique. En 2024 et 2025, le groupe s\'est élargi à cinq nouveaux membres (Égypte, Éthiopie, Iran, Émirats arabes unis et Indonésie), portant le total à 10 membres.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la capitale de la Suède ?',
          choices: ['Oslo', 'Copenhague', 'Helsinki', 'Stockholm'],
          r: 3,
          nb: 'Stockholm est la capitale et la plus grande ville de la Suède. Construite sur 14 îles à l\'embouchure du lac Mälaren, elle est surnommée la « Venise du Nord ». C\'est le principal centre économique, culturel et politique du pays, qui abrite notamment les cérémonies de remise des Prix Nobel.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les propositions suivantes, laquelle est un exemple de pays issu de l\'ex-URSS ?',
          choices: ['Pologne', 'Roumanie', 'Ukraine', 'Hongrie'],
          r: 2,
          nb: 'L\'Ukraine est l\'une des 15 républiques qui composaient l\'URSS et qui sont devenues indépendantes lors de la dissolution de l\'Union soviétique en 1991. La Pologne, la Roumanie et la Hongrie étaient des États de l\'Europe de l\'Est sous influence soviétique, mais n\'étaient pas des républiques de l\'URSS.'
        },
        {
          type: 'qcm4',
          q: 'Qui dirige la Fédération Burkinabè de Cricket (FBC) depuis mai 2023 ?',
          choices: ['Issouf Ouédraogo', 'Ibrahim Ndiaye', 'Hamidou Compaoré', 'Séydou Traoré'],
          r: 1,
          nb: 'Ibrahim Ndiaye assure la présidence de la Fédération Burkinabè de Cricket (FBC) depuis mai 2023. Cette fédération œuvre au développement du cricket au Burkina Faso, sport en pleine expansion sur le continent africain, notamment en Afrique de l\'Ouest.'
        },
        {
          type: 'qcm4',
          q: 'Lequel de ces secteurs d\'activité appartient au secteur primaire de l\'économie ?',
          choices: ['La construction de bâtiments', 'L\'industrie pharmaceutique', 'L\'agriculture', 'Le commerce de détail'],
          r: 2,
          nb: 'Le secteur primaire regroupe toutes les activités directement liées à l\'exploitation des ressources naturelles : agriculture, élevage, pêche, sylviculture et mines. Il s\'oppose au secteur secondaire (industrie de transformation) et au secteur tertiaire (services). Au Burkina Faso, ce secteur emploie la majorité de la population active.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pourcentage du quota réservé à certaines catégories de candidats au concours d\'entrée à l\'École Nationale de la Magistrature (ENAM) au Burkina Faso ?',
          choices: ['10 %', '15 %', '20 %', '25 %'],
          r: 0,
          nb: 'Le quota prévu pour certaines catégories spécifiques (femmes, personnes handicapées ou candidats issus de zones défavorisées) au concours de la magistrature au Burkina Faso est de 10 %. Ce mécanisme vise à favoriser une plus grande diversité et inclusion dans le corps judiciaire.'
        },
        {
          type: 'qcm4',
          q: 'Quel pays a été désigné pays invité d\'honneur du FESPACO 2025 (Festival Panafricain du Cinéma et de la Télévision de Ouagadougou) ?',
          choices: ['Niger', 'Mali', 'Sénégal', 'Tchad'],
          r: 3,
          nb: 'Le Tchad a été le pays invité d\'honneur de la 29e édition du FESPACO, qui s\'est tenue du 22 février au 1er mars 2025 à Ouagadougou. Chaque édition du festival met à l\'honneur un pays africain pour promouvoir son cinéma national et renforcer l\'intégration culturelle du continent.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année a eu lieu la première édition du FESPACO (Festival Panafricain du Cinéma et de la Télévision de Ouagadougou) ?',
          choices: ['1966', '1969', '1972', '1975'],
          r: 1,
          nb: 'La première édition du FESPACO s\'est tenue en 1969 à Ouagadougou. Créé à l\'initiative de cinéphiles et de professionnels du cinéma africain, ce festival est aujourd\'hui le plus grand et le plus prestigieux festival de cinéma africain au monde. Il se tient tous les deux ans.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la lettre manquante dans la suite : B – C – E – H – L – ?',
          choices: ['N', 'T', 'Q', 'K'],
          r: 2,
          nb: 'Le décalage entre lettres consécutives augmente d\'une unité à chaque fois : B→C (+1), C→E (+2), E→H (+3), H→L (+4), L→? (+5). La 17e lettre de l\'alphabet est Q (L est la 12e, 12 + 5 = 17 = Q). La lettre manquante est donc Q.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la limite de [ln(x+1) – ln(x)] quand x tend vers +∞ ?',
          choices: ['1', 'ln(2)', '0', '+∞'],
          r: 2,
          nb: 'On simplifie l\'expression : ln(x+1) – ln(x) = ln[(x+1)/x] = ln[1 + 1/x]. Quand x → +∞, le terme 1/x → 0, donc l\'expression devient ln(1 + 0) = ln(1) = 0. La limite est donc 0.'
        }
      ]
    },
    {
      id: 'session_2026_06_02_1780398176361',
      date: '2025-08-01',
      titre: 'Session N°3 de août 2025',
      numero: 3,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Quel est l\'aliment de base le plus consommé à l\'échelle mondiale ?',
          choices: ['Le blé', 'Le maïs', 'Le riz', 'Le manioc'],
          r: 2,
          nb: 'Le riz est l\'aliment de base de plus de la moitié de l\'humanité, notamment en Asie (Chine, Inde, Indonésie) et dans de nombreuses régions d\'Afrique. Il constitue la principale source de calories pour des milliards de personnes dans le monde.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du recueil de poèmes burkinabè intitulé « Les sillons de l\'existence » ?',
          choices: ['Titinga Frédéric Pacéré', 'Émile Lalsaga', 'Bernadette Sanou Dao', 'Norbert Zongo'],
          r: 1,
          nb: 'Émile Lalsaga est un poète burkinabè et professeur certifié. Il a publié le recueil « Les sillons de l\'existence » en 2014 aux éditions Le GERSTIC. Son œuvre s\'inscrit dans la littérature burkinabè contemporaine.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la date de la Journée mondiale du climat, promue par de nombreuses organisations non gouvernementales ?',
          choices: ['5 juin', '22 avril', '8 décembre', '23 septembre'],
          r: 2,
          nb: 'La Journée mondiale du climat est célébrée le 8 décembre, à l\'initiative de plusieurs ONG engagées dans la lutte contre le changement climatique. Cette date est distincte de la Journée mondiale de l\'Environnement (5 juin, ONU) et de la Journée de la Terre (22 avril).'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le verbe « entériner » ?',
          choices: ['Rejeter officiellement une décision', 'Valider et approuver officiellement', 'Ajourner indéfiniment une délibération', 'Modifier en profondeur un texte législatif'],
          r: 1,
          nb: 'Entériner signifie confirmer, ratifier ou approuver officiellement une décision, un accord ou un acte pour lui conférer un caractère définitif et irrévocable. Ce terme s\'emploie fréquemment dans le domaine juridique et institutionnel.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date Patrice Lumumba, premier Premier ministre du Congo-Kinshasa, a-t-il été assassiné ?',
          choices: ['30 juin 1960', '17 janvier 1961', '12 mars 1962', '5 septembre 1960'],
          r: 1,
          nb: 'Patrice Lumumba, premier Premier ministre de la République du Congo (actuelle RDC) après l\'indépendance du 30 juin 1960, a été assassiné le 17 janvier 1961 dans le contexte de la grave instabilité politique qui secoua le pays après l\'indépendance.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville sénégalaise est né le romancier et cinéaste Ousmane Sembène ?',
          choices: ['Dakar', 'Saint-Louis', 'Thiès', 'Ziguinchor'],
          r: 3,
          nb: 'Ousmane Sembène (1923-2007) est né à Ziguinchor, en Casamance (sud du Sénégal). Figure majeure de la littérature et du cinéma africain francophone, il est notamment l\'auteur de « Les Bouts de bois de Dieu » et de nombreux films engagés.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date est célébrée la Journée mondiale de lutte contre la désertification et la sécheresse ?',
          choices: ['5 juin', '22 mars', '17 juin', '21 mars'],
          r: 2,
          nb: 'La Journée mondiale de lutte contre la désertification et la sécheresse est célébrée chaque année le 17 juin, sous l\'égide des Nations Unies. Elle vise à sensibiliser l\'opinion mondiale à la dégradation des terres et à la sécheresse, deux défis majeurs pour des pays comme le Burkina Faso.'
        },
        {
          type: 'qcm4',
          q: 'Quel abri désigne-t-on spécifiquement par le terme « étable » ?',
          choices: ['L\'abri des moutons', 'L\'abri des chevaux', 'L\'abri des volailles', 'L\'abri des bovins'],
          r: 3,
          nb: 'L\'étable est le bâtiment destiné à loger les bovins (vaches, bœufs, taureaux). À ne pas confondre avec l\'écurie (chevaux), la bergerie (moutons), la porcherie (porcs) ou le poulailler (volailles). Ces distinctions sont fréquemment testées dans les concours.'
        },
        {
          type: 'qcm4',
          q: 'Quelle politique économique est généralement mise en œuvre pour lutter contre l\'inflation ?',
          choices: ['Une politique budgétaire expansive avec augmentation des dépenses publiques', 'Une baisse généralisée des taux d\'intérêt pour relancer le crédit', 'Une politique monétaire restrictive avec hausse des taux d\'intérêt', 'La suppression de toutes les taxes à l\'importation'],
          r: 2,
          nb: 'La politique monétaire restrictive consiste à augmenter les taux d\'intérêt pour réduire la masse monétaire en circulation, décourager le crédit et ainsi limiter la hausse des prix. Elle est complétée par un contrôle des dépenses publiques et un encadrement des prix dans certains cas.'
        },
        {
          type: 'qcm4',
          q: 'Quel pays d\'Afrique de l\'Ouest a officiellement quitté la CEDEAO en 2000 ?',
          choices: ['Le Maroc', 'Le Mali', 'La Mauritanie', 'Le Niger'],
          r: 2,
          nb: 'La Mauritanie a officiellement quitté la CEDEAO en décembre 1999 (effectif en 2000), invoquant une incompatibilité entre ses objectifs économiques nationaux et ceux de l\'organisation régionale. Elle n\'a pas réintégré la CEDEAO depuis lors.'
        },
        {
          type: 'qcm4',
          q: 'Quelle hormone, produite par l\'embryon lors de la nidation, permet de maintenir le corps jaune et la grossesse précoce ?',
          choices: ['La progestérone', 'L\'œstrogène', 'La gonadotrophine chorionique humaine (HCG)', 'La prolactine'],
          r: 2,
          nb: 'La HCG (gonadotrophine chorionique humaine) est produite par le trophoblaste (futur placenta) dès la nidation. Elle maintient le corps jaune actif, qui continue à sécréter de la progestérone pour stabiliser la muqueuse utérine et assurer les premières semaines de grossesse.'
        },
        {
          type: 'qcm4',
          q: 'Lequel de ces personnages n\'appartient PAS au panthéon de l\'Égypte ancienne ?',
          choices: ['Isis', 'Osiris', 'Zeus', 'Anubis'],
          r: 2,
          nb: 'Zeus est un dieu de la mythologie grecque (dieu du ciel et du tonnerre), et non égyptienne. Le panthéon égyptien antique comprend notamment Râ (dieu soleil), Osiris (dieu des morts), Isis (déesse de la magie), Anubis (dieu de l\'embaumement) et Horus (dieu du ciel).'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces propositions décrit le mieux l\'agriculture burkinabè ?',
          choices: ['Essentiellement irriguée et orientée vers l\'exportation', 'Principalement pluviale, familiale et vivrière (mil, sorgho, maïs)', 'Largement mécanisée et spécialisée dans les cultures industrielles', 'Dominée par les grandes exploitations capitalistes'],
          r: 1,
          nb: 'L\'agriculture burkinabè est majoritairement pluviale (dépendante des pluies), pratiquée par de petites exploitations familiales, et orientée vers l\'autoconsommation (vivrière). Les principales cultures sont le mil, le sorgho et le maïs. Elle représente environ 25 à 30 % du PIB national.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces propositions ne constitue PAS une contrainte directe pour l\'agriculture au Burkina Faso ?',
          choices: ['L\'insécurité pluviométrique et les aléas climatiques', 'La faiblesse des infrastructures d\'irrigation', 'L\'excès de capitaux et de financements dans le secteur rural', 'Le coût élevé des intrants agricoles (engrais, semences, pesticides)'],
          r: 2,
          nb: 'L\'agriculture burkinabè souffre au contraire d\'un manque chronique de capitaux et de financements. Les contraintes réelles sont la dépendance aux pluies, l\'insuffisance de l\'irrigation, les sols peu fertiles, le coût des intrants et l\'enclavement de nombreuses zones de production.'
        },
        {
          type: 'qcm4',
          q: 'Quels pays sont concernés par le cours du Mouhoun depuis sa source jusqu\'à son embouchure ?',
          choices: ['Burkina Faso, Niger et Bénin', 'Burkina Faso, Côte d\'Ivoire et Ghana', 'Burkina Faso, Mali et Guinée', 'Burkina Faso, Togo et Ghana'],
          r: 1,
          nb: 'Le Mouhoun prend sa source au Burkina Faso, forme une partie de la frontière avec la Côte d\'Ivoire, puis entre au Ghana où il se jette dans le lac Volta. Il ne traverse ni le Niger ni le Bénin. C\'est un affluent majeur du système hydrologique des Volta.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les éléments suivants, lequel n\'est PAS un facteur de production au sens économique classique ?',
          choices: ['Le capital', 'Le travail', 'La monnaie', 'La terre'],
          r: 2,
          nb: 'En économie classique, les trois facteurs de production sont le travail (humain), le capital (machines, équipements) et la terre (ressources naturelles). La monnaie est un instrument d\'échange et de mesure, non un facteur de production en lui-même.'
        },
        {
          type: 'qcm4',
          q: 'Lorsque les dépenses publiques d\'un État excèdent ses recettes fiscales et non fiscales, on parle de :',
          choices: ['Surplus budgétaire', 'Déficit budgétaire', 'Dette extérieure', 'Crise monétaire'],
          r: 1,
          nb: 'Le déficit budgétaire désigne la situation dans laquelle les dépenses de l\'État sont supérieures à ses recettes au cours d\'un exercice budgétaire donné. Il se distingue de la dette publique (qui est l\'accumulation des déficits passés) et du surplus budgétaire (situation inverse).'
        },
        {
          type: 'qcm4',
          q: 'Selon la définition économique officielle, le chômeur est :',
          choices: ['Toute personne qui ne travaille pas, quelle que soit la raison', 'Une personne ayant volontairement quitté son emploi', 'Une personne en âge de travailler, sans emploi et en recherche active d\'un emploi', 'Une personne à la retraite ou en incapacité de travail'],
          r: 2,
          nb: 'Le chômeur au sens du Bureau International du Travail (BIT) est une personne en âge de travailler (15-64 ans), qui n\'a pas travaillé au cours de la semaine de référence, qui est disponible pour travailler et qui effectue des démarches actives pour trouver un emploi.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle SARL en droit des affaires ?',
          choices: ['Société à Responsabilité Illimitée', 'Société Anonyme à Responsabilité Légale', 'Société à Responsabilité Limitée', 'Société Artisanale à Régime Libre'],
          r: 2,
          nb: 'La SARL (Société à Responsabilité Limitée) est une forme juridique d\'entreprise dans laquelle la responsabilité de chaque associé est limitée au montant de ses apports. En cas de faillite, les associés ne perdent que ce qu\'ils ont investi et ne sont pas responsables sur leurs biens personnels.'
        },
        {
          type: 'qcm4',
          q: 'Qui a été sacré Super Galian lors de la 28e édition de ce concours journalistique au Burkina Faso en 2025 ?',
          choices: ['Ismaël Compaoré', 'Liradan Philippe Ada', 'Idrissa Barry', 'Abdoul Ouédraogo'],
          r: 1,
          nb: 'Liradan Philippe Ada a remporté le trophée du Super Galian lors de la 28e édition en 2025, avec une moyenne de 17,2/20. C\'est sa deuxième distinction dans ce concours qui récompense les meilleurs journalistes burkinabè.'
        },
        {
          type: 'qcm4',
          q: 'À quelle chaîne de télévision appartient le journaliste Liradan Philippe Ada, lauréat du Super Galian 2025 ?',
          choices: ['RTB Télé', 'BF1', 'Sidwaya Télé', 'Savane Média'],
          r: 0,
          nb: 'Liradan Philippe Ada est journaliste reporter d\'images à la Radiodiffusion Télévision du Burkina (RTB Télé), la chaîne publique nationale du Burkina Faso. C\'est en qualité d\'agent de cette télévision publique qu\'il a concouru et remporté le Super Galian 2025.'
        },
        {
          type: 'qcm4',
          q: 'Combien de candidats ont participé à la 28e édition du Super Galian 2025 ?',
          choices: ['150 candidats', '170 candidats', '191 candidats', '200 candidats'],
          r: 2,
          nb: 'La 28e édition du Super Galian 2025 a enregistré la participation de 191 candidats, qui ont soumis un total de 382 œuvres journalistiques pour évaluation. Ce concours annuel est la plus haute distinction professionnelle décernée aux journalistes burkinabè.'
        },
        {
          type: 'qcm4',
          q: 'Quelle a été la première source d\'énergie exploitée à grande échelle lors de la Révolution industrielle ?',
          choices: ['Le pétrole', 'Le charbon (houille)', 'Le gaz naturel', 'L\'énergie hydraulique'],
          r: 1,
          nb: 'Le charbon (houille) fut la première source d\'énergie industrielle à grande échelle. Il alimenta les machines à vapeur dès la fin du XVIIIe siècle en Grande-Bretagne, propulsant la Révolution industrielle. Le pétrole ne s\'imposa comme source dominante qu\'à la fin du XIXe siècle.'
        },
        {
          type: 'qcm4',
          q: 'Quelle maladie, fréquente après la ménopause, est caractérisée par une diminution de la densité osseuse entraînant une fragilité excessive des os ?',
          choices: ['La scoliose', 'Le rachitisme', 'L\'ostéoporose', 'L\'arthrose'],
          r: 2,
          nb: 'L\'ostéoporose est une maladie métabolique des os caractérisée par une diminution de la masse et de la densité osseuses, rendant les os poreux et fragiles. Elle touche particulièrement les femmes après la ménopause en raison de la chute des œstrogènes, augmentant significativement le risque de fractures.'
        },
        {
          type: 'qcm4',
          q: 'Quel type de lentille optique est utilisé pour corriger la myopie ?',
          choices: ['Une lentille convergente (biconvexe)', 'Une lentille divergente (biconcave)', 'Une lentille cylindrique', 'Une lentille plan-convexe'],
          r: 1,
          nb: 'La myopie est un défaut visuel dans lequel l\'image se forme en avant de la rétine. Pour corriger ce défaut, on utilise des lentilles divergentes (concaves) qui éloignent le foyer image et le ramènent sur la rétine. À l\'inverse, l\'hypermétropie est corrigée par des lentilles convergentes.'
        },
        {
          type: 'qcm4',
          q: 'Quelle structure de l\'œil humain régule la quantité de lumière entrant dans celui-ci en ajustant le diamètre de la pupille ?',
          choices: ['La rétine', 'Le cristallin', 'L\'iris', 'Le nerf optique'],
          r: 2,
          nb: 'L\'iris est un diaphragme musculaire coloré qui entoure la pupille. En se contractant ou en se dilatant, il ajuste le diamètre de la pupille selon l\'intensité lumineuse : il se resserre à la lumière vive (réduisant l\'entrée de lumière) et se dilate dans l\'obscurité.'
        },
        {
          type: 'qcm4',
          q: 'Le titre de l\'hymne national du Burkina Faso, « le Ditanyè », est issu de quelle langue nationale ?',
          choices: ['Le Fulfuldé', 'Le Lobiri', 'Le Mooré', 'Le Dioula'],
          r: 1,
          nb: 'Le Ditanyè, qui signifie « Hymne de la Victoire » ou « Chant de la Dignité », est issu de la langue nationale lobiri (ou birifor), parlée dans le sud-ouest du pays. Il a été adopté comme hymne national en 1984 sous la Révolution Démocratique et Populaire du Capitaine Thomas Sankara.'
        },
        {
          type: 'qcm4',
          q: 'La fonction f(x) = ln(x) est définie pour :',
          choices: ['Tout réel x appartenant à ℝ', 'Tout réel x strictement positif (x > 0)', 'Tout réel x positif ou nul (x ≥ 0)', 'Tout réel x différent de zéro (x ≠ 0)'],
          r: 1,
          nb: 'La fonction logarithme népérien (ln) n\'est définie que pour les réels strictement positifs : son domaine de définition est ]0 ; +∞[. En dehors de cet ensemble, notamment pour x ≤ 0, ln(x) n\'existe pas dans les réels.'
        },
        {
          type: 'qcm4',
          q: 'Les guerres médiques (490-479 av. J.-C.) opposaient les cités-États grecques à quel puissant empire ?',
          choices: ['L\'Empire romain', 'L\'Empire perse', 'L\'Empire macédonien d\'Alexandre', 'L\'Empire babylonien'],
          r: 1,
          nb: 'Les guerres médiques opposèrent les cités-États grecques (notamment Athènes et Sparte) à l\'Empire perse dirigé successivement par Darius Ier puis Xerxès Ier. Les batailles de Marathon (490 av. J.-C.), des Thermopyles et de Salamine (480 av. J.-C.) sont les moments clés de ces conflits.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pays le plus peuplé du continent africain ?',
          choices: ['L\'Éthiopie', 'La République Démocratique du Congo', 'L\'Égypte', 'Le Nigeria'],
          r: 3,
          nb: 'Le Nigeria est le pays le plus peuplé d\'Afrique avec environ 220 à 230 millions d\'habitants. C\'est également la première économie du continent. Il est suivi par l\'Éthiopie, l\'Égypte et la RDC dans le classement démographique africain.'
        },
        {
          type: 'qcm4',
          q: 'À quel philosophe et essayiste français est généralement attribuée la citation critique de la toute-puissance de la techno-science : « la science est le nouveau Dieu qui sauve » ?',
          choices: ['Jean-Paul Sartre', 'Albert Camus', 'Raymond Aron', 'Jacques Ellul'],
          r: 3,
          nb: 'Jacques Ellul (1912-1994), philosophe, sociologue et théologien protestant français, est connu pour sa critique radicale de la technique et de son emprise sur la société. Son œuvre principale, « La Technique ou l\'Enjeu du siècle » (1954), analyse comment la technique devient une force autonome qui s\'impose à l\'humanité.'
        },
        {
          type: 'qcm4',
          q: 'Quel joueur africain a été le premier et jusqu\'ici le seul à remporter le Ballon d\'Or de France Football ?',
          choices: ['Didier Drogba (Côte d\'Ivoire)', 'George Weah (Libéria)', 'Samuel Eto\'o (Cameroun)', 'Yaya Touré (Côte d\'Ivoire)'],
          r: 1,
          nb: 'George Weah, joueur libérien évoluant notamment au PSG et à l\'AC Milan, est le seul joueur africain à avoir remporté le Ballon d\'Or de France Football, en 1995. Il a également été élu par la FIFA Joueur mondial de l\'année. Il est aujourd\'hui président du Libéria.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression idiomatique « avoir le poil dans la main » ?',
          choices: ['Être très adroit dans les travaux manuels', 'Être extrêmement paresseux et refuser de travailler', 'Avoir une grande expérience dans un domaine', 'Être particulièrement généreux de son temps'],
          r: 1,
          nb: '« Avoir le poil dans la main » est une expression familière qui désigne une personne extrêmement paresseuse, qui évite systématiquement le travail et l\'effort. L\'image suggère que la main n\'ayant jamais rien saisi, elle a eu le temps de développer du poil.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le sens du vieux terme français « moult » encore rencontré dans certains textes littéraires ?',
          choices: ['Très peu, à peine, presque rien', 'Jamais, en aucune circonstance', 'Beaucoup, nombreux, en grande quantité', 'Progressivement, peu à peu, avec lenteur'],
          r: 2,
          nb: '« Moult » est un adverbe archaïque du français médiéval signifiant « beaucoup », « en grande quantité » ou « de nombreuses fois ». Il est issu du latin « multum ». On le retrouve dans des textes littéraires anciens ou dans un registre volontairement archaïsant.'
        },
        {
          type: 'qcm4',
          q: 'Dans le roman « Le Monde s\'effondre » (Things Fall Apart) de Chinua Achebe, que représente Agbala dans la société igbo ?',
          choices: ['Le chef politique suprême du village', 'Un oracle sacré consulté pour les décisions importantes', 'Le sorcier chargé d\'éloigner les mauvais esprits', 'Le juge coutumier chargé de régler les conflits'],
          r: 1,
          nb: 'Agbala est l\'oracle des collines et des cavernes dans la société igbo décrite par Chinua Achebe. Il est consulté pour les questions importantes (maladies, conflits, destin). La prêtresse Chielo sert d\'intermédiaire et transmet ses messages. Agbala représente la puissance du monde spirituel traditionnel.'
        },
        {
          type: 'qcm4',
          q: 'La dysorthographie est classée parmi les troubles :',
          choices: ['Alimentaires', 'Du sommeil', 'Neurologiques graves', 'Des apprentissages'],
          r: 3,
          nb: 'La dysorthographie est un trouble spécifique des apprentissages caractérisé par des difficultés persistantes et importantes à orthographier correctement les mots, malgré un enseignement adapté. Elle est liée à un déficit de la mémoire orthographique et est souvent associée à la dyslexie.'
        },
        {
          type: 'qcm4',
          q: 'Quelle politique soviétique, initiée par Mikhaïl Gorbatchev à partir de 1986, visait à instaurer la transparence et la liberté d\'expression en URSS ?',
          choices: ['La Perestroïka', 'La Glasnost', 'La Détente', 'Le Komintern'],
          r: 1,
          nb: 'La Glasnost (terme russe signifiant « transparence » ou « ouverture ») est la politique de transparence politico-sociale lancée par Mikhaïl Gorbatchev à partir de 1986. Elle favorisa la liberté d\'expression, la critique du régime soviétique et fut l\'un des moteurs du démantèlement de l\'URSS. À distinguer de la Perestroïka (restructuration économique).'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'acronyme OTASE dans le contexte des alliances militaires de la Guerre froide ?',
          choices: ['Organisation du Traité de l\'Atlantique Sud-Est', 'Organisation du Traité de l\'Asie du Sud-Est', 'Organisation des Territoires Alliés du Sud de l\'Europe', 'Organisation Transnationale de l\'Alliance Stratégique Eurasienne'],
          r: 1,
          nb: 'L\'OTASE (Organisation du Traité de l\'Asie du Sud-Est, SEATO en anglais) était une alliance militaire anticommuniste créée en 1954 regroupant notamment les États-Unis, la France, le Royaume-Uni, l\'Australie, la Thaïlande et les Philippines. Elle a été dissoute en 1977.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman burkinabè « Le Carrefour des Veuves » ?',
          choices: ['Bernadette Sanou Dao', 'Hadiza Sanoussi', 'Monique Ilboudo', 'Aminata Dramane Traoré'],
          r: 2,
          nb: '« Le Carrefour des Veuves » est un roman de l\'auteure burkinabè Monique Ilboudo, publié en 2020. Juriste et militante des droits humains, Monique Ilboudo est l\'une des voix les plus engagées de la littérature burkinabè contemporaine, notamment sur les thèmes des droits des femmes et de la justice sociale.'
        },
        {
          type: 'qcm4',
          q: 'Qui a dirigé la rédaction et la publication de l\'Encyclopédie, œuvre phare des Lumières du XVIIIe siècle ?',
          choices: ['Voltaire et Rousseau', 'Montesquieu et Buffon', 'Diderot et d\'Alembert', 'Descartes et Pascal'],
          r: 2,
          nb: 'L\'Encyclopédie (ou Dictionnaire raisonné des sciences, des arts et des métiers) a été dirigée par Denis Diderot et Jean le Rond d\'Alembert entre 1751 et 1772. Ce monument des Lumières rassemblait le savoir de l\'époque et encourageait la pensée critique face aux dogmes religieux et politiques.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la superficie totale du Canada, deuxième plus grand pays du monde ?',
          choices: ['7,2 millions de km²', '9,98 millions de km²', '11,5 millions de km²', '17 millions de km²'],
          r: 1,
          nb: 'Le Canada couvre une superficie de 9,98 millions de km², ce qui en fait le deuxième plus grand pays du monde après la Russie (17,1 millions de km²). Malgré cette immensité, il ne compte qu\'environ 40 millions d\'habitants, dont la majorité vit à moins de 200 km de la frontière américaine.'
        },
        {
          type: 'qcm4',
          q: 'Qui est traditionnellement reconnu comme le père fondateur de la philosophie occidentale ?',
          choices: ['Platon', 'Aristote', 'Thalès de Milet', 'Socrate'],
          r: 3,
          nb: 'Socrate (470-399 av. J.-C.) est généralement présenté comme le père de la philosophie occidentale, notamment en raison de sa méthode dialectique (maïeutique) visant à faire accoucher les esprits de la vérité. Son enseignement oral, retranscrit par Platon, a profondément marqué toute la pensée philosophique ultérieure.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la capitale de l\'État insulaire de Saint-Christophe-et-Niévès (Saint-Kitts-and-Nevis), situé dans les Antilles ?',
          choices: ['Kingstown', 'Basseterre', 'Roseau', 'Castries'],
          r: 1,
          nb: 'Basseterre est la capitale de Saint-Christophe-et-Niévès (Saint-Kitts-and-Nevis), un des plus petits États indépendants des Caraïbes. La ville est située sur la côte sud-ouest de l\'île de Saint-Kitts. Ce pays est l\'un des premiers à avoir aboli l\'esclavage dans la région.'
        },
        {
          type: 'qcm4',
          q: 'De quel recueil poétique de Léopold Sédar Senghor est extrait le célèbre poème « Femme noire » ?',
          choices: ['Hosties noires', 'Éthiopiques', 'Chants d\'ombre', 'Nocturnes'],
          r: 2,
          nb: '« Femme noire » est l\'un des poèmes les plus célèbres de Léopold Sédar Senghor. Il est extrait du recueil « Chants d\'ombre », publié en 1945. Dans ce poème, Senghor célèbre la beauté et la fécondité de la femme africaine comme métaphore de l\'Afrique elle-même, dans l\'esprit de la Négritude.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du poème « L\'Albatros » et dans quel recueil ce poème figure-t-il ?',
          choices: ['Victor Hugo, dans « Les Contemplations »', 'Arthur Rimbaud, dans « Les Illuminations »', 'Paul Verlaine, dans « Poèmes saturniens »', 'Charles Baudelaire, dans « Les Fleurs du mal »'],
          r: 3,
          nb: '« L\'Albatros » est un poème de Charles Baudelaire figurant dans la section « Spleen et Idéal » du recueil « Les Fleurs du mal » (1857). Dans ce texte, le poète compare le génie à un albatros, majestueux en plein vol mais maladroit et moqué sur le pont du navire, métaphore de l\'inadaptation du poète au monde réel.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman burkinabè « Devoir de cuissage » ?',
          choices: ['Bernadette Sanou Dao', 'Monique Ilboudo', 'Hadiza Sanoussi', 'Aminata Sow Fall'],
          r: 2,
          nb: '« Devoir de cuissage » est le second roman d\'Hadiza Sanoussi, auteure burkinabè, après « Les Deux Maris ». Il aborde les violences et inégalités de genre à travers une fiction ancrée dans les réalités sociales africaines.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le rôle principal du coke dans un haut fourneau lors du processus de fabrication de la fonte ?',
          choices: ['Refroidir le minerai de fer pour faciliter sa manipulation', 'Servir à la fois de combustible et d\'agent réducteur', 'Augmenter la teneur en carbone de l\'acier final', 'Former le laitier (scorie) en se combinant avec les impuretés du minerai'],
          r: 1,
          nb: 'Dans le haut fourneau, le coke (charbon transformé) joue un double rôle : il brûle pour produire la chaleur nécessaire à la fusion du minerai (rôle de combustible) et il produit du monoxyde de carbone (CO) qui se combine à l\'oxyde de fer pour en extraire le fer pur (rôle d\'agent réducteur).'
        },
        {
          type: 'qcm4',
          q: 'Quel est le rôle de la cryolithe (Na₃AlF₆) dans l\'électrolyse de l\'alumine pour produire l\'aluminium ?',
          choices: ['Elle sert d\'électrolyte principal fournissant les ions aluminium', 'Elle empêche l\'oxydation de l\'aluminium produit au contact de l\'air', 'Elle abaisse le point de fusion de l\'alumine de 2 045°C à environ 960°C', 'Elle catalyse la décomposition de l\'alumine en aluminium et oxygène'],
          r: 2,
          nb: 'L\'alumine pure (Al₂O₃) fond à environ 2 045°C, ce qui rendrait son électrolyse industrielle énergétiquement très coûteuse. L\'ajout de cryolithe abaisse ce point de fusion à environ 950-980°C, rendant le processus techniquement et économiquement viable. Ce procédé est appelé procédé Hall-Héroult.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle UMA dans le contexte des organisations régionales africaines ?',
          choices: ['Union Mondiale Africaine', 'Union du Maghreb Arabe', 'Unité des Marchés Africains', 'Union des Mouvements Armés'],
          r: 1,
          nb: 'L\'UMA (Union du Maghreb Arabe) est une organisation régionale créée en 1989 à Marrakech. Elle regroupe cinq pays d\'Afrique du Nord : l\'Algérie, la Libye, la Mauritanie, le Maroc et la Tunisie. Elle vise à favoriser l\'intégration économique et politique du Grand Maghreb.'
        },
        {
          type: 'qcm4',
          q: 'Que désigne le terme juridique « régicide » ?',
          choices: ['Le renversement par la force d\'un gouvernement républicain', 'L\'assassinat ou le meurtre volontaire d\'un roi ou d\'un souverain', 'La destitution légale d\'un monarque par son parlement', 'L\'exil forcé d\'un chef d\'État hors de son pays'],
          r: 1,
          nb: 'Le régicide (du latin rex = roi et caedere = tuer) désigne l\'acte de tuer un roi ou un souverain. L\'exemple historique le plus célèbre est l\'exécution de Louis XVI le 21 janvier 1793 durant la Révolution française. L\'assassinat de tout souverain régnant constitue un régicide.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'adjectif « impérieux » selon son usage en français ?',
          choices: ['Soumis, obéissant et facile à diriger', 'Autoritaire, exigeant, ou qui s\'impose', 'Généreux et bienveillant envers ses subordonnés', 'Indifférent à toute forme d\'autorité'],
          r: 1,
          nb: 'L\'adjectif « impérieux » possède deux sens selon le contexte. Il peut désigner un ton ou un caractère autoritaire et exigeant (un air impérieux), ou qualifier une nécessité urgente et pressante qui s\'impose sans possibilité de la repousser (un besoin impérieux, une nécessité impérieuse).'
        },
        {
          type: 'qcm4',
          q: 'Quel est le rôle du Conseil constitutionnel du Burkina Faso, et combien de membres le compose ?',
          choices: ['Il contrôle les finances publiques ; il est composé de 7 membres', 'Il veille à la conformité des lois à la Constitution et statue sur les contentieux électoraux ; il est composé de 9 membres', 'Il conseille le gouvernement en matière législative ; il est composé de 12 membres', 'Il représente le pouvoir judiciaire suprême ; il est composé de 11 membres'],
          r: 1,
          nb: 'Le Conseil constitutionnel burkinabè est le garant de la suprématie de la Constitution. Il vérifie la constitutionnalité des lois et règle les contentieux électoraux. Il est composé de 9 membres : 3 nommés par le Président du Faso, 3 élus par l\'Assemblée Législative de la Transition et 3 désignés par le Conseil Supérieur de la Magistrature.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la plus grande chute d\'eau du continent africain ?',
          choices: ['Les chutes de Kalambo (Zambie-Tanzanie)', 'Les chutes d\'Augrabies (Afrique du Sud)', 'Les chutes Murchison (Ouganda)', 'Les chutes Victoria (Zimbabwe-Zambie)'],
          r: 3,
          nb: 'Les chutes Victoria, situées à la frontière entre le Zimbabwe et la Zambie sur le fleuve Zambèze, sont les plus grandes d\'Afrique. Hautes d\'environ 108 mètres et larges de 1 700 mètres, elles sont classées au patrimoine mondial de l\'UNESCO et figurent parmi les sites naturels les plus spectaculaires du monde.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut la première femme à être élue à la présidence d\'un pays africain ?',
          choices: ['Joyce Banda (Malawi)', 'Sahle-Work Zewde (Éthiopie)', 'Catherine Samba-Panza (Centrafrique)', 'Ellen Johnson Sirleaf (Libéria)'],
          r: 3,
          nb: 'Ellen Johnson Sirleaf a été élue présidente du Libéria en 2005, devenant ainsi la première femme cheffe d\'État élue démocratiquement sur le continent africain. Elle a été réélue en 2011 et a reçu le Prix Nobel de la Paix la même année pour son engagement en faveur de la paix et des droits des femmes.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pH normal du sang humain artériel ?',
          choices: ['6,8 à 7,0 (légèrement acide)', '7,0 exactement (neutre)', '7,35 à 7,45 (légèrement basique)', '7,8 à 8,0 (fortement basique)'],
          r: 2,
          nb: 'Le pH normal du sang humain se situe entre 7,35 et 7,45, soit légèrement basique. Un écart en dehors de cette plage provoque des troubles graves : en dessous de 7,35 (acidose), au-dessus de 7,45 (alcalose). Ces déséquilibres peuvent altérer les fonctions respiratoires, cellulaires et enzymatiques.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la valeur approximative de la vitesse de la lumière dans le vide, constante universelle notée c ?',
          choices: ['150 000 km/s', '200 000 km/s', '300 000 km/s', '450 000 km/s'],
          r: 2,
          nb: 'La vitesse de la lumière dans le vide est d\'environ 299 792 458 m/s, soit approximativement 300 000 km/s ou 3 × 10⁸ m/s. Elle est symbolisée par la lettre c et constitue une constante physique fondamentale, notamment au cœur de la théorie de la relativité d\'Einstein (E = mc²).'
        }
      ]
    },
    {
      id: 'session_2025_08_01',
      date: '2025-08-01',
      titre: 'Session N°2 de août 2025',
      numero: 2,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Parmi les entreprises industrielles suivantes implantées au Burkina Faso, laquelle relève du secteur de l\'industrie des matières plastiques ?',
          choices: ['MABUCIG', 'SA PHOTO', 'FASOPLAST', 'BRAKINA'],
          r: 2,
          nb: 'FASOPLAST est une entreprise burkinabè spécialisée dans la fabrication et la transformation de matières plastiques, la rattachant au secteur de l\'industrie chimique et pétrochimique. MABUCIG (Manufacture Burkinabè de Cigarettes) relève de l\'industrie du tabac, BRAKINA de l\'industrie brassicole.'
        },
        {
          type: 'qcm4',
          q: 'En quelle date le Capitaine Ibrahim Traoré a-t-il officiellement prêté serment comme Président de la Transition du Burkina Faso ?',
          choices: ['30 septembre 2022', '2 octobre 2022', '15 octobre 2022', '21 octobre 2022'],
          r: 3,
          nb: 'Le Capitaine Ibrahim Traoré a prêté serment le 21 octobre 2022, date officielle de son investiture comme Président de la Transition. Son arrivée au pouvoir par coup d\'État remonte au 30 septembre 2022, date à distinguer de celle de l\'investiture.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le terme « dextérité » ?',
          choices: ['Force physique exceptionnelle', 'Habileté manuelle ou mentale dans l\'exécution d\'une tâche', 'Rapidité d\'exécution sans précision particulière', 'Précision exclusive dans l\'expression orale'],
          r: 1,
          nb: 'La dextérité désigne une habileté remarquable dans l\'exécution de gestes ou dans la réflexion. Elle peut être manuelle (travaux de précision, chirurgie) ou mentale (raisonnement rapide et juste). Une personne dextre accomplit ses tâches avec aisance et précision.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus haut sommet du monde ?',
          choices: ['Le mont Blanc (France-Italie)', 'L\'Aconcagua (Argentine)', 'Le Kilimandjaro (Tanzanie)', 'L\'Everest (Népal-Chine)'],
          r: 3,
          nb: 'L\'Everest, situé dans la chaîne himalayenne à la frontière entre le Népal et le Tibet (Chine), culmine à 8 848 mètres d\'altitude. Il est reconnu comme le point le plus élevé de la surface terrestre. Il a été gravi pour la première fois en 1953 par Edmund Hillary et Tenzing Norgay.'
        },
        {
          type: 'qcm4',
          q: 'Quel médecin est reconnu comme le pionnier de la médecine et le fondateur de la faculté de médecine de la Haute-Volta ?',
          choices: ['Pr Alfred Diban Ki-Zerbo', 'Pr Rambré Moumouni Ouiminga', 'Pr Joseph Ki-Zerbo', 'Pr Soungalo Ouédraogo'],
          r: 1,
          nb: 'Le Professeur Rambré Moumouni Ouiminga est le pionnier de la médecine burkinabè. Il a initié et mené à bien la création de la faculté de médecine de la Haute-Volta, formant des générations de professionnels de santé et posant les bases du système médical national.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date le Capitaine Ibrahim Traoré a-t-il pris le pouvoir par coup d\'État au Burkina Faso ?',
          choices: ['24 janvier 2022', '30 septembre 2022', '21 octobre 2022', '2 novembre 2022'],
          r: 1,
          nb: 'Le 30 septembre 2022, le Capitaine Ibrahim Traoré a renversé le lieutenant-colonel Paul-Henri Sandaogo Damiba lors d\'un coup d\'État militaire. Il a ensuite prêté serment comme Président de la Transition le 21 octobre 2022, date de son investiture officielle.'
        },
        {
          type: 'qcm4',
          q: 'Sur quel thème principal se concentrait la philosophie post-socratique ?',
          choices: ['La logique formelle et la dialectique pure', 'La cosmogonie et les origines de l\'univers', 'La recherche du bonheur, la morale et l\'éthique', 'La politique et les formes de gouvernement idéal'],
          r: 2,
          nb: 'Après Socrate, la philosophie grecque s\'est orientée vers l\'art de bien vivre. Les grandes écoles post-socratiques (stoïciens, épicuriens, cyniques) avaient comme préoccupation centrale la quête du bonheur, la définition de la vertu et les règles de la vie morale et éthique.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le terme « apathie » ?',
          choices: ['Excitation émotionnelle intense et durable', 'Absence d\'émotion, d\'énergie ou d\'intérêt pour son environnement', 'Sentiment d\'hostilité incontrôlable envers autrui', 'Tendance pathologique à l\'excès dans les réactions affectives'],
          r: 1,
          nb: 'L\'apathie désigne un état d\'indifférence, de manque d\'énergie et d\'absence de réactions émotionnelles. Elle est fréquemment associée à des troubles psychologiques (dépression, schizophrénie) ou neurologiques, et se distingue de la simple fatigue passagère.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le terme manquant dans la suite numérique : 5 – 14 – 30 – ? – 91 ?',
          choices: ['45', '50', '55', '60'],
          r: 2,
          nb: 'Les écarts entre les termes successifs sont des carrés croissants : +9 (3²), +16 (4²), +25 (5²), +36 (6²). Ainsi : 5+9=14 ; 14+16=30 ; 30+25=55 ; 55+36=91. Le terme manquant est donc 55.'
        },
        {
          type: 'qcm4',
          q: 'Quel Burkinabè a reçu en 2023 une distinction internationale de renommée mondiale dans le domaine des sciences spatiales ?',
          choices: ['Moussa Ouattara', 'Frédéric Ouattara', 'Jean Ilboudo', 'Souleymane Compaoré'],
          r: 1,
          nb: 'Frédéric Ouattara est le Burkinabè distingué pour ses travaux en sciences spatiales. En 2023, il a reçu un prix international de renommée mondiale dans ce domaine, distinct du Prix Nobel qui ne comporte pas de catégorie dédiée aux sciences spatiales en tant que telle.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les courants littéraires du XXe siècle, lequel est principalement caractérisé par l\'exploration de l\'inconscient et du rêve ?',
          choices: ['L\'absurde', 'Le surréalisme', 'L\'existentialisme', 'Le naturalisme'],
          r: 1,
          nb: 'Le surréalisme, né en France dans les années 1920 sous l\'impulsion d\'André Breton, s\'inspire des théories de Freud sur l\'inconscient. Ce courant valorise les rêves, les associations libres d\'idées et l\'imaginaire comme sources d\'inspiration artistique et littéraire.'
        },
        {
          type: 'qcm4',
          q: 'Combien de membres compte l\'Assemblée Législative de la Transition (ALT) du Burkina Faso ?',
          choices: ['65 membres', '71 membres', '80 membres', '90 membres'],
          r: 1,
          nb: 'L\'ALT, organe législatif de la Transition au Burkina Faso, est composée de 71 membres. Ce chiffre a été fixé par décret dans le cadre de l\'architecture institutionnelle de la Transition. La nouvelle devise nationale adoptée à l\'unanimité par ses 71 membres en 2024 en est une illustration.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la durée de la révolution de la Terre autour du Soleil ?',
          choices: ['Une journée', '28 jours environ', 'Une année', 'Dix ans'],
          r: 2,
          nb: 'La Terre effectue un tour complet autour du Soleil en environ 365,25 jours, soit une année. Ce mouvement de révolution détermine la durée de l\'année civile. L\'accumulation du quart de jour supplémentaire explique les années bissextiles (366 jours) tous les quatre ans.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les propositions suivantes, laquelle ne constitue PAS une cause du réchauffement climatique ?',
          choices: ['L\'émission de gaz à effet de serre (CO₂, méthane)', 'La reforestation massive des forêts tropicales', 'La déforestation et la destruction des écosystèmes forestiers', 'L\'utilisation excessive des énergies fossiles (pétrole, charbon, gaz)'],
          r: 1,
          nb: 'La reforestation contribue à la lutte contre le réchauffement climatique en absorbant le CO₂ atmosphérique. Les véritables causes du réchauffement sont l\'émission de gaz à effet de serre, la déforestation, les activités industrielles polluantes, l\'agriculture intensive et l\'utilisation des énergies fossiles.'
        },
        {
          type: 'qcm4',
          q: 'Quel écrivain est généralement reconnu comme le père fondateur de la littérature africaine moderne d\'expression anglaise ?',
          choices: ['Wole Soyinka (Nigeria)', 'Ngugi wa Thiong\'o (Kenya)', 'Chinua Achebe (Nigeria)', 'Léopold Sédar Senghor (Sénégal)'],
          r: 2,
          nb: 'L\'écrivain nigérian Chinua Achebe (1930-2013) est considéré comme le père de la littérature africaine moderne grâce à son roman « Things Fall Apart » (Le monde s\'effondre, 1958), traduit en plus de 50 langues et vendu à plus de 12 millions d\'exemplaires. Ce roman a posé les jalons de la littérature africaine contemporaine.'
        },
        {
          type: 'qcm4',
          q: 'Quel événement a symbolisé le début de l\'effondrement du bloc de l\'Est en Europe ?',
          choices: ['La création de l\'OTAN en 1949', 'La chute du mur de Berlin en 1989', 'La dissolution de la Yougoslavie en 1992', 'La révolution cubaine en 1959'],
          r: 1,
          nb: 'La chute du mur de Berlin, le 9 novembre 1989, est le symbole fort de l\'effondrement du bloc soviétique en Europe. Elle fut suivie par la dissolution officielle de l\'URSS le 25 décembre 1991, entraînant la fin de l\'influence soviétique et la réunification de l\'Allemagne.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la contribution approximative du secteur de l\'artisanat à l\'économie du Burkina Faso ?',
          choices: ['Environ 10 % du PIB', 'Environ 20 % du PIB', 'Environ 30 % du PIB', 'Environ 50 % du PIB'],
          r: 2,
          nb: 'Le secteur artisanal représente une part majeure de l\'économie burkinabè, employant près de 30 % de la population active et contribuant à environ 30 % du PIB national. Il constitue un pilier central de l\'économie informelle du pays, notamment dans les domaines du tissage, de la poterie, de la maroquinerie et de la sculpture.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus grand aménagement hydro-agricole du Burkina Faso ?',
          choices: ['Barrage de Kompienga', 'Barrage de Loumbila', 'Barrage de Samandéni', 'Barrage de Bagré'],
          r: 3,
          nb: 'Le barrage de Bagré, situé sur le fleuve Nakanbé dans la province du Boulgou, est le plus grand aménagement hydro-agricole du Burkina Faso. Il est exploité à des fins multiples : irrigation agricole, production d\'énergie hydroélectrique et développement de la pêche en eaux douces.'
        },
        {
          type: 'qcm4',
          q: 'Combien de provinces compte le Burkina Faso depuis la réforme administrative du 2 juillet 2025 ?',
          choices: ['45 provinces', '47 provinces', '49 provinces', '52 provinces'],
          r: 1,
          nb: 'Suite au décret du Conseil des ministres du 2 juillet 2025, le Burkina Faso compte désormais 47 provinces (contre 45 auparavant), réparties dans 17 régions administratives. Deux nouvelles provinces ont été créées : Dyamangou (Tapoa) et Karo-Péli (Soum).'
        },
        {
          type: 'qcm4',
          q: 'Quelle figure de style consiste à atténuer l\'expression d\'une idée pour en suggérer davantage ?',
          choices: ['L\'hyperbole', 'La litote', 'L\'anaphore', 'L\'antithèse'],
          r: 1,
          nb: 'La litote est une figure de style qui consiste à atténuer l\'expression d\'une pensée pour en suggérer davantage. Exemple classique : dire « ce n\'est pas mal » pour signifier « c\'est très bien ». Elle s\'oppose à l\'hyperbole (qui exagère) et se distingue de l\'euphémisme (qui adoucit sans sous-entendre davantage).'
        },
        {
          type: 'qcm4',
          q: 'On plie un carré en quatre (deux pliages successifs). On perce un trou dans un des coins libres de la figure obtenue. Combien de trous obtient-on en dépliant complètement le carré ?',
          choices: ['1 trou', '4 trous', '8 trous', '16 trous'],
          r: 1,
          nb: 'En pliant un carré en quatre (deux pliages successifs), on obtient 4 couches superposées. Une seule perforation traversant les 4 couches donne, après dépliage complet, 4 trous répartis symétriquement sur le carré d\'origine. La réponse est donc 4 trous.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur de l\'œuvre poétique burkinabè intitulée « Du lait pour une tombe » ?',
          choices: ['Norbert Zongo', 'Pierre Claver Ilboudo', 'Titinga Frédéric Pacéré', 'Joseph Ki-Zerbo'],
          r: 2,
          nb: '« Du lait pour une tombe » est une œuvre poétique du Burkinabè Titinga Frédéric Pacéré. Il y utilise des symboles puissants ancrés dans la tradition africaine : le lait maternel comme symbole de vie et la tombe comme lieu de mémoire et de deuil.'
        },
        {
          type: 'qcm4',
          q: 'Les sciences formelles, telles que les mathématiques et la logique, sont qualifiées de sciences :',
          choices: ['Inductives', 'Expérimentales', 'Déductives', 'Empiriques'],
          r: 2,
          nb: 'Les sciences formelles reposent sur le raisonnement déductif : leurs vérités sont obtenues par déduction à partir d\'axiomes et de définitions, sans recours à l\'expérience sensible. Elles s\'opposent aux sciences empiriques (physique, biologie) qui s\'appuient sur l\'observation et l\'expérimentation.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la médiane de la série statistique suivante : 56, 52, 57, 56, 70, 63, 50, 55 ?',
          choices: ['55', '57', '70', '56'],
          r: 3,
          nb: 'On classe la série par ordre croissant : 50, 52, 55, 56, 56, 57, 63, 70. La série comporte 8 valeurs (nombre pair). La médiane est la moyenne des deux valeurs centrales (4e et 5e rang) : (56 + 56) / 2 = 56.'
        },
        {
          type: 'qcm4',
          q: 'Selon Sigmund Freud, quel qualificatif caractérise le mieux le fonctionnement de l\'appareil psychique humain ?',
          choices: ['Statique', 'Dynamique', 'Rationnel', 'Linéaire'],
          r: 1,
          nb: 'Freud décrit l\'appareil psychique selon trois axes : topique (localisation des espaces psychiques), économique (flux d\'énergie) et dynamique (interactions entre les instances). L\'aspect dynamique renvoie aux conflits constants entre le ça, le moi et le surmoi, qui animent et structurent la vie psychique.'
        },
        {
          type: 'qcm4',
          q: 'Complétez la série logique : J – 10 | F – 6 | M – 13 | A – 1 | M – ?',
          choices: ['12', '13', '14', '15'],
          r: 1,
          nb: 'Chaque lettre est l\'initiale d\'un mois de l\'année (J=Janvier, F=Février, M=Mars, A=Avril, M=Mai), et le chiffre indique la position de cette lettre dans l\'alphabet français. La lettre M est la 13e lettre. La réponse est donc 13.'
        },
        {
          type: 'qcm4',
          q: 'Selon la logique numérique de la série (Maïs = 42, Mil = 34, Riz = 53), quelle valeur correspond au mot « Bleu » ?',
          choices: ['40', '41', '42', '34'],
          r: 0,
          nb: 'La valeur est obtenue en additionnant les rangs alphabétiques de chaque lettre. Maïs : M(13)+A(1)+I(9)+S(19)=42 ; Mil : M(13)+I(9)+L(12)=34 ; Riz : R(18)+I(9)+Z(26)=53 ; Bleu : B(2)+L(12)+E(5)+U(21)=40.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'ensemble solution dans ℝ de l\'équation : exp(1 – x) + 1 = 0 ?',
          choices: ['x = 0', 'x = ln 2', 'x = -1', '∅'],
          r: 3,
          nb: 'L\'équation se réécrit exp(1 – x) = -1. Or, la fonction exponentielle est strictement positive pour tout réel (exp(x) > 0, ∀x ∈ ℝ). Elle ne peut donc jamais prendre la valeur -1. L\'ensemble solution est vide : ∅.'
        },
        {
          type: 'qcm4',
          q: 'Complétez la série de directions : Haut – Bas – Droite – Gauche – ?',
          choices: ['Bas', 'Droite', 'Gauche', 'Haut'],
          r: 3,
          nb: 'Cette série suit un cycle répétitif de 4 directions dans l\'ordre : Haut, Bas, Droite, Gauche. Après le 4e terme (Gauche), le cycle recommence depuis le début. Le 5e terme est donc Haut.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville siège officiellement le Parlement européen ?',
          choices: ['Bruxelles (Belgique)', 'Luxembourg (Luxembourg)', 'Berlin (Allemagne)', 'Strasbourg (France)'],
          r: 3,
          nb: 'Strasbourg (France) est le siège officiel du Parlement européen, confirmé par le traité de Maastricht (1992) et le traité d\'Amsterdam (1997). Les sessions plénières s\'y tiennent chaque mois, tandis que les commissions parlementaires siègent principalement à Bruxelles.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la nature exacte du phénomène d\'osmose ?',
          choices: ['Uniquement un phénomène chimique', 'Uniquement un phénomène biochimique', 'À la fois un phénomène physique et biologique', 'Exclusivement un phénomène thermique'],
          r: 2,
          nb: 'L\'osmose est physique car elle repose sur le passage spontané de molécules d\'eau à travers une membrane semi-perméable selon un gradient de concentration. Elle est également biologique car elle régule les échanges d\'eau dans les cellules vivantes, assurant notamment la turgescence cellulaire et l\'équilibre hydrique de l\'organisme.'
        },
        {
          type: 'qcm4',
          q: 'Qui est le Secrétaire général de l\'Organisation des Nations Unies (ONU) depuis 2017 ?',
          choices: ['Ban Ki-moon', 'Kofi Annan', 'António Guterres', 'Boutros Boutros-Ghali'],
          r: 2,
          nb: 'António Guterres, ancien Premier ministre du Portugal, est le 9e Secrétaire général de l\'ONU. Il a pris ses fonctions le 1er janvier 2017 et a été reconduit pour un second mandat en 2021. Il est à ce jour le secrétaire général en exercice.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression idiomatique « faire flèche de tout bois » ?',
          choices: ['Utiliser exclusivement des ressources naturelles', 'Persévérer sans jamais changer de méthode', 'Employer tous les moyens disponibles pour atteindre un objectif', 'Agir avec précipitation et sans réflexion préalable'],
          r: 2,
          nb: '« Faire flèche de tout bois » signifie exploiter toutes les ressources disponibles, quelles qu\'elles soient, pour parvenir à ses fins. Cette locution imagée fait référence à l\'art de tailler des flèches même dans du bois de mauvaise qualité lorsqu\'on manque de matériaux de qualité.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut le premier Secrétaire général de l\'Organisation des Nations Unies ?',
          choices: ['Dag Hammarskjöld (Suède)', 'Trygve Lie (Norvège)', 'U Thant (Birmanie)', 'Kurt Waldheim (Autriche)'],
          r: 1,
          nb: 'Le Norvégien Trygve Lie (1896-1968) fut le premier Secrétaire général de l\'ONU, poste qu\'il occupa de 1946 à 1952. Il contribua à l\'établissement des premières procédures de fonctionnement de cette organisation internationale créée après la Seconde Guerre mondiale.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la caractéristique principale d\'un impôt progressif ?',
          choices: ['Il est prélevé uniquement sur les produits importés', 'Son taux augmente proportionnellement à la base imposable', 'Il frappe de façon uniforme tous les contribuables', 'Il est exclusivement destiné aux salaires des fonctionnaires'],
          r: 1,
          nb: 'Un impôt est dit progressif lorsque son taux augmente en fonction de la base imposable (revenu, patrimoine). Plus le contribuable gagne, plus le taux appliqué est élevé. Ce mécanisme vise une plus grande équité fiscale, chacun contribuant selon sa capacité financière réelle.'
        },
        {
          type: 'qcm4',
          q: 'Combien de ministres d\'État comptait le gouvernement burkinabè dirigé par Jean Rimtalba Emmanuel Ouédraogo sous le MPSR II ?',
          choices: ['2 ministres d\'État', '3 ministres d\'État', '4 ministres d\'État', '5 ministres d\'État'],
          r: 1,
          nb: 'Le gouvernement de Jean Rimtalba Emmanuel Ouédraogo, Premier ministre sous le MPSR II (Mouvement Patriotique pour la Sauvegarde et la Restauration), comprenait 3 ministres d\'État. Ce titre honorifique est attribué à des ministres chargés de portefeuilles stratégiques ou dotés d\'une importance hiérarchique particulière.'
        },
        {
          type: 'qcm4',
          q: 'L\'adrénaline est une hormone principalement sécrétée par :',
          choices: ['Le foie', 'Le pancréas', 'Les glandes surrénales', 'La rate'],
          r: 2,
          nb: 'L\'adrénaline (ou épinéphrine) est produite par la médullosurrénale, partie interne des glandes surrénales situées au-dessus des reins. Elle est libérée en réponse au stress ou au danger, provoquant une accélération cardiaque, une dilatation des bronches et une mobilisation rapide de l\'énergie.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur de l\'œuvre littéraire burkinabè intitulée « La Triade du Sang » ?',
          choices: ['Pierre Claver Ilboudo', 'Dramane Konaté', 'Mahamadi Kologo', 'Joseph Ki-Zerbo'],
          r: 1,
          nb: '« La Triade du Sang » est une œuvre de Dramane Konaté, auteur burkinabè, publiée en 2017. Elle traite de la montée de l\'extrémisme violent et du terrorisme au Burkina Faso à travers une fiction ancrée dans les réalités sécuritaires contemporaines du pays.'
        },
        {
          type: 'qcm4',
          q: 'Combien de sites burkinabè sont inscrits au patrimoine mondial de l\'UNESCO à ce jour ?',
          choices: ['2 sites', '3 sites', '4 sites', '5 sites'],
          r: 2,
          nb: 'Le Burkina Faso compte 4 sites inscrits au patrimoine mondial de l\'UNESCO : les Ruines de Loropéni (2009), le complexe naturel W-Arly-Pendjari (2017), les sites de métallurgie ancienne du fer (2018) et la Cour royale de Tiébélé (2024), la plus récente inscription.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le nombre total de vertèbres chez l\'être humain adulte ?',
          choices: ['25 vertèbres', '30 vertèbres', '33 vertèbres', '36 vertèbres'],
          r: 2,
          nb: 'Le squelette axial humain comprend 33 vertèbres : 7 cervicales, 12 thoraciques, 5 lombaires, 5 sacrées (soudées en sacrum) et 4 coccygiennes (soudées en coccyx). Cette fusion des vertèbres inférieures explique qu\'un adulte en perçoive moins que le nourrisson.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle ARCEP au Burkina Faso ?',
          choices: ['Agence de Régulation des Communications Électroniques en Politique', 'Autorité de Régulation des Communications Électroniques et des Postes', 'Association Régionale des Communications et de l\'Éducation Publique', 'Agence des Réformes pour les Communications et l\'Économie Populaire'],
          r: 1,
          nb: 'L\'ARCEP, Autorité de Régulation des Communications Électroniques et des Postes, est l\'organe indépendant chargé de réguler le secteur des télécommunications et des services postaux au Burkina Faso. Elle veille à la concurrence loyale, à la qualité des services et à la protection des utilisateurs.'
        },
        {
          type: 'qcm4',
          q: 'Quelle ville est surnommée « la Ville éternelle » ?',
          choices: ['Paris (France)', 'Athènes (Grèce)', 'Rome (Italie)', 'Madrid (Espagne)'],
          r: 2,
          nb: 'Rome, capitale de l\'Italie, est surnommée « la Ville éternelle » (Urbs Aeterna) depuis l\'Antiquité. Ce titre reflète son importance historique, politique, artistique et religieuse inégalée, ainsi que la permanence de son influence à travers les siècles jusqu\'à nos jours.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle TVA ?',
          choices: ['Tarif de Vente Agricole', 'Taux de Vente Annuelle', 'Taxation Variable Autorisée', 'Taxe sur la Valeur Ajoutée'],
          r: 3,
          nb: 'La TVA (Taxe sur la Valeur Ajoutée) est un impôt indirect collecté à chaque étape de la chaîne de production et de distribution, mais supporté in fine par le consommateur final. C\'est l\'une des principales recettes fiscales des États modernes.'
        },
        {
          type: 'qcm4',
          q: 'Combien d\'États fédérés compte la République fédérale du Nigeria ?',
          choices: ['26 États', '35 États', '36 États', '42 États'],
          r: 2,
          nb: 'Le Nigeria est organisé en une fédération de 36 États et un Territoire de la Capitale Fédérale (FCT) d\'Abuja. C\'est la plus grande fédération d\'Afrique de l\'Ouest, avec une population dépassant 200 millions d\'habitants, et la première économie du continent africain.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le participe passé du verbe « moudre » ?',
          choices: ['Moud', 'Moulu', 'Moudu', 'Moudré'],
          r: 1,
          nb: 'Le verbe « moudre » (3e groupe) a pour participe passé « moulu ». On l\'utilise dans des expressions courantes telles que « café moulu », « poivre moulu » ou « être moulu de fatigue ». Les formes « moudu » ou « moudré » sont incorrectes et n\'existent pas en français.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le résultat du triple du tiers de 99 ?',
          choices: ['33', '66', '99', '132'],
          r: 2,
          nb: 'Le tiers de 99 = 99 ÷ 3 = 33. Le triple de 33 = 33 × 3 = 99. Le résultat est donc 99. Ce calcul illustre un principe mathématique simple : tripler le tiers d\'un nombre revient toujours à retrouver ce nombre de départ.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la durée légale hebdomadaire de travail au Burkina Faso selon le Code du travail ?',
          choices: ['35 heures', '40 heures', '45 heures', '48 heures'],
          r: 1,
          nb: 'Selon le Code du travail du Burkina Faso, la durée légale de travail est fixée à 40 heures par semaine. Tout dépassement constitue des heures supplémentaires, soumises à une majoration de salaire réglementée par la loi.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle FODEL dans le secteur de l\'élevage au Burkina Faso ?',
          choices: ['Fonds de Développement de l\'Élevage', 'Fédération pour l\'Organisation de l\'Élevage Local', 'Fonds de Dotation pour l\'Économie du Lait', 'Front pour le Développement des Éleveurs Locaux'],
          r: 0,
          nb: 'Le FODEL, Fonds de Développement de l\'Élevage, est une structure burkinabè dédiée au financement de projets dans le secteur de l\'élevage. Il soutient les éleveurs dans l\'amélioration de leur production animale et contribue au développement économique rural national.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces périodes préhistoriques correspond à l\'âge de la pierre taillée ?',
          choices: ['Le Néolithique', 'Le Paléolithique', 'L\'âge du bronze', 'L\'âge du fer'],
          r: 1,
          nb: 'Le Paléolithique (du grec « paleo » = ancien et « lithos » = pierre) est la première période de la préhistoire, caractérisée par la fabrication d\'outils grossiers en pierre taillée. Il s\'étend d\'environ 3 millions d\'années av. J.-C. jusqu\'à environ 10 000 ans av. J.-C. Le Néolithique qui lui succède est marqué par la pierre polie.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la valeur numérique des chiffres romains M, L et I ?',
          choices: ['M = 500, L = 100, I = 1', 'M = 1000, L = 100, I = 10', 'M = 1000, L = 50, I = 1', 'M = 500, L = 50, I = 10'],
          r: 2,
          nb: 'Dans le système de numération romain : M = 1 000, L = 50, I = 1. Les autres valeurs essentielles sont : C = 100, D = 500, V = 5 et X = 10. Ce système, hérité de l\'Antiquité romaine, est encore utilisé pour les numéros de chapitres, les millésimes architecturaux et certaines notations officielles.'
        },
        {
          type: 'qcm4',
          q: 'En appliquant la logique de codage : CAMION = 295743, quelle est la valeur codée de MANIOC ?',
          choices: ['293574', '593742', '295437', '437295'],
          r: 1,
          nb: 'À chaque lettre de CAMION est attribué un chiffre : C=2, A=9, M=5, I=7, O=4, N=3. En appliquant ces correspondances à MANIOC : M=5, A=9, N=3, I=7, O=4, C=2. Le code obtenu est donc 593742.'
        }
      ]
    },
    {
      id: 'session_2025_08_02',
      date: '2025-08-01',
      titre: 'Session N°1 de août 2025',
      numero: 1,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Quel est le terme suivant dans la suite numérique : 75 – 77 – 79 – 81 – 83 – ?',
          choices: ['84', '85', '86', '87'],
          r: 1,
          nb: 'Cette suite est une progression arithmétique de raison 2 (suite de nombres impairs consécutifs). Chaque terme est obtenu en ajoutant 2 au précédent : 75, 77, 79, 81, 83, et donc 83 + 2 = 85.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression idiomatique « faire chou blanc » ?',
          choices: ['Réussir brillamment une épreuve difficile', 'Agir avec beaucoup d\'hésitation et de prudence', 'Échouer complètement sans obtenir le moindre résultat', 'Prendre une décision de manière précipitée'],
          r: 2,
          nb: '« Faire chou blanc » signifie échouer totalement dans une tentative ou ne rien obtenir malgré ses efforts. Cette locution ancienne s\'emploie pour décrire une démarche infructueuse (négociation échouée, recherche vaine, tentative sans résultat).'
        },
        {
          type: 'qcm4',
          q: 'À quelle date la Seconde Guerre mondiale a-t-elle officiellement pris fin ?',
          choices: ['8 mai 1945', '6 août 1945', '2 septembre 1945', '31 décembre 1945'],
          r: 2,
          nb: 'La Seconde Guerre mondiale s\'est officiellement terminée le 2 septembre 1945, avec la signature de la capitulation du Japon à bord du cuirassé américain USS Missouri dans la baie de Tokyo. La capitulation de l\'Allemagne nazie avait eu lieu le 8 mai 1945, mettant fin aux combats sur le front européen.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus grand barrage du Burkina Faso, largement utilisé pour la pêche en eaux douces ?',
          choices: ['Barrage de Loumbila', 'Barrage de Kompienga', 'Barrage de Samandéni', 'Barrage de Bagré'],
          r: 3,
          nb: 'Le barrage de Bagré est le plus grand ouvrage hydraulique du Burkina Faso. Situé sur le fleuve Nakanbé dans la province du Boulgou, il constitue le principal site de pêche continentale du pays, en plus de ses fonctions d\'irrigation agricole et de production d\'énergie hydroélectrique.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le sigle PIB en économie ?',
          choices: ['Produit Industriel Brut', 'Produit Intérieur Brut', 'Plan d\'Investissement Budgétaire', 'Prix Indicatif de Base'],
          r: 1,
          nb: 'Le PIB, ou Produit Intérieur Brut, est l\'indicateur macroéconomique de référence. Il mesure la valeur totale des biens et services produits sur le territoire d\'un pays au cours d\'une période donnée (généralement une année). Il permet d\'évaluer le niveau de développement et la taille de l\'économie d\'un pays.'
        },
        {
          type: 'qcm4',
          q: 'Selon le 5e Recensement Général de la Population et de l\'Habitation (RGPH 5) réalisé en 2019, quelle était la population du Burkina Faso ?',
          choices: ['Environ 18 millions d\'habitants', 'Environ 19,6 millions d\'habitants', 'Environ 20,5 millions d\'habitants', 'Environ 22,3 millions d\'habitants'],
          r: 2,
          nb: 'Le RGPH 5, réalisé en novembre-décembre 2019, a dénombré 20 487 979 habitants au Burkina Faso, soit environ 20,5 millions. Ce recensement constitue la source officielle de référence pour les statistiques démographiques nationales utilisées dans la planification des politiques publiques.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la nationalité de l\'écrivain Jean-Marie Adiaffi ?',
          choices: ['Burkinabè', 'Sénégalaise', 'Ivoirienne', 'Camerounaise'],
          r: 2,
          nb: 'Jean-Marie Adiaffi (1941-1999) était un écrivain et poète de nationalité ivoirienne. Figure majeure de la littérature africaine francophone, il est notamment connu pour son roman « La Carte d\'identité » (1980) et pour son engagement en faveur de la valorisation des cultures africaines.'
        },
        {
          type: 'qcm4',
          q: 'À quel genre littéraire appartiennent les œuvres « Quote-part » et « Symphonie » de la Burkinabè Bernadette Sanou Dao ?',
          choices: ['Roman', 'Poésie', 'Théâtre', 'Nouvelle'],
          r: 1,
          nb: 'Bernadette Sanou Dao est une poétesse burkinabè reconnue sur la scène littéraire africaine. « Quote-part » et « Symphonie » sont deux recueils de poèmes dans lesquels elle explore des thèmes tels que la condition féminine, l\'identité africaine et les réalités sociales du Burkina Faso.'
        },
        {
          type: 'qcm4',
          q: 'Combien d\'articles comporte la Charte des Nations Unies ?',
          choices: ['95 articles', '101 articles', '111 articles', '120 articles'],
          r: 2,
          nb: 'La Charte des Nations Unies, adoptée à San Francisco le 26 juin 1945 et entrée en vigueur le 24 octobre 1945, comprend 111 articles répartis en 19 chapitres. Elle constitue le traité fondateur de l\'ONU et définit ses buts, ses principes et ses principaux organes.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression « agir avec parcimonie » ?',
          choices: ['Agir avec une grande générosité', 'Agir avec excès et précipitation', 'Agir avec modération', 'Agir avec autorité et fermeté'],
          r: 2,
          nb: 'La parcimonie désigne une économie rigoureuse dans l\'utilisation des ressources. « Agir avec parcimonie » signifie employer ses ressources (argent, temps, paroles) avec mesure et retenue. Ce terme peut avoir une connotation positive (prudence et sobriété) ou négative (avarice excessive).'
        },
        {
          type: 'qcm4',
          q: 'Quel dieu de l\'Égypte antique est associé à l\'embaumement et aux rites funéraires ?',
          choices: ['Osiris', 'Rê', 'Horus', 'Anubis'],
          r: 3,
          nb: 'Anubis est le dieu égyptien représenté avec une tête de chacal. Il préside aux rites funéraires, à la momification et guide les âmes des défunts dans l\'au-delà. Selon la mythologie, il pèse le cœur des défunts sur la balance de Maât lors du jugement final.'
        },
        {
          type: 'qcm4',
          q: 'Dans quel pays se situe le mont Kilimandjaro, plus haut sommet du continent africain ?',
          choices: ['Kenya', 'Éthiopie', 'Tanzanie', 'Ouganda'],
          r: 2,
          nb: 'Le Kilimandjaro (5 895 m) est situé en Tanzanie, à proximité de la frontière avec le Kenya. C\'est un massif volcanique composé de trois cônes. Son sommet principal, l\'Uhuru Peak, est le point culminant de l\'Afrique. Il attire chaque année des milliers d\'alpinistes du monde entier.'
        },
        {
          type: 'qcm4',
          q: 'Quel explorateur européen est généralement cité comme le premier à avoir traversé le territoire de la Haute-Volta ?',
          choices: ['René Caillé (France)', 'Mungo Park (Écosse)', 'Heinrich Barth (Allemagne)', 'David Livingstone (Écosse)'],
          r: 2,
          nb: 'L\'explorateur allemand Heinrich Barth (1821-1865) a traversé ce qui allait devenir la Haute-Volta lors de son expédition africaine de 1850 à 1855, conduite sous mandat britannique dans le cadre de la lutte contre la traite des esclaves. Son voyage l\'a mené à travers de nombreuses régions d\'Afrique de l\'Ouest.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le premier Burkinabè à avoir reçu le Grand Prix littéraire d\'Afrique noire ?',
          choices: ['Norbert Zongo', 'Pierre Claver Ilboudo', 'Gomdaogo Patrick Ilboudo', 'Titinga Frédéric Pacéré'],
          r: 3,
          nb: 'Titinga Frédéric Pacéré est le premier Burkinabè à avoir reçu le Grand Prix littéraire d\'Afrique noire, en 1982, pour ses recueils « Poèmes pour l\'Angola » et « La Poésie des griots ». Le second Burkinabè à obtenir cette distinction est Gomdaogo Patrick Ilboudo en 1992 pour « Le Héraut têtu ».'
        },
        {
          type: 'qcm4',
          q: 'En sciences, que désigne le concept de « système pseudo-isolé » ?',
          choices: ['Un système totalement fermé, sans aucun échange avec l\'extérieur', 'Un système qui échange de la chaleur mais jamais de matière', 'Un système apparemment isolé, mais qui échange en réalité de l\'énergie ou de la matière avec son environnement', 'Un système entièrement artificiel créé en laboratoire'],
          r: 2,
          nb: 'Un système pseudo-isolé est un système qui donne l\'apparence de l\'isolement, mais qui entretient des échanges (d\'énergie ou de matière) avec son environnement. Ce concept est utilisé en physique, en écologie et en sciences de l\'environnement pour modéliser des situations complexes de façon simplifiée.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie le terme « mansuétude » ?',
          choices: ['Sévérité et intransigeance dans les décisions', 'Douceur, indulgence et bienveillance envers autrui', 'Arrogance et mépris des autres', 'Prudence excessive dans les jugements et les actes'],
          r: 1,
          nb: 'La mansuétude désigne une disposition d\'esprit douce et clémente, caractérisée par l\'indulgence face aux fautes et la bienveillance envers autrui. Ce terme de registre soutenu s\'oppose à la sévérité et à l\'intransigeance. On dit d\'un juge clément qu\'il fait preuve de mansuétude.'
        },
        {
          type: 'qcm4',
          q: 'À quelle école philosophique de l\'Antiquité grecque renvoie l\'expression « Philosophie du Jardin » ?',
          choices: ['Le stoïcisme', 'Le platonisme', 'L\'épicurisme', 'Le cynisme'],
          r: 2,
          nb: 'La « Philosophie du Jardin » désigne l\'école philosophique fondée par Épicure (341-270 av. J.-C.) à Athènes. Épicure enseignait dans son jardin (Képos), promouvant la recherche du bonheur par la modération, l\'amitié et l\'ataraxie (absence de trouble de l\'âme). Cette école s\'oppose notamment au stoïcisme.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'un des thèmes majeurs du roman « Les Soleils des indépendances » d\'Ahmadou Kourouma ?',
          choices: ['La résistance à la colonisation européenne', 'La guerre civile en Afrique de l\'Ouest', 'Le conflit entre tradition et modernité', 'L\'exil et la nostalgie des immigrants africains'],
          r: 2,
          nb: '« Les Soleils des indépendances » (1968) d\'Ahmadou Kourouma peint le désenchantement de l\'Afrique post-coloniale. Le thème central est le conflit entre la tradition (représentée par Fama, prince déchu) et la modernité (les nouvelles nations qui rejettent les structures anciennes), avec également l\'autoritarisme politique en arrière-plan.'
        },
        {
          type: 'qcm4',
          q: 'Selon Jean-Jacques Rousseau, qu\'est-ce que la conscience morale ?',
          choices: ['Une construction sociale acquise uniquement par l\'éducation', 'Un code éthique établi par les institutions et les lois', 'Une voix intérieure naturelle et innée permettant de distinguer le bien du mal', 'Un sentiment rationnel développé exclusivement par la philosophie'],
          r: 2,
          nb: 'Pour Rousseau, la conscience morale est une disposition naturelle et innée, antérieure à toute éducation et à toute convention sociale. C\'est cette « voix intérieure » qui guide spontanément l\'être humain vers le bien. Cette conception s\'oppose au rationalisme de Kant, pour qui la morale est fondée sur la raison.'
        },
        {
          type: 'qcm4',
          q: 'Dans la versification française, que désigne le « mètre » d\'un poème ?',
          choices: ['Le nombre de strophes dans un poème', 'Le schéma des rimes utilisées (croisées, embrassées, suivies)', 'Le nombre de syllabes composant chaque vers', 'La ponctuation rythmique à l\'intérieur d\'un vers'],
          r: 2,
          nb: 'Le mètre est l\'unité de mesure fondamentale d\'un vers poétique. Il correspond au nombre de syllabes que contient chaque vers. Ainsi, l\'alexandrin est un vers de 12 syllabes, l\'octosyllabe en compte 8, le décasyllabe 10. Le mètre détermine le rythme et la musicalité d\'un poème.'
        },
        {
          type: 'qcm4',
          q: 'Quelle civilisation antique est reconnue comme la première à avoir élaboré un calendrier solaire de 365 jours ?',
          choices: ['La Mésopotamie (Sumer et Babylone)', 'La Grèce antique', 'Rome antique', 'L\'Égypte antique'],
          r: 3,
          nb: 'L\'Égypte antique est la première civilisation à avoir institué un calendrier de 365 jours, remontant à environ 4241 av. J.-C. Fondé sur le cycle solaire et les crues du Nil, ce calendrier était divisé en 12 mois de 30 jours, auxquels s\'ajoutaient 5 jours complémentaires.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la contribution approximative du secteur tertiaire au PIB du Burkina Faso ?',
          choices: ['Environ 20 %', 'Environ 30 %', 'Environ 45 %', 'Environ 65 %'],
          r: 2,
          nb: 'Le secteur tertiaire (services, commerce, transport, administration, télécommunications) représente environ 45 % du PIB du Burkina Faso. Il constitue le secteur dominant en termes de contribution au PIB national, devant le secteur primaire (agriculture, élevage, mines) et le secteur secondaire (industries).'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'adverbe « subrepticement » ?',
          choices: ['Ouvertement et avec ostentation', 'Secrètement, furtivement, en se dissimulant', 'Rapidement et sans réflexion préalable', 'Avec une grande lenteur et beaucoup de précaution'],
          r: 1,
          nb: '« Subrepticement » qualifie une action effectuée de façon secrète, discrète et furtive, sans attirer l\'attention. C\'est agir à la dérobée, dans l\'ombre, sans laisser de trace apparente. Ce terme appartient à un registre de langue soutenu ou littéraire.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus long fleuve du Burkina Faso ?',
          choices: ['Le Nakanbé (Volta Blanche)', 'Le Nazinon (Volta Rouge)', 'Le Mouhoun (Volta Noire)', 'La Comoé'],
          r: 2,
          nb: 'Le Mouhoun, anciennement appelé Volta Noire, est le plus long fleuve du Burkina Faso, avec environ 1 352 km de longueur. Il prend sa source dans les hauts plateaux du pays et joue un rôle hydrologique et agricole majeur pour plusieurs régions traversées.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus long fleuve d\'Afrique de l\'Ouest ?',
          choices: ['Le fleuve Sénégal (environ 1 800 km)', 'La Volta (environ 1 600 km)', 'Le Congo (environ 4 700 km)', 'Le Niger (environ 4 180 km)'],
          r: 3,
          nb: 'Le fleuve Niger, avec environ 4 180 km de longueur, est le plus long fleuve d\'Afrique de l\'Ouest et le 3e d\'Afrique. Il prend sa source en Guinée, traverse le Mali, le Niger et le Nigeria avant de se jeter dans le golfe de Guinée. Il est vital pour les populations riveraines de plusieurs pays.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le plus grand barrage hydroélectrique d\'Afrique en termes de capacité de production ?',
          choices: ['Le barrage d\'Assouan (Égypte)', 'Le barrage d\'Inga (République Démocratique du Congo)', 'Le Grand Barrage de la Renaissance éthiopienne (GERD)', 'Le barrage de Kariba (Zimbabwe-Zambie)'],
          r: 2,
          nb: 'Le Grand Barrage de la Renaissance éthiopienne (GERD), construit sur le Nil Bleu, est le plus grand barrage hydroélectrique d\'Afrique avec une capacité installée d\'environ 6 450 MW. Sa construction a suscité des tensions régionales importantes, notamment avec l\'Égypte et le Soudan.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'affirmation philosophique : « Le bonheur est un idéal de l\'imagination » ?',
          choices: ['Le bonheur est totalement inaccessible à l\'être humain', 'Le bonheur idéal est davantage imaginé et projeté que réellement vécu', 'Le bonheur n\'existe que dans les œuvres d\'art et la création', 'Le bonheur dépend exclusivement de nos conditions matérielles de vie'],
          r: 1,
          nb: 'Cette formule attribuée au philosophe Emmanuel Kant exprime que le bonheur tel que nous l\'envisageons est toujours une construction mentale, un idéal projeté vers l\'avenir. La réalité du bonheur vécu est souvent différente de l\'image que nous en forgeons, car l\'imagination projette un état de perfection que l\'expérience ne peut pleinement satisfaire.'
        },
        {
          type: 'qcm4',
          q: 'Dire d\'une personne qu\'elle est « mince » plutôt que « maigre » constitue quelle figure de style ?',
          choices: ['Un euphémisme', 'Une litote', 'Une périphrase', 'Un oxymore'],
          r: 0,
          nb: 'L\'euphémisme consiste à remplacer un mot considéré comme trop brutal ou péjoratif par un terme plus doux ou valorisant. Dire « mince » à la place de « maigre » adoucit la connotation négative. À distinguer de la litote (qui dit moins pour suggérer plus) et de la périphrase (qui remplace un mot par plusieurs).'
        },
        {
          type: 'qcm4',
          q: '« Aux âmes bien nées, la valeur n\'attend point le nombre des années. » À quelle œuvre et à quel auteur appartient cette célèbre citation ?',
          choices: ['« Phèdre » de Jean Racine', '« Le Cid » de Pierre Corneille', '« Andromaque » de Jean Racine', '« Horace » de Pierre Corneille'],
          r: 1,
          nb: 'Cette réplique est tirée du « Cid » (1637) de Pierre Corneille, prononcée par le personnage de Don Diègue. Elle signifie que le véritable mérite et la bravoure ne dépendent pas de l\'âge, mais du caractère et de la noblesse d\'âme. C\'est l\'une des citations les plus connues du théâtre classique français.'
        },
        {
          type: 'qcm4',
          q: 'En versification française, que désigne la « césure » d\'un vers ?',
          choices: ['La rime finale d\'un vers', 'Le nombre de syllabes composant un vers', 'La pause rythmique divisant un vers en deux hémistiches', 'Le regroupement de plusieurs vers en une strophe'],
          r: 2,
          nb: 'La césure est une pause rythmique obligatoire à l\'intérieur d\'un vers, divisant celui-ci en deux hémistiches. Dans l\'alexandrin (12 syllabes), la césure intervient après la 6e syllabe, créant deux hémistiches de 6 syllabes chacun (6//6). Elle est un élément fondamental du rythme et de la musicalité en poésie classique.'
        },
        {
          type: 'qcm4',
          q: 'Dans une œuvre théâtrale, que désigne le terme « didascalie » ?',
          choices: ['Le monologue final du personnage principal', 'Les indications scéniques écrites par l\'auteur pour guider la mise en scène et le jeu des acteurs', 'Le résumé de chaque acte de la pièce', 'Le dialogue central entre les deux personnages principaux'],
          r: 1,
          nb: 'Les didascalies sont les indications que l\'auteur dramatique inscrit dans le texte pour guider les acteurs et le metteur en scène. Elles précisent les déplacements, les gestes, le ton, le décor, les costumes ou les effets sonores. Elles constituent le texte secondaire de la pièce, par opposition aux répliques (texte principal).'
        },
        {
          type: 'qcm4',
          q: 'En analyse littéraire, que désigne le concept de « paratexte » ?',
          choices: ['Le texte central et principal d\'une œuvre littéraire', 'Les notes de bas de page uniquement', 'L\'ensemble des éléments qui entourent le texte principal', 'La biographie de l\'auteur insérée dans l\'ouvrage'],
          r: 2,
          nb: 'Le paratexte, concept théorisé par Gérard Genette, désigne tout ce qui entoure et accompagne le texte principal sans en faire partie intégrante : le titre, le sous-titre, la préface, la postface, les notes, la dédicace et la quatrième de couverture. Il influence la réception et l\'interprétation du texte par le lecteur.'
        },
        {
          type: 'qcm4',
          q: 'Que désigne la discipline scientifique appelée « exobiologie » ?',
          choices: ['L\'étude des organismes vivants dans les milieux extrêmes de la Terre', 'La science qui étudie la possibilité de l\'existence de vie en dehors de la Terre', 'L\'étude de la biologie des espèces animales exotiques', 'La branche de la médecine traitant des maladies rares et inconnues'],
          r: 1,
          nb: 'L\'exobiologie, également appelée astrobiologie, est la discipline scientifique qui étudie la possibilité de l\'existence de vie au-delà de la Terre. Elle combine des connaissances en biologie, chimie, astrophysique et planétologie pour rechercher les conditions favorables à la vie dans l\'univers.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la signification du préfixe grec « hol(o)- » que l\'on retrouve dans des mots comme « hologramme » ou « holistique » ?',
          choices: ['Demi, partiel, incomplet', 'Autour de, en cercle', 'Tout, entier, global', 'Lumière, clarté, transparent'],
          r: 2,
          nb: 'Le préfixe « hol(o)- » vient du grec « holos » signifiant « tout » ou « entier ». On le retrouve dans : hologramme (image complète en trois dimensions), holistique (qui considère un système dans sa globalité), holocauste (sacrifice total). Il s\'oppose à des préfixes comme « hémi- » (demi) ou « méro- » (partiel).'
        },
        {
          type: 'qcm4',
          q: 'Qui fut le premier président de la République du Mali après son indépendance en 1960 ?',
          choices: ['Moussa Traoré', 'Alpha Oumar Konaré', 'Modibo Keïta', 'Amadou Toumani Touré'],
          r: 2,
          nb: 'Modibo Keïta (1915-1977), instituteur de formation et militant politique, diplômé de l\'École normale William Ponty de Dakar, fut le premier président du Mali indépendant. Il dirigea le pays de 1960 à 1968, date à laquelle il fut renversé par un coup d\'État militaire conduit par Moussa Traoré.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la définition anatomique correcte du larynx ?',
          choices: ['Organe digestif situé entre l\'œsophage et l\'estomac', 'Organe respiratoire situé entre le pharynx et la trachée, siège des cordes vocales', 'Glande endocrine située dans la gorge, sécrétant des hormones thyroïdiennes', 'Muscle à la base de la langue facilitant la déglutition'],
          r: 1,
          nb: 'Le larynx est un organe creux composé de cartilages, situé dans la partie antérieure du cou, entre le pharynx (en haut) et la trachée (en bas). Il assure deux fonctions essentielles : la phonation (production de la voix grâce aux cordes vocales) et la protection des voies aériennes lors de la déglutition.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la différence fondamentale entre un alcane et un alcène en chimie organique ?',
          choices: ['L\'alcane contient de l\'azote ; l\'alcène n\'en contient pas', 'L\'alcane est liquide à température ambiante ; l\'alcène est toujours gazeux', 'L\'alcane est un hydrocarbure saturé (liaisons simples C-C) ; l\'alcène est insaturé (au moins une double liaison C=C)', 'L\'alcane est combustible ; l\'alcène ne brûle pas'],
          r: 2,
          nb: 'Les alcanes sont des hydrocarbures saturés dont les atomes de carbone sont reliés uniquement par des liaisons simples (C-C), de formule générale CₙH₂ₙ₊₂. Les alcènes sont des hydrocarbures insaturés comportant au moins une double liaison carbone-carbone (C=C), de formule générale CₙH₂ₙ. Exemple : éthane (alcane) vs éthylène (alcène).'
        },
        {
          type: 'qcm4',
          q: 'Quelle lettre complète logiquement la série : U – D – T – Q – C – S – S – H – ?',
          choices: ['D', 'I', 'N', 'V'],
          r: 2,
          nb: 'Chaque lettre est l\'initiale du nom d\'un nombre en français : U=Un, D=Deux, T=Trois, Q=Quatre, C=Cinq, S=Six, S=Sept, H=Huit. La lettre suivante correspond au chiffre Neuf, dont l\'initiale est N. La réponse est donc N.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la définition correcte d\'un oxydant en chimie ?',
          choices: ['Une substance qui cède des électrons à une autre lors d\'une réaction', 'Une substance qui capte des électrons et provoque l\'oxydation d\'une autre substance', 'Un catalyseur qui accélère les réactions chimiques sans y participer directement', 'Une substance qui libère de l\'oxygène exclusivement en milieu acide'],
          r: 1,
          nb: 'Un oxydant (ou agent oxydant) est une espèce chimique capable de capter des électrons lors d\'une réaction d\'oxydoréduction. Ce faisant, il provoque l\'oxydation de la substance qui lui cède ces électrons (le réducteur), tandis que lui-même se réduit. Exemples d\'oxydants courants : O₂, Cl₂, MnO₄⁻.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces affirmations est FAUSSE concernant l\'industrie en Afrique de l\'Ouest humide et côtière ?',
          choices: ['La région dispose d\'abondantes matières premières agricoles et minières', 'La région bénéficie d\'importants capitaux industriels propres', 'La région dispose d\'une main-d\'œuvre nombreuse et disponible', 'La région possède des ressources énergétiques (pétrole, hydroélectricité)'],
          r: 1,
          nb: 'L\'Afrique de l\'Ouest humide et côtière dispose effectivement de nombreuses matières premières, d\'une main-d\'œuvre abondante et de ressources énergétiques. En revanche, le financement industriel (capitaux propres) reste insuffisant et dépendant des investissements étrangers, ce qui freine considérablement son développement industriel.'
        },
        {
          type: 'qcm4',
          q: 'Comment se nomme l\'usine burkinabè de transformation industrielle de tomates implantée à Yako ?',
          choices: ['FASO TOMATE', 'SOFATO', 'TOMABF', 'UNATOM'],
          r: 1,
          nb: 'La SOFATO (Société Faso Tomate) est une unité industrielle burkinabè implantée à Yako, dans la province du Passoré. Elle a pour vocation la transformation locale de tomates fraîches en concentré de tomate, valorisant ainsi la production maraîchère nationale et réduisant les importations.'
        },
        {
          type: 'qcm4',
          q: 'Qui a remporté le Kundé d\'or lors de la cérémonie des Kundé 2025 au Burkina Faso ?',
          choices: ['Smockey', 'Dez Altino', 'Floby', 'Black So Man'],
          r: 2,
          nb: 'Floby a remporté le Kundé d\'or en 2025, s\'offrant ainsi son 3e trophée après ceux obtenus en 2010 et 2019. Les Kundé constituent les récompenses musicales les plus prestigieuses du Burkina Faso, décernées annuellement pour honorer l\'excellence des artistes burkinabè.'
        },
        {
          type: 'qcm4',
          q: 'Qui fut le premier président de la République de Haute-Volta après l\'indépendance du 5 août 1960 ?',
          choices: ['Gérard Kango Ouédraogo', 'Sangoulé Lamizana', 'Maurice Yaméogo', 'Joseph Ki-Zerbo'],
          r: 2,
          nb: 'Maurice Yaméogo (1921-1993) fut le premier président de la République de Haute-Volta à partir de l\'indépendance le 5 août 1960. Il instaura rapidement un régime à parti unique avant d\'être renversé par un coup d\'État militaire en janvier 1966, conduit par le général Sangoulé Lamizana.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la formule générale des alcènes ?',
          choices: ['CₙH₂ₙ₊₂', 'CₙH₂ₙ', 'CₙH₂ₙ₋₂', 'CₙHₙ'],
          r: 1,
          nb: 'Les alcènes ont pour formule générale CₙH₂ₙ, où n représente le nombre d\'atomes de carbone. Cette formule reflète leur caractère insaturé dû à la présence d\'une double liaison carbone-carbone (C=C). Exemples : éthylène (C₂H₄), propène (C₃H₆). À distinguer des alcanes (CₙH₂ₙ₊₂) et des alcynes (CₙH₂ₙ₋₂).'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la forme générale d\'une fonction affine ?',
          choices: ['f(x) = ax²', 'f(x) = a/x', 'f(x) = ax + b', 'f(x) = √x + b'],
          r: 2,
          nb: 'Une fonction affine est de la forme f(x) = ax + b, où a est le coefficient directeur (pente de la droite représentative) et b est l\'ordonnée à l\'origine. Quand b = 0, la fonction affine devient une fonction linéaire. Sa représentation graphique est toujours une droite.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est l\'équation bilan équilibrée de la réaction de synthèse de l\'eau ?',
          choices: ['H₂ + O₂ → H₂O', '2H₂ + O₂ → 2H₂O', 'H₂ + 2O₂ → 2H₂O', '4H + O₂ → 2H₂O'],
          r: 1,
          nb: 'La synthèse de l\'eau est une réaction exothermique entre le dihydrogène (H₂) et le dioxygène (O₂). L\'équation équilibrée est : 2H₂ + O₂ → 2H₂O. Elle respecte la conservation des atomes (4 atomes d\'H et 2 atomes d\'O de chaque côté de la flèche).'
        },
        {
          type: 'qcm4',
          q: 'Dans le domaine de l\'immunologie, que désigne le phénomène d\'agglutination ?',
          choices: ['La dissolution des globules rouges au contact d\'un sérum incompatible', 'La multiplication des globules blancs lors d\'une infection', 'Le regroupement de cellules ou particules sous l\'action d\'anticorps spécifiques', 'La séparation des composants du sang par centrifugation'],
          r: 2,
          nb: 'L\'agglutination est un phénomène immunologique par lequel des anticorps spécifiques (agglutinines) provoquent le regroupement visible de cellules ou d\'antigènes en amas. Ce mécanisme est notamment exploité dans les tests de groupage sanguin ABO et dans les techniques de diagnostic microbiologique.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est l\'écriture scientifique (notation en puissance de 10) du nombre 0,00089 ?',
          choices: ['8,9 × 10⁻³', '8,9 × 10⁻⁴', '89 × 10⁻⁵', '0,89 × 10⁻³'],
          r: 1,
          nb: 'Pour convertir 0,00089 en notation scientifique, on déplace la virgule de 4 rangs vers la droite pour obtenir un nombre compris entre 1 et 10 : 0,00089 = 8,9 × 10⁻⁴. Vérification : 8,9 × 10⁻⁴ = 8,9 ÷ 10 000 = 0,00089. ✓'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la fonction principale des leucocytes dans l\'organisme humain ?',
          choices: ['Transport de l\'oxygène des poumons vers les tissus', 'Coagulation du sang lors d\'une blessure', 'Assurer la défense immunitaire de l\'organisme', 'Production des hormones de croissance'],
          r: 2,
          nb: 'Les leucocytes, ou globules blancs, constituent la principale défense immunitaire de l\'organisme. Ils luttent contre les agents pathogènes (bactéries, virus, parasites) par différents mécanismes : phagocytose, production d\'anticorps, destruction des cellules infectées. On distingue plusieurs types : lymphocytes, monocytes et granulocytes.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date est célébrée la Journée mondiale de la santé ?',
          choices: ['22 mars', '5 juin', '7 avril', '10 octobre'],
          r: 2,
          nb: 'La Journée mondiale de la santé est célébrée chaque année le 7 avril, date anniversaire de la création de l\'Organisation mondiale de la santé (OMS) en 1948. Elle est placée sous un thème différent chaque année, visant à sensibiliser l\'opinion publique mondiale à une problématique sanitaire prioritaire.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la plus haute statue monumentale du continent africain ?',
          choices: ['La Grande Pyramide de Gizeh (Égypte)', 'La statue de la Liberté africaine (Tanzanie)', 'Le Monument de la Renaissance africaine (Sénégal)', 'L\'obélisque d\'Aksoum (Éthiopie)'],
          r: 2,
          nb: 'Le Monument de la Renaissance africaine, inauguré en 2010 à Dakar au Sénégal, est la plus haute statue d\'Afrique avec ses 52 mètres de hauteur. Il représente un homme tenant une femme et un enfant, symbolisant la renaissance du continent africain. C\'est également l\'une des plus grandes statues du monde.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les phrases suivantes, laquelle appartient au registre de langue familier ?',
          choices: ['Je n\'ai pas saisi cette décision', 'Tu me vois là ?', 'C\'est la galère', 'Ça me saoule'],
          r: 3,
          nb: '« Ça me saoule » est une expression du registre familier, voire populaire, signifiant « ça m\'agace profondément ». Elle se distingue des autres options : « Je n\'ai pas saisi » relève du registre soutenu ; « Tu me vois là ? » et « C\'est la galère » appartiennent au registre courant ou légèrement familier. Les registres de langue varient selon le contexte et l\'interlocuteur.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les mots suivants codés en anagrammes, lequel ne désigne PAS un aliment ?',
          choices: ['AITL', 'NPAI', 'RUIFT', 'LLOCE'],
          r: 3,
          nb: 'En décodant les anagrammes : AITL = LAIT (aliment), NPAI = PAIN (aliment), RUIFT = FRUIT (aliment), LLOCE = COLLE (produit adhésif non alimentaire). La colle est un matériau destiné à assembler des surfaces et non à la consommation alimentaire. La réponse est donc LLOCE.'
        }
      ]
    },
    {
      id: 'session_2026_06_02_1780401103814',
      date: '2025-07-20',
      titre: 'Session N°3 de Juillet  2025',
      numero: 9,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Quel trouble neurologique et développemental associe des tics moteurs involontaires, des vocalisations involontaires et des difficultés comportementales et langagières ?',
          choices: ['La dyslexie', 'Le syndrome de Gilles de la Tourette', 'La dysphasie', 'Le bégaiement'],
          r: 1,
          nb: 'Le syndrome de Gilles de la Tourette (SGT) est un trouble neuropsychiatrique débutant dans l\'enfance, caractérisé par des tics moteurs multiples (mouvements involontaires) et au moins un tic vocal (grognements, mots, coprolalie dans les cas sévères). Il s\'accompagne souvent de TOC, de TDAH et de difficultés d\'apprentissage. Son origine est neurobiologique.'
        },
        {
          type: 'qcm4',
          q: 'La phobie de vomir, qui touche fréquemment les enfants et les adolescents, est désignée par quel terme ?',
          choices: ['Hématophobie', 'Émétophobie', 'Nosophobie', 'Thanatophobie'],
          r: 1,
          nb: 'L\'émétophobie (du grec emetos = vomissement) est la peur irrationnelle et persistante de vomir ou d\'observer quelqu\'un vomir. La hématophobie est la peur du sang, la nosophobie la peur des maladies et la thanatophobie la peur de la mort.'
        },
        {
          type: 'qcm4',
          q: 'La prise en charge orthophonique vise principalement à :',
          choices: ['Prescrire des médicaments contre les troubles du langage', 'Adapter l\'environnement scolaire de l\'enfant', 'Rééduquer les compétences communicationnelles (parole, langage, voix, déglutition)', 'Réaliser des examens d\'imagerie cérébrale (IRM)'],
          r: 2,
          nb: 'L\'orthophonie (ou logopédie) est une profession paramédicale qui rééduque les troubles de la communication et du langage : troubles de la parole (dysarthrie, bégaiement), du langage oral et écrit (dyslexie, aphasie), de la voix et de la déglutition. L\'orthophoniste n\'est pas habilité à prescrire des médicaments ni à réaliser des examens d\'imagerie.'
        },
        {
          type: 'qcm4',
          q: 'Quelle était la profession principale de Joseph Ki-Zerbo, figure intellectuelle majeure du Burkina Faso ?',
          choices: ['Médecin', 'Ingénieur agronome', 'Historien', 'Astronaute'],
          r: 2,
          nb: 'Joseph Ki-Zerbo (1922-2006) est le grand historien burkinabè, auteur de « Histoire de l\'Afrique noire » (1972), référence fondamentale pour comprendre l\'histoire africaine. Penseur politique panafricaniste et opposant à la monoculture du coton, il a fondé plusieurs mouvements politiques et intellectuels. L\'Université de Ouagadougou porte son nom depuis 2015.'
        },
        {
          type: 'qcm4',
          q: 'Quelle durée de transition politique la CEDEAO avait-elle recommandée pour le Burkina Faso après le coup d\'État de 2022 ?',
          choices: ['24 mois', '36 mois', '12 mois', '18 mois'],
          r: 0,
          nb: 'La CEDEAO avait recommandé une période de transition de 24 mois maximum pour le Burkina Faso, selon l\'accord signé en août 2022. Le Burkina Faso, comme le Mali et le Niger, a depuis lors rejoint l\'Alliance des États du Sahel (AES), prenant ses distances avec la CEDEAO.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le premier producteur d\'arachides du continent africain ?',
          choices: ['Burkina Faso', 'Nigeria', 'Sénégal', 'Côte d\'Ivoire'],
          r: 1,
          nb: 'Le Nigeria est le premier producteur d\'arachides (cacahuètes) d\'Afrique, avec une production annuelle de plusieurs millions de tonnes. Il est suivi du Sénégal (traditionnellement appelé « pays de l\'arachide ») et du Soudan. L\'arachide constitue une culture vivrière et de rente importante dans toute la zone soudano-sahélienne d\'Afrique de l\'Ouest.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on l\'animal invertébré qui possède trois cœurs ?',
          choices: ['Le calmar géant', 'Le poulpe (pieuvre)', 'Le dauphin', 'Le requin'],
          r: 1,
          nb: 'Le poulpe (Octopus vulgaris) possède trois cœurs : deux cœurs branchiaux qui pompent le sang vers les branchies pour l\'oxygéner, et un cœur systémique qui distribue ensuite le sang oxygéné au reste du corps. Son sang est bleu (à base d\'hémocyanine contenant du cuivre) et son système circulatoire est fermé.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le thème des journées patriotiques 2025 au Burkina Faso ?',
          choices: ['Patriotisme et résilience face aux défis sécuritaires', 'L\'unité nationale pour une paix durable', 'Le civisme au service de la nation', 'Pour l\'ordre et la discipline : je m\'engage'],
          r: 0,
          nb: 'Le thème retenu pour les journées patriotiques 2025 au Burkina Faso est « Patriotisme et résilience face aux défis sécuritaires ». Ce thème reflète la situation de crise sécuritaire que traverse le pays et l\'appel à la mobilisation citoyenne pour soutenir l\'effort de défense nationale contre le terrorisme.'
        },
        {
          type: 'qcm4',
          q: 'Lequel de ces mots ou expressions est un archaïsme, c\'est-à-dire un terme tombé en désuétude dans la langue française moderne ?',
          choices: ['Voilà', 'Pointu', 'Gente dame', 'Problème'],
          r: 2,
          nb: '« Gente dame » (contraction de l\'adjectif « gentil » dans son sens ancien de noble/distingué et de « dame ») est un archaïsme typique du français médiéval signifiant « noble dame ». On le retrouve dans les textes du Moyen Âge et de la Renaissance. Les mots « voilà », « pointu » et « problème » sont toujours d\'usage courant dans le français moderne.'
        },
        {
          type: 'qcm4',
          q: 'Qui était le prédécesseur de Barack Obama à la présidence des États-Unis ?',
          choices: ['Joe Biden', 'George W. Bush', 'Bill Clinton', 'Donald Trump'],
          r: 1,
          nb: 'George W. Bush (né en 1946) a été le 43e président des États-Unis de janvier 2001 à janvier 2009, directement avant Barack Obama (44e président). Son mandat fut marqué par les attentats du 11 septembre 2001, la guerre en Afghanistan et l\'invasion de l\'Irak en 2003. Il est le fils de George H.W. Bush, 41e président.'
        },
        {
          type: 'qcm4',
          q: 'Le Symposium international de sculptures sur granite de Laongo (Burkina Faso) en était à quelle édition lors de sa tenue du 3 au 24 octobre 2024 ?',
          choices: ['10e édition', '14e édition', '20e édition', '25e édition'],
          r: 1,
          nb: 'Le Symposium international de sculptures sur granite de Laongo, situé à environ 35 km à l\'est de Ouagadougou, en était à sa 14e édition lors de sa tenue du 3 au 24 octobre 2024. Ce site culturel unique au monde regroupe des sculptures géantes taillées directement dans des rochers en granite naturel.'
        },
        {
          type: 'qcm4',
          q: 'En sociologie, quel concept décrit le processus par lequel un individu ou un groupe devient progressivement exclu des normes et valeurs sociales dominantes ?',
          choices: ['La socialisation', 'L\'intégration', 'La marginalisation', 'L\'assimilation'],
          r: 2,
          nb: 'La marginalisation est le processus par lequel un individu ou un groupe est progressivement écarté du centre de la société (norme, emploi, logement, liens sociaux) vers sa périphérie. Elle peut résulter de la pauvreté, du chômage, de la discrimination ou de l\'exclusion. Elle s\'oppose à l\'intégration et à la socialisation (apprentissage des normes).'
        },
        {
          type: 'qcm4',
          q: 'En quelle année l\'Université de Ouagadougou a-t-elle été officiellement renommée « Université Joseph Ki-Zerbo » ?',
          choices: ['2012', '2015', '2017', '2020'],
          r: 1,
          nb: 'L\'Université de Ouagadougou (fondée en 1974) a été renommée Université Joseph Ki-Zerbo en 2015, en hommage au grand historien et intellectuel burkinabè (1922-2006). Elle est la plus ancienne et la plus grande université du Burkina Faso. Joseph Ki-Zerbo avait lui-même enseigné dans cette institution.'
        },
        {
          type: 'qcm4',
          q: 'Combien d\'océans reconnaît-on officiellement sur Terre selon la classification internationale actuelle ?',
          choices: ['3 océans', '4 océans', '5 océans', '6 océans'],
          r: 2,
          nb: 'Cinq océans sont officiellement reconnus : l\'océan Pacifique (le plus grand), l\'Atlantique, l\'Indien, l\'Arctique (Boréal) et l\'Austral (Antarctique). L\'océan Austral a été officiellement désigné par l\'Organisation hydrographique internationale en 2000, entourant le continent antarctique au sud du 60e parallèle.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date l\'initiative présidentielle « FASO MÊBO » a-t-elle été adoptée au Burkina Faso ?',
          choices: ['5 mai 2025', '16 octobre 2024', '16 novembre 2024', '16 décembre 2024'],
          r: 1,
          nb: 'L\'initiative présidentielle « FASO MÊBO » a été adoptée le 16 octobre 2024 au Burkina Faso. Elle vise à encourager la souveraineté nationale, la production et la consommation locales dans le cadre de l\'effort global de développement endogène porté par la Transition.'
        },
        {
          type: 'qcm4',
          q: 'Quel terme anatomique désigne l\'extrémité terminale d\'un os long tel que le fémur ?',
          choices: ['Le cartilage', 'L\'épiphyse', 'La diaphyse', 'La moelle osseuse'],
          r: 1,
          nb: 'L\'épiphyse est l\'extrémité (terminaison) d\'un os long. Un os long comme le fémur comprend : la diaphyse (corps central allongé), les deux épiphyses (extrémités) et la métaphyse (zone de croissance entre les deux). Les épiphyses sont recouvertes de cartilage articulaire et jouent un rôle clé dans la croissance osseuse chez l\'enfant.'
        },
        {
          type: 'qcm4',
          q: 'Quelle hormone favorise la fixation du calcium dans les os en abaissant le taux de calcium sanguin ?',
          choices: ['L\'insuline', 'La testostérone', 'La calcitonine', 'L\'adrénaline'],
          r: 2,
          nb: 'La calcitonine est une hormone peptidique sécrétée par les cellules C de la thyroïde. Elle exerce un effet hypocalcémiant en inhibant la résorption osseuse par les ostéoclastes et en favorisant la fixation du calcium dans les os. Elle s\'oppose au parathormone (PTH) qui, au contraire, libère le calcium osseux pour augmenter la calcémie.'
        },
        {
          type: 'qcm4',
          q: 'L\'Oubangui-Chari était l\'ancien nom colonial de quel pays africain actuel ?',
          choices: ['République du Togo', 'République du Cameroun', 'République Centrafricaine', 'République du Niger'],
          r: 2,
          nb: 'L\'Oubangui-Chari était une colonie française d\'Afrique équatoriale (AEF) qui a accédé à l\'indépendance le 13 août 1960 sous le nom de République Centrafricaine. Ses frontières sont délimitées par les fleuves Oubangui au sud et Chari/Logone à l\'est. Sa capitale est Bangui. D\'autres anciens noms coloniaux : Abyssinie → Éthiopie, Côte-de-l\'Or → Ghana, Dahomey → Bénin.'
        },
        {
          type: 'qcm4',
          q: 'À quelles dates s\'est déroulé le Tour du Faso 2024 ?',
          choices: ['26 octobre au 4 novembre', '25 octobre au 3 novembre', '24 octobre au 2 novembre', '23 octobre au 1er novembre'],
          r: 1,
          nb: 'Le Tour du Faso 2024 s\'est déroulé du 25 octobre au 3 novembre 2024. Cette course cycliste internationale annuelle est la plus importante d\'Afrique subsaharienne et l\'une des plus anciennes du continent. Elle traverse plusieurs régions du Burkina Faso sur plusieurs étapes.'
        },
        {
          type: 'qcm4',
          q: 'Le Tour du Faso 2024, tenu du 25 octobre au 3 novembre 2024, était à sa combientième édition ?',
          choices: ['33e édition', '34e édition', '35e édition', '36e édition'],
          r: 2,
          nb: 'Le Tour du Faso 2024 marquait la 35e édition de la compétition cycliste depuis sa création en 1987 sous l\'impulsion du Capitaine Thomas Sankara. Certaines éditions ont été annulées ou reportées pour des raisons sécuritaires ou sanitaires (COVID-19 en 2020), ce qui explique que 2024 corresponde à la 35e édition et non la 38e.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date le Boulevard Charles de Gaulle de Ouagadougou a-t-il été officiellement rebaptisé Boulevard Thomas Sankara ?',
          choices: ['15 octobre 2023', '15 octobre 2024', '15 octobre 2022', '17 décembre 2023'],
          r: 0,
          nb: 'Le Boulevard Charles de Gaulle de Ouagadougou a été officiellement rebaptisé Boulevard Thomas Sankara le 15 octobre 2023, jour anniversaire de l\'assassinat du président Thomas Sankara (15 octobre 1987). Ce changement de nom symbolique s\'inscrit dans le processus de réhabilitation de la mémoire de Sankara et de souveraineté culturelle engagé par la Transition.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on la pratique de l\'élevage des huîtres ?',
          choices: ['L\'ostréiculture', 'La lombriculture', 'La raniculture', 'La cuniculture'],
          r: 0,
          nb: 'L\'ostréiculture (du latin ostreum = huître) est l\'élevage des huîtres dans des parcs à huîtres côtiers ou en mer. C\'est une branche de la conchyliculture (élevage des mollusques). La lombriculture concerne les vers de terre, la raniculture les grenouilles et la cuniculture les lapins.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman camerounais « Une vie de boy » (1956), qui dénonce les abus du colonialisme ?',
          choices: ['Ferdinand Oyono', 'Sembène Ousmane', 'Bernard B. Dadié', 'Mongo Beti'],
          r: 0,
          nb: '« Une vie de boy » est le premier roman de l\'écrivain camerounais Ferdinand Léopold Oyono (1929-2010), publié en 1956. À travers le journal intime de Toundi, jeune boy au service d\'un commandant français, Oyono dénonce avec ironie et lucidité la violence et l\'humiliation du système colonial. Ce roman est un classique de la littérature africaine francophone.'
        },
        {
          type: 'qcm4',
          q: 'À qui est attribuée la citation humaniste : « Chaque enfant qu\'on enseigne est un homme qu\'on gagne » ?',
          choices: ['Victor Hugo', 'Blaise Pascal', 'Thomas Hobbes', 'Antoine de Saint-Exupéry'],
          r: 0,
          nb: 'Cette citation est de Victor Hugo (1802-1885), extraite de ses discours politiques prononcés à l\'Assemblée nationale en faveur de l\'instruction publique universelle et gratuite. Elle illustre sa conviction que l\'éducation est le meilleur rempart contre l\'ignorance, la criminalité et la misère sociale.'
        },
        {
          type: 'qcm4',
          q: 'Soit la fonction f définie par f(x) = 3x + 4. Quelle est l\'image de 2 par f ?',
          choices: ['10', '7', '6', '4'],
          r: 0,
          nb: 'On calcule f(2) en substituant x = 2 dans l\'expression : f(2) = 3 × 2 + 4 = 6 + 4 = 10. L\'image de 2 par la fonction f est donc 10. Cette fonction affine a un coefficient directeur a = 3 et une ordonnée à l\'origine b = 4.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle couche de l\'atmosphère terrestre se situe la couche d\'ozone ?',
          choices: ['La troposphère (0-12 km)', 'La mésosphère (50-85 km)', 'La stratosphère (12-50 km)', 'La thermosphère (85-500 km)'],
          r: 2,
          nb: 'La couche d\'ozone se situe dans la stratosphère, entre 15 et 30 km d\'altitude environ. Elle absorbe 93 à 99 % des rayons ultraviolets (UV) nocifs émis par le Soleil, protégeant ainsi la vie sur Terre. Sa dégradation par les CFC et autres polluants chimiques est à l\'origine du « trou dans la couche d\'ozone » observé surtout au-dessus de l\'Antarctique.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année le mur de Berlin a-t-il été construit, séparant physiquement Berlin-Est de Berlin-Ouest ?',
          choices: ['1945', '1955', '1961', '1968'],
          r: 2,
          nb: 'Le mur de Berlin a été érigé dans la nuit du 12 au 13 août 1961 par la RDA (République Démocratique Allemande), avec l\'appui soviétique. Son but était d\'arrêter l\'exode massif de citoyens est-allemands vers l\'Ouest (plus de 3 millions en 15 ans). Il est tombé le 9 novembre 1989, symbolisant la fin de la Guerre froide.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces graphies est l\'orthographe correcte du nom de cette drogue de synthèse ?',
          choices: ['Ecstazy', 'Extazy', 'Ecstasy', 'Extasy'],
          r: 2,
          nb: 'La graphie correcte est « Ecstasy » (E-c-s-t-a-s-y), terme anglais signifiant « extase ». Il désigne le MDMA (3,4-méthylènedioxyméthamphétamine), une drogue de synthèse psychostimulante et empathogène. La confusion vient de sa prononciation proche de « exstasy » ou « ecstazy » mais la seule orthographe correcte est Ecstasy.'
        },
        {
          type: 'qcm4',
          q: 'Le réticulum endoplasmique est un organite cellulaire qui peut être décrit comme :',
          choices: ['Un organite logé à l\'intérieur de l\'appareil de Golgi', 'Un réseau de membranes impliqué dans la synthèse des protéines et des lipides', 'Le centre de stockage de l\'information génétique de la cellule', 'L\'organite responsable de la production d\'énergie sous forme d\'ATP'],
          r: 1,
          nb: 'Le réticulum endoplasmique (RE) est un réseau membranaire étendu dans le cytoplasme cellulaire. Il existe en deux formes : le RE rugueux (avec ribosomes, impliqué dans la synthèse et le transport des protéines) et le RE lisse (sans ribosomes, impliqué dans la synthèse des lipides et la détoxification). Il communique avec l\'enveloppe nucléaire et l\'appareil de Golgi.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on la science qui étudie le classement, la superposition et la formation des couches de roches géologiques ?',
          choices: ['La pétrographie', 'La minéralogie', 'La lithologie', 'La stratigraphie'],
          r: 3,
          nb: 'La stratigraphie est la branche de la géologie qui étudie la succession chronologique des strates rocheuses, leur composition, leur extension et leurs relations entre elles. Elle permet de reconstituer l\'histoire géologique de la Terre et de dater les formations rocheuses. Le principe de superposition (William Smith, 1815) en est le fondement.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression littéraire « un travail de Pénélope » ?',
          choices: ['Un travail brillant et efficace réalisé rapidement', 'Un travail sans fin, qui ne progresse jamais', 'Un travail bien récompensé après de longues années d\'effort', 'Un travail collectif réalisé en harmonie'],
          r: 1,
          nb: 'Dans la mythologie grecque (L\'Odyssée d\'Homère), Pénélope, épouse d\'Ulysse parti à Troie, retardait ses prétendants en promettant de choisir un nouveau mari une fois sa tapisserie terminée. Elle tissait le jour et défaisait son ouvrage la nuit. L\'expression désigne aujourd\'hui tout travail interminable, toujours à recommencer…'
        },
        {
          type: 'qcm4',
          q: 'En quelle année Thomas Hobbes a-t-il publié son traité politique fondamental « Le Léviathan » ?',
          choices: ['1598', '1625', '1651', '1690'],
          r: 2,
          nb: '« Le Léviathan » (Leviathan, or The Matter, Forme and Power of a Common-Wealth Ecclesiasticall and Civil) a été publié par Thomas Hobbes en 1651. Cette œuvre fondatrice de la philosophie politique moderne développe la théorie du contrat social et justifie l\'État absolu comme garant de la sécurité face à l\'état de nature, où « l\'homme est un loup pour l\'homme ».'
        },
        {
          type: 'qcm4',
          q: 'Comment Épicure définit-il le bonheur dans sa philosophie de la sagesse ?',
          choices: ['Comme l\'accumulation de richesses et de plaisirs sensoriels intenses', 'Comme la gloire militaire et la reconnaissance publique', 'Comme l\'absence de douleur physique et la tranquillité de l\'âme', 'Comme la vertu morale et l\'effort intellectuel constant'],
          r: 2,
          nb: 'Pour Épicure (341-270 av. J.-C.), le bonheur (eudaimonia) est l\'ataraxie : un état de sérénité, de tranquillité de l\'âme, résultant de l\'absence de troubles physiques (aponie) et psychiques. Il recommande une vie simple, modérée, entourée d\'amis, loin des désirs vains et des craintes infondées (mort, dieux). Sa philosophie est souvent mal comprise comme un hédonisme grossier.'
        },
        {
          type: 'qcm4',
          q: 'Quel écrivain français a exercé les fonctions de ministre de la Culture sous le général de Gaulle de 1959 à 1969 ?',
          choices: ['André Malraux', 'Julien Green', 'Voltaire', 'François Mauriac'],
          r: 0,
          nb: 'André Malraux (1901-1976), romancier et aventurier engagé, auteur de « La Condition humaine » (Prix Goncourt 1933), a été le premier ministre des Affaires culturelles de France de 1959 à 1969 sous de Gaulle. Il est notamment connu pour sa politique de « maisons de la culture » visant à démocratiser l\'accès à la culture dans toute la France.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces doctrines est centrée sur la balance commerciale favorable et l\'accumulation de métaux précieux comme fondement de la richesse nationale ?',
          choices: ['Le marxisme', 'Le monétarisme', 'Le mercantilisme', 'Le keynésianisme'],
          r: 2,
          nb: 'Le mercantilisme est la doctrine économique dominante en Europe aux XVIe-XVIIIe siècles. Ses théoriciens (Colbert en France, Thomas Mun en Angleterre) défendaient que la richesse d\'un État repose sur l\'accumulation d\'or et d\'argent, favorisée par une balance commerciale excédentaire (exporter plus qu\'importer). Il a été supplanté par le libéralisme d\'Adam Smith.'
        },
        {
          type: 'qcm4',
          q: 'Laquelle de ces doctrines économiques défend que la masse monétaire en circulation est le principal facteur de contrôle de l\'inflation ?',
          choices: ['Le mercantilisme', 'Le monétarisme', 'Le socialisme', 'Le physiocratisme'],
          r: 1,
          nb: 'Le monétarisme est une doctrine économique développée par Milton Friedman dans les années 1960-1970. Il affirme que l\'inflation est toujours et partout un phénomène monétaire : contrôler la masse monétaire permet de maîtriser l\'inflation.'
        },
        {
          type: 'qcm4',
          q: 'Quel animal marin se reproduit par fécondation externe, c\'est-à-dire en libérant ses gamètes directement dans l\'eau ?',
          choices: ['La chauve-souris', 'L\'oursin', 'La souris', 'Le kangourou'],
          r: 1,
          nb: 'Les oursins sont des invertébrés échinodermes à fécondation externe : ils libèrent leurs ovules et leurs spermatozoïdes dans l\'eau de mer, où la fécondation a lieu. Ce mode de reproduction est courant chez les invertébrés marins (moules, huîtres, étoiles de mer). À l\'inverse, les mammifères (chauve-souris, souris, kangourou) ont une fécondation interne.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on, en versification française, une strophe composée de seulement deux vers ?',
          choices: ['Un tercet', 'Un quatrain', 'Un distique', 'Un sizain'],
          r: 2,
          nb: 'Le distique est la strophe la plus courte de la poésie classique, composée de deux vers. On le retrouve en poésie latine (l\'élégie en distiques élégiaques) et en poésie française (notamment dans les épitaphes et maximes). À distinguer du tercet (3 vers), du quatrain (4 vers), du quintil (5 vers) et du sizain (6 vers).'
        },
        {
          type: 'qcm4',
          q: 'Parmi ces quatre animaux, lequel est l\'intrus par rapport aux trois autres en termes de classification zoologique ?',
          choices: ['Éléphant', 'Lion', 'Tigre', 'Léopard'],
          r: 0,
          nb: 'L\'éléphant est l\'intrus : c\'est un mammifère de l\'ordre des Proboscidea (herbivore). Le lion, le tigre et le léopard sont tous trois des mammifères de la famille des Félidés (grands félins carnivores).'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la principale ressource minière du Burkina Faso et sa première source d\'exportation ?',
          choices: ['Pétrole', 'Charbon', 'Marbre', 'Or'],
          r: 3,
          nb: 'L\'or est la principale ressource minière du Burkina Faso et représente la première source de devises du pays (environ 70-80 % des recettes d\'exportation). Le Burkina Faso est régulièrement classé parmi les 5 premiers producteurs d\'or d\'Afrique. Les principales mines sont situées dans les régions du Centre-Nord, Est et Sahel.'
        },
        {
          type: 'qcm4',
          q: 'Selon le Code pénal burkinabè en vigueur en 2025, quelle était la peine la plus sévère prévue pour les crimes les plus graves ?',
          choices: ['30 ans d\'emprisonnement', 'La réclusion criminelle à perpétuité', 'La peine de mort', '15 ans d\'emprisonnement'],
          r: 1,
          nb: 'La peine la plus sévère prévue par le Code pénal burkinabè est la réclusion criminelle à perpétuité (emprisonnement à vie). Depuis l\'abolition de la peine de mort en 2018, cette sanction constitue la peine maximale applicable aux auteurs des crimes les plus graves, notamment certains meurtres aggravés, les crimes contre l\'humanité et les actes de terrorisme.'
        },
        {
          type: 'qcm4',
          q: 'Qui a été élu président du Conseil Supérieur de la Magistrature (CSM) du Burkina Faso en juillet 2024 ?',
          choices: ['Harouna Yoda', 'Adama Ouédraogo', 'Abdoulaye Ouédraogo', 'Prosper Farama'],
          r: 1,
          nb: 'Lors de la première session plénière du Conseil supérieur de la magistrature tenue le 13 juillet 2024, Adama Ouédraogo a été élu président du CSM. Il exerçait alors les fonctions de Procureur général près de la Cour des comptes.'
        },
        {
          type: 'qcm4',
          q: 'Pour une femme ayant un cycle menstruel de 25 jours, à quel jour environ survient l\'ovulation ?',
          choices: ['Au 13e jour', 'Au 14e jour', 'Au 12e jour', 'Au 11e jour'],
          r: 3,
          nb: 'L\'ovulation survient environ 14 jours AVANT le début des règles suivantes. Pour un cycle de 25 jours : 25 – 14 = 11e jour. Pour un cycle standard de 28 jours : 28 – 14 = 14e jour. Cette règle de calcul rétrograde est utile pour identifier la fenêtre de fertilité et est fréquemment testée dans les concours médicaux et paramédicaux.'
        },
        {
          type: 'qcm4',
          q: 'Quelle fut la première grande opération de maintien de la paix de l\'ONU, déployée en réponse à une crise internationale en 1956 ?',
          choices: ['Guerre du Vietnam', 'Guerre de Corée', 'Guerre du Golfe', 'Crise du canal de Suez'],
          r: 3,
          nb: 'La première Force d\'urgence des Nations Unies (FUNU I) a été déployée en novembre 1956 en réponse à la crise du canal de Suez, opposant l\'Égypte de Nasser à la France, au Royaume-Uni et à Israël. Proposée par le Canadien Lester B. Pearson (Prix Nobel de la Paix 1957).'
        },
        {
          type: 'qcm4',
          q: 'Quel roman d\'Ahmadou Kourouma décrit la vie d\'un enfant soldat dans les guerres civiles africaines des années 1990 ?',
          choices: ['Allah n\'est pas obligé', 'Les Soleils des indépendances', 'En attendant le vote des bêtes sauvages', 'Monnè, outrages et défis'],
          r: 0,
          nb: '« Allah n\'est pas obligé » (2000), roman d\'Ahmadou Kourouma qui a remporté le Prix Renaudot et le Prix Goncourt des lycéens, raconte l\'histoire de Birahima, un enfant soldat de 10 ans entraîné dans les guerres civiles du Libéria et de la Sierra Leone.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date le collège d\'enseignement militaire supérieur du Burkina Faso a-t-il été créé par décret présidentiel ?',
          choices: ['30 avril 2025', '14 mai 2025', '7 mai 2025', 'Aucune bonne réponse'],
          r: 1,
          nb: 'Le collège d\'enseignement militaire supérieur du Burkina Faso a été créé par décret présidentiel le 14 mai 2025. Cet établissement vise à renforcer les capacités de commandement et de réflexion stratégique au sein des Forces armées nationales du Burkina Faso dans le contexte de la lutte contre le terrorisme.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date Martin Luther King Jr. a-t-il été assassiné à Memphis, aux États-Unis ?',
          choices: ['4 avril 1968', '4 avril 1961', '4 avril 1984', '4 avril 1952'],
          r: 0,
          nb: 'Martin Luther King Jr. (né Michael King Jr. le 15 janvier 1929 à Atlanta, Géorgie) a été assassiné le 4 avril 1968 à Memphis (Tennessee). Il était leader du mouvement américain des droits civiques et lauréat du prix Nobel de la paix 1964.'
        },
        {
          type: 'qcm4',
          q: 'Quelle nation est considérée comme la première puissance économique mondiale, dominant à la fois l\'agriculture, l\'industrie et les services ?',
          choices: ['États-Unis', 'Union Européenne', 'Japon', 'Chine'],
          r: 0,
          nb: 'Les États-Unis demeurent la première puissance économique mondiale avec un PIB nominal d\'environ 27 000 milliards de dollars (2024), représentant environ 25 % du PIB mondial. Ils dominent les trois secteurs : agriculture (premières exportations mondiales de soja, maïs), industrie (aérospatiale, numérique, pétrochimie) et services (finance, technologie, santé).'
        },
        {
          type: 'qcm4',
          q: 'En quelle année le Salon International de l\'Artisanat de Ouagadougou (SIAO) a-t-il été créé ?',
          choices: ['1984', '1988', '1992', '1989'],
          r: 0,
          nb: 'Le SIAO a été créé en 1984 sous la Révolution Démocratique et Populaire du Capitaine Thomas Sankara, à partir d\'une exposition-vente de produits artisanaux. Devenu biennal, il se tient à Ouagadougou les années paires et constitue aujourd\'hui l\'une des plus grandes foires artisanales d\'Afrique, accueillant des exposants de plus de 30 pays.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année ont été créées les Nuits Atypiques de Koudougou (NAK), festival culturel du Burkina Faso ?',
          choices: ['1996', '1990', '1988', '1979'],
          r: 0,
          nb: 'Les Nuits Atypiques de Koudougou (NAK) ont été créées en 1996 par Koudbi Koala, fondateur de l\'association Bénebnooma. Ce festival culturel annuel se tient à Koudougou, à environ 100 km à l\'ouest de Ouagadougou, et promeut les musiques du monde, la culture africaine et les arts de la scène dans une atmosphère festive et populaire.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année a été créé le Tour du Faso, la plus grande compétition cycliste d\'Afrique subsaharienne ?',
          choices: ['1987', '1980', '1986', '1979'],
          r: 0,
          nb: 'Le Tour du Faso a été créé en 1987 sous l\'impulsion du Capitaine Thomas Sankara, qui souhaitait promouvoir le sport cycliste et le Burkina Faso à l\'international. La première édition s\'est tenue en 1987. Depuis, cette course annuelle par étapes traverse plusieurs régions du pays et accueille des coureurs du monde entier.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'acronyme MOOC dans le domaine de l\'éducation numérique ?',
          choices: ['Un cours en ligne ouvert et accessible à un large public', 'Un état d\'esprit lié à l\'apprentissage mobile', 'Un nouveau langage de programmation web', 'Un jeu vidéo éducatif multijoueur'],
          r: 0,
          nb: 'MOOC signifie « Massive Open Online Course » (Cours en ligne ouvert et massif). Il désigne un type de cours dispensé en ligne, accessible gratuitement ou à faible coût à un très grand nombre d\'apprenants, sans contrainte géographique. Les principales plateformes MOOC sont Coursera, edX, FUN-MOOC (France) et Khan Academy.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression familière française « avoir le cafard » ?',
          choices: ['Être déprimé, mélancolique, avoir des pensées sombres', 'Avoir la tête ailleurs, être distrait dans ses pensées', 'Obtenir un grand succès inattendu', 'Cacher une information importante à son entourage'],
          r: 0,
          nb: '« Avoir le cafard » est une expression familière française signifiant se sentir déprimé, triste, mélancolique. Son origine est attribuée à Charles Baudelaire, qui utilisait l\'image du cafard  pour illustrer la mélancolie et le spleen. L\'expression « donner le cafard » signifie attrister quelqu\'un.'
        }
      ]
    },
    {
      id: "session_2026_06_02_1780400917486",
      date: "2025-07-20",
      titre: "Session N°2 de Juillet  2025",
      numero: 8,
      description: "Accompagnement Final 2025 :  réponses + explications bien détaillées",
      questions: [
        {
          type: "qcm4",
          q: "Comment s'appelle la partie la plus centrale et la plus profonde de la Terre ?",
          choices: ["La graine", "Le noyau externe", "Le manteau", "La croûte"],
          r: 0,
          nb: "Le noyau interne de la Terre, situé au centre exact de la planète, est appelé « la graine » en géologie française. Composé essentiellement de fer et de nickel à l'état solide, il atteint des températures supérieures à 5 000°C. Il est entouré par le noyau externe (liquide), lui-même recouvert par le manteau puis la croûte."
        },
        {
          type: "qcm4",
          q: "Qui a été nommé Secrétaire général du ministère de la Fonction publique et de la Protection sociale du Burkina Faso le 29 janvier 2025 ?",
          choices: ["Rodrigue S. Oboulbiga", "Rodrigue S. Ky", "Rodrigue S. Sana", "Rodrigue S. Lompo"],
          r: 0,
          nb: "Suanyaba Rodrigue Oboulbiga a été nommé Secrétaire général du ministère de la Fonction publique et de la Protection sociale du Burkina Faso le 29 janvier 2025 et officiellement installé à son poste le 3 février 2025."
        },
        {
          type: "qcm4",
          q: "Que désigne le terme zoologique « lemming » ?",
          choices: ["Un petit rongeur des régions arctiques", "Un oiseau migrateur des zones tempérées", "Un reptile aquatique d'eau douce", "Un arbre tropical à feuilles persistantes"],
          r: 0,
          nb: "Le lemming est un petit mammifère rongeur (famille des Cricétidés) vivant principalement dans les régions arctiques et subarctiques. Il est célèbre pour ses migrations massives périodiques. Contrairement à la légende populaire, les lemmings ne se jettent pas volontairement dans la mer."
        },
        {
          type: "qcm4",
          q: "Qui a été nommé directeur des systèmes d'information du ministère de la Fonction publique du Burkina Faso en janvier 2025 ?",
          choices: ["Ouedraogo Ousseni", "Raogo Fidèle Désiré", "Ousseni Gombané", "Ima Moussa"],
          r: 1,
          nb: "Raogo Fidèle Désiré a été nommé directeur des systèmes d'information du ministère de la Fonction publique en Conseil des ministres du 9 janvier 2025, et installé dans ses fonctions le 30 janvier 2025."
        },
        {
          type: "qcm4",
          q: "Combien d'années Samory Touré a-t-il résisté à la colonisation française en Afrique de l'Ouest ?",
          choices: ["17 ans", "18 ans", "19 ans", "20 ans"],
          r: 2,
          nb: "Samory Touré a mené une résistance armée contre la colonisation française de 1879 à 1898, soit environ 19 ans. Chef de l'Empire Wassoulou, il employa la stratégie de la terre brûlée et des retraites tactiques. Il fut finalement capturé le 29 septembre 1898 par le capitaine Gouraud et mourut en captivité en 1900."
        },
        {
          type: "qcm4",
          q: "Quel est le slogan officiel de l'Agence d'Information du Burkina (AIB) ?",
          choices: ["Toute l'info en temps réel", "La radio au cœur des événements", "La radio en temps réel", "La première radio en temps réel"],
          r: 0,
          nb: "Le slogan de l'Agence d'Information du Burkina (AIB) est « Toute l'info en temps réel », reflétant sa mission d'agence de presse officielle de l'État burkinabè chargée de collecter, traiter et diffuser l'information nationale de façon rapide et fiable."
        },
        {
          type: "qcm4",
          q: "En quelle date l'Agence d'Information du Burkina (AIB) a-t-elle été créée ?",
          choices: ["25 mai 1964", "26 mai 1964", "27 mai 1964", "28 mai 1964"],
          r: 2,
          nb: "L'Agence d'Information du Burkina (AIB) a été fondée le 27 mai 1964, quelques années après l'indépendance de la Haute-Volta (1960). Organe officiel d'information de l'État burkinabè, elle joue un rôle central dans la diffusion des informations gouvernementales et nationales."
        },
        {
          type: "qcm4",
          q: "Quelle était l'ancienne appellation internationale du pays qui se nomme aujourd'hui Iran ?",
          choices: ["Abyssinie", "Perse", "Siam", "Formose"],
          r: 1,
          nb: "L'Iran était internationalement connu sous le nom de Perse jusqu'en 1935, date à laquelle le shah Reza Pahlavi demanda officiellement aux autres pays d'utiliser le nom Iran (qui signifie « pays des Aryens » en persan). Abyssinie est l'ancien nom de l'Éthiopie, Siam de la Thaïlande et Formose de Taïwan."
        },
        {
          type: "qcm4",
          q: "Parmi les pays africains suivants, lequel est surnommé « le toit du monde » ?",
          choices: ["Tanzanie", "Kenya", "Afrique du Sud", "Aucun de ces pays"],
          r: 3,
          nb: "Aucun de ces pays africains n'est surnommé « le toit du monde ». Ce surnom désigne le Tibet (Asie centrale), une région de Chine dont le plateau présente une altitude moyenne d'environ 4 500 mètres au-dessus du niveau de la mer. La question teste la capacité à ne pas confondre géographies africaine et asiatique."
        },
        {
          type: "qcm4",
          q: "Combien de membres complets comptent les BRICS après l'adhésion de l'Indonésie en janvier 2025 ?",
          choices: ["5 membres", "10 membres", "11 membres", "15 membres"],
          r: 1,
          nb: "Après l'adhésion de l'Indonésie en janvier 2025, les BRICS comptent 10 membres : Brésil, Russie, Inde, Chine, Afrique du Sud (fondateurs), plus Égypte, Éthiopie, Émirats arabes unis et Iran (adhérents de janvier 2024), et Indonésie (janvier 2025). L'Arabie saoudite a été invitée mais n'a pas encore officiellement rejoint le groupe."
        },
        {
          type: "qcm4",
          q: "Parmi les pays suivants, lequel est devenu officiellement membre des BRICS en janvier 2025 ?",
          choices: ["Nigeria", "Indonésie", "Malaisie", "Argentine"],
          r: 1,
          nb: "L'Indonésie a officiellement intégré les BRICS en janvier 2025, lors du Sommet de Kazan (Russie, octobre 2024) où son adhésion avait été actée. L'Argentine avait été invitée mais a refusé sous le gouvernement Milei. Le Nigeria et la Malaisie n'ont pas encore rejoint le groupe."
        },
        {
          type: "qcm4",
          q: "Quelle part approximative du PIB mondial représentent les BRICS après leur expansion en 2025 ?",
          choices: ["33 %", "40 %", "46 %", "55 %"],
          r: 1,
          nb: "Après leur expansion, les BRICS représentent environ 40 % du PIB mondial en parité de pouvoir d'achat, soit un poids économique supérieur à celui du G7. Cette expansion confère aux BRICS un rôle croissant dans la gouvernance économique mondiale et leur permet de porter des alternatives aux institutions de Bretton Woods."
        },
        {
          type: "qcm4",
          q: "Qui a co-fondé le moteur de recherche Google, officiellement créé le 4 septembre 1998 ?",
          choices: ["Bill Gates et Paul Allen", "Larry Page et Sergey Brin", "Mark Zuckerberg et Eduardo Saverin", "Steve Jobs et Steve Wozniak"],
          r: 1,
          nb: "Google a été co-fondé par Larry Page et Sergey Brin, deux étudiants en doctorat de l'Université Stanford, le 4 septembre 1998. Le projet a débuté comme un moteur de recherche académique appelé « BackRub » avant de devenir Google. Aujourd'hui, Google est une filiale d'Alphabet Inc."
        },
        {
          type: "qcm4",
          q: "Quelle est la date de création du G5 Sahel, organisation régionale de sécurité et de développement ?",
          choices: ["16 février 2014", "5 août 2010", "12 décembre 2017", "30 avril 2015"],
          r: 0,
          nb: "Le G5 Sahel a été créé le 16 février 2014 à Nouakchott (Mauritanie), par cinq pays sahéliens : Burkina Faso, Mali, Mauritanie, Niger et Tchad. Cette organisation vise à coordonner les politiques de sécurité (notamment la Force conjointe G5 Sahel) et de développement dans une zone confrontée au terrorisme et à la crise humanitaire."
        },
        {
          type: "qcm4",
          q: "Quel président des États-Unis a démissionné en 1974 à la suite du scandale du Watergate ?",
          choices: ["Gerald Ford", "Richard Nixon", "Jimmy Carter", "Lyndon Johnson"],
          r: 1,
          nb: "Richard Nixon est le seul président américain à avoir démissionné de ses fonctions, le 9 août 1974. Le scandale du Watergate avait révélé que son gouvernement avait espionné le siège du Parti démocrate en 1972 et tenté d'étouffer l'affaire. Son vice-président Gerald Ford lui a succédé."
        },
        {
          type: "qcm4",
          q: "À qui est attribuée la citation philosophique : « Je ne perds pas, j'apprends » ?",
          choices: ["Nelson Mandela", "Albert Einstein", "Winston Churchill", "Martin Luther King"],
          r: 0,
          nb: "Cette citation illustrant la résilience face à l'échec est attribuée à Nelson Mandela (1918-2013), ancien président de l'Afrique du Sud. Elle reflète sa philosophie forgée par 27 années d'emprisonnement à Robben Island : chaque épreuve est une opportunité d'apprentissage, non une défaite."
        },
        {
          type: "qcm4",
          q: "Que signifie le sigle SIAO ?",
          choices: ["Salon International d'Artisanat de l'Ouest africain", "Salon International de l'Artisanat de Ouagadougou", "Société Internationale des Arts de l'Afrique de l'Ouest", "Syndicat International des Artisans de Ouagadougou"],
          r: 1,
          nb: "Le SIAO (Salon International de l'Artisanat de Ouagadougou) est un événement biennal majeur de promotion de l'artisanat africain, organisé à Ouagadougou (Burkina Faso). Il constitue l'une des plus grandes foires artisanales du continent africain et un espace de commerce et d'échanges culturels."
        },
        {
          type: "qcm4",
          q: "Dans quel pays s'est tenue la Coupe d'Afrique des Nations des moins de 17 ans (CAN U17) en 2025 ?",
          choices: ["Sénégal", "Ghana", "Côte d'Ivoire", "Maroc"],
          r: 3,
          nb: "La CAN U-17 2025 (Coupe d'Afrique des Nations des moins de 17 ans) s'est déroulée au Maroc du 30 mars au 19 avril 2025. Le Maroc a accueilli ce tournoi continental de football qui réunit les meilleures sélections africaines de la tranche d'âge des moins de 17 ans."
        },
        {
          type: "qcm4",
          q: "Combien de membres comptait le gouvernement burkinabè formé en décembre 2024 et en fonction en janvier 2025 ?",
          choices: ["20 ministres", "22 ministres", "24 ministres", "28 ministres"],
          r: 2,
          nb: "Après la nomination du Premier ministre Rimtalba Jean Emmanuel Ouédraogo en décembre 2024, le gouvernement mis en place comptait 24 membres dont 20 hommes et 4 femmes."
        },
        {
          type: "qcm4",
          q: "Quelle est la capitale fédérale de la Suisse, siège du gouvernement fédéral ?",
          choices: ["Genève", "Zurich", "Lausanne", "Berne"],
          r: 3,
          nb: "Berne est la capitale fédérale de la Suisse (Bundeshauptstadt en allemand). Contrairement à Genève (siège d'organisations internationales) et Zurich (principal centre économique et financier), Berne abrite le Parlement fédéral, le Conseil fédéral et les principales institutions gouvernementales suisses."
        },
        {
          type: "qcm4",
          q: "En 2023, quel pays a dépassé la Chine pour devenir le pays le plus peuplé du monde ?",
          choices: ["Nigéria", "États-Unis", "Indonésie", "Inde"],
          r: 3,
          nb: "En 2023, l'Inde a officiellement dépassé la Chine pour devenir le pays le plus peuplé du monde, avec plus de 1,4 milliard d'habitants. Cette transition démographique marque un tournant historique, la Chine ayant longtemps détenu ce titre. Les projections prévoient que l'Inde maintiendra la première place pour plusieurs décennies."
        },
        {
          type: "qcm4",
          q: "Où se trouve le siège de la Banque Africaine de Développement (BAD) ?",
          choices: ["Dakar (Sénégal)", "Addis-Abeba (Éthiopie)", "Abidjan (Côte d'Ivoire)", "Nairobi (Kenya)"],
          r: 2,
          nb: "La Banque Africaine de Développement (BAD), fondée en 1964, a son siège social à Abidjan en Côte d'Ivoire. Elle a officiellement commencé ses opérations en 1967. Son mandat est de promouvoir le développement économique et le progrès social de l'Afrique par le financement de projets d'investissement."
        },
        {
          type: "qcm4",
          q: "Qui occupait le poste de Directeur de la Justice militaire du Burkina Faso depuis son installation le 11 avril 2024 ?",
          choices: ["Lieutenant-colonel Boureima Ouédraogo", "Capitaine San Polycarpe Traoré", "Commandant Issouf Kaboré", "Colonel Idrissa Sawadogo"],
          r: 1,
          nb: "Le Capitaine San Polycarpe Traoré a été installé dans ses fonctions de Directeur de la Justice militaire du Burkina Faso le jeudi 11 avril 2024. Il supervise les affaires judiciaires relevant du domaine militaire au sein des Forces armées nationales du Burkina Faso."
        },
        {
          type: "qcm4",
          q: "À quelle date les passeports de l'Alliance des États du Sahel (AES) ont-ils été mis en circulation ?",
          choices: ["4 août 2024", "11 décembre 2024", "29 janvier 2025", "28 mars 2025"],
          r: 2,
          nb: "Le passeport de l'Alliance des États du Sahel (AES), regroupant le Burkina Faso, le Mali et le Niger, a été officiellement mis en circulation le 29 janvier 2025. Ce document vise à renforcer l'intégration régionale et la libre circulation des ressortissants des trois États membres de l'AES."
        },
        {
          type: "qcm4",
          q: "À quelle date les Volontaires Adjoints de Défense et de Sécurité (VADS) ont-ils été institués au Burkina Faso ?",
          choices: ["Octobre 2011", "Octobre 2012", "Octobre 2013", "Octobre 2014"],
          r: 2,
          nb: "Les VADS ont été créés en octobre 2013 pour appuyer notamment les actions de sécurité routière et certaines missions de sécurité publique. En 2023, ils ont célébré leur 10ᵉ anniversaire d'existence."
        },
        {
          type: "qcm4",
          q: "Quel rang occupait Albert Ouédraogo dans l'ordre des Premiers ministres du Burkina Faso lors de sa nomination en mars 2022 ?",
          choices: ["14e Premier ministre", "15e Premier ministre", "16e Premier ministre", "17e Premier ministre"],
          r: 2,
          nb: "Albert Ouédraogo était le 16e Premier ministre du Burkina Faso lors de sa nomination en mars 2022, sous la présidence du lieutenant-colonel Paul-Henri Sandaogo Damiba (MPSR I). Il a succédé à Lassina Zerbo, le 15e Premier ministre, nommé après le coup d'État de janvier 2022 contre Roch Marc Christian Kaboré."
        },
        {
          type: "qcm4",
          q: "Au Burkina Faso, qui est chargé de nommer le Premier ministre ?",
          choices: ["L'Assemblée Législative de la Transition", "Le Conseil d'État", "Le Président du Faso", "Le Conseil des ministres"],
          r: 2,
          nb: "Au Burkina Faso, le Premier ministre est nommé par le Président du Faso (chef de l'État) qui lui confère son mandat et définit les orientations de son action gouvernementale. Cette investiture traduit la relation de confiance et de subordination constitutionnelle qui lie le Premier ministre au chef de l'État."
        },
        {
          type: "qcm4",
          q: "À quoi fait référence la loi N°081-2015/CNT du 24 novembre 2015 au Burkina Faso ?",
          choices: ["Au Code pénal burkinabè", "Au Code électoral national", "Au Statut Général de la Fonction Publique d'État", "À la loi organique sur les libertés publiques"],
          r: 2,
          nb: "La loi N°081-2015/CNT du 24 novembre 2015 définit le Statut Général de la Fonction Publique d'État du Burkina Faso. Elle fixe les droits et obligations des agents de l'État, les règles relatives à leur recrutement, leur avancement, leur rémunération et leur retraite. C'est le texte de référence pour tout candidat aux concours de la fonction publique."
        },
        {
          type: "qcm4",
          q: "Par quelle expression populaire désigne-t-on l'institution militaire en France et dans les pays francophones ?",
          choices: ["La force silencieuse", "La grande muette", "Le bras armé de l'État", "La main de fer"],
          r: 1,
          nb: "L'armée est surnommée « la grande muette » en raison de son devoir de réserve et de discrétion : les militaires ne sont pas censés exprimer publiquement des opinions politiques ni critiquer le pouvoir civil. Cette expression date du XIXe siècle en France et reste très usitée dans les pays francophones."
        },
        {
          type: "qcm4",
          q: "Quel est le plus long fleuve d'Afrique de l'Ouest, traversant plusieurs pays de la région ?",
          choices: ["Le fleuve Niger", "Le fleuve Gambie", "Le fleuve Volta", "Le fleuve Sénégal"],
          r: 0,
          nb: "Le fleuve Niger (environ 4 180 km) est le plus long fleuve d'Afrique de l'Ouest. Il traverse la Guinée (source), le Mali, le Niger, le Bénin et le Nigeria (embouchure). C'est également le 3e plus long fleuve d'Afrique. Son delta intérieur au Mali et son delta maritime au Nigeria sont des zones écologiques d'une richesse exceptionnelle.",
          x: "Le fleuve Niger (environ 4 180 km) est le plus long fleuve d'Afrique de l'Ouest. Il traverse la Guinée (source), le Mali, le Niger, le Bénin et le Nigeria (embouchure). C'est également le 3e plus long fleuve d'Afrique. Son delta intérieur au Mali et son delta maritime au Nigeria sont des zones écologiques d'une richesse exceptionnelle."
        },
        {
          type: "qcm4",
          q: "Laquelle de ces graphies est l'orthographe correcte du mot désignant la loi fondamentale d'un État ?",
          choices: ["constitution", "contitution", "constutition", "constutution"],
          r: 0,
          nb: "La graphie correcte est « constitution » (c-o-n-s-t-i-t-u-t-i-o-n). Les autres formes sont des fautes d'orthographe fréquentes : « contitution » omet un « s », « constutition » inverse des lettres, « constutution » cumule plusieurs erreurs. Ce mot est souvent mal orthographié dans les concours."
        },
        {
          type: "qcm4",
          q: "En juillet 2025, combien de Premiers ministres Emmanuel Macron avait-il nommés depuis le début de son premier mandat présidentiel en 2017 ?",
          choices: ["4 Premiers ministres", "5 Premiers ministres", "6 Premiers ministres", "7 Premiers ministres"],
          r: 2,
          nb: "En juillet 2025, Emmanuel Macron avait nommé 6 Premiers ministres dans l'ordre : Édouard Philippe (2017-2020), Jean Castex (2020-2022), Élisabeth Borne (2022-2024), Gabriel Attal (2024), Michel Barnier (2024), et François Bayrou (depuis janvier 2025). François Bayrou était donc le 6e Premier ministre de Macron."
        },
        {
          type: "qcm4",
          q: "Quel film du réalisateur mauritanien Abderrahmane Sissako a officiellement ouvert le FESPACO 2025 ?",
          choices: ["Timbuktu", "Bamako", "Attentes", "Black Tea"],
          r: 3,
          nb: "C'est le film « Black Tea » du réalisateur mauritanien Abderrahmane Sissako qui a été choisi pour l'ouverture officielle de la 29e édition du FESPACO 2025 à Ouagadougou. Sissako est également connu pour « Timbuktu » (2014), Ours d'or à Berlin, et « Bamako » (2006). « Black Tea » est une coproduction internationale sur la rencontre entre cultures africaines et asiatiques."
        },
        {
          type: "qcm4",
          q: "Sur quel doigt porte-t-on la bague de mariage lors du mariage civil en France et dans les pays francophones d'Afrique ?",
          choices: ["L'index droit", "Le majeur gauche", "L'annulaire droit", "L'annulaire gauche"],
          r: 3,
          nb: "Dans la tradition française et dans de nombreux pays francophones (dont le Burkina Faso), la bague de mariage est portée à l'annulaire de la main gauche. Cette tradition remonte à la croyance romaine selon laquelle une veine, la « vena amoris » (veine de l'amour), reliait directement ce doigt au cœur."
        },
        {
          type: "qcm4",
          q: "Combien de communes urbaines comptait le Burkina Faso avant le redécoupage administratif du 2 juillet 2025 ?",
          choices: ["45 communes urbaines", "49 communes urbaines", "52 communes urbaines", "55 communes urbaines"],
          r: 1,
          nb: "Avant le redécoupage administratif du 2 juillet 2025, le Burkina Faso comptait 49 communes urbaines, dont 45 chefs-lieux de province et 4 autres villes majeures (Ouagadougou, Bobo-Dioulasso, Koudougou et Banfora). Depuis le redécoupage qui a porté le nombre de provinces à 47, ce chiffre a évolué."
        },
        {
          type: "qcm4",
          q: "Que signifie l'adjectif « perplexe » en français ?",
          choices: ["Indécis, hésitant et troublé face à une situation", "Convaincu et déterminé dans ses décisions", "Satisfait et serein face à une bonne nouvelle", "Agacé et impatient face à une attente prolongée"],
          r: 0,
          nb: "« Perplexe » vient du latin « perplexus » (entrelacé, embrouillé). Il qualifie une personne qui ne sait quelle décision ou opinion adopter face à une situation complexe ou ambiguë. Synonymes : embarrassé, désorienté, hésitant. Antonymes : décidé, résolu, certain."
        },
        {
          type: "qcm4",
          q: "Combien de poètes officiels comptait le groupe littéraire français connu sous le nom de « La Pléiade » au XVIe siècle ?",
          choices: ["5 poètes", "7 poètes", "9 poètes", "12 poètes"],
          r: 1,
          nb: "La Pléiade comptait 7 poètes, par référence aux sept étoiles de la constellation des Pléiades. Ce groupe de poètes de la Renaissance française (XVIe siècle) comprenait Pierre de Ronsard, Joachim du Bellay, Jean-Antoine de Baïf, Pontus de Tyard, Étienne Jodelle, Rémi Belleau et Jean Dorat. Leur manifeste est la « Défense et Illustration de la Langue française » (1549)."
        },
        {
          type: "qcm4",
          q: "Quelle est la forme algébrique du nombre complexe z = (1 – i)² ?",
          choices: ["2 – 2i", "1 – 2i", "–2i", "2i"],
          r: 2,
          nb: "On développe par la formule (a – b)² = a² – 2ab + b² : (1 – i)² = 1² – 2(1)(i) + i² = 1 – 2i + (–1) = –2i. La forme algébrique est donc z = 0 – 2i = –2i (partie réelle nulle, partie imaginaire égale à –2)."
        },
        {
          type: "qcm4",
          q: "Soit le nombre complexe z = –3 + 4i. Quel est son module |z| ?",
          choices: ["3", "4", "5", "7"],
          r: 2,
          nb: "Le module d'un nombre complexe z = a + bi est |z| = √(a² + b²). Ici : |z| = √((–3)² + 4²) = √(9 + 16) = √25 = 5. Le module mesure la distance de l'image du complexe à l'origine dans le plan de Gauss."
        },
        {
          type: "qcm4",
          q: "Quelle est la nationalité de l'écrivaine Fatou Diome, auteure du roman « Le Ventre de l'Atlantique » ?",
          choices: ["Guinéenne", "Malienne", "Ivoirienne", "Sénégalaise"],
          r: 3,
          nb: "Fatou Diome est une romancière sénégalaise née à Ndioum (Sénégal). Elle vit et enseigne en France depuis les années 1990. Son roman « Le Ventre de l'Atlantique » (2003), qui traite des illusions de l'immigration africaine, l'a rendue célèbre. Elle est également connue pour ses prises de position engagées sur les médias."
        },
        {
          type: "qcm4",
          q: "Quel est le dernier pays africain à avoir accédé à l'indépendance ?",
          choices: ["Érythrée", "Timor oriental", "Kosovo", "Soudan du Sud"],
          r: 3,
          nb: "Le Soudan du Sud a déclaré son indépendance le 9 juillet 2011, après un référendum où 98,83 % des Soudanais du Sud ont voté pour la séparation d'avec le Soudan. C'est le 54e pays africain et le dernier en date à avoir accédé à l'indépendance sur le continent africain."
        },
        {
          type: "qcm4",
          q: "Qui a été nommé Premier ministre lors de la première transition au Burkina Faso, après la chute de Blaise Compaoré en 2014 ?",
          choices: ["Zéphirin Diabré", "Paul Kaba Thiéba", "Roch Marc Christian Kaboré", "Yacouba Isaac Zida"],
          r: 3,
          nb: "Après la chute de Blaise Compaoré le 31 octobre 2014, Yacouba Isaac Zida (lieutenant-colonel) a d'abord assuré la direction de la transition avant de devenir Premier ministre sous la présidence de Michel Kafando. Il a exercé ces fonctions jusqu'au coup d'État manqué de septembre 2015, avant la présidentielle de novembre 2015."
        },
        {
          type: "qcm4",
          q: "Combien de pays membres composent l'Union Africaine (UA) depuis le retour du Maroc en 2017 ?",
          choices: ["50 pays", "52 pays", "54 pays", "55 pays"],
          r: 3,
          nb: "L'Union Africaine (UA) compte 55 États membres depuis la réintégration du Maroc en janvier 2017 (le Maroc avait quitté l'Organisation de l'Unité Africaine en 1984 en protestation contre l'admission de la RASD). L'UA est l'organisation panafricaine de référence pour l'intégration et le développement du continent."
        },
        {
          type: "qcm4",
          q: "Quelle est la devise latine de l'Organisation Internationale du Travail (OIT), créée en 1919 ?",
          choices: ["« Per aspera ad astra »", "« In varietate concordia »", "« Si vis pacem, cole justitiam »", "« Labor omnia vincit »"],
          r: 2,
          nb: "La devise de l'OIT est « Si vis pacem, cole justitiam » (Si tu veux la paix, cultive la justice). L'OIT a été créée en 1919 dans le cadre du Traité de Versailles, avec pour mission de promouvoir les droits au travail, les conditions d'emploi décentes et le dialogue social. Son siège est à Genève (Suisse)."
        },
        {
          type: "qcm4",
          q: "Quelle région du monde est surnommée « le toit du monde » en raison de son altitude exceptionnelle ?",
          choices: ["Les hauts plateaux des Andes (Amérique du Sud)", "Le Tibet (Asie centrale, Chine)", "Les massifs de l'Atlas (Afrique du Nord)", "Le plateau éthiopien (Afrique de l'Est)"],
          r: 1,
          nb: "Le Tibet est surnommé « le toit du monde » car son plateau présente une altitude moyenne d'environ 4 500 mètres au-dessus du niveau de la mer. C'est la région habitée la plus élevée de la planète. Elle est rattachée politiquement à la Chine depuis 1951, et abrite notamment le mont Everest à sa bordure himalayenne."
        },
        {
          type: "qcm4",
          q: "Quel est le féminin du nom « enchanteur » en français ?",
          choices: ["Enchanteuse", "Enchanteure", "Enchanteresse", "Enchantrice"],
          r: 2,
          nb: "Le féminin de « enchanteur » est « enchanteresse ». Ici la transformation suit le modèle des mots en -eur → -eresse (comme pécheur/pécheresse, défenseur/défenderesse). « Enchanteresse » évoque souvent une figure de sorcière ou de fée."
        },
        {
          type: "qcm4",
          q: "Quel est le nom du parlement de la République islamique d'Iran ?",
          choices: ["La Douma", "La Knesset", "Le Majlis", "Le Bundestag"],
          r: 2,
          nb: "Le parlement iranien est appelé le Majlis (en persan : مجلس), abréviation de Majlis-e Shura-ye Eslami (Assemblée Consultative Islamique). Il est composé de 290 membres élus au suffrage universel pour un mandat de quatre ans. La Douma est le parlement russe, la Knesset le parlement israélien et le Bundestag le parlement allemand."
        },
        {
          type: "qcm4",
          q: "Quel prestigieux prix littéraire africain a été décerné à Aristide Tarnagda en 2018 ?",
          choices: ["Prix Noma", "Prix Ahmadou-Kourouma", "Grand Prix littéraire d'Afrique noire", "Prix RFI Théâtre"],
          r: 2,
          nb: "Aristide Tarnagda a reçu le Grand Prix littéraire d'Afrique noire pour l'ensemble de son œuvre dramatique, devenant l'un des rares Burkinabè à obtenir cette distinction."
        },
        {
          type: "qcm4",
          q: "Quelle est la date de la première greffe de cœur réalisée sur un être humain ?",
          choices: ["3 décembre 1952", "2 décembre 1977", "3 décembre 1967", "5 juillet 1960"],
          r: 2,
          nb: "La première greffe cardiaque humaine a été réalisée le 3 décembre 1967 par le chirurgien sud-africain Christiaan Barnard à l'hôpital Groote Schuur du Cap (Afrique du Sud). Le receveur, Louis Washkansky, a vécu 18 jours après l'opération. Cette prouesse médicale a révolutionné la chirurgie cardiaque mondiale."
        },
        {
          type: "qcm4",
          q: "Le score d'Apgar, utilisé pour évaluer l'état de santé d'un nouveau-né, repose sur quels cinq critères ?",
          choices: ["Température, Respiration, Réflexes, Taille, Cœur", "Couleur, Réflexes, Température, Respiration, Pouls", "Apparence, Pouls, Grimace, Activité, Respiration", "Activité, Poids, Respiration, Tonus, Température"],
          r: 2,
          nb: "Le score d'Apgar (acronyme de l'anglais) évalue 5 paramètres à 1, 5 et 10 minutes après la naissance : Appearance (couleur de peau), Pulse (fréquence cardiaque), Grimace (réflexes), Activity (tonus musculaire) et Respiration. Chaque critère est noté de 0 à 2, pour un total maximal de 10. Un score ≥ 7 est considéré normal."
        },
        {
          type: "qcm4",
          q: "Qu'est-ce que le canal de Guyon, situé au niveau du poignet ?",
          choices: ["Canal de passage de l'artère fémorale", "Canal de passage du nerf ulnaire au poignet", "Canal rachidien cervical", "Canal auditif interne"],
          r: 1,
          nb: "Le canal de Guyon (ou tunnel ulnaire) est un espace fibro-osseux situé à la face palmaire du poignet, entre le pisiforme et l'hamulus de l'hamatum. Il permet le passage du nerf ulnaire et de l'artère ulnaire. Sa compression peut provoquer le syndrome du canal de Guyon, avec paresthésies et faiblesse des muscles intrinsèques de la main."
        },
        {
          type: "qcm4",
          q: "Parmi les étiologies suivantes, lesquelles sont les principales causes de la cirrhose hépatique ?",
          choices: ["Diabète, Tuberculose, Sida", "Alcool, Hépatite B/C, NASH et certains médicaments", "Ulcère, Appendicite, Typhoïde", "Paludisme, Asthme, Pneumonie"],
          r: 1,
          nb: "La cirrhose hépatique est une maladie chronique irréversible du foie dont les principales causes sont : l'alcoolisme chronique (1ère cause dans les pays occidentaux), les hépatites virales B et C, la NASH (stéatohépatite non alcoolique liée à l'obésité et au diabète) et certains médicaments hépatotoxiques."
        }
      ]
    },
    {
      id: 'session_2026_06_02_1780398909542',
      date: '2025-07-20',
      titre: 'Session N°1 de Juillet  2025',
      numero: 7,
      description: 'Accompagnement Final 2025 :  réponses + explications bien détaillées',
      questions: [
        {
          type: 'qcm4',
          q: 'Quelle est la durée légale du congé de maternité au Burkina Faso selon le Code du travail ?',
          choices: ['8 semaines (56 jours)', '12 semaines (84 jours)', '14 semaines (98 jours)', '16 semaines (112 jours)'],
          r: 2,
          nb: 'Le Code du travail du Burkina Faso (Article L.154) fixe la durée du congé de maternité à 14 semaines (98 jours), réparties en 6 semaines prénatales (avant l\'accouchement) et 8 semaines postnatales (après l\'accouchement). Durant cette période, la travailleuse perçoit ses prestations de maternité.'
        },
        {
          type: 'qcm4',
          q: 'Que désigne le terme médical « euthanasie » ?',
          choices: ['Un traitement palliatif destiné à soulager la douleur sans provoquer la mort', 'L\'acte de provoquer intentionnellement la mort d\'un patient pour abréger ses souffrances', 'Une procédure chirurgicale d\'urgence pratiquée sans consentement', 'Le refus de soins de la part d\'un patient en fin de vie'],
          r: 1,
          nb: 'L\'euthanasie désigne l\'acte délibéré de mettre fin à la vie d\'une personne atteinte d\'une maladie incurable pour abréger ses souffrances. Elle peut être active (administration d\'une substance létale) ou passive (arrêt des soins). Son autorisation légale varie selon les pays.'
        },
        {
          type: 'qcm4',
          q: 'En médecine d\'urgence, à quoi sert le score de Glasgow ?',
          choices: ['Mesurer la douleur ressentie par un patient', 'Évaluer le niveau de conscience d\'un patient traumatisé', 'Calculer le risque de crise cardiaque', 'Estimer la perte de sang lors d\'un traumatisme'],
          r: 1,
          nb: 'Le score de Glasgow (Glasgow Coma Scale, GCS) évalue le niveau de conscience d\'un patient. Il varie de 3 (coma profond) à 15 (conscience normale) et repose sur trois paramètres : l\'ouverture des yeux (E), la réponse verbale (V) et la réponse motrice (M). Il est utilisé en urgence pour tout traumatisme crânien.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est l\'origine embryologique des dents humaines ?',
          choices: ['L\'endoderme et le mésenchyme secondaire', 'Le mésoderme uniquement', 'L\'ectoderme et le mésenchyme de la crête neurale', 'L\'endoderme viscéral et le mésoderme splanchnique'],
          r: 2,
          nb: 'Les dents se développent à partir de deux tissus embryonnaires : l\'ectoderme (qui donne l\'émail via les améloblastes) et le mésenchyme issu de la crête neurale (qui donne la dentine, le cément et la pulpe via les odontoblastes). Ces deux tissus interagissent lors de l\'organogenèse dentaire.'
        },
        {
          type: 'qcm4',
          q: 'Quel est l\'organe chargé de la réglementation et du contrôle des médicaments au Burkina Faso ?',
          choices: ['Le Ministère de la Santé directement', 'La Pharmacie Nationale d\'Approvisionnement (PNA)', 'L\'Agence Nationale de Régulation Pharmaceutique (ANRP)', 'L\'Ordre des Pharmaciens du Burkina Faso'],
          r: 2,
          nb: 'L\'Agence Nationale de Régulation Pharmaceutique (ANRP) est l\'institution burkinabè chargée de réguler le secteur pharmaceutique. Elle veille à la qualité, l\'efficacité et la sécurité des médicaments commercialisés sur le territoire national, et délivre les autorisations de mise sur le marché.'
        },
        {
          type: 'qcm4',
          q: 'Quelle cellule spécialisée est responsable de la formation de l\'émail dentaire ?',
          choices: ['Les odontoblastes', 'Les ostéoblastes', 'Les cémentoblastes', 'Les améloblastes'],
          r: 3,
          nb: 'Les améloblastes sont des cellules épithéliales spécialisées qui sécrètent la matrice protéique de l\'émail pendant la phase de développement dentaire (amélogenèse). Une fois l\'émail formé, ces cellules disparaissent. C\'est pourquoi l\'émail, contrairement aux os, ne peut pas se régénérer naturellement.'
        },
        {
          type: 'qcm4',
          q: 'Quelle structure dentaire contient les nerfs et les vaisseaux sanguins qui assurent la vitalité de la dent ?',
          choices: ['L\'émail', 'La dentine', 'Le cément', 'La pulpe dentaire'],
          r: 3,
          nb: 'La pulpe dentaire est la partie molle et vivante au centre de la dent. Elle contient les nerfs sensitifs (responsables de la sensation de douleur) et les vaisseaux sanguins (qui apportent les nutriments). Protégée par la dentine et l\'émail, elle joue un rôle fondamental dans la vitalité et la sensibilité dentaire.'
        },
        {
          type: 'qcm4',
          q: 'En pharmacovigilance, que désigne un « effet indésirable grave » d\'un médicament ?',
          choices: ['Tout effet désagréable ressenti par le patient', 'Un effet pouvant entraîner la mort, une hospitalisation, une invalidité ou une malformation congénitale', 'Uniquement les réactions allergiques cutanées', 'Un effet signalé plus de 5 fois en un mois'],
          r: 1,
          nb: 'Un effet indésirable grave (EIG) est défini comme tout effet susceptible d\'entraîner le décès, de mettre la vie en danger, de nécessiter une hospitalisation, d\'entraîner une invalidité permanente ou une malformation congénitale. Ces effets doivent être signalés rapidement aux autorités de pharmacovigilance nationales et internationales.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la mission principale de la Pharmacie Nationale d\'Approvisionnement (PNA) au Burkina Faso ?',
          choices: ['Former les pharmaciens du secteur privé', 'Fixer les prix des médicaments sur le marché', 'Approvisionner et distribuer des médicaments', 'Inspecter les officines pharmaceutiques privées'],
          r: 2,
          nb: 'La PNA (Pharmacie Nationale d\'Approvisionnement) est l\'établissement public burkinabè chargé d\'acheter, stocker et distribuer les médicaments essentiels génériques, les vaccins et les consommables médicaux vers les formations sanitaires publiques. Elle garantit l\'accès aux soins sur l\'ensemble du territoire national.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les médicaments suivants, lequel est un anti-inflammatoire non stéroïdien (AINS) ?',
          choices: ['Ibuprofène', 'Cortisone', 'Morphine', 'Amoxicilline'],
          r: 0,
          nb: 'L\'ibuprofène est un anti-inflammatoire non stéroïdien (AINS) couramment utilisé pour traiter la douleur, la fièvre et l\'inflammation. À distinguer des anti-inflammatoires stéroïdiens (corticoïdes comme la cortisone), des opioïdes (morphine) et des antibiotiques (amoxicilline).'
        },
        {
          type: 'qcm4',
          q: 'Selon l\'OMS, l\'hypertension artérielle est diagnostiquée chez l\'adulte à partir de quel seuil ?',
          choices: ['120/80 mmHg', '130/85 mmHg', '140/90 mmHg', '160/100 mmHg'],
          r: 2,
          nb: 'L\'hypertension artérielle (HTA) est définie par une pression artérielle systolique (PAS) ≥ 140 mmHg et/ou une pression artérielle diastolique (PAD) ≥ 90 mmHg, mesurée à au moins deux occasions différentes. Ce seuil est internationalement reconnu par l\'OMS pour le diagnostic de l\'HTA chez l\'adulte.'
        },
        {
          type: 'qcm4',
          q: 'Selon le Programme Élargi de Vaccination (PEV) au Burkina Faso, quel vaccin est administré dès la naissance ?',
          choices: ['Le vaccin contre la rougeole', 'Le vaccin antipoliomyélitique oral (VPO)', 'Le vaccin BCG', 'Le vaccin contre l\'hépatite B uniquement'],
          r: 2,
          nb: 'Le vaccin BCG (Bacille de Calmette et Guérin) est administré à la naissance selon le calendrier vaccinal du PEV au Burkina Faso. Il protège contre les formes graves de tuberculose (méningite tuberculeuse, miliaire). C\'est l\'un des vaccins les plus anciens et les plus utilisés au monde.'
        },
        {
          type: 'qcm4',
          q: 'Dans quelle ville française sont imprimés les billets du franc CFA utilisé par les pays de l\'UEMOA ?',
          choices: ['Paris', 'Lyon', 'Bordeaux', 'Chamalières'],
          r: 3,
          nb: 'Les billets du franc CFA de la zone UEMOA (Afrique de l\'Ouest) sont imprimés à Chamalières, commune proche de Clermont-Ferrand, où se trouvent les ateliers d\'impression de la Banque de France. Cette particularité est souvent citée comme symbole de la dépendance monétaire des pays de la zone franc.'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la monnaie officielle de la République d\'Afrique du Sud ?',
          choices: ['Le shilling sud-africain', 'Le rand sud-africain (ZAR)', 'Le dollar namibien', 'Le kwacha'],
          r: 1,
          nb: 'Le rand (ZAR, de l\'afrikaners « Witwatersrand ») est la monnaie officielle de l\'Afrique du Sud depuis 1961. Il est subdivisé en 100 cents. Le rand est également utilisé comme monnaie de référence dans certains pays voisins (Namibie, Lesotho, Swaziland) qui ont des monnaies adossées au rand.'
        },
        {
          type: 'qcm4',
          q: 'Quel film burkinabè a remporté l\'Étalon d\'or de Yennenga, la plus haute distinction du FESPACO 2025 ?',
          choices: ['Sira de Apolline Traoré', 'Katanga, la danse des scorpions', 'Buud Yam de Gaston Kaboré', 'Tasuma de S. Pierre Yameogo'],
          r: 1,
          nb: 'Le film « Katanga, la danse des scorpions » du réalisateur burkinabè Dani Kouyaté a remporté l\'Étalon d\'or de Yennenga lors de la 29e édition du FESPACO 2025. Ce film a été récompensé pour sa richesse esthétique, sa profondeur thématique et son message artistique puissant.'
        },
        {
          type: 'qcm4',
          q: 'Dans le roman « L\'Aventure ambiguë » de Cheikh Hamidou Kane, quel est le destin final du personnage principal Samba Diallo ?',
          choices: ['Il retourne en Europe pour y terminer ses études', 'Il renonce à l\'islam et devient philosophe occidental', 'Il est assassiné par un fou dans son village natal', 'Il épouse une jeune femme africaine et s\'établit au pays'],
          r: 2,
          nb: 'Samba Diallo, jeune Africain écartelé entre sa culture peule et la civilisation occidentale, revient dans son village après ses études en France. Il y est assassiné par un déséquilibré religieux. Cette fin tragique symbolise l\'impossibilité de la synthèse entre deux univers culturels incompatibles, thème central du roman de Cheikh Hamidou Kane (1961).'
        },
        {
          type: 'qcm4',
          q: 'À quelle date a été créée la police municipale au Burkina Faso ?',
          choices: ['15 mars 1990', '20 juillet 1995', '4 août 1999', '11 décembre 2000'],
          r: 1,
          nb: 'La police municipale du Burkina Faso a été instituée le 20 juillet 1995. Elle a pour mission de renforcer la sécurité urbaine, de faire appliquer les règlements municipaux et de veiller au respect de l\'ordre public au niveau local, en complément de la police nationale.'
        },
        {
          type: 'qcm4',
          q: 'Parmi les présidents burkinabè suivants, lequel n\'est pas connu pour avoir fait imprimer des timbres postaux à son effigie ?',
          choices: ['Maurice Yaméogo', 'Sayé Zerbo', 'Thomas Sankara', 'Roch Marc Christian Kaboré'],
          r: 3,
          nb: 'Plusieurs présidents burkinabè ont eu des timbres postaux à leur effigie, notamment Maurice Yaméogo, Sayé Zerbo et Thomas Sankara. Roch Marc Christian Kaboré n\'est pas connu pour cette pratique. L\'apposition de l\'effigie présidentielle sur les timbres était une tradition liée à la communication officielle de l\'État.'
        },
        {
          type: 'qcm4',
          q: 'Combien de ministres comptait le gouvernement d\'Albert Ouédraogo, Premier ministre de la transition sous le MPSR I ?',
          choices: ['20 ministres', '22 ministres', '25 ministres', '30 ministres'],
          r: 2,
          nb: 'Le gouvernement d\'Albert Ouédraogo, formé en mars 2022 sous la présidence du lieutenant-colonel Paul-Henri Sandaogo Damiba (MPSR I), comptait 25 membres : 23 ministres titulaires et 2 ministres délégués. Ce gouvernement de transition a été constitué dans la foulée du coup d\'État du 24 janvier 2022 contre Roch Marc Christian Kaboré.'
        },
        {
          type: 'qcm4',
          q: 'Quel pays a été désigné pays invité d\'honneur du FESPACO 2023 (28e édition) ?',
          choices: ['Togo', 'Sénégal', 'Mali', 'Côte d\'Ivoire'],
          r: 2,
          nb: 'Le Mali a été le pays invité d\'honneur de la 28e édition du FESPACO, organisée en 2023 à Ouagadougou. Le Togo avait initialement été mentionné mais c\'est finalement le Mali qui a été désigné pour cette distinction, permettant ainsi de mettre en lumière le cinéma malien.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le titre exact du roman d\'Ousmane Sembène publié en 1960, retraçant une grève de cheminots au Sénégal et au Mali ?',
          choices: ['Le Bout de bois de Dieu', 'Les Bouts de bois de Dieu', 'Le Dernier de l\'Empire', 'Le Docker noir'],
          r: 1,
          nb: '« Les Bouts de bois de Dieu » (et non « Le Bout » au singulier) est un roman d\'Ousmane Sembène publié en 1960. Il relate la grève historique des cheminots de la ligne Dakar-Niger de 1947-1948. Cette œuvre est considérée comme un manifeste anticolonial et une fresque sociale majeure de la littérature africaine.'
        },
        {
          type: 'qcm4',
          q: 'À qui est attribuée la citation « La religion est l\'opium du peuple » ?',
          choices: ['Friedrich Nietzsche', 'Sigmund Freud', 'Karl Marx', 'Jean-Paul Sartre'],
          r: 2,
          nb: 'Karl Marx a écrit cette formule dans l\'« Introduction à la Contribution à la critique de la philosophie du droit de Hegel » (1844). Par cette métaphore, il critique la religion comme instrument d\'aliénation qui console les opprimés sans les libérer, détournant leur attention des injustices sociales réelles.'
        },
        {
          type: 'qcm4',
          q: 'Quelle philosophe féministe est l\'auteure de l\'ouvrage fondateur « Le Deuxième Sexe » (1949) ?',
          choices: ['Hannah Arendt', 'Simone Weil', 'Simone de Beauvoir', 'Julia Kristeva'],
          r: 2,
          nb: '« Le Deuxième Sexe » (1949) est l\'œuvre majeure de Simone de Beauvoir, philosophe existentialiste française. Cet ouvrage analyse la condition de la femme dans la société patriarcale et pose la distinction fondatrice entre le sexe (biologique) et le genre (social) : « On ne naît pas femme, on le devient. »'
        },
        {
          type: 'qcm4',
          q: 'Quel philosophe est l\'auteur de la « Critique de la raison pure », œuvre fondamentale de la philosophie moderne publiée en 1781 ?',
          choices: ['René Descartes', 'Georg Hegel', 'Emmanuel Kant', 'David Hume'],
          r: 2,
          nb: 'La « Critique de la raison pure » (Kritik der reinen Vernunft, 1781) est l\'œuvre maîtresse d\'Emmanuel Kant (1724-1804). Dans cet ouvrage, Kant analyse les conditions et les limites de la connaissance humaine, établissant une « révolution copernicienne » en philosophie qui synthétise l\'empirisme et le rationalisme.'
        },
        {
          type: 'qcm4',
          q: 'Dans l\'œuvre « Germinal » d\'Émile Zola, quelle est la signification symbolique du titre ?',
          choices: ['Le nom du personnage principal de la mine', 'Le mois de mars du calendrier grégorien', 'Le renouveau, la germination d\'une révolte ouvrière', 'Le terme technique désignant les mines de charbon'],
          r: 2,
          nb: '« Germinal » est le septième mois du calendrier républicain français (environ mi-mars à mi-avril), qui correspond à la germination printanière. Dans le roman d\'Émile Zola (1885), le titre symbolise à la fois le réveil de la conscience ouvrière, la germination d\'une révolte sociale et l\'espoir d\'un monde plus juste qui « germe » sous terre.'
        },
        {
          type: 'qcm4',
          q: 'Selon quel philosophe le génie artistique est-il un don naturel qui donne à l\'art ses règles, sans pouvoir s\'enseigner ?',
          choices: ['Platon', 'Aristote', 'Hegel', 'Emmanuel Kant'],
          r: 3,
          nb: 'Dans la « Critique de la faculté de juger » (1790), Emmanuel Kant affirme que le génie est un talent naturel inné qui permet à l\'artiste de créer des œuvres originales dont les règles ne peuvent être enseignées ni apprises. Le génie ne suit pas des règles préétablies mais en crée de nouvelles pour l\'art.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le vrai nom de l\'écrivain et philosophe français connu sous le pseudonyme de Voltaire ?',
          choices: ['Jean-Baptiste Poquelin', 'François-Marie Arouet', 'Jean-Paul Marat', 'Denis Diderot'],
          r: 1,
          nb: 'Voltaire (1694-1778) est le nom de plume de François-Marie Arouet, qu\'il adopta à partir de 1718. Écrivain, philosophe et polémiste des Lumières, il est l\'auteur de « Candide », « Zadig », « L\'Ingénu » et de nombreux essais. Fer de lance de la lutte contre le fanatisme et l\'intolérance, il est l\'une des figures les plus influentes du XVIIIe siècle.'
        },
        {
          type: 'qcm4',
          q: 'Dans quel pays s\'est tenue la Coupe d\'Afrique des Nations (CAN) 1998 ?',
          choices: ['Nigeria', 'Maroc', 'Ghana', 'Burkina Faso'],
          r: 3,
          nb: 'Le Burkina Faso a organisé la 21e édition de la Coupe d\'Afrique des Nations en 1998. Ce tournoi, organisé dans deux villes (Ouagadougou et Bobo-Dioulasso), a été remporté par l\'Égypte, qui a battu l\'Afrique du Sud en finale. C\'est la seule grande compétition internationale de football que le Burkina Faso ait organisée.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année le Burkina Faso a-t-il joué sa première et unique finale de la Coupe d\'Afrique des Nations ?',
          choices: ['1998', '2004', '2013', '2017'],
          r: 2,
          nb: 'Les Étalons du Burkina Faso ont atteint la finale de la CAN pour la première fois en 2013 lors du tournoi organisé en Afrique du Sud. Ils ont perdu face au Nigeria sur le score de 1-0 (but de Sunday Mba). Cette performance reste le meilleur résultat de l\'équipe nationale dans cette compétition.'
        },
        {
          type: 'qcm4',
          q: 'Comment appelle-t-on les structures économiques telles que les banques, les microfinances, les assurances et autres intermédiaires financiers ?',
          choices: ['Entreprises commerciales', 'Institutions financières', 'Services publics économiques', 'Organismes de développement'],
          r: 1,
          nb: 'Les institutions financières sont des entités dont l\'activité principale consiste à collecter, gérer et distribuer des ressources financières. Elles incluent les banques commerciales, les établissements de microfinance, les compagnies d\'assurance et les marchés financiers. Elles jouent un rôle central dans le financement de l\'économie.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman burkinabè « Rougbeinga » ?',
          choices: ['Titinga Frédéric Pacéré', 'Norbert Zongo', 'Pierre Claver Ilboudo', 'Bernadette Sanou Dao'],
          r: 1,
          nb: '« Rougbeinga » est un roman de Norbert Zongo (1949-1998), journaliste et écrivain burkinabè engagé. Cette œuvre littéraire explore des thèmes tels que la liberté, la dignité humaine et la culture africaine. Zongo est également connu pour « Le Parachutage » et pour son journal d\'investigation L\'Indépendant.'
        },
        {
          type: 'qcm4',
          q: 'Dans la classification traditionnelle des arts, que désigne le « 9e art » ?',
          choices: ['Le cinéma', 'La photographie', 'La bande dessinée', 'Les jeux vidéo'],
          r: 2,
          nb: 'La bande dessinée (BD) est reconnue comme le 9e art dans la classification française traditionnelle des arts. Les huit premiers arts sont : l\'architecture (1er), la sculpture (2e), la peinture (3e), la musique (4e), la littérature (5e), la danse  (6e), le cinéma (7e) et les arts médiatiques (la radio, la télévision, la photographie) (8e).'
        },
        {
          type: 'qcm4',
          q: 'À quelle union monétaire et économique le Burkina Faso appartient-il ?',
          choices: ['CEDEAO (Communauté Économique des États de l\'Afrique de l\'Ouest)', 'UEMOA (Union Économique et Monétaire Ouest-Africaine)', 'UA (Union Africaine)', 'CEMAC (Communauté Économique et Monétaire de l\'Afrique Centrale)'],
          r: 1,
          nb: 'Le Burkina Faso est membre de l\'UEMOA (Union Économique et Monétaire Ouest-Africaine), qui regroupe 8 pays utilisant le franc CFA (XOF) : Bénin, Burkina Faso, Côte d\'Ivoire, Guinée-Bissau, Mali, Niger, Sénégal et Togo. Cette union gère une monnaie commune et harmonise les politiques économiques.'
        },
        {
          type: 'qcm4',
          q: 'Que désigne le concept sociologique de « melting pot » ?',
          choices: ['L\'isolement volontaire des communautés culturelles dans une société', 'La fusion et le brassage de différentes cultures, ethnies ou origines', 'La domination d\'une culture nationale sur les cultures minoritaires', 'La séparation administrative des groupes ethniques dans un État'],
          r: 1,
          nb: 'Le « melting pot » (littéralement « pot fondeur ») est un concept sociologique désignant le processus par lequel des individus d\'origines diverses se fondent en une nouvelle identité commune. Il est historiquement associé aux États-Unis, où il a décrit l\'assimilation des vagues successives d\'immigrants. Il s\'oppose au concept de « communautarisme » ou de « mosaïque culturelle ».'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la situation concernant la reconnaissance internationale de la capitale d\'Israël ?',
          choices: ['Jérusalem est universellement reconnue comme capitale d\'Israël par tous les États', 'Tel-Aviv est la capitale internationale reconnue par la majorité des États', 'Haïfa est la capitale diplomatique d\'Israël', 'Israël ne dispose pas de capitale officiellement reconnue'],
          r: 1,
          nb: 'Israël revendique Jérusalem comme sa capitale depuis 1950, mais la majorité des États membres de l\'ONU ne reconnaissent pas cette décision et maintiennent leurs ambassades à Tel-Aviv. Les États-Unis ont transféré leur ambassade à Jérusalem en 2018, suivis par quelques autres pays. Cette question reste une source de tension diplomatique internationale.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du dialogue philosophique « La République », qui expose une théorie de la justice et de l\'État idéal ?',
          choices: ['Aristote', 'Socrate', 'Platon', 'Cicéron'],
          r: 2,
          nb: '« La République » (Politeia) est l\'œuvre maîtresse de Platon (428-348 av. J.-C.), écrite sous forme de dialogues dans lesquels Socrate est le protagoniste principal. Platon y développe sa théorie de l\'État juste, gouverné par des philosophes-rois, ainsi que la célèbre allégorie de la caverne pour illustrer le passage de l\'ignorance à la connaissance.'
        },
        {
          type: 'qcm4',
          q: 'À quelle date a été officiellement lancé l\'APEC (Actionnariat Populaire pour l\'Entrepreneuriat Communautaire) au Burkina Faso ?',
          choices: ['4 août 2022', '12 juin 2023', '29 octobre 2023', '11 janvier 2024'],
          r: 1,
          nb: 'Le programme APEC (Actionnariat Populaire pour l\'Entrepreneuriat Communautaire) au Burkina Faso a été officiellement lancé le 12 juin 2023 dans la salle de conférence de Ouaga 2000, sous le thème : « Actionnariat populaire pour un développement endogène et inclusif ». Ce programme vise à impliquer les citoyens dans le financement du développement national.'
        },
        {
          type: 'qcm4',
          q: 'Qui était le Secrétaire général de l\'ONU avant Ban Ki-moon, ayant exercé de 1997 à 2006 ?',
          choices: ['Boutros Boutros-Ghali', 'Kofi Annan', 'Javier Pérez de Cuéllar', 'Kurt Waldheim'],
          r: 1,
          nb: 'Kofi Annan (Ghana, 1938-2018) a été le 7e Secrétaire général de l\'ONU de 1997 à 2006. Il a succédé à Boutros Boutros-Ghali et a été remplacé par Ban Ki-moon. Lauréat du Prix Nobel de la Paix en 2001 conjointement avec l\'ONU, il est le premier Africain subsaharien à avoir dirigé l\'organisation.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année a été réalisé le premier film burkinabè, intitulé « Proclamation de l\'indépendance » ?',
          choices: ['1955', '1958', '1963', '1969'],
          r: 1,
          nb: 'Le premier film burkinabè, « Proclamation de l\'indépendance », a été réalisé en 1958 par Sékou Ouédraogo. Il documente la proclamation de la République de Haute-Volta le 11 décembre 1958. Ce film marque l\'acte de naissance du cinéma burkinabè, bien avant la création du FESPACO en 1969.'
        },
        {
          type: 'qcm4',
          q: 'Que signifie l\'expression idiomatique française « tomber dans les pommes » ?',
          choices: ['Avoir une mauvaise idée soudaine', 'Être surpris et ne pas trouver ses mots', 'S\'évanouir, perdre connaissance', 'Commettre une erreur grave'],
          r: 2,
          nb: '« Tomber dans les pommes » est une expression familière française signifiant perdre connaissance, s\'évanouir. Son origine est incertaine : certains l\'attribuent à une déformation de « tomber en pâmoison » ou à une association avec la fraîcheur des pommes utilisées autrefois pour ranimer les personnes évanouies.'
        },
        {
          type: 'qcm4',
          q: 'En quelle année le film « Buud Yam » du réalisateur burkinabè Gaston Kaboré a-t-il remporté l\'Étalon d\'or de Yennenga au FESPACO ?',
          choices: ['1993', '1995', '1997', '1999'],
          r: 2,
          nb: '« Buud Yam » de Gaston Kaboré a remporté l\'Étalon d\'or de Yennenga au FESPACO 1997. Ce film est la suite de « Wend Kuuni » (1982), également primé. Gaston Kaboré est l\'un des pionniers et des figures majeures du cinéma africain, fondateur du CITO (Centre International de Cinéma et Télévision de Ouagadougou).'
        },
        {
          type: 'qcm4',
          q: 'À quelle date la reine Élisabeth II du Royaume-Uni est-elle décédée ?',
          choices: ['8 juin 2022', '8 septembre 2022', '18 octobre 2022', '4 novembre 2022'],
          r: 1,
          nb: 'La reine Élisabeth II est décédée le 8 septembre 2022 au château de Balmoral, en Écosse, à l\'âge de 96 ans. Elle était sur le trône depuis 1952, soit 70 ans de règne, faisant d\'elle la souveraine britannique ayant régné le plus longtemps. Son fils Charles III lui a succédé immédiatement.'
        },
        {
          type: 'qcm4',
          q: 'Quel pays a cessé de combattre et s\'est retiré de la Première Guerre mondiale à la suite de sa révolution bolchévique en 1917 ?',
          choices: ['L\'Autriche-Hongrie', 'La Bulgarie', 'L\'Empire ottoman', 'La Russie'],
          r: 3,
          nb: 'Après la Révolution d\'Octobre 1917, la Russie bolchévique a cessé les hostilités. Un armistice avec l\'Allemagne a été signé en décembre 1917, puis le traité de Brest-Litovsk en mars 1918 a officialisé le retrait russe de la guerre. La Russie a cédé d\'importants territoires en échange de la paix.'
        },
        {
          type: 'qcm4',
          q: 'Quel est le pays qui a été divisé en deux États distincts à la suite de la guerre de 1950-1953 et de l\'armistice signé le 27 juillet 1953 ?',
          choices: ['Le Vietnam', 'L\'Allemagne', 'La Corée', 'La Yougoslavie'],
          r: 2,
          nb: 'La péninsule coréenne, divisée en 1945 entre une zone d\'occupation soviétique (Nord) et américaine (Sud), a été le théâtre de la guerre de Corée (1950-1953). L\'armistice du 27 juillet 1953 a officialisé et consolidé la division entre la République de Corée (Sud) et la République populaire démocratique de Corée (Nord), séparées par la zone démilitarisée (DMZ).'
        },
        {
          type: 'qcm4',
          q: 'Dans quel pays (actuel) est née Mère Teresa, fondatrice des Missionnaires de la Charité ?',
          choices: ['Albanie', 'Grèce', 'Roumanie', 'Macédoine du Nord'],
          r: 3,
          nb: 'Mère Teresa (1910-1997), de son vrai nom Agnes Gonxha Bojaxhiu, est née le 26 août 1910 à Skopje, ville qui appartient aujourd\'hui à la Macédoine du Nord. À l\'époque de sa naissance, Skopje faisait partie de l\'Empire ottoman. Elle a fondé les Missionnaires de la Charité à Calcutta (Inde) et a reçu le Prix Nobel de la Paix en 1979.'
        },
        {
          type: 'qcm4',
          q: 'Dans le célèbre discours de Martin Luther King, la répétition de l\'expression « I have a dream » au début de plusieurs phrases successives constitue quelle figure de style ?',
          choices: ['La métaphore', 'L\'hyperbole', 'L\'anaphore', 'La synecdoque'],
          r: 2,
          nb: 'L\'anaphore est une figure de style qui consiste en la répétition d\'un même mot ou groupe de mots au début de phrases ou de membres de phrases successifs, pour créer un effet d\'insistance et de rythme. Dans le discours de Martin Luther King du 28 août 1963, « I have a dream » est répété huit fois de suite, créant une montée en puissance rhétorique inoubliable.'
        },
        {
          type: 'qcm4',
          q: 'Qui est l\'auteur du roman « Voyage au bout de la nuit » (1932), chef-d\'œuvre de la littérature française du XXe siècle ?',
          choices: ['André Malraux', 'Albert Camus', 'Jean-Paul Sartre', 'Louis-Ferdinand Céline'],
          r: 3,
          nb: '« Voyage au bout de la nuit » est le premier roman de Louis-Ferdinand Céline (1894-1961), publié en 1932. À travers le personnage de Bardamu, Céline dresse un tableau sombre et désenchanté de la condition humaine, de la guerre, de la colonisation et de la misère sociale. Son style révolutionnaire (argot, ponctuation) a marqué la littérature française.'
        },
        {
          type: 'qcm4',
          q: 'L\'équation x(x – 1) = 0 admet combien de solutions dans ℝ ?',
          choices: ['Aucune solution', 'Une seule solution (x = 0)', 'Une seule solution (x = 1)', 'Deux solutions (x = 0 et x = 1)'],
          r: 3,
          nb: 'Par la règle du produit nul, x(x – 1) = 0 si et seulement si x = 0 ou x – 1 = 0. On obtient donc deux solutions distinctes : x = 0 et x = 1. Cette équation est un trinôme du second degré qui admet deux racines réelles.'
        },
        {
          type: 'qcm4',
          q: 'Si dans un triangle ABC on vérifie que AB² = AC² + BC², alors le triangle est :',
          choices: ['Équilatéral', 'Isocèle en A', 'Rectangle en A', 'Rectangle en C'],
          r: 3,
          nb: 'D\'après le théorème de Pythagore (et sa réciproque), si AB² = AC² + BC², alors l\'angle opposé à AB (c\'est-à-dire l\'angle en C) est droit. Le triangle est donc rectangle en C, AB étant l\'hypoténuse (le côté le plus long, opposé à l\'angle droit).'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la valeur de x dans l\'équation : 3x – 5 = 10 ?',
          choices: ['3', '4', '5', '7'],
          r: 2,
          nb: 'On résout l\'équation en isolant x : 3x – 5 = 10 → 3x = 10 + 5 = 15 → x = 15 ÷ 3 = 5. Vérification : 3(5) – 5 = 15 – 5 = 10 ✓'
        },
        {
          type: 'qcm4',
          q: 'Quelle est la forme factorisée de l\'expression algébrique x² – 9 ?',
          choices: ['(x – 9)(x + 1)', '(x – 3)²', '(x + 3)²', '(x – 3)(x + 3)'],
          r: 3,
          nb: 'x² – 9 est une différence de deux carrés : x² – 9 = x² – 3². En appliquant l\'identité remarquable a² – b² = (a – b)(a + b), on obtient : x² – 9 = (x – 3)(x + 3). Vérification : (x – 3)(x + 3) = x² + 3x – 3x – 9 = x² – 9 ✓'
        },
        {
          type: 'qcm4',
          q: 'Quelles sont les solutions de l\'équation : 9 = √(4 – 5x)² ?',
          choices: ['x = 1 uniquement', 'x = –1 et x = 5', 'x = –1 et x = 13/5', 'x = 0 uniquement'],
          r: 2,
          nb: '√(4 – 5x)² = |4 – 5x|. L\'équation devient |4 – 5x| = 9, soit deux cas : (1) 4 – 5x = 9 → –5x = 5 → x = –1 ; (2) 4 – 5x = –9 → –5x = –13 → x = 13/5. Vérifications : x = –1 : |4+5| = 9 ✓ ; x = 13/5 : |4–13| = 9 ✓'
        },
        {
          type: 'qcm4',
          q: 'Lequel de ces couples ne vérifie PAS l\'inéquation −3 + x − 2y ≤ 0 ?',
          choices: ['(0 ; –1)', '(–1 ; 2)', '(4 ; 0)', '(1 ; 3)'],
          r: 2,
          nb: 'On vérifie en remplaçant (x, y) dans −3 + x − 2y : (0, –1) : –3+0+2 = –1 ≤ 0 ✓ ; (–1, 2) : –3–1–4 = –8 ≤ 0 ✓ ; (4, 0) : –3+4–0 = 1 > 0 ✗ (ne vérifie pas) ; (1, 3) : –3+1–6 = –8 ≤ 0 ✓. Seul (4, 0) ne satisfait pas l\'inéquation.'
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

    // Récupérer une session par ID — V63.29 : cherche aussi dans Firestore
    getSession(sessionId) {
      // 1) Code (sessions.js)
      const codeSession = this.getAllSessions().find(s => s.id === sessionId);
      if (codeSession) return codeSession;
      // 2) Firestore (cache local)
      if (window.SessionsFirestore && window.SessionsFirestore._sessionsCache) {
        const fsSession = window.SessionsFirestore._sessionsCache.find(s => s.id === sessionId);
        if (fsSession) return fsSession;
      }
      return undefined;
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
