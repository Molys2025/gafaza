
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Shield, Sparkles, Clock, Users } from 'lucide-react';

interface IntroExperienceProps {
  onAccept: () => void;
  onDecline: () => void;
}

const IntroExperience = ({ onAccept, onDecline }: IntroExperienceProps) => {
  return (
    <div className="min-h-screen bg-sand-light flex items-center justify-center px-4">
      <Card className="w-full max-w-4xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="bg-olive/10 w-16 h-16 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-olive" />
            </div>
          </div>
          <CardTitle className="text-3xl text-olive-dark">
            🚀 Découvrez l'expérience Zeytna
          </CardTitle>
          <CardDescription className="text-lg mt-4">
            Une nouvelle façon révolutionnaire de créer votre profil en quelques secondes
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Avantages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4">
              <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Clock className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">5x plus rapide</h3>
              <p className="text-sm text-gray-600">
                Créez votre profil en 30 secondes au lieu de 10 minutes
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">Plus authentique</h3>
              <p className="text-sm text-gray-600">
                Votre personnalité transparaît mieux qu'avec des formulaires
              </p>
            </div>
            
            <div className="text-center p-4">
              <div className="bg-purple-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <Sparkles className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">IA intelligente</h3>
              <p className="text-sm text-gray-600">
                Notre IA comprend vos besoins et pré-remplit automatiquement votre profil
              </p>
            </div>
          </div>

          {/* Comment ça marche */}
          <div className="bg-gray-50 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-4 text-center">
              Comment ça marche ?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center">
                <div className="bg-olive text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  1
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Enregistrez</strong><br />
                  Une vidéo ou audio de 30 secondes
                </p>
              </div>
              <div className="text-center">
                <div className="bg-olive text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  2
                </div>
                <p className="text-sm text-gray-700">
                  <strong>L'IA analyse</strong><br />
                  Extraction automatique de vos infos
                </p>
              </div>
              <div className="text-center">
                <div className="bg-olive text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto mb-2 text-sm font-bold">
                  3
                </div>
                <p className="text-sm text-gray-700">
                  <strong>Vous validez</strong><br />
                  Un assistant vous aide à finaliser
                </p>
              </div>
            </div>
          </div>

          {/* Confidentialité */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <div className="flex items-start gap-3">
              <Shield className="w-6 h-6 text-blue-600 mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-blue-900 mb-2">
                  🔒 Vos données sont protégées
                </h3>
                <div className="text-sm text-blue-800 space-y-2">
                  <p>• Votre enregistrement est utilisé uniquement pour créer votre profil</p>
                  <p>• Aucune vidéo n'est stockée définitivement sur nos serveurs</p>
                  <p>• Traitement sécurisé par intelligence artificielle</p>
                  <p>• Vous gardez le contrôle total de vos informations</p>
                  <p>• Suppression automatique des données temporaires</p>
                </div>
              </div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              onClick={onAccept}
              className="bg-olive hover:bg-olive-dark text-white px-8 py-3 text-lg"
            >
              🚀 Commencer l'expérience
            </Button>
            <Button 
              onClick={onDecline}
              variant="outline"
              className="border-gray-300 text-gray-700 hover:bg-gray-50 px-8 py-3 text-lg"
            >
              Utiliser l'inscription classique
            </Button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-4">
            En continuant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default IntroExperience;
