
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Users, 
  FileText, 
  MessageSquare, 
  CreditCard, 
  Shield, 
  BarChart3,
  AlertTriangle,
  Settings
} from "lucide-react";
import AdminDashboard from "@/components/admin/AdminDashboard";
import UserManagement from "@/components/admin/UserManagement";
import JobManagement from "@/components/admin/JobManagement";
import PaymentManagement from "@/components/admin/PaymentManagement";
import ReportsModeration from "@/components/admin/ReportsModeration";
import LoginHistory from "@/components/admin/LoginHistory";
import InteractionMonitoring from "@/components/admin/InteractionMonitoring";
import SocialBenefitsManagement from "@/components/admin/SocialBenefitsManagement";

const Admin = () => {
  const [activeTab, setActiveTab] = useState("dashboard");

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Administration Zeytna
          </h1>
          <p className="text-gray-600">
            Interface de gestion et de contrôle de la plateforme
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid grid-cols-4 lg:grid-cols-8 w-full">
            <TabsTrigger value="dashboard" className="flex items-center gap-2">
              <BarChart3 className="h-4 w-4" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Utilisateurs
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Annonces
            </TabsTrigger>
            <TabsTrigger value="interactions" className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4" />
              Interactions
            </TabsTrigger>
            <TabsTrigger value="payments" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              Paiements
            </TabsTrigger>
            <TabsTrigger value="social" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              CNSS/Care
            </TabsTrigger>
            <TabsTrigger value="reports" className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Signalements
            </TabsTrigger>
            <TabsTrigger value="logs" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Connexions
            </TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard">
            <AdminDashboard />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="jobs">
            <JobManagement />
          </TabsContent>

          <TabsContent value="interactions">
            <InteractionMonitoring />
          </TabsContent>

          <TabsContent value="payments">
            <PaymentManagement />
          </TabsContent>

          <TabsContent value="social">
            <SocialBenefitsManagement />
          </TabsContent>

          <TabsContent value="reports">
            <ReportsModeration />
          </TabsContent>

          <TabsContent value="logs">
            <LoginHistory />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Admin;
