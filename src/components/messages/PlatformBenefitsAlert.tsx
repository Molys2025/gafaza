
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Shield, CreditCard, Users, AlertTriangle, CheckCircle } from "lucide-react";

interface PlatformBenefitsAlertProps {
  type: 'warning' | 'info' | 'success';
  warningType?: 'contact_info' | 'external_link' | 'bypass_attempt';
  onClose?: () => void;
}

const PlatformBenefitsAlert = ({ type, warningType, onClose }: PlatformBenefitsAlertProps) => {
  const getAlertContent = () => {
    switch (warningType) {
      case 'contact_info':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Information personnelle détectée",
          message: "Pour votre sécurité, évitez de partager vos coordonnées personnelles avant la finalisation de votre accord.",
        };
      case 'external_link':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Plateforme externe mentionnée",
          message: "Notre messagerie sécurisée vous protège. Une fois votre mission acceptée, vous pourrez utiliser d'autres moyens de communication.",
        };
      case 'bypass_attempt':
        return {
          icon: <AlertTriangle className="h-4 w-4" />,
          title: "Attention aux risques",
          message: "Sortir de Zeytna vous fait perdre nos protections et garanties.",
        };
      default:
        return {
          icon: <CheckCircle className="h-4 w-4" />,
          title: "Restez protégé sur Zeytna",
          message: "Profitez de tous nos avantages en gardant vos échanges sur la plateforme.",
        };
    }
  };

  const { icon, title, message } = getAlertContent();

  return (
    <Alert className="my-4 border-l-4 border-l-olive">
      <div className="flex items-start gap-3">
        {icon}
        <div className="flex-1">
          <h4 className="font-medium mb-2">{title}</h4>
          <AlertDescription className="mb-3">
            {message}
          </AlertDescription>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-3">
            <Badge variant="outline" className="flex items-center gap-1">
              <Shield className="h-3 w-3" />
              <span className="text-xs">Assurance</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <CreditCard className="h-3 w-3" />
              <span className="text-xs">Paiement sécurisé</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              <span className="text-xs">Cotisation CNSS</span>
            </Badge>
            <Badge variant="outline" className="flex items-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              <span className="text-xs">Gestion litiges</span>
            </Badge>
          </div>
          
          <p className="text-sm text-muted-foreground">
            En restant sur Zeytna, vous bénéficiez de toutes ces protections gratuitement.
          </p>
        </div>
      </div>
    </Alert>
  );
};

export default PlatformBenefitsAlert;
