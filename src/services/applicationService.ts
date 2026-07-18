import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';
import type { JobRow } from './jobService';

export type ApplicationRow = Database['public']['Tables']['applications']['Row'];
export type ApplicationStatus = Database['public']['Enums']['application_status'];

export interface ApplyToJobInput {
  jobId: string;
  coverLetter?: string;
  expectedSalary?: number | null;
  availabilityStart?: string | null;
  availabilityEnd?: string | null;
  contactPreference?: string | null;
  isTeamApplication?: boolean;
  teamSize?: number;
}

/** An application joined with the job it targets (job seeker view). */
export type ApplicationWithJob = ApplicationRow & { job: JobRow | null };

/**
 * Applies to a job on behalf of the signed-in job seeker.
 * RLS enforces that job_seeker_id is the caller and that their role is
 * job_seeker; a BEFORE INSERT trigger rejects closed or full jobs; a partial
 * unique index rejects a second active application on the same job.
 */
export const applyToJob = async (
  jobSeekerId: string,
  input: ApplyToJobInput,
): Promise<ApplicationRow> => {
  const { data, error } = await supabase
    .from('applications')
    .insert({
      job_id: input.jobId,
      job_seeker_id: jobSeekerId,
      cover_letter: input.coverLetter || null,
      expected_salary: input.expectedSalary ?? null,
      availability_start: input.availabilityStart || null,
      availability_end: input.availabilityEnd || null,
      contact_preference: input.contactPreference || null,
      is_team_application: input.isTeamApplication ?? false,
      team_size: input.teamSize ?? 1,
    })
    .select()
    .single();

  if (error) {
    console.error('Error applying to job:', error);

    // 23505 = unique violation on applications_job_seeker_active_uniq
    if (error.code === '23505') {
      throw new Error('Vous avez déjà candidaté à cette annonce.');
    }
    // Raised by check_job_availability()
    if (error.message?.includes('no longer accepting applications')) {
      throw new Error("Cette annonce n'accepte plus de candidatures.");
    }
    throw new Error(`Erreur lors de l'envoi de la candidature: ${error.message}`);
  }

  return data;
};

/** Active application of the caller on a given job, if any. */
export const getMyApplicationForJob = async (
  jobSeekerId: string,
  jobId: string,
): Promise<ApplicationRow | null> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .eq('job_seeker_id', jobSeekerId)
    .neq('status', 'withdrawn')
    .maybeSingle();

  if (error) {
    console.error('Error checking existing application:', error);
    throw new Error(`Erreur lors de la vérification de votre candidature: ${error.message}`);
  }

  return data;
};

/** Every application of the caller, with the job attached. */
export const getMyApplications = async (jobSeekerId: string): Promise<ApplicationWithJob[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_seeker_id', jobSeekerId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications:', error);
    throw new Error(`Erreur lors de la récupération de vos candidatures: ${error.message}`);
  }

  const applications = data || [];
  if (applications.length === 0) return [];

  // applications.job_id references jobs, but the jobs RLS only exposes active
  // rows to non-owners, so a job closed after applying simply comes back null.
  const jobIds = [...new Set(applications.map(a => a.job_id).filter(Boolean))] as string[];
  const { data: jobs, error: jobsError } = await supabase
    .from('jobs')
    .select('*')
    .in('id', jobIds);

  if (jobsError) {
    console.error('Error fetching jobs for applications:', jobsError);
    throw new Error(`Erreur lors de la récupération des annonces: ${jobsError.message}`);
  }

  const jobsById = new Map((jobs || []).map(j => [j.id, j]));

  return applications.map(a => ({
    ...a,
    job: a.job_id ? jobsById.get(a.job_id) ?? null : null,
  }));
};

/** Applications received on one of the caller's jobs (work provider view). */
export const getApplicationsForJob = async (jobId: string): Promise<ApplicationRow[]> => {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .eq('job_id', jobId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching applications for job:', error);
    throw new Error(`Erreur lors de la récupération des candidatures: ${error.message}`);
  }

  return data || [];
};

/** Work provider accepting / rejecting an application. */
export const respondToApplication = async (
  applicationId: string,
  status: Extract<ApplicationStatus, 'accepted' | 'rejected'>,
  providerResponse?: string,
): Promise<void> => {
  const { error } = await supabase
    .from('applications')
    .update({
      status,
      provider_response: providerResponse || null,
      responded_at: new Date().toISOString(),
    })
    .eq('id', applicationId);

  if (error) {
    console.error('Error responding to application:', error);
    throw new Error(`Erreur lors de la réponse à la candidature: ${error.message}`);
  }
};

/** Job seeker withdrawing their own application. */
export const withdrawApplication = async (applicationId: string): Promise<void> => {
  const { error } = await supabase
    .from('applications')
    .update({
      status: 'withdrawn',
      withdrawn_at: new Date().toISOString(),
    })
    .eq('id', applicationId);

  if (error) {
    console.error('Error withdrawing application:', error);
    throw new Error(`Erreur lors du retrait de la candidature: ${error.message}`);
  }
};
