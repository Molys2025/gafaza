
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ChevronRight, ChevronLeft, X } from 'lucide-react';
import { OwnerOnboarding } from './OwnerOnboarding';
import { HarvesterOnboarding } from './HarvesterOnboarding';

interface OnboardingFlowProps {
  userType: 'owner' | 'harvester';
  onComplete: () => void;
  onSkip: () => void;
}

const OnboardingFlow = ({ userType, onComplete, onSkip }: OnboardingFlowProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  
  const steps = userType === 'owner' 
    ? OwnerOnboarding 
    : HarvesterOnboarding;

  const progress = ((currentStep + 1) / steps.length) * 100;

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const CurrentStepComponent = steps[currentStep];

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="p-6">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-4">
              <h2 className="text-2xl font-bold text-olive-dark">
                {userType === 'owner' ? 'Bienvenue propriétaire!' : 'Bienvenue cueilleur!'}
              </h2>
              <span className="text-sm text-gray-500">
                {currentStep + 1} / {steps.length}
              </span>
            </div>
            <Button variant="ghost" size="icon" onClick={onSkip}>
              <X className="h-4 w-4" />
            </Button>
          </div>

          {/* Progress Bar */}
          <Progress value={progress} className="mb-8" />

          {/* Current Step Content */}
          <CardContent className="p-0 mb-8">
            <CurrentStepComponent />
          </CardContent>

          {/* Navigation */}
          <div className="flex justify-between items-center">
            <Button 
              variant="outline" 
              onClick={handlePrev}
              disabled={currentStep === 0}
              className="flex items-center space-x-2"
            >
              <ChevronLeft className="h-4 w-4" />
              <span>Précédent</span>
            </Button>

            <Button onClick={onSkip} variant="ghost" className="text-gray-500">
              Passer l'introduction
            </Button>

            <Button 
              onClick={handleNext}
              className="bg-olive hover:bg-olive-dark text-white flex items-center space-x-2"
            >
              <span>{currentStep === steps.length - 1 ? 'Commencer' : 'Suivant'}</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default OnboardingFlow;
