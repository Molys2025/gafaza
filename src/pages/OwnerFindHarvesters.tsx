
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Star, Search, Filter } from 'lucide-react';

const OwnerFindHarvesters = () => {
  const [searchTerm, setSearchTerm] = useState('');
  
  const harvesters = [
    {
      id: 1,
      name: 'Mohamed Alami',
      location: 'Meknès, 5 km',
      experience: '12 ans',
      rating: 4.8,
      reviews: 24,
      priceRange: '80-120 DH/jour',
      availability: 'Disponible',
      specialties: ['Picholine', 'Arbequina']
    },
    {
      id: 2,
      name: 'Fatima Zahra',
      location: 'Meknès, 8 km',
      experience: '8 ans',
      rating: 4.9,
      reviews: 31,
      priceRange: '90-130 DH/jour',
      availability: 'Disponible',
      specialties: ['Picholine', 'Arbosana']
    },
    {
      id: 3,
      name: 'Hassan Benali',
      location: 'Meknès, 12 km',
      experience: '15 ans',
      rating: 4.7,
      reviews: 18,
      priceRange: '100-150 DH/jour',
      availability: 'Occupé jusqu\'au 25 Nov',
      specialties: ['Toutes variétés']
    }
  ];

  return (
    <div className="min-h-screen bg-sand-light py-8">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-olive-dark mb-6">Trouver des Cueilleurs</h1>

          {/* Barre de recherche et filtres */}
          <Card className="mb-6">
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row gap-4">
                <div className="flex-1 relative">
                  <Search className="absolute left-3 top-3 text-gray-400" size={20} />
                  <input
                    type="text"
                    placeholder="Rechercher par nom ou localisation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>
                <Button variant="outline" className="flex items-center gap-2">
                  <Filter size={16} />
                  Filtres
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Liste des cueilleurs */}
          <div className="space-y-4">
            {harvesters.map((harvester) => (
              <Card key={harvester.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-12 h-12 bg-olive rounded-full flex items-center justify-center">
                          <Users className="text-white" size={24} />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-olive-dark">{harvester.name}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} />
                            <span className="text-sm">{harvester.location}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Expérience</p>
                          <p className="font-semibold text-olive-dark">{harvester.experience}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Note</p>
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="font-semibold text-olive-dark">{harvester.rating}</span>
                            <span className="text-xs text-gray-500">({harvester.reviews})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tarif</p>
                          <p className="font-semibold text-olive-dark">{harvester.priceRange}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Disponibilité</p>
                          <p className={`font-semibold ${
                            harvester.availability === 'Disponible' 
                              ? 'text-green-600' 
                              : 'text-orange-600'
                          }`}>
                            {harvester.availability}
                          </p>
                        </div>
                      </div>

                      <div className="mb-4">
                        <p className="text-xs text-gray-500 mb-1">Spécialités</p>
                        <div className="flex flex-wrap gap-2">
                          {harvester.specialties.map((specialty, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-olive/10 text-olive-dark text-xs rounded-full"
                            >
                              {specialty}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button className="bg-olive hover:bg-olive-dark">
                        Contacter
                      </Button>
                      <Button variant="outline">
                        Voir Profil
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message si aucun résultat */}
          {harvesters.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucun cueilleur trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos critères de recherche
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default OwnerFindHarvesters;
