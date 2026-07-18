import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search as SearchIcon,
  Loader2,
  MapPin,
  Users,
  CalendarDays,
  Briefcase,
} from "lucide-react";
import { getActiveJobs, type JobRow, type JobType } from "@/services/jobService";
import { REGIONS } from "@/constants/regions";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  harvest: "Récolte",
  pruning: "Taille",
  maintenance: "Entretien",
  transport: "Transport",
  other: "Autre",
};

const PAYMENT_LABELS: Record<string, string> = {
  hourly: "/heure",
  daily: "/jour",
  fixed: "forfait",
  per_kg: "/kg",
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : null;

const ALL = "__all__";

const Jobs = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [region, setRegion] = useState<string>(ALL);
  const [jobType, setJobType] = useState<string>(ALL);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  const runSearch = useCallback(async (term: string, regionValue: string, typeValue: string) => {
    setIsLoading(true);
    setLoadError(null);
    try {
      const data = await getActiveJobs({
        search: term || undefined,
        region: regionValue === ALL ? undefined : regionValue,
        jobType: typeValue === ALL ? undefined : (typeValue as JobType),
      });
      setJobs(data);
    } catch (error: any) {
      console.error("Error loading jobs:", error);
      setLoadError(error?.message || "Erreur lors du chargement des annonces");
      setJobs([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    runSearch("", ALL, ALL);
  }, [runSearch]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    runSearch(searchQuery, region, jobType);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-olive-dark mb-2">Offres de récolte</h1>
      <p className="text-gray-600 mb-6">
        Trouvez une mission dans une oliveraie près de chez vous.
      </p>

      <form onSubmit={handleSearch} className="mb-8 grid gap-2 sm:grid-cols-[1fr_auto_auto_auto]">
        <Input
          type="search"
          placeholder="Rechercher une annonce..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <Select value={region} onValueChange={setRegion}>
          <SelectTrigger className="sm:w-[180px]">
            <SelectValue placeholder="Région" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Toutes les régions</SelectItem>
            {REGIONS.map((r) => (
              <SelectItem key={r} value={r}>{r}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={jobType} onValueChange={setJobType}>
          <SelectTrigger className="sm:w-[160px]">
            <SelectValue placeholder="Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>Tous les types</SelectItem>
            {(Object.keys(JOB_TYPE_LABELS) as JobType[]).map((type) => (
              <SelectItem key={type} value={type}>{JOB_TYPE_LABELS[type]}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Button type="submit" className="bg-olive hover:bg-olive-dark" disabled={isLoading}>
          <SearchIcon className="mr-2 h-4 w-4" />
          Rechercher
        </Button>
      </form>

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
          <div className="text-gray-500">Chargement des annonces...</div>
        </div>
      ) : loadError ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-red-600 mb-4">{loadError}</div>
          <Button variant="outline" onClick={() => runSearch(searchQuery, region, jobType)}>
            Réessayer
          </Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-gray-500 mb-2">Aucune annonce trouvée</div>
          <div className="text-sm text-gray-400">Essayez d'autres critères de recherche</div>
        </div>
      ) : (
        <>
          <div className="text-sm text-gray-600 mb-4">
            {jobs.length} annonce{jobs.length > 1 ? "s" : ""} trouvée{jobs.length > 1 ? "s" : ""}
          </div>

          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-5 rounded-lg shadow-md hover:shadow-lg transition-shadow"
              >
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-lg text-olive-dark">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                      {(job.location_address || job.region) && (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location_address || job.region}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.workers_needed} cueilleur{job.workers_needed > 1 ? "s" : ""}
                      </span>
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {formatDate(job.start_date)} — {formatDate(job.end_date)}
                      </span>
                    </div>
                  </div>

                  <Badge variant="secondary" className="flex items-center gap-1">
                    <Briefcase className="h-3 w-3" />
                    {JOB_TYPE_LABELS[job.job_type]}
                  </Badge>
                </div>

                {job.description && (
                  <p className="text-gray-700 mt-3 line-clamp-2">{job.description}</p>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="font-semibold text-olive">
                    {job.payment_amount} TND {PAYMENT_LABELS[job.payment_type] ?? ""}
                  </div>
                  <Button
                    size="sm"
                    variant="outline"
                    className="text-olive border-olive hover:bg-olive hover:text-white"
                    onClick={() => navigate(`/jobs/${job.id}`)}
                  >
                    Voir l'annonce
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default Jobs;
