
import React, { useState } from 'react';
import PaymentSystem from '@/components/payment/PaymentSystem';
import { useToast } from '@/hooks/use-toast';

const Payment = () => {
  const [amount] = useState(50); // Example amount
  const { toast } = useToast();

  const handlePaymentSuccess = (paymentData: any) => {
    console.log('Payment successful:', paymentData);
    toast({
      title: 'Paiement réussi',
      description: `Votre paiement de ${paymentData.amount} TND a été traité avec succès.`,
    });
  };

  const handlePaymentError = (error: string) => {
    console.error('Payment error:', error);
    toast({
      title: 'Erreur de paiement',
      description: error,
      variant: 'destructive',
    });
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-olive-dark mb-4">
              Paiement sécurisé
            </h1>
            <p className="text-gray-600">
              Choisissez votre mode de paiement préféré pour finaliser votre transaction
            </p>
          </div>

          <PaymentSystem
            amount={amount}
            description="Paiement de services Zeytna"
            onSuccess={handlePaymentSuccess}
            onError={handlePaymentError}
          />
        </div>
      </div>
    </div>
  );
};

export default Payment;
