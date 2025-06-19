
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Heart, FileText, Search, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

const SocialBenefitsManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [benefitFilter, setBenefitFilter] = useState("all");

  // Mock data - À remplacer par de vraies données de l'API
  const socialBenefits = [
    {
      id: "1",
      user_name: "Ahmed Ben Ali",
      user_email: "ahmed@example.com",
      benefit_type: "cnss",
      status: "active",
      subscription_date: "2024-01-01",
      last_payment: "2024-01-15",
      monthly_amount: 45.50,
      coverage_details: "Assurance maladie + accidents du travail"
    },
    {
      id: "2",
      user_name: "Fatma Trabelsi",
      user_email: "fatma@example.com",
      benefit_type: "zeytna_care",
      status: "pending",
      subscription_date: "2024-01-10",
      last_payment: null,
      monthly_amount: 25.00,
      coverage_details: "Assurance santé complémentaire"
    },
    {
      id: "3",
      user_name: "Mohamed Karray",
      user_email: "mohamed@example.com",
      benefit_type: "cnss",
      status: "suspended",
      subscription_date: "2023-12-01",
      last_payment: "2023-12-15",
      monthly_amount: 45.50,
      coverage_details: "Cotisations en retard"
    }
  ];

  const getBenefitBadge = (type: string) => {
    switch (type) {
      case 'cnss':
        return <Badge className="bg-blue-500">CNSS</Badge>;
      case 'zeytna_care':
        return <Badge className="bg-purple-500">Zeytna Care</Badge>;
      default:
        return <Badge variant="outline">{type}</Badge>;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Actif</Badge>;
      case 'pending':
        return <Badge variant="secondary">En attente</Badge>;
      case 'suspended':
        return <Badge variant="destructive">Suspendu</Badge>;
      case 'expired':
        return <Badge className="bg-orange-500">Expiré</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredBenefits = socialBenefits.filter(benefit => {
    const matchesSearch = benefit.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         benefit.user_email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || benefit.status === statusFilter;
    const matchesBenefit = benefitFilter === 'all' || benefit.benefit_type === benefitFilter;
    
    return matchesSearch && matchesStatus && matchesBenefit;
  });

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Gestion CNSS & Zeytna Care
          </CardTitle>
          <CardDescription>
            Suivi des cotisations et prestations sociales des cueilleurs
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Statistiques */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">CNSS Actives</span>
                </div>
                <div className="text-2xl font-bold mt-2">156</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Heart className="h-4 w-4 text-purple-500" />
                  <span className="text-sm font-medium">Zeytna Care</span>
                </div>
                <div className="text-2xl font-bold mt-2">89</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span className="text-sm font-medium">À jour</span>
                </div>
                <div className="text-2xl font-bold mt-2">201</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <XCircle className="h-4 w-4 text-red-500" />
                  <span className="text-sm font-medium">En retard</span>
                </div>
                <div className="text-2xl font-bold mt-2">12</div>
              </CardContent>
            </Card>
          </div>

          {/* Filtres */}
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
            <Select value={benefitFilter} onValueChange={setBenefitFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Type de prestation" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les prestations</SelectItem>
                <SelectItem value="cnss">CNSS</SelectItem>
                <SelectItem value="zeytna_care">Zeytna Care</SelectItem>
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
                <SelectItem value="expired">Expiré</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Tableau */}
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cueilleur</TableHead>
                  <TableHead>Prestation</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Montant mensuel</TableHead>
                  <TableHead>Dernier paiement</TableHead>
                  <TableHead>Couverture</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredBenefits.map((benefit) => (
                  <TableRow key={benefit.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium">{benefit.user_name}</div>
                        <div className="text-sm text-muted-foreground">{benefit.user_email}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {getBenefitBadge(benefit.benefit_type)}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(benefit.status)}
                    </TableCell>
                    <TableCell>
                      <div className="font-medium">{benefit.monthly_amount} TND</div>
                    </TableCell>
                    <TableCell>
                      {benefit.last_payment ? 
                        new Date(benefit.last_payment).toLocaleDateString('fr-FR') : 
                        'Aucun paiement'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="text-sm max-w-[200px]">
                        {benefit.coverage_details}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm">
                          <FileText className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          Modifier
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

export default SocialBenefitsManagement;
