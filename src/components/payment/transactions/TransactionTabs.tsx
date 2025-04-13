
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import TransactionTable from "./TransactionTable";
import { Transaction } from "./types";

interface TransactionTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  filteredTransactions: Transaction[];
  onRefund: (transaction: Transaction) => void;
  onDispute: (transaction: Transaction, reason: string) => void;
  onDownloadReceipt: (transaction: Transaction) => void;
  onReleaseEscrow: (transaction: Transaction) => void;
}

const TransactionTabs = ({
  activeTab,
  onTabChange,
  filteredTransactions,
  onRefund,
  onDispute,
  onDownloadReceipt,
  onReleaseEscrow,
}: TransactionTabsProps) => {
  return (
    <Tabs defaultValue={activeTab} value={activeTab} onValueChange={onTabChange}>
      <TabsList className="mb-4">
        <TabsTrigger value="all">Toutes</TabsTrigger>
        <TabsTrigger value="pending">En attente</TabsTrigger>
        <TabsTrigger value="escrow">En séquestre</TabsTrigger>
        <TabsTrigger value="completed">Complétées</TabsTrigger>
        <TabsTrigger value="disputed">Litigieuses</TabsTrigger>
      </TabsList>
      
      <TabsContent value="all">
        <TransactionTable
          transactions={filteredTransactions}
          onRefund={onRefund}
          onDispute={onDispute}
          onDownloadReceipt={onDownloadReceipt}
          onReleaseEscrow={onReleaseEscrow}
        />
      </TabsContent>
      
      <TabsContent value="pending">
        <TransactionTable
          transactions={filteredTransactions}
          onRefund={onRefund}
          onDispute={onDispute}
          onDownloadReceipt={onDownloadReceipt}
          onReleaseEscrow={onReleaseEscrow}
        />
      </TabsContent>
      
      <TabsContent value="escrow">
        <TransactionTable
          transactions={filteredTransactions}
          onRefund={onRefund}
          onDispute={onDispute}
          onDownloadReceipt={onDownloadReceipt}
          onReleaseEscrow={onReleaseEscrow}
        />
      </TabsContent>
      
      <TabsContent value="completed">
        <TransactionTable
          transactions={filteredTransactions}
          onRefund={onRefund}
          onDispute={onDispute}
          onDownloadReceipt={onDownloadReceipt}
          onReleaseEscrow={onReleaseEscrow}
        />
      </TabsContent>
      
      <TabsContent value="disputed">
        <TransactionTable
          transactions={filteredTransactions}
          onRefund={onRefund}
          onDispute={onDispute}
          onDownloadReceipt={onDownloadReceipt}
          onReleaseEscrow={onReleaseEscrow}
        />
      </TabsContent>
    </Tabs>
  );
};

export default TransactionTabs;
