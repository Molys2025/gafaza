
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import UserTypeSelection from './UserTypeSelection';
import { useProfile } from '@/hooks/useProfile';

const ProfileSetup = () => {
  const [loading, setLoading] = useState(false);
  const { createProfile } = useProfile();
  const navigate = useNavigate();

  const handleUserTypeSelect = async (userType: 'owner' | 'harvester') => {
    setLoading(true);
    
    const success = await createProfile(userType);
    
    if (success) {
      // Redirect to appropriate dashboard
      if (userType === 'owner') {
        navigate('/owner-profile');
      } else {
        navigate('/harvester-dashboard');
      }
    }
    
    setLoading(false);
  };

  return (
    <UserTypeSelection 
      onSelect={handleUserTypeSelect}
      loading={loading}
    />
  );
};

export default ProfileSetup;
