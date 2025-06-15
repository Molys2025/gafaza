
import { useState, useEffect } from 'react';

export const useOnboarding = () => {
  const [hasSeenOnboarding, setHasSeenOnboarding] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const stored = localStorage.getItem('zeytna_onboarding');
    if (stored) {
      try {
        setHasSeenOnboarding(JSON.parse(stored));
      } catch (error) {
        console.error('Error parsing onboarding data:', error);
      }
    }
  }, []);

  const markOnboardingComplete = (userType: string) => {
    const updated = { ...hasSeenOnboarding, [userType]: true };
    setHasSeenOnboarding(updated);
    localStorage.setItem('zeytna_onboarding', JSON.stringify(updated));
  };

  const shouldShowOnboarding = (userType: string) => {
    return !hasSeenOnboarding[userType];
  };

  const resetOnboarding = () => {
    setHasSeenOnboarding({});
    localStorage.removeItem('zeytna_onboarding');
  };

  return {
    shouldShowOnboarding,
    markOnboardingComplete,
    resetOnboarding
  };
};
