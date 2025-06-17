
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
import MapView from "@/components/search/MapView";

// Mock data for testing
const mockResults = [
  {
    id: 1,
    name: "Ahmed Benali",
    type: "harvester",
    photo: "https://randomuser.me/api/portraits/men/21.jpg",
    location: "Sfax",
    experience: "5+ ans",
    rating: 4.8,
    rate: 120,
  },
  {
    id: 2,
    name: "Ferme Oliviers du Sud",
    type: "owner",
    photo: "https://images.unsplash.com/photo-1555711889-b2ff8afcc705",
    location: "Nabeul",
    harvestPeriod: "Nov - Déc 2023",
    surfaceArea: 35,
    treeCount: 450,
  },
  {
    id: 3,
    name: "Nadia Mansour",
    type: "harvester",
    photo: "https://randomuser.me/api/portraits/women/32.jpg",
    location: "Monastir",
    experience: "2-5 ans",
    rating: 4.5,
    rate: 90,
  },
  {
    id: 4,
    name: "Domaine Ben Salah",
    type: "owner",
    photo: "https://images.unsplash.com/photo-1578594770918-18d1c67e6d5d",
    location: "Sousse",
    harvestPeriod: "Oct - Nov 2023",
    surfaceArea: 80,
    treeCount: 1200,
  },
  {
    id: 5,
    name: "Samir Khelifi",
    type: "harvester",
    photo: "https://randomuser.me/api/portraits/men/54.jpg",
    location: "Tunis",
    experience: "5+ ans",
    rating: 4.9,
    rate: 150,
  },
];

const Search = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [displayMode, setDisplayMode] = useState("list");
  const [filteredResults, setFilteredResults] = useState(mockResults);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Implement search logic here
    console.log("Searching for:", searchQuery);
    // In a real application, you would call an API here
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    console.log("Filters applied:", newFilters);
    // In a real application, you would filter results based on these filters
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">
        {t('search.title')}
      </h1>
      
      <form onSubmit={handleSearch} className="max-w-3xl mx-auto mb-8">
        <div className="flex gap-2">
          <Input 
            type="search" 
            placeholder={t('search.placeholder')}
            className="flex-1"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <Button type="submit" className="bg-olive hover:bg-olive-dark">
            <SearchIcon className="mr-2 h-4 w-4" />
            {t('search.searchButton')}
          </Button>
        </div>
      </form>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Filtres */}
        <div className="md:col-span-1">
          <SearchFilters onFilterChange={handleFilterChange} />
        </div>
        
        {/* Résultats */}
        <div className="md:col-span-2">
          {displayMode === 'map' ? (
            <MapView results={filteredResults} filters={filters} />
          ) : (
            <SearchResults 
              results={filteredResults}
              onDisplayModeChange={setDisplayMode}
              currentDisplayMode={displayMode}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
