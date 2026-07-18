
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, MapPin, User, ThumbsUp, Calendar, ArrowLeft, MessageCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getHarvesterById, type HarvesterProfile } from "@/services/harvesterListService";
import { getRatingsFor, getOverallScore, type RatingRow } from "@/services/ratingService";
import { cn } from "@/lib/utils";

const formatDate = (value?: string | null) => {
  if (!value) return null;
  const date = new Date(value);
  return isNaN(date.getTime()) ? null : date.toLocaleDateString("fr-FR");
};

const HarvesterPublicProfile = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<HarvesterProfile | null>(null);
  const [ratings, setRatings] = useState<RatingRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    getHarvesterById(id)
      .then(setProfile)
      .catch((error: any) => {
        console.error("Error loading harvester profile:", error);
        setLoadError(error?.message || "Erreur lors du chargement du profil");
      })
      .finally(() => setIsLoading(false));

    // Reviews are secondary: a failure here must not blank the profile.
    getRatingsFor(id)
      .then(setRatings)
      .catch((error) => console.error("Error loading ratings:", error));
  }, [id]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
        <div className="text-gray-500">Chargement du profil...</div>
      </div>
    );
  }

  if (loadError || !profile) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="text-gray-500 mb-4">
          {loadError || "Profil introuvable"}
        </div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
    );
  }

  const availabilityStart = formatDate(profile.availability_start);
  const availabilityEnd = formatDate(profile.availability_end);

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-col sm:flex-row gap-6">
          <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0">
            {profile.profile_picture ? (
              <img
                src={profile.profile_picture}
                alt={profile.full_name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <User className="h-12 w-12" />
              </div>
            )}
          </div>

          <div className="flex-1">
            <h1 className="text-2xl font-bold text-olive-dark">{profile.full_name}</h1>

            {profile.preferred_regions?.length > 0 && (
              <div className="text-sm text-gray-600 mt-2 flex items-center">
                <MapPin className="h-4 w-4 mr-1" /> {profile.preferred_regions.join(", ")}
              </div>
            )}

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
              {profile.experience_years != null && (
                <span className="flex items-center">
                  <User className="h-4 w-4 mr-1" /> {profile.experience_years} ans d'expérience
                </span>
              )}
              {profile.rating != null && (
                <span className="flex items-center">
                  <ThumbsUp className="h-4 w-4 mr-1" /> {profile.rating}/5
                </span>
              )}
            </div>

            {profile.daily_rate != null && (
              <div className="font-semibold text-olive text-lg mt-3">
                {profile.daily_rate} TND/jour
              </div>
            )}
          </div>
        </div>

        {(availabilityStart || availabilityEnd) && (
          <div className="mt-6 flex items-center text-sm text-gray-600">
            <Calendar className="h-4 w-4 mr-2" />
            Disponible
            {availabilityStart && <> du {availabilityStart}</>}
            {availabilityEnd && <> au {availabilityEnd}</>}
          </div>
        )}

        {profile.skills?.length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">Compétences</h2>
            <div className="flex flex-wrap gap-2">
              {profile.skills.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        )}

        {profile.bio && (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">À propos</h2>
            <p className="text-gray-700 whitespace-pre-line">{profile.bio}</p>
          </div>
        )}

        <div className="mt-8">
          <Button
            className="bg-olive hover:bg-olive-dark"
            onClick={() => navigate(`/messages?user=${profile.id}`)}
          >
            <MessageCircle className="mr-2 h-4 w-4" /> Contacter
          </Button>
        </div>
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
                    <span className="text-xs text-gray-400">
                      {formatDate(rating.created_at)}
                    </span>
                  </div>

                  {rating.comment && (
                    <p className="text-gray-700 mt-2 whitespace-pre-line">{rating.comment}</p>
                  )}

                  {rating.response && (
                    <div className="mt-2 ml-4 p-3 bg-gray-50 rounded text-sm text-gray-700">
                      <span className="font-medium">Réponse : </span>
                      {rating.response}
                    </div>
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

export default HarvesterPublicProfile;
