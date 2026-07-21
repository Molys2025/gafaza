// SAV knowledge base. Keep [À CONFIRMER] tokens intact — an admin will replace
// them once the business rules are locked. The support-assistant function
// injects this list into the system prompt so the AI answers strictly from it.

export type FaqCategory =
  | 'compte'
  | 'howto'
  | 'premium'
  | 'payment'
  | 'evaluation'
  | 'report'
  | 'bug'
  | 'escalade';

export interface FaqEntry {
  category: FaqCategory;
  question: string;
  answer: string;
}

export const SUPPORT_FAQ: FaqEntry[] = [
  {
    category: 'compte',
    question: 'Se connecter',
    answer:
      "Email + mot de passe, compte Google, ou code WhatsApp (OTP à 6 chiffres). Pas de code ? Vérifier le format +216… et réessayer, le code peut prendre 1 min.",
  },
  {
    category: 'compte',
    question: 'Modifier son profil (régions, tarif, disponibilités)',
    answer: "Menu Compte → Profil → modifier → Enregistrer.",
  },
  {
    category: 'howto',
    question: "Publier une annonce (propriétaire)",
    answer:
      "Tableau de bord propriétaire → « Publier une annonce » → région, nombre d'oliviers, dates, nombre de cueilleurs, tarif → valider.",
  },
  {
    category: 'howto',
    question: 'Trouver des cueilleurs',
    answer: "Recherche avec filtre région/carte ; élargir la zone si peu de résultats.",
  },
  {
    category: 'howto',
    question: 'Postuler à une annonce (cueilleur)',
    answer: "Annonces/Recherche → ouvrir une annonce → « Postuler ».",
  },
  {
    category: 'premium',
    question: 'Débloquer un contact',
    answer:
      "Bouton « Débloquer le contact ». [À CONFIRMER : gratuit après match / inclus premium / paiement unique X TND / quota mensuel].",
  },
  {
    category: 'premium',
    question: 'Gratuit vs premium',
    answer:
      "Gratuit = [À CONFIRMER]. Premium = [À CONFIRMER X TND/mois : contacts illimités, mise en avant…].",
  },
  {
    category: 'premium',
    question: 'Annuler premium',
    answer:
      "[À CONFIRMER]. L'assistant transmet la demande, il ne résilie pas lui-même.",
  },
  {
    category: 'payment',
    question: 'Moyens de paiement',
    answer: "Carte, virement, Flouci, paiement mobile, espèces.",
  },
  {
    category: 'payment',
    question: 'Escrow / séquestre',
    answer:
      "L'argent est retenu puis libéré au cueilleur à la validation de fin de mission.",
  },
  {
    category: 'payment',
    question: 'Remboursement / litige',
    answer:
      "Depuis la transaction → « Signaler un litige ». [À CONFIRMER politique/délai]. L'assistant prépare la demande, l'équipe traite.",
  },
  {
    category: 'evaluation',
    question: 'Évaluations',
    answer:
      "Après une mission, noter l'autre partie ; les notes sont publiques sur les profils.",
  },
  {
    category: 'report',
    question: 'Signaler un utilisateur/abus',
    answer:
      "Décrire à l'assistant → signalement transmis à la modération, escalade si grave.",
  },
  {
    category: 'bug',
    question: 'Bug / page qui ne charge pas',
    answer:
      "Décrire l'action et la page ; l'assistant enregistre le contexte et crée un ticket.",
  },
  {
    category: 'escalade',
    question: 'Parler à un humain',
    answer:
      "À tout moment, l'assistant crée un ticket et transmet la conversation.",
  },
];

export function formatFaqForPrompt(): string {
  return SUPPORT_FAQ.map(
    (e) => `- [${e.category}] ${e.question} : ${e.answer}`,
  ).join('\n');
}