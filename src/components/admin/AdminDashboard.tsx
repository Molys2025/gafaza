
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Users, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  TrendingUp, 
  DollarSign,
  Activity,
  Shield
} from "lucide-react";

const AdminDashboard = () => {
  // Mock data - À remplacer par de vraies données de l'API
  const stats = {
    totalUsers: 1247,
    newUsersThisMonth: 89,
    activeJobs: 156,
    completedJobs: 2341,
    totalTransactions: 45678,
    totalRevenue: 127350,
    reportsPending: 12,
    satisfactionRate: 94.2
  };

  return (
    <div className="space-y-6">
      {/* Statistiques principales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs Total</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +{stats.newUsersThisMonth} ce mois
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annonces Actives</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activeJobs}</div>
            <p className="text-xs text-muted-foreground">
              {stats.completedJobs.toLocaleString()} complétées
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Chiffre d'Affaires</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalRevenue.toLocaleString()} TND</div>
            <p className="text-xs text-muted-foreground">
              {stats.totalTransactions.toLocaleString()} transactions
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Satisfaction</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.satisfactionRate}%</div>
            <Progress value={stats.satisfactionRate} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {/* Alertes et actions rapides */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-orange-500" />
              Alertes en Cours
            </CardTitle>
            <CardDescription>
              Actions requises pour la modération
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span>Signalements en attente</span>
              <Badge variant="destructive">{stats.reportsPending}</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Comptes à vérifier</span>
              <Badge variant="secondary">24</Badge>
            </div>
            <div className="flex items-center justify-between">
              <span>Paiements bloqués</span>
              <Badge variant="outline">3</Badge>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="h-5 w-5 text-green-500" />
              Activité Récente
            </CardTitle>
            <CardDescription>
              Dernières actions sur la plateforme
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span>Nouveau propriétaire vérifié</span>
                <span className="text-muted-foreground">Il y a 2h</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span>Annonce validée - Sfax</span>
                <span className="text-muted-foreground">Il y a 4h</span>
              </div>
            </div>
            <div className="text-sm">
              <div className="flex justify-between items-center">
                <span>Paiement libéré</span>
                <span className="text-muted-foreground">Il y a 6h</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Graphiques et tendances */}
      <Card>
        <CardHeader>
          <CardTitle>Tendances d'Activité</CardTitle>
          <CardDescription>
            Évolution de l'activité sur les 30 derniers jours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center text-muted-foreground">
            Graphique d'activité (à implémenter avec recharts)
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
