// Bara Concours - Module Notifications
// Notifications locales : QCM quotidien à 8h00

const Notifications = {
  permission: 'default',
  swRegistration: null,
  scheduleCheckInterval: null,
  DAILY_TIME: '08:00',

  async init() {
    if (!('Notification' in window)) {
      console.warn('[Notif] Non supportées par ce navigateur');
      return false;
    }
    this.permission = Notification.permission;

    if ('serviceWorker' in navigator) {
      this.swRegistration = await navigator.serviceWorker.ready;
    }

    if (this.permission === 'granted') {
      this.startDailyScheduler();
    }
    return true;
  },

  // === DEMANDE D'AUTORISATION ===
  async requestPermission() {
    if (!('Notification' in window)) {
      return { success: false, reason: 'unsupported' };
    }

    if (Notification.permission === 'granted') {
      this.permission = 'granted';
      this.startDailyScheduler();
      return { success: true };
    }

    if (Notification.permission === 'denied') {
      return { success: false, reason: 'denied' };
    }

    const permission = await Notification.requestPermission();
    this.permission = permission;

    if (permission === 'granted') {
      this.startDailyScheduler();
      this.showWelcomeNotification();
      return { success: true };
    }
    return { success: false, reason: permission };
  },

  // === PLANIFICATEUR QUOTIDIEN ===
  startDailyScheduler() {
    if (this.scheduleCheckInterval) clearInterval(this.scheduleCheckInterval);

    this.checkAndNotify();
    this.scheduleCheckInterval = setInterval(() => {
      this.checkAndNotify();
    }, 60 * 1000);

    console.log('[Notif] Planificateur démarré (QCM quotidien à ' + this.DAILY_TIME + ')');
  },

  checkAndNotify() {
    if (this.permission !== 'granted') return;

    const now = new Date();
    const currentTime = String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0');
    const todayKey = now.toISOString().split('T')[0];
    const lastSent = localStorage.getItem('bara_last_daily_notif');

    if (currentTime === this.DAILY_TIME && lastSent !== todayKey) {
      this.showDailyQCMNotification();
      localStorage.setItem('bara_last_daily_notif', todayKey);
    }
  },

  // === NOTIFICATIONS ===
  async showDailyQCMNotification() {
    if (this.permission !== 'granted' || !this.swRegistration) return;

    const messages = [
      { title: '📚 C\'est l\'heure du QCM du jour !', body: 'Bonjour ! Quelques minutes de révision ce matin pour réussir ton concours 💪' },
      { title: '🎯 Bara Concours t\'attend', body: 'Ouvre l\'app et fais ton QCM quotidien — la régularité, c\'est la clé du succès !' },
      { title: '🇧🇫 Bonjour, futur cadre !', body: 'Une matière, 10 questions, 5 minutes. Prêt(e) pour ton entraînement matinal ?' },
      { title: '⭐ Ton concours se prépare maintenant', body: 'Chaque jour qui passe te rapproche de la réussite. Allons-y !' }
    ];
    const msg = messages[Math.floor(Math.random() * messages.length)];

    try {
      await this.swRegistration.showNotification(msg.title, {
        body: msg.body,
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-96.png',
        vibrate: [200, 100, 200],
        tag: 'daily-qcm',
        requireInteraction: false,
        data: { type: 'daily-qcm', url: './' }
      });
    } catch (e) { console.error('[Notif] Erreur :', e); }
  },

  async showWelcomeNotification() {
    if (this.permission !== 'granted' || !this.swRegistration) return;
    try {
      await this.swRegistration.showNotification('🎉 Notifications activées !', {
        body: 'Tu recevras un rappel chaque matin à 8h pour ton QCM quotidien',
        icon: 'icons/icon-192.png',
        badge: 'icons/icon-96.png',
        tag: 'welcome'
      });
    } catch (e) { console.error('[Notif] Erreur welcome :', e); }
  },

  // === HELPERS ===
  isSupported() { return 'Notification' in window; },
  isEnabled() { return this.permission === 'granted'; },

  getStatus() {
    if (!this.isSupported()) return { state: 'unsupported', label: 'Non supporté' };
    if (this.permission === 'granted') return { state: 'enabled', label: 'Activées' };
    if (this.permission === 'denied') return { state: 'denied', label: 'Bloquées (paramètres navigateur)' };
    return { state: 'default', label: 'Non activées' };
  },

  async testNotification() {
    if (this.permission !== 'granted' || !this.swRegistration) return false;
    try {
      await this.swRegistration.showNotification('🔔 Test notification', {
        body: 'Les notifications fonctionnent correctement !',
        icon: 'icons/icon-192.png',
        tag: 'test'
      });
      return true;
    } catch { return false; }
  }
};

window.Notifications = Notifications;
