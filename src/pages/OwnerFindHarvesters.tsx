
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, MapPin, Star, Search, Filter, MessageCircle, Eye, Loader2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useToast } from '@/hooks/use-toast';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { getAllHarvesters, searchHarvesters, HarvesterProfile } from '@/services/harvesterListService';

const OwnerFindHarvesters = () => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [harvesters, setHarvesters] = useState<HarvesterProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    region: '',
    experience: '',
    availability: ''
  });

  useEffect(() => {
    loadHarvesters();
  }, []);

  const loadHarvesters = async () => {
    try {
      setLoading(true);
      const data = await getAllHarvesters();
      setHarvesters(data);
    } catch (error) {
      console.error('Error loading harvesters:', error);
      toast({
        title: "Erreur",
        description: "Impossible de charger les cueilleurs",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    try {
      setLoading(true);
      const data = await searchHarvesters(searchTerm, filters);
      setHarvesters(data);
    } catch (error) {
      console.error('Error searching harvesters:', error);
      toast({
        title: "Erreur",
        description: "Erreur lors de la recherche",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleContact = (harvester: HarvesterProfile) => {
    toast({
      title: "Message envoyé",
      description: `Votre demande de contact a été envoyée à ${harvester.full_name}`,
    });
  };

  const handleApplyFilters = () => {
    handleSearch();
    setShowFilters(false);
  };

  const formatExperience = (years: number) => {
    return years === 1 ? '1 an' : `${years} ans`;
  };

  const formatAvailability = (start: string, end: string) => {
    const startDate = new Date(start);
    const endDate = new Date(end);
    const now = new Date();
    
    if (now >= startDate && now <= endDate) {
      return 'Disponible';
    } else if (now < startDate) {
      return `Disponible à partir du ${startDate.toLocaleDateString('fr-FR')}`;
    } else {
      return 'Non disponible actuellement';
    }
  };

  const HarvesterProfileDialog = ({ harvester }: { harvester: HarvesterProfile }) => (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="w-12 h-12 bg-olive rounded-full flex items-center justify-center overflow-hidden">
            {harvester.profile_picture ? (
              <img src={harvester.profile_picture} alt={harvester.full_name} className="w-full h-full object-cover" />
            ) : (
              <Users className="text-white" size={24} />
            )}
          </div>
          {harvester.full_name}
        </DialogTitle>
      </DialogHeader>
      <div className="space-y-4">
        <div className="flex items-center gap-2 text-gray-600">
          <MapPin size={16} />
          <span>{harvester.preferred_regions?.join(', ') || 'Toutes régions'}</span>
        </div>
        {harvester.bio && (
          <p className="text-gray-700">{harvester.bio}</p>
        )}
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-gray-500">Expérience</p>
            <p className="font-semibold text-olive-dark">{formatExperience(harvester.experience_years)}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Note</p>
            <div className="flex items-center gap-1">
              <Star className="text-yellow-400 fill-current" size={16} />
              <span className="font-semibold text-olive-dark">{harvester.rating || 'N/A'}</span>
              <span className="text-sm text-gray-500">({harvester.reviews_count || 0} avis)</span>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500">Tarif journalier</p>
            <p className="font-semibold text-olive-dark">{harvester.daily_rate} DT/jour</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Disponibilité</p>
            <p className="font-semibold text-green-600">
              {formatAvailability(harvester.availability_start, harvester.availability_end)}
            </p>
          </div>
        </div>
        {harvester.skills && harvester.skills.length > 0 && (
          <div>
            <p className="text-sm text-gray-500 mb-2">Compétences</p>
            <div className="flex flex-wrap gap-2">
              {harvester.skills.map((skill: string, index: number) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-olive/10 text-olive-dark text-sm rounded-full"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
        <div className="flex gap-2 pt-4">
          <Button 
            className="flex-1 bg-olive hover:bg-olive-dark"
            onClick={() => handleContact(harvester)}
          >
            <MessageCircle className="mr-2 h-4 w-4" />
            Contacter
          </Button>
        </div>
      </div>
    </DialogContent>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-sand-light py-8 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-olive" />
          <p className="text-gray-600">Chargement des cueilleurs...</p>
        </div>
      </div>
    );
  }

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
                    placeholder="Rechercher par nom ou région..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-olive"
                  />
                </div>
                <Button 
                  onClick={handleSearch}
                  className="bg-olive hover:bg-olive-dark"
                >
                  <Search size={16} className="mr-2" />
                  Rechercher
                </Button>
                <Button 
                  variant="outline" 
                  className="flex items-center gap-2"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <Filter size={16} />
                  Filtres
                </Button>
              </div>
              
              {showFilters && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <select 
                      className="p-2 border border-gray-300 rounded-md"
                      value={filters.region}
                      onChange={(e) => setFilters({...filters, region: e.target.value})}
                    >
                      <option value="">Toutes les régions</option>
                      <option value="Tunis">Tunis</option>
                      <option value="Sfax">Sfax</option>
                      <option value="Sousse">Sousse</option>
                      <option value="Kairouan">Kairouan</option>
                      <option value="Monastir">Monastir</option>
                    </select>
                    <select 
                      className="p-2 border border-gray-300 rounded-md"
                      value={filters.experience}
                      onChange={(e) => setFilters({...filters, experience: e.target.value})}
                    >
                      <option value="">Toute expérience</option>
                      <option value="0-2">0-2 ans</option>
                      <option value="2-5">2-5 ans</option>
                      <option value="5+">5+ ans</option>
                    </select>
                    <select 
                      className="p-2 border border-gray-300 rounded-md"
                      value={filters.availability}
                      onChange={(e) => setFilters({...filters, availability: e.target.value})}
                    >
                      <option value="">Toute disponibilité</option>
                      <option value="available">Disponible maintenant</option>
                      <option value="soon">Bientôt disponible</option>
                    </select>
                  </div>
                  <Button onClick={handleApplyFilters} className="bg-olive hover:bg-olive-dark">
                    Appliquer les filtres
                  </Button>
                </div>
              )}
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
                        <div className="w-12 h-12 bg-olive rounded-full flex items-center justify-center overflow-hidden">
                          {harvester.profile_picture ? (
                            <img src={harvester.profile_picture} alt={harvester.full_name} className="w-full h-full object-cover" />
                          ) : (
                            <Users className="text-white" size={24} />
                          )}
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-olive-dark">{harvester.full_name}</h3>
                          <div className="flex items-center gap-2 text-gray-600">
                            <MapPin size={14} />
                            <span className="text-sm">{harvester.preferred_regions?.join(', ') || 'Toutes régions'}</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div>
                          <p className="text-xs text-gray-500">Expérience</p>
                          <p className="font-semibold text-olive-dark">{formatExperience(harvester.experience_years)}</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Note</p>
                          <div className="flex items-center gap-1">
                            <Star className="text-yellow-400 fill-current" size={14} />
                            <span className="font-semibold text-olive-dark">{harvester.rating || 'N/A'}</span>
                            <span className="text-xs text-gray-500">({harvester.reviews_count || 0})</span>
                          </div>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Tarif</p>
                          <p className="font-semibold text-olive-dark">{harvester.daily_rate} DT/jour</p>
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">Disponibilité</p>
                          <p className="font-semibold text-green-600">
                            {formatAvailability(harvester.availability_start, harvester.availability_end)}
                          </p>
                        </div>
                      </div>

                      {harvester.skills && harvester.skills.length > 0 && (
                        <div className="mb-4">
                          <p className="text-xs text-gray-500 mb-1">Compétences</p>
                          <div className="flex flex-wrap gap-2">
                            {harvester.skills.slice(0, 3).map((skill, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-olive/10 text-olive-dark text-xs rounded-full"
                              >
                                {skill}
                              </span>
                            ))}
                            {harvester.skills.length > 3 && (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                +{harvester.skills.length - 3} autres
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col gap-2">
                      <Button 
                        className="bg-olive hover:bg-olive-dark"
                        onClick={() => handleContact(harvester)}
                      >
                        <MessageCircle className="mr-2 h-4 w-4" />
                        Contacter
                      </Button>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline">
                            <Eye className="mr-2 h-4 w-4" />
                            Voir Profil
                          </Button>
                        </DialogTrigger>
                        <HarvesterProfileDialog harvester={harvester} />
                      </Dialog>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Message si aucun résultat */}
          {harvesters.length === 0 && !loading && (
            <Card className="text-center py-12">
              <CardContent>
                <Users className="mx-auto text-gray-400 mb-4" size={48} />
                <h3 className="text-lg font-semibold text-gray-700 mb-2">
                  Aucun cueilleur trouvé
                </h3>
                <p className="text-gray-500">
                  Essayez d'ajuster vos critères de recherche ou{' '}
                  <Button variant="link" onClick={loadHarvesters} className="p-0 h-auto text-olive">
                    rafraîchir la liste
                  </Button>
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
