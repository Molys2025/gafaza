
import React from 'react';
import { Trees, Search, MessageCircle, Shield } from 'lucide-react';

const WelcomeStep = () => (
  <div className="text-center py-8">
    <div className="w-24 h-24 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Trees className="w-12 h-12 text-olive" />
    </div>
    <h3 className="text-2xl font-bold text-olive-dark mb-4">
      Valorisez vos oliviers facilement
    </h3>
    <p className="text-gray-600 text-lg leading-relaxed max-w-md mx-auto">
      Trouvez des cueilleurs expérimentés pour votre récolte et maximisez le rendement de vos oliviers.
    </p>
  </div>
);

const ProfileStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Trees className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Créez votre profil de propriétaire
    </h3>
    <div className="space-y-4">
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">1</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Informations sur vos oliviers</h4>
          <p className="text-gray-600 text-sm">Nombre d'arbres, surface, variétés cultivées</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">2</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Période de récolte</h4>
          <p className="text-gray-600 text-sm">Définissez quand vous aurez besoin de cueilleurs</p>
        </div>
      </div>
      <div className="flex items-start space-x-3">
        <div className="w-6 h-6 bg-olive rounded-full flex items-center justify-center flex-shrink-0 mt-1">
          <span className="text-white text-sm font-bold">3</span>
        </div>
        <div>
          <h4 className="font-semibold text-gray-800">Localisation</h4>
          <p className="text-gray-600 text-sm">Où se trouvent vos oliveraies</p>
        </div>
      </div>
    </div>
  </div>
);

const SearchStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Search className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Trouvez vos cueilleurs idéaux
    </h3>
    <div className="bg-sand-light rounded-lg p-6">
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center">
          <div className="text-2xl font-bold text-olive">50+</div>
          <div className="text-sm text-gray-600">Cueilleurs expérimentés</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-olive">4.8/5</div>
          <div className="text-sm text-gray-600">Note moyenne</div>
        </div>
      </div>
      <p className="text-gray-600 text-center text-sm">
        Filtrez par expérience, tarifs, disponibilité et localisation pour trouver les meilleurs cueilleurs.
      </p>
    </div>
  </div>
);

const CommunicationStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <MessageCircle className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Communiquez en toute simplicité
    </h3>
    <div className="space-y-4">
      <div className="bg-white border rounded-lg p-4">
        <div className="flex items-center space-x-3 mb-2">
          <div className="w-8 h-8 bg-olive rounded-full"></div>
          <div>
            <div className="font-semibold text-sm">Ahmed Ben Ali</div>
            <div className="text-xs text-gray-500">Cueilleur • 5 ans d'expérience</div>
          </div>
        </div>
        <div className="bg-gray-50 rounded p-3 text-sm">
          "Bonjour, je suis disponible pour votre récolte en novembre. Mes tarifs sont de 45 TND/jour."
        </div>
      </div>
      <p className="text-gray-600 text-sm text-center">
        Discutez directement avec les cueilleurs, négociez les tarifs et planifiez la récolte.
      </p>
    </div>
  </div>
);

const SecurityStep = () => (
  <div className="py-8">
    <div className="w-20 h-20 bg-olive/10 rounded-full flex items-center justify-center mx-auto mb-6">
      <Shield className="w-10 h-10 text-olive" />
    </div>
    <h3 className="text-xl font-bold text-olive-dark mb-4 text-center">
      Paiements sécurisés et évaluations
    </h3>
    <div className="space-y-4">
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h4 className="font-semibold text-green-800 mb-2">Système d'évaluation</h4>
        <p className="text-green-700 text-sm">
          Évaluez les cueilleurs après chaque récolte pour aider la communauté.
        </p>
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-semibold text-blue-800 mb-2">Paiements protégés</h4>
        <p className="text-blue-700 text-sm">
          Paiements sécurisés avec libération des fonds après confirmation de la récolte.
        </p>
      </div>
    </div>
  </div>
);

export const OwnerOnboarding = [
  WelcomeStep,
  ProfileStep,
  SearchStep,
  CommunicationStep,
  SecurityStep
];
