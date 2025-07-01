
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Sparkles, Video, Bot, CheckCircle, Loader2 } from 'lucide-react';
import VideoRecorder from './VideoRecorder';
import AIAssistant from './AIAssistant';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface VideoOnboardingProps {
  userType: 'owner' | 'harvester';
  onComplete: (profileData: any) => void;
  onSkip: () => void;
}

type OnboardingStep = 'intro' | 'recording' | 'processing' | 'assistant' | 'complete';

const VideoOnboarding = ({ userType, onComplete, onSkip }: VideoOnboardingProps) => {
  const [currentStep, setCurrentStep] = useState<OnboardingStep>('intro');
  const [videoBlob, setVideoBlob] = useState<Blob | null>(null);
  const [extractedData, setExtractedData] = useState<any>(null);
  const [processingProgress, setProcessingProgress] = useState(0);
  const { toast } = useToast();

  const steps = [
    { id: 'intro', title: 'Introduction', icon: Sparkles },
    { id: 'recording', title: 'Enregistrement', icon: Video },
    { id: 'processing', title: 'Analyse IA', icon: Bot },
    { id: 'assistant', title: 'Finalisation', icon: Bot },
    { id: 'complete', title: 'Terminé', icon: CheckCircle }
  ];

  const currentStepIndex = steps.findIndex(step => step.id === currentStep);
  const progress = (currentStepIndex / (steps.length - 1)) * 100;

  const handleVideoRecorded = (blob: Blob) => {
    setVideoBlob(blob);
    setCurrentStep('processing');
    processVideo(blob);
  };

  const processVideo = async (blob: Blob) => {
    try {
      setProcessingProgress(10);
      
      // Convert blob to base64
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const base64Data = (reader.result as string).split(',')[1];
          
          setProcessingProgress(30);
          
          // Send to video analysis function
          const { data, error } = await supabase.functions.invoke('analyze-onboarding-video', {
            body: {
              videoData: base64Data,
              userType: userType
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
            description: 'Votre vidéo a été analysée avec succès.',
          });

          setTimeout(() => {
            setCurrentStep('assistant');
          }, 1000);

        } catch (error) {
          console.error('Error processing video:', error);
          toast({
            title: 'Erreur d\'analyse',
            description: 'Impossible d\'analyser la vidéo. Veuillez réessayer.',
            variant: 'destructive',
          });
          setCurrentStep('recording');
        }
      };
      
      reader.readAsDataURL(blob);
      
    } catch (error) {
      console.error('Error processing video:', error);
      toast({
        title: 'Erreur',
        description: 'Une erreur est survenue lors du traitement de la vidéo.',
        variant: 'destructive',
      });
      setCurrentStep('recording');
    }
  };

  const handleProfileComplete = (profileData: any) => {
    setCurrentStep('complete');
    setTimeout(() => {
      onComplete(profileData);
    }, 2000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'intro':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Onboarding Intelligent par Vidéo
              </CardTitle>
              <CardDescription>
                Révolutionnez votre inscription avec notre IA ! Présentez-vous en vidéo et laissez notre intelligence artificielle créer automatiquement votre profil.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <Video className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Enregistrez</h3>
                  <p className="text-xs text-gray-600">Une vidéo de 30 secondes</p>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <Bot className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">IA Analyse</h3>
                  <p className="text-xs text-gray-600">Extraction automatique</p>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <CheckCircle className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-sm">Finalisation</h3>
                  <p className="text-xs text-gray-600">Assistant pour compléter</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold">Avantages :</h4>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✅ Inscription 5x plus rapide</li>
                  <li>✅ Profil plus personnel et authentique</li>
                  <li>✅ Détection automatique de vos compétences</li>
                  <li>✅ Géolocalisation intelligente</li>
                </ul>
              </div>
              
              <div className="flex gap-4 justify-center">
                <Button onClick={() => setCurrentStep('recording')} className="bg-blue-500 hover:bg-blue-600">
                  Commencer l'onboarding vidéo
                </Button>
                <Button onClick={onSkip} variant="outline">
                  Passer (inscription classique)
                </Button>
              </div>
            </CardContent>
          </Card>
        );

      case 'recording':
        return (
          <VideoRecorder
            onVideoRecorded={handleVideoRecorded}
            maxDuration={30}
          />
        );

      case 'processing':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bot className="h-5 w-5 animate-pulse" />
                Analyse IA en cours...
              </CardTitle>
              <CardDescription>
                Notre intelligence artificielle analyse votre vidéo pour extraire automatiquement vos informations.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <Loader2 className="h-16 w-16 animate-spin text-blue-500 mx-auto mb-4" />
                <Progress value={processingProgress} className="w-full mb-4" />
                <p className="text-sm text-gray-600">
                  {processingProgress < 30 && "Extraction de l'audio..."}
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
        );

      case 'assistant':
        return extractedData ? (
          <AIAssistant
            initialData={extractedData}
            userType={userType}
            onProfileComplete={handleProfileComplete}
          />
        ) : null;

      case 'complete':
        return (
          <Card className="w-full max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                Profil créé avec succès !
              </CardTitle>
              <CardDescription>
                Votre profil a été automatiquement généré et optimisé grâce à l'IA.
              </CardDescription>
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
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between items-center max-w-4xl mx-auto">
            {steps.map((step, index) => {
              const StepIcon = step.icon;
              const isActive = index === currentStepIndex;
              const isCompleted = index < currentStepIndex;
              
              return (
                <div key={step.id} className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 ${
                      isCompleted
                        ? 'bg-green-500 text-white'
                        : isActive
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-200 text-gray-400'
                    }`}
                  >
                    <StepIcon className="h-5 w-5" />
                  </div>
                  <span className="text-xs text-center">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="mt-4 max-w-4xl mx-auto" />
        </div>

        {/* Step Content */}
        <div>{renderStepContent()}</div>
      </div>
    </div>
  );
};

export default VideoOnboarding;
