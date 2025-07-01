
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Video, FileText } from 'lucide-react';
import UserTypeSelection from './UserTypeSelection';
import VideoOnboarding from './onboarding/VideoOnboarding';
import { useProfile } from '@/hooks/useProfile';

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const [selectedUserType, setSelectedUserType] = useState<'owner' | 'harvester' | null>(null);
  const [onboardingMethod, setOnboardingMethod] = useState<'video' | 'traditional' | null>(null);
  const { createProfile } = useProfile();
  const navigate = useNavigate();

  const handleUserTypeSelect = (userType: 'owner' | 'harvester') => {
    setSelectedUserType(userType);
    // Don't automatically proceed - let user choose onboarding method
  };

  const handleTraditionalOnboarding = async () => {
    if (!selectedUserType) return;
    
    setLoading(true);
    const success = await createProfile(selectedUserType);
    
    if (success) {
      // Redirect to appropriate profile page
      if (selectedUserType === 'owner') {
        navigate('/owner-profile');
      } else {
        navigate('/harvester-profile');
      }
    }
    
    setLoading(false);
  };

  const handleVideoOnboardingComplete = async (profileData: any) => {
    if (!selectedUserType) return;
    
    setLoading(true);
    
    // Create profile with extracted data
    const success = await createProfile(selectedUserType, profileData);
    
    if (success) {
      // Redirect to appropriate dashboard
      if (selectedUserType === 'owner') {
        navigate('/owner-profile');
      } else {
        navigate('/harvester-dashboard');
      }
    }
    
    setLoading(false);
  };

  const handleSkipVideoOnboarding = () => {
    handleTraditionalOnboarding();
  };

  // Step 1: User type selection
  if (!selectedUserType) {
    return (
      <UserTypeSelection 
        onSelect={handleUserTypeSelect}
        loading={loading}
      />
    );
  }

  // Step 2: Onboarding method selection
  if (!onboardingMethod) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
        <Card className="w-full max-w-2xl">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-olive-dark">
              Choisissez votre méthode d'inscription
            </CardTitle>
            <CardDescription>
              Nous proposons deux façons de créer votre profil {selectedUserType === 'owner' ? 'propriétaire' : 'cueilleur'}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Video Onboarding Option */}
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg border-2 border-blue-200 bg-blue-50"
                onClick={() => setOnboardingMethod('video')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Video className="text-white" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-blue-900 mb-2">
                    🚀 Onboarding Vidéo IA
                  </h3>
                  <div className="text-sm text-blue-700 space-y-2">
                    <p className="font-medium">Rapide et Intelligent</p>
                    <ul className="text-left space-y-1">
                      <li>• Enregistrez une vidéo de 30s</li>
                      <li>• IA analyse automatiquement</li>
                      <li>• Profil pré-rempli instantanément</li>
                      <li>• Assistant IA pour finaliser</li>
                    </ul>
                    <div className="mt-3 px-3 py-1 bg-blue-200 rounded-full text-xs font-medium">
                      RECOMMANDÉ - 5x plus rapide
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Traditional Onboarding Option */}
              <Card 
                className="cursor-pointer transition-all hover:shadow-lg border-2 border-gray-200"
                onClick={() => setOnboardingMethod('traditional')}
              >
                <CardContent className="p-6 text-center">
                  <div className="w-20 h-20 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FileText className="text-white" size={40} />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    📝 Inscription Classique
                  </h3>
                  <div className="text-sm text-gray-700 space-y-2">
                    <p className="font-medium">Méthode Traditionnelle</p>
                    <ul className="text-left space-y-1">
                      <li>• Remplissage de formulaires</li>
                      <li>• Saisie manuelle des infos</li>
                      <li>• Contrôle total du contenu</li>
                      <li>• Méthode familière</li>
                    </ul>
                    <div className="mt-3 px-3 py-1 bg-gray-200 rounded-full text-xs">
                      MÉTHODE CLASSIQUE
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={() => setSelectedUserType(null)}
                variant="outline"
                className="mr-4"
              >
                ← Retour
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Step 3: Execute chosen onboarding method
  if (onboardingMethod === 'video') {
    return (
      <VideoOnboarding
        userType={selectedUserType}
        onComplete={handleVideoOnboardingComplete}
        onSkip={handleSkipVideoOnboarding}
      />
    );
  }

  // Traditional onboarding - redirect to existing flow
  if (onboardingMethod === 'traditional') {
    handleTraditionalOnboarding();
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-olive mx-auto"></div>
          <p className="mt-4 text-olive-dark">Création de votre profil...</p>
        </div>
      </div>
    );
  }

  return null;
};

export default ProfileSetup;
