
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ProfileSetup from './ProfileSetup';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresProfile?: boolean;
}

const ProtectedRoute = ({ children, requiresProfile = true }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, hasDetailProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  if (authLoading || (user && profileLoading)) {
    return (
      <div className="min-h-screen bg-sand-light flex items-center justify-center">
        <div className="text-olive-dark">Chargement...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // If profile is required but the detail profile (work_providers / job_seekers)
  // doesn't exist yet, show the setup flow. `profile` (public.users) is always
  // created by a DB trigger on sign-up, so we key off the detail row instead.
  if (requiresProfile && (!profile || !hasDetailProfile)) {
    return <ProfileSetup />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
