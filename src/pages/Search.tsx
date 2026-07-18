
import { useState, useEffect, useCallback, lazy, Suspense } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon, Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import SearchFilters from "@/components/search/SearchFilters";
import SearchResults from "@/components/search/SearchResults";
// mapbox-gl (~1,5 MB) isolé dans son propre chunk : chargé seulement au passage
// en vue carte, pas au montage de la page (vue liste par défaut).
const MapView = lazy(() => import("@/components/search/MapView"));
import {
  getAllHarvesters,
  searchHarvesters,
  type HarvesterProfile,
} from "@/services/harvesterListService";

// Format attendu par SearchResults / MapView
export interface SearchResultItem {
  id: string;
  name: string;
  type: "harvester";
  photo?: string;
  location: string;
  experience: string;
  rating: number;
  rate: number;
}

const toSearchResult = (h: HarvesterProfile): SearchResultItem => ({
  id: h.id,
  name: h.full_name,
  type: "harvester",
  photo: h.profile_picture ?? undefined,
  location: (h.preferred_regions || []).join(", "),
  experience: h.experience_years != null ? `${h.experience_years} ans` : "N.C.",
  rating: h.rating ?? 0,
  rate: h.daily_rate ?? 0,
});

// SearchFilters émet "0-2 ans" | "2-5 ans" | "5+ ans" ; le service attend '0-2' | '2-5' | '5+'
const toServiceFilters = (filters: any) => ({
  region: Array.isArray(filters?.location) && filters.location.length > 0
    ? filters.location[0]
    : undefined,
  experience: typeof filters?.experience === "string" && filters.experience
    ? filters.experience.replace(" ans", "")
    : undefined,
});

const Search = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState({});
  const [displayMode, setDisplayMode] = useState("list");
  const [results, setResults] = useState<SearchResultItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const runSearch = useCallback(async (term: string, rawFilters: any) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const serviceFilters = toServiceFilters(rawFilters);
      const hasCriteria = term || serviceFilters.region || serviceFilters.experience;
      const data = hasCriteria
        ? await searchHarvesters(term, serviceFilters)
        : await getAllHarvesters();
      setResults(data.map(toSearchResult));
    } catch (error: any) {
      console.error("Error loading harvesters:", error);
      setLoadError(error?.message || "Erreur lors du chargement des résultats");
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch("", {});
  }, [runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery, filters);
  };

  const handleFilterChange = (newFilters: any) => {
    setFilters(newFilters);
    runSearch(searchQuery, newFilters);
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
          <Button type="submit" className="bg-olive hover:bg-olive-dark" disabled={isLoading}>
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
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
              <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
              <div className="text-gray-500">Chargement des résultats...</div>
            </div>
          ) : loadError ? (
            <div className="text-center py-16 bg-white rounded-lg shadow">
              <div className="text-red-600 mb-2">{loadError}</div>
              <Button variant="outline" onClick={() => runSearch(searchQuery, filters)}>
                Réessayer
              </Button>
            </div>
          ) : displayMode === 'map' ? (
            <Suspense
              fallback={
                <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
                  <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
                  <div className="text-gray-500">Chargement de la carte...</div>
                </div>
              }
            >
              <MapView results={results} filters={filters} />
            </Suspense>
          ) : (
            <SearchResults
              results={results}
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
