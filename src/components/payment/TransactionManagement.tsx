
import { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, RefreshCw, ShieldAlert, Receipt, CheckCircle, XCircle, AlertTriangle, Filter } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Transaction {
  id: string;
  type: "payment" | "refund" | "escrow" | "withdrawal";
  status: "pending" | "completed" | "failed" | "disputed" | "escrow";
  amount: number;
  fee: number;
  currency: string;
  date: string;
  description: string;
  paymentMethod: string;
  recipient?: string;
}

interface TransactionManagementProps {
  transactions?: Transaction[];
  onRefund?: (transactionId: string) => void;
  onDispute?: (transactionId: string, reason: string) => void;
  onDownloadReceipt?: (transactionId: string) => void;
  onReleaseEscrow?: (transactionId: string) => void;
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
  const mockTransactions: Transaction[] = [
    {
      id: "TXN123456",
      type: "payment",
      status: "completed",
      amount: 450,
      fee: 22.50,
      currency: "TND",
      date: "2023-10-15",
      description: "Paiement pour cueillette d'olives - 3 jours",
      paymentMethod: "Carte bancaire",
      recipient: "Ahmed Ben Ali",
    },
    {
      id: "TXN123457",
      type: "escrow",
      status: "escrow",
      amount: 600,
      fee: 30,
      currency: "TND",
      date: "2023-10-18",
      description: "Réservation pour cueillette - Oliveraie à Sfax",
      paymentMethod: "Virement bancaire",
      recipient: "Leila Turki",
    },
    {
      id: "TXN123458",
      type: "refund",
      status: "completed",
      amount: 200,
      fee: 0,
      currency: "TND",
      date: "2023-10-10",
      description: "Remboursement partiel - Service annulé",
      paymentMethod: "Crédit sur carte",
    },
    {
      id: "TXN123459",
      type: "payment",
      status: "disputed",
      amount: 750,
      fee: 37.50,
      currency: "TND",
      date: "2023-10-05",
      description: "Paiement pour cueillette d'olives - 5 jours",
      paymentMethod: "Mobile Money",
      recipient: "Sami Maatoug",
    },
    {
      id: "TXN123460",
      type: "payment",
      status: "pending",
      amount: 525,
      fee: 26.25,
      currency: "TND",
      date: "2023-10-20",
      description: "Paiement en attente - Cueillette à Nabeul",
      paymentMethod: "D17",
      recipient: "Fatma Khelifi",
    },
  ];

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

  const getStatusBadge = (status: Transaction["status"]) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-green-500">Complété</Badge>;
      case "pending":
        return <Badge variant="outline" className="text-yellow-600 border-yellow-600">En attente</Badge>;
      case "failed":
        return <Badge variant="destructive">Échoué</Badge>;
      case "disputed":
        return <Badge className="bg-orange-500">Litigieux</Badge>;
      case "escrow":
        return <Badge className="bg-blue-500">En séquestre</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: Transaction["type"]) => {
    switch (type) {
      case "payment":
        return "Paiement";
      case "refund":
        return "Remboursement";
      case "escrow":
        return "Dépôt séquestre";
      case "withdrawal":
        return "Retrait";
      default:
        return type;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Transactions</CardTitle>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" className="flex items-center">
              <RefreshCw className="h-4 w-4 mr-2" />
              Actualiser
            </Button>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Filtrer les transactions</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label>Statut</Label>
                    <Select defaultValue={filter} onValueChange={setFilter}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tous les statuts" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Tous les statuts</SelectItem>
                        <SelectItem value="pending">En attente</SelectItem>
                        <SelectItem value="completed">Complété</SelectItem>
                        <SelectItem value="escrow">En séquestre</SelectItem>
                        <SelectItem value="disputed">Litigieux</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Période</Label>
                    <Select defaultValue="all">
                      <SelectTrigger>
                        <SelectValue placeholder="Toutes les périodes" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Toutes les périodes</SelectItem>
                        <SelectItem value="week">Cette semaine</SelectItem>
                        <SelectItem value="month">Ce mois</SelectItem>
                        <SelectItem value="quarter">Ce trimestre</SelectItem>
                        <SelectItem value="year">Cette année</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <DialogFooter>
                  <Button type="submit">Appliquer les filtres</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Input
              placeholder="Rechercher une transaction..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="max-w-sm"
            />
          </div>
          
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all" onClick={() => setFilter("all")}>
                Toutes
              </TabsTrigger>
              <TabsTrigger value="pending" onClick={() => setFilter("pending")}>
                En attente
              </TabsTrigger>
              <TabsTrigger value="escrow" onClick={() => setFilter("escrow")}>
                En séquestre
              </TabsTrigger>
              <TabsTrigger value="completed" onClick={() => setFilter("completed")}>
                Complétées
              </TabsTrigger>
              <TabsTrigger value="disputed" onClick={() => setFilter("disputed")}>
                Litigieuses
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="all">
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
                  {filteredTransactions.map((transaction) => (
                    <TableRow key={transaction.id}>
                      <TableCell className="font-mono text-xs">{transaction.id}</TableCell>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>{getTypeLabel(transaction.type)}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                      <TableCell className="text-right">
                        {transaction.type === "refund" ? "-" : ""}
                        {transaction.amount} {transaction.currency}
                      </TableCell>
                      <TableCell>{getStatusBadge(transaction.status)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadReceipt(transaction)}
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
                                  <Button variant="outline" onClick={() => handleReleaseEscrow(transaction)}>
                                    Confirmer la libération
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {transaction.status === "completed" && transaction.type === "payment" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
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
                                  <Button variant="outline" onClick={() => handleRefund(transaction)}>
                                    Confirmer le remboursement
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                          
                          {transaction.status !== "disputed" && transaction.type !== "refund" && (
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button variant="ghost" size="sm">
                                  <ShieldAlert className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
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
                                    onClick={() => handleDispute(transaction, disputeReason)}
                                    disabled={!disputeReason.trim()}
                                  >
                                    Soumettre le litige
                                  </Button>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                  
                  {filteredTransactions.length === 0 && (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                        Aucune transaction ne correspond à vos critères.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TabsContent>
            
            <TabsContent value="pending">
              {/* Same table structure as above, but only showing pending transactions */}
            </TabsContent>
            
            <TabsContent value="escrow">
              {/* Same table structure as above, but only showing escrow transactions */}
            </TabsContent>
            
            <TabsContent value="completed">
              {/* Same table structure as above, but only showing completed transactions */}
            </TabsContent>
            
            <TabsContent value="disputed">
              {/* Same table structure as above, but only showing disputed transactions */}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default TransactionManagement;
