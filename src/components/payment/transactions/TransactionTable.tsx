
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt, CheckCircle, RefreshCw, ShieldAlert } from "lucide-react";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { Transaction, getTypeLabel, getStatusLabel, getStatusBadge } from "./types";
import ReleaseEscrowDialog from "./ReleaseEscrowDialog";
import RefundDialog from "./RefundDialog";
import DisputeDialog from "./DisputeDialog";

interface TransactionTableProps {
  transactions: Transaction[];
  onRefund: (transaction: Transaction) => void;
  onDispute: (transaction: Transaction, reason: string) => void;
  onDownloadReceipt: (transaction: Transaction) => void;
  onReleaseEscrow: (transaction: Transaction) => void;
}

const TransactionTable = ({
  transactions,
  onRefund,
  onDispute,
  onDownloadReceipt,
  onReleaseEscrow,
}: TransactionTableProps) => {
  const renderBadge = (status: Transaction["status"]) => {
    const badgeClass = getStatusBadge(status);
    const label = getStatusLabel(status);
    
    if (status === "pending") {
      return <Badge variant="outline" className={badgeClass}>{label}</Badge>;
    }
    
    return <Badge className={badgeClass}>{label}</Badge>;
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Type</TableHead>
          <TableHead>Description</TableHead>
          <TableHead className="text-right">Montant</TableHead>
          <TableHead>Statut</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
            <TableCell>{transaction.date}</TableCell>
            <TableCell>{getTypeLabel(transaction.type)}</TableCell>
            <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
            <TableCell className="text-right">
              {transaction.type === "refund" ? "-" : ""}
              {transaction.amount} {transaction.currency}
            </TableCell>
            <TableCell>{renderBadge(transaction.status)}</TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end space-x-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onDownloadReceipt(transaction)}
                >
                  <Receipt className="h-4 w-4" />
                </Button>
                
                {/* Release Escrow button */}
                {transaction.status === "escrow" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      </Button>
                    </DialogTrigger>
                    <ReleaseEscrowDialog 
                      transaction={transaction}
                      onReleaseEscrow={onReleaseEscrow}
                    />
                  </Dialog>
                )}
                
                {transaction.status === "completed" && transaction.type === "payment" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <RefreshCw className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <RefundDialog
                      transaction={transaction}
                      onRefund={onRefund}
                    />
                  </Dialog>
                )}
                
                {transaction.status !== "disputed" && transaction.type !== "refund" && (
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <ShieldAlert className="h-4 w-4" />
                      </Button>
                    </DialogTrigger>
                    <DisputeDialog
                      transaction={transaction}
                      onDispute={onDispute}
                    />
                  </Dialog>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
        
        {transactions.length === 0 && (
          <TableRow>
            <TableCell colSpan={7} className="text-center py-8 text-gray-500">
              Aucune transaction ne correspond à vos critères.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default TransactionTable;
