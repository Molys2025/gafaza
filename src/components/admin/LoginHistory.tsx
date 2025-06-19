
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Calendar, MapPin } from "lucide-react";
import { useState } from "react";

const LoginHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  // Mock data - À remplacer par de vraies données de l'API
  const loginHistory = [
    {
      id: "1",
      user_name: "Ahmed Ben Ali",
      user_email: "ahmed@example.com",
      login_time: "2024-01-15 14:30:25",
      ip_address: "192.168.1.1",
      location: "Tunis, Tunisie",
      device: "Chrome - Windows",
      status: "success"
    },
    {
      id: "2",
      user_name: "Fatma Trabelsi",
      user_email: "fatma@example.com",
      login_time: "2024-01-15 13:15:10",
      ip_address: "192.168.1.2",
      location: "Sfax, Tunisie",
      device: "Safari - iPhone",
      status: "success"
    },
    {
      id: "3",
      user_name: "Mohamed Karray",
      user_email: "mohamed@example.com",
      login_time: "2024-01-15 12:00:00",
      ip_address: "192.168.1.3",
      location: "Sousse, Tunisie",
      device: "Firefox - Linux",
      status: "failed"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-500">Réussi</Badge>;
      case 'failed':
        return <Badge variant="destructive">Échec</Badge>;
      case 'suspicious':
        return <Badge className="bg-orange-500">Suspect</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredHistory = loginHistory.filter(entry => {
    const matchesSearch = entry.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.ip_address.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || entry.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Historique des Connexions
          </CardTitle>
          <CardDescription>
            Suivi des connexions et détection d'activités suspectes
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filtres */}
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par nom, email, IP..."
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
                <SelectItem value="success">Réussi</SelectItem>
                <SelectItem value="failed">Échec</SelectItem>
                <SelectItem value="suspicious">Suspect</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Utilisateur</TableHead>
                  <TableHead>Date/Heure</TableHead>
                  <TableHead>Adresse IP</TableHead>
                  <TableHead>Localisation</TableHead>
                  <TableHead>Appareil</TableHead>
                  <TableHead>Statut</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredHistory.map((entry) => (
                  <TableRow key={entry.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{entry.user_name}</div>
                        <div className="text-sm text-muted-foreground">{entry.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>{entry.login_time}</TableCell>
                    <TableCell className="font-mono text-sm">{entry.ip_address}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        {entry.location}
                      </div>
                    </TableCell>
                    <TableCell>{entry.device}</TableCell>
                    <TableCell>{getStatusBadge(entry.status)}</TableCell>
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

export default LoginHistory;
