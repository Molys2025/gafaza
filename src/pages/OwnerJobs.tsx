import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Loader2,
  Inbox,
  Users,
  CalendarDays,
  Eye,
} from "lucide-react";
import { getMyJobs, updateJobStatus, type JobRow, type JobStatus } from "@/services/jobService";
import { logger } from "@/lib/logger";

const STATUS_LABELS: Record<string, string> = {
  draft: "Brouillon",
  active: "En ligne",
  in_progress: "En cours",
  completed: "Terminée",
  cancelled: "Annulée",
  expired: "Expirée",
};

const STATUS_VARIANTS: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  draft: "outline",
  active: "default",
  in_progress: "secondary",
  completed: "secondary",
  cancelled: "destructive",
  expired: "outline",
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : null;

const OwnerJobs = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();

  const [jobs, setJobs] = useState<JobRow[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setJobs(await getMyJobs(user.id));
    } catch (error: unknown) {
      logger.error('Error loading own jobs', error);
      setLoadError("Erreur lors du chargement de vos annonces");
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleStatusChange = async (jobId: string, status: JobStatus) => {
    setUpdatingId(jobId);
    try {
      await updateJobStatus(jobId, status);
      toast({
        title: status === 'active' ? "Annonce publiée" : "Annonce mise à jour",
      });
      await load();
    } catch (error: unknown) {
      logger.error('Error updating job status', error);
      toast({
        title: "Erreur",
        description: "Le statut n'a pas pu être modifié.",
        variant: "destructive",
      });
    } finally {
      setUpdatingId(null);
    }
  };

  const totals = {
    active: jobs.filter(j => j.status === 'active').length,
    applications: jobs.reduce((sum, j) => sum + (j.applications_count ?? 0), 0),
    workers: jobs.reduce((sum, j) => sum + (j.workers_hired ?? 0), 0),
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-olive-dark mb-6">Mes annonces</h1>

      {!isLoading && !loadError && jobs.length > 0 && (
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-olive-dark">{totals.active}</div>
            <div className="text-sm text-gray-600">En ligne</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-olive-dark">{totals.applications}</div>
            <div className="text-sm text-gray-600">Candidature{totals.applications > 1 ? 's' : ''}</div>
          </div>
          <div className="bg-white rounded-lg shadow-md p-4">
            <div className="text-2xl font-bold text-olive-dark">{totals.workers}</div>
            <div className="text-sm text-gray-600">Cueilleur{totals.workers > 1 ? 's' : ''} recruté{totals.workers > 1 ? 's' : ''}</div>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex flex-col items-center justify-center py-16 bg-white rounded-lg shadow">
          <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
          <div className="text-gray-500">Chargement...</div>
        </div>
      ) : loadError ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <div className="text-red-600 mb-4">{loadError}</div>
          <Button variant="outline" onClick={load}>Réessayer</Button>
        </div>
      ) : jobs.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500 mb-2">Vous n'avez pas encore publié d'annonce</div>
          <Button
            className="bg-olive hover:bg-olive-dark mt-2"
            onClick={() => navigate('/owner-olive-trees')}
          >
            Publier une annonce
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {jobs.map((job) => {
            const status = job.status ?? 'draft';

            return (
              <div key={job.id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-lg text-olive-dark">{job.title}</h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                      <span className="flex items-center">
                        <CalendarDays className="h-3 w-3 mr-1" />
                        {formatDate(job.start_date)} — {formatDate(job.end_date)}
                      </span>
                      <span className="flex items-center">
                        <Users className="h-3 w-3 mr-1" />
                        {job.applications_count ?? 0} candidature{(job.applications_count ?? 0) > 1 ? 's' : ''}
                      </span>
                      <span className="flex items-center">
                        <Eye className="h-3 w-3 mr-1" />
                        {job.views_count ?? 0} vue{(job.views_count ?? 0) > 1 ? 's' : ''}
                      </span>
                    </div>
                  </div>

                  <Badge variant={STATUS_VARIANTS[status] ?? "secondary"}>
                    {STATUS_LABELS[status] ?? status}
                  </Badge>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => navigate(`/owner-jobs/${job.id}/applications`)}
                  >
                    Voir les candidatures
                  </Button>
                  <Button size="sm" variant="ghost" onClick={() => navigate(`/jobs/${job.id}`)}>
                    Aperçu public
                  </Button>

                  {status === 'draft' && (
                    <Button
                      size="sm"
                      className="bg-olive hover:bg-olive-dark"
                      onClick={() => handleStatusChange(job.id, 'active')}
                      disabled={updatingId === job.id}
                    >
                      {updatingId === job.id && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
                      Publier
                    </Button>
                  )}

                  {status === 'active' && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-red-600 border-red-200 hover:bg-red-50"
                      onClick={() => handleStatusChange(job.id, 'cancelled')}
                      disabled={updatingId === job.id}
                    >
                      Retirer l'annonce
                    </Button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OwnerJobs;
