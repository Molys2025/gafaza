
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, Smartphone } from 'lucide-react';

interface FlouciPaymentProps {
  amount: number;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

const FlouciPayment = ({ amount, onSuccess, onError }: FlouciPaymentProps) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [paymentUrl, setPaymentUrl] = useState('');

  const initiateFlouciPayment = async () => {
    if (!phoneNumber) {
      onError('Veuillez saisir votre numéro de téléphone');
      return;
    }

    setLoading(true);

    try {
      // Call your backend API to initiate Flouci payment
      const response = await fetch('/api/flouci/payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: amount * 1000, // Flouci uses millimes
          phoneNumber,
          description: `Paiement Zeytna - ${amount} TND`,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to Flouci payment page
        setPaymentUrl(data.payment_url);
        window.open(data.payment_url, '_blank');
        
        // Start polling for payment status
        pollPaymentStatus(data.payment_id);
      } else {
        onError(data.error || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (error) {
      console.error('Flouci payment error:', error);
      onError('Erreur de connexion au service de paiement');
    } finally {
      setLoading(false);
    }
  };

  const pollPaymentStatus = async (paymentId: string) => {
    const maxAttempts = 30; // 5 minutes max
    let attempts = 0;

    const checkStatus = async () => {
      try {
        const response = await fetch(`/api/flouci/payment-status/${paymentId}`);
        const data = await response.json();

        if (data.status === 'SUCCESS') {
          onSuccess({
            paymentId,
            amount,
            method: 'flouci',
            phoneNumber,
          });
          return;
        } else if (data.status === 'FAILED') {
          onError('Le paiement a échoué');
          return;
        }

        attempts++;
        if (attempts < maxAttempts) {
          setTimeout(checkStatus, 10000); // Check every 10 seconds
        } else {
          onError('Délai d\'attente dépassé pour le paiement');
        }
      } catch (error) {
        console.error('Error checking payment status:', error);
        onError('Erreur lors de la vérification du paiement');
      }
    };

    checkStatus();
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Smartphone className="w-5 h-5 text-orange-500" />
          Paiement Flouci
        </CardTitle>
        <CardDescription>
          Payez facilement avec votre portefeuille mobile Flouci
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-orange-50 p-4 rounded-lg">
          <p className="text-sm text-orange-700 mb-2">
            <strong>Montant à payer :</strong> {amount} TND
          </p>
          <p className="text-xs text-orange-600">
            Vous serez redirigé vers l'application Flouci pour finaliser le paiement
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="flouci-phone">Numéro de téléphone</Label>
          <Input
            id="flouci-phone"
            type="tel"
            placeholder="Ex: 20123456"
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-gray-500">
            Saisissez votre numéro sans l'indicatif (+216)
          </p>
        </div>

        {paymentUrl && (
          <Alert>
            <AlertDescription>
              Une nouvelle fenêtre s'est ouverte pour effectuer le paiement. 
              Si ce n'est pas le cas, <a href={paymentUrl} target="_blank" rel="noopener noreferrer" className="text-olive underline">cliquez ici</a>.
            </AlertDescription>
          </Alert>
        )}

        <Button
          onClick={initiateFlouciPayment}
          disabled={loading || !phoneNumber}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        >
          {loading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Initialisation...
            </>
          ) : (
            `Payer ${amount} TND avec Flouci`
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          <p>Paiement sécurisé par Flouci</p>
          <p>Vos données bancaires ne sont pas stockées sur nos serveurs</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default FlouciPayment;
