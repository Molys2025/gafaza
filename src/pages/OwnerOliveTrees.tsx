
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, MapPin, Calendar, Plus, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { useTranslation } from 'react-i18next';

const OwnerOliveTrees = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [oliveTrees, setOliveTrees] = useState([
    {
      id: 1,
      name: 'Oliveraie Nord',
      location: 'Meknès - Secteur Nord',
      trees: 120,
      variety: 'Picholine',
      lastHarvest: '2023-11-15',
      estimatedYield: '2.5 tonnes'
    },
    {
      id: 2,
      name: 'Oliveraie Sud',
      location: 'Meknès - Secteur Sud',
      trees: 130,
      variety: 'Arbequina',
      lastHarvest: '2023-11-20',
      estimatedYield: '3.2 tonnes'
    }
  ]);

  const handleAddOliveGrove = () => {
    // Navigation vers la page d'ajout d'oliveraie
    window.location.href = '/owner-add-olive-grove';
  };

  const handleViewDetails = (oliveName: string) => {
    // Navigation vers la page de détails
    window.location.href = `/owner-olive-tree-details?name=${encodeURIComponent(oliveName)}`;
  };

  const handlePlanHarvest = (oliveName: string) => {
    // Navigation vers la page de planification
    window.location.href = `/owner-plan-harvest?name=${encodeURIComponent(oliveName)}`;
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/owner-profile" 
              className="flex items-center gap-2 text-olive-dark hover:text-olive transition-colors"
            >
              <ArrowLeft size={20} />
              <span>{t('common.back')}</span>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-olive-dark">{t('owner.oliveTrees')}</h1>
            <Button 
              onClick={handleAddOliveGrove}
              className="bg-olive hover:bg-olive-dark flex items-center gap-2"
            >
              <Plus size={16} />
              {t('owner.addOliveGrove')}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {oliveTrees.map((olive) => (
              <Card key={olive.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <CardTitle className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                      <TreePine className="text-white" size={20} />
                    </div>
                    {olive.name}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center gap-2 text-gray-600">
                    <MapPin size={16} />
                    <span>{olive.location}</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('owner.numberOfTrees')}</p>
                      <p className="font-semibold text-olive-dark">{olive.trees}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('owner.variety')}</p>
                      <p className="font-semibold text-olive-dark">{olive.variety}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500">{t('owner.lastHarvest')}</p>
                      <p className="font-semibold text-olive-dark">{olive.lastHarvest}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">{t('owner.estimatedYield')}</p>
                      <p className="font-semibold text-olive-dark">{olive.estimatedYield}</p>
                    </div>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handleViewDetails(olive.name)}
                    >
                      {t('owner.viewDetails')}
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex-1"
                      onClick={() => handlePlanHarvest(olive.name)}
                    >
                      {t('owner.planHarvest')}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="mt-8 text-center">
            <Card className="bg-olive/5 border-dashed border-2 border-olive/30">
              <CardContent className="py-12">
                <TreePine className="mx-auto text-olive/60 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-olive-dark mb-2">
                  {t('owner.addFirstGrove')}
                </h3>
                <p className="text-gray-600 mb-4">
                  {t('owner.startManaging')}
                </p>
                <Button 
                  onClick={handleAddOliveGrove}
                  className="bg-olive hover:bg-olive-dark"
                >
                  {t('owner.addOliveGrove')}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerOliveTrees;
