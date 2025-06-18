
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import frTranslations from './locales/fr.json';
import enTranslations from './locales/en.json';
import arTranslations from './locales/ar.json';
import tnTranslations from './locales/tn.json';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: 'fr',
    resources: {
      fr: {
        translation: frTranslations
      },
      en: {
        translation: enTranslations
      },
      ar: {
        translation: arTranslations
      },
      tn: {
        translation: tnTranslations
      }
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
