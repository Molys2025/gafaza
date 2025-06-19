
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, MessageCircle, Phone, ExternalLink } from "lucide-react";

interface ContactUnlockProps {
  applicationStatus: 'pending' | 'accepted' | 'paid' | 'completed';
  recipientPhone?: string;
  recipientWhatsapp?: string;
  onRequestContact: () => void;
}

const ContactUnlock = ({ applicationStatus, recipientPhone, recipientWhatsapp, onRequestContact }: ContactUnlockProps) => {
  const canUnlockContact = applicationStatus === 'accepted' || applicationStatus === 'paid';

  if (!canUnlockContact) {
    return (
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <MessageCircle className="h-5 w-5" />
            Communication externe
          </CardTitle>
          <CardDescription>
            L'accès aux coordonnées externes sera débloqué une fois votre mission acceptée et sécurisée.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <CheckCircle className="h-4 w-4" />
              Paiement sécurisé sur Zeytna
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <CheckCircle className="h-4 w-4" />
              Assurance et protection CNSS
            </div>
            <div className="flex items-center gap-2 text-sm text-orange-700">
              <CheckCircle className="h-4 w-4" />
              Accès aux coordonnées WhatsApp/Téléphone
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-green-200 bg-green-50">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-green-800">
          <CheckCircle className="h-5 w-5" />
          Communication débloquée
          <Badge className="bg-green-500">Mission sécurisée</Badge>
        </CardTitle>
        <CardDescription>
          Votre mission est sécurisée ! Vous pouvez maintenant communiquer via d'autres canaux.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recipientPhone && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`tel:${recipientPhone}`)}
            >
              <Phone className="h-4 w-4 mr-2" />
              Appeler : {recipientPhone}
            </Button>
          )}
          
          {recipientWhatsapp && (
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => window.open(`https://wa.me/${recipientWhatsapp.replace(/\D/g, '')}`)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              WhatsApp : {recipientWhatsapp}
            </Button>
          )}
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Rappel :</strong> Même en communiquant ailleurs, gardez toujours Zeytna informé 
              de l'avancement de votre mission pour maintenir vos protections.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactUnlock;
