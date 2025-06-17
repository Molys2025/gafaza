
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
          home: {
            heroTitle: 'Connectez-vous à la récolte d\'olives',
            heroSubtitle: 'La première plateforme tunisienne qui met en relation les propriétaires d\'oliviers et les cueilleurs professionnels.',
            ownerButton: 'Je suis propriétaire',
            harvesterButton: 'Je suis cueilleur',
            howItWorks: 'Comment ça marche ?',
            createProfile: 'Créez votre profil',
            createProfileDesc: 'Inscrivez-vous en tant que propriétaire ou cueilleur et complétez votre profil.',
            findMatch: 'Trouvez votre match',
            findMatchDesc: 'Recherchez des propriétaires ou des cueilleurs selon vos critères.',
            communicate: 'Communiquez',
            communicateDesc: 'Discutez et planifiez la récolte via notre système de messagerie sécurisé.'
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
      en: {
        translation: {
          common: {
            search: 'Search',
            login: 'Login',
            about: 'About',
            messages: 'Messages',
            payments: 'Payments',
            evaluations: 'Evaluations',
            owner: 'Owner',
            harvester: 'Harvester'
          },
          home: {
            heroTitle: 'Connect to olive harvesting',
            heroSubtitle: 'The first Tunisian platform that connects olive tree owners with professional harvesters.',
            ownerButton: 'I am an owner',
            harvesterButton: 'I am a harvester',
            howItWorks: 'How it works?',
            createProfile: 'Create your profile',
            createProfileDesc: 'Sign up as an owner or harvester and complete your profile.',
            findMatch: 'Find your match',
            findMatchDesc: 'Search for owners or harvesters according to your criteria.',
            communicate: 'Communicate',
            communicateDesc: 'Discuss and plan the harvest via our secure messaging system.'
          },
          harvester: {
            title: 'Create your harvester profile',
            personalInfo: 'Personal information',
            personalInfoDesc: 'Your main contact information',
            fullName: 'Full name',
            email: 'Email',
            phone: 'Phone',
            whatsapp: 'WhatsApp (optional)',
            whatsappDesc: 'WhatsApp number if different from main phone',
            professionalInfo: 'Professional information',
            professionalInfoDesc: 'Detail your experience and availability',
            experience: 'Experience (years)',
            skills: 'Skills',
            skillsSelect: 'Select your skills',
            harvest: 'Harvest only',
            maintenance: 'Maintenance',
            pruning: 'Pruning',
            allSkills: 'All skills',
            regions: 'Preferred regions',
            regionsSelect: 'Select regions',
            regionsDesc: 'Select the regions where you prefer to work',
            anyRegion: 'All regions',
            availabilityStart: 'Availability start',
            availabilityEnd: 'Availability end',
            dailyRate: 'Daily rate (DT)',
            documents: 'Documents and references',
            documentsDesc: 'Add documents to verify your identity',
            idCard: 'Identity card',
            idCardDesc: 'Upload a copy of your ID card',
            idCardRequired: 'Document required for verification',
            references: 'Professional references',
            referencesDesc: 'Optional - Add references from previous employers',
            additionalInfo: 'Additional information',
            profilePicture: 'Profile picture',
            profilePictureDesc: 'Upload a clear photo of yourself',
            cancel: 'Cancel',
            createProfile: 'Create profile'
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
          home: {
            heroTitle: 'اتصل بحصاد الزيتون',
            heroSubtitle: 'أول منصة تونسية تربط بين أصحاب أشجار الزيتون والحاصدين المحترفين.',
            ownerButton: 'أنا مالك',
            harvesterButton: 'أنا حاصد',
            howItWorks: 'كيف يعمل؟',
            createProfile: 'إنشاء ملفك الشخصي',
            createProfileDesc: 'سجل كمالك أو حاصد وأكمل ملفك الشخصي.',
            findMatch: 'جد مطابقتك',
            findMatchDesc: 'ابحث عن الملاك أو الحاصدين وفقًا لمعاييرك.',
            communicate: 'تواصل',
            communicateDesc: 'ناقش وخطط للحصاد عبر نظام المراسلة الآمن الخاص بنا.'
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
