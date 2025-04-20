
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    resources: {
      fr: {
        translation: {
          common: {
            search: 'Rechercher',
            login: 'Connexion',
            about: 'À propos',
            messages: 'Messages',
            payments: 'Paiements',
            evaluations: 'Évaluations',
            owner: 'Propriétaire',
            harvester: 'Cueilleur'
          }
        }
      },
      ar: {
        translation: {
          common: {
            search: 'بحث',
            login: 'تسجيل الدخول',
            about: 'حول',
            messages: 'الرسائل',
            payments: 'المدفوعات',
            evaluations: 'التقييمات',
            owner: 'المالك',
            harvester: 'الحاصد'
          }
        }
      }
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
