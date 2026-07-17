
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Grid, List, MapPin, Calendar, User, ThumbsUp, ArrowDownUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface SearchResultsProps {
  results: any[];
  onDisplayModeChange: (mode: string) => void;
  currentDisplayMode: string;
}

const SearchResults = ({ results, onDisplayModeChange, currentDisplayMode }: SearchResultsProps) => {
  const navigate = useNavigate();
  const [sortBy, setSortBy] = useState("pertinence");

  const goToProfile = (result: any) => {
    if (result.type === 'harvester') {
      navigate(`/harvester/${result.id}`);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="text-sm text-gray-600">
          {results.length} résultats trouvés
        </div>
        
        <div className="flex space-x-2 items-center">
          <Select
            value={sortBy}
            onValueChange={setSortBy}
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Trier par" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="pertinence">Pertinence</SelectItem>
              <SelectItem value="date">Date</SelectItem>
              <SelectItem value="prix">Prix</SelectItem>
              <SelectItem value="distance">Distance</SelectItem>
            </SelectContent>
          </Select>
          
          <div className="flex space-x-1 border rounded-md">
            <Button
              variant={currentDisplayMode === 'list' ? 'default' : 'ghost'}
              size="icon"
              className={currentDisplayMode === 'list' ? 'bg-olive text-white' : ''}
              onClick={() => onDisplayModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={currentDisplayMode === 'grid' ? 'default' : 'ghost'}
              size="icon"
              className={currentDisplayMode === 'grid' ? 'bg-olive text-white' : ''}
              onClick={() => onDisplayModeChange('grid')}
            >
              <Grid className="h-4 w-4" />
            </Button>
            <Button
              variant={currentDisplayMode === 'map' ? 'default' : 'ghost'}
              size="icon"
              className={currentDisplayMode === 'map' ? 'bg-olive text-white' : ''}
              onClick={() => onDisplayModeChange('map')}
            >
              <MapPin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-gray-500 mb-2">Aucun résultat trouvé</div>
          <div className="text-sm text-gray-400">Essayez d'autres critères de recherche</div>
        </div>
      ) : (
        <>
          {currentDisplayMode === 'list' && (
            <div className="space-y-4">
              {results.map((result) => (
                <div key={result.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow flex">
                  <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden mr-4 flex-shrink-0">
                    {result.photo && <img src={result.photo} alt={result.name} className="w-full h-full object-cover" />}
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-olive-dark">{result.name}</h3>
                    <div className="text-sm text-gray-600 mt-1 flex items-center">
                      <MapPin className="h-3 w-3 mr-1" /> {result.location}
                    </div>
                    <div className="flex items-center mt-2 text-sm text-gray-600">
                      {result.type === 'harvester' ? (
                        <>
                          <User className="h-3 w-3 mr-1" /> {result.experience} d'expérience
                          <span className="mx-2">•</span>
                          <ThumbsUp className="h-3 w-3 mr-1" /> {result.rating}/5
                        </>
                      ) : (
                        <>
                          <Calendar className="h-3 w-3 mr-1" /> Récolte: {result.harvestPeriod}
                          <span className="mx-2">•</span>
                          <ArrowDownUp className="h-3 w-3 mr-1" /> {result.surfaceArea} hectares
                        </>
                      )}
                    </div>
                    <div className="mt-2 flex justify-between items-center">
                      {result.type === 'harvester' ? (
                        <div className="font-semibold text-olive">{result.rate} TND/jour</div>
                      ) : (
                        <div className="text-sm text-gray-600">{result.treeCount} oliviers</div>
                      )}
                      <Button size="sm" variant="outline" className="text-olive border-olive hover:bg-olive hover:text-white" onClick={() => goToProfile(result)}>
                        Voir le profil
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {currentDisplayMode === 'grid' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {results.map((result) => (
                <div key={result.id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
                  <div className="h-40 bg-gray-200 rounded-md overflow-hidden mb-3">
                    {result.photo && <img src={result.photo} alt={result.name} className="w-full h-full object-cover" />}
                  </div>
                  
                  <h3 className="font-semibold text-lg text-olive-dark">{result.name}</h3>
                  <div className="text-sm text-gray-600 mt-1 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {result.location}
                  </div>
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    {result.type === 'harvester' ? (
                      <>
                        <User className="h-3 w-3 mr-1" /> {result.experience} d'expérience
                      </>
                    ) : (
                      <>
                        <Calendar className="h-3 w-3 mr-1" /> Récolte: {result.harvestPeriod}
                      </>
                    )}
                  </div>
                  <div className="mt-3 flex justify-between items-center">
                    {result.type === 'harvester' ? (
                      <div className="font-semibold text-olive">{result.rate} TND/jour</div>
                    ) : (
                      <div className="text-sm text-gray-600">{result.treeCount} oliviers</div>
                    )}
                    <Button size="sm" variant="outline" className="text-olive border-olive hover:bg-olive hover:text-white" onClick={() => goToProfile(result)}>
                      Voir
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default SearchResults;
