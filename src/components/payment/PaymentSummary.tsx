
import { ShieldCheck } from "lucide-react";

interface PaymentSummaryProps {
  amount: number;
  currency: string;
  serviceFee: number;
  cnssContribution?: number;
  zeytnaCareFee?: number;
  totalAmount: number;
  useEscrow: boolean;
  workerNetAmount?: number;
  showWorkerNet?: boolean;
}

const PaymentSummary = ({ 
  amount, 
  currency, 
  serviceFee, 
  cnssContribution = 0,
  zeytnaCareFee = 0,
  totalAmount, 
  useEscrow,
  workerNetAmount,
  showWorkerNet = false
}: PaymentSummaryProps) => {
  return (
    <div className="space-y-4 w-full">
      <div className="w-full flex justify-between mb-2 text-sm">
        <span>Montant de base</span>
        <span>{amount.toFixed(2)} {currency}</span>
      </div>
      <div className="w-full flex justify-between mb-2 text-sm">
        <span>Frais de plateforme ({((serviceFee / amount) * 100).toFixed(0)}%)</span>
        <span>{serviceFee.toFixed(2)} {currency}</span>
      </div>
      
      {cnssContribution > 0 && (
        <div className="w-full flex justify-between mb-2 text-sm">
          <span>Cotisation CNSS - Votre part (50%)</span>
          <span>{cnssContribution.toFixed(2)} {currency}</span>
        </div>
      )}
      
      {zeytnaCareFee > 0 && (
        <div className="w-full flex justify-between mb-2 text-sm">
          <span>Zeytna Care - Votre part (50%)</span>
          <span>{zeytnaCareFee.toFixed(2)} {currency}</span>
        </div>
      )}
      
      <div className="w-full flex justify-between font-bold border-t pt-2">
        <span>Total à payer</span>
        <span>{totalAmount.toFixed(2)} {currency}</span>
      </div>
      
      {showWorkerNet && workerNetAmount && (
        <div className="w-full p-2 bg-blue-50 rounded text-sm">
          <div className="flex justify-between">
            <span>Le cueilleur recevra :</span>
            <span className="font-medium">{workerNetAmount.toFixed(2)} {currency}</span>
          </div>
          <p className="text-xs text-blue-600 mt-1">
            Après déduction de sa part des frais d'assurance (50%)
          </p>
        </div>
      )}
      
      {useEscrow && (
        <div className="w-full mt-3 pt-3 border-t flex items-start space-x-2 text-xs text-gray-500">
          <ShieldCheck className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
          <span>
            Le paiement par séquestre protège votre transaction en bloquant les fonds jusqu'à confirmation du travail effectué.
          </span>
        </div>
      )}
    </div>
  );
};

export default PaymentSummary;
