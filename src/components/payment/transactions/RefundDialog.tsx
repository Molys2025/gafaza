
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from "./types";

interface RefundDialogProps {
  transaction: Transaction;
  onRefund: (transaction: Transaction) => void;
}

const RefundDialog = ({ transaction, onRefund }: RefundDialogProps) => {
  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Demander un remboursement</DialogTitle>
          <DialogDescription>
            Êtes-vous sûr de vouloir demander un remboursement pour cette transaction?
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <p className="text-sm text-gray-500 mb-2">Transaction: {transaction.id}</p>
          <p className="text-sm text-gray-500 mb-2">Montant: {transaction.amount} {transaction.currency}</p>
          <p className="text-sm text-gray-500">Date: {transaction.date}</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onRefund(transaction)}>
            Confirmer le remboursement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RefundDialog;
