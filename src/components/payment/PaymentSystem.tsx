
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CardPayment from './methods/CardPayment';
import BankTransfer from './methods/BankTransfer';
import MobilePayment from './methods/MobilePayment';
import CashPayment from './methods/CashPayment';
import FlouciPayment from './methods/FlouciPayment';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSystemProps {
  amount: number;
  description: string;
  onSuccess: (paymentData: any) => void;
  onError: (error: string) => void;
}

const PaymentSystem = ({ amount, description, onSuccess, onError }: PaymentSystemProps) => {
  const [activeTab, setActiveTab] = useState('flouci');
  const [processing, setProcessing] = useState(false);

  const handlePaymentSubmit = async (paymentData: any) => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      onSuccess({ ...paymentData, amount });
    } catch (error) {
      onError('Erreur lors du traitement du paiement');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Choisissez votre mode de paiement</CardTitle>
        <CardDescription>
          Montant à payer : <span className="font-semibold">{amount} TND</span>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="flouci">Flouci</TabsTrigger>
            <TabsTrigger value="card">Carte</TabsTrigger>
            <TabsTrigger value="mobile">Mobile</TabsTrigger>
            <TabsTrigger value="bank">Virement</TabsTrigger>
            <TabsTrigger value="cash">Espèces</TabsTrigger>
          </TabsList>
          
          <TabsContent value="flouci">
            <FlouciPayment 
              amount={amount}
              onSuccess={onSuccess}
              onError={onError}
            />
          </TabsContent>
          
          <TabsContent value="card">
            <CardPayment 
              onSubmit={handlePaymentSubmit}
              processing={processing}
            />
          </TabsContent>
          
          <TabsContent value="mobile">
            <MobilePayment 
              onSubmit={handlePaymentSubmit}
              processing={processing}
            />
          </TabsContent>
          
          <TabsContent value="bank">
            <BankTransfer 
              onSubmit={handlePaymentSubmit}
              processing={processing}
            />
          </TabsContent>
          
          <TabsContent value="cash">
            <CashPayment 
              onSubmit={handlePaymentSubmit}
              processing={processing}
            />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default PaymentSystem;
