
import { Button } from "@/components/ui/button";

interface CashPaymentProps {
  onSubmit: (data: any) => void;
  processing: boolean;
}

const CashPayment = ({ onSubmit, processing }: CashPaymentProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 bg-blue-50">
        <h4 className="font-medium text-blue-700 mb-2">Instructions pour le paiement en espèces</h4>
        <p className="text-sm text-blue-600 mb-2">
          Le paiement en espèces se fait directement auprès du propriétaire de l'oliveraie ou du cueilleur au moment convenu.
        </p>
        <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
          <li>Assurez-vous d'avoir le montant exact</li>
          <li>Demandez toujours un reçu de paiement</li>
          <li>La plateforme Zeytna n'intervient pas dans les paiements en espèces</li>
        </ul>
      </div>
      
      <Button onClick={() => onSubmit({ type: "cash" })} className="w-full" disabled={processing}>
        {processing ? "Traitement en cours..." : "Confirmer le mode de paiement"}
      </Button>
    </div>
  );
};

export default CashPayment;
