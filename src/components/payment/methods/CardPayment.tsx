
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ShieldCheck } from "lucide-react";

interface CardPaymentProps {
  onSubmit: (data: any) => void;
  processing: boolean;
}

const CardPayment = ({ onSubmit, processing }: CardPaymentProps) => {
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

export default CardPayment;
