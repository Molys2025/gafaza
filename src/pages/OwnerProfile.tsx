import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';

const OwnerProfile = () => {
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);

  useEffect(() => {
    if (shouldShowOnboarding('owner')) {
      setShowOnboarding(true);
    }
  }, [shouldShowOnboarding]);

  const handleOnboardingComplete = () => {
    markOnboardingComplete('owner');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    markOnboardingComplete('owner');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      {showOnboarding && (
        <OnboardingFlow
          userType="owner"
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      <div>
        <h1>Owner Profile Page</h1>
        <p>Welcome, Olive Owner!</p>
      </div>
    </div>
  );
};

export default OwnerProfile;
