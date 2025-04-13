
import { ShieldCheck } from "lucide-react";

interface PaymentSummaryProps {
  amount: number;
  currency: string;
  serviceFee: number;
  totalAmount: number;
  useEscrow: boolean;
}

const PaymentSummary = ({ 
  amount, 
  currency, 
  serviceFee, 
  totalAmount, 
  useEscrow 
}: PaymentSummaryProps) => {
  return (
    <div className="space-y-4">
      <div className="w-full flex justify-between mb-2 text-sm">
        <span>Montant</span>
        <span>{amount.toFixed(2)} {currency}</span>
      </div>
      <div className="w-full flex justify-between mb-2 text-sm">
        <span>Frais de plateforme ({((serviceFee / amount) * 100).toFixed(0)}%)</span>
        <span>{serviceFee.toFixed(2)} {currency}</span>
      </div>
      <div className="w-full flex justify-between font-bold">
        <span>Total</span>
        <span>{totalAmount.toFixed(2)} {currency}</span>
      </div>
      
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
