
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MessageSquare, Users, Eye, AlertTriangle, Search } from "lucide-react";
import { useState } from "react";

const InteractionMonitoring = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - À remplacer par de vraies données de l'API
  const interactions = [
    {
      id: "1",
      type: "application",
      participants: ["Ahmed Ben Ali", "Ferme Olivia"],
      job_title: "Cueillette olives - Sfax",
      last_message: "Quand pouvons-nous commencer ?",
      message_count: 12,
      created_at: "2024-01-15 10:30:00",
      status: "active",
      flagged: false
    },
    {
      id: "2",
      type: "negotiation",
      participants: ["Fatma Trabelsi", "Oliveraie du Sud"],
      job_title: "Récolte intensive - Kairouan",
      last_message: "Le prix proposé me convient",
      message_count: 8,
      created_at: "2024-01-15 09:15:00",
      status: "completed",
      flagged: false
    },
    {
      id: "3",
      type: "dispute",
      participants: ["Mohamed Karray", "Ferme Ben Salem"],
      job_title: "Cueillette manuelle - Monastir",
      last_message: "Je ne suis pas satisfait du travail",
      message_count: 25,
      created_at: "2024-01-14 16:45:00",
      status: "flagged",
      flagged: true
    }
  ];

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'application':
        return <Badge variant="outline">Candidature</Badge>;
      case 'negotiation':
        return <Badge className="bg-blue-500">Négociation</Badge>;
      case 'dispute':
        return <Badge variant="destructive">Litige</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string, flagged: boolean) => {
    if (flagged) {
      return <Badge variant="destructive">Signalé</Badge>;
    }
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'completed':
        return <Badge variant="secondary">Terminé</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredInteractions = interactions.filter(interaction => {
    const matchesSearch = interaction.participants.some(p => 
      p.toLowerCase().includes(searchTerm.toLowerCase())
    ) || interaction.job_title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'all' || interaction.type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Suivi des Interactions
          </CardTitle>
          <CardDescription>
            Surveillance des échanges entre propriétaires et cueilleurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Statistiques rapides */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Conversations actives</span>
                </div>
                <div className="text-2xl font-bold mt-2">24</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">Négociations en cours</span>
                </div>
                <div className="text-2xl font-bold mt-2">8</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">Litiges signalés</span>
                </div>
                <div className="text-2xl font-bold mt-2">3</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par participants, titre d'annonce..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type d'interaction" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="application">Candidatures</SelectItem>
                <SelectItem value="negotiation">Négociations</SelectItem>
                <SelectItem value="dispute">Litiges</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Participants</TableHead>
                  <TableHead>Annonce</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Messages</TableHead>
                  <TableHead>Dernier message</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInteractions.map((interaction) => (
                  <TableRow key={interaction.id}>
                    <TableCell>
                      <div className="space-y-1">
                        {interaction.participants.map((participant, index) => (
                          <div key={index} className="text-sm">
                            {participant}
                          </div>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-sm">
                        {interaction.job_title}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getTypeBadge(interaction.type)}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{interaction.message_count}</Badge>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-[200px] truncate">
                        {interaction.last_message}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(interaction.created_at).toLocaleDateString('fr-FR')}
                      </div>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(interaction.status, interaction.flagged)}
                    </TableCell>
                    <TableCell>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InteractionMonitoring;
