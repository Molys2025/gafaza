
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

/** Optional work_providers columns that can be seeded (e.g. from AI video onboarding). */
export interface OwnerPropertyExtras {
  property_size?: number | string | null;
  tree_count?: number | string | null;
  olive_types?: string[] | null;
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

export const createOwner = async (
  userId: string,
  data: OwnerData,
  extras?: OwnerPropertyExtras,
) => {
  console.log('Creating owner profile for user:', userId);

  // The public.users row is created by a DB trigger on auth.users insert.
  // We only update the mutable fields here (do NOT re-upsert / recreate it).
  const { error: userError } = await supabase
    .from('users')
    .update({
      first_name: data.fullName.split(' ')[0],
      last_name: data.fullName.split(' ').slice(1).join(' '),
      phone: data.phone,
      whatsapp: data.whatsapp,
      role: 'work_provider',
    })
    .eq('id', userId);

  if (userError) {
    console.error('Error updating user:', userError);
    throw new Error(`Erreur lors de la mise à jour du profil utilisateur: ${userError.message}`);
  }

  // Then create/refresh the work_provider profile
  const propertySize =
    extras?.property_size != null && extras.property_size !== ''
      ? Number(extras.property_size) || null
      : null;
  const treeCount =
    extras?.tree_count != null && extras.tree_count !== ''
      ? Number(extras.tree_count) || null
      : null;

  const { error: ownerError } = await supabase
    .from('work_providers')
    .upsert({
      id: userId,
      business_name: data.company || data.fullName,
      property_address: data.location,
      business_type: "Propriétaire d'oliveraie",
      property_size: propertySize,
      tree_count: treeCount,
      olive_types: extras?.olive_types ?? null,
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
    .select('*')
    .eq('id', userId)
    .single();

  if (error && error.code !== 'PGRST116') {
    console.error('Error getting owner profile:', error);
    throw new Error(`Erreur lors de la récupération du profil: ${error.message}`);
  }

  if (!data) return null;

  // work_providers.id référence auth.users : PostgREST ne peut plus embarquer
  // public.users, on récupère la ligne correspondante séparément.
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('first_name, last_name, email, phone, whatsapp')
    .eq('id', userId)
    .maybeSingle();

  if (userError) {
    console.error('Error getting owner user data:', userError);
    throw new Error(`Erreur lors de la récupération du profil: ${userError.message}`);
  }

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
    full_name: userData ? `${userData.first_name || ''} ${userData.last_name || ''}`.trim() : undefined,
    email: userData?.email ?? undefined,
    phone: userData?.phone ?? undefined,
    whatsapp: userData?.whatsapp ?? undefined
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
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching owners:', error);
    throw new Error(`Erreur lors de la récupération des propriétaires: ${error.message}`);
  }

  console.log('Owners fetched:', data?.length || 0);

  const owners = data || [];
  if (owners.length === 0) return [];

  // work_providers.id référence auth.users : PostgREST ne peut plus embarquer
  // public.users, on récupère les lignes correspondantes en une requête.
  const { data: usersData, error: usersError } = await supabase
    .from('users')
    .select('id, first_name, last_name, email, phone, whatsapp')
    .in('id', owners.map(o => o.id));

  if (usersError) {
    console.error('Error fetching owner user data:', usersError);
    throw new Error(`Erreur lors de la récupération des propriétaires: ${usersError.message}`);
  }

  const usersById = new Map((usersData || []).map(u => [u.id, u]));

  return owners.map(item => {
    const user = usersById.get(item.id);
    return {
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
      full_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : undefined,
      email: user?.email ?? undefined,
      phone: user?.phone ?? undefined,
      whatsapp: user?.whatsapp ?? undefined
    };
  });
};
