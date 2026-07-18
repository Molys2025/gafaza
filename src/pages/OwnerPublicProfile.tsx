import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  TreeDeciduous,
  Star,
  MessageCircle,
  BadgeCheck,
  Briefcase,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getOwnerProfile } from "@/services/ownerService";
import { getActiveJobs, type JobRow } from "@/services/jobService";
import { getRatingsFor, getOverallScore, type RatingRow } from "@/services/ratingService";
import { logger } from "@/lib/logger";

interface OwnerView {
  id: string;
  business_name?: string;
  property_type?: string;
  property_size?: number;
  typical_daily_rate?: number;
  average_rating?: number;
  total_ratings?: number;
  verified?: boolean;
  full_name?: string;
}

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : null;

const OwnerPublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [owner, setOwner] = useState<OwnerView | null>(null);
  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);

    getOwnerProfile(id)
      .then(setOwner)
      .catch((error: unknown) => {
        logger.error('Error loading owner profile', error);
        setLoadError("Erreur lors du chargement du profil");
      })
      .finally(() => setIsLoading(false));

    // Listings and reviews are secondary: a failure must not blank the page.
    getActiveJobs()
      .then((all) => setJobs(all.filter((job) => job.work_provider_id === id)))
      .catch((error) => logger.error('Error loading owner jobs', error));

    getRatingsFor(id)
      .then(setRatings)
      .catch((error) => logger.error('Error loading owner ratings', error));
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  if (loadError || !owner) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="text-gray-500 mb-4">{loadError || "Profil introuvable"}</div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-olive-dark">
              {owner.business_name || owner.full_name || "Propriétaire"}
            </h1>
            {owner.full_name && owner.business_name && (
              <p className="text-sm text-gray-600 mt-1">{owner.full_name}</p>
            )}
          </div>

          {owner.verified && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <BadgeCheck className="h-3 w-3" /> Vérifié
            </Badge>
          )}
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
          {owner.property_type && (
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" /> {owner.property_type}
            </span>
          )}
          {owner.property_size != null && (
            <span className="flex items-center">
              <TreeDeciduous className="h-4 w-4 mr-1" /> {owner.property_size} hectares
            </span>
          )}
          {owner.average_rating != null && owner.average_rating > 0 && (
            <span className="flex items-center">
              <Star className="h-4 w-4 mr-1 fill-olive text-olive" />
              {owner.average_rating}/5
              {owner.total_ratings ? ` (${owner.total_ratings} avis)` : ""}
            </span>
          )}
        </div>

        {owner.typical_daily_rate != null && (
          <div className="font-semibold text-olive text-lg mt-4">
            Tarif habituel : {owner.typical_daily_rate} TND/jour
          </div>
        )}

        <div className="mt-8">
          <Button
            className="bg-olive hover:bg-olive-dark"
            onClick={() => navigate(`/messages?user=${owner.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Contacter
          </Button>
        </div>
      </div>

      {/* Annonces en cours */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="font-semibold text-olive-dark mb-4">
          Annonces en cours {jobs.length > 0 && `(${jobs.length})`}
        </h2>

        {jobs.length === 0 ? (
          <p className="text-sm text-gray-500">Aucune annonce publiée actuellement.</p>
        ) : (
          <div className="space-y-3">
            {jobs.map((job) => (
              <button
                key={job.id}
                type="button"
                onClick={() => navigate(`/jobs/${job.id}`)}
                className="w-full text-left border rounded-lg p-4 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-medium text-olive-dark">{job.title}</span>
                  <span className="text-sm font-semibold text-olive">
                    {job.payment_amount} TND
                  </span>
                </div>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                  <span className="flex items-center">
                    <Briefcase className="h-3 w-3 mr-1" />
                    {job.workers_needed} cueilleur{job.workers_needed > 1 ? "s" : ""}
                  </span>
                  <span>
                    {formatDate(job.start_date)} — {formatDate(job.end_date)}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Avis reçus */}
      <div className="bg-white rounded-lg shadow-md p-6 mt-6">
        <h2 className="font-semibold text-olive-dark mb-4">
          Avis {ratings.length > 0 && `(${ratings.length})`}
        </h2>

        {ratings.length === 0 ? (
          <p className="text-sm text-gray-500">
            Aucun avis pour le moment. Les avis sont publiés après une mission terminée.
          </p>
        ) : (
          <div className="space-y-4">
            {ratings.map((rating) => {
              const overall = getOverallScore(rating);

              return (
                <div key={rating.id} className="border-b last:border-0 pb-4 last:pb-0">
                  <div className="flex items-center justify-between gap-2">
                    <div className="flex gap-0.5">
                      {[1, 2, 3, 4, 5].map((score) => (
                        <Star
                          key={score}
                          className={cn(
                            "h-4 w-4",
                            overall != null && score <= overall
                              ? "fill-olive text-olive"
                              : "text-gray-300",
                          )}
                        />
                      ))}
                    </div>
                    <span className="text-xs text-gray-400">{formatDate(rating.created_at)}</span>
                  </div>

                  {rating.comment && (
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{rating.comment}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerPublicProfile;
