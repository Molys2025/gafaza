
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle } from "lucide-react";
import { Transaction } from "./types";

interface ReleaseEscrowDialogProps {
  transaction: Transaction;
  onReleaseEscrow: (transaction: Transaction) => void;
}

const ReleaseEscrowDialog = ({ transaction, onReleaseEscrow }: ReleaseEscrowDialogProps) => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Libérer le paiement séquestre</DialogTitle>
          <DialogDescription>
            En libérant ce paiement, vous confirmez que le travail a été effectué correctement.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-2">Transaction: {transaction.id}</p>
          <p className="text-sm text-gray-500 mb-2">Montant: {transaction.amount} {transaction.currency}</p>
          <p className="text-sm text-gray-500 mb-2">Prestataire: {transaction.recipient}</p>
          <p className="text-sm text-gray-500">Date: {transaction.date}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onReleaseEscrow(transaction)}>
            Confirmer la libération
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ReleaseEscrowDialog;
