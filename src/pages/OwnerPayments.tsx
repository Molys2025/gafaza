
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, ArrowUpRight, ArrowDownLeft, Calendar, Filter } from 'lucide-react';

const OwnerPayments = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const transactions = [
    {
      id: 1,
      type: 'payout',
      description: 'Paiement à Mohamed Alami',
      amount: -1200,
      date: '2023-11-20',
      status: 'completed',
      harvester: 'Mohamed Alami'
    },
    {
      id: 2,
      type: 'payout',
      description: 'Paiement à Fatima Zahra',
      amount: -950,
      date: '2023-11-18',
      status: 'pending',
      harvester: 'Fatima Zahra'
    },
    {
      id: 3,
      type: 'payout',
      description: 'Paiement à Hassan Benali',
      amount: -1500,
      date: '2023-11-15',
      status: 'completed',
      harvester: 'Hassan Benali'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'text-green-600 bg-green-100';
      case 'pending':
        return 'text-orange-600 bg-orange-100';
      case 'failed':
        return 'text-red-600 bg-red-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Terminé';
      case 'pending':
        return 'En attente';
      case 'failed':
        return 'Échec';
      default:
        return status;
    }
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-olive-dark mb-6">Gérer les Paiements</h1>

          {/* Onglets */}
          <div className="flex space-x-1 mb-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'bg-olive text-white'
                  : 'bg-white text-olive-dark hover:bg-olive/10'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setActiveTab('transactions')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                activeTab === 'transactions'
                  ? 'bg-olive text-white'
                  : 'bg-white text-olive-dark hover:bg-olive/10'
              }`}
            >
              Transactions
            </button>
          </div>

          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Cartes de résumé */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Dépenses ce mois</p>
                        <p className="text-2xl font-bold text-olive-dark">3,650 DH</p>
                      </div>
                      <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                        <ArrowUpRight className="text-red-600" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Paiements en attente</p>
                        <p className="text-2xl font-bold text-olive-dark">950 DH</p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                        <Calendar className="text-orange-600" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Cueilleurs payés</p>
                        <p className="text-2xl font-bold text-olive-dark">8</p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <CreditCard className="text-green-600" size={24} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Actions rapides */}
              <Card>
                <CardHeader>
                  <CardTitle>Actions Rapides</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button className="bg-olive hover:bg-olive-dark h-12">
                      Effectuer un Paiement
                    </Button>
                    <Button variant="outline" className="h-12">
                      Configurer Paiement Automatique
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === 'transactions' && (
            <div className="space-y-6">
              {/* Filtres */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex flex-col md:flex-row gap-4 items-center">
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Rechercher une transaction..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                      />
                    </div>
                    <Button variant="outline" className="flex items-center gap-2">
                      <Filter size={16} />
                      Filtres
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Liste des transactions */}
              <Card>
                <CardHeader>
                  <CardTitle>Historique des Transactions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {transactions.map((transaction) => (
                      <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-olive/10 rounded-full flex items-center justify-center">
                            <ArrowUpRight className="text-olive" size={20} />
                          </div>
                          <div>
                            <p className="font-medium text-olive-dark">
                              {transaction.description}
                            </p>
                            <p className="text-sm text-gray-500">{transaction.date}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-semibold text-olive-dark">
                            {transaction.amount} DH
                          </p>
                          <span
                            className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              transaction.status
                            )}`}
                          >
                            {getStatusText(transaction.status)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerPayments;
