
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PaymentSystem from "@/components/payment/PaymentSystem";
import TransactionManagement from "@/components/payment/TransactionManagement";
import FinancialDashboard from "@/components/payment/FinancialDashboard";
import { CreditCard, FileText, LineChart } from "lucide-react";

const Payment = () => {
  const [selectedTab, setSelectedTab] = useState("payment");
  const [paymentComplete, setPaymentComplete] = useState(false);

  const handlePaymentComplete = (result: any) => {
    console.log("Payment completed:", result);
    setPaymentComplete(true);
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
          <div className="max-w-md mx-auto">
            {paymentComplete ? (
              <div className="text-center p-8 border rounded-lg">
                <h2 className="text-2xl font-bold text-green-600 mb-4">Paiement réussi!</h2>
                <p className="text-gray-600 mb-6">
                  Votre paiement a été traité avec succès. Vous pouvez consulter les détails dans l'historique des transactions.
                </p>
                <button 
                  className="text-blue-600 underline"
                  onClick={() => setSelectedTab("transactions")}
                >
                  Voir les transactions
                </button>
              </div>
            ) : (
              <PaymentSystem 
                amount={450} 
                currency="TND"
                description="Paiement pour service de cueillette d'olives - 3 jours"
                onPaymentComplete={handlePaymentComplete}
              />
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="transactions">
          <TransactionManagement />
        </TabsContent>
        
        <TabsContent value="dashboard">
          <FinancialDashboard />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Payment;
