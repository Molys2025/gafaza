
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Landmark, Smartphone, Banknote, ShieldCheck } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PaymentMethodProps {
  onSubmit: (data: any) => void;
  processing: boolean;
}

const CardPayment = ({ onSubmit, processing }: PaymentMethodProps) => {
  const [cardData, setCardData] = useState({
    cardNumber: "",
    cardHolder: "",
    expiryDate: "",
    cvv: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardData({
      ...cardData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ type: "card", ...cardData });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="cardNumber">Numéro de carte</Label>
        <Input
          id="cardNumber"
          name="cardNumber"
          placeholder="1234 5678 9012 3456"
          value={cardData.cardNumber}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="cardHolder">Titulaire de la carte</Label>
        <Input
          id="cardHolder"
          name="cardHolder"
          placeholder="Nom Prénom"
          value={cardData.cardHolder}
          onChange={handleChange}
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="expiryDate">Date d'expiration</Label>
          <Input
            id="expiryDate"
            name="expiryDate"
            placeholder="MM/AA"
            value={cardData.expiryDate}
            onChange={handleChange}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="cvv">CVV</Label>
          <Input
            id="cvv"
            name="cvv"
            placeholder="123"
            type="password"
            maxLength={4}
            value={cardData.cvv}
            onChange={handleChange}
            required
          />
        </div>
      </div>
      
      <Button type="submit" className="w-full" disabled={processing}>
        {processing ? "Traitement en cours..." : "Payer"}
      </Button>
      
      <div className="flex items-center justify-center text-sm text-gray-500 mt-4">
        <ShieldCheck className="h-4 w-4 mr-2" />
        Paiement sécurisé avec cryptage 3D Secure
      </div>
    </form>
  );
};

const BankTransfer = ({ onSubmit, processing }: PaymentMethodProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 bg-gray-50">
        <h4 className="font-medium mb-2">Coordonnées bancaires</h4>
        <p className="text-sm text-gray-500 mb-1">Nom: Zeytna Services</p>
        <p className="text-sm text-gray-500 mb-1">IBAN: TN59 1234 5678 9012 3456 7890</p>
        <p className="text-sm text-gray-500 mb-1">BIC: ATBKTNTT</p>
        <p className="text-sm text-gray-500">Banque: Banque Nationale Agricole</p>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="transferReference">Référence du virement</Label>
        <Input id="transferReference" placeholder="Référence / Numéro de transaction" />
      </div>
      
      <Button onClick={() => onSubmit({ type: "bankTransfer" })} className="w-full" disabled={processing}>
        {processing ? "Traitement en cours..." : "Confirmer le virement"}
      </Button>
      
      <p className="text-sm text-gray-500 mt-2">
        Une fois votre virement effectué, veuillez saisir la référence et confirmer pour que nous puissions vérifier votre paiement.
      </p>
    </div>
  );
};

const MobilePayment = ({ onSubmit, processing }: PaymentMethodProps) => {
  const [phone, setPhone] = useState("");

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="phoneNumber">Numéro de téléphone</Label>
        <Input
          id="phoneNumber"
          placeholder="+216 XX XXX XXX"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      
      <div className="grid grid-cols-3 gap-2">
        {["Orange Money", "MobiCash", "e-Dinar"].map((provider) => (
          <Button
            key={provider}
            variant="outline"
            className="h-auto py-4 flex flex-col"
            onClick={() => onSubmit({ type: "mobile", provider, phone })}
          >
            <Smartphone className="h-6 w-6 mb-1" />
            <span className="text-xs">{provider}</span>
          </Button>
        ))}
      </div>
      
      <p className="text-sm text-gray-500 mt-2">
        Vous serez redirigé vers l'application de paiement mobile sélectionnée pour finaliser votre paiement.
      </p>
    </div>
  );
};

const CashPayment = ({ onSubmit, processing }: PaymentMethodProps) => {
  return (
    <div className="space-y-4">
      <div className="rounded-md border p-4 bg-blue-50">
        <h4 className="font-medium text-blue-700 mb-2">Instructions pour le paiement en espèces</h4>
        <p className="text-sm text-blue-600 mb-2">
          Le paiement en espèces se fait directement auprès du propriétaire de l'oliveraie ou du cueilleur au moment convenu.
        </p>
        <ul className="list-disc list-inside text-sm text-blue-600 space-y-1">
          <li>Assurez-vous d'avoir le montant exact</li>
          <li>Demandez toujours un reçu de paiement</li>
          <li>La plateforme Zeytna n'intervient pas dans les paiements en espèces</li>
        </ul>
      </div>
      
      <Button onClick={() => onSubmit({ type: "cash" })} className="w-full" disabled={processing}>
        {processing ? "Traitement en cours..." : "Confirmer le mode de paiement"}
      </Button>
    </div>
  );
};

interface PaymentSystemProps {
  amount: number;
  currency?: string;
  description?: string;
  onPaymentComplete?: (result: any) => void;
}

const PaymentSystem = ({
  amount,
  currency = "TND",
  description = "Paiement pour services",
  onPaymentComplete,
}: PaymentSystemProps) => {
  const [processing, setProcessing] = useState(false);
  const { toast } = useToast();

  const handlePaymentSubmit = (data: any) => {
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Paiement réussi",
        description: `Votre paiement de ${amount} ${currency} via ${data.type} a été traité avec succès.`,
      });
      
      if (onPaymentComplete) {
        onPaymentComplete({
          success: true,
          transactionId: "TXN" + Math.floor(Math.random() * 1000000),
          amount,
          currency,
          method: data.type,
          timestamp: new Date().toISOString(),
        });
      }
    }, 2000);
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Paiement</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <h3 className="text-2xl font-bold mb-1">{amount} {currency}</h3>
          <p className="text-sm text-gray-500">Choisissez votre méthode de paiement</p>
        </div>
        
        <Tabs defaultValue="card">
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="card" className="flex flex-col items-center py-2">
              <CreditCard className="h-4 w-4 mb-1" />
              <span className="text-xs">Carte</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex flex-col items-center py-2">
              <Landmark className="h-4 w-4 mb-1" />
              <span className="text-xs">Virement</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex flex-col items-center py-2">
              <Smartphone className="h-4 w-4 mb-1" />
              <span className="text-xs">Mobile</span>
            </TabsTrigger>
            <TabsTrigger value="cash" className="flex flex-col items-center py-2">
              <Banknote className="h-4 w-4 mb-1" />
              <span className="text-xs">Espèces</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <CardPayment onSubmit={handlePaymentSubmit} processing={processing} />
          </TabsContent>
          
          <TabsContent value="bank">
            <BankTransfer onSubmit={handlePaymentSubmit} processing={processing} />
          </TabsContent>
          
          <TabsContent value="mobile">
            <MobilePayment onSubmit={handlePaymentSubmit} processing={processing} />
          </TabsContent>
          
          <TabsContent value="cash">
            <CashPayment onSubmit={handlePaymentSubmit} processing={processing} />
          </TabsContent>
        </Tabs>
      </CardContent>
      <CardFooter className="border-t pt-4 flex flex-col items-start">
        <div className="w-full flex justify-between mb-2 text-sm">
          <span>Montant</span>
          <span>{amount} {currency}</span>
        </div>
        <div className="w-full flex justify-between mb-2 text-sm">
          <span>Frais de plateforme (5%)</span>
          <span>{(amount * 0.05).toFixed(2)} {currency}</span>
        </div>
        <div className="w-full flex justify-between font-bold">
          <span>Total</span>
          <span>{(amount * 1.05).toFixed(2)} {currency}</span>
        </div>
      </CardFooter>
    </Card>
  );
};

export default PaymentSystem;
