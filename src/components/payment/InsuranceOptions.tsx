
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Heart, Calculator } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface InsuranceOptionsProps {
  onInsuranceChange?: (cnss: boolean, zeytnaCare: string | null) => void;
}

const InsuranceOptions = ({ onInsuranceChange }: InsuranceOptionsProps) => {
  const [cnssEnabled, setCnssEnabled] = useState(false);
  const [zeytnaCarePlan, setZeytnaCarePlan] = useState<string | null>(null);
  const [showSimulation, setShowSimulation] = useState(false);
  const { toast } = useToast();

  const handleCnssChange = (enabled: boolean) => {
    setCnssEnabled(enabled);
    onInsuranceChange?.(enabled, zeytnaCarePlan);
  };

  const handleZeytnaCarePlanChange = (plan: string | null) => {
    setZeytnaCarePlan(plan);
    onInsuranceChange?.(cnssEnabled, plan);
  };

  const cnssPercentage = 3.5; // 3.5% pour CNSS
  const zeytnaBasicRate = 1; // 1 DT par jour
  const zeynaPlusRate = 3; // 3 DT par jour

  const simulateBasicCoverage = () => {
    return {
      dailyContribution: zeytnaBasicRate,
      coverage: 20, // 20 DT par jour
      duration: 5, // 5 jours
      totalCoverage: 20 * 5
    };
  };

  const simulatePlusCoverage = () => {
    return {
      dailyContribution: zeynaPlusRate,
      coverage: 25, // 25 DT par jour
      duration: 7, // 7 jours
      totalCoverage: 25 * 7
    };
  };

  const handleSubscribe = () => {
    toast({
      title: "Souscription confirmée",
      description: `Vous avez souscrit aux options : ${cnssEnabled ? 'CNSS' : ''} ${zeytnaCarePlan ? `+ Zeytna Care ${zeytnaCarePlan}` : ''}`,
    });
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Options d'Assurance
          </CardTitle>
          <CardDescription>
            Sécurisez votre travail avec nos options d'assurance
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* CNSS Option */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                <Switch 
                  id="cnss" 
                  checked={cnssEnabled} 
                  onCheckedChange={handleCnssChange}
                />
                <Label htmlFor="cnss" className="font-medium">Cotisation CNSS</Label>
              </div>
              <span className="text-sm text-green-600 font-medium">{cnssPercentage}% du salaire</span>
            </div>
            <p className="text-sm text-gray-600 mb-2">
              Sécurité sociale obligatoire incluant assurance maladie et retraite
            </p>
            <div className="text-xs text-gray-500">
              ✓ Assurance maladie • ✓ Pension de retraite • ✓ Protection légale
            </div>
          </div>

          {/* Zeytna Care Options */}
          <div className="border rounded-lg p-4">
            <div className="flex items-center gap-2 mb-4">
              <Heart className="w-5 h-5 text-olive" />
              <h4 className="font-medium">Zeytna Care - Assurance accidents de travail</h4>
            </div>
            
            <div className="space-y-3">
              {/* Option Basique */}
              <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                zeytnaCarePlan === 'basic' ? 'border-olive bg-olive/5' : 'border-gray-200 hover:border-olive/50'
              }`} onClick={() => handleZeytnaCarePlanChange(zeytnaCarePlan === 'basic' ? null : 'basic')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Zeytna Care Basique</h5>
                    <p className="text-sm text-gray-600">Couverture accidents de travail</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-olive">{zeytnaBasicRate} DT/jour</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  ✓ 20 DT/jour pendant 5 jours • ✓ Couverture totale: 100 DT
                </div>
              </div>

              {/* Option Plus */}
              <div className={`border rounded-lg p-3 cursor-pointer transition-colors ${
                zeytnaCarePlan === 'plus' ? 'border-olive bg-olive/5' : 'border-gray-200 hover:border-olive/50'
              }`} onClick={() => handleZeytnaCarePlanChange(zeytnaCarePlan === 'plus' ? null : 'plus')}>
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium">Zeytna Care +</h5>
                    <p className="text-sm text-gray-600">Couverture étendue avec arrêt médical</p>
                  </div>
                  <div className="text-right">
                    <span className="font-bold text-olive">{zeynaPlusRate} DT/jour</span>
                  </div>
                </div>
                <div className="mt-2 text-xs text-gray-500">
                  ✓ 25 DT/jour pendant 7 jours • ✓ Couverture totale: 175 DT • ✓ Arrêt médical habilité
                </div>
              </div>
            </div>

            {/* Simulation Module */}
            {zeytnaCarePlan && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Calculator className="w-4 h-4 text-blue-600" />
                  <h6 className="font-medium text-blue-700">Simulation de couverture</h6>
                </div>
                {zeytnaCarePlan === 'basic' && (
                  <div className="text-sm space-y-1">
                    <p>• Cotisation: <strong>{simulateBasicCoverage().dailyContribution} DT/jour</strong></p>
                    <p>• Indemnisation: <strong>{simulateBasicCoverage().coverage} DT/jour pendant {simulateBasicCoverage().duration} jours</strong></p>
                    <p className="text-blue-600 font-medium">Total couverture: {simulateBasicCoverage().totalCoverage} DT</p>
                  </div>
                )}
                {zeytnaCarePlan === 'plus' && (
                  <div className="text-sm space-y-1">
                    <p>• Cotisation: <strong>{simulatePlusCoverage().dailyContribution} DT/jour</strong></p>
                    <p>• Indemnisation: <strong>{simulatePlusCoverage().coverage} DT/jour pendant {simulatePlusCoverage().duration} jours</strong></p>
                    <p>• <strong>Condition:</strong> Arrêt promulgué par médecin généraliste habilité</p>
                    <p className="text-blue-600 font-medium">Total couverture: {simulatePlusCoverage().totalCoverage} DT</p>
                  </div>
                )}
              </div>
            )}
          </div>

          {(cnssEnabled || zeytnaCarePlan) && (
            <Button 
              onClick={handleSubscribe}
              className="w-full bg-olive hover:bg-olive-dark"
            >
              Souscrire aux options sélectionnées
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default InsuranceOptions;
