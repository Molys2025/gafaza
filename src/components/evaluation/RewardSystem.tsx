
import { Trophy, Award, Shield, Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface Badge {
  id: string;
  name: string;
  description: string;
  icon: JSX.Element;
  earned: boolean;
}

interface RewardSystemProps {
  userId?: string;
  userType: "propriétaire" | "cueilleur";
}

export function RewardSystem({ userType }: RewardSystemProps) {
  // This would normally be fetched from an API based on the userId
  const badges: Badge[] = [
    {
      id: "nouveauMembre",
      name: "Nouveau Membre",
      description: "A rejoint la plateforme",
      icon: <Shield className="h-6 w-6" />,
      earned: true
    },
    {
      id: "excellentService",
      name: "Service Excellent",
      description: userType === "propriétaire" 
        ? "Offre d'excellentes conditions de travail" 
        : "Fournit un travail de haute qualité",
      icon: <Award className="h-6 w-6" />,
      earned: Math.random() > 0.5
    },
    {
      id: "clientFidèle",
      name: "Membre Fidèle",
      description: "Utilise la plateforme depuis plus d'un an",
      icon: <Trophy className="h-6 w-6" />,
      earned: Math.random() > 0.5
    },
    {
      id: "hautementNoté",
      name: "Hautement Noté",
      description: "A reçu plus de 10 évaluations 5 étoiles",
      icon: <Star className="h-6 w-6" />,
      earned: Math.random() > 0.5
    }
  ];

  const earnedBadges = badges.filter(badge => badge.earned);
  const unearnedBadges = badges.filter(badge => !badge.earned);

  return (
    <div className="space-y-6 p-4 bg-white rounded-lg shadow-sm">
      <h3 className="text-lg font-medium">Badges et Récompenses</h3>
      
      {earnedBadges.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-olive">Badges gagnés</h4>
          <div className="grid grid-cols-2 gap-3">
            {earnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} />
            ))}
          </div>
        </div>
      )}
      
      {unearnedBadges.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-medium text-muted-foreground">Badges à débloquer</h4>
          <div className="grid grid-cols-2 gap-3">
            {unearnedBadges.map(badge => (
              <BadgeCard key={badge.id} badge={badge} locked />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function BadgeCard({ badge, locked = false }: { badge: Badge; locked?: boolean }) {
  return (
    <div 
      className={cn(
        "flex items-center p-3 border rounded-md gap-3 transition-colors",
        locked 
          ? "border-gray-200 opacity-50" 
          : "border-olive/30 bg-olive/5 hover:bg-olive/10"
      )}
    >
      <div className={cn(
        "flex items-center justify-center p-2 rounded-full",
        locked ? "bg-gray-100 text-gray-400" : "bg-olive/20 text-olive"
      )}>
        {badge.icon}
      </div>
      <div>
        <h5 className="text-sm font-medium">{badge.name}</h5>
        <p className="text-xs text-muted-foreground">{badge.description}</p>
      </div>
    </div>
  );
}
