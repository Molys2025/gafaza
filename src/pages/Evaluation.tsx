
import { useState } from "react";
import { EvaluationSection } from "@/components/evaluation/EvaluationSection";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Star } from "lucide-react";

export default function Evaluation() {
  const [userType, setUserType] = useState<"propriétaire" | "cueilleur">("propriétaire");

  return (
    <div className="container py-8 space-y-6">
      <div className="flex flex-col space-y-2">
        <h1 className="text-3xl font-bold tracking-tight">Système d'Évaluation</h1>
        <p className="text-muted-foreground">
          Évaluez vos expériences et gagnez des badges pour améliorer votre profil
        </p>
      </div>

      <Tabs defaultValue="propriétaire" onValueChange={(value) => setUserType(value as any)}>
        <TabsList className="w-full max-w-md mx-auto">
          <TabsTrigger value="propriétaire" className="flex-1">Propriétaire</TabsTrigger>
          <TabsTrigger value="cueilleur" className="flex-1">Cueilleur</TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Système d'Évaluation</CardTitle>
            <CardDescription>
              Évaluez vos interactions avec des {userType === "propriétaire" ? "propriétaires" : "cueilleurs"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <EvaluationSection userType={userType} />
          </CardContent>
        </Card>
        
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Statistiques d'Évaluation</CardTitle>
              <CardDescription>Aperçu de vos évaluations et récompenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <StatCard value="4.7" label="Note moyenne" />
                <StatCard value="12" label="Évaluations" />
                <StatCard value="3" label="Badges gagnés" />
                <StatCard value="85%" label="Taux de satisfaction" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Vos dernières évaluations</CardTitle>
              <CardDescription>Les commentaires les plus récents</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <RecentReview
                  name="Thomas D."
                  date="11 avril 2025"
                  rating={5}
                  comment="Excellent service, très professionnel et ponctuel."
                />
                <RecentReview
                  name="Marie L."
                  date="3 avril 2025"
                  rating={4}
                  comment="Bonne expérience globale, je recommande."
                />
                <RecentReview
                  name="Julien M."
                  date="27 mars 2025"
                  rating={5}
                  comment="Parfait à tous les niveaux, merci !"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="bg-muted/50 p-4 rounded-lg text-center">
      <div className="text-2xl font-bold text-olive">{value}</div>
      <div className="text-sm text-muted-foreground">{label}</div>
    </div>
  );
}

function RecentReview({ 
  name, 
  date, 
  rating, 
  comment 
}: { 
  name: string; 
  date: string; 
  rating: number; 
  comment: string;
}) {
  return (
    <div className="border-b pb-3 last:border-0">
      <div className="flex justify-between items-center mb-1">
        <div className="font-medium">{name}</div>
        <div className="text-xs text-muted-foreground">{date}</div>
      </div>
      <div className="flex mb-1">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star 
            key={i} 
            className={`w-4 h-4 ${i < rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} 
          />
        ))}
      </div>
      <p className="text-sm text-muted-foreground">{comment}</p>
    </div>
  );
}
