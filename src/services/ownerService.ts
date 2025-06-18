
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
  business_name?: string;
  property_type?: string;
  property_size?: number;
  typical_daily_rate?: number;
  average_rating?: number;
  total_ratings?: number;
  verified?: boolean;
  city?: string;
  region?: string;
  created_at: string;
  // User data from users table
  full_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
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
      role: 'work_provider'
    });

  if (userError) {
    console.error('Error updating user:', userError);
    throw new Error(`Erreur lors de la mise à jour du profil utilisateur: ${userError.message}`);
  }

  // Then create the work provider profile
  const { error: ownerError } = await supabase
    .from('work_providers')
    .upsert({
      id: userId,
      business_name: data.company || data.fullName,
      property_address: data.location,
      business_type: 'Propriétaire d\'oliveraie'
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
    .from('work_providers')
    .select(`
      *,
      users (
        first_name,
        last_name,
        email,
        phone,
        whatsapp
      )
    `)
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error getting owner profile:', error);
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }

  if (!data) return null;

  // Transform the data to match our interface
  return {
    id: data.id,
    business_name: data.business_name,
    property_type: data.property_type,
    property_size: data.property_size,
    typical_daily_rate: data.typical_daily_rate,
    average_rating: data.average_rating,
    total_ratings: data.total_ratings,
    verified: data.verified,
    city: undefined, // Remove reference to non-existent property
    region: undefined, // Remove reference to non-existent property
    created_at: data.created_at,
    full_name: data.users ? `${data.users.first_name || ''} ${data.users.last_name || ''}`.trim() : undefined,
    email: data.users?.email,
    phone: data.users?.phone,
    whatsapp: data.users?.whatsapp
  };
};

export const updateOwnerProfile = async (userId: string, updates: Partial<OwnerData>) => {
  console.log('Updating owner profile for user:', userId);
  
  const { error } = await supabase
    .from('work_providers')
    .update({
      business_name: updates.company || updates.fullName,
      property_address: updates.location
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
    .from('work_providers')
    .select(`
      *,
      users (
        first_name,
        last_name,
        email,
        phone,
        whatsapp
      )
    `)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching owners:', error);
    throw new Error(`Erreur lors de la récupération des propriétaires: ${error.message}`);
  }

  console.log('Owners fetched:', data?.length || 0);
  
  return (data || []).map(item => ({
    id: item.id,
    business_name: item.business_name,
    property_type: item.property_type,
    property_size: item.property_size,
    typical_daily_rate: item.typical_daily_rate,
    average_rating: item.average_rating,
    total_ratings: item.total_ratings,
    verified: item.verified,
    city: undefined, // Remove reference to non-existent property
    region: undefined, // Remove reference to non-existent property
    created_at: item.created_at,
    full_name: item.users ? `${item.users.first_name || ''} ${item.users.last_name || ''}`.trim() : undefined,
    email: item.users?.email,
    phone: item.users?.phone,
    whatsapp: item.users?.whatsapp
  }));
};
