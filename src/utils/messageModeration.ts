
// Système de modération automatique des messages
export interface ModerationResult {
  isAllowed: boolean;
  blockedContent: string[];
  warningType: 'contact_info' | 'external_link' | 'bypass_attempt' | null;
  suggestedMessage?: string;
}

export class MessageModerator {
  // Patterns pour détecter les coordonnées
  private phonePatterns = [
    /(\+?33|0)[1-9](\d{8})/g, // Numéros français
    /(\+?216)[0-9]{8}/g, // Numéros tunisiens
    /\b\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}[\s.-]?\d{2}\b/g, // Format général
  ];

  private emailPatterns = [
    /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g,
    /\b[A-Za-z0-9._%+-]+\s*@\s*[A-Za-z0-9.-]+\s*\.\s*[A-Z|a-z]{2,}\b/g, // Avec espaces
  ];

  // Ces patterns sont testés avec .test() : pas de drapeau /g, sinon
  // lastIndex est conservé d'un appel à l'autre sur ces instances
  // partagées et un message sur deux passerait au travers.
  private externalPlatforms = [
    /whatsapp/i,
    /messenger/i,
    /telegram/i,
    /discord/i,
    /skype/i,
    /viber/i,
    /signal/i,
  ];

  private bypassAttempts = [
    /contact.*moi.*directement/i,
    /appelle.*moi/i,
    /écris.*moi/i,
    /mon.*numéro/i,
    /outside.*platform/i,
    /en.*dehors/i,
    /directement.*sans/i,
  ];

  moderateMessage(content: string, applicationStatus?: string): ModerationResult {
    const blockedContent: string[] = [];
    let warningType: ModerationResult['warningType'] = null;

    // Si une application est déjà acceptée et payée, on est plus permissif
    const isTransactionSecured = applicationStatus === 'accepted' || applicationStatus === 'paid';

    if (!isTransactionSecured) {
      // Vérifier les numéros de téléphone
      this.phonePatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          blockedContent.push(...matches);
          warningType = 'contact_info';
        }
      });

      // Vérifier les emails
      this.emailPatterns.forEach(pattern => {
        const matches = content.match(pattern);
        if (matches) {
          blockedContent.push(...matches);
          warningType = 'contact_info';
        }
      });

      // Vérifier les mentions de plateformes externes
      const platformMatches = this.externalPlatforms.some(pattern => pattern.test(content));
      if (platformMatches) {
        warningType = 'external_link';
      }

      // Vérifier les tentatives de contournement
      const bypassMatches = this.bypassAttempts.some(pattern => pattern.test(content));
      if (bypassMatches) {
        warningType = 'bypass_attempt';
      }
    }

    const isAllowed = blockedContent.length === 0 && !warningType;

    return {
      isAllowed,
      blockedContent,
      warningType,
      suggestedMessage: this.getSuggestedMessage(warningType),
    };
  }

  private getSuggestedMessage(warningType: ModerationResult['warningType']): string | undefined {
    switch (warningType) {
      case 'contact_info':
        return "Pour votre sécurité et celle de votre interlocuteur, gardez vos échanges sur Zeytna jusqu'à la finalisation de votre accord.";
      case 'external_link':
        return "Utilisez notre messagerie sécurisée ! Une fois votre mission acceptée, vous pourrez échanger sur d'autres plateformes.";
      case 'bypass_attempt':
        return "Restez sur Zeytna pour bénéficier de notre assurance, du paiement sécurisé et de la protection CNSS.";
      default:
        return undefined;
    }
  }

  // Nettoyer le message en masquant les informations sensibles
  sanitizeMessage(content: string): string {
    let sanitized = content;

    // Masquer les numéros de téléphone
    this.phonePatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[Numéro masqué - Contactez via Zeytna]');
    });

    // Masquer les emails
    this.emailPatterns.forEach(pattern => {
      sanitized = sanitized.replace(pattern, '[Email masqué - Contactez via Zeytna]');
    });

    return sanitized;
  }
}

export const messageModerator = new MessageModerator();
