// Bara Concours - Module d'authentification biométrique
// Utilise l'API WebAuthn pour l'empreinte digitale / Face ID
// Fonctionne sur HTTPS uniquement (ou localhost pour les tests)

const BiometricAuth = {

  // Clés localStorage
  STORAGE_KEY_CREDENTIAL: 'bara_biometric_credential',
  STORAGE_KEY_USER: 'bara_biometric_user',
  STORAGE_KEY_ENABLED: 'bara_biometric_enabled',
  STORAGE_KEY_DECLINED: 'bara_biometric_declined',

  // === Vérifier si le navigateur supporte WebAuthn ===
  isSupported() {
    return !!(window.PublicKeyCredential &&
              navigator.credentials &&
              navigator.credentials.create &&
              navigator.credentials.get);
  },

  // === Vérifier si l'appareil a un capteur biométrique disponible ===
  async isAvailable() {
    if (!this.isSupported()) return false;
    try {
      if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
        return await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
      }
      return false;
    } catch (e) {
      console.warn('Biometric check failed:', e);
      return false;
    }
  },

  // === Est-ce que l'utilisateur a déjà activé la bio ? ===
  isEnabled() {
    return localStorage.getItem(this.STORAGE_KEY_ENABLED) === 'true' &&
           !!localStorage.getItem(this.STORAGE_KEY_CREDENTIAL);
  },

  // === A-t-il déjà refusé l'activation ? (pour ne pas proposer en boucle) ===
  hasDeclined() {
    return localStorage.getItem(this.STORAGE_KEY_DECLINED) === 'true';
  },

  // Marquer comme refusé
  markDeclined() {
    localStorage.setItem(this.STORAGE_KEY_DECLINED, 'true');
  },

  // Réinitialiser le refus (utile si l'utilisateur veut réessayer)
  resetDeclined() {
    localStorage.removeItem(this.STORAGE_KEY_DECLINED);
  },

  // === Générer un challenge aléatoire (sécurité WebAuthn) ===
  _generateChallenge() {
    const arr = new Uint8Array(32);
    crypto.getRandomValues(arr);
    return arr;
  },

  // === Convertir un Uint8Array en chaîne base64 (pour stockage) ===
  _bufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary);
  },

  // === Convertir base64 en Uint8Array ===
  _base64ToBuffer(base64) {
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i);
    }
    return bytes;
  },

  // === Enregistrer l'empreinte digitale (1ère fois) ===
  async enroll(userInfo) {
    if (!this.isSupported()) {
      throw new Error('Votre navigateur ne supporte pas l\'authentification biométrique');
    }

    const available = await this.isAvailable();
    if (!available) {
      throw new Error('Aucun capteur biométrique détecté sur cet appareil');
    }

    try {
      // Identifiant unique pour cet utilisateur
      const userId = new TextEncoder().encode(userInfo.phone || 'bara_user_' + Date.now());

      const credentialOptions = {
        publicKey: {
          challenge: this._generateChallenge(),
          rp: {
            name: 'Bara Concours',
            id: window.location.hostname || 'localhost'
          },
          user: {
            id: userId,
            name: userInfo.phone || 'utilisateur',
            displayName: userInfo.nom || userInfo.phone || 'Utilisateur Bara'
          },
          pubKeyCredParams: [
            { type: 'public-key', alg: -7 },   // ES256
            { type: 'public-key', alg: -257 }  // RS256
          ],
          authenticatorSelection: {
            authenticatorAttachment: 'platform', // appareil interne (empreinte, Face ID)
            userVerification: 'required',
            residentKey: 'preferred'
          },
          timeout: 60000,
          attestation: 'none'
        }
      };

      const credential = await navigator.credentials.create(credentialOptions);

      // Stocker l'identifiant de la credential pour les futures connexions
      const credentialData = {
        id: this._bufferToBase64(credential.rawId),
        type: credential.type,
        createdAt: Date.now()
      };

      localStorage.setItem(this.STORAGE_KEY_CREDENTIAL, JSON.stringify(credentialData));
      localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify({
        phone: userInfo.phone,
        nom: userInfo.nom,
        photo: userInfo.photo
      }));
      localStorage.setItem(this.STORAGE_KEY_ENABLED, 'true');
      this.resetDeclined();

      return { success: true, credential: credentialData };

    } catch (err) {
      console.error('Enrollment error:', err);
      if (err.name === 'NotAllowedError') {
        throw new Error('Inscription annulée par l\'utilisateur');
      } else if (err.name === 'InvalidStateError') {
        throw new Error('Cet appareil est déjà enregistré');
      }
      throw new Error('Impossible d\'enregistrer l\'empreinte : ' + (err.message || err));
    }
  },

  // === Authentifier avec l'empreinte (connexions suivantes) ===
  async authenticate() {
    if (!this.isEnabled()) {
      throw new Error('Aucune empreinte enregistrée');
    }

    if (!this.isSupported()) {
      throw new Error('Navigateur non compatible');
    }

    try {
      const credentialData = JSON.parse(localStorage.getItem(this.STORAGE_KEY_CREDENTIAL));
      const credentialId = this._base64ToBuffer(credentialData.id);

      const getOptions = {
        publicKey: {
          challenge: this._generateChallenge(),
          rpId: window.location.hostname || 'localhost',
          allowCredentials: [{
            id: credentialId,
            type: 'public-key',
            transports: ['internal']
          }],
          userVerification: 'required',
          timeout: 60000
        }
      };

      const assertion = await navigator.credentials.get(getOptions);

      if (assertion) {
        const userInfo = JSON.parse(localStorage.getItem(this.STORAGE_KEY_USER) || '{}');
        return { success: true, user: userInfo };
      }

      throw new Error('Échec d\'authentification');

    } catch (err) {
      console.error('Authentication error:', err);
      if (err.name === 'NotAllowedError') {
        throw new Error('Authentification annulée');
      }
      throw new Error('Échec de la vérification biométrique');
    }
  },

  // === Désactiver la biométrie ===
  disable() {
    localStorage.removeItem(this.STORAGE_KEY_CREDENTIAL);
    localStorage.removeItem(this.STORAGE_KEY_USER);
    localStorage.removeItem(this.STORAGE_KEY_ENABLED);
    this.resetDeclined();
  },

  // === Récupérer les infos de l'utilisateur enregistré ===
  getEnrolledUser() {
    if (!this.isEnabled()) return null;
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY_USER) || '{}');
    } catch (e) {
      return null;
    }
  }
};

window.BiometricAuth = BiometricAuth;
