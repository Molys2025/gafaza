
import { supabase } from '@/lib/supabase';

interface HarvesterData {
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

export const createHarvester = async (userId: string, harvesterData: HarvesterData) => {
  const { data, error } = await supabase
    .from('harvesters')
    .insert([{
      id: userId,
      full_name: harvesterData.fullName,
      phone: harvesterData.phone,
      whatsapp: harvesterData.whatsapp,
      experience: harvesterData.experience,
      skills: harvesterData.skills,
      availability: [harvesterData.availabilityStart, harvesterData.availabilityEnd],
      preferred_regions: harvesterData.preferredRegions,
      daily_rate: harvesterData.dailyRate,
      created_at: new Date(),
      updated_at: new Date()
    }]);

  if (error) {
    throw error;
  }

  return data;
};

export const getHarvester = async (harvesterId: string) => {
  const { data, error } = await supabase
    .from('harvesters')
    .select('*')
    .eq('id', harvesterId)
    .single();

  if (error) {
    throw error;
  }

  return data;
};

export const updateHarvester = async (harvesterId: string, harvesterData: Partial<HarvesterData>) => {
  const updates: any = {};

  if (harvesterData.fullName) updates.full_name = harvesterData.fullName;
  if (harvesterData.phone) updates.phone = harvesterData.phone;
  if (harvesterData.whatsapp !== undefined) updates.whatsapp = harvesterData.whatsapp;
  if (harvesterData.experience !== undefined) updates.experience = harvesterData.experience;
  if (harvesterData.skills !== undefined) updates.skills = harvesterData.skills;
  if (harvesterData.availabilityStart && harvesterData.availabilityEnd) {
    updates.availability = [harvesterData.availabilityStart, harvesterData.availabilityEnd];
  }
  if (harvesterData.preferredRegions !== undefined) updates.preferred_regions = harvesterData.preferredRegions;
  if (harvesterData.dailyRate !== undefined) updates.daily_rate = harvesterData.dailyRate;
  updates.updated_at = new Date();

  const { data, error } = await supabase
    .from('harvesters')
    .update(updates)
    .eq('id', harvesterId);

  if (error) {
    throw error;
  }

  return data;
};

export const uploadIdCard = async (harvesterId: string, file: File) => {
  const { data, error } = await supabase
    .storage
    .from('id-cards')
    .upload(`${harvesterId}/id-card`, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return data;
};

export const uploadProfilePicture = async (harvesterId: string, file: File) => {
  const { data, error } = await supabase
    .storage
    .from('profile-pictures')
    .upload(`${harvesterId}/profile`, file, {
      upsert: true,
    });

  if (error) {
    throw error;
  }

  return data;
};
