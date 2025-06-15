
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Link } from 'react-router-dom';
import { User, TreePine, Users, CreditCard } from 'lucide-react';

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
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-olive-dark mb-6">Profil Propriétaire</h1>
          
          {/* Section Mon Profil */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Link 
              to="/owner-my-profile" 
              className="flex items-center justify-between hover:bg-olive/5 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-olive rounded-full flex items-center justify-center mr-4">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-olive-dark">Mon Profil</h3>
                  <p className="text-gray-600 text-sm">Gérez vos informations personnelles</p>
                </div>
              </div>
              <div className="text-olive-dark">→</div>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-olive-dark mb-4">
                Bienvenue sur Zeytna !
              </h2>
              <p className="text-gray-600 text-lg">
                Vous êtes maintenant prêt à gérer vos oliviers et trouver des cueilleurs expérimentés.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link 
                to="/owner-olive-trees" 
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <TreePine className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Mes Oliviers</h3>
                <p className="text-gray-600 text-sm">
                  Gérez vos oliveraies et planifiez votre récolte
                </p>
              </Link>
              
              <Link 
                to="/owner-find-harvesters" 
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Trouver des Cueilleurs</h3>
                <p className="text-gray-600 text-sm">
                  Recherchez et contactez des cueilleurs qualifiés
                </p>
              </Link>
              
              <Link 
                to="/owner-payments" 
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <CreditCard className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Gérer les Paiements</h3>
                <p className="text-gray-600 text-sm">
                  Suivez vos transactions en toute sécurité
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerProfile;
