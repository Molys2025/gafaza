
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AlertTriangle, Eye, CheckCircle, XCircle, Search } from "lucide-react";
import { useState } from "react";

const ReportsModeration = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");

  // Mock data - À remplacer par de vraies données de l'API
  const reports = [
    {
      id: "1",
      type: "inappropriate_behavior",
      status: "pending",
      reporter_name: "Ahmed Ben Ali",
      reported_user: "Mohamed Karray",
      content: "Comportement inapproprié lors de la négociation",
      created_at: "2024-01-15 10:30:00",
      priority: "high"
    },
    {
      id: "2",
      type: "spam",
      status: "resolved",
      reporter_name: "Fatma Trabelsi",
      reported_user: "User123",
      content: "Spam dans les messages",
      created_at: "2024-01-14 15:20:00",
      priority: "medium"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'investigating':
        return <Badge className="bg-orange-500">En cours</Badge>;
      case 'resolved':
        return <Badge className="bg-green-500">Résolu</Badge>;
      case 'dismissed':
        return <Badge variant="outline">Rejeté</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'spam':
        return <Badge variant="destructive">Spam</Badge>;
      case 'inappropriate_behavior':
        return <Badge className="bg-orange-500">Comportement</Badge>;
      case 'fraud':
        return <Badge variant="destructive">Fraude</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.reporter_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.reported_user.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || report.status === statusFilter;
    const matchesType = typeFilter === 'all' || report.type === typeFilter;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Signalements et Modération
          </CardTitle>
          <CardDescription>
            Gestion des signalements et actions de modération
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par utilisateur..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de signalement" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les types</SelectItem>
                <SelectItem value="spam">Spam</SelectItem>
                <SelectItem value="inappropriate_behavior">Comportement</SelectItem>
                <SelectItem value="fraud">Fraude</SelectItem>
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrer par statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les statuts</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="investigating">En cours</SelectItem>
                <SelectItem value="resolved">Résolu</SelectItem>
                <SelectItem value="dismissed">Rejeté</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Signalé par</TableHead>
                  <TableHead>Utilisateur signalé</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Contenu</TableHead>
                  <TableHead>Date</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredReports.map((report) => (
                  <TableRow key={report.id}>
                    <TableCell>{report.reporter_name}</TableCell>
                    <TableCell>{report.reported_user}</TableCell>
                    <TableCell>
                      {getTypeBadge(report.type)}
                    </TableCell>
                    <TableCell>
                      <div className="max-w-[200px] truncate">
                        {report.content}
                      </div>
                    </TableCell>
                    <TableCell>
                      {new Date(report.created_at).toLocaleDateString('fr-FR')}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(report.status)}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <CheckCircle className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <XCircle className="h-4 w-4" />
                        </Button>
                      </div>
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

export default ReportsModeration;
