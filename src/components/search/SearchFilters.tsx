
import { useState } from "react";
import { Calendar, CalendarIcon, Filter, SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";

// Régions de Tunisie
const regions = [
  "Tunis",
  "Ariana",
  "Ben Arous",
  "Manouba",
  "Nabeul",
  "Zaghouan",
  "Bizerte",
  "Béja",
  "Jendouba",
  "Le Kef",
  "Siliana",
  "Sousse",
  "Monastir",
  "Mahdia",
  "Sfax",
  "Kairouan",
  "Kasserine",
  "Sidi Bouzid",
  "Gabès",
  "Medenine",
  "Tataouine",
  "Gafsa",
  "Tozeur",
  "Kebili",
];

interface SearchFiltersProps {
  onFilterChange: (filters: any) => void;
}

const SearchFilters = ({ onFilterChange }: SearchFiltersProps) => {
  const [location, setLocation] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [experience, setExperience] = useState<string>("");
  const [surfaceArea, setSurfaceArea] = useState<number[]>([0]);
  const [priceRange, setPriceRange] = useState<number[]>([50]);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const handleApplyFilters = () => {
    onFilterChange({
      location,
      dateRange: { start: startDate, end: endDate },
      experience,
      surfaceArea: surfaceArea[0],
      priceRange: priceRange[0],
    });
    
    // Close filters on mobile
    if (window.innerWidth < 768) {
      setIsFiltersOpen(false);
    }
  };

  const handleResetFilters = () => {
    setLocation([]);
    setStartDate(undefined);
    setEndDate(undefined);
    setExperience("");
    setSurfaceArea([0]);
    setPriceRange([50]);
    
    onFilterChange({});
  };

  return (
    <div className="bg-white rounded-lg shadow-md mb-6">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-lg font-semibold text-olive-dark">Filtres de recherche</h2>
        <Button 
          variant="ghost" 
          size="sm"
          className="md:hidden"
          onClick={() => setIsFiltersOpen(!isFiltersOpen)}
        >
          <Filter className="h-4 w-4 mr-2" />
          Filtres
        </Button>
      </div>

      <div className={cn(
        "p-4 space-y-6",
        !isFiltersOpen && "hidden md:block"
      )}>
        {/* Localisation */}
        <div>
          <Label className="mb-2 block">Localisation</Label>
          <Select
            value={location[0] ?? ""}
            onValueChange={(value) => setLocation(value ? [value] : [])}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Sélectionnez une région" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                <SelectLabel>Régions</SelectLabel>
                {regions.map((region) => (
                  <SelectItem key={region} value={region}>
                    {region}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Période de disponibilité */}
        <div>
          <Label className="mb-2 block">Période de disponibilité</Label>
          <div className="flex space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "P", { locale: fr }) : "Date de début"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "P", { locale: fr }) : "Date de fin"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <CalendarComponent
                  mode="single"
                  selected={endDate}
                  onSelect={setEndDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        {/* Expérience */}
        <div>
          <Label className="mb-2 block">Expérience</Label>
          <Select
            value={experience}
            onValueChange={setExperience}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Niveau d'expérience" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="0-2 ans">0-2 ans</SelectItem>
              <SelectItem value="2-5 ans">2-5 ans</SelectItem>
              <SelectItem value="5+ ans">5+ ans</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Surface */}
        <div>
          <div className="flex justify-between mb-2">
            <Label>Surface (hectares)</Label>
            <span className="text-sm text-gray-500">{surfaceArea[0]} ha</span>
          </div>
          <Slider
            defaultValue={[0]}
            max={1000}
            step={10}
            value={surfaceArea}
            onValueChange={setSurfaceArea}
          />
        </div>

        {/* Tarif */}
        <div>
          <div className="flex justify-between mb-2">
            <Label>Tarif (TND)</Label>
            <span className="text-sm text-gray-500">{priceRange[0]} TND</span>
          </div>
          <Slider
            defaultValue={[50]}
            max={500}
            step={10}
            value={priceRange}
            onValueChange={setPriceRange}
          />
        </div>

        {/* Boutons d'action */}
        <div className="flex space-x-2 pt-4">
          <Button
            variant="outline"
            className="flex-1"
            onClick={handleResetFilters}
          >
            Réinitialiser
          </Button>
          <Button 
            className="flex-1 bg-olive hover:bg-olive-dark"
            onClick={handleApplyFilters}
          >
            Appliquer
          </Button>
        </div>
      </div>
    </div>
  );
};

export default SearchFilters;
