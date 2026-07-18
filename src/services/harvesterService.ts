import { supabase } from '@/integrations/supabase/client';
import { logger } from '@/lib/logger';

// Postgres rejects '' for date columns; empty form values must become null.
const toDateOrNull = (value: string | null | undefined): string | null =>
  value ? value : null;

export interface HarvesterData {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  experience: number;
  skills: string[];
  availabilityStart: string;
  availabilityEnd: string;
  preferredRegions: string[];
  dailyRate: number;
  references?: string;
  additionalInfo?: string;
}

export const createHarvester = async (userId: string, data: HarvesterData) => {
  logger.debug('Creating harvester profile', { userId });
  
  try {
    // public.users row is created by a DB trigger on sign-up.
    // Only update the mutable fields here.
    const { error: userError } = await supabase
      .from('users')
      .update({
        first_name: data.fullName.split(' ')[0],
        last_name: data.fullName.split(' ').slice(1).join(' '),
        phone: data.phone,
        whatsapp: data.whatsapp,
        role: 'job_seeker',
      })
      .eq('id', userId);

    if (userError) {
      logger.error('Error updating user:', userError);
      throw userError;
    }

    // Then create the job seeker profile
    const { error: harvesterError } = await supabase
      .from('job_seekers')
      .upsert({
        id: userId,
        full_name: data.fullName,
        phone: data.phone,
        whatsapp: data.whatsapp,
        experience_years: data.experience,
        skills: data.skills,
        availability_start: toDateOrNull(data.availabilityStart),
        availability_end: toDateOrNull(data.availabilityEnd),
        preferred_regions: data.preferredRegions,
        daily_rate: data.dailyRate,
        bio: data.additionalInfo
      });

    if (harvesterError) {
      logger.error('Error creating harvester profile:', harvesterError);
      throw harvesterError;
    }

    logger.debug('Harvester profile created successfully');
    return { success: true };
  } catch (error) {
    logger.error('Error in createHarvester:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId: string, file: File) => {
  logger.debug('Uploading profile picture', { userId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    logger.error('Error uploading profile picture:', uploadError);
    throw new Error(`Erreur lors du téléchargement de la photo: ${uploadError.message}`);
  }

  // Get the public URL
  const { data: { publicUrl } } = supabase.storage
    .from('avatars')
    .getPublicUrl(fileName);

  // Update user profile with the image URL
  const { error: updateError } = await supabase
    .from('users')
    .update({ profile_picture: publicUrl })
    .eq('id', userId);

  if (updateError) {
    logger.error('Error updating profile picture URL:', updateError);
    throw new Error(`Erreur lors de la mise à jour de l'URL de la photo: ${updateError.message}`);
  }

  // Also update the job seeker profile
  const { error: jobSeekerUpdateError } = await supabase
    .from('job_seekers')
    .update({ profile_picture: publicUrl })
    .eq('id', userId);

  if (jobSeekerUpdateError) {
    logger.error('Error updating job seeker profile picture:', jobSeekerUpdateError);
    // Don't throw here as the main upload succeeded
  }

  logger.debug('Profile picture uploaded successfully');
};

export const uploadIdCard = async (userId: string, file: File) => {
  logger.debug('Uploading ID card', { userId });
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/id_card.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    logger.error('Error uploading ID card:', uploadError);
    throw new Error(`Erreur lors du téléchargement de la carte d'identité: ${uploadError.message}`);
  }

  logger.debug('ID card uploaded successfully');
};

export const getHarvesterProfile = async (userId: string) => {
  logger.debug('Getting harvester profile', { userId });
  
  const { data, error } = await supabase
    .from('job_seekers')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    logger.error('Error getting harvester profile:', error);
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }

  return data;
};

export const updateHarvesterProfile = async (userId: string, updates: Partial<HarvesterData>) => {
  logger.debug('Updating harvester profile', { userId });
  
  const { error } = await supabase
    .from('job_seekers')
    .update({
      full_name: updates.fullName,
      phone: updates.phone,
      whatsapp: updates.whatsapp,
      experience_years: updates.experience,
      skills: updates.skills,
      // undefined = champ non fourni (ignoré par supabase-js), '' = à effacer -> null
      availability_start: updates.availabilityStart === undefined ? undefined : toDateOrNull(updates.availabilityStart),
      availability_end: updates.availabilityEnd === undefined ? undefined : toDateOrNull(updates.availabilityEnd),
      preferred_regions: updates.preferredRegions,
      daily_rate: updates.dailyRate,
      bio: updates.additionalInfo
    })
    .eq('id', userId);

  if (error) {
    logger.error('Error updating harvester profile:', error);
    throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
  }

  logger.debug('Harvester profile updated successfully');
};
