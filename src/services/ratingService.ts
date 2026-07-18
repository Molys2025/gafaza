import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';
import type { Database } from '@/integrations/supabase/types';

export type RatingRow = Database['public']['Tables']['ratings']['Row'];
export type RatingType = Database['public']['Enums']['rating_type'];

/** Score categories shown in the review form, per rated party. */
export const RATING_CRITERIA: Record<'work_provider' | 'job_seeker', { key: string; label: string }[]> = {
  work_provider: [
    { key: 'communication', label: 'Communication' },
    { key: 'payment', label: 'Ponctualité du paiement' },
    { key: 'facilities', label: 'Conditions sur place' },
  ],
  job_seeker: [
    { key: 'quality', label: 'Qualité du travail' },
    { key: 'punctuality', label: 'Ponctualité' },
    { key: 'professionalism', label: 'Professionnalisme' },
  ],
};

export interface CreateRatingInput {
  applicationId: string;
  jobId?: string | null;
  ratedId: string;
  ratingType: RatingType;
  /** overall is required by the validate_rating_scores trigger. */
  scores: { overall: number } & Record<string, number | null>;
  comment?: string;
}

/**
 * Publishes a review.
 * RLS only accepts it if the linked application is 'completed' and the author
 * is one of the two parties; a partial unique index limits it to one review
 * per (application, author).
 */
export const createRating = async (
  raterId: string,
  input: CreateRatingInput,
): Promise<RatingRow> => {
  const { data, error } = await supabase
    .from('ratings')
    .insert({
      rating_type: input.ratingType,
      application_id: input.applicationId,
      job_id: input.jobId ?? null,
      rater_id: raterId,
      rated_id: input.ratedId,
      scores: input.scores,
      comment: input.comment || null,
    })
    .select()
    .single();

  if (error) {
    logger.error('Error creating rating:', error);

    if (error.code === '23505') {
      throw new Error('Vous avez déjà évalué cette mission.');
    }
    if (error.code === '42501' || error.message?.includes('row-level security')) {
      throw new Error("L'évaluation n'est possible qu'une fois la mission terminée.");
    }
    if (error.message?.includes('between 1 and 5')) {
      throw new Error('Les notes doivent être comprises entre 1 et 5.');
    }
    throw new Error(`Erreur lors de l'envoi de l'évaluation: ${error.message}`);
  }

  return data;
};

/** Public reviews received by a user (hidden ones are filtered by RLS). */
export const getRatingsFor = async (ratedId: string): Promise<RatingRow[]> => {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('rated_id', ratedId)
    .eq('is_hidden', false)
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching ratings:', error);
    throw new Error(`Erreur lors de la récupération des évaluations: ${error.message}`);
  }

  return data || [];
};

/** The caller's review of a given application, if they already wrote one. */
export const getMyRatingForApplication = async (
  raterId: string,
  applicationId: string,
): Promise<RatingRow | null> => {
  const { data, error } = await supabase
    .from('ratings')
    .select('*')
    .eq('rater_id', raterId)
    .eq('application_id', applicationId)
    .maybeSingle();

  if (error) {
    logger.error('Error fetching own rating:', error);
    return null;
  }

  return data;
};

/** Reads the overall score out of the jsonb scores column. */
export const getOverallScore = (rating: RatingRow): number | null => {
  const scores = rating.scores as Record<string, unknown> | null;
  const overall = scores?.overall;
  return typeof overall === 'number' ? overall : null;
};
