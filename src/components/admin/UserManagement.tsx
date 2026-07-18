
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Search, 
  Filter, 
  Eye, 
  Ban, 
  CheckCircle, 
  XCircle, 
  MoreHorizontal,
  UserCheck,
  UserX
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { getAllOwners } from "@/services/ownerService";
import { getAllHarvesters } from "@/services/harvesterListService";

interface UnifiedUser {
  id: string;
  role: 'work_provider' | 'job_seeker';
  status: string;
  last_login: string;
  created_at?: string;
  // Propriétaires
  business_name?: string;
  email?: string;
  verified?: boolean;
  // Cueilleurs
  full_name?: string;
  phone?: string;
  // Commun
  [key: string]: any;
}

const UserManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [selectedUser, setSelectedUser] = useState<UnifiedUser | null>(null);

  // Récupération des données utilisateurs
  const { data: owners = [], isLoading: ownersLoading } = useQuery({
    queryKey: ['owners'],
    queryFn: getAllOwners,
  });

  const { data: harvesters = [], isLoading: harvestersLoading } = useQuery({
    queryKey: ['harvesters'],
    // Wrapped: react-query calls queryFn with its own context object, which is
    // not the { limit, offset } options getAllHarvesters now expects.
    queryFn: () => getAllHarvesters(),
  });

  // Combinaison des données avec interface unifiée
  const allUsers: UnifiedUser[] = [
    ...owners.map(owner => ({
      ...owner,
      role: 'work_provider' as const,
      status: owner.verified ? 'active' : 'pending',
      last_login: new Date().toISOString(),
      created_at: owner.created_at || new Date().toISOString(),
    })),
    ...harvesters.map(harvester => ({
      ...harvester,
      role: 'job_seeker' as const,
      status: 'active',
      last_login: new Date().toISOString(),
      // Use a default created_at since it doesn't exist on HarvesterProfile
      created_at: new Date().toISOString(),
    }))
  ];

  const handleUserAction = (userId: string, action: string) => {
    console.log(`Action ${action} on user ${userId}`);
    // Implémenter les actions utilisateur
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendu</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'work_provider':
        return <Badge variant="outline">Propriétaire</Badge>;
      case 'job_seeker':
        return <Badge className="bg-blue-500">Cueilleur</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  const getUserDisplayName = (user: UnifiedUser) => {
    return user.business_name || user.full_name || 'Nom non disponible';
  };

  const getUserEmail = (user: UnifiedUser) => {
    return user.email || 'Email non disponible';
  };

  const filteredUsers = allUsers.filter(user => {
    const displayName = getUserDisplayName(user);
    const email = getUserEmail(user);
    
    const matchesSearch = displayName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    
    return matchesSearch && matchesStatus && matchesRole;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Utilisateurs</CardTitle>
          <CardDescription>
            Gérer tous les comptes de la plateforme Zeytna
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par rôle" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les rôles</SelectItem>
                <SelectItem value="work_provider">Propriétaires</SelectItem>
                <SelectItem value="job_seeker">Cueilleurs</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Actif</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="suspended">Suspendu</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des utilisateurs */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Dernière connexion</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">
                          {getUserDisplayName(user)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {getUserEmail(user)}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getRoleBadge(user.role)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(user.status)}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {new Date(user.last_login || user.created_at || new Date()).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setSelectedUser(user)}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>Détails de l'utilisateur</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm font-medium">Nom</label>
                                    <p>{getUserDisplayName(selectedUser)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Email</label>
                                    <p>{getUserEmail(selectedUser)}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Téléphone</label>
                                    <p>{selectedUser.phone || 'Non disponible'}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm font-medium">Rôle</label>
                                    <p>{selectedUser.role === 'work_provider' ? 'Propriétaire' : 'Cueilleur'}</p>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUserAction(user.id, 'verify')}
                        >
                          <UserCheck className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => handleUserAction(user.id, 'suspend')}
                        >
                          <Ban className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredUsers.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucun utilisateur trouvé
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
