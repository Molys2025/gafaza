
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Eye, 
  Lock, 
  Unlock, 
  RefreshCw,
  DollarSign,
  CreditCard,
  AlertTriangle
} from "lucide-react";

const PaymentManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - À remplacer par de vraies données
  const transactions = [
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
      payer: "Ahmed Ben Ali",
      recipient: "Sami Maatoug",
      job_title: "Cueillette Sfax - Octobre 2023",
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
      payer: "Leila Turki",
      recipient: "En attente",
      job_title: "Récolte Monastir - Novembre 2023",
    },
    {
      id: "TXN123458",
      type: "refund",
      status: "pending",
      amount: 200,
      fee: 0,
      currency: "TND",
      date: "2023-10-10",
      description: "Remboursement partiel - Service annulé",
      paymentMethod: "Crédit sur carte",
      payer: "Système",
      recipient: "Fatma Khelifi",
      job_title: "Mission annulée",
    }
  ];

  const handlePaymentAction = (transactionId: string, action: string) => {
    console.log(`Action ${action} on transaction ${transactionId}`);
    // Implémenter les actions sur les paiements
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500">Complété</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'escrow':
        return <Badge className="bg-blue-500">En séquestre</Badge>;
      case 'disputed':
        return <Badge variant="destructive">Litigieux</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échoué</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'payment':
        return 'Paiement';
      case 'refund':
        return 'Remboursement';
      case 'escrow':
        return 'Dépôt séquestre';
      case 'withdrawal':
        return 'Retrait';
      default:
        return type;
    }
  };

  const filteredTransactions = transactions.filter(transaction => {
    const matchesSearch = transaction.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.payer.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.recipient.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Statistiques de paiement */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">127,350 TND</div>
            <p className="text-xs text-muted-foreground">Ce mois</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">En Séquestre</CardTitle>
            <Lock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,450 TND</div>
            <p className="text-xs text-muted-foreground">12 transactions</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Litiges</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">3</div>
            <p className="text-xs text-muted-foreground">À traiter</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Commissions</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">6,367 TND</div>
            <p className="text-xs text-muted-foreground">5% moyen</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Gestion des Paiements</CardTitle>
          <CardDescription>
            Superviser toutes les transactions financières de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par ID, description, utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="completed">Complété</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="escrow">En séquestre</SelectItem>
                <SelectItem value="disputed">Litigieux</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des transactions */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>ID Transaction</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Participants</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredTransactions.map((transaction) => (
                  <TableRow key={transaction.id}>
                    <TableCell className="font-mono text-sm">
                      {transaction.id}
                    </TableCell>
                    <TableCell>
                      {getTypeLabel(transaction.type)}
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {transaction.amount.toFixed(2)} {transaction.currency}
                        </div>
                        {transaction.fee > 0 && (
                          <div className="text-sm text-muted-foreground">
                            Commission: {transaction.fee.toFixed(2)} {transaction.currency}
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>De: {transaction.payer}</div>
                        <div className="text-muted-foreground">À: {transaction.recipient}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(transaction.date).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(transaction.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de la transaction</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">ID Transaction</label>
                                  <p className="font-mono">{transaction.id}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Type</label>
                                  <p>{getTypeLabel(transaction.type)}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Montant</label>
                                  <p>{transaction.amount.toFixed(2)} {transaction.currency}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Commission</label>
                                  <p>{transaction.fee.toFixed(2)} {transaction.currency}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Payeur</label>
                                  <p>{transaction.payer}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Bénéficiaire</label>
                                  <p>{transaction.recipient}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">Description</label>
                                  <p>{transaction.description}</p>
                                </div>
                                <div className="col-span-2">
                                  <label className="text-sm font-medium">Mission associée</label>
                                  <p>{transaction.job_title}</p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              {transaction.status === 'escrow' && (
                                <Button 
                                  onClick={() => handlePaymentAction(transaction.id, 'release')}
                                >
                                  <Unlock className="h-4 w-4 mr-2" />
                                  Libérer le paiement
                                </Button>
                              )}
                              {transaction.status === 'disputed' && (
                                <Button 
                                  variant="outline"
                                  onClick={() => handlePaymentAction(transaction.id, 'refund')}
                                >
                                  <RefreshCw className="h-4 w-4 mr-2" />
                                  Rembourser
                                </Button>
                              )}
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {transaction.status === 'escrow' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePaymentAction(transaction.id, 'release')}
                          >
                            <Unlock className="h-4 w-4" />
                          </Button>
                        )}
                        
                        {transaction.status === 'pending' && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handlePaymentAction(transaction.id, 'process')}
                          >
                            <RefreshCw className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune transaction trouvée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentManagement;
