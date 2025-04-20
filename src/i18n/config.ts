
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
          },
          harvester: {
            title: 'Créer votre profil cueilleur',
            personalInfo: 'Informations personnelles',
            personalInfoDesc: 'Vos informations de contact principales',
            fullName: 'Nom complet',
            email: 'Email',
            phone: 'Téléphone',
            whatsapp: 'WhatsApp (optionnel)',
            whatsappDesc: 'Numéro WhatsApp si différent du téléphone principal',
            professionalInfo: 'Informations professionnelles',
            professionalInfoDesc: 'Détaillez votre expérience et disponibilité',
            experience: 'Expérience (années)',
            skills: 'Compétences',
            skillsSelect: 'Sélectionner vos compétences',
            harvest: 'Récolte uniquement',
            maintenance: 'Entretien',
            pruning: 'Taille',
            allSkills: 'Toutes compétences',
            regions: 'Régions préférées',
            regionsSelect: 'Sélectionner les régions',
            regionsDesc: 'Sélectionnez les régions où vous préférez travailler',
            anyRegion: 'Toutes régions',
            availabilityStart: 'Disponibilité début',
            availabilityEnd: 'Disponibilité fin',
            dailyRate: 'Tarif journalier (DT)',
            documents: 'Documents et références',
            documentsDesc: 'Ajoutez des documents pour vérifier votre identité',
            idCard: 'Carte d\'identité',
            idCardDesc: 'Téléchargez une copie de votre CIN',
            idCardRequired: 'Document requis pour la vérification',
            references: 'Références professionnelles',
            referencesDesc: 'Optionnel - Ajoutez des références de précédents employeurs',
            additionalInfo: 'Informations supplémentaires',
            profilePicture: 'Photo de profil',
            profilePictureDesc: 'Téléchargez une photo claire de vous',
            cancel: 'Annuler',
            createProfile: 'Créer le profil'
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
          },
          harvester: {
            title: 'إنشاء ملف تعريف الحاصد الخاص بك',
            personalInfo: 'المعلومات الشخصية',
            personalInfoDesc: 'معلومات الاتصال الرئيسية الخاصة بك',
            fullName: 'الاسم الكامل',
            email: 'البريد الإلكتروني',
            phone: 'الهاتف',
            whatsapp: 'واتساب (اختياري)',
            whatsappDesc: 'رقم الواتساب إذا كان مختلفًا عن الهاتف الرئيسي',
            professionalInfo: 'المعلومات المهنية',
            professionalInfoDesc: 'تفاصيل خبرتك وتوافرك',
            experience: 'الخبرة (سنوات)',
            skills: 'المهارات',
            skillsSelect: 'اختر مهاراتك',
            harvest: 'الحصاد فقط',
            maintenance: 'الصيانة',
            pruning: 'التقليم',
            allSkills: 'جميع المهارات',
            regions: 'المناطق المفضلة',
            regionsSelect: 'اختر المناطق',
            regionsDesc: 'حدد المناطق التي تفضل العمل فيها',
            anyRegion: 'جميع المناطق',
            availabilityStart: 'بداية التوافر',
            availabilityEnd: 'نهاية التوافر',
            dailyRate: 'السعر اليومي (د.ت)',
            documents: 'الوثائق والمراجع',
            documentsDesc: 'أضف وثائق للتحقق من هويتك',
            idCard: 'بطاقة الهوية',
            idCardDesc: 'قم بتحميل نسخة من بطاقة هويتك',
            idCardRequired: 'وثيقة مطلوبة للتحقق',
            references: 'المراجع المهنية',
            referencesDesc: 'اختياري - أضف مراجع من أصحاب العمل السابقين',
            additionalInfo: 'معلومات إضافية',
            profilePicture: 'صورة الملف الشخصي',
            profilePictureDesc: 'قم بتحميل صورة واضحة لك',
            cancel: 'إلغاء',
            createProfile: 'إنشاء الملف الشخصي'
          }
        }
      }
    },
    interpolation: {
      escapeValue: false // React already escapes values
    }
  });

export default i18n;
