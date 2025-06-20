
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, FileText, MessageSquare, Database, AlertTriangle, CheckCircle } from 'lucide-react';
import SupabaseDiagnostic from './SupabaseDiagnostic';

const AdminDashboard = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Utilisateurs totaux</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Diagnostic requis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Annonces actives</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Diagnostic requis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Messages échangés</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">-</div>
            <p className="text-xs text-muted-foreground">Diagnostic requis</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">État de la base</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">?</div>
            <p className="text-xs text-muted-foreground">Vérification nécessaire</p>
          </CardContent>
        </Card>
      </div>

      <SupabaseDiagnostic />

      <Card>
        <CardHeader>
          <CardTitle>Actions rapides</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Vérifier les logs</h3>
              <p className="text-sm text-gray-600 mb-3">
                Consultez les logs de l'application pour identifier les erreurs
              </p>
              <button className="text-sm bg-blue-500 text-white px-3 py-1 rounded">
                Ouvrir les logs
              </button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Tester les permissions</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vérifier les permissions RLS sur toutes les tables
              </p>
              <button className="text-sm bg-green-500 text-white px-3 py-1 rounded">
                Tester RLS
              </button>
            </div>

            <div className="p-4 border rounded-lg">
              <h3 className="font-medium mb-2">Réinitialiser cache</h3>
              <p className="text-sm text-gray-600 mb-3">
                Vider le cache du navigateur et recharger
              </p>
              <button 
                className="text-sm bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => window.location.reload()}
              >
                Recharger
              </button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
