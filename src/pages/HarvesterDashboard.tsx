
import React, { useState, useEffect } from 'react';
import { useOnboarding } from '@/hooks/useOnboarding';
import OnboardingFlow from '@/components/onboarding/OnboardingFlow';
import { Link } from 'react-router-dom';
import { User, Search, Star, CreditCard, Calendar } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@/hooks/useAuth';
import { getMyApplications } from '@/services/applicationService';
import { getHarvesterById } from '@/services/harvesterListService';
import { logger } from '@/lib/logger';

interface DashboardStats {
  pending: number;
  accepted: number;
  completed: number;
  rating: number | null;
  totalRatings: number;
}

const HarvesterDashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { shouldShowOnboarding, markOnboardingComplete } = useOnboarding();
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [stats, setStats] = useState<DashboardStats | null>(null);

  useEffect(() => {
    if (shouldShowOnboarding('harvester')) {
      setShowOnboarding(true);
    }
  }, [shouldShowOnboarding]);

  useEffect(() => {
    if (!user) return;

    Promise.all([
      getMyApplications(user.id),
      getHarvesterById(user.id).catch(() => null),
    ])
      .then(([applications, profile]) => {
        setStats({
          pending: applications.filter(a => a.status === 'pending').length,
          accepted: applications.filter(a => a.status === 'accepted').length,
          completed: applications.filter(a => a.status === 'completed').length,
          rating: profile?.rating ?? null,
          totalRatings: profile?.total_ratings ?? 0,
        });
      })
      .catch((error) => logger.error('Error loading harvester dashboard stats', error));
  }, [user]);

  const handleOnboardingComplete = () => {
    markOnboardingComplete('harvester');
    setShowOnboarding(false);
  };

  const handleOnboardingSkip = () => {
    markOnboardingComplete('harvester');
    setShowOnboarding(false);
  };

  return (
    <div className="min-h-screen bg-sand-light py-8">
      {showOnboarding && (
        <OnboardingFlow
          userType="harvester"
          onComplete={handleOnboardingComplete}
          onSkip={handleOnboardingSkip}
        />
      )}
      
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-olive-dark mb-6">Tableau de bord Cueilleur</h1>

          {/* Chiffres réels du compte */}
          {stats && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-olive-dark">{stats.pending}</div>
                <div className="text-sm text-gray-600">Candidature{stats.pending > 1 ? 's' : ''} en attente</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-olive-dark">{stats.accepted}</div>
                <div className="text-sm text-gray-600">Mission{stats.accepted > 1 ? 's' : ''} acceptée{stats.accepted > 1 ? 's' : ''}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-olive-dark">{stats.completed}</div>
                <div className="text-sm text-gray-600">Mission{stats.completed > 1 ? 's' : ''} terminée{stats.completed > 1 ? 's' : ''}</div>
              </div>
              <div className="bg-white rounded-lg shadow-md p-4">
                <div className="text-2xl font-bold text-olive-dark">
                  {stats.rating && stats.rating > 0 ? `${stats.rating}/5` : '—'}
                </div>
                <div className="text-sm text-gray-600">
                  {stats.totalRatings > 0 ? `${stats.totalRatings} avis` : 'Pas encore d’avis'}
                </div>
              </div>
            </div>
          )}

          {/* Section Mon Profil */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <Link 
              to="/harvester-profile" 
              className="flex items-center justify-between hover:bg-olive/5 rounded-lg p-4 transition-colors"
            >
              <div className="flex items-center">
                <div className="w-12 h-12 bg-olive rounded-full flex items-center justify-center mr-4">
                  <User className="text-white" size={24} />
                </div>
                <div>
                  <h3 className="font-semibold text-olive-dark">Mon Profil</h3>
                  <p className="text-gray-600 text-sm">Gérez vos informations personnelles et professionnelles</p>
                </div>
              </div>
              <div className="text-olive-dark">→</div>
            </Link>
          </div>

          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-semibold text-olive-dark mb-4">
                Bienvenue sur votre espace Cueilleur
              </h2>
              <p className="text-gray-600 text-lg">
                Trouvez des opportunités de récolte et développez votre activité
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Link
                to="/jobs"
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Rechercher des offres</h3>
                <p className="text-gray-600 text-sm">
                  Trouvez des opportunités de récolte près de chez vous
                </p>
              </Link>

              <Link
                to="/my-applications"
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Calendar className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Mes candidatures</h3>
                <p className="text-gray-600 text-sm">
                  Suivez vos missions en cours et à venir
                </p>
              </Link>

              <Link
                to={user ? `/harvester/${user.id}` : '/harvester-profile'}
                className="bg-olive/5 rounded-lg p-6 text-center hover:bg-olive/10 transition-colors cursor-pointer"
              >
                <div className="w-16 h-16 bg-olive rounded-full flex items-center justify-center mx-auto mb-4">
                  <Star className="text-white" size={32} />
                </div>
                <h3 className="font-semibold text-olive-dark mb-2">Mes évaluations</h3>
                <p className="text-gray-600 text-sm">
                  Consultez vos évaluations et construisez votre réputation
                </p>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HarvesterDashboard;
