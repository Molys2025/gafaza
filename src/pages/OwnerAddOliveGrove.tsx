
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreePine, ArrowLeft, MapPin, Save } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';

const OwnerAddOliveGrove = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    area: '',
    numberOfTrees: '',
    variety: 'Picholine',
    plantingDate: '',
    soilType: 'Argilo-calcaire',
    irrigationSystem: 'Goutte à goutte'
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location || !formData.numberOfTrees) {
      toast({
        title: "Champs requis manquants",
        description: "Veuillez remplir tous les champs obligatoires",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Oliveraie ajoutée",
      description: `${formData.name} a été ajoutée avec succès à vos oliviers`,
    });

    // Reset form
    setFormData({
      name: '',
      location: '',
      area: '',
      numberOfTrees: '',
      variety: 'Picholine',
      plantingDate: '',
      soilType: 'Argilo-calcaire',
      irrigationSystem: 'Goutte à goutte'
    });
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
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
            <h1 className="text-3xl font-bold text-olive-dark">Ajouter une Oliveraie</h1>
            <p className="text-gray-600 mt-2">Ajoutez une nouvelle oliveraie à votre exploitation</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3">
                <div className="w-10 h-10 bg-olive rounded-full flex items-center justify-center">
                  <TreePine className="text-white" size={20} />
                </div>
                Informations de l'Oliveraie
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nom de l'oliveraie *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="Ex: Oliveraie Nord"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Localisation *
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Ex: Meknès - Secteur Nord"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Superficie (hectares)
                    </label>
                    <input
                      type="number"
                      name="area"
                      value={formData.area}
                      onChange={handleChange}
                      placeholder="Ex: 2.5"
                      step="0.1"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Nombre d'oliviers *
                    </label>
                    <input
                      type="number"
                      name="numberOfTrees"
                      value={formData.numberOfTrees}
                      onChange={handleChange}
                      placeholder="Ex: 120"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Variété d'olive
                    </label>
                    <select
                      name="variety"
                      value={formData.variety}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    >
                      <option value="Picholine">Picholine</option>
                      <option value="Arbequina">Arbequina</option>
                      <option value="Picual">Picual</option>
                      <option value="Hojiblanca">Hojiblanca</option>
                      <option value="Koroneiki">Koroneiki</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Date de plantation
                    </label>
                    <input
                      type="date"
                      name="plantingDate"
                      value={formData.plantingDate}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Type de sol
                    </label>
                    <select
                      name="soilType"
                      value={formData.soilType}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    >
                      <option value="Argilo-calcaire">Argilo-calcaire</option>
                      <option value="Sableux">Sableux</option>
                      <option value="Argileux">Argileux</option>
                      <option value="Limoneux">Limoneux</option>
                      <option value="Rocailleux">Rocailleux</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Système d'irrigation
                    </label>
                    <select
                      name="irrigationSystem"
                      value={formData.irrigationSystem}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                    >
                      <option value="Goutte à goutte">Goutte à goutte</option>
                      <option value="Aspersion">Aspersion</option>
                      <option value="Gravitaire">Gravitaire</option>
                      <option value="Aucun">Aucun (pluvial)</option>
                    </select>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-olive hover:bg-olive-dark flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    Ajouter l'Oliveraie
                  </Button>
                  <Link to="/owner-olive-trees" className="flex-1">
                    <Button type="button" variant="outline" className="w-full">
                      Annuler
                    </Button>
                  </Link>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default OwnerAddOliveGrove;
