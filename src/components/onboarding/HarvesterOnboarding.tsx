
import React from 'react';
import { User, Search, Star, Wallet } from 'lucide-react';

const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="w-24 h-24 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <User className="w-12 h-12 text-olive" />
    </div>
    <h3 className="text-2xl font-bold text-olive-dark mb-4">
      Trouvez du travail facilement
    </h3>
    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
      Connectez-vous avec des propriétaires d'oliviers et valorisez votre expertise en récolte d'olives.
    </p>
  </div>
);

const ProfileStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <User className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Créez votre profil professionnel
    </h3>
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">1</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Expérience et compétences</h4>
          <p className="text-gray-600 text-sm">Années d'expérience, techniques maîtrisées</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">2</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Tarifs et disponibilité</h4>
          <p className="text-gray-600 text-sm">Vos tarifs journaliers et périodes libres</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">3</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Zone d'intervention</h4>
          <p className="text-gray-600 text-sm">Régions où vous acceptez de travailler</p>
        </div>
      </div>
    </div>
  </div>
);

const OpportunitiesStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Découvrez les opportunités
    </h3>
    <div className="bg-sand-light rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-olive">200+</div>
          <div className="text-sm text-gray-600">Propriétaires actifs</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-olive">45-80 TND</div>
          <div className="text-sm text-gray-600">Tarif moyen/jour</div>
        </div>
      </div>
      <p className="text-gray-600 text-center text-sm">
        Parcourez les offres de récolte, filtrez par localisation et postulez facilement.
      </p>
    </div>
  </div>
);

const ReputationStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Star className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Construisez votre réputation
    </h3>
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="font-semibold text-sm">Récolte chez Mme Fatma</span>
          <div className="flex text-yellow-400">
            {[1,2,3,4,5].map(i => (
              <Star key={i} className="w-4 h-4 fill-current" />
            ))}
          </div>
        </div>
        <p className="text-gray-600 text-sm">
          "Excellent travail, très professionnel et rapide. Je recommande vivement Ahmed!"
        </p>
      </div>
      <p className="text-gray-600 text-sm text-center">
        Chaque récolte réussie améliore votre note et vous donne accès à plus d'opportunités.
      </p>
    </div>
  </div>
);

const EarningsStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Wallet className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Gérez vos revenus facilement
    </h3>
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">Paiements garantis</h4>
        <p className="text-green-700 text-sm">
          Recevez vos paiements rapidement après validation de la récolte.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Suivi des revenus</h4>
        <p className="text-blue-700 text-sm">
          Tableau de bord pour suivre vos gains et historique des travaux.
        </p>
      </div>
    </div>
  </div>
);

export const HarvesterOnboarding = [
  WelcomeStep,
  ProfileStep,
  OpportunitiesStep,
  ReputationStep,
  EarningsStep
];
