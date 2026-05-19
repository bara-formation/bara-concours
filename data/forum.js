// Bara Concours - Module Forum (Phase 3)
// Forum communautaire global avec modération automatique

const ForumService = {
  // === MODÉRATION AUTOMATIQUE ===
  // Liste de mots interdits (insultes, spam connu)
  BLOCKED_WORDS: [
    'connard','connasse','salope','pute','enculé','enculée','enculer',
    'merde','putain','batard','bâtard','idiot','imbécile','crétin',
    'ferme ta gueule','ta gueule','nique','niquer','niquée',
    'whatsapp+', 'http://', 'https://', 'www.', '.com', '.fr', '.net',
    'gagner argent','argent facile','crypto gratuit','bitcoin gratuit',
    'arnaque','escroc','escroquerie'
  ],

  MAX_TITLE_LENGTH: 120,
  MAX_BODY_LENGTH: 2000,
  MAX_REPLY_LENGTH: 1000,
  MIN_TITLE_LENGTH: 10,
  MIN_BODY_LENGTH: 20,

  // Limites anti-spam (par utilisateur)
  MAX_POSTS_PER_HOUR: 5,
  MAX_REPLIES_PER_HOUR: 15,

  // === VALIDATION DE CONTENU ===
  validatePost(title, body) {
    const errors = [];

    if (!title || title.trim().length < this.MIN_TITLE_LENGTH) {
      errors.push(`Le titre doit faire au moins ${this.MIN_TITLE_LENGTH} caractères`);
    }
    if (title && title.length > this.MAX_TITLE_LENGTH) {
      errors.push(`Le titre ne doit pas dépasser ${this.MAX_TITLE_LENGTH} caractères`);
    }
    if (!body || body.trim().length < this.MIN_BODY_LENGTH) {
      errors.push(`Le message doit faire au moins ${this.MIN_BODY_LENGTH} caractères`);
    }
    if (body && body.length > this.MAX_BODY_LENGTH) {
      errors.push(`Le message ne doit pas dépasser ${this.MAX_BODY_LENGTH} caractères`);
    }

    // Vérification des mots interdits
    const fullText = (title + ' ' + body).toLowerCase();
    const blocked = this.BLOCKED_WORDS.filter(w => fullText.includes(w));
    if (blocked.length > 0) {
      errors.push(`Le message contient du contenu inapproprié ou un lien externe interdit`);
    }

    // Anti-spam : trop de majuscules
    const upperRatio = (body.match(/[A-Z]/g) || []).length / Math.max(body.length, 1);
    if (upperRatio > 0.5 && body.length > 30) {
      errors.push('Évite d\'écrire en MAJUSCULES (impression de crier)');
    }

    // Anti-spam : caractères répétés
    if (/(.)\1{6,}/.test(body)) {
      errors.push('Évite les caractères répétés excessivement');
    }

    return { valid: errors.length === 0, errors };
  },

  validateReply(text) {
    const errors = [];

    if (!text || text.trim().length < 5) {
      errors.push('La réponse doit faire au moins 5 caractères');
    }
    if (text && text.length > this.MAX_REPLY_LENGTH) {
      errors.push(`La réponse ne doit pas dépasser ${this.MAX_REPLY_LENGTH} caractères`);
    }

    const lower = text.toLowerCase();
    const blocked = this.BLOCKED_WORDS.filter(w => lower.includes(w));
    if (blocked.length > 0) {
      errors.push('La réponse contient du contenu inapproprié');
    }

    return { valid: errors.length === 0, errors };
  },

  // === LIMITES UTILISATEUR (anti-spam) ===
  canUserPost(history) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentPosts = (history || []).filter(p =>
      p.type === 'post' && p.timestamp > oneHourAgo
    );
    return recentPosts.length < this.MAX_POSTS_PER_HOUR;
  },

  canUserReply(history) {
    const oneHourAgo = Date.now() - 60 * 60 * 1000;
    const recentReplies = (history || []).filter(p =>
      p.type === 'reply' && p.timestamp > oneHourAgo
    );
    return recentReplies.length < this.MAX_REPLIES_PER_HOUR;
  },

  // === DONNÉES DE DÉMONSTRATION ===
  // Posts d'exemple pour avoir un forum non-vide à l'ouverture
  getDemoTopics() {
    const now = Date.now();
    const oneHour = 60 * 60 * 1000;
    return [
      {
        id: 'demo_1',
        authorName: 'Adama K.',
        authorCity: 'Ouagadougou',
        authorIsPremium: false,
        title: 'Conseils pour les épreuves physiques GSP ?',
        body: 'Salut à tous ! Je prépare le concours GSP pour la première fois. Quelqu\'un peut me donner des conseils pour l\'épreuve d\'endurance (course 3000m) ? Combien de temps il faut pour s\'entraîner avant le concours ?',
        timestamp: now - 2 * oneHour,
        replyCount: 4,
        upvotes: 12,
        category: 'concours',
        replies: [
          {
            id: 'r1',
            authorName: 'Issouf B.',
            authorIsPremium: true,
            text: 'Salut Adama ! Pour le 3000m, vise un temps de 14-15 minutes pour être à l\'aise. Commence par 3 séances/semaine avec 20 min de course continue, puis augmente progressivement. 2 mois minimum d\'entraînement avant le jour J.',
            timestamp: now - 1.8 * oneHour,
            upvotes: 8
          },
          {
            id: 'r2',
            authorName: 'Mariam D.',
            authorIsPremium: false,
            text: 'Je confirme. Le terrain de l\'École de Police à Ouaga est bien pour s\'entraîner le matin tôt (5h-6h30). Apporte beaucoup d\'eau.',
            timestamp: now - 1.2 * oneHour,
            upvotes: 5
          }
        ]
      },
      {
        id: 'demo_2',
        authorName: 'Fatim O.',
        authorCity: 'Bobo-Dioulasso',
        authorIsPremium: true,
        title: 'Méthode pour mémoriser les régions et provinces du BF',
        body: 'Bonjour ! Pour la culture générale, j\'ai trouvé une astuce pour mémoriser les 13 régions et 45 provinces. Je fais des fiches par région avec les provinces et chefs-lieux. Quelqu\'un a d\'autres techniques ?',
        timestamp: now - 5 * oneHour,
        replyCount: 7,
        upvotes: 24,
        category: 'methode'
      },
      {
        id: 'demo_3',
        authorName: 'Ousmane T.',
        authorCity: 'Koudougou',
        authorIsPremium: false,
        title: 'Date du prochain concours Police Nationale ?',
        body: 'Quelqu\'un a-t-il l\'info sur la date d\'ouverture du prochain concours direct de la Police Nationale ? J\'ai entendu parler de mai mais je ne suis pas sûr.',
        timestamp: now - 8 * oneHour,
        replyCount: 12,
        upvotes: 18,
        category: 'info'
      }
    ];
  },

  // === FORMATAGE ===
  formatRelativeTime(timestamp) {
    const diff = Date.now() - timestamp;
    const min = 60 * 1000;
    const hour = 60 * min;
    const day = 24 * hour;

    if (diff < min) return 'à l\'instant';
    if (diff < hour) return `il y a ${Math.floor(diff / min)} min`;
    if (diff < day) return `il y a ${Math.floor(diff / hour)} h`;
    if (diff < 7 * day) return `il y a ${Math.floor(diff / day)} j`;

    const d = new Date(timestamp);
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  },

  // Initiales pour l'avatar
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0].substring(0, 2).toUpperCase();
  },

  // Couleur d'avatar basée sur le nom (consistante)
  getAvatarColor(name) {
    const colors = ['#0F5132', '#1e40af', '#9f1239', '#854d0e', '#6b21a8', '#0891b2', '#15803d', '#dc2626'];
    let hash = 0;
    for (let i = 0; i < (name || '').length; i++) hash = ((hash << 5) - hash) + name.charCodeAt(i);
    return colors[Math.abs(hash) % colors.length];
  }
};

window.ForumService = ForumService;
