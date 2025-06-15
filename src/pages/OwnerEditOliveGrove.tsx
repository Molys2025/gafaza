
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, ArrowLeft, Save } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const OwnerEditOliveGrove = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const oliveName = searchParams.get('name') || 'Oliveraie';

  // État local pour les données du formulaire
  const [formData, setFormData] = useState({
    name: oliveName,
    location: 'Meknès - Secteur Nord',
    trees: '120',
    variety: 'Picholine',
    area: '2.5',
    soilType: 'Argilo-calcaire',
    irrigationSystem: 'Goutte à goutte',
    plantingDate: '2010-03-15'
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    toast({
      title: "Modifications sauvegardées",
      description: `Les informations de ${formData.name} ont été mises à jour avec succès.`,
    });
    
    // Retourner à la page de détails avec le nouveau nom
    navigate(`/owner-olive-tree-details?name=${encodeURIComponent(formData.name)}`);
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to={`/owner-olive-tree-details?name=${encodeURIComponent(oliveName)}`}
              className="flex items-center gap-2 text-olive-dark hover:text-olive transition-colors"
            >
              <ArrowLeft size={20} />
              <span>Retour aux détails</span>
            </Link>
          </div>

          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-olive-dark">Modifier - {oliveName}</h1>
            <Button 
              onClick={handleSave}
              className="bg-olive hover:bg-olive-dark flex items-center gap-2"
            >
              <Save size={16} />
              Sauvegarder
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
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nom de l'oliveraie
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Localisation
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Superficie (hectares)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      value={formData.area}
                      onChange={(e) => handleInputChange('area', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nombre d'arbres
                    </label>
                    <input
                      type="number"
                      value={formData.trees}
                      onChange={(e) => handleInputChange('trees', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Variété d'olive
                  </label>
                  <select
                    value={formData.variety}
                    onChange={(e) => handleInputChange('variety', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  >
                    <option value="Picholine">Picholine</option>
                    <option value="Arbequina">Arbequina</option>
                    <option value="Picual">Picual</option>
                    <option value="Frantoio">Frantoio</option>
                    <option value="Manzanilla">Manzanilla</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                    <TreePine className="text-white" size={20} />
                  </div>
                  Détails Techniques
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date de plantation
                  </label>
                  <input
                    type="date"
                    value={formData.plantingDate}
                    onChange={(e) => handleInputChange('plantingDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Type de sol
                  </label>
                  <select
                    value={formData.soilType}
                    onChange={(e) => handleInputChange('soilType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  >
                    <option value="Argilo-calcaire">Argilo-calcaire</option>
                    <option value="Sableux">Sableux</option>
                    <option value="Argileux">Argileux</option>
                    <option value="Limoneux">Limoneux</option>
                    <option value="Calcaire">Calcaire</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Système d'irrigation
                  </label>
                  <select
                    value={formData.irrigationSystem}
                    onChange={(e) => handleInputChange('irrigationSystem', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  >
                    <option value="Goutte à goutte">Goutte à goutte</option>
                    <option value="Aspersion">Aspersion</option>
                    <option value="Gravitaire">Gravitaire</option>
                    <option value="Micro-aspersion">Micro-aspersion</option>
                    <option value="Aucun">Aucun</option>
                  </select>
                </div>

                <div className="p-4 bg-olive/10 rounded-lg">
                  <h4 className="font-semibold text-olive-dark mb-2">Aperçu</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• {formData.name}</li>
                    <li>• {formData.trees} arbres sur {formData.area} hectares</li>
                    <li>• Variété : {formData.variety}</li>
                    <li>• Irrigation : {formData.irrigationSystem}</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mt-6 flex gap-4">
            <Button 
              onClick={handleSave}
              className="flex-1 bg-olive hover:bg-olive-dark"
            >
              Sauvegarder les Modifications
            </Button>
            <Link 
              to={`/owner-olive-tree-details?name=${encodeURIComponent(oliveName)}`}
              className="flex-1"
            >
              <Button variant="outline" className="w-full">
                Annuler
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerEditOliveGrove;
