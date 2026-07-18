
import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

export interface HarvesterProfile {
  id: string;
  full_name: string;
  phone: string;
  whatsapp?: string;
  experience_years: number;
  skills: string[];
  availability_start: string;
  availability_end: string;
  preferred_regions: string[];
  daily_rate: number;
  bio?: string;
  profile_picture?: string;
  rating?: number;
  reviews_count?: number;
  location?: string;
}

export const getAllHarvesters = async (): Promise<HarvesterProfile[]> => {
  logger.debug('Fetching all harvesters...');
  
  const { data, error } = await supabase
    .from('job_seekers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    logger.error('Error fetching harvesters:', error);
    throw new Error(`Erreur lors de la récupération des cueilleurs: ${error.message}`);
  }

  logger.debug('Harvesters fetched', { count: data?.length || 0 });
  return data || [];
};

export const searchHarvesters = async (searchTerm: string, filters?: {
  region?: string;
  experience?: string;
  availability?: string;
}): Promise<HarvesterProfile[]> => {
  logger.debug('Searching harvesters', { searchTerm, filters });
  
  let query = supabase
    .from('job_seekers')
    .select('*');

  // Add search term filter
  if (searchTerm) {
    query = query.or(`full_name.ilike.%${searchTerm}%,preferred_regions.cs.{${searchTerm}}`);
  }

  // Add region filter
  if (filters?.region) {
    query = query.contains('preferred_regions', [filters.region]);
  }

  // Add experience filter
  if (filters?.experience) {
    switch (filters.experience) {
      case '0-2':
        query = query.lte('experience_years', 2);
        break;
      case '2-5':
        query = query.gte('experience_years', 2).lte('experience_years', 5);
        break;
      case '5+':
        query = query.gte('experience_years', 5);
        break;
    }
  }

  query = query.order('created_at', { ascending: false });

  const { data, error } = await query;

  if (error) {
    logger.error('Error searching harvesters:', error);
    throw new Error(`Erreur lors de la recherche: ${error.message}`);
  }

  return data || [];
};

export const getHarvesterById = async (id: string): Promise<HarvesterProfile | null> => {
  logger.debug('Fetching harvester by id', { id });
  
  const { data, error } = await supabase
    .from('job_seekers')
    .select('*')
    .eq('id', id)
    .single();

  if (error && error.code !== 'PGRST116') {
    logger.error('Error fetching harvester:', error);
    throw new Error(`Erreur lors de la récupération du cueilleur: ${error.message}`);
  }

  return data;
};
