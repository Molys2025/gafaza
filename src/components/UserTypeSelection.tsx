
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Trees, Users } from 'lucide-react';

interface UserTypeSelectionProps {
  onSelect: (userType: 'owner' | 'harvester') => void;
  loading?: boolean;
}

const UserTypeSelection = ({ onSelect, loading = false }: UserTypeSelectionProps) => {
  const [selectedType, setSelectedType] = useState<'owner' | 'harvester' | null>(null);

  const handleConfirm = () => {
    if (selectedType) {
      onSelect(selectedType);
    }
  };

  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl text-olive-dark">
            Choisissez votre profil
          </CardTitle>
          <CardDescription>
            Sélectionnez le type de profil qui vous correspond pour accéder aux fonctionnalités adaptées
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedType === 'owner' ? 'ring-2 ring-olive bg-olive/5' : ''
              }`}
              onClick={() => setSelectedType('owner')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trees className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-olive-dark mb-2">
                  Propriétaire
                </h3>
                <p className="text-gray-600 text-sm">
                  Je possède des oliviers et je cherche des cueilleurs pour la récolte
                </p>
              </CardContent>
            </Card>

            <Card 
              className={`cursor-pointer transition-all hover:shadow-lg ${
                selectedType === 'harvester' ? 'ring-2 ring-olive bg-olive/5' : ''
              }`}
              onClick={() => setSelectedType('harvester')}
            >
              <CardContent className="p-6 text-center">
                <div className="w-20 h-20 bg-olive-dark rounded-full flex items-center justify-center mx-auto mb-4">
                  <Users className="text-white" size={40} />
                </div>
                <h3 className="text-xl font-semibold text-olive-dark mb-2">
                  Cueilleur
                </h3>
                <p className="text-gray-600 text-sm">
                  Je propose mes services pour la récolte d'olives
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center">
            <Button
              onClick={handleConfirm}
              disabled={!selectedType || loading}
              className="bg-olive hover:bg-olive-dark text-white px-8 py-3"
            >
              {loading ? 'Création en cours...' : 'Confirmer mon choix'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserTypeSelection;
