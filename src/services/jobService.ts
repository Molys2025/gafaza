import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Database } from '@/integrations/supabase/types';

export type JobRow = Database['public']['Tables']['jobs']['Row'];
export type JobType = Database['public']['Enums']['job_type'];
export type JobPaymentType = Database['public']['Enums']['job_payment_type'];
export type JobStatus = Database['public']['Enums']['job_status'];

export interface CreateJobInput {
  title: string;
  description?: string;
  jobType?: JobType;
  startDate: string;
  endDate: string;
  workersNeeded: number;
  paymentType: JobPaymentType;
  paymentAmount: number;
  workingHours?: { start: string; end: string; break_time?: string; flexible?: boolean };
  facilities?: Record<string, boolean>;
  locationAddress?: string;
  region?: string;
  city?: string;
  treeCount?: number | null;
  oliveTypes?: string[] | null;
  applicationDeadline?: string | null;
  maxApplications?: number | null;
  /** Publish straight away, or keep as a draft the owner can finish later. */
  publish?: boolean;
}

/**
 * Creates a job for the signed-in work provider.
 * RLS ("Work providers can create jobs") enforces both that
 * work_provider_id is the caller and that their role is work_provider.
 */
export const createJob = async (workProviderId: string, input: CreateJobInput): Promise<JobRow> => {
  const publish = input.publish ?? true;

  const { data, error } = await supabase
    .from('jobs')
    .insert({
      work_provider_id: workProviderId,
      title: input.title,
      description: input.description || null,
      job_type: input.jobType ?? 'harvest',
      status: publish ? 'active' : 'draft',
      published_at: publish ? new Date().toISOString() : null,
      start_date: input.startDate,
      end_date: input.endDate,
      workers_needed: input.workersNeeded,
      payment_type: input.paymentType,
      payment_amount: input.paymentAmount,
      working_hours: input.workingHours ?? undefined,
      facilities: input.facilities ?? undefined,
      location_address: input.locationAddress || null,
      region: input.region || null,
      city: input.city || null,
      tree_count: input.treeCount ?? null,
      olive_types: input.oliveTypes ?? null,
      application_deadline: input.applicationDeadline || null,
      max_applications: input.maxApplications ?? null,
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating job:', error);
    throw new Error(`Erreur lors de la publication de l'annonce: ${error.message}`);
  }

  return data;
};

/** Active jobs, visible to everyone (including anonymous visitors) via RLS. */
export const getActiveJobs = async (filters?: {
  region?: string;
  jobType?: JobType;
  search?: string;
}): Promise<JobRow[]> => {
  let query = supabase
    .from('jobs')
    .select('*')
    .eq('status', 'active');

  if (filters?.region) {
    query = query.eq('region', filters.region);
  }
  if (filters?.jobType) {
    query = query.eq('job_type', filters.jobType);
  }
  if (filters?.search) {
    query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`);
  }

  const { data, error } = await query.order('published_at', { ascending: false, nullsFirst: false });

  if (error) {
    logger.error('Error fetching jobs:', error);
    throw new Error(`Erreur lors de la récupération des annonces: ${error.message}`);
  }

  return data || [];
};

export const getJobById = async (id: string): Promise<JobRow | null> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 = not found
    logger.error('Error fetching job:', error);
    throw new Error(`Erreur lors de la récupération de l'annonce: ${error.message}`);
  }

  return data;
};

/** Every job owned by the caller, drafts included. */
export const getMyJobs = async (workProviderId: string): Promise<JobRow[]> => {
  const { data, error } = await supabase
    .from('jobs')
    .select('*')
    .eq('work_provider_id', workProviderId)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching own jobs:', error);
    throw new Error(`Erreur lors de la récupération de vos annonces: ${error.message}`);
  }

  return data || [];
};

export const updateJobStatus = async (id: string, status: JobStatus): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .update({
      status,
      published_at: status === 'active' ? new Date().toISOString() : undefined,
      closed_at: ['completed', 'cancelled', 'expired'].includes(status)
        ? new Date().toISOString()
        : undefined,
    })
    .eq('id', id);

  if (error) {
    logger.error('Error updating job status:', error);
    throw new Error(`Erreur lors de la mise à jour de l'annonce: ${error.message}`);
  }
};

/** RLS only allows deleting one's own drafts; published jobs must be cancelled. */
export const deleteDraftJob = async (id: string): Promise<void> => {
  const { error } = await supabase
    .from('jobs')
    .delete()
    .eq('id', id);

  if (error) {
    logger.error('Error deleting job:', error);
    throw new Error(`Erreur lors de la suppression de l'annonce: ${error.message}`);
  }
};
