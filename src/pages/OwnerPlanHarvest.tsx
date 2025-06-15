
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { TreePine, Calendar as CalendarIcon, ArrowLeft, Users, Clock } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

const OwnerPlanHarvest = () => {
  const [searchParams] = useSearchParams();
  const oliveName = searchParams.get('name') || 'Oliveraie';
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [harvestDuration, setHarvestDuration] = useState('3');
  const [numberOfHarvesters, setNumberOfHarvesters] = useState('5');
  const { toast } = useToast();

  const handlePlanHarvest = () => {
    if (!selectedDate) {
      toast({
        title: "Date requise",
        description: "Veuillez sélectionner une date pour la récolte",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Récolte planifiée",
      description: `Récolte de ${oliveName} planifiée le ${format(selectedDate, 'dd MMMM yyyy', { locale: fr })}`,
    });
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/owner-olive-trees" 
              className="flex items-center gap-2 text-olive-dark hover:text-olive transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour aux oliviers</span>
            </Link>
          </div>

          <div className="mb-6">
            <h1 className="text-3xl font-bold text-olive-dark">Planifier la Récolte</h1>
            <p className="text-gray-600 mt-2">Oliveraie : {oliveName}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                    <CalendarIcon className="text-white" size={20} />
                  </div>
                  Sélectionner la Date
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="single"
                  selected={selectedDate}
                  onSelect={setSelectedDate}
                  disabled={(date) => date < new Date()}
                  className="rounded-md border"
                />
                {selectedDate && (
                  <div className="mt-4 p-3 bg-olive/10 rounded-lg">
                    <p className="text-sm text-olive-dark">
                      Date sélectionnée : {format(selectedDate, 'dd MMMM yyyy', { locale: fr })}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                    <TreePine className="text-white" size={20} />
                  </div>
                  Détails de la Récolte
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Users size={16} />
                    Nombre de cueilleurs
                  </label>
                  <select 
                    value={numberOfHarvesters}
                    onChange={(e) => setNumberOfHarvesters(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  >
                    <option value="3">3 cueilleurs</option>
                    <option value="5">5 cueilleurs</option>
                    <option value="8">8 cueilleurs</option>
                    <option value="10">10 cueilleurs</option>
                  </select>
                </div>

                <div>
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
                    <Clock size={16} />
                    Durée estimée
                  </label>
                  <select 
                    value={harvestDuration}
                    onChange={(e) => setHarvestDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  >
                    <option value="1">1 jour</option>
                    <option value="2">2 jours</option>
                    <option value="3">3 jours</option>
                    <option value="5">5 jours</option>
                    <option value="7">1 semaine</option>
                  </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                  <h4 className="font-semibold text-olive-dark mb-2">Résumé</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {numberOfHarvesters} cueilleurs requis</li>
                    <li>• Durée : {harvestDuration} jour{parseInt(harvestDuration) > 1 ? 's' : ''}</li>
                    <li>• Coût estimé : {parseInt(numberOfHarvesters) * parseInt(harvestDuration) * 150} MAD</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={handlePlanHarvest}
              className="flex-1 bg-olive hover:bg-olive-dark"
            >
              Confirmer la Planification
            </Button>
            <Link to="/owner-find-harvesters" className="flex-1">
              <Button variant="outline" className="w-full">
                Trouver des Cueilleurs
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerPlanHarvest;
