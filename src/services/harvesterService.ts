import { supabase } from '@/integrations/supabase/client';

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
  console.log('Creating harvester profile for user:', userId, data);
  
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
      console.error('Error updating user:', userError);
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
        availability_start: data.availabilityStart,
        availability_end: data.availabilityEnd,
        preferred_regions: data.preferredRegions,
        daily_rate: data.dailyRate,
        bio: data.additionalInfo
      });

    if (harvesterError) {
      console.error('Error creating harvester profile:', harvesterError);
      throw harvesterError;
    }

    console.log('Harvester profile created successfully');
    return { success: true };
  } catch (error) {
    console.error('Error in createHarvester:', error);
    throw error;
  }
};

export const uploadProfilePicture = async (userId: string, file: File) => {
  console.log('Uploading profile picture for user:', userId);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/profile.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('avatars')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading profile picture:', uploadError);
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
    console.error('Error updating profile picture URL:', updateError);
    throw new Error(`Erreur lors de la mise à jour de l'URL de la photo: ${updateError.message}`);
  }

  // Also update the job seeker profile
  const { error: jobSeekerUpdateError } = await supabase
    .from('job_seekers')
    .update({ profile_picture: publicUrl })
    .eq('id', userId);

  if (jobSeekerUpdateError) {
    console.error('Error updating job seeker profile picture:', jobSeekerUpdateError);
    // Don't throw here as the main upload succeeded
  }

  console.log('Profile picture uploaded successfully');
};

export const uploadIdCard = async (userId: string, file: File) => {
  console.log('Uploading ID card for user:', userId);
  
  const fileExt = file.name.split('.').pop();
  const fileName = `${userId}/id_card.${fileExt}`;
  
  const { error: uploadError } = await supabase.storage
    .from('documents')
    .upload(fileName, file, {
      upsert: true,
    });

  if (uploadError) {
    console.error('Error uploading ID card:', uploadError);
    throw new Error(`Erreur lors du téléchargement de la carte d'identité: ${uploadError.message}`);
  }

  console.log('ID card uploaded successfully');
};

export const getHarvesterProfile = async (userId: string) => {
  console.log('Getting harvester profile for user:', userId);
  
  const { data, error } = await supabase
    .from('job_seekers')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') { // PGRST116 is "not found"
    console.error('Error getting harvester profile:', error);
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }

  return data;
};

export const updateHarvesterProfile = async (userId: string, updates: Partial<HarvesterData>) => {
  console.log('Updating harvester profile for user:', userId);
  
  const { error } = await supabase
    .from('job_seekers')
    .update({
      full_name: updates.fullName,
      phone: updates.phone,
      whatsapp: updates.whatsapp,
      experience_years: updates.experience,
      skills: updates.skills,
      availability_start: updates.availabilityStart,
      availability_end: updates.availabilityEnd,
      preferred_regions: updates.preferredRegions,
      daily_rate: updates.dailyRate,
      bio: updates.additionalInfo
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating harvester profile:', error);
    throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
  }

  console.log('Harvester profile updated successfully');
};
