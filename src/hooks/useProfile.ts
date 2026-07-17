
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';
import { createOwner, type OwnerData } from '@/services/ownerService';
import { createHarvester, type HarvesterData } from '@/services/harvesterService';

type UserRole = 'work_provider' | 'job_seeker' | 'admin';
type UiUserType = 'owner' | 'harvester';

const roleToUserType = (role: UserRole): UiUserType | 'admin' =>
  role === 'work_provider' ? 'owner' : role === 'job_seeker' ? 'harvester' : 'admin';

const userTypeToRole = (t: UiUserType): 'work_provider' | 'job_seeker' =>
  t === 'owner' ? 'work_provider' : 'job_seeker';

export interface Profile {
  id: string;
  role: UserRole;
  /** UI-friendly alias for role: work_provider -> owner, job_seeker -> harvester */
  user_type: UiUserType | 'admin';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  whatsapp?: string;
  address?: string | null;
  created_at?: string;
  updated_at?: string;
}

export type OwnerProfileRow =
  import('@/integrations/supabase/types').Database['public']['Tables']['work_providers']['Row'];
export type HarvesterProfileRow =
  import('@/integrations/supabase/types').Database['public']['Tables']['job_seekers']['Row'];

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfileRow | null>(null);
  const [harvesterProfile, setHarvesterProfile] = useState<HarvesterProfileRow | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setProfile(null);
      setOwnerProfile(null);
      setHarvesterProfile(null);
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      const { data: userRow, error: userErr } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .maybeSingle();

      if (userErr) throw userErr;
      if (!userRow) {
        setProfile(null);
        return;
      }

      const role = userRow.role as UserRole;
      const typedProfile: Profile = {
        id: userRow.id,
        role,
        user_type: roleToUserType(role),
        first_name: userRow.first_name ?? undefined,
        last_name: userRow.last_name ?? undefined,
        email: userRow.email,
        phone: userRow.phone ?? undefined,
        whatsapp: userRow.whatsapp ?? undefined,
        address: userRow.address,
        created_at: userRow.created_at,
        updated_at: userRow.updated_at,
      };
      setProfile(typedProfile);

      if (role === 'work_provider') {
        const { data, error } = await supabase
          .from('work_providers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) console.error('Error fetching work_provider:', error);
        setOwnerProfile(data ?? null);
        setHarvesterProfile(null);
      } else if (role === 'job_seeker') {
        const { data, error } = await supabase
          .from('job_seekers')
          .select('*')
          .eq('id', user.id)
          .maybeSingle();
        if (error) console.error('Error fetching job_seeker:', error);
        setHarvesterProfile(data ?? null);
        setOwnerProfile(null);
      }
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de charger le profil',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  /**
   * Create/complete the detail profile (work_providers or job_seekers) for the current user.
   * The `public.users` row is created by a DB trigger at sign-up; we only update its role
   * here (in case the user picked their type after sign-up) and populate the detail table.
   */
  const createProfile = async (userType: 'owner' | 'harvester', additionalData?: any) => {
    if (!user) return false;

    try {
      setLoading(true);

      const p = additionalData?.personal_info ?? {};
      const fullName: string =
        p.name ??
        [additionalData?.first_name, additionalData?.last_name].filter(Boolean).join(' ') ??
        user.email ??
        '';

      if (userType === 'owner') {
        const prop = additionalData?.property_info ?? {};
        const data: OwnerData = {
          fullName: fullName || (user.email ?? ''),
          email: user.email ?? '',
          phone: additionalData?.phone ?? '',
          whatsapp: additionalData?.whatsapp,
          company: prop.business_name,
          location: prop.property_address ?? p.location ?? '',
          description: additionalData?.additional_info?.special_notes,
        };
        await createOwner(user.id, data, {
          property_size: prop.property_size,
          tree_count: prop.tree_count,
          olive_types: prop.olive_types,
        });
      } else {
        const s = additionalData?.skills_and_services ?? {};
        const data: HarvesterData = {
          fullName: fullName || (user.email ?? ''),
          email: user.email ?? '',
          phone: additionalData?.phone ?? '',
          whatsapp: additionalData?.whatsapp,
          experience: Number(p.experience_years) || 0,
          skills: s.specializations ?? [],
          availabilityStart: '',
          availabilityEnd: '',
          preferredRegions: additionalData?.work_preferences?.preferred_regions ?? [],
          dailyRate: Number(s.daily_rate) || 0,
          additionalInfo: additionalData?.additional_info?.special_notes,
        };
        await createHarvester(user.id, data);
      }

      await fetchProfile();

      toast({
        title: 'Profil créé',
        description: additionalData
          ? "Votre profil a été créé automatiquement grâce à l'IA !"
          : 'Votre profil a été créé avec succès',
      });

      return true;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Erreur',
        description: error?.message ?? 'Impossible de créer le profil',
        variant: 'destructive',
      });
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user || !profile) return false;

    try {
      const patch: Record<string, unknown> = {};
      if (updates.first_name !== undefined) patch.first_name = updates.first_name;
      if (updates.last_name !== undefined) patch.last_name = updates.last_name;
      if (updates.phone !== undefined) patch.phone = updates.phone;
      if (updates.whatsapp !== undefined) patch.whatsapp = updates.whatsapp;
      if (updates.address !== undefined) patch.address = updates.address;
      if (updates.user_type && updates.user_type !== 'admin') {
        patch.role = userTypeToRole(updates.user_type);
      }
      if (updates.role) patch.role = updates.role;

      const { error } = await supabase
        .from('users')
        .update(patch as never)
        .eq('id', user.id);

      if (error) throw error;

      setProfile({ ...profile, ...updates });
      
      toast({
        title: 'Profil mis à jour',
        description: 'Vos modifications ont été sauvegardées',
      });

      return true;
    } catch (error: any) {
      console.error('Error updating profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de mettre à jour le profil',
        variant: 'destructive',
      });
      return false;
    }
  };

  return {
    profile,
    ownerProfile,
    harvesterProfile,
    loading,
    createProfile,
    updateProfile,
    refetch: fetchProfile,
    /** True when the detail profile row (work_providers/job_seekers) is present */
    hasDetailProfile: !!(ownerProfile || harvesterProfile),
  };
};
