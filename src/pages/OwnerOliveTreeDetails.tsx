
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, MapPin, Calendar, ArrowLeft, Edit } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';

const OwnerOliveTreeDetails = () => {
  const [searchParams] = useSearchParams();
  const oliveName = searchParams.get('name') || 'Oliveraie';

  // Données d'exemple - en réalité, on récupérerait les données selon l'ID
  const oliveDetails = {
    name: oliveName,
    location: 'Meknès - Secteur Nord',
    trees: 120,
    variety: 'Picholine',
    lastHarvest: '2023-11-15',
    estimatedYield: '2.5 tonnes',
    plantingDate: '2010-03-15',
    area: '2.5 hectares',
    soilType: 'Argilo-calcaire',
    irrigationSystem: 'Goutte à goutte',
    lastTreatment: '2023-09-20',
    healthStatus: 'Excellent'
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

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-olive-dark">Détails - {oliveDetails.name}</h1>
            <Button className="bg-olive hover:bg-olive-dark flex items-center gap-2">
              <Edit size={16} />
              Modifier
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                    <TreePine className="text-white" size={20} />
                  </div>
                  Informations Générales
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Localisation</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.location}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Superficie</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.area}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Nombre d'arbres</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.trees}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Variété</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.variety}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date de plantation</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.plantingDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Type de sol</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.soilType}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                    <Calendar className="text-white" size={20} />
                  </div>
                  Production et Santé
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Dernière récolte</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.lastHarvest}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Rendement estimé</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.estimatedYield}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Système d'irrigation</p>
                    <p className="font-semibold text-olive-dark">{oliveDetails.irrigationSystem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">État de santé</p>
                    <p className="font-semibold text-green-600">{oliveDetails.healthStatus}</p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-gray-500">Dernier traitement</p>
                  <p className="font-semibold text-olive-dark">{oliveDetails.lastTreatment}</p>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-4">
            <Link 
              to={`/owner-plan-harvest?name=${encodeURIComponent(oliveName)}`}
              className="flex-1"
            >
              <Button className="w-full bg-olive hover:bg-olive-dark">
                Planifier la Récolte
              </Button>
            </Link>
            <Button variant="outline" className="flex-1">
              Historique des Récoltes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOliveTreeDetails;
