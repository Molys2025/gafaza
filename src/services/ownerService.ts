
import { supabase } from '@/integrations/supabase/client';

export interface OwnerData {
  fullName: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
  location: string;
  description?: string;
}

export interface OwnerProfile {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  company?: string;
  location: string;
  description?: string;
  profile_picture?: string;
  created_at: string;
}

export const createOwner = async (userId: string, data: OwnerData) => {
  console.log('Creating owner profile for user:', userId);
  
  // First, update the user's basic information and role
  const { error: userError } = await supabase
    .from('users')
    .upsert({
      id: userId,
      first_name: data.fullName.split(' ')[0],
      last_name: data.fullName.split(' ').slice(1).join(' '),
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      role: 'land_owner'
    });

  if (userError) {
    console.error('Error updating user:', userError);
    throw new Error(`Erreur lors de la mise à jour du profil utilisateur: ${userError.message}`);
  }

  // Then create the land owner profile
  const { error: ownerError } = await supabase
    .from('land_owners')
    .upsert({
      id: userId,
      full_name: data.fullName,
      email: data.email,
      phone: data.phone,
      whatsapp: data.whatsapp,
      company: data.company,
      location: data.location,
      description: data.description
    });

  if (ownerError) {
    console.error('Error creating owner profile:', ownerError);
    throw new Error(`Erreur lors de la création du profil propriétaire: ${ownerError.message}`);
  }

  console.log('Owner profile created successfully');
};

export const getOwnerProfile = async (userId: string): Promise<OwnerProfile | null> => {
  console.log('Getting owner profile for user:', userId);
  
  const { data, error } = await supabase
    .from('land_owners')
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error getting owner profile:', error);
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }

  return data;
};

export const updateOwnerProfile = async (userId: string, updates: Partial<OwnerData>) => {
  console.log('Updating owner profile for user:', userId);
  
  const { error } = await supabase
    .from('land_owners')
    .update({
      full_name: updates.fullName,
      email: updates.email,
      phone: updates.phone,
      whatsapp: updates.whatsapp,
      company: updates.company,
      location: updates.location,
      description: updates.description
    })
    .eq('id', userId);

  if (error) {
    console.error('Error updating owner profile:', error);
    throw new Error(`Erreur lors de la mise à jour du profil: ${error.message}`);
  }

  console.log('Owner profile updated successfully');
};

export const getAllOwners = async (): Promise<OwnerProfile[]> => {
  console.log('Fetching all owners...');
  
  const { data, error } = await supabase
    .from('land_owners')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching owners:', error);
    throw new Error(`Erreur lors de la récupération des propriétaires: ${error.message}`);
  }

  console.log('Owners fetched:', data?.length || 0);
  return data || [];
};
