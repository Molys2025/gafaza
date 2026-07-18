import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Loader2,
  ArrowLeft,
  MapPin,
  Users,
  CalendarDays,
  Clock,
  Briefcase,
  TreeDeciduous,
  Check,
  X,
} from "lucide-react";
import { getJobById, type JobRow, type JobType } from "@/services/jobService";
import { getMyApplicationForJob, type ApplicationRow } from "@/services/applicationService";
import { useAuth } from "@/hooks/useAuth";
import { useProfile } from "@/hooks/useProfile";
import ApplyToJobDialog from "@/components/jobs/ApplyToJobDialog";

const JOB_TYPE_LABELS: Record<JobType, string> = {
  harvest: "Récolte",
  pruning: "Taille",
  maintenance: "Entretien",
  transport: "Transport",
  other: "Autre",
};

const PAYMENT_LABELS: Record<string, string> = {
  hourly: "par heure",
  daily: "par jour",
  fixed: "forfait",
  per_kg: "par kilo",
};

const FACILITY_LABELS: Record<string, string> = {
  water: "Eau potable",
  parking: "Parking",
  shelter: "Abri",
  restroom: "Sanitaires",
  tools_provided: "Outils fournis",
};

const formatDate = (value: string | null) =>
  value ? new Date(value).toLocaleDateString("fr-FR") : null;

/** working_hours and facilities are jsonb, so they arrive untyped. */
const asRecord = (value: unknown): Record<string, unknown> =>
  value && typeof value === "object" && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

const APPLICATION_STATUS_LABELS: Record<string, string> = {
  pending: "Candidature envoyée, en attente de réponse",
  accepted: "Candidature acceptée",
  rejected: "Candidature refusée",
  completed: "Mission terminée",
  cancelled: "Mission annulée",
};

const JobDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { profile } = useProfile();
  const [job, setJob] = useState<JobRow | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [application, setApplication] = useState<ApplicationRow | null>(null);
  const [applyOpen, setApplyOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    setLoadError(null);
    getJobById(id)
      .then(setJob)
      .catch((error: any) => {
        console.error("Error loading job:", error);
        setLoadError(error?.message || "Erreur lors du chargement de l'annonce");
      })
      .finally(() => setIsLoading(false));
  }, [id]);

  // Only job seekers can apply, so only they need the existing-application lookup.
  const isJobSeeker = profile?.role === 'job_seeker';

  const refreshApplication = useCallback(() => {
    if (!id || !user || !isJobSeeker) {
      setApplication(null);
      return;
    }
    getMyApplicationForJob(user.id, id)
      .then(setApplication)
      .catch((error) => console.error("Error loading own application:", error));
  }, [id, user, isJobSeeker]);

  useEffect(() => {
    refreshApplication();
  }, [refreshApplication]);

  if (isLoading) {
    return (
      <div className="container mx-auto py-16 px-4 flex flex-col items-center">
        <Loader2 className="h-8 w-8 animate-spin text-olive mb-3" />
        <div className="text-gray-500">Chargement de l'annonce...</div>
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

  const hours = asRecord(job.working_hours);
  const facilities = asRecord(job.facilities);
  const spotsLeft = Math.max(0, job.workers_needed - (job.workers_hired ?? 0));

  return (
    <div className="container mx-auto py-8 px-4 max-w-3xl">
      <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
        <ArrowLeft className="mr-2 h-4 w-4" /> Retour
      </Button>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <h1 className="text-2xl font-bold text-olive-dark">{job.title}</h1>
          <Badge variant="secondary" className="flex items-center gap-1">
            <Briefcase className="h-3 w-3" />
            {JOB_TYPE_LABELS[job.job_type]}
          </Badge>
        </div>

        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mt-4 text-sm text-gray-600">
          {(job.location_address || job.region) && (
            <span className="flex items-center">
              <MapPin className="h-4 w-4 mr-1" />
              {[job.location_address, job.city, job.region].filter(Boolean).join(", ")}
            </span>
          )}
          <span className="flex items-center">
            <CalendarDays className="h-4 w-4 mr-1" />
            Du {formatDate(job.start_date)} au {formatDate(job.end_date)}
            {job.flexible_dates && " (dates flexibles)"}
          </span>
          {hours.start && hours.end && (
            <span className="flex items-center">
              <Clock className="h-4 w-4 mr-1" />
              {String(hours.start)} — {String(hours.end)}
              {hours.break_time ? ` (pause ${String(hours.break_time)})` : ""}
            </span>
          )}
        </div>

        <div className="mt-6 grid gap-4 sm:grid-cols-3">
          <div className="p-4 bg-olive/5 rounded-lg">
            <div className="text-sm text-gray-500">Rémunération</div>
            <div className="font-semibold text-olive text-lg">
              {job.payment_amount} TND
            </div>
            <div className="text-sm text-gray-600">
              {PAYMENT_LABELS[job.payment_type] ?? job.payment_type}
            </div>
          </div>

          <div className="p-4 bg-olive/5 rounded-lg">
            <div className="text-sm text-gray-500">Cueilleurs recherchés</div>
            <div className="font-semibold text-olive-dark text-lg flex items-center">
              <Users className="h-4 w-4 mr-2" />
              {job.workers_needed}
            </div>
            <div className="text-sm text-gray-600">
              {spotsLeft > 0 ? `${spotsLeft} place${spotsLeft > 1 ? "s" : ""} restante${spotsLeft > 1 ? "s" : ""}` : "Complet"}
            </div>
          </div>

          <div className="p-4 bg-olive/5 rounded-lg">
            <div className="text-sm text-gray-500">Candidatures</div>
            <div className="font-semibold text-olive-dark text-lg">
              {job.applications_count ?? 0}
            </div>
            {job.application_deadline && (
              <div className="text-sm text-gray-600">
                Jusqu'au {formatDate(job.application_deadline)}
              </div>
            )}
          </div>
        </div>

        {job.description && (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">Description</h2>
            <p className="text-gray-700 whitespace-pre-line">{job.description}</p>
          </div>
        )}

        {(job.tree_count || job.olive_types?.length || job.property_size) && (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">La parcelle</h2>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm text-gray-600">
              {job.tree_count && (
                <span className="flex items-center">
                  <TreeDeciduous className="h-4 w-4 mr-1" /> {job.tree_count} oliviers
                </span>
              )}
              {job.property_size && <span>{job.property_size} hectares</span>}
              {job.olive_types?.length ? (
                <span>Variétés : {job.olive_types.join(", ")}</span>
              ) : null}
            </div>
          </div>
        )}

        {job.skills_required?.length ? (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">Compétences demandées</h2>
            <div className="flex flex-wrap gap-2">
              {job.skills_required.map((skill) => (
                <Badge key={skill} variant="secondary">{skill}</Badge>
              ))}
            </div>
          </div>
        ) : null}

        {Object.keys(facilities).length > 0 && (
          <div className="mt-6">
            <h2 className="font-semibold text-olive-dark mb-2">Sur place</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-sm">
              {Object.entries(FACILITY_LABELS).map(([key, label]) => (
                key in facilities ? (
                  <span key={key} className="flex items-center text-gray-700">
                    {facilities[key] ? (
                      <Check className="h-4 w-4 mr-2 text-olive" />
                    ) : (
                      <X className="h-4 w-4 mr-2 text-gray-400" />
                    )}
                    {label}
                  </span>
                ) : null
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 pt-6 border-t">
          {!user ? (
            <div className="flex flex-wrap items-center gap-3">
              <Button className="bg-olive hover:bg-olive-dark" onClick={() => navigate('/auth')}>
                Se connecter pour postuler
              </Button>
              <span className="text-sm text-gray-500">
                Créez un compte cueilleur en quelques secondes.
              </span>
            </div>
          ) : !isJobSeeker ? (
            <p className="text-sm text-gray-500">
              Seuls les comptes cueilleur peuvent postuler à une annonce.
            </p>
          ) : application ? (
            <div className="flex flex-wrap items-center gap-3">
              <Badge variant="secondary">
                {APPLICATION_STATUS_LABELS[application.status ?? 'pending'] ?? application.status}
              </Badge>
              <Button variant="outline" onClick={() => navigate('/my-applications')}>
                Voir mes candidatures
              </Button>
            </div>
          ) : job.status !== 'active' || spotsLeft === 0 ? (
            <Button className="bg-olive hover:bg-olive-dark" disabled>
              Cette annonce n'accepte plus de candidatures
            </Button>
          ) : (
            <Button className="bg-olive hover:bg-olive-dark" onClick={() => setApplyOpen(true)}>
              Postuler
            </Button>
          )}
        </div>
      </div>

      {user && isJobSeeker && (
        <ApplyToJobDialog
          job={job}
          jobSeekerId={user.id}
          open={applyOpen}
          onOpenChange={setApplyOpen}
          onApplied={refreshApplication}
        />
      )}
    </div>
  );
};

export default JobDetail;
