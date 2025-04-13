
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Smartphone } from "lucide-react";

interface MobilePaymentProps {
  onSubmit: (data: any) => void;
  processing: boolean;
}

const MobilePayment = ({ onSubmit, processing }: MobilePaymentProps) => {
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

export default MobilePayment;
