
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface BankTransferProps {
  onSubmit: (data: any) => void;
  processing: boolean;
}

const BankTransfer = ({ onSubmit, processing }: BankTransferProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Coordonnées bancaires</h4>
        <p className="text-sm text-gray-500 mb-1">Nom: Zeytna Services</p>
        <p className="text-sm text-gray-500 mb-1">IBAN: TN59 1234 5678 9012 3456 7890</p>
        <p className="text-sm text-gray-500 mb-1">BIC: ATBKTNTT</p>
        <p className="text-sm text-gray-500">Banque: Banque Nationale Agricole</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transferReference">Référence du virement</Label>
        <Input id="transferReference" placeholder="Référence / Numéro de transaction" />
      </div>
      
      <Button onClick={() => onSubmit({ type: "bankTransfer" })} className="w-full" disabled={processing}>
        {processing ? "Traitement en cours..." : "Confirmer le virement"}
      </Button>
      
      <p className="text-sm text-gray-500 mt-2">
        Une fois votre virement effectué, veuillez saisir la référence et confirmer pour que nous puissions vérifier votre paiement.
      </p>
    </div>
  );
};

export default BankTransfer;
