
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import TransactionFilters from "./transactions/TransactionFilters";
import TransactionTabs from "./transactions/TransactionTabs";
import { Transaction, TransactionHandlers, mockTransactions } from "./transactions/types";

interface TransactionManagementProps extends TransactionHandlers {
  transactions?: Transaction[];
}

const TransactionManagement = ({
  transactions = [],
  onRefund,
  onDispute,
  onDownloadReceipt,
  onReleaseEscrow,
}: TransactionManagementProps) => {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [disputeReason, setDisputeReason] = useState("");
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const handleRefund = (transaction: Transaction) => {
    if (onRefund) {
      onRefund(transaction.id);
    } else {
      // Mock refund functionality
      toast({
        title: "Remboursement initié",
        description: `Le remboursement de ${transaction.amount} ${transaction.currency} a été initié et sera traité dans 2-3 jours ouvrables.`,
      });
    }
  };

  const handleDispute = (transaction: Transaction, reason: string) => {
    if (onDispute) {
      onDispute(transaction.id, reason);
    } else {
      // Mock dispute functionality
      toast({
        title: "Litige ouvert",
        description: "Votre litige a été ouvert. Notre équipe vous contactera dans les 24 heures.",
      });
    }
    setDisputeReason("");
  };

  const handleDownloadReceipt = (transaction: Transaction) => {
    if (onDownloadReceipt) {
      onDownloadReceipt(transaction.id);
    } else {
      // Mock download functionality
      toast({
        title: "Facture téléchargée",
        description: "La facture a été téléchargée avec succès.",
      });
    }
  };

  const handleReleaseEscrow = (transaction: Transaction) => {
    if (onReleaseEscrow) {
      onReleaseEscrow(transaction.id);
    } else {
      // Mock escrow release
      toast({
        title: "Paiement libéré",
        description: `Le paiement de ${transaction.amount} ${transaction.currency} a été libéré et sera versé au prestataire.`,
      });
    }
  };

  // If no transactions provided, show mock data
  const displayTransactions = transactions.length > 0 ? transactions : mockTransactions;
  
  // Filter and search transactions
  const filteredTransactions = displayTransactions.filter(transaction => {
    // First apply status filter
    const statusMatch = filter === "all" || 
                      (filter === "escrow" && transaction.status === "escrow") ||
                      (filter === "disputed" && transaction.status === "disputed") ||
                      (filter === "completed" && transaction.status === "completed") ||
                      (filter === "pending" && transaction.status === "pending");
    
    // Then apply search term
    const searchMatch = searchTerm === "" || 
                     transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                     (transaction.recipient && transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase()));
    
    return statusMatch && searchMatch;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <TransactionFilters 
            filter={filter}
            setFilter={setFilter}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            onRefresh={() => {
              toast({
                title: "Rafraîchi",
                description: "Les transactions ont été rafraîchies avec succès.",
              });
            }}
          />
          
          <div className="mt-4">
            <TransactionTabs 
              activeTab={filter}
              onTabChange={setFilter}
              filteredTransactions={filteredTransactions}
              onRefund={handleRefund}
              onDispute={handleDispute}
              onDownloadReceipt={handleDownloadReceipt}
              onReleaseEscrow={handleReleaseEscrow}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
