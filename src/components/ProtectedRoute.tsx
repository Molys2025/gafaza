
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useProfile } from '@/hooks/useProfile';
import ProfileSetup from './ProfileSetup';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiresProfile?: boolean;
  /** Restrict the route to a single role (e.g. the admin back-office). */
  requiredRole?: 'admin' | 'job_seeker' | 'work_provider';
}

const ProtectedRoute = ({ children, requiresProfile = true, requiredRole }: ProtectedRouteProps) => {
  const { user, loading: authLoading } = useAuth();
  const { profile, hasDetailProfile, loading: profileLoading } = useProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/auth');
    }
  }, [user, authLoading, navigate]);

  // Role check runs once the profile is loaded; a user without the required
  // role is sent back to the homepage instead of seeing the page shell.
  useEffect(() => {
    if (!authLoading && !profileLoading && user && requiredRole && profile && profile.role !== requiredRole) {
      navigate('/');
    }
  }, [authLoading, profileLoading, user, requiredRole, profile, navigate]);

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

  // Never render the children for the wrong role, even for the frame between
  // the check above and the navigate() taking effect.
  if (requiredRole && profile?.role !== requiredRole) {
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
