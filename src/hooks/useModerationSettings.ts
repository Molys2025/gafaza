
import { useState, useEffect } from 'react';

interface ModerationSettings {
  strictMode: boolean;
  allowContactAfterPayment: boolean;
  showBenefitsReminders: boolean;
  autoModerationEnabled: boolean;
}

export const useModerationSettings = () => {
  const [settings, setSettings] = useState<ModerationSettings>({
    strictMode: true,
    allowContactAfterPayment: true,
    showBenefitsReminders: true,
    autoModerationEnabled: true,
  });

  useEffect(() => {
    // Charger les paramètres depuis le localStorage ou l'API
    const savedSettings = localStorage.getItem('zeytna_moderation_settings');
    if (savedSettings) {
      setSettings(JSON.parse(savedSettings));
    }
  }, []);

  const updateSettings = (newSettings: Partial<ModerationSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('zeytna_moderation_settings', JSON.stringify(updatedSettings));
  };

  return {
    settings,
    updateSettings,
  };
};
