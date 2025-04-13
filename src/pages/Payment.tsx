import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentSystem from "@/components/payment/PaymentSystem";
import TransactionManagement from "@/components/payment/TransactionManagement";
import FinancialDashboard from "@/components/payment/FinancialDashboard";
import { CreditCard, FileText, LineChart, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";

// No changes needed in this file since we're just refactoring the imported component
// The PaymentSystem import path remains the same, but the component's internal structure has changed

const Payment = () => {
  const [selectedTab, setSelectedTab] = useState("payment");
  const [paymentComplete, setPaymentComplete] = useState(false);
  const [newPaymentOpen, setNewPaymentOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState(450);
  const [paymentDescription, setPaymentDescription] = useState("Paiement pour service de cueillette d'olives - 3 jours");
  const { toast } = useToast();

  const handlePaymentComplete = (result: any) => {
    console.log("Payment completed:", result);
    setPaymentComplete(true);
    
    // Show detailed toast with transaction information
    toast({
      title: result.escrow ? "Paiement séquestre créé" : "Paiement réussi",
      description: `Transaction #${result.transactionId} - ${result.amount} ${result.currency}`,
    });
    
    setNewPaymentOpen(false);
  };

  const handleEscrowRelease = (transactionId: string) => {
    toast({
      title: "Paiement libéré",
      description: `Le paiement #${transactionId} a été libéré avec succès.`,
    });
  };

  const handleStartNewPayment = () => {
    setPaymentComplete(false);
    setNewPaymentOpen(true);
  };

  const form = useForm({
    defaultValues: {
      amount: "450",
      description: "Paiement pour service de cueillette d'olives",
      recipient: "ahmed_ben_ali",
    },
  });

  const onSubmitNewPayment = (data: any) => {
    setPaymentAmount(parseFloat(data.amount));
    setPaymentDescription(data.description);
    setPaymentComplete(false);
    setNewPaymentOpen(false);
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Paiements</h1>
      
      <Tabs 
        defaultValue="payment" 
        value={selectedTab}
        onValueChange={setSelectedTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="payment" className="flex items-center gap-2">
            <CreditCard className="h-4 w-4" />
            Paiement
          </TabsTrigger>
          <TabsTrigger value="transactions" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Transactions
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            Tableau de bord
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="payment">
          <div className="flex justify-end mb-4">
            <Dialog open={newPaymentOpen} onOpenChange={setNewPaymentOpen}>
              <DialogTrigger asChild>
                <Button className="flex items-center gap-2" onClick={handleStartNewPayment}>
                  <PlusCircle className="h-4 w-4" />
                  Nouveau paiement
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Créer un nouveau paiement</DialogTitle>
                  <DialogDescription>
                    Veuillez remplir les détails du paiement que vous souhaitez effectuer.
                  </DialogDescription>
                </DialogHeader>
                <form onSubmit={form.handleSubmit(onSubmitNewPayment)} className="space-y-4 py-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Montant (TND)</Label>
                    <Input
                      id="amount"
                      type="number"
                      min="1"
                      step="0.01"
                      placeholder="450.00"
                      {...form.register("amount")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Input
                      id="description"
                      placeholder="Paiement pour service de cueillette"
                      {...form.register("description")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient">Destinataire</Label>
                    <Select defaultValue="ahmed_ben_ali">
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionner un destinataire" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ahmed_ben_ali">Ahmed Ben Ali (Cueilleur)</SelectItem>
                        <SelectItem value="leila_turki">Leila Turki (Propriétaire)</SelectItem>
                        <SelectItem value="sami_maatoug">Sami Maatoug (Cueilleur)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <DialogFooter>
                    <Button type="submit">Continuer vers le paiement</Button>
                  </DialogFooter>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          
          <div className="max-w-md mx-auto">
            {paymentComplete ? (
              <div className="text-center p-8 border rounded-lg">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Paiement traité!</h2>
                <p className="text-gray-600 mb-6">
                  Votre paiement a été traité avec succès. Vous pouvez consulter les détails dans l'historique des transactions.
                </p>
                <div className="space-y-2">
                  <button 
                    className="text-blue-600 underline block mx-auto"
                    onClick={() => setSelectedTab("transactions")}
                  >
                    Voir les transactions
                  </button>
                  <button 
                    className="text-blue-600 underline block mx-auto"
                    onClick={() => setPaymentComplete(false)}
                  >
                    Effectuer un autre paiement
                  </button>
                </div>
              </div>
            ) : (
              <PaymentSystem 
                amount={paymentAmount} 
                currency="TND"
                description={paymentDescription}
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionManagement onReleaseEscrow={handleEscrowRelease} />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
