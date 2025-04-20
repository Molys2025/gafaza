
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { useEffect } from "react";

const LanguageToggle = () => {
  const { i18n } = useTranslation();

  useEffect(() => {
    document.documentElement.dir = i18n.language === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);

  const toggleLanguage = () => {
    const newLang = i18n.language === 'fr' ? 'ar' : 'fr';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button 
      onClick={toggleLanguage}
      variant="outline" 
      size="sm"
      className="fixed bottom-4 right-4 z-50"
    >
      {i18n.language === 'fr' ? 'العربية' : 'Français'}
    </Button>
  );
};

export default LanguageToggle;
