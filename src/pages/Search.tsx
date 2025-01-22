import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search as SearchIcon } from "lucide-react";

const Search = () => {
  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold text-olive-dark mb-8">
        Rechercher des propriétaires ou cueilleurs
      </h1>
      
      <div className="max-w-2xl mx-auto">
        <div className="flex gap-4">
          <Input 
            type="search" 
            placeholder="Entrez un nom ou une région..." 
            className="flex-1"
          />
          <Button className="bg-olive hover:bg-olive-dark">
            <SearchIcon className="mr-2" />
            Rechercher
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Search;