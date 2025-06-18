
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Smartphone, Banknote } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

// Import payment method components
import CardPayment from "./methods/CardPayment";
import BankTransfer from "./methods/BankTransfer";
import MobilePayment from "./methods/MobilePayment";
import CashPayment from "./methods/CashPayment";
import PaymentSummary from "./PaymentSummary";
import InsuranceOptions from "./InsuranceOptions";

interface PaymentSystemProps {
  amount: number;
  currency?: string;
  description?: string;
  onPaymentComplete?: (result: any) => void;
}

const PaymentSystem = ({
  amount,
  currency = "TND",
  description = "Paiement pour services",
  onPaymentComplete,
}: PaymentSystemProps) => {
  const [processing, setProcessing] = useState(false);
  const [useEscrow, setUseEscrow] = useState(true);
  const [serviceFeeRate, setServiceFeeRate] = useState(0.05); // Default 5%
  const [cnssEnabled, setCnssEnabled] = useState(false);
  const [zeytnaCarePlan, setZeytnaCarePlan] = useState<string | null>(null);
  const { toast } = useToast();

  const serviceFee = amount * serviceFeeRate;
  
  // Calcul des frais d'assurance avec répartition 50/50
  const cnssContributionTotal = cnssEnabled ? amount * 0.035 : 0; // 3.5% CNSS total
  const cnssContributionWorker = cnssContributionTotal / 2; // 50% à la charge du cueilleur
  const cnssContributionProvider = cnssContributionTotal / 2; // 50% à la charge du propriétaire
  
  const zeytnaCareFeeTotal = zeytnaCarePlan === 'basic' ? 1 : zeytnaCarePlan === 'plus' ? 3 : 0;
  const zeytnaCareFeeWorker = zeytnaCareFeeTotal / 2; // 50% à la charge du cueilleur
  const zeytnaCareFeeProvider = zeytnaCareFeeTotal / 2; // 50% à la charge du propriétaire
  
  // Montant net reçu par le cueilleur (montant - part cueilleur des assurances)
  const workerNetAmount = amount - cnssContributionWorker - zeytnaCareFeeWorker;
  
  // Montant total à payer par le propriétaire (montant + frais plateforme + part propriétaire des assurances)
  const totalAmount = amount + serviceFee + cnssContributionProvider + zeytnaCareFeeProvider;

  const handleInsuranceChange = (cnss: boolean, zeytnacare: string | null) => {
    setCnssEnabled(cnss);
    setZeytnaCarePlan(zeytnacare);
  };

  const handlePaymentSubmit = (data: any) => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Paiement réussi",
        description: `Votre paiement de ${totalAmount.toFixed(2)} ${currency} via ${data.type} a été traité avec succès.`,
      });
      
      if (onPaymentComplete) {
        onPaymentComplete({
          success: true,
          transactionId: "TXN" + Math.floor(Math.random() * 1000000),
          amount: totalAmount,
          serviceFee: serviceFee,
          cnssContribution: cnssContributionTotal,
          zeytnaCareFee: zeytnaCareFeeTotal,
          baseAmount: amount,
          workerNetAmount: workerNetAmount,
          currency,
          method: data.type,
          escrow: useEscrow,
          insurance: {
            cnss: cnssEnabled,
            zeytnacare: zeytnaCarePlan
          },
          timestamp: new Date().toISOString(),
          status: useEscrow ? "escrow" : "completed",
        });
      }
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Insurance Options */}
      <InsuranceOptions onInsuranceChange={handleInsuranceChange} />
      
      {/* Payment Card */}
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Paiement</CardTitle>
          <CardDescription>{description}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <h3 className="text-2xl font-bold mb-1">{amount} {currency}</h3>
            <p className="text-sm text-gray-500">Choisissez votre méthode de paiement</p>
          </div>
          
          <div className="mb-4 p-3 border rounded-md bg-blue-50">
            <div className="flex items-center space-x-2">
              <Switch 
                id="escrow" 
                checked={useEscrow} 
                onCheckedChange={setUseEscrow}
              />
              <Label htmlFor="escrow" className="font-medium text-blue-700">Paiement sécurisé par séquestre</Label>
            </div>
            <p className="text-sm text-blue-600 mt-1">
              {useEscrow 
                ? "Les fonds seront bloqués jusqu'à la validation du travail effectué." 
                : "Le paiement sera versé immédiatement au prestataire."}
            </p>
          </div>
          
          {/* Détail de la répartition des coûts */}
          {(cnssEnabled || zeytnaCarePlan) && (
            <div className="mb-4 p-3 border rounded-md bg-green-50">
              <h4 className="font-medium text-green-800 mb-2">Répartition des frais d'assurance (50/50)</h4>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span>Cueilleur recevra :</span>
                  <span className="font-medium">{workerNetAmount.toFixed(2)} {currency}</span>
                </div>
                <div className="flex justify-between">
                  <span>Vous payez au total :</span>
                  <span className="font-medium">{totalAmount.toFixed(2)} {currency}</span>
                </div>
              </div>
            </div>
          )}
          
          <Tabs defaultValue="card">
            <TabsList className="grid grid-cols-4 mb-4">
              <TabsTrigger value="card" className="flex flex-col items-center py-2">
                <CreditCard className="h-4 w-4 mb-1" />
                <span className="text-xs">Carte</span>
              </TabsTrigger>
              <TabsTrigger value="bank" className="flex flex-col items-center py-2">
                <Landmark className="h-4 w-4 mb-1" />
                <span className="text-xs">Virement</span>
              </TabsTrigger>
              <TabsTrigger value="mobile" className="flex flex-col items-center py-2">
                <Smartphone className="h-4 w-4 mb-1" />
                <span className="text-xs">Mobile</span>
              </TabsTrigger>
              <TabsTrigger value="cash" className="flex flex-col items-center py-2">
                <Banknote className="h-4 w-4 mb-1" />
                <span className="text-xs">Espèces</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="card">
              <CardPayment onSubmit={handlePaymentSubmit} processing={processing} />
            </TabsContent>
            
            <TabsContent value="bank">
              <BankTransfer onSubmit={handlePaymentSubmit} processing={processing} />
            </TabsContent>
            
            <TabsContent value="mobile">
              <MobilePayment onSubmit={handlePaymentSubmit} processing={processing} />
            </TabsContent>
            
            <TabsContent value="cash">
              <CashPayment onSubmit={handlePaymentSubmit} processing={processing} />
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="border-t pt-4 flex flex-col items-start">
          <PaymentSummary 
            amount={amount}
            currency={currency}
            serviceFee={serviceFee}
            cnssContribution={cnssContributionProvider}
            zeytnaCareFee={zeytnaCareFeeProvider}
            totalAmount={totalAmount}
            useEscrow={useEscrow}
            workerNetAmount={workerNetAmount}
            showWorkerNet={cnssEnabled || zeytnaCarePlan}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSystem;
