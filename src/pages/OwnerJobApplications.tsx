import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  Loader2,
  ArrowLeft,
  Inbox,
  User,
  ThumbsUp,
  CalendarDays,
  MapPin,
} from "lucide-react";
import { getJobById, type JobRow } from "@/services/jobService";
import {
  getApplicationsForJob,
  respondToApplication,
  completeApplication,
  type ApplicationRow,
} from "@/services/applicationService";
import { getHarvesterById, type HarvesterProfile } from "@/services/harvesterListService";
import { getMyRatingForApplication } from "@/services/ratingService";
import { useAuth } from "@/hooks/useAuth";
import RatingDialog from "@/components/ratings/RatingDialog";

const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  accepted: "Acceptée",
  rejected: "Refusée",
  withdrawn: "Retirée",
  completed: "Terminée",
  cancelled: "Annulée",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  pending: "secondary",
  accepted: "default",
  rejected: "destructive",
  withdrawn: "outline",
  completed: "default",
  cancelled: "outline",
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : null;

const OwnerJobApplications = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [job, setJob] = useState<JobRow | null>(null);
  const [applications, setApplications] = useState<ApplicationRow[]>([]);
  const [seekers, setSeekers] = useState<Record<string, HarvesterProfile>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [responses, setResponses] = useState<Record<string, string>>({});
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [ratedApplicationIds, setRatedApplicationIds] = useState<Set<string>>(new Set());
  const [ratingTarget, setRatingTarget] = useState<ApplicationRow | null>(null);
  const { user } = useAuth();

  const load = useCallback(async () => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      const [jobData, applicationsData] = await Promise.all([
        getJobById(id),
        getApplicationsForJob(id),
      ]);
      setJob(jobData);
      setApplications(applicationsData);

      // Applicant profiles: job_seekers rows are readable when active, so a
      // missing one simply renders as an unnamed applicant.
      const seekerIds = [...new Set(applicationsData.map(a => a.job_seeker_id).filter(Boolean))] as string[];
      const profiles = await Promise.all(
        seekerIds.map(seekerId => getHarvesterById(seekerId).catch(() => null)),
      );
      setSeekers(
        Object.fromEntries(
          profiles.filter((p): p is HarvesterProfile => Boolean(p)).map(p => [p.id, p]),
        ),
      );

      // Which completed missions the owner has already reviewed.
      if (user) {
        const completed = applicationsData.filter(a => a.status === 'completed');
        const existing = await Promise.all(
          completed.map(a =>
            getMyRatingForApplication(user.id, a.id).then(r => (r ? a.id : null)),
          ),
        );
        setRatedApplicationIds(new Set(existing.filter(Boolean) as string[]));
      }
    } catch (error: any) {
      console.error("Error loading job applications:", error);
      setLoadError(error?.message || "Erreur lors du chargement des candidatures");
    } finally {
      setIsLoading(false);
    }
  }, [id, user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleComplete = async (applicationId: string) => {
    setRespondingId(applicationId);
    try {
      await completeApplication(applicationId);
      toast({
        title: "Mission clôturée",
        description: "Vous pouvez maintenant évaluer le cueilleur.",
      });
      await load();
    } catch (error: any) {
      console.error("Error completing application:", error);
      toast({
        title: "Erreur",
        description: error?.message || "La mission n'a pas pu être clôturée.",
        variant: "destructive",
      });
    } finally {
      setRespondingId(null);
    }
  };

  const handleRespond = async (
    applicationId: string,
    status: 'accepted' | 'rejected',
  ) => {
    setRespondingId(applicationId);
    try {
      await respondToApplication(applicationId, status, responses[applicationId]);
      toast({
        title: status === 'accepted' ? "Candidature acceptée" : "Candidature refusée",
        description: "Le cueilleur peut consulter votre réponse.",
      });
      await load();
    } catch (error: any) {
      console.error("Error responding to application:", error);
      toast({
        title: "Erreur",
        description: error?.message || "La réponse n'a pas pu être enregistrée.",
        variant: "destructive",
      });
    } finally {
      setRespondingId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
        <div className="text-gray-500">Chargement des candidatures...</div>
      </div>
    );
  }

  if (loadError || !job) {
    return (
      <div className="container mx-auto py-16 px-4 text-center">
        <div className="text-gray-500 mb-4">{loadError || "Annonce introuvable"}</div>
        <Button variant="outline" onClick={() => navigate(-1)}>
          <ArrowLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <h1 className="text-2xl font-bold text-olive-dark">{job.title}</h1>
      <p className="text-gray-600 mt-1 mb-6">
        {applications.length} candidature{applications.length > 1 ? "s" : ""} ·{" "}
        {job.workers_needed} cueilleur{job.workers_needed > 1 ? "s" : ""} recherché
        {job.workers_needed > 1 ? "s" : ""}
      </p>

      {applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500">Aucune candidature pour le moment</div>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const seeker = application.job_seeker_id ? seekers[application.job_seeker_id] : null;
            const status = application.status ?? 'pending';

            return (
              <div key={application.id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex gap-4">
                    <div className="w-14 h-14 bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                      {seeker?.profile_picture ? (
                        <img
                          src={seeker.profile_picture}
                          alt={seeker.full_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                          <User className="h-6 w-6" />
                        </div>
                      )}
                    </div>

                    <div>
                      <h2 className="font-semibold text-olive-dark">
                        {seeker?.full_name ?? "Cueilleur"}
                      </h2>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1 text-sm text-gray-600">
                        {seeker?.experience_years != null && (
                          <span className="flex items-center">
                            <User className="h-3 w-3 mr-1" /> {seeker.experience_years} ans d'expérience
                          </span>
                        )}
                        {seeker?.rating != null && seeker.rating > 0 && (
                          <span className="flex items-center">
                            <ThumbsUp className="h-3 w-3 mr-1" /> {seeker.rating}/5
                          </span>
                        )}
                        {seeker?.preferred_regions?.length ? (
                          <span className="flex items-center">
                            <MapPin className="h-3 w-3 mr-1" /> {seeker.preferred_regions.join(", ")}
                          </span>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <Badge variant={STATUS_VARIANTS[status] ?? "secondary"}>
                    {STATUS_LABELS[status] ?? status}
                  </Badge>
                </div>

                {application.cover_letter && (
                  <p className="text-gray-700 mt-4 whitespace-pre-line">{application.cover_letter}</p>
                )}

                <div className="flex flex-wrap items-center gap-x-5 gap-y-1 mt-3 text-sm text-gray-600">
                  {application.expected_salary != null && (
                    <span>Tarif demandé : {application.expected_salary} TND</span>
                  )}
                  {(application.availability_start || application.availability_end) && (
                    <span className="flex items-center">
                      <CalendarDays className="h-3 w-3 mr-1" />
                      {formatDate(application.availability_start)} — {formatDate(application.availability_end)}
                    </span>
                  )}
                </div>

                {status === 'pending' ? (
                  <div className="mt-4 space-y-3">
                    <Textarea
                      placeholder="Message de réponse (facultatif)"
                      value={responses[application.id] ?? ""}
                      onChange={(e) =>
                        setResponses(prev => ({ ...prev, [application.id]: e.target.value }))
                      }
                      rows={2}
                    />
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-olive hover:bg-olive-dark"
                        onClick={() => handleRespond(application.id, 'accepted')}
                        disabled={respondingId === application.id}
                      >
                        {respondingId === application.id && (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        Accepter
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleRespond(application.id, 'rejected')}
                        disabled={respondingId === application.id}
                      >
                        Refuser
                      </Button>
                      {application.job_seeker_id && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => navigate(`/harvester/${application.job_seeker_id}`)}
                          >
                            Voir le profil
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() =>
                              navigate(`/messages?user=${application.job_seeker_id}&job=${job.id}`)
                            }
                          >
                            Contacter
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                ) : (
                  <>
                    {application.provider_response && (
                      <div className="mt-3 p-3 bg-olive/5 rounded text-sm text-gray-700">
                        <span className="font-medium">Votre réponse : </span>
                        {application.provider_response}
                      </div>
                    )}

                    {status === 'accepted' && (
                      <div className="mt-4">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleComplete(application.id)}
                          disabled={respondingId === application.id}
                        >
                          {respondingId === application.id && (
                            <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                          )}
                          Clôturer la mission
                        </Button>
                      </div>
                    )}

                    {status === 'completed' && (
                      <div className="mt-4">
                        {ratedApplicationIds.has(application.id) ? (
                          <span className="text-sm text-gray-500">
                            Vous avez évalué ce cueilleur.
                          </span>
                        ) : (
                          <Button
                            size="sm"
                            className="bg-olive hover:bg-olive-dark"
                            onClick={() => setRatingTarget(application)}
                          >
                            Évaluer le cueilleur
                          </Button>
                        )}
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}

      {user && ratingTarget?.job_seeker_id && (
        <RatingDialog
          open={Boolean(ratingTarget)}
          onOpenChange={(open) => !open && setRatingTarget(null)}
          raterId={user.id}
          ratedId={ratingTarget.job_seeker_id}
          ratedName={seekers[ratingTarget.job_seeker_id]?.full_name ?? "ce cueilleur"}
          applicationId={ratingTarget.id}
          jobId={job.id}
          ratingType="job_seeker"
          onRated={load}
        />
      )}
    </div>
  );
};

export default OwnerJobApplications;
