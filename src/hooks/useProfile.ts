
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface Profile {
  id: string;
  user_type: 'owner' | 'harvester';
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  created_at: string;
  updated_at: string;
}

export interface OwnerProfile {
  id: string;
  experience_years?: number;
  olive_trees_count?: number;
  grove_location?: string;
  grove_size_hectares?: number;
}

export interface HarvesterProfile {
  id: string;
  experience_years?: number;
  specializations?: string[];
  equipment_owned?: string[];
  availability_radius_km?: number;
  hourly_rate?: number;
}

export const useProfile = () => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [ownerProfile, setOwnerProfile] = useState<OwnerProfile | null>(null);
  const [harvesterProfile, setHarvesterProfile] = useState<HarvesterProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      fetchProfile();
    } else {
      setLoading(false);
    }
  }, [user]);

  const fetchProfile = async () => {
    if (!user) return;

    try {
      // Fetch main profile
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError && profileError.code !== 'PGRST116') {
        throw profileError;
      }

      if (profileData) {
        // Cast user_type to ensure type safety
        const typedProfile: Profile = {
          ...profileData,
          user_type: profileData.user_type as 'owner' | 'harvester'
        };
        setProfile(typedProfile);

        // Fetch specific profile based on user type
        if (profileData.user_type === 'owner') {
          const { data: ownerData, error: ownerError } = await supabase
            .from('owner_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (ownerError && ownerError.code !== 'PGRST116') {
            console.error('Error fetching owner profile:', ownerError);
          } else if (ownerData) {
            setOwnerProfile(ownerData);
          }
        } else if (profileData.user_type === 'harvester') {
          const { data: harvesterData, error: harvesterError } = await supabase
            .from('harvester_profiles')
            .select('*')
            .eq('id', user.id)
            .single();

          if (harvesterError && harvesterError.code !== 'PGRST116') {
            console.error('Error fetching harvester profile:', harvesterError);
          } else if (harvesterData) {
            setHarvesterProfile(harvesterData);
          }
        }
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

  const createProfile = async (userType: 'owner' | 'harvester', additionalData?: any) => {
    if (!user) return false;

    try {
      setLoading(true);

      // Prepare profile data based on video analysis or traditional input
      const profileData: any = {
        id: user.id,
        user_type: userType,
        email: user.email,
      };

      // If we have video-extracted data, use it
      if (additionalData) {
        if (additionalData.personal_info) {
          profileData.first_name = additionalData.personal_info.name?.split(' ')[0] || additionalData.first_name;
          profileData.last_name = additionalData.personal_info.name?.split(' ').slice(1).join(' ') || additionalData.last_name;
          profileData.address = additionalData.personal_info.location || additionalData.address;
        }
        
        // Merge any additional fields
        Object.assign(profileData, {
          first_name: profileData.first_name || additionalData.first_name,
          last_name: profileData.last_name || additionalData.last_name,
          phone: additionalData.phone,
          address: profileData.address || additionalData.address,
        });
      }

      // Create main profile
      const { data: createdProfile, error: profileError } = await supabase
        .from('profiles')
        .insert(profileData)
        .select()
        .single();

      if (profileError) throw profileError;

      // Create specific profile based on user type
      if (userType === 'owner') {
        const ownerData: any = {
          id: user.id,
        };

        // Map video-extracted data to owner profile
        if (additionalData?.property_info) {
          ownerData.olive_trees_count = parseInt(additionalData.property_info.tree_count) || null;
          ownerData.grove_location = additionalData.property_info.property_location || additionalData.property_info.location;
          ownerData.grove_size_hectares = parseFloat(additionalData.property_info.property_size) || null;
        }

        if (additionalData?.personal_info?.experience_years) {
          ownerData.experience_years = parseInt(additionalData.personal_info.experience_years);
        }

        const { error: ownerError } = await supabase
          .from('owner_profiles')
          .insert(ownerData);

        if (ownerError) throw ownerError;
        
      } else if (userType === 'harvester') {
        const harvesterData: any = {
          id: user.id,
        };

        // Map video-extracted data to harvester profile
        if (additionalData?.skills_and_services) {
          harvesterData.specializations = additionalData.skills_and_services.specializations || [];
          harvesterData.equipment_owned = additionalData.skills_and_services.equipment_owned || [];
          harvesterData.hourly_rate = parseFloat(additionalData.skills_and_services.daily_rate) || null;
          harvesterData.availability_radius_km = parseInt(additionalData.skills_and_services.work_radius) || null;
        }

        if (additionalData?.personal_info?.experience_years) {
          harvesterData.experience_years = parseInt(additionalData.personal_info.experience_years);
        }

        const { error: harvesterError } = await supabase
          .from('harvester_profiles')
          .insert(harvesterData);

        if (harvesterError) throw harvesterError;
      }

      // Cast the profile data to ensure type safety
      const typedProfile: Profile = {
        ...createdProfile,
        user_type: createdProfile.user_type as 'owner' | 'harvester'
      };
      setProfile(typedProfile);
      
      toast({
        title: 'Profil créé',
        description: additionalData ? 
          'Votre profil a été créé automatiquement grâce à l\'IA !' : 
          'Votre profil a été créé avec succès',
      });

      return true;
    } catch (error: any) {
      console.error('Error creating profile:', error);
      toast({
        title: 'Erreur',
        description: 'Impossible de créer le profil',
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
      const { error } = await supabase
        .from('profiles')
        .update(updates)
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
  };
};
