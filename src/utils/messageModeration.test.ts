import { describe, it, expect, beforeEach } from 'vitest';
import { MessageModerator } from './messageModeration';

describe('MessageModerator', () => {
  let moderator: MessageModerator;

  beforeEach(() => {
    moderator = new MessageModerator();
  });

  describe('coordonnées bloquées avant accord', () => {
    it('bloque un numéro tunisien', () => {
      const result = moderator.moderateMessage('Appelle moi au +21698123456');
      expect(result.isAllowed).toBe(false);
      expect(result.warningType).toBeTruthy();
    });

    it('bloque un numéro au format espacé', () => {
      const result = moderator.moderateMessage('mon 98 12 34 56 78 est dispo');
      expect(result.isAllowed).toBe(false);
      expect(result.blockedContent.length).toBeGreaterThan(0);
    });

    it('bloque une adresse email', () => {
      const result = moderator.moderateMessage('écris à ahmed@example.com');
      expect(result.isAllowed).toBe(false);
      expect(result.warningType).toBe('contact_info');
    });

    it('bloque la mention d’une plateforme externe', () => {
      const result = moderator.moderateMessage('on continue sur WhatsApp ?');
      expect(result.isAllowed).toBe(false);
      expect(result.warningType).toBe('external_link');
    });

    it('bloque une tentative de contournement', () => {
      const result = moderator.moderateMessage('contacte moi directement stp');
      expect(result.isAllowed).toBe(false);
      expect(result.warningType).toBe('bypass_attempt');
    });

    it('fournit un message explicatif quand il bloque', () => {
      const result = moderator.moderateMessage('mon mail: a@b.fr');
      expect(result.suggestedMessage).toBeTruthy();
    });
  });

  describe('messages légitimes', () => {
    it('laisse passer un message normal', () => {
      const result = moderator.moderateMessage(
        'Bonjour, je suis disponible dès le 20 octobre pour la récolte.',
      );
      expect(result.isAllowed).toBe(true);
      expect(result.warningType).toBeNull();
      expect(result.blockedContent).toHaveLength(0);
    });

    it('laisse passer un message vide', () => {
      expect(moderator.moderateMessage('').isAllowed).toBe(true);
    });

    it('ne confond pas une quantité avec un numéro', () => {
      const result = moderator.moderateMessage('Je peux ramasser 40 kg par jour.');
      expect(result.isAllowed).toBe(true);
    });
  });

  describe('transaction sécurisée', () => {
    it('autorise les coordonnées une fois la mission acceptée', () => {
      const result = moderator.moderateMessage('+21698123456', 'accepted');
      expect(result.isAllowed).toBe(true);
    });

    it('autorise les coordonnées une fois payée', () => {
      const result = moderator.moderateMessage('mon mail: a@b.fr', 'paid');
      expect(result.isAllowed).toBe(true);
    });

    it('bloque encore si la candidature est seulement en attente', () => {
      const result = moderator.moderateMessage('+21698123456', 'pending');
      expect(result.isAllowed).toBe(false);
    });
  });

  describe('appels répétés', () => {
    // Les patterns sont des champs d'instance avec le drapeau /g : regex.test()
    // avance lastIndex, donc un même contenu doit rester bloqué d'un appel à
    // l'autre (non-régression sur l'état partagé).
    it('bloque le même contenu de façon stable sur plusieurs appels', () => {
      for (let i = 0; i < 4; i++) {
        expect(moderator.moderateMessage('on parle sur whatsapp').isAllowed).toBe(false);
      }
    });

    it('bloque le même numéro sur plusieurs appels', () => {
      for (let i = 0; i < 4; i++) {
        expect(moderator.moderateMessage('+21698123456').isAllowed).toBe(false);
      }
    });
  });

  describe('sanitizeMessage', () => {
    it('masque un numéro', () => {
      const sanitized = moderator.sanitizeMessage('appelle +21698123456');
      expect(sanitized).not.toContain('21698123456');
      expect(sanitized).toContain('masqué');
    });

    it('masque un email', () => {
      const sanitized = moderator.sanitizeMessage('mail: ahmed@example.com');
      expect(sanitized).not.toContain('ahmed@example.com');
    });

    it('laisse un message propre intact', () => {
      const message = 'Rendez-vous à 7h à l’entrée du domaine.';
      expect(moderator.sanitizeMessage(message)).toBe(message);
    });
  });
});
