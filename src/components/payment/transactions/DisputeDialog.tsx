
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Transaction } from "./types";

interface DisputeDialogProps {
  transaction: Transaction;
  onDispute: (transaction: Transaction, reason: string) => void;
}

const DisputeDialog = ({ transaction, onDispute }: DisputeDialogProps) => {
  const [disputeReason, setDisputeReason] = useState("");

  return (
    <Dialog>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Signaler un problème</DialogTitle>
          <DialogDescription>
            Si vous rencontrez un problème avec cette transaction, veuillez nous en informer.
          </DialogDescription>
        </DialogHeader>
        <div className="py-4">
          <textarea
            className="w-full p-2 border rounded-md"
            rows={4}
            placeholder="Décrivez le problème rencontré..."
            value={disputeReason}
            onChange={(e) => setDisputeReason(e.target.value)}
          />
        </div>
        <DialogFooter>
          <Button 
            variant="outline" 
            onClick={() => onDispute(transaction, disputeReason)}
            disabled={!disputeReason.trim()}
          >
            Soumettre le litige
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default DisputeDialog;
