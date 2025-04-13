
import { useState } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ArrowUpRight, ArrowDownRight, Download, Wallet, CircleDollarSign, Calendar } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line as RechartsLine } from "recharts";

interface FinancialData {
  balance: number;
  pendingEscrow: number;
  totalEarnings: number;
  totalSpendings: number;
  currency: string;
  transactions: {
    date: string;
    amount: number;
    type: "payment" | "withdrawal" | "refund" | "escrow";
    description: string;
  }[];
  monthlyData: {
    month: string;
    earnings: number;
    spendings: number;
  }[];
  paymentMethodsData: {
    name: string;
    value: number;
  }[];
}

interface FinancialDashboardProps {
  data?: FinancialData;
}

const FinancialDashboard = ({ data }: FinancialDashboardProps) => {
  const [timeRange, setTimeRange] = useState<"7days" | "30days" | "3months" | "year">("30days");
  
  // Mock data if none provided
  const mockData: FinancialData = {
    balance: 1250.75,
    pendingEscrow: 600,
    totalEarnings: 3450,
    totalSpendings: 2199.25,
    currency: "TND",
    transactions: [
      { date: "2023-10-15", amount: 450, type: "payment", description: "Paiement reçu pour service de cueillette" },
      { date: "2023-10-12", amount: -200, type: "withdrawal", description: "Retrait vers compte bancaire" },
      { date: "2023-10-08", amount: 600, type: "escrow", description: "Dépôt de garantie - Oliveraie à Sfax" },
      { date: "2023-10-05", amount: 750, type: "payment", description: "Paiement reçu pour service de cueillette" },
      { date: "2023-10-01", amount: -100, type: "refund", description: "Remboursement partiel" },
    ],
    monthlyData: [
      { month: "Jun", earnings: 1200, spendings: 800 },
      { month: "Jul", earnings: 1800, spendings: 1200 },
      { month: "Aug", earnings: 1400, spendings: 1100 },
      { month: "Sep", earnings: 2200, spendings: 1500 },
      { month: "Oct", earnings: 1900, spendings: 1300 },
      { month: "Nov", earnings: 2400, spendings: 1700 },
    ],
    paymentMethodsData: [
      { name: "Carte bancaire", value: 65 },
      { name: "Virement", value: 15 },
      { name: "Mobile Money", value: 10 },
      { name: "Espèces", value: 10 },
    ],
  };

  const financialData = data || mockData;
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  
  const exportFinancialData = () => {
    alert("Exportation des données financières en cours...");
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Tableau de bord financier</h2>
        <Button variant="outline" onClick={exportFinancialData}>
          <Download className="h-4 w-4 mr-2" />
          Exporter
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Solde actuel</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{financialData.balance} {financialData.currency}</div>
            <p className="text-xs text-muted-foreground">
              +{financialData.pendingEscrow} {financialData.currency} en attente
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Gains totaux</CardTitle>
            <ArrowUpRight className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{financialData.totalEarnings} {financialData.currency}</div>
            <p className="text-xs text-muted-foreground">Depuis la création du compte</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Dépenses totales</CardTitle>
            <ArrowDownRight className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-500">{financialData.totalSpendings} {financialData.currency}</div>
            <p className="text-xs text-muted-foreground">Depuis la création du compte</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Frais de plateforme</CardTitle>
            <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">5-15%</div>
            <p className="text-xs text-muted-foreground">Selon type de transaction</p>
          </CardContent>
        </Card>
      </div>
      
      <Tabs defaultValue="overview">
        <TabsList className="mb-4">
          <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          <TabsTrigger value="history">Historique</TabsTrigger>
          <TabsTrigger value="analytics">Analytique</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Activité récente</CardTitle>
                <CardDescription>Vos dernières transactions</CardDescription>
                <div className="flex space-x-2 mt-2">
                  <Button variant="outline" size="sm" onClick={() => setTimeRange("7days")}>7j</Button>
                  <Button variant={timeRange === "30days" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("30days")}>30j</Button>
                  <Button variant="outline" size="sm" onClick={() => setTimeRange("3months")}>3m</Button>
                  <Button variant="outline" size="sm" onClick={() => setTimeRange("year")}>1an</Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Montant</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financialData.transactions.map((transaction, index) => (
                      <TableRow key={index}>
                        <TableCell>{transaction.date}</TableCell>
                        <TableCell className="max-w-[200px] truncate">{transaction.description}</TableCell>
                        <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                          {transaction.amount > 0 ? '+' : ''}{transaction.amount} {financialData.currency}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
              <CardFooter className="flex justify-center">
                <Button variant="outline" size="sm">Voir tout l'historique</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Aperçu mensuel</CardTitle>
                <CardDescription>Vos gains et dépenses sur les 6 derniers mois</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={financialData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `${value} ${financialData.currency}`} />
                    <Legend />
                    <Bar dataKey="earnings" name="Gains" fill="#10b981" />
                    <Bar dataKey="spendings" name="Dépenses" fill="#ef4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle>Historique complet des transactions</CardTitle>
              <CardDescription>Toutes vos transactions triées par date</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Description</TableHead>
                    <TableHead className="text-right">Montant</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {[...financialData.transactions, ...financialData.transactions].map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.date}</TableCell>
                      <TableCell>
                        {transaction.type === "payment" && "Paiement"}
                        {transaction.type === "withdrawal" && "Retrait"}
                        {transaction.type === "refund" && "Remboursement"}
                        {transaction.type === "escrow" && "Dépôt fiduciaire"}
                      </TableCell>
                      <TableCell className="max-w-[300px] truncate">{transaction.description}</TableCell>
                      <TableCell className={`text-right ${transaction.amount < 0 ? 'text-red-500' : 'text-green-500'}`}>
                        {transaction.amount > 0 ? '+' : ''}{transaction.amount} {financialData.currency}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button variant="outline" size="sm">Page précédente</Button>
              <div className="text-sm text-gray-500">Page 1 sur 5</div>
              <Button variant="outline" size="sm">Page suivante</Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="analytics">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Méthodes de paiement</CardTitle>
                <CardDescription>Répartition des méthodes de paiement utilisées</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={financialData.paymentMethodsData}
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({name, percent}) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {financialData.paymentMethodsData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <RechartsTooltip formatter={(value) => `${value}%`} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Tendances financières</CardTitle>
                <CardDescription>Suivi de vos transactions dans le temps</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={financialData.monthlyData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <RechartsTooltip formatter={(value) => `${value} ${financialData.currency}`} />
                    <Legend />
                    <CartesianGrid stroke="#eee" strokeDasharray="5 5" />
                    <RechartsLine type="monotone" dataKey="earnings" name="Gains" stroke="#10b981" />
                    <RechartsLine type="monotone" dataKey="spendings" name="Dépenses" stroke="#ef4444" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FinancialDashboard;
