import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import {
  Loader2,
  CalendarDays,
  MapPin,
  Briefcase,
  Inbox,
} from "lucide-react";
import {
  getMyApplications,
  withdrawApplication,
  type ApplicationWithJob,
} from "@/services/applicationService";

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

const MyApplications = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [applications, setApplications] = useState<ApplicationWithJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [withdrawingId, setWithdrawingId] = useState<string | null>(null);

  const load = useCallback(async () => {
    if (!user) return;
    setIsLoading(true);
    setLoadError(null);
    try {
      setApplications(await getMyApplications(user.id));
    } catch (error: any) {
      console.error("Error loading applications:", error);
      setLoadError(error?.message || "Erreur lors du chargement de vos candidatures");
      setApplications([]);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    load();
  }, [load]);

  const handleWithdraw = async (applicationId: string) => {
    setWithdrawingId(applicationId);
    try {
      await withdrawApplication(applicationId);
      toast({
        title: "Candidature retirée",
        description: "Vous pouvez candidater à nouveau si vous changez d'avis.",
      });
      await load();
    } catch (error: any) {
      console.error("Error withdrawing application:", error);
      toast({
        title: "Erreur",
        description: error?.message || "Le retrait de la candidature a échoué.",
        variant: "destructive",
      });
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <div className="container mx-auto py-8 px-4 max-w-4xl">
      <h1 className="text-3xl font-bold text-olive-dark mb-2">Mes candidatures</h1>
      <p className="text-gray-600 mb-6">Suivez l'état de vos demandes auprès des propriétaires.</p>

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
      ) : applications.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-lg shadow">
          <Inbox className="h-10 w-10 text-gray-300 mx-auto mb-3" />
          <div className="text-gray-500 mb-2">Aucune candidature pour le moment</div>
          <Button className="bg-olive hover:bg-olive-dark mt-2" onClick={() => navigate('/jobs')}>
            Parcourir les annonces
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {applications.map((application) => {
            const job = application.job;
            const status = application.status ?? 'pending';

            return (
              <div key={application.id} className="bg-white p-5 rounded-lg shadow-md">
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div>
                    <h2 className="font-semibold text-lg text-olive-dark">
                      {job?.title ?? "Annonce non disponible"}
                    </h2>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-sm text-gray-600">
                      {job?.location_address || job?.region ? (
                        <span className="flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {job.location_address || job.region}
                        </span>
                      ) : null}
                      {job && (
                        <span className="flex items-center">
                          <CalendarDays className="h-3 w-3 mr-1" />
                          {formatDate(job.start_date)} — {formatDate(job.end_date)}
                        </span>
                      )}
                      <span className="flex items-center">
                        <Briefcase className="h-3 w-3 mr-1" />
                        Envoyée le {formatDate(application.created_at)}
                      </span>
                    </div>
                  </div>

                  <Badge variant={STATUS_VARIANTS[status] ?? "secondary"}>
                    {STATUS_LABELS[status] ?? status}
                  </Badge>
                </div>

                {application.provider_response && (
                  <div className="mt-3 p-3 bg-olive/5 rounded text-sm text-gray-700">
                    <span className="font-medium">Réponse du propriétaire : </span>
                    {application.provider_response}
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                  <div className="text-sm text-gray-600">
                    {application.expected_salary != null && (
                      <>Tarif demandé : {application.expected_salary} TND</>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {job && (
                      <Button size="sm" variant="outline" onClick={() => navigate(`/jobs/${job.id}`)}>
                        Voir l'annonce
                      </Button>
                    )}
                    {status === 'pending' && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-600 border-red-200 hover:bg-red-50"
                        onClick={() => handleWithdraw(application.id)}
                        disabled={withdrawingId === application.id}
                      >
                        {withdrawingId === application.id && (
                          <Loader2 className="mr-2 h-3 w-3 animate-spin" />
                        )}
                        Retirer
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyApplications;
