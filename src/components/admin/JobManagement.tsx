
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { 
  Search, 
  Eye, 
  Check, 
  X, 
  Edit,
  Trash2,
  FileText,
  MapPin,
  Calendar,
  Users
} from "lucide-react";

const JobManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  // Mock data - À remplacer par de vraies données
  const jobs = [
    {
      id: "1",
      title: "Cueillette d'olives - Oliveraie de Sfax",
      work_provider_name: "Ahmed Ben Ali",
      location: "Sfax, Tunisie",
      start_date: "2023-11-15",
      end_date: "2023-11-25",
      workers_needed: 5,
      payment_amount: 45,
      payment_type: "daily",
      status: "active",
      applications_count: 12,
      created_at: "2023-10-15T10:00:00Z"
    },
    {
      id: "2",
      title: "Récolte urgente - Monastir",
      work_provider_name: "Leila Turki",
      location: "Monastir, Tunisie",
      start_date: "2023-11-20",
      end_date: "2023-11-30",
      workers_needed: 8,
      payment_amount: 50,
      payment_type: "daily",
      status: "pending",
      applications_count: 3,
      created_at: "2023-10-20T14:30:00Z"
    }
  ];

  const handleJobAction = (jobId: string, action: string, reason?: string) => {
    console.log(`Action ${action} on job ${jobId}`, reason);
    // Implémenter les actions sur les annonces
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'closed':
        return <Badge variant="outline">Fermée</Badge>;
      case 'rejected':
        return <Badge variant="destructive">Refusée</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.work_provider_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || job.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Annonces</CardTitle>
          <CardDescription>
            Superviser et modérer toutes les annonces de la plateforme
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres et recherche */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par titre, propriétaire, localisation..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="closed">Fermée</SelectItem>
                <SelectItem value="rejected">Refusée</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau des annonces */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Propriétaire</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Dates</TableHead>
                  <TableHead>Candidatures</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredJobs.map((job) => (
                  <TableRow key={job.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{job.title}</div>
                        <div className="text-sm text-muted-foreground">
                          {job.payment_amount} TND/jour - {job.workers_needed} postes
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>{job.work_provider_name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {job.location}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div>{new Date(job.start_date).toLocaleDateString('fr-FR')}</div>
                        <div className="text-muted-foreground">
                          au {new Date(job.end_date).toLocaleDateString('fr-FR')}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applications_count}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(job.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-3xl">
                            <DialogHeader>
                              <DialogTitle>Détails de l'annonce</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 max-h-96 overflow-y-auto">
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <label className="text-sm font-medium">Titre</label>
                                  <p>{job.title}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Propriétaire</label>
                                  <p>{job.work_provider_name}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Localisation</label>
                                  <p>{job.location}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Rémunération</label>
                                  <p>{job.payment_amount} TND/jour</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Date de début</label>
                                  <p>{new Date(job.start_date).toLocaleDateString('fr-FR')}</p>
                                </div>
                                <div>
                                  <label className="text-sm font-medium">Date de fin</label>
                                  <p>{new Date(job.end_date).toLocaleDateString('fr-FR')}</p>
                                </div>
                              </div>
                            </div>
                            <DialogFooter className="flex gap-2">
                              <Button 
                                variant="outline" 
                                onClick={() => handleJobAction(job.id, 'approve')}
                              >
                                <Check className="h-4 w-4 mr-2" />
                                Approuver
                              </Button>
                              <Dialog>
                                <DialogTrigger asChild>
                                  <Button variant="destructive">
                                    <X className="h-4 w-4 mr-2" />
                                    Rejeter
                                  </Button>
                                </DialogTrigger>
                                <DialogContent>
                                  <DialogHeader>
                                    <DialogTitle>Rejeter l'annonce</DialogTitle>
                                    <DialogDescription>
                                      Veuillez indiquer la raison du rejet
                                    </DialogDescription>
                                  </DialogHeader>
                                  <Textarea placeholder="Raison du rejet..." />
                                  <DialogFooter>
                                    <Button 
                                      variant="destructive"
                                      onClick={() => handleJobAction(job.id, 'reject', 'Raison du rejet')}
                                    >
                                      Confirmer le rejet
                                    </Button>
                                  </DialogFooter>
                                </DialogContent>
                              </Dialog>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        
                        {job.status === 'pending' && (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleJobAction(job.id, 'approve')}
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="destructive" 
                              size="sm"
                              onClick={() => handleJobAction(job.id, 'reject')}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredJobs.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              Aucune annonce trouvée
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default JobManagement;
