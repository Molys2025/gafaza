
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IntroExperience from './IntroExperience';
import MediaRecorder from './MediaRecorder';
import AIAssistant from './AIAssistant';
import UserTypeSelection from '../UserTypeSelection';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Bot, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useProfile } from '@/hooks/useProfile';

type FlowStep = 'intro' | 'user-type' | 'recording' | 'processing' | 'assistant' | 'complete';

const ExperienceFlow = () => {
  const [currentStep, setCurrentStep] = useState<FlowStep>('intro');
  const [userType, setUserType] = useState<'owner' | 'harvester' | null>(null);
  const [mediaBlob, setMediaBlob] = useState<Blob | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio' | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { createProfile } = useProfile();
  const { toast } = useToast();
  const navigate = useNavigate();

  const steps = [
    { id: 'intro', title: 'Introduction' },
    { id: 'user-type', title: 'Type d\'utilisateur' },
    { id: 'recording', title: 'Enregistrement' },
    { id: 'processing', title: 'Analyse IA' },
    { id: 'assistant', title: 'Finalisation' },
    { id: 'complete', title: 'Terminé' }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const handleAcceptExperience = () => {
    setCurrentStep('user-type');
  };

  const handleDeclineExperience = () => {
    navigate('/auth');
  };

  const handleUserTypeSelect = (type: 'owner' | 'harvester') => {
    setUserType(type);
    setCurrentStep('recording');
  };

  const handleMediaRecorded = (blob: Blob, type: 'video' | 'audio') => {
    setMediaBlob(blob);
    setMediaType(type);
    setCurrentStep('processing');
    processMedia(blob, type);
  };

  const processMedia = async (blob: Blob, type: 'video' | 'audio') => {
    try {
      setProcessingProgress(10);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          setProcessingProgress(30);
          
          // Send to analysis function
          const { data, error } = await supabase.functions.invoke('analyze-onboarding-video', {
            body: {
              videoData: base64Data,
              userType: userType,
              mediaType: type
            }
          });

          if (error) throw error;

          setProcessingProgress(70);
          
          // Simulate additional processing time
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          setProcessingProgress(100);
          setExtractedData(data.extractedData);

          toast({
            title: 'Analyse terminée !',
            description: `Votre ${type === 'video' ? 'vidéo' : 'audio'} a été analysé avec succès.`,
          });

          setTimeout(() => {
            setCurrentStep('assistant');
          }, 1000);

        } catch (error) {
          console.error('Error processing media:', error);
          toast({
            title: 'Erreur d\'analyse',
            description: `Impossible d'analyser votre ${type === 'video' ? 'vidéo' : 'audio'}. Veuillez réessayer.`,
            variant: 'destructive',
          });
          setCurrentStep('recording');
        }
      };
      
      reader.readAsDataURL(blob);
      
    } catch (error) {
      console.error('Error processing media:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du traitement.',
        variant: 'destructive',
      });
      setCurrentStep('recording');
    }
  };

  const handleProfileComplete = async (profileData: any) => {
    if (!userType) return;
    
    const success = await createProfile(userType, profileData);
    
    if (success) {
      setCurrentStep('complete');
      setTimeout(() => {
        if (userType === 'owner') {
          navigate('/owner-profile');
        } else {
          navigate('/harvester-dashboard');
        }
      }, 2000);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <IntroExperience
            onAccept={handleAcceptExperience}
            onDecline={handleDeclineExperience}
          />
        );

      case 'user-type':
        return (
          <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
            <UserTypeSelection 
              onSelect={handleUserTypeSelect}
              loading={false}
            />
          </div>
        );

      case 'recording':
        return (
          <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
            <MediaRecorder
              onMediaRecorded={handleMediaRecorded}
              maxDuration={30}
            />
          </div>
        );

      case 'processing':
        return (
          <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Bot className="h-5 w-5 animate-pulse" />
                  Analyse IA en cours...
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="text-center">
                  <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
                  <Progress value={processingProgress} className="w-full mb-4" />
                  <p className="text-sm text-gray-600">
                    {processingProgress < 30 && `Extraction de l'${mediaType === 'video' ? 'audio' : 'audio'}...`}
                    {processingProgress >= 30 && processingProgress < 70 && "Transcription et analyse..."}
                    {processingProgress >= 70 && "Structuration des données..."}
                  </p>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Que fait notre IA ?</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>🎙️ Transcription audio en texte</li>
                    <li>🧠 Analyse sémantique du contenu</li>
                    <li>📍 Détection de la localisation</li>
                    <li>💼 Identification des compétences</li>
                    <li>⚡ Pré-remplissage du profil</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        );

      case 'assistant':
        return extractedData ? (
          <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
            <AIAssistant
              initialData={extractedData}
              userType={userType!}
              onProfileComplete={handleProfileComplete}
            />
          </div>
        ) : null;

      case 'complete':
        return (
          <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
            <Card className="w-full max-w-2xl mx-auto">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-green-600">
                  <CheckCircle className="h-5 w-5" />
                  Profil créé avec succès !
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle className="h-8 w-8 text-green-600" />
                </div>
                <p className="text-gray-600">
                  Redirection vers votre espace personnel...
                </p>
              </CardContent>
            </Card>
          </div>
        );

      default:
        return null;
    }
  };

  if (currentStep === 'intro') {
    return renderStepContent();
  }

  return (
    <div className="min-h-screen bg-sand-light">
      {/* Progress Bar */}
      <div className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center max-w-4xl mx-auto mb-2">
            {steps.slice(1).map((step, index) => {
              const adjustedIndex = index + 1;
              const isActive = adjustedIndex === currentStepIndex;
              const isCompleted = adjustedIndex < currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 text-xs font-bold ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-olive text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    {adjustedIndex}
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="max-w-4xl mx-auto" />
        </div>
      </div>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
};

export default ExperienceFlow;
